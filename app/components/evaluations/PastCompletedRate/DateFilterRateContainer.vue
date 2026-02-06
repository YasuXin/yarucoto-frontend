<script setup lang="ts">
import type {RecurringTask, Tag, Task} from "~/interfaces";
import flatpickr from "vue-flatpickr-component";
import {useMakeDateStrFromDate} from "#imports";

const props = defineProps({
  year: {
    type: Number,
    default: 2022
  },
  month: {
    type: Number,
    default: 1
  },
  tasks: {
    type: Array as () => Task[],
  },
  tags: {
    type: Array as () => Tag[]
  },
  recurringTasks: {
    type: Array as () => RecurringTask[]
  },
  isDateSearchContainerShow: {
    type: Boolean,
    default: false
  },
  isFilterContainerShow: {
    type: Boolean,
    default: false
  },
  isContainerWideSize: {
    type: Boolean,
    default: false
  },
  chartTitle: {
    type: String,
    default: ""
  }
})

const emit = defineEmits([
    'search',
    'changeMonth',
    'changeYear',
    'changePrevMonth',
    'changeNextMonth',
    'changeDate',
    'endDateCheck',
])

const year = computed(() => props.year)
const month = computed(() => props.month)
const date = ref(useMakeDateStrFromDate(new Date()))

const config = useFlatpickr().configRangeDate

const changeMonthEvent = (e: any) => {
  const t = e.target as HTMLButtonElement
  emit('changeMonth', Number(t.dataset.month))
}
const changeYearEvent = (e: any) => {
  emit('changeYear')
}
const changePrevMonthEvent = (e: any) => {
  emit('changePrevMonth')
}
const changeNextMonthEvent = (e: any) => {
  emit('changeNextMonth')
}
const dateEvent = (e: any) => {
  if (date.value !== undefined) {
    const arr = date.value.split(' から ')
    if (arr.length === 2) {
      emit('changeDate', arr[0], arr[1])
    } else if (arr.length === 1) {
      emit('changeDate', date.value, date.value)
    }
  }
}

const tasksCount = reactive({
  all: 0,
  completed: 0,
  incompleted: 0,
  rate: 0
})
const tasks = computed<Task[]>(() => props.tasks as Task[])
watch(tasks, () => {
  tasksCount.all = 0
  tasksCount.completed = 0
  tasksCount.incompleted = 0
  tasksCount.rate = 0
  for (const task of tasks.value) {
    tasksCount.all++
    if (task.completed) {
      tasksCount.completed++
    } else {
      tasksCount.incompleted++
    }
  }
  if (tasksCount.all === 0) {
    tasksCount.rate = 0
  } else {
    tasksCount.rate = Math.round(tasksCount.completed / tasksCount.all * 100)
  }
  createLineChartData()
})

const tags = computed<Tag[]>(() => props.tags as Tag[])
const recurringTasks = computed<RecurringTask[]>(() => props.recurringTasks as RecurringTask[])
const chartTitle = computed(() => props.chartTitle)

const isShowChart = ref('pie')

const pieChartShowEvent = () => {
  isShowChart.value = 'pie'
}

const q = (selector: string) => document.querySelector(selector) as HTMLElement

const searchParams = reactive({
  keyword: '',
  taskKinds: 'all',
  tagId: 0,
  recurringTaskId: 0
})
const searchKeywordEvent = (e: InputEvent) => {
  searchParams.keyword = (e.target as HTMLInputElement).value
  emit('search', searchParams)
}

const selectedTaskKindsName = ref('全タスク')
const taskSelectEvent = (e: Event) => {
  const t = e.target as HTMLSelectElement
  searchParams.taskKinds = t.value
  if (searchParams.taskKinds === 'routine') {
    selectedTaskKindsName.value = 'ルーティーン'
  } else if (searchParams.taskKinds === 'not-routine') {
    selectedTaskKindsName.value = '非ルーティーン'
  } else {
    selectedTaskKindsName.value = '全タスク'
  }
  emit('search', searchParams)
}

