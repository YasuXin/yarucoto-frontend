<script setup lang="ts">
import type {AdminInquiry} from "~/interfaces";

definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | Inquiry"
})

const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const currentPage = ref<number>(Number(useRoute().query.page ?? 1))

const getInquiriesUrl = baseUrl + '/admin/inquiries/get'
const deleteInquiryUrl = baseUrl + '/admin/inquiries/delete'

const query = useRoute().query

const startId = ref<number>(Number(query.startId ?? 0))
const endId = ref<number>(Number(query.endId ?? 0))
const columnKeyword = ref<string>(<string>query.columnKeyword ?? 'text')
const keyword = ref<string>(<string>query.keyword ?? '')
const columnOrder = ref<string>(<string>query.columnOrder ?? 'updatedAt')
const order = ref<string>(<string>query.order ?? 'DESC')
const createdStart = ref<string>(<string>query.createdStart ?? '')
const createdEnd = ref<string>(<string>query.createdEnd ?? '')
const updatedStart = ref<string>(<string>query.updatedStart ?? '')
const updatedEnd = ref<string>(<string>query.updatedEnd ?? '')

const totalPages = ref(0)
const isPagination = ref(true)

const movePaginationEvent = (page: number) => {
  getInquiries(page)
  navigateTo({path: '/admin/inquiries/list/', query: {
      page: page,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      createdStart: createdStart.value ?? null,
      createdEnd: createdEnd.value ?? null,
      updatedStart: updatedStart.value ?? null,
      updatedEnd: updatedEnd.value ?? null
    }})
  window.scrollTo(0, 0)
}
const moveLastPaginationEvent = () => {
  getInquiries(totalPages.value)
  navigateTo({path: '/admin/inquiries/list/', query: {
      page: totalPages.value,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      createdStart: createdStart.value ?? null,
      createdEnd: createdEnd.value ?? null,
      updatedStart: updatedStart.value ?? null,
      updatedEnd: updatedEnd.value ?? null
    }})
  window.scrollTo(0, 0)
}
const moveFirstPaginationEvent = () => {
  getInquiries(1)
  navigateTo({path: '/admin/inquiries/list/', query: {
      page: 1,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      createdStart: createdStart.value ?? null,
      createdEnd: createdEnd.value ?? null,
      updatedStart: updatedStart.value ?? null,
      updatedEnd: updatedEnd.value ?? null
    }})
  window.scrollTo(0, 0)
}

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const deleteResult = ref('')
const deleteInquiry = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params: { id: number } = {id: Number(selectedInquiry?.value?.id) ?? 0}
  try {
    const res = await $fetch(deleteInquiryUrl, {
      method: 'DELETE',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: deleteInquiryUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = "お問合せを削除しました"
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else if (deleteResult.value === 'no-inquiry') {
      modalMessage.value = "指定したお問合せが見つかりませんでした"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else {
      modalMessage.value = "予期せぬエラーが発生しました"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}

const inquiries = ref<AdminInquiry[]>([])

const getInquiries = async (page: number) => {
  const params = {
    page: page,
    columnKeyword: columnKeyword.value ?? null,
    keyword: keyword.value ?? null,
    startId: startId.value ?? null,
    endId: endId.value ?? null,
    columnOrder: columnOrder.value ?? null,
    order: order.value ?? null,
    createdStart: createdStart.value ?? null,
    createdEnd: createdEnd.value ?? null,
    updatedStart: updatedStart.value ?? null,
    updatedEnd: updatedEnd.value ?? null
  }
  try {
    const res = await $fetch(getInquiriesUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      query: params,
      key: getInquiriesUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    inquiries.value = res.inquiries
    totalPages.value = res.totalPages
    currentPage.value = page
  } catch (error) {
    useErrorEvent(error)
  }
}
const isSearchShow = ref(false)
const showSearchEvent = () => {
  isSearchShow.value = !isSearchShow.value
}

interface SearchParams {
  page: number,
  columnKeyword: string,
  keyword: string,
  startId: number,
  endId: number,
  columnOrder: string,
  order: string,
  createdStart: string,
  createdEnd: string,
  updatedStart: string,
  updatedEnd: string
}
const onSearch = async (params: SearchParams) => {
  columnKeyword.value = params.columnKeyword
  keyword.value = params.keyword
  startId.value = params.startId
  endId.value = params.endId
  createdStart.value = params.createdStart
  createdEnd.value = params.createdEnd
  columnOrder.value = params.columnOrder
  order.value = params.order
  currentPage.value = params.page ?? 1
  await getInquiries(currentPage.value)
  navigateTo({path: '/admin/inquiries/list/', query: params as any})
  window.scrollTo(0, 0)
}

const selectedInquiry = ref<AdminInquiry | null>()
const isInquiryModalShow = ref(false)
const showInquiryModal = (inquiryId: number) => {
  for (const inquiry of inquiries.value) {
    if (inquiry.id === inquiryId) {
      selectedInquiry.value = inquiry
      break
    }
  }
  isInquiryModalShow.value = true
  isDeleteModalShow.value = false
}

const isDeleteModalShow = ref(false)
const showDeleteModal = () => {
  isDeleteModalShow.value = true
  isInquiryModalShow.value = false
}
const onDelete = async () => {
  isDeleteModalShow.value = false
  isInquiryModalShow.value = false
  await deleteInquiry()
}
const returnEvent = () => {
  isDeleteModalShow.value = false
  isInquiryModalShow.value = false
}

await getInquiries(currentPage.value)
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>お問い合わせ一覧</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
    </div>
    <AdminPagination
        :isPagination="isPagination"
        :paginationCurrentNum="currentPage"
        :paginationTotalNum="totalPages"
        @move="movePaginationEvent"
        @moveLast="moveLastPaginationEvent"
        @moveFirst="moveFirstPaginationEvent"
    ></AdminPagination>

    <div id="inquiry-parent">
      <div id="inquiry" class="mt-4 mb-5">
        <div id="inquiry-title" class="_inquiry_container">
          <div class="_inquiry_box">
            <div id="inquiry-row-title" class="d-flex justify-content-between">
              <div class="_inquiry_inner_row d-flex">
                <div class="_inquiry_id_title">
                  <div>ID</div>
                </div>
                <div class="_inquiry_name_title d-flex justify-content-center">
                  <div>名前</div>
                </div>
                <div class="_inquiry_email_title d-flex justify-content-center">
                  メール
                </div>
                <div class="_inquiry_created_title d-flex justify-content-center">
                  作成日
                </div>
                <div class="_inquiry_updated_title d-flex justify-content-center">
                  更新日
                </div>
              </div>
              <div class="d-flex">
                <div id="link-title" class="_show_btn_parent">リンク</div>
              </div>
            </div>
          </div>
        </div>
        <AdminInquiriesInquiry v-for="inquiry in inquiries" :inquiry="inquiry" :key="inquiry.id" @show="showInquiryModal"></AdminInquiriesInquiry>
      </div>
    </div>
  </div>
  <AdminPagination
      :isPagination="isPagination"
      :paginationCurrentNum="currentPage"
      :paginationTotalNum="totalPages"
      @move="movePaginationEvent"
      @moveLast="moveLastPaginationEvent"
      @moveFirst="moveFirstPaginationEvent"
  ></AdminPagination>
  <AdminShowSearchAreaBox :show="isSearchShow" @showSearch="showSearchEvent"></AdminShowSearchAreaBox>
  <AdminInquiriesSearchContainer v-if="isSearchShow"
                                 @search="onSearch"
                                 :columnKeyword="columnKeyword"
                                 :keyword="keyword"
                                 :startId="startId"
                                 :endId="endId"
                                 :columnOrder="columnOrder"
                                 :order="order"
                                 :createdStart="createdStart"
                                 :createdEnd="createdEnd"
                                 :updatedStart="updatedStart"
                                 :updatedEnd="updatedEnd"
  ></AdminInquiriesSearchContainer>
  <teleport to="body">
    <AdminInquiriesInquiryModal v-if="isInquiryModalShow" :inquiry="selectedInquiry" @delete="showDeleteModal" @return="returnEvent"></AdminInquiriesInquiryModal>
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
    <DeleteModal v-if="isDeleteModalShow" @delete="onDelete" @return="returnEvent" title="削除します" message="削除すると元に戻せませんがよろしいですか？"></DeleteModal>
  </teleport>
  <teleport to="body">

  </teleport>
</template>

<style scoped>
#inquiry-parent {
  padding:0 100px;
}
._inquiry_container {
  width: 100%;
}
._inquiry_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._inquiry_id_title {
  width: 100px;
  padding-left: 30px;
}
._inquiry_name_title {
  width: calc(100% - 500px);
}
._inquiry_email_title {
  width: 200px;
}
._inquiry_created_title {
  width: 100px;
}
._inquiry_updated_title {
  width: 100px;
}
#link-title {
  border: none;
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
#inquiry-row-title {
  background-color: var(--bg-color);
  font-weight: bold;
  border: var(--thick-border);
  border-radius: 10px;
  padding: 10px 18px;
}
#inquiry-title ._inquiry_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
#inquiry-title ._inquiry_inner_row {
  width: calc(100% - 60px);
}
@media (max-width: 1400px) {
  #inquiry-parent {
    padding: 0 20px;
  }
}
@media (max-width: 1080px) {
  #inquiry-name ._inquiry_inner_row {
    width: calc(100% - 80px);
  }
}
@media (max-width: 960px) {
  ._inquiry_id_title {
    width: 100px;
    padding-left: 15px;
  }
  ._inquiry_name_title {
    width: calc(100% - 300px);
  }
  ._inquiry_email_title {
    display: none !important;
  }
}
@media (max-width: 767.5px) {
  #inquiry-parent {
    width : 100%;
    padding: 0 10px;
  }
  ._inquiry_name_title {
    width: calc(100% - 100px);
  }
  ._inquiry_created_title, ._inquiry_updated_title {
    display: none !important;
  }
  ._inquiry_id_title {
    width: 80px;
  }
}
@media (max-width: 576px) {
  #inquiry-parent {
    width : 100%;
    padding: 0 10px;
  }
  #inquiry-row-title {
    padding: 10px 10px;
  }
  ._inquiry_id_title {
    width: 60px;
  }
}
</style>
