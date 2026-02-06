<script setup lang="ts">
import type {AdminGoal, AdminUser} from "~/interfaces";

definePageMeta({
  layout: "admin",
  middleware: "admin"
})

useHead({
  title: "Yarucoto | Admin | Users | Goals",
})

const token = useCookie('__yarucoto')
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const userId = useRoute().params.userId

const getUserAndGoalsUrl = baseUrl + '/admin/users/goals/get/' + userId
const deleteGoalUrl = baseUrl + '/admin/goals/delete'

const currentPage = ref<number>(Number(useRoute().query.page ?? 1))

const query = useRoute().query

const user = ref<AdminUser>()
const goals = ref<AdminGoal[]>([])
const startId = ref<number>(Number(query.startId ?? 0))
const endId = ref<number>(Number(query.endId ?? 0))
const columnKeyword = ref<string>(<string>query.columnKeyword ?? 'title')
const keyword = ref<string>(<string>query.keyword ?? '')
const columnOrder = ref<string>(<string>query.columnOrder ?? 'id')
const order = ref<string>(<string>query.order ?? 'ASC')
const startYear = ref<number>(Number(query.startYear ?? 0))
const endYear = ref<number>(Number(query.endYear ?? 0))

const totalPages = ref(0)
const isPagination = ref(true)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const movePaginationEvent = (page: number) => {
  getUserAndGoals(page)
  navigateTo({path: '/admin/users/goals/' + userId, query: {
      page: page,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startYear: startYear.value ?? null,
      endYear: endYear.value ?? null,
    }
  })
  window.scrollTo(0, 0)
}
const moveLastPaginationEvent = () => {
  getUserAndGoals(totalPages.value)
  navigateTo({path: '/admin/users/goals/' + userId, query: {
      page: totalPages.value,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startYear: startYear.value ?? null,
      endYear: endYear.value ?? null,
    }
  })
  window.scrollTo(0, 0)
}
const moveFirstPaginationEvent = () => {
  getUserAndGoals(1)
  navigateTo({path: '/admin/users/goals/' + userId, query: {
      page: 1,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      startYear: startYear.value ?? null,
      endYear: endYear.value ?? null,
    }
  })
  window.scrollTo(0, 0)
}

const returnShow = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + userId)
}