const selectedTagName = ref('')
const tagSelectEvent = (tagId: number) => {
  if (searchParams.tagId === tagId) {
    searchParams.tagId = 0
    selectedTagName.value = ''
  } else {
    searchParams.tagId = tagId
    selectedTagName.value = tags.value.find(tag => tag.id === tagId)?.name ?? ''
  }
  emit('search', searchParams)
}

const selectedRoutineName = ref('')
const recurringTaskSelectEvent = (e: MouseEvent) => {
  const rtaskEl = q('#rtask-btns-parent')
  for (const rtask of rtaskEl.children) {
    const rtaskParent = rtask as HTMLElement
    rtaskParent.classList.remove('_rtask_btn_wrapper_selected')
    const rtaskBtn = rtaskParent.children[0] as HTMLElement
    if (rtaskBtn) {
      rtaskBtn.classList.remove('_rtask_btn_selected')
    }
  }
  const t = e.target as HTMLElement
  if (searchParams.recurringTaskId !== Number(t.dataset.id)) {
    const parentEl = t.parentElement as HTMLElement
    searchParams.recurringTaskId = Number(t.dataset.id)
    parentEl.classList.add('_rtask_btn_wrapper_selected')
    t.classList.add('_rtask_btn_selected')
    selectedRoutineName.value = recurringTasks.value.find(r => r.id === searchParams.recurringTaskId)?.title ?? ''
  } else {
    searchParams.recurringTaskId = 0
    selectedRoutineName.value = ''
  }
  emit('search', searchParams)
}

const labelArr = ref()
const compRateArr  = ref()
const lineChartShowEvent = () => {
  isShowChart.value = 'line'
  createLineChartData()
}
const createLineChartData = () => {
  labelArr.value = []
  compRateArr.value = []
  let set = new Set()
  for (const task of tasks.value) {
    set.add(task.dueDate)
  }
  labelArr.value = Array.from(set)
  for (const date of set) {
    let allCount = 0
    let compCount = 0
    for (const task of tasks.value) {
      if (task.dueDate == date) {
        allCount++
        if (task.completed) compCount++
      }
    }
    compRateArr.value.push(allCount > 0 ? Math.round(compCount / allCount * 100) : 0)
  }
}

const isMaximizePieChartShow = ref(false)
const isMaximizeLineChartShow = ref(false)
const showMaximizeChartEvent = () => {
  if (isShowChart.value === 'pie') {
    isMaximizePieChartShow.value = true
  } else if (isShowChart.value === 'line') {
    isMaximizeLineChartShow.value = true
  }
}
const closeMaximizeChartEvent = () => {
  isMaximizePieChartShow.value = false
  isMaximizeLineChartShow.value = false
}
</script>

