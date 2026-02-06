<script setup lang="ts">
import type {AdminEvaluation, AdminUser} from "~/interfaces";

definePageMeta({
  layout: "admin",
  middleware: "admin"
})

useHead({
  title: "Yarucoto | Admin | Users | Evaluations",
})

const token = useCookie('__yarucoto')
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const userId = useRoute().params.userId

const getUserAndEvaluationsUrl = baseUrl + '/admin/users/evaluations/get/' + userId
const deleteEvaluationUrl = baseUrl + '/admin/evaluations/delete'

const currentPage = ref<number>(Number(useRoute().query.page ?? 1))

const query = useRoute().query

const user = ref<AdminUser>()
const evaluations = ref<AdminEvaluation[]>([])
const startId = ref<number>(Number(query.startId ?? 0))
const endId = ref<number>(Number(query.endId ?? 0))
const keyword = ref<string>(<string>query.keyword ?? '')
const columnOrder = ref<string>(<string>query.columnOrder ?? 'id')
const order = ref<string>(<string>query.order ?? 'ASC')
const startYear = ref<number>(Number(query.startYear ?? 0))
const endYear = ref<number>(Number(query.endYear ?? 0))
const rate = ref<number>(Number(query.rate ?? 0))

const totalPages = ref(0)
const isPagination = ref(true)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const movePaginationEvent = (page: number) => {
  getUserAndEvaluations(page)
  navigateTo({path: '/admin/users/evaluations/' + userId, query: {
      page: page,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startYear: startYear.value ?? null,
      endYear: endYear.value ?? null,
      rate: rate.value ?? null,
    }
  })
  window.scrollTo(0, 0)
}
const moveLastPaginationEvent = () => {
  getUserAndEvaluations(totalPages.value)
  navigateTo({path: '/admin/users/evaluations/' + userId, query: {
      page: totalPages.value,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startYear: startYear.value ?? null,
      endYear: endYear.value ?? null,
      rate: rate.value ?? null,
    }
  })
  window.scrollTo(0, 0)
}
const moveFirstPaginationEvent = () => {
  getUserAndEvaluations(1)
  navigateTo({path: '/admin/users/evaluations/' + userId, query: {
      page: 1,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startYear: startYear.value ?? null,
      endYear: endYear.value ?? null,
      rate: rate.value ?? null,
    }
  })
  window.scrollTo(0, 0)
}

const returnShow = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + userId)
}

