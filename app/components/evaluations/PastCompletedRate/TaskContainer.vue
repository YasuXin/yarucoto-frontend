<script setup lang="ts">
import type {Task} from "~/interfaces";
import Pagination from "~/components/Pagination.vue";

const props = defineProps({
  tasks: {
    type: Array as () => Task[],
    default: () => []
  }
})

const tasksComputed = computed(() => props.tasks)
const tasks = ref<Task[]>()
const paginationTasks = ref<Task[]>([])
watch(tasksComputed, (newValue) => {
  tasks.value = newValue
  selectedCompleted.value = 'all'
  createPaginationEvent(true)
})

const isTasksShow = ref(false)

const closeTasksEvent = () => {
  isTasksShow.value = false
}
const selectedCompleted = ref('all')
const selectCompletedEvent = () => {
  if (selectedCompleted.value === 'all') {
    tasks.value = tasksComputed.value
  } else if (selectedCompleted.value === 'completed') {
    tasks.value = tasksComputed.value.filter(task => task.completed)
  } else if (selectedCompleted.value === 'notCompleted') {
    tasks.value = tasksComputed.value.filter(task => !task.completed)
  }
  createPaginationEvent(true)
  isTasksShow.value = true
}
const showCompletedEvent = () => {
  selectedCompleted.value = 'completed'
  selectCompletedEvent()
}
const showNotCompletedEvent = () => {
  selectedCompleted.value = 'notCompleted'
  selectCompletedEvent()
}
const showAllEvent = () => {
  selectedCompleted.value = 'all'
  selectCompletedEvent()
}

const createPaginationEvent = (init: boolean) => {
  const pageCount = 36
  if (tasks.value && tasks.value?.length > pageCount) {
    isPagination.value = true
  } else if (tasks.value && tasks.value?.length <= pageCount) {
    isPagination.value = false
  }
  if (init) {
    if (tasks.value !== undefined && tasks.value !== null) {
      paginationTotalNum.value = Math.ceil(tasks.value?.length / pageCount)
    } else {
      paginationTotalNum.value = 1
    }
    paginationCurrentNum.value = 1
  }
  paginationTasks.value = []
  if (tasks.value === undefined || tasks.value === null) return
  const start = (paginationCurrentNum.value - 1) * pageCount
  const end = start + pageCount
  for (let i = start; i < end; i++) {
    if (tasks.value[i] === undefined || tasks.value[i] === null) continue
    const task = tasks.value[i] as Task
    paginationTasks.value.push(task)
  }
}

const tasksRef = ref<HTMLElement>()
const isPagination = ref(false)
const paginationTotalNum = ref(1)
const paginationCurrentNum = ref(1)
const movePaginationEvent = async (num: number) => {
  if (num) {
    paginationCurrentNum.value = num
    createPaginationEvent(false)
  }
}
const moveFirstPaginationEvent = async () => {
  paginationCurrentNum.value = 1
  createPaginationEvent(false)
}
const moveLastPaginationEvent = async () => {
  paginationCurrentNum.value = paginationTotalNum.value
  createPaginationEvent(false)
}

const isSimpleDisplay = ref(true)
</script>