<template>
  <div id="filter-rate-container">
    <div id="date-filter-container">
      <transition>
        <div id="date-search-container" v-show="isDateSearchContainerShow || isContainerWideSize" class="_search_containers">
          <div id="date-search-box" class="_search_boxs">
            <div id="calendar-box">
              <div class="d-flex justify-content-center mb-1">
                <h6>年月で選択</h6>
              </div>
              <div id="prev-next-container" class="d-flex justify-content-center shadow-sm">
                <div id="prev-parent" class="d-flex justify-content-center align-items-center">
                  <button @click="changePrevMonthEvent" id="prevBtn">◀</button>
                </div>
                <button @click="changeYearEvent" id="calendarYearBtn" class="d-flex justify-content-center align-items-center">
                  <h6 class="mb-0" id="calendar-year-text">{{year}}年</h6>
                </button>
                <div id="next-parent" class="d-flex justify-content-center align-items-center">
                  <button @click="changeNextMonthEvent" id="nextBtn">▶</button>
                </div>
              </div>

              <div id="month-container">
                <button v-for="n in 12" @click="changeMonthEvent" :data-month="n <= 9 ? '0' + n : n" :key="n" :class="month == n ? '_selected_month' : ''"
                        class="_month_link_box d-flex justify-content-center align-items-center shadow-sm">
                  <span class="_month_link_title" :data-month="n <= 9 ? '0' + n : n">{{n}}月</span>
                </button>
              </div>
            </div>

            <div id="form-box">
              <div class="d-flex justify-content-center">
                <h6>日付を詳細に指定</h6>
              </div>
              <div id="date-form-container">
                <div class="w-100 mt-1">
                  <label for="startDate" class="form-label _date_label fw-bold">日付を選択</label>
                </div>
                <flatpickr :config="config" @change="dateEvent" v-model="date" type="date" name="date" id="date"
                           class="_date_form form-control form-control-sm shadow-sm"></flatpickr>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition>
        <div id="filter-container" v-show="isFilterContainerShow || isContainerWideSize" class="_search_containers">
          <div id="filter-box" class="_search_boxs">
            <div class="d-flex justify-content-center">
              <h6>フィルター</h6>
            </div>
            <div id="filter-form-parent" class="my-2">
              <div id="task-select-parent" class="form-group">
                <label for="task-select" class="mb-2 fw-bold">タスクの種類：</label>
                <select @change="taskSelectEvent" name="task-select" id="task-select" class="form-select form-select-sm shadow-sm">
                  <option value="all">全タスク</option>
                  <option value="not-routine">非ルーティーン</option>
                  <option value="routine">ルーティーン</option>
                </select>
              </div>
              <div id="keyword-form-parent" class="form-group">
                <label for="keyword-form" class="mb-2 fw-bold">キーワード：</label>
                <input @input="searchKeywordEvent" type="text" name="keyword-form" id="keyword-form" class="form-control form-control-sm shadow-sm">
              </div>
            </div>

            <div class="fw-bold my-2">タグ：</div>
            <div id="tag-btns-parent" class="d-flex flex-wrap">
              <TagButtons :tags="tags" :selectedTagId="searchParams.tagId" @tagSelect="tagSelectEvent"></TagButtons>
            </div>
            <div class="fw-bold my-2">ルーティーン：</div>
            <div id="rtask-btns-parent" class="d-flex flex-wrap">
              <div v-for="rtask in recurringTasks" :key="rtask.id" class="_rtask_btn_wrapper" :class="{'_rtask_btn_wrapper_selected' : searchParams.recurringTaskId == rtask.id}">
                <button @click="recurringTaskSelectEvent" :data-id="rtask.id" :class="{'_rtask_btn_selected' : searchParams.recurringTaskId === rtask.id}" class="_rtask_btn shadow-sm">{{rtask.title}}</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div id="rate-data-container">
      <div id="rate-data-box">
        <div id="rate-data-left" class="py-2 shadow-sm">
          <div id="rate-table-1" class="py-2 px-3">
            <div id="comp-rate" class="h-100">
              <div class="fw-bold">達成率</div>
              <div class="d-flex justify-content-center align-items-center my-3">
                <div><span id="comp-rate-text" class="mx-2" :class="{'_rate_comp' : tasksCount.rate === 100, '_rate_zero' : tasksCount.rate === 0}">{{tasksCount.rate}}</span>%</div>
              </div>
            </div>
          </div>
          <div id="rate-table-2" class="_rate_table_row py-2 px-3">
            <div class="fw-bold">タスク数</div>
            <div id="comp-task-count" class="d-flex justify-content-between mx-2 mt-1">
              <div class="_rate_row">完了：</div>
              <div id="comp-task-count-text">{{tasksCount.completed}}</div>
            </div>
            <div id="not-comp-task-count" class="d-flex justify-content-between mx-2">
              <div class="_rate_row">未完了：</div>
              <div id="not-comp-task-count-text">{{tasksCount.incompleted}}</div>
            </div>
            <div id="task-count" class="d-flex justify-content-between mx-2">
              <div class="_rate_row">すべて：</div>
              <div id="task-count-text">{{tasksCount.all}}</div>
            </div>
          </div>
          <div class="_rate_table_row py-2 px-3">
            <div class="fw-bold">フィルター</div>
            <div id="current-filter-names" class="mt-1">
              <div class="_current_filter_task_name">
                <div class="text-start">種類：</div>
                <div class="text-end">{{selectedTaskKindsName}}</div>
                <div class="text-start">タグ：</div>
                <div class="text-end">{{selectedTagName}}</div>
                <div class="text-start">ルーティーン：</div>
                <div class="text-end">{{selectedRoutineName}}</div>
              </div>
            </div>
          </div>
          <div class="_rate_table_row py-2 px-3">
            <div class="fw-bold">グラフ選択</div>
            <button @click="pieChartShowEvent" id="pieChartBtn" class="btn _btn_past_completed_rate btn-sm shadow-sm mt-2 w-100">円グラフ</button>
            <button @click="lineChartShowEvent" id="lineChartBtn" class="btn _btn_past_completed_rate btn-sm shadow-sm mt-2 w-100">達成率の推移</button>
          </div>
        </div>

        <div id="rate-data-right" class="pt-4 px-3">
          <div v-show="isShowChart === 'pie'" id="chart-parent" class="w-100 _pie_chart _fadein">
            <div v-if="tasks && tasks.length === 0" class="_no_tasks">
              <div>{{chartTitle}}のタスクがありません</div>
            </div>
            <EvaluationsPastCompletedRatePieChart :isMaximizeChartShow="isMaximizePieChartShow"
                                                  :completedCount="tasksCount.completed" :taskCount="tasksCount.all"
                                                  :data="tasks" :chartTitle="chartTitle" @closeMaximizeChart="closeMaximizeChartEvent"></EvaluationsPastCompletedRatePieChart>
          </div>
          <div v-if="isShowChart === 'line'" id="chart-parent" class="w-100 _line_chart _fadein">
            <div v-if="tasks && tasks.length === 0" class="_no_tasks">
              <div>{{chartTitle}}のタスクがありません</div>
            </div>
            <EvaluationsPastCompletedRateLineChart :isMaximizeChartShow="isMaximizeLineChartShow" :labelArr="labelArr"
                                                   :compRateArr="compRateArr" :chartTitle="chartTitle"
                                                   @closeMaximizeChart="closeMaximizeChartEvent"></EvaluationsPastCompletedRateLineChart>
          </div>
          <div id="chart-maximize-btn-parent" class="d-flex justify-content-center">
            <button @click="showMaximizeChartEvent" id="chartMaximizeBtn" class="btn btn-sm _btn_past_completed_rate shadow-sm">
              最大サイズ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: opacity .2s;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