const getUserAndGoals = async (page: number) => {
  const params = {
    page: page,
    columnKeyword: columnKeyword.value ?? null,
    keyword: keyword.value ?? null,
    startId: startId.value ?? null,
    endId: endId.value ?? null,
    columnOrder: columnOrder.value ?? null,
    order: order.value ?? null,
    startYear: startYear.value ?? null,
    endYear: endYear.value ?? null,
  }
  try {
    const res = await $fetch(getUserAndGoalsUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      query: params,
      key: getUserAndGoalsUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    user.value = res.user
    goals.value = res.goals
    totalPages.value = res.totalPages
    currentPage.value = page
  } catch (error) {
    useErrorEvent(error)
  }
}

const deleteResult = ref('')
const deleteGoal = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params: {
    userId: number,
    goalId: number
  } = {
    userId: user?.value?.id ?? 0,
    goalId: Number(selectedGoal?.value?.id) ?? 0
  }
  try {
    const res = await $fetch(deleteGoalUrl, {
      method: 'DELETE',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteGoalUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = "目標を削除しました"
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else if (deleteResult.value === 'no-user') {
      modalMessage.value = "指定した会員が見つかりませんでした"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else if (deleteResult.value === 'no-task') {
      modalMessage.value = "指定した目標が見つかりませんでした"
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
  columnKeyword: string,
  keyword: string,
  startId: number,
  endId: number,
  columnOrder: string,
  order: string,
  startYear: number,
  endYear: number
}
const onSearch = async (params: SearchParams) => {
  columnKeyword.value = params.columnKeyword
  keyword.value = params.keyword
  startId.value = params.startId
  endId.value = params.endId
  columnOrder.value = params.columnOrder
  order.value = params.order
  startYear.value = params.startYear
  endYear.value = params.endYear
  await getUserAndGoals(currentPage.value)
  navigateTo({path: '/admin/users/goals/' + userId, query: params as any})
  window.scrollTo(0, 0)
}

const selectedGoal = ref<AdminGoal | null>()
const isGoalModalShow = ref(false)
const showGoalModal = (goalId: number) => {
  for (const goal of goals.value) {
    if (goal.id === goalId) {
      selectedGoal.value = goal
      break
    }
  }
  isGoalModalShow.value = true
  isDeleteModalShow.value = false
}

const isDeleteModalShow = ref(false)
const showDeleteModal = () => {
  isDeleteModalShow.value = true
  isGoalModalShow.value = false
}
const onDelete = async () => {
  isDeleteModalShow.value = false
  isGoalModalShow.value = false
  await deleteGoal()
}
const returnEvent = () => {
  isDeleteModalShow.value = false
  isGoalModalShow.value = false
}

await getUserAndGoals(currentPage.value)
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>{{user?.username}} の目標一覧</h3>
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
    <div id="goal-parent">
      <div id="goals" class="mt-4 mb-5">
        <div id="goals-title" class="_goal_container">
          <div class="_goal_box">
            <div id="goal-row-title" class="d-flex justify-content-between">
              <div class="_goal_inner_row d-flex">
                <div class="_goal_id_title">
                  <div>ID</div>
                </div>
                <div class="_goal_title_title d-flex justify-content-center">
                  <div>タイトル</div>
                </div>
                <div class="_goal_year_title d-flex justify-content-center">
                  <div>年</div>
                </div>
                <div class="_goal_month_title d-flex justify-content-center">
                  <div>月</div>
                </div>
              </div>

              <div class="d-flex">
                <div id="link-title" class="_show_btn_parent">リンク</div>
              </div>

            </div>
          </div>
        </div>
        <AdminUsersGoal v-for="goal in goals" :key="goal.id" :goal="goal" @show="showGoalModal"></AdminUsersGoal>
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
  <AdminUsersGoalsSearchContainer v-if="isSearchShow"
                                  :columnKeyword="columnKeyword"
                                  :keyword="keyword"
                                  :columnOrder="columnOrder"
                                  :order="order"
                                  :startId="startId"
                                  :endId="endId"
                                  :startYear="startYear"
                                  :endYear="endYear"
                                  @onSearch="onSearch"></AdminUsersGoalsSearchContainer>
  <teleport to="body">
    <AdminGoalsGoalModal v-if="isGoalModalShow" :goal="selectedGoal" :user="user" @delete="showDeleteModal" @return="returnEvent"></AdminGoalsGoalModal>
    <DeleteModal v-if="isDeleteModalShow" title="本当に削除しますか？" message="削除した場合、二度と戻せません" @delete="onDelete" @return="returnEvent"></DeleteModal>
    <Modal :modalShow="modalShow" :message="modalMessage"></Modal>
  </teleport>
</template>

<style scoped>
#goal-parent {
  padding:0 100px;
}
._goal_container {
  width: 100%;
}
._goal_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._goal_id_title {
  width: 100px;
  padding-left: 30px;
}
._goal_title_title {
  width: calc(100% - 210px);
}
._goal_year_title {
  width: 100px;
}
._goal_month_title {
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
#goal-row-title {
  background-color: var(--bg-color);
  font-weight: bold;
  border: var(--thick-border);
  border-radius: 10px;
  padding: 10px 18px;
}
#goals-title ._goal_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
#goals-title ._goal_inner_row {
  width: calc(100% - 60px);
}
@media (max-width: 1400px) {
  #goal-parent {
    padding: 0 20px;
  }
}
@media (max-width: 1080px) {
  #goals-name ._goal_inner_row {
    width: calc(100% - 80px);
  }
}
@media (max-width: 960px) {
  ._goal_id_title {
    width: 100px;
    padding-left: 15px;
  }
}
@media (max-width: 768px) {
  #goal-parent {
    width : 100%;
    padding: 0 10px;
  }
  ._goal_title_title {
    width: calc(100% - 180px);
  }
  ._goal_id_title {
    width: 80px;
  }
  ._goal_year_title {
    width: 80px;
  }
  ._goal_month_title {
    width: 80px;
  }
}
@media (max-width: 576px) {
  #goal-parent {
    width : 100%;
    padding: 0 10px;
  }
  ._goal_title_title {
    width: calc(100% - 140px);
  }
  ._goal_year_title {
    width: 100px;
  }
  ._goal_month_title {
    width: 40px;
  }
  #goal-row-title {
    padding: 10px 5px;
  }
  ._goal_id_title {
    width: 60px;
  }
}
@media (max-width: 500px) {
  ._goal_title_title {
    display: none !important;
  }
  ._goal_month_title {
    width: 60px;
  }
}
</style>
