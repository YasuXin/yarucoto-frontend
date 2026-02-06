<script setup lang="ts">
import type {Task} from "~/interfaces";

const props = defineProps({
  task: {
    type: Object as () => Task,
    required: true
  }
})
const task = computed<Task>(() => props.task as Task)

const emit = defineEmits(['setCompleteMouseover', 'removeCompleteMouseover', 'toggleEvent'])

const isYesterday = computed(() => {
  const taskDate = new Date(task.value.dueDate)
  const today = new Date()
  return taskDate.getDate() === today.getDate() - 1
})
const isTomorrow = computed(() => {
  const taskDate = new Date(task.value.dueDate)
  const today = new Date()
  return taskDate.getDate() === today.getDate() + 1
})
const setCompleteMouseoverFlag = ref(false)
const removeCompletedMouseoverFlag = ref(false)

const fadein = ref(false)
const fadeout = ref(false)

const toggleReq = reactive({
  id: 0,
  completed: false
})

const setCompleteMouseover = (e: MouseEvent) => {
  setCompleteMouseoverFlag.value = true
  emit('setCompleteMouseover', setCompleteMouseoverFlag.value)
  const t = e.target as HTMLElement
  const btnCheckEl = t.getElementsByClassName('_completed_btn_check')[0] as HTMLElement
  if(btnCheckEl) btnCheckEl.textContent = '✓'
}

const setCompleteMouseleave = (e: MouseEvent) => {
  setCompleteMouseoverFlag.value = false
  emit('setCompleteMouseover', setCompleteMouseoverFlag.value)
  const t = e.target as HTMLElement
  const btnCheckEl = t.getElementsByClassName('_completed_btn_check')[0] as HTMLElement
  if(btnCheckEl) btnCheckEl.textContent = ''
}

const removeCompleteMouseover = () => {
  removeCompletedMouseoverFlag.value = true
  emit('removeCompleteMouseover', removeCompletedMouseoverFlag.value)
}

const removeCompleteMouseleave = () => {
  removeCompletedMouseoverFlag.value = false
  emit('removeCompleteMouseover', removeCompletedMouseoverFlag.value)
}

const toggleCompleteEvent = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  const tParent = t.parentElement as HTMLElement
  toggleReq.id = Number(tParent.dataset.id)
  if (tParent.classList.contains('_is_completed')) { // 完了済みを未完了に戻す
    toggleReq.completed = true
    fadein.value = true
    setTimeout(() => {fadein.value = false}, 100)
  } else { // 未完了を完了済みにする
    toggleReq.completed = false
    fadeout.value = true
    setTimeout(() => {fadeout.value = false}, 100)
  }
  emit('toggleEvent', toggleReq)
}
</script>

<template>
  <div class="_task_container">
    <div class="_task_box" :class="{'_completed_task_box': task.completed, '_fadeout_toggle_completed': fadeout, '_fadein_toggle_completed': fadein}">
      <div class="_task_column d-flex justify-content-between flex-column">
        <div class="_task_row d-flex w-100">
          <button v-if="task.completed" class="_completed_btn _is_completed" @click="toggleCompleteEvent" @mouseover="removeCompleteMouseover" @mouseleave="removeCompleteMouseleave" :data-id="task.id"><span class="_completed_btn_check">✓</span></button>
          <button v-if="!task.completed" class="_completed_btn _not_completed" @click="toggleCompleteEvent" @mouseover="setCompleteMouseover" @mouseleave="setCompleteMouseleave" :data-id="task.id"><span class="_completed_btn_check"></span></button>
          <div class="_task_time">
            <time>{{task.dueStartTime ? task.dueStartTime.substring(0,2) : ''}}{{task.dueStartTime ? ':' : ''}}{{task.dueStartTime ? task.dueStartTime.substring(3,5) : ''}}</time>
            {{task.dueEndTime ? ' ～ ' : ''}}
            <time>{{task.dueEndTime ? task.dueEndTime.substring(0,2) : ''}}{{task.dueEndTime ? ':' : ''}}{{task.dueEndTime ? task.dueEndTime.substring(3,5) : ''}}</time>
          </div>
          <div v-if="isYesterday" class="_is_yesterday mx-2">昨日</div>
          <div v-if="isTomorrow" class="_is_tomorrow mx-2">明日</div>
        </div>
        <div class="_task_title">{{task.title}}</div>
      </div>
    </div>
  </div>

</template>

<style scoped>
._is_yesterday {
  color: var(--bs-blue);
}
._is_tomorrow {
  color: var(--bs-red);
}
._completed_task_box {
  background-color: var(--no-active-task-box-bg-color) !important;
  box-shadow: var(--task-inset-shadow) !important;
  -webkit-box-shadow: var(--task-inset-shadow) !important;
}

._not_completed {
  margin-left: 5px;
  width: 25px;
  min-width: 25px;
  height: 25px;
  border-radius: 15px;
  border: 4px solid var(--placeholder-color);
  background-color: transparent;
  color: white;
  position: relative;
}

._not_completed:hover {
  animation-name: notCompBtnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes notCompBtnAnimation {
  0% {}
  100% {
    background-color: var(--comp-btn-animation-color);
    border-color: var(--comp-btn-animation-color);
    color: var(--completed-color);
  }
}

._is_completed {
  margin-left: 5px;
  width: 25px;
  min-width: 25px;
  height: 25px;
  border-radius: 15px;
  border: none;
  background-color: rgba(0,0,0,0.1);
  position: relative;

}
._is_completed:hover {
  animation-name: compBtnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes compBtnAnimation {
  0% {}
  100% { background-color: var(--card-bg-color);}
}
._completed_btn_check {
  position: absolute;
  display: inline-block;
  top: 2px;
  left: -3px;
  font-weight: bold;
  font-size: 40px;
  line-height: 0;
}

._is_completed span {
  color: var(--completed-color);
  content: "✓";
  left: 1px;
  top: 6px;
}
._is_completed span:hover {
  animation-name: compBtnSpanAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes compBtnSpanAnimation {
  0% {}
  100% {color: var(--completed-color-dark);}
}
._fadein_toggle_completed {
  animation-name: fadeinToggleCompleted;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
}

._fadeout_toggle_completed {
  animation-name: fadeoutToggleCompleted;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
}

@keyframes fadeinToggleCompleted {
  0% {background-color: transparent;}
  100% {
    background-color: var(--no-active-task-box-bg-color);
    box-shadow: var(--task-inset-shadow);
    -webkit-box-shadow: var(--task-inset-shadow);
  }
}

@keyframes fadeoutToggleCompleted {
  0% {
    background-color: var(--no-active-task-box-bg-color);
    box-shadow: var(--task-inset-shadow);
    -webkit-box-shadow: var(--task-inset-shadow);
  }
  100% {background-color: transparent;}
}

._task_container {
  padding-bottom: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
}

._task_box {
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  padding: 15px 20px;
  background-color: var(--card-bg-color);
}

._task_time {
  margin-left: 20px;
}

._task_title {
  margin-left: 10px;
}

@media (max-width: 768px) {
  ._task_container {
    margin-left: 0;
  }
  ._task_box {
    padding: 15px 5px 15px 10px;
  }
}
@media (max-width: 576px) {

}

</style>