.v-enter-to, .v-leave-from {
  opacity: 1;
}

#filter-rate-container {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
}

#date-filter-container {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  width: calc(100% - 600px);
}

#date-search-box {
  display: grid;
  grid-template-columns: auto 260px;
}

#date-search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 10px 0 0;
}
#date-search-box {
  width: 100%;
  border: var(--middle-border);
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  padding: 20px 30px;
}

#form-box {
  border-left: var(--middle-border);
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding-left: 30px;
  width: 230px;
}

#prev-next-container {
  background-color: var(--bg-color);
  border-radius: 10px;
  border: var(--middle-border);
  height: 36px;
  margin-bottom: 10px;
}

#prev-parent {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  flex-basis: 80px;
  border-right: var(--middle-border);
}

#prevBtn {
  border: none;
  color: gray;
  background-color: transparent;
  width: 100%;
  height: 100%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

#prevBtn:hover {
  animation-name: linkAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

#calendarYearBtn {
  flex-basis: calc(100% - 160px);
  background-color: transparent;
  border: none;
  color: var(--font-color)
}

#calendarYearBtn:hover {
  animation-name: linkAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

#calendarYearBtn h6 {
  font-style: italic;
}

#next-parent {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  flex-basis: 80px;
  border-left: var(--middle-border);
}

