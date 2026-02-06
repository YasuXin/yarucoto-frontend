<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import type {Task, Tag, RecurringTask, Evaluation} from "~/interfaces";

definePageMeta({
  middleware: ["auth", "auth-trial"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Evaluation | Edit"
})
const token = useCookie('__yarucoto')

const stateTasks = useState<Task[] | null>('allTasks')
const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path

const yearMonth = useRoute().params.yearMonth as string
const year = yearMonth ? yearMonth.split('-')[0] : 2025
const month = yearMonth ? yearMonth.split('-')[1] : 1

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getEvaluationUrl = baseUrl + '/evaluations/get'
const getDataUrl = baseUrl + '/evaluations/get/edit'
const putEvaluationUrl = baseUrl + '/evaluations/put/update'

const yearMonthState = reactive({
  year: year,
  month: month
})

const filterParams = reactive<{
  keywordArr: string[],
  taskKinds: string,
  tagId: number,
  recurringTaskId: number
}>({
  keywordArr: [],
  taskKinds: 'all',
  tagId: 0,
  recurringTaskId: 0
})

const allTasks = computed(() => stateTasks.value as Task[] ?? [])
const tasks = ref<Task[]>()
const tags = computed(() => stateTags.value as Tag[] ?? [])
const recurringTasks = computed(() => stateRecurringTasks.value as RecurringTask[] ?? [])
const evaluation = ref<Evaluation>()

const chartTitle = ref('')

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const afterLoad = ref(false)

const getData = async () => {
  if (stateTasks.value === null || stateTasks.value === undefined) {
    try {
      const res = await $fetch(getDataUrl + '/' + yearMonthState.year + '/' + yearMonthState.month, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        key: getDataUrl + '/' + yearMonthState.year + '/' + yearMonthState.month
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      stateTasks.value = res.tasks as Task[]
      evaluation.value = res.evaluation as Evaluation
      chartTitle.value = yearMonthState.year + '年' + yearMonthState.month + '月'
    } catch (error) {
      useErrorEvent(error)
    }
  } else {
    try {
      const res = await $fetch(getEvaluationUrl + '/' + yearMonthState.year + '/' + yearMonthState.month, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        key: getEvaluationUrl + '/' + yearMonthState.year + '/' + yearMonthState.month
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      evaluation.value = res as Evaluation
      chartTitle.value = yearMonthState.year + '年' + yearMonthState.month + '月'
    } catch (error) {
      useErrorEvent(error)
    }
  }
}

const createTasks = () => {
  tasks.value = []
  if (allTasks.value !== undefined) {
    for (const task of allTasks.value) {
      const start = new Date(Number(yearMonthState.year), Number(yearMonthState.month) - 1, 1)
      const end = new Date(Number(yearMonthState.year), Number(yearMonthState.month), 0)
      const taskDate = new Date(task.dueDate)
      if (taskDate < start || taskDate > end) continue

      if (filterParams.keywordArr.length > 0) {
        let flag = false
        for (const keyword of filterParams.keywordArr) {
          if (!task.title.includes(keyword) && !task.description.includes(keyword)) {
            flag = true
          }
        }
        if (flag) continue
      }
      if (filterParams.taskKinds !== '' && filterParams.taskKinds === 'not-routine') {
        if (task.isRecurring) {
          continue
        }
      } else if (filterParams.taskKinds !== '' && filterParams.taskKinds === 'routine') {
        if (!task.isRecurring) {
          continue
        }
      }
      if (filterParams.tagId !== 0) {
        if (!((task.tag1 && task.tag1.id === filterParams.tagId) ||
            (task.tag2 && task.tag2.id === filterParams.tagId) ||
            (task.tag3 && task.tag3.id === filterParams.tagId))) {
          continue
        }
      }
      if (filterParams.recurringTaskId !== 0) {
        if (!task.isRecurring) continue
        if (task.isRecurring && task.recurringId && task.recurringId !== filterParams.recurringTaskId) {
          continue
        }
      }
      tasks.value.push(task)
    }
  }
}

const searchKeywordEvent = async (keyword: string) => {
  filterParams.keywordArr = []
  if (keyword.length > 0) {
    const arr1 = keyword.split(' ')
    let arr2 = []
    for (const a of arr1) {
      const arr3 = a.split('\u3000')
      let arr4 = []
      for (const b of arr3) {
        arr4.push(b)
      }
      arr2.push(...arr4)
    }
    filterParams.keywordArr.push(...arr2)
  }
}

const searchEvent = (params: {
  keyword: string,
  taskKinds: string,
  tagId: number,
  recurringTaskId: number
}) => {
  filterParams.taskKinds = params.taskKinds
  filterParams.tagId = params.tagId
  filterParams.recurringTaskId = params.recurringTaskId
  searchKeywordEvent(params.keyword)
  createTasks()
}

const isEvaluationContainerWideSize = ref(false)
const isEvaluationContainerShow = ref(true)
const isEvaluationContainerHidden = ref(false)
const showEvaluationContainer = () => {
  if (isEvaluationContainerShow.value) {
    isEvaluationContainerHidden.value = true
    isEvaluationContainerShow.value = false
  } else {
    isEvaluationContainerHidden.value = false
    isEvaluationContainerShow.value = true
  }
}

const isFilterContainerWideSize = ref(false)
const isFilterContainerShow = ref(false)
const isFilterContainerHidden = ref(false)
const showFilterContainer = () => {
  if (isFilterContainerShow.value) {
    isFilterContainerHidden.value = true
    isFilterContainerShow.value = false
  } else {
    isFilterContainerHidden.value = false
    isFilterContainerShow.value = true
  }
}

const submitResult = ref('')
const onSubmit = async (params: {
  rate: number,
  text: string,
  year: number,
  month: number,
}) => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(putEvaluationUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: putEvaluationUrl + '/' + params.year + '/' + params.month
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = yearMonthState.year + ' 年' + yearMonthState.month + '月の評価を編集しました'
      setTimeout(() => {
        modalShow.value = false
        navigateTo('/evaluations/list')
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}
window.addEventListener('resize', (e) => {
  if (window.innerWidth > 1200) {
    isEvaluationContainerWideSize.value = true
    isFilterContainerWideSize.value = true
  } else {
    isEvaluationContainerWideSize.value = false
    isFilterContainerWideSize.value = false
  }
})

if (window.innerWidth > 1200) {
  isEvaluationContainerWideSize.value = true
  isFilterContainerWideSize.value = true
}

onMounted(async () => {
  await getData()
  createTasks()
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-around">
          <h3>タスクの達成率</h3>
        </div>
        <div id="return-evaluations-parent" class="my-3 d-flex justify-content-center">
          <NuxtLink to="/evaluations/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <div id="filters" class="d-flex justify-content-end">
          <div id="no-evaluation" class="_hidden d-flex align-items-center">
            <div>日付詳細選択では評価はつけられません</div>
          </div>
          <button @click="showEvaluationContainer" v-if="!isEvaluationContainerWideSize"
                  id="show-evaluation-parent"
                  class="btn btn-sm d-flex align-items-center shadow-sm"
                  :class="{'_show_evaluation_parent_animation' : isEvaluationContainerShow,
                      '_btn_past_completed_rate' : !isEvaluationContainerShow}">
            <span class="_show_btn_row">月ごとの評価</span>
            <span id="show-evaluation-btn-parent">
                  <span id="showEvaluationBtn" :class="{'_show_btn_is_show' : isEvaluationContainerShow, '_show_btn_is_hidden' :isEvaluationContainerHidden }" >▼</span>
                </span>
          </button>
          <div id="show-filter-parent" v-show="!isFilterContainerWideSize" class="shadow-sm">
            <div class="_show_btn_row">フィルター</div>
            <div id="show-filter-btn-parent">
              <button @click="showFilterContainer" id="showFilterBtn"  :class="{'_show_btn_is_show' : isFilterContainerShow, '_show_btn_is_hidden' :isFilterContainerHidden }">▼</button>
            </div>
          </div>
        </div>
        <div id="past-completed-rate-container">
          <EvaluationsEditEvaluationFilterRateContainer
              :evaluation="evaluation"
              :isEvaluationContainerShow="isEvaluationContainerShow"
              :tags="tags"
              :recurringTasks="recurringTasks"
              :isFilterContainerShow="isFilterContainerShow"
              :isContainerWideSize="isFilterContainerWideSize"
              :tasks="tasks"
              :chartTitle="chartTitle"
              :selectedTaskKind="filterParams.taskKinds"
              @search="searchEvent"
              @updateEvaluation="onSubmit"
          ></EvaluationsEditEvaluationFilterRateContainer>
        </div>
        <EvaluationsPastCompletedRateTaskContainer
            :tasks="tasks"
        ></EvaluationsPastCompletedRateTaskContainer>
      </div>
      <Loading v-if="!afterLoad"></Loading>
      <teleport to="body">
        <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
      </teleport>
    </main>
  </div>
</template>

<style scoped>
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#no-evaluation {
  margin-right: 20px;
  font-size: 0.7rem;
}

#past-completed-rate-container {
  display: flex;
  flex-direction: row-reverse;
}
#show-filter-parent {
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--middle-border);
  border-radius: 10px;
  background-color: var(--bg-color);
  margin-right: 10px;
}
#show-evaluation-parent {
  padding: 0 5px;
  margin-right: 20px;
  border-radius: 20px!important;
}

._show_evaluation_parent_animation {
  animation-name: showEvaluationBtnAnimation;
  animation-duration: 1.0s;
  animation-fill-mode: forwards;
  border: none;
  color: rgb(90,90,90) !important;
}

#show-evaluation-parent:hover {
  animation-name: showEvaluationBtnAnimation;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}
