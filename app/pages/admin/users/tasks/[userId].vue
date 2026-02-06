<script setup lang="ts">
import type {AdminTask, AdminUser} from "~/interfaces";

definePageMeta({
  layout: "admin",
  middleware: "admin"
})

useHead({
  title: "Yarucoto | Admin | Users | Tasks",
})

const token = useCookie('__yarucoto')
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const userId = useRoute().params.userId

const getUserAndTasksUrl = baseUrl + '/admin/users/tasks/get/' + userId
const deleteTaskUrl = baseUrl + '/admin/tasks/delete'

const currentPage = ref<number>(Number(useRoute().query.page ?? 1))

const query = useRoute().query

const user = ref<AdminUser | null>()
const tasks = ref<AdminTask[] | []>([])
const startId = ref<number>(Number(query.startId ?? 0))
const endId = ref<number>(Number(query.endId ?? 0))
const columnKeyword = ref<string>(<string>query.columnKeyword ?? 'title')
const keyword = ref<string>(<string>query.keyword ?? '')
const columnOrder = ref<string>(<string>query.columnOrder ?? 'id')
const order = ref<string>(<string>query.order ?? 'ASC')
const completed = ref(<string>query.completed ?? 'all')
const startDate = ref(<string>query.startDate ?? '' as string)
const endDate = ref(<string>query.endDate ?? '' as string)

const totalPages = ref(0)
const isPagination = ref(true)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const movePaginationEvent = (page: number) => {
  getUserAndTasks(page)
  navigateTo({path: '/admin/users/tasks/' + userId, query: {
      page: page,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      startDate: startDate.value ?? null,
      endDate: endDate.value ?? null,
      completed: completed.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null
    }})
  window.scrollTo(0, 0)
}
const moveLastPaginationEvent = () => {
  getUserAndTasks(totalPages.value)
  navigateTo({path: '/admin/users/tasks/' + userId, query: {
      page: totalPages.value,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      startDate: startDate.value ?? null,
      endDate: endDate.value ?? null,
      completed: completed.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null
    }})
  window.scrollTo(0, 0)
}
const moveFirstPaginationEvent = () => {
  getUserAndTasks(1)
  navigateTo({path: '/admin/users/tasks/' + userId, query: {
      page: 1,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      startDate: startDate.value ?? null,
      endDate: endDate.value ?? null,
      completed: completed.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null
    }})
  window.scrollTo(0, 0)
}

const returnShow = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + userId)
}

