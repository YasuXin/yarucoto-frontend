<script setup lang="ts">
import type {Evaluation, RecurringTask, Tag, Task} from "~/interfaces";
import {useMakeStrFromTimestamp} from "~/composables/useMakeStrFromTimestamp";

const props = defineProps({
  tags: {
    type: Array as () => Tag[],
    default: []
  },
  recurringTasks: {
    type: Array as () => RecurringTask[],
    default: []
  },
  isFilterContainerShow: {
    type: Boolean,
    default: false
  },
  isContainerWideSize: {
    type: Boolean,
    default: false
  },
  tasks: {
    type: Array as () => Task[],
    default: []
  },
  selectedTaskKind: {
    type: String,
    default: 'all'
  },
  chartTitle: {
    type: String,
    default: ""
  },
  evaluation: {
    type: Object as () => Evaluation,
    default: (): Evaluation => ({
      id: 0,
      year: 0,
      month: 0,
      rate: 0,
      text: '',
      createdAt: '',
      updatedAt: ''
    })
  },
  isEvaluationContainerShow: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'search', 'updateEvaluation'
])

const evaluation = computed(() => props.evaluation as Evaluation)

const createdAt = computed(() => useMakeStrFromTimestamp(evaluation.value?.createdAt ?? '0000-00-00 00:00:00.000000'))
const updatedAt = computed(() => useMakeStrFromTimestamp(evaluation.value?.updatedAt ?? '0000-00-00 00:00:00.000000'))

watch(evaluation, (newVal, oldVal) => {
  rate.value = newVal.rate ? newVal.rate : 0
  text.value = newVal.text ? newVal.text: ''
})
const rate = ref(0)
const text = ref('')
watch(text, () => {
  if (text.value.length > 0) {
    alertText.value = ''
  } else {
    alertText.value = 'テキストに値を入力してください'
  }
  textOk.value = text.value.length > 0
})
const alertText = ref('')

const textOk = ref(false)

const disabledSubmit = computed(() => !textOk.value)

const rateEvent = (e: Event) => {
  e.preventDefault();
  const t = e.target as HTMLButtonElement
  rate.value = Number(t.dataset.rank)
  if (rate.value > 5) {
    rate.value = 5
  }
  if (rate.value < 1) {
    rate.value = 1
  }
}
const onSubmit = () => {
  emit('updateEvaluation', {
    rate: rate.value,
    text: text.value,
    year: evaluation.value.year,
    month: evaluation.value.month
  })
}

const tags = computed<Tag[]>(() => props.tags as Tag[])
const recurringTasks = computed<RecurringTask[]>(() => props.recurringTasks as RecurringTask[])

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
const chartTitle = computed(() => props.chartTitle)

const isShowChart = ref('pie')

const pieChartShowEvent = () => {
  isShowChart.value = 'pie'
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
  <div id="evaluation-filter-rate-container">
    <div id="evaluation-filter-container">
      <transition>
        <div id="evaluation-container" v-show="isEvaluationContainerShow || isContainerWideSize">
          <div id="evaluation-box">
            <div class="d-flex justify-content-center">
              <h5><span id="evaluation-year">{{evaluation.year}}</span>年<span id="evaluation-month">{{evaluation.month}}</span>月の評価</h5>
            </div>
            <form id="evaluation-form">
              <div id="created-updated-rate">
                <div class="_created_updated">
                  <div class="_created">
                    <div>投稿日：</div>
                    <div>{{createdAt}}</div>
                  </div>
                  <div class="_updated">
                    <div>更新日：</div>
                    <div>{{updatedAt}}</div>
                  </div>
                </div>
                <div class="form-group mb-2">
                  <label for="" class="form-label fw-bold">5段階評価：</label>
                  <div>
                    <button @click="rateEvent" v-for="n in rate" :key="n" :data-rank="n" class="_evaluation_star_on">&#9733;</button>
                    <button @click="rateEvent" v-for="n in (5 - rate)" :key="n" :data-rank="rate + n" class="_evaluation_star_off">&#9734;</button>
                  </div>
                </div>
              </div>
              <div class="form-group mb-2">
                <label for="input-evaluation-text" class="form-label fw-bold">テキスト：<small
                    style="color:var(--bs-red)">※必須</small></label>
                <textarea v-model="text" name="text" id="input-evaluation-text" class="form-control shadow-sm"
                          placeholder="文字制限なし"></textarea>
                <div id="alert-text" class="_alert">{{alertText}}</div>
              </div>
              <div class="w-100 d-flex justify-content-center">
                <button @click="onSubmit" id="evaluation-submit-btn" class="btn _btn_past_completed_rate shadow-sm" :class="{'_disabled' : disabledSubmit }" :disabled="disabledSubmit">送信</button>
              </div>
            </form>
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
                <div class="text-start">タスクの種類：</div>
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
#evaluation-filter-rate-container {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
}
#evaluation-filter-container {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  width: calc(100% - 600px);
}
#evaluation-container {
  font-size: 0.9rem;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 10px 0 0;
}
#evaluation-box {
  width: 100%;
  border: var(--middle-border);
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  padding: 20px 30px;
}
#input-evaluation-text {
  height: 120px;
}
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 .25rem rgba(255, 178, 46, 0.491) !important;
}
#created-updated-rate {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
}
._created_updated {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
}
._created, ._updated {
  flex-basis: 50%;
  display: flex;
  justify-content: center;
}
._evaluation_star_on, ._evaluation_star_off {
  background-color: transparent;
  color: var(--star-color);
  border: none;
  font-size: 1.2rem;
}
._alert {
  color: red;
  font-size: 0.8rem;
  margin-top: 5px!important;
  height: 10px;
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
  font-size: 1.4rem;
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
  #filter-box {
    padding: 20px 15px;
  }
}
@media (max-width: 1400px) {
  ._pie_chart, ._line_chart {
    padding: 0 2%;
  }
  #created-updated-rate {
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  ._created_updated {
    flex-direction: column;
    align-items: end;
    width: auto;
  }
}
@media (max-width: 1200px) {
  #evaluation-filter-rate-container {
    display: block;
  }
  #evaluation-filter-container {
    width: 100%;
    padding: 0 10px;
  }
  #evaluation-container {
    padding: 10px 10px 0 10px;
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
  #filter-container {
    padding: 10px 10px 0 10px;
    width: 100%;
  }
  #filter-box {
    padding: 30px 20px;
  }
  #rate-data-container {
    padding: 10px 20px;
    width: 100%;
  }
  #rate-data-box {
    width: 100%;
  }
}
@media (max-width: 1080px) {
  #input-evaluation-text {
    height: 160px;
  }
}
@media (max-width: 768px) {
  #evaluation-filter-container {
    padding: 0;
  }
  #evaluation-container {
    padding: 10px 10px 0 10px;
  }
  #evaluation-box {
    width: 100%;
  }
  #rate-data-container {
    padding: 10px;
  }
  #created-updated-rate {
    flex-direction: column;
  }
  ._created_updated {
    flex-direction: row;
    align-items: center;
  }
}
@media (max-width: 576px) {
  #evaluation-box {
    padding: 30px 10px;
  }
  #evaluation-submit-btn {
    width: 100%;
  }
  ._search_containers {
    padding: 10px 10px 0 10px;
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
  #created-updated-rate {
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  ._created_updated {
    flex-direction: column;
    align-items: end;
  }
}

@media (max-width: 500px) {
  #tag-btns-parent {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}

@media (max-width: 375px) {
  #created-updated-rate {
    flex-direction: column;
  }
  ._created_updated {
    display: none;
  }
}
</style>
