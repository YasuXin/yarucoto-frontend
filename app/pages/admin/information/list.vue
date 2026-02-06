<script setup lang="ts">
import type {Information} from "~/interfaces";

definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | Information"
})

const token = useCookie('__yarucoto')

const stateInformation = useState('informationArr')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const currentPage = ref<number>(Number(useRoute().query.page ?? 1))

const getInformationUrl = baseUrl + '/admin/information/get'
const postBrowseInformationUrl = baseUrl + '/information/post/browse'

const query = useRoute().query

const startId = ref<number>(Number(query.startId ?? 0))
const endId = ref<number>(Number(query.endId ?? 0))
const columnKeyword = ref<string>(<string>query.columnKeyword ?? 'title')
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
  getInformationArr(page)
  navigateTo({path: '/admin/information/list/', query: {
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
  getInformationArr(totalPages.value)
  navigateTo({path: '/admin/information/list/', query: {
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
  getInformationArr(1)
  navigateTo({path: '/admin/information/list/', query: {
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

const informationArr = ref<Information[]>([])

const getInformationArr = async (page: number) => {
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
    const res = await $fetch(getInformationUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      query: params,
      key: getInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    informationArr.value = res.informationArr
    stateInformation.value = informationArr.value
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
  await getInformationArr(currentPage.value)
  navigateTo({path: '/admin/information/list/', query: params as any})
  window.scrollTo(0, 0)
}

const selectedInformation = ref<Information | null>()

const setSelectedInformation = async (id: number, newInformation: boolean) => {
  selectedInformation.value = informationArr.value.filter(i => i.id === id)[0] as Information
  if (newInformation) {
    await postBrowseInformation(id)
  }
}

const browseResult = ref('')
const postBrowseInformation = async (id: number) => {
  try {
    const params: { id: number } = {id: id}
    const res = await $fetch(postBrowseInformationUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      key: postBrowseInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    browseResult.value = res
    await getInformationArr(currentPage.value)
    if (browseResult.value === 'failed') {
      modalShow.value = true
      modalMessage.value = '送信に失敗しました'
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}

await getInformationArr(currentPage.value)
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>お知らせ一覧</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
    </div>
    <div class="d-flex justify-content-center mb-4">
      <NuxtLink to="/admin/information/register" class="btn _btn_primary">新規追加</NuxtLink>
    </div>
    <div id="information-parent">
      <AdminPagination
          :isPagination="isPagination"
          :paginationCurrentNum="currentPage"
          :paginationTotalNum="totalPages"
          @move="movePaginationEvent"
          @moveLast="moveLastPaginationEvent"
          @moveFirst="moveFirstPaginationEvent"
      ></AdminPagination>
      <transition-group appear name="list" tag="div" id="information">
        <AdminInformation v-for="information in informationArr" :key="information.id" :information="information"
                                 :selectedId="selectedInformation?.id" @show="setSelectedInformation"
        ></AdminInformation>
      </transition-group>
      <AdminPagination
          :isPagination="isPagination"
          :paginationCurrentNum="currentPage"
          :paginationTotalNum="totalPages"
          @move="movePaginationEvent"
          @moveLast="moveLastPaginationEvent"
          @moveFirst="moveFirstPaginationEvent"
      ></AdminPagination>
      <AdminShowSearchAreaBox :show="isSearchShow" @showSearch="showSearchEvent"></AdminShowSearchAreaBox>
      <AdminInformationSearchContainer v-if="isSearchShow"
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
      ></AdminInformationSearchContainer>
    </div>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(160px);
}
.list-leave-from, .list-enter-to {
  opacity: 1;
}
.list-move {
  transition: transform 0.5s;
}
.list-leave-active {
  position: absolute;
}
#information-parent {
  padding:0 300px;
}
#information {
  padding: 20px;
}
@media (max-width: 1280px) {
  #information-parent {
    padding:0 100px;
  }
}
@media (max-width: 768px) {
  #information-parent {
    width : 100%;
    padding: 0 10px;
  }
  #information {
    padding: 20px 10px;
  }
}
@media (max-width: 450px) {
  #information-parent {
    width : 100%;
    padding: 0 10px;
  }
}
</style>