const getUserAndTasks = async (page: number) => {
  const params = {
    page: page,
    columnKeyword: columnKeyword.value ?? null,
    keyword: keyword.value ?? null,
    startId: startId.value ?? null,
    endId: endId.value ?? null,
    startDate: startDate.value ?? null,
    endDate: endDate.value ?? null,
    completed: completed.value ?? null,
    columnOrder: columnOrder.value ?? null,
    order: order.value ?? null
  }
  try {
    const res = await $fetch(getUserAndTasksUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      query: params,
      key: getUserAndTasksUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    user.value = res.user
    tasks.value = res.tasks
    totalPages.value = res.totalPages
    currentPage.value = page
  } catch (error) {
    useErrorEvent(error)
  }
}

const deleteResult = ref('')
const deleteTask = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params: {
    userId: number,
    taskId: number
  } = {
    userId: user?.value?.id ?? 0,
    taskId: Number(selectedTask?.value?.id) ?? 0
  }
  try {
    const res = await $fetch(deleteTaskUrl, {
      method: 'DELETE',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteTaskUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = "タスクを削除しました"
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else if (deleteResult.value === 'no-user') {
      modalMessage.value = "指定した会員が見つかりませんでした"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else if (deleteResult.value === 'no-task') {
      modalMessage.value = "指定したタスクが見つかりませんでした"
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
  startDate: string,
  endDate: string,
  completed: string,
  startId: number,
  endId: number,
  columnOrder: string,
  order: string
}
const onSearch = async (params: SearchParams) => {
  columnKeyword.value = params.columnKeyword
  keyword.value = params.keyword
  startId.value = params.startId
  endId.value = params.endId
  startDate.value = params.startDate
  endDate.value = params.endDate
  completed.value = params.completed
  columnOrder.value = params.columnOrder
  order.value = params.order
  currentPage.value = params.page ?? 1
  await getUserAndTasks(currentPage.value)
  navigateTo({path: '/admin/users/tasks/' + userId, query: params as any})
  window.scrollTo(0, 0)
}

const selectedTask = ref<AdminTask | null>()
const isTaskModalShow = ref(false)
const showTaskModal = (taskId: number) => {
  for (const task of tasks.value) {
    if (task.id === taskId) {
      selectedTask.value = task
      break
    }
  }
  isTaskModalShow.value = true
  isDeleteModalShow.value = false
}

const isDeleteModalShow = ref(false)
const showDeleteModal = () => {
  isDeleteModalShow.value = true
  isTaskModalShow.value = false
}
const onDelete = async () => {
  isDeleteModalShow.value = false
  isTaskModalShow.value = false
  await deleteTask()
}
const returnEvent = () => {
  isDeleteModalShow.value = false
  isTaskModalShow.value = false
}

await getUserAndTasks(currentPage.value)
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>{{user?.username}} のタスク一覧</h3>
    </div>
    <nav class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/users/list?page=1" class="_normal_link mb-3">会員一覧</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink @click="returnShow" class="_normal_link mb-3">会員情報</NuxtLink>
    </nav>

    <AdminPagination
        :isPagination="isPagination"
        :paginationCurrentNum="currentPage"
        :paginationTotalNum="totalPages"
        @move="movePaginationEvent"
        @moveLast="moveLastPaginationEvent"
        @moveFirst="moveFirstPaginationEvent"></AdminPagination>
    <div id="task-parent">
      <div id="tasks" class="mt-4 mb-5">
        <div id="tasks-title" class="_task_container">
          <div class="_task_box">
            <div id="task-row-title" class="d-flex justify-content-between">
              <div class="_task_inner_row d-flex">
                <div class="_task_id_title">
                  <div>ID</div>
                </div>
                <div class="_task_title_title d-flex justify-content-center">
                  <div>タイトル</div>
                </div>
                <div class="_task_tag_title d-flex justify-content-center">
                  <div>タグ</div>
                </div>
              </div>
              <div class="d-flex">
                <div id="completed-title" class="_task_completed_parent">完了</div>
                <div id="due-date-title" class="_task_due_date">日付</div>
                <div id="link-title" class="_show_btn_parent">リンク</div>
              </div>
            </div>
          </div>
        </div>
        <AdminUsersTask v-for="task in tasks" :key="task.id" :task="task" @show="showTaskModal"></AdminUsersTask>
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
  <AdminUsersTasksSearchContainer v-if="isSearchShow"
                                  :columnKeyword="columnKeyword"
                                  :keyword="keyword"
                                  :columnOrder="columnOrder"
                                  :order="order"
                                  :startId="startId"
                                  :endId="endId"
                                  :startDate="startDate"
                                  :endDate="endDate"
                                  :completed="completed"
                                  @onSearch="onSearch"
  ></AdminUsersTasksSearchContainer>
  <teleport to="body">
    <AdminTasksTaskModal v-if="isTaskModalShow" :task="selectedTask" :user="user" @delete="showDeleteModal" @return="returnEvent"></AdminTasksTaskModal>
    <DeleteModal v-if="isDeleteModalShow" title="本当に削除しますか？" message="削除した場合、二度と戻せません" @delete="onDelete" @return="returnEvent"></DeleteModal>
    <Modal :modalShow="modalShow" :message="modalMessage"></Modal>
  </teleport>
</template>

<style scoped>
#task-parent {
  padding:0 100px;
}
._task_container {
  width: 100%;
}
._task_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._task_id_title {
  width: 100px;
  padding-left: 30px;
}
._task_title_title {
  width: calc(100% - 545px);
  margin-left: 10px;
}
._task_tag_title {
  width: 445px;
}
#completed-title, #due-date-title, #link-title {
  border: none;
}
._task_completed_parent {
  width: 60px;
  text-align: center;
  padding: 0 5px;
  border-left: var(--thin-border);
}
._task_due_date {
  width: 100px;
  text-align: center;
  padding: 0 5px;
  border-left: var(--thin-border);
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
#task-row-title {
  background-color: var(--bg-color);
  font-weight: bold;
  border: var(--thick-border);
  border-radius: 10px;
  padding: 10px 18px;
}
#tasks-title ._task_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
#tasks-title ._task_inner_row {
  width: calc(100% - 190px);
}
@media (max-width: 1400px) {
  #show-search-area {
    padding: 0 20px;
  }
  #task-parent {
    padding: 0 20px;
  }
  ._task_title_title {
    width: calc(100% - 430px);
    margin-left: 10px;
  }
  ._task_tag_title {
    width: 335px;
  }
}
@media (max-width: 1080px) {
  #tasks-title ._task_inner_row {
    width: calc(100% - 80px);
  }
}
@media (max-width: 960px) {
  ._task_id_title {
    width: 100px;
    padding-left: 15px;
  }
  ._task_title_title {
    width: calc(100% - 410px);
  }
  ._task_tag_title {
    width: 300px;
  }
}
@media (max-width: 860px) {
  ._task_title_title {
    width: calc(100% - 110px);
  }
  ._task_tag_title {
    display: none !important;
  }
}
@media (max-width: 768px) {
  #task-parent {
    width : 100%;
    padding: 0 10px;
  }
  ._task_id_title {
    width: 80px;
  }
  ._task_title_title {
    width: calc(100% - 90px);
  }
}
@media (max-width: 576px) {
  #task-parent {
    width : 100%;
    padding: 0 10px;
  }
  #task-row-title {
    padding: 10px;
  }
  ._task_id_title {
    width: 60px;
  }
  ._task_completed_parent {
    display: none;
  }
  ._task_due_date {
    display: none;
  }
}
</style>