#nextBtn {
  border: none;
  color: gray;
  background-color: transparent;
  width: 100%;
  height: 100%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#nextBtn:hover {
  animation-name: linkAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

#month-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 5px;
  padding: 0 5px;
}

._month_link_box {
  text-decoration: none;
  color: var(--font-color);
  height: 32px;
  font-size: 0.8rem;
  border: var(--thin-border);
  border-radius: 10px;
  background-color: var(--month-link-box-bg-color);
}

._month_link_box:hover {
  animation-name: linkAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes linkAnimation {
  0% {}
  100% {background-color: var(--button-hoverd-bg-color);}
}

._selected_month {
  background-color: var(--button-hoverd-bg-color);
}

#date-form-container {
  display: flex;
  justify-content: center;
  align-items: end;
  flex-direction: column;
  width: 100%;
}

._date_form {
  width: 100%;
}

._date_label {
  width: 100%;
  text-align: start;
}

#date-search-container {
  font-size: 0.8rem;
}

._no_tasks {
  height: 100px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

._fadein {
  animation-name: fadeinAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  opacity: 0;
}
@keyframes fadeinAnimation {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

#filter-container {
  font-size: 0.8rem;
  width: 100%;
  height: auto;
  padding: 10px 10px 10px 0;
}
#filter-box {
  height: 100%;
  width: 100%;
  border: var(--middle-border);
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  padding: 20px 30px;
}
#rate-data-container {
  width: 600px;
  padding: 10px;
}

#rate-data-box {
  width: 100%;
  display: flex;
  flex-direction: column;
}

#rate-data-left {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 160px;
  border: var(--middle-border);
  border-radius: 10px;
  width: 100%;
  box-shadow: var(--task-shadow) !important;
  -webkit-box-shadow: var(--task-shadow) !important;
}

#rate-data-right {
  width: 100%;
  height: auto;
}

#rate-table-1 {
  font-size: 0.9rem;
}
#comp-rate-text {
  font-size: 1.6rem;
  font-style: italic;
  text-decoration-line: underline ;
}
._rate_comp {
  color: var(--bs-green);
}
._rate_zero {
  color: var(--bs-red);
}
._rate_table_row {
  padding-left: 10px;
  padding-right: 10px;
  border-left: var(--middle-border);
  font-size: 0.9rem;
}

#filter-form-parent {
  display: flex;
  justify-content: space-between;
}
#task-select-parent, #keyword-form-parent {
  width: 45%;
}

._rtask_btn_wrapper {
  margin: 0 3px 5px;
  border-radius: 5px;
}

._rtask_btn_wrapper:hover {
  animation-name: tagBtnWrapperAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
._rtask_btn_wrapper_selected {
  animation: none;
  background-color: var(--tag-btn-selected-bg-color);
}

._rtask_btn {
  border: var(--middle-border);
  border-radius:5px;
  background-color: transparent;
  color: var(--font-color);
}

._rtask_btn_selected {
  box-shadow: var(--task-inset-shadow) !important;
  -webkit-box-shadow: var(--task-inset-shadow) !important;
  border-color: var(--bg-default) !important;
  color: var(--disabled-form-font-color)!important;
}

input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 .25rem rgba(255, 178, 46, 0.491) !important;
}

._pie_chart {
  position: relative;
  height: 320px;
}
._line_chart {
  position: relative;
  height: 280px;
}
#chart-maximize-btn-parent {
  height: 30px;
  margin: 30px 0;
}

#current-filter-names {
  font-size: 0.9rem;
  margin-left: 8px;
}
._current_filter_task_name {
  display: flex;
  flex-direction: column;
}