const getUserAndEvaluations = async (page: number) => {
  const params = {
    page: page,
    keyword: keyword.value ?? null,
    startId: startId.value ?? null,
    endId: endId.value ?? null,
    columnOrder: columnOrder.value ?? null,
    order: order.value ?? null,
    startYear: startYear.value ?? null,
    endYear: endYear.value ?? null,
    rate: rate.value ?? null,
  }
  try {
    const res = await $fetch(getUserAndEvaluationsUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      query: params,
      key: getUserAndEvaluationsUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    user.value = res.user
    evaluations.value = res.evaluations
    totalPages.value = res.totalPages
    currentPage.value = page
  } catch (error) {
    useErrorEvent(error)
  }
}

const deleteResult = ref('')
const deleteEvaluation = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params: {
    userId: number,
    evaluationId: number
  } = {
    userId: user?.value?.id ?? 0,
    evaluationId: Number(selectedEvaluation?.value?.id) ?? 0
  }
  try {
    const res = await $fetch(deleteEvaluationUrl, {
      method: 'DELETE',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteEvaluationUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = "評価を削除しました"
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else if (deleteResult.value === 'no-user') {
      modalMessage.value = "指定した会員が見つかりませんでした"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else if (deleteResult.value === 'no-task') {
      modalMessage.value = "指定した評価が見つかりませんでした"
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

const isSearchShow = ref(false)
const showSearchEvent = () => {
  isSearchShow.value = !isSearchShow.value
}

interface SearchParams {
  page: number,
  keyword: string,
  startId: number,
  endId: number,
  columnOrder: string,
  order: string,
  startYear: number,
  endYear: number,
  rate: number
}
const onSearch = async (params: SearchParams) => {
  keyword.value = params.keyword
  startId.value = params.startId
  endId.value = params.endId
  columnOrder.value = params.columnOrder
  order.value = params.order
  startYear.value = params.startYear
  endYear.value = params.endYear
  rate.value = Number(params.rate)
  await getUserAndEvaluations(currentPage.value)
  navigateTo({path: '/admin/users/evaluations/' + userId, query: params as any})
  window.scrollTo(0, 0)
}

const selectedEvaluation = ref<AdminEvaluation | null>()
const isEvaluationModalShow = ref(false)
const showEvaluationModal = (evaluationId: number) => {
  for (const evaluation of evaluations.value) {
    if (evaluation.id === evaluationId) {
      selectedEvaluation.value = evaluation
      break
    }
  }
  isEvaluationModalShow.value = true
  isDeleteModalShow.value = false
}

const isDeleteModalShow = ref(false)
const showDeleteModal = () => {
  isDeleteModalShow.value = true
  isEvaluationModalShow.value = false
}
const onDelete = async () => {
  isDeleteModalShow.value = false
  isEvaluationModalShow.value = false
  await deleteEvaluation()
}
const returnEvent = () => {
  isDeleteModalShow.value = false
  isEvaluationModalShow.value = false
}

await getUserAndEvaluations(currentPage.value)
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>{{user?.username}} の評価一覧</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/users/list?page=1" class="_normal_link mb-3">会員一覧</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink @click="returnShow" class="_normal_link mb-3">会員情報</NuxtLink>
    </div>
    <AdminPagination
        :isPagination="isPagination"
        :paginationCurrentNum="currentPage"
        :paginationTotalNum="totalPages"
        @move="movePaginationEvent"
        @moveLast="moveLastPaginationEvent"
        @moveFirst="moveFirstPaginationEvent"></AdminPagination>
    <div id="evaluation-parent">
      <div id="evaluations" class="mt-4 mb-5">
        <div id="evaluations-title" class="_evaluation_container">
          <div class="_evaluation_box">
            <div id="evaluation-row-title" class="d-flex">
              <div class="_evaluation_inner_row d-flex justify-content-between">
                <div class="_evaluation_title_left d-flex">
                  <div class="_evaluation_id_title">
                    <div>ID</div>
                  </div>
                  <div class="_evaluation_rate_title d-flex justify-content-center">
                    <div>5段階評価</div>
                  </div>
                </div>
                <div class="_evaluation_title_right d-flex">
                  <div class="_evaluation_year_title d-flex justify-content-center">
                    <div>年</div>
                  </div>
                  <div class="_evaluation_month_title d-flex justify-content-center">
                    <div>月</div>
                  </div>
                </div>
              </div>
              <div class="d-flex">
                <div id="link-title" class="_show_btn_parent">リンク</div>
              </div>
            </div>
          </div>
        </div>
        <AdminUsersEvaluation v-for="evaluation in evaluations" :key="evaluation.id" :evaluation="evaluation" @show="showEvaluationModal"></AdminUsersEvaluation>
      </div>
    </div>
  </div>
  <AdminPagination
      :isPagination="isPagination"
      :paginationCurrentNum="currentPage"
      :paginationTotalNum="totalPages"
      @move="movePaginationEvent"
      @moveLast="moveLastPaginationEvent"
      @moveFirst="moveFirstPaginationEvent"></AdminPagination>
  <AdminShowSearchAreaBox :show="isSearchShow" @showSearch="showSearchEvent"></AdminShowSearchAreaBox>
  <AdminUsersEvaluationsSearchContainer v-if="isSearchShow"
                                        :keyword="keyword"
                                        :columnOrder="columnOrder"
                                        :order="order"
                                        :startId="startId"
                                        :endId="endId"
                                        :startYear="startYear"
                                        :endYear="endYear"
                                        :rate="rate"
                                        @onSearch="onSearch"
  ></AdminUsersEvaluationsSearchContainer>
  <teleport to="body">
    <AdminEvaluationsEvaluationModal v-if="isEvaluationModalShow" :evaluation="selectedEvaluation" :user="user" @delete="showDeleteModal" @return="returnEvent"></AdminEvaluationsEvaluationModal>
    <DeleteModal v-if="isDeleteModalShow" title="本当に削除しますか？" message="削除した場合、二度と戻せません" @delete="onDelete" @return="returnEvent"></DeleteModal>
    <Modal :modalShow="modalShow" :message="modalMessage"></Modal>
  </teleport>
</template>

<style scoped>
#evaluation-parent {
  padding:0 100px;
}
._evaluation_container {
  width: 100%;
}
._evaluation_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._evaluation_id_title {
  width: 100px;
  padding-left: 30px;
}
._evaluation_year_title {
  width: 100px;
}
._evaluation_month_title {
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
#evaluation-row-title {
  background-color: var(--bg-color);
  font-weight: bold;
  border: var(--thick-border);
  border-radius: 10px;
  padding: 10px 18px;
}
#evaluations-title ._evaluation_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
#evaluations-title ._evaluation_inner_row {
  width: calc(100% - 60px);
}
._evaluation_title_left {
  width: 200px;
}
._evaluation_title_right {
  width: 200px;
}
._evaluation_rate_title {
  width: 100px;
}
@media (max-width: 1400px) {
  #evaluation-parent {
    padding: 0 20px;
  }
}
@media (max-width: 1080px) {
  #evaluations-name ._evaluation_inner_row {
    width: calc(100% - 80px);
  }
}
@media (max-width: 960px) {
  ._evaluation_id_title {
    width: 80px;
    padding-left: 15px;
  }
}
@media (max-width: 768px) {
  ._evaluation_title_right {
    width: 160px;
  }
  #evaluation-parent {
    width : 100%;
    padding: 0 10px;
  }
  ._evaluation_id_title {
    width: 80px;
  }
  ._evaluation_year_title {
    width: 80px;
  }
  ._evaluation_month_title {
    width: 80px;
  }
}
@media (max-width: 576px) {
  #evaluation-parent {
    width : 100%;
    padding: 0 10px;
  }
  ._evaluation_rate_title {
    width: 80px;
  }
  ._evaluation_title_left {
    width: 140px;
  }
  ._evaluation_title_right {
    width: 100px;
  }
  ._evaluation_year_title {
    width: 60px;
  }
  ._evaluation_month_title {
    width: 40px;
  }
  #evaluation-row-title {
    padding: 10px 5px;
  }
  ._evaluation_id_title {
    width: 60px;
  }
  ._evaluation_inner_row {
    width: calc(100% - 40px) !important;
  }
  #link-title {
    width: 50px;
    padding: 0;
  }
}
</style>