<template>
  <div v-show="isTasksShow" id="tasks-container" class="_fadein" ref="tasksRef">
    <div id="tasks-box">
      <div class="_simple_btn_parent mb-2">
        <button @click="isSimpleDisplay=!isSimpleDisplay" class="_toggle_simple_display_btn shadow-sm" :class="{'_btn_primary_on' : !isSimpleDisplay}">
          <img src="~/assets/images/show.png" width="32" alt=""></button>
      </div>
      <div id="tasks-close-btn-parent">
        <button @click="closeTasksEvent" id="tasksCloseBtn" class="d-flex justify-content-center align-items-center">
          <img src="~/assets/images/batsu.png" width="24" alt="x">
        </button>
      </div>
      <div class="d-flex justify-content-center mb-3 mt-2">
        <h5 id="tasks-title">タスク一覧</h5>
      </div>
      <div id="tasks-btn-parent" class="d-flex justify-content-center my-3">
        <button @click="showCompletedEvent" id="showCompletedTasks2" class="_tasks_btn shadow-sm" :class="{'_selected_task_btn': selectedCompleted === 'completed'}">完了</button>
        <button @click="showNotCompletedEvent" id="showNotCompletedTasks2" class="_tasks_btn shadow-sm" :class="{'_selected_task_btn': selectedCompleted === 'notCompleted'}">未完了</button>
        <button @click="showAllEvent" id="showAllTasks2" class="_tasks_btn shadow-sm" :class="{'_selected_task_btn': selectedCompleted === 'all'}">すべて</button>
      </div>
      <Pagination :isPagination="isPagination"
                  :paginationCurrentNum="paginationCurrentNum"
                  :paginationTotalNum="paginationTotalNum"
                  @moveFirst="moveFirstPaginationEvent"
                  @move="movePaginationEvent"
                  @moveLast="moveLastPaginationEvent"></Pagination>
      <transition-group tag="div" id="tasks" name="task-list" appear>
        <EvaluationsPastCompletedRateNoTasks v-show="paginationTasks.length === 0" key="0"></EvaluationsPastCompletedRateNoTasks>
        <EvaluationsPastCompletedRateTask v-show="paginationTasks.length > 0" v-for="task in paginationTasks" :key="task.id" :task="task" :isSimpleDisplay="isSimpleDisplay"></EvaluationsPastCompletedRateTask>
      </transition-group>
      <Pagination :isPagination="isPagination"
                  :paginationCurrentNum="paginationCurrentNum"
                  :paginationTotalNum="paginationTotalNum"
                  @moveFirst="moveFirstPaginationEvent"
                  @move="movePaginationEvent"
                  @moveLast="moveLastPaginationEvent"></Pagination>
    </div>
  </div>
  <div v-show="!isTasksShow" id="not-tasks-container" class="_fadein">
    <div id="not-tasks-box"  @click="showAllEvent">
      <div id="not-tasks-btn" class="d-flex justify-content-center">
        <h6 class="my-0">クリックしてタスクを表示する</h6>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-list-enter-active, .task-list-leave-active {
  transition: all 0.5s;
}
.task-list-enter-from, .task-list-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.task-list-leave-from {
  opacity: 0;
}
.task-list-move {
  transition: transform 0.5s;
}
.task-list-leave-active {
  position: absolute;
}

._toggle_simple_display_btn {
  background-color: var(--bg-color);
  border: var(--middle-border);
  border-radius: 5px;
  padding: 2px;
  position:absolute;
  top: 25px;
  right: 90px;
}

._toggle_simple_display_btn:hover {
  animation-name: btnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes btnAnimation {
  0% {}
  100% {background-color: var(--disabled-form-bg-color);}
}
._fadein {
  animation-name: fadein;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
@keyframes fadein {
   0% {opacity: 0;}
   100% {opacity: 1;}
}
#tasks-container, #not-tasks-container {
  padding: 0 10px;
}

#tasks-box, #not-tasks-box {
  position: relative;
  padding: 20px 10px;
  border-radius: 10px;
  border: var(--thin-border);
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
}
#not-tasks-box:hover {
  cursor: pointer;
}

._tasks_btn {
  border-radius: 20px;
  margin: 0 10px;
  padding: 5px 20px;
  border: none;
  color: var(--font-color);
  background-color: var(--bg-color);
  box-shadow: none;
}
._selected_task_btn {
  background-color: var(--disabled-form-bg-color);
  box-shadow: inset 3px 3px 10px rgba(0,0,0,0.5) !important;
}
._tasks_btn:hover {
  animation-name: tasksBtnAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
._selected_task_btn:hover {
  animation: none;
}
@keyframes tasksBtnAnimation {
  0% {}
  100% {background-color: var(--disabled-form-bg-color);}
}

#tasks-close-btn-parent {
  position:absolute;
  top: 30px;
  right: 40px;
}

#tasksCloseBtn {
  background-color: transparent;
  border: none;
  border-radius: 5px;
  padding: 2px;
}
#tasksCloseBtn:hover {
  animation-name: tasksCloseBtnAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
@keyframes tasksCloseBtnAnimation {
  0% {}
  100% {background-color: var(--button-hoverd-bg-color);}
}

#tasks {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px 10px;
  padding: 0 0 15px;
}

@media (max-width: 1600px) {
  #tasks {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media (max-width: 1200px) {
  #tasks-container, #not-tasks-container {
    padding: 0 10px;
  }
  #tasks {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  #tasks-container, #not-tasks-container {
    padding: 0 10px;
  }
  #tasks {
    grid-template-columns: 1fr;
  }
  #tasks-close-btn-parent {
    top: 20px;
    right: 20px;
  }
  ._toggle_simple_display_btn {
    top: 15px;
    right: 60px;
  }
}
@media (max-width: 576px) {
  #tasks-container {
    padding: 0;
  }
  #tasks-box {
    border-radius: 0;
    border: none;
    box-shadow: none !important;
    padding-bottom: 0;
  }
  #tasks-title {
    margin-top: 40px !important;
  }
  ._toggle_simple_display_btn {
    top: 15px;
    right: 60px;
    transform: scale(0.9);
  }
}
</style>
