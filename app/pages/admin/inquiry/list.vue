<script setup lang="ts">
import type {Inquiry} from "~/interfaces";

definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | Inquiry | List"
})

const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getInquiriesUrl = baseUrl + '/inquiries/get/list'
const deleteInquiryUrl = baseUrl + '/inquiries/delete'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const isDeleteModalShow = ref(false)
const selectedDeleteId = ref<number>(0)
const showDeleteModalEvent = (id: number): void => {
  isDeleteModalShow.value = true
  selectedDeleteId.value = id ?? 0
}
const returnEvent = (): void => {
  isDeleteModalShow.value = false
  selectedDeleteId.value = 0
}

const deleteResult = ref('')
const deleteEvent = async () => {
  isDeleteModalShow.value = false
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const params: {
      id: number
    } = {
      id: selectedDeleteId.value ?? 0
    }
    const res = await $fetch(deleteInquiryUrl, {
      method: 'DELETE',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: deleteInquiryUrl + '/' + params.id
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = '削除しました'
      await getInquiries()
      setTimeout(() => {
        modalShow.value = false
      }, 1000)
    } else {
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

const allInquiries = ref<Inquiry[]>([])
const inquiries = ref<Inquiry[]>([])

const pageCount = ref(10)
const paginationCurrentNum = ref(1)
const paginationTotalNum = computed(() => Math.ceil(allInquiries.value.length / pageCount.value))
const isPagination = ref(false)
const moveFirstPaginationEvent = (): void => {
  paginationCurrentNum.value = 1
  setPaginationEvent(paginationCurrentNum.value)
}
const moveLastPaginationEvent = (): void => {
  paginationCurrentNum.value = paginationTotalNum.value
  setPaginationEvent(paginationCurrentNum.value)
}
const movePaginationEvent = (e: Event): void => {
  const t = e.target as HTMLElement
  const num = Number(t.dataset.num)
  if (num) {
    paginationCurrentNum.value = num
    setPaginationEvent(paginationCurrentNum.value)
  }
}
const getInquiries = async () => {
  try {
    const res = await $fetch(getInquiriesUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: getInquiriesUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    allInquiries.value = res
  } catch (error) {
    useErrorEvent(error)
  }
}

const setPaginationEvent = (pageNum: number = 1): void => {
  if (allInquiries.value && allInquiries.value?.length > pageCount.value) {
    isPagination.value = true
  } else if (allInquiries.value && allInquiries.value?.length <= pageCount.value) {
    isPagination.value = false
  }

  paginationCurrentNum.value = pageNum ?? 1

  inquiries.value = []
  if (allInquiries.value === undefined || allInquiries.value === null) return
  const start = (paginationCurrentNum.value - 1) * pageCount.value
  const end = start + pageCount.value
  for (let i = start; i < end; i++) {
    if (allInquiries.value[i] === undefined || allInquiries.value[i] === null) continue
    const inquiry = allInquiries.value[i] as Inquiry
    inquiries.value.push(inquiry)
  }
}

const afterLoad = ref(false)
onMounted(async () => {
  await getInquiries()
  setPaginationEvent()
  afterLoad.value = true
})
</script>

<template>
  <div v-show="afterLoad" id="main-child"
       class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>送信したお問い合わせ一覧</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/inquiry/form" class="_normal_link mb-3">お問い合わせフォーム</NuxtLink>
    </div>
    <AdminPagination
        :isPagination="isPagination"
        :paginationCurrentNum="paginationCurrentNum"
        :paginationTotalNum="paginationTotalNum"
        @move="movePaginationEvent"
        @moveLast="moveLastPaginationEvent"
        @moveFirst="moveFirstPaginationEvent"
    ></AdminPagination>
    <transition-group name="list" appear tag="div" id="inquiries">
      <InquiriesNoInquiry v-if="inquiries.length === 0"></InquiriesNoInquiry>
      <AdminInquiry v-else @delete="showDeleteModalEvent" v-for="inquiry in inquiries" :inquiry="inquiry" :key="inquiry.id"></AdminInquiry>
    </transition-group>
    <AdminPagination
        :isPagination="isPagination"
        :paginationCurrentNum="paginationCurrentNum"
        :paginationTotalNum="paginationTotalNum"
        @move="movePaginationEvent"
        @moveLast="moveLastPaginationEvent"
        @moveFirst="moveFirstPaginationEvent"
    ></AdminPagination>
  </div>
  <Loading v-if="!afterLoad"></Loading>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
  <teleport to="body">
    <DeleteModal v-if="isDeleteModalShow" @delete="deleteEvent" @return="returnEvent" title="削除します" message="削除すると元に戻せませんがよろしいですか？"></DeleteModal>
  </teleport>
</template>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.list-leave-from {
  opacity: 0;
}
.list-move {
  transition: transform 0.5s;
}
.list-leave-active {
  position: absolute;
}
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#inquiries {
  width: 100%;
  padding: 0 20px 20px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
}

@media (max-width: 1280px) {
  #inquiries {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 960px) {
  #inquiries {
    grid-template-columns: 1fr;
  }
}
</style>
