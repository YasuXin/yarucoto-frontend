<script setup lang="ts">
import type {Task, Tag, RecurringTask, Evaluation} from "~/interfaces";

definePageMeta({
  middleware: ["auth", "auth-trial"],
  layout: "user"
})
useHead({
  title: "Yarucoto | PastCompletedRate"
})

const token = useCookie('__yarucoto')
const stateTasks = useState<Task[] | null>('allTasks')
const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getEvaluationUrl = baseUrl + '/evaluations/get'
const getThisDataUrl = baseUrl + '/evaluations/get/edit'
const getAllDataUrl = baseUrl + '/evaluations/get/prcInit'
const putEvaluationUrl = baseUrl + '/evaluations/put/update'

const isGetYearMonth = ref(true)
const yearMonthState = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
})

const isGetDateBetween = ref(false)
const dateBetweenState = reactive({
  startDate: '0000-00-00',
  endDate: '0000-00-00'
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

const allTasks = ref<Task[]>()
const tasks = ref<Task[]>()
const tags = computed(() => stateTags.value as Tag[] ?? [])
const recurringTasks = computed(() => stateRecurringTasks.value as RecurringTask[] ?? [])
const evaluation = ref<Evaluation>()

const chartTitle = ref('')

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const afterLoad = ref(false)

const getThisData = async () => {
  if (stateTasks.value === null || stateTasks.value === undefined) {
    try {
      const res = await $fetch(getThisDataUrl + '/' + yearMonthState.year + '/' + yearMonthState.month, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        key: getThisDataUrl
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      allTasks.value = res.tasks as Task[]
      evaluation.value = res.evaluation as Evaluation
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
        keys: getEvaluationUrl + '/' + yearMonthState.year + '/' + yearMonthState.month
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      allTasks.value = stateTasks.value as Task[]
      evaluation.value = res
    } catch (error) {
      useErrorEvent(error)
    }
  }
}

const getAllData = async () => {
  if (stateTasks.value === null || stateTasks.value === undefined) {
    try {
      const res = await $fetch(getAllDataUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        key: getAllDataUrl
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      stateTasks.value = res.tasks as Task[]
      allTasks.value = stateTasks.value as Task[]
      evaluation.value = res.evaluation as Evaluation
    } catch (error) {
      useErrorEvent(error)
    }
  }
}

const getEvaluation = async (year: number, month: number) => {
  try {
    const res = await $fetch(getEvaluationUrl + '/' + year + '/' + month, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      keys: getEvaluationUrl + '/' + year + '/' + month
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    evaluation.value = res
  } catch (error) {
    useErrorEvent(error)
  }
}

const createTasks = async () => {
  tasks.value = []
  if (allTasks.value !== undefined) {
    for (const task of allTasks.value) {
      if (isGetYearMonth.value) {
        const start = new Date(yearMonthState.year, yearMonthState.month - 1, 1)
        const end = new Date(yearMonthState.year, yearMonthState.month, 0)
        const taskDate = new Date(task.dueDate)
        if (taskDate < start || taskDate > end) continue
      } else if (isGetDateBetween.value) {
        const start = new Date(dateBetweenState.startDate)
        const end = new Date(dateBetweenState.endDate)
        const taskDate = new Date(task.dueDate)
        if (taskDate < start || taskDate > end) continue
      }
      if (filterParams.keywordArr.length > 0) {
        let flag = false
        for (const keyword of filterParams.keywordArr) {
          if (!task.title.includes(keyword) && !task.description.includes(keyword)) flag = true
        }
        if (flag) continue
      }
      if (filterParams.taskKinds !== '' && filterParams.taskKinds === 'not-routine') {
        if (task.isRecurring) continue
      } else if (filterParams.taskKinds !== '' && filterParams.taskKinds === 'routine') {
        if (!task.isRecurring) continue
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
        if (task.isRecurring && task.recurringId && task.recurringId !== filterParams.recurringTaskId) continue
      }
      tasks.value.push(task)
    }
    if (isGetYearMonth.value) {
      chartTitle.value = yearMonthState.year + '年' + yearMonthState.month + '月'
      await getEvaluation(yearMonthState.year, yearMonthState.month)
    }
    if (isGetDateBetween.value) {
      const startYear = dateBetweenState.startDate.substring(0, 4)
      const startMonth = dateBetweenState.startDate.substring(5, 7)
      const startDate = dateBetweenState.startDate.substring(8, 10)
      if (dateBetweenState.startDate === dateBetweenState.endDate) {
        chartTitle.value = startYear + '/' + startMonth + '/' + startDate
      } else {
        const endYear = dateBetweenState.endDate.substring(0, 4)
        const endMonth = dateBetweenState.endDate.substring(5, 7)
        const endDate = dateBetweenState.endDate.substring(8, 10)
        chartTitle.value = startYear + '/' + startMonth + '/' + startDate + '～' + endYear + '/' + endMonth + '/' + endDate
      }
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

const searchEvent = async (params: {
  keyword: string,
  taskKinds: string,
  tagId: number,
  recurringTaskId: number
}) => {
  filterParams.taskKinds = params.taskKinds
  filterParams.tagId = params.tagId
  filterParams.recurringTaskId = params.recurringTaskId
  await searchKeywordEvent(params.keyword)
  await createTasks()
}

const changePrevYearEvent = async () => {
  yearMonthState.year--
  yearMonthState.month = 1
  isGetYearMonth.value = true
  isGetDateBetween.value = false
  await createTasks()
}

const changeNextYearEvent = async () => {
  yearMonthState.year++
  yearMonthState.month = 1
  isGetYearMonth.value = true
  isGetDateBetween.value = false
  await createTasks()
}

const changeYearEvent = async () => {
  yearMonthState.month = 0
  isGetYearMonth.value = false
  isGetDateBetween.value = true
  dateBetweenState.startDate = yearMonthState.year + '-01-01'
  dateBetweenState.endDate = yearMonthState.year + '-12-31'
  await createTasks()
}

const changeMonthEvent = async (month: number) => {
  isGetYearMonth.value = true
  isGetDateBetween.value = false
  yearMonthState.month = month
  await createTasks()
}

const changeDateEvent = async (startDate: string, endDate: string) => {
  yearMonthState.month = 0
  isGetYearMonth.value = false
  isGetDateBetween.value = true
  dateBetweenState.startDate = startDate
  dateBetweenState.endDate = endDate
  await createTasks()
}

const isEvaluationContainerShow = ref(false)
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

const isDateSearchContainerWideSize = ref(false)
const isDateSearchContainerShow = ref(false)
const isDateSearchContainerHidden = ref(false)
const showDateSearchContainer = () => {
  if (isDateSearchContainerShow.value) {
    isDateSearchContainerHidden.value = true
    isDateSearchContainerShow.value = false
  } else {
    isDateSearchContainerHidden.value = false
    isDateSearchContainerShow.value = true
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
      keys: putEvaluationUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = yearMonthState.year + ' 年' + yearMonthState.month + '月の評価を編集しました'
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
window.addEventListener('resize', (e) => {
  if (window.innerWidth > 1200) {
    isDateSearchContainerWideSize.value = true
    isFilterContainerWideSize.value = true
  } else {
    isDateSearchContainerWideSize.value = false
    isFilterContainerWideSize.value = false
  }
})

if (window.innerWidth > 1200) {
  isDateSearchContainerWideSize.value = true
  isFilterContainerWideSize.value = true
}

onMounted(async () => {
  await getThisData()
  await createTasks()
  afterLoad.value = true
  await getAllData()
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
        <div id="filters" class="d-flex justify-content-end">
          <button @click="showEvaluationContainer"
                  id="show-evaluation-parent"
                  class="btn btn-sm d-flex align-items-center shadow-sm"
                  :class="{'_show_evaluation_parent_animation' : isEvaluationContainerShow,
                      '_btn_past_completed_rate' : !isEvaluationContainerShow}" :disabled="!isGetYearMonth">
            <span class="_show_btn_row">月ごとの評価</span>
            <span id="show-evaluation-btn-parent">
              <span id="showEvaluationBtn" :class="{'_show_btn_is_show' : isEvaluationContainerShow, '_show_btn_is_hidden' :isEvaluationContainerHidden }" >▼</span>
            </span>
          </button>
          <div id="show-date-search-parent" v-show="!isDateSearchContainerWideSize" class="shadow-sm">
            <div class="_show_btn_row">日付を選択</div>
            <div id="show-date-search-btn-parent">
              <button @click="showDateSearchContainer" id="showDateSearchBtn" :class="{'_show_btn_is_show' : isDateSearchContainerShow, '_show_btn_is_hidden' :isDateSearchContainerHidden }">▼</button>
            </div>
          </div>
          <div id="show-filter-parent" v-show="!isFilterContainerWideSize" class="shadow-sm">
            <div class="_show_btn_row">フィルター</div>
            <div id="show-filter-btn-parent">
              <button @click="showFilterContainer" id="showFilterBtn"  :class="{'_show_btn_is_show' : isFilterContainerShow, '_show_btn_is_hidden' :isFilterContainerHidden }">▼</button>
            </div>
          </div>
        </div>
        <div id="past-completed-rate-container">
          <EvaluationsPastCompletedRateEvaluationContainer
              v-show="isGetYearMonth && isEvaluationContainerShow"
              :evaluation="evaluation"
              @updateEvaluation="onSubmit"
          ></EvaluationsPastCompletedRateEvaluationContainer>
          <EvaluationsPastCompletedRateDateFilterRateContainer
              :year="yearMonthState.year"
              :month="yearMonthState.month"
              :tasks="tasks"
              :tags="tags"
              :recurringTasks="recurringTasks"
              :isDateSearchContainerShow="isDateSearchContainerShow"
              :isFilterContainerShow="isFilterContainerShow"
              :isContainerWideSize="isFilterContainerWideSize"
              :chartTitle="chartTitle"
              @search="searchEvent"
              @changeMonth="changeMonthEvent"
              @changeYear="changeYearEvent"
              @changeDate="changeDateEvent"
              @changePrevMonth="changePrevYearEvent"
              @changeNextMonth="changeNextYearEvent"
          ></EvaluationsPastCompletedRateDateFilterRateContainer>
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
#show-date-search-parent, #show-filter-parent {
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

#show-evaluation-btn-parent, #show-date-search-btn-parent, #show-filter-btn-parent {
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

#showDateSearchBtn, #showFilterBtn {
  background-color: transparent;
  border: none;
  color: var(--font-color);
  width: 100%;
  height: 100%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#showDateSearchBtn[disabled=true] {
  background-color: transparent!important;
  color: var(--disabled-form-font-color);
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

@media (max-width: 1500px) {
  #past-completed-rate-container {
    display: block;
  }
}
@media (max-width: 1200px) {
  #filters {
    padding-right: 10px;
  }
}
@media (max-width: 576px) {
  #filters {
    flex-direction: column;
    margin-left: 10px;
  }
  #show-evaluation-parent, #show-date-search-parent, #show-filter-parent {
    height: 36px;
    margin-top: 8px;
  }
  #show-evaluation-parent {
    margin-right: 10px;
  }
  #show-evaluation-btn-parent, #show-date-search-btn-parent, #show-filter-btn-parent {
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