@media (max-width: 1600px) {
  #month-container {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  #filter-box {
    padding: 20px 15px;
  }
  #date-search-box {
    padding: 20px 15px;
  }
  #date-search-box {
    grid-template-columns: auto 240px;
  }
  #form-box {
    padding-left: 15px;
    margin-left: 15px;
  }
}
@media (max-width: 1400px) {
  #month-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  #date-search-box {
    grid-template-columns: 1fr;
  }
  #form-box {
    border: none;
    margin-left: 0;
    margin-top: 20px;
    padding-left: 0;
    width: 100%;
  }
  ._pie_chart, ._line_chart {
    padding: 0 2%;
  }
}
@media (max-width: 1200px) {
  #filter-rate-container {
    display: block;
  }
  #rate-data-box {
    flex-direction: row;
  }
  #rate-data-left {
    grid-template-columns: 1fr;
    width: 160px;
  }
  #rate-data-right {
    margin-left: 10px;
    margin-top: 0;
    width: calc(100% - 160px);
  }
  ._rate_table_row {
    border-left: none;
    border-top: var(--middle-border);
  }
  #date-filter-container {
    width: 100%;
  }
  #month-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  #date-search-container {
    padding: 10px 10px 0;
  }
  #date-search-box {
    grid-template-columns: auto 260px;
  }
  #form-box {
    width: 215px;
    margin-left: 30px;
    margin-top: 0;
    padding-left: 20px;
    border-left: var(--middle-border);
  }
  #prev-parent, #next-parent {
    flex-basis: 80px;
  }
  #calendarYearBtn {
    flex-basis: calc(100% - 160px);
  }
  #date {
    font-size: 0.9rem;
  }
  #filter-container {
    padding: 10px 10px 0;
    width: 100%;
  }
  #filter-box {
    padding: 30px 20px;
  }
  #rate-data-container {
    padding: 10px;
    width: 100%;
  }
  #rate-data-box {
    width: 100%;
  }
}
@media (max-width: 1080px) {
  #date-search-box {
    grid-template-columns: auto 240px;
  }
  #form-box {
    margin-left: 15px;
    padding-left: 15px;
    width: 225px;
  }
}
@media (max-width: 960px) {
  #month-container {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
@media (max-width: 768px) {
  #date-search-container {
    padding: 10px 10px 0 10px;
  }
  #filter-container {
    padding: 10px 10px 0 10px;
  }
  #rate-data-container {
    padding: 10px;
  }
}
@media (max-width: 576px) {
  #form-box {
    width: 100%;
    border-top: var(--middle-border);
    border-left: none;
    margin-left: 0;
    margin-top: 20px;
    padding-top: 20px;
    padding-left: 0;
  }
  #date-search-box {
    grid-template-columns: 1fr;
    padding: 30px 10px 50px;
  }
  #date-form-container {
    width: 90%;
  }
  ._search_containers {
    padding: 10px 10px 0 10px;
  }
  #month-container {
    grid-template-columns: 1fr 1fr 1fr;
  }
  #calendarYearBtn {
    flex-basis: calc(100% - 80px);
  }
  #calendarYearBtn {
    flex-basis: calc(100% - 80px);
  }
  #date-search-box {
    grid-template-columns: 1fr;
  }
  #prev-parent,
  #next-parent {
    flex-basis: 40px;
  }
  #filter-form-parent {
    flex-direction: column;
  }
  #task-select-parent, #keyword-form-parent {
    width: 100%;
  }
  #rate-data-box {
    flex-direction: column-reverse;
  }
  #rate-data-left {
    width: 100%;
    grid-template-columns: 1fr 1fr;
  }
  ._rate_table_row {
    border: none;
  }
  #rate-data-right {
    width: 100%;
    margin-bottom: 8px;
    margin-left: 0;
  }
  ._line_chart {
    padding-bottom: 0;
  }
}

@media (max-width: 500px) {
  #month-container {
    grid-template-columns: 1fr 1fr 1fr;
  }

  #date-form-container {
    align-items: center;
  }

  ._date_label {
    text-align: center;
  }

  ._date_form {
    width: 100%;
  }
  #tag-btns-parent {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}

</style>