@keyframes showEvaluationBtnAnimation {
  0% {}
  100% {background-color: var(--theme-color4-hover) !important;}
}

#show-evaluation-btn-parent, #show-filter-btn-parent {
  width: 30px;
  height: 30px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#show-evaluation-btn-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

#showFilterBtn {
  background-color: transparent;
  border: none;
  color: var(--font-color);
  width: 100%;
  height: 100%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#showEvaluationBtn {
  color: var(--btn-font-color);
  vertical-align: middle;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

._show_btn_row {
  padding-right: 10px;
  margin-left: 10px;
  border-right: var(--middle-border);
  font-size: 0.9rem;
}

._show_btn_is_show {
  animation-name: showBtnShowAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes showBtnShowAnimation {
  0% {transform: rotate(0);}
  100% {transform: rotate(180deg);color: var(--show-btn-is-hidden-font-color);}
}

._show_btn_is_hidden {
  animation-name: showBtnHiddenAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes showBtnHiddenAnimation {
  0% {transform: rotate(180deg);color: var(--show-btn-is-hidden-font-color);}
  100% {transform: rotate(0);}
}

input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 .25rem rgba(255, 178, 46, 0.491) !important;
}

@media (max-width: 1200px) {
  #filters {
    padding-right: 10px;
  }
  #past-completed-rate-container {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  #filters {
    flex-direction: column;
    margin-left: 10px;
  }
  #show-evaluation-parent, #show-filter-parent {
    height: 36px;
    margin-top: 8px;
  }
  #show-evaluation-parent {
    margin-right: 10px;
  }
  #show-evaluation-btn-parent, #show-filter-btn-parent {
    width: 40px;
    height: 35px;
  }
  ._show_btn_row {
    width: calc(100% - 50px);
  }
  #main-title h2 {
    max-width: 70%;
  }
}
</style>
