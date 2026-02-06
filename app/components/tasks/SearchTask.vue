<script setup lang="ts">
import type {Task} from "~/interfaces";

const props = defineProps({
  task: {
    type: Object as () => Task,
  },
  selectedTagId: {
    type: Number,
    default: 0
  },
  isSimpleDisplay: {
    type: Boolean,
    default: false
  }
})

const task = computed<Task>(() => props.task as Task)
const selectedTagId = computed(() => props.selectedTagId)

const isTaskShow = computed(() => {
  const t = task.value
  if (selectedTagId.value === 0) return true
  if (t.tag1 && selectedTagId.value !== 0) {
    if (t.tag1.id === selectedTagId.value) {
      return true
    }
  }
  if (t.tag2 && selectedTagId.value !== 0) {
    if (t.tag2.id === selectedTagId.value) {
      return true
    }
  }
  if (t.tag3 && selectedTagId.value !== 0) {
    if (t.tag3.id === selectedTagId.value) {
      return true
    }
  }

  return false
})

const emit = defineEmits(['setCompleteMouseover', 'removeCompleteMouseover', 'toggleEvent', 'delete'])

const isBeforeYesterday = ref<boolean>(useIsBeforeYesterday(new Date(task.value?.dueDate) ?? '0000-00-00'))

const setCompleteMouseoverFlag = ref(false)
const removeCompletedMouseoverFlag = ref(false)

const toggleFadein = ref(false)
const toggleFadeout = ref(false)
const deleteFadeout = ref(false)

const toggleReq = reactive({
  id: 0,
  completed: false
})

const setCompleteMouseover = (e: MouseEvent) => {
  setCompleteMouseoverFlag.value = true
  emit('setCompleteMouseover', setCompleteMouseoverFlag.value)
  const t = e.target as HTMLElement
  const btnCheckEl = t.getElementsByClassName('_completed_btn_check')[0] as HTMLElement
  if (btnCheckEl) btnCheckEl.textContent = '✓'
}

const setCompleteMouseleave = (e: MouseEvent) => {
  setCompleteMouseoverFlag.value = false
  emit('setCompleteMouseover', setCompleteMouseoverFlag.value)
  const t = e.target as HTMLElement
  const btnCheckEl = t.getElementsByClassName('_completed_btn_check')[0] as HTMLElement
  if (btnCheckEl) btnCheckEl.textContent = ''
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
    toggleFadein.value = true
    setTimeout(() => {toggleFadein.value = false}, 100)
  } else { // 未完了を完了済みにする
    toggleReq.completed = false
    toggleFadeout.value = true
    setTimeout(() => {toggleFadeout.value = false}, 100)
  }
  emit('toggleEvent', toggleReq)
}

const toEdit = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  navigateTo(`/tasks/edit/${Number(t.dataset.id)}`)
}
const toDelete = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  deleteFadeout.value = true
  setTimeout(() => {
    emit('delete', Number(t.dataset.id))
  }, 200)
}
</script>

<template>
  <div v-if="isTaskShow" class="_task_container" :class="{'_completed_task_container' : task.completed, '_fadeout_toggle_completed': toggleFadeout, '_fadein_toggle_completed': toggleFadein }">
    <div class="_task_box" :class="{'_completed_task_box': task.completed, '_delete_fadeout' : deleteFadeout}">
      <div class="_task_row_1 mt-2" :class="{'_simple_row_1' : isSimpleDisplay}">
        <div class="_title_parent d-flex justify-content-between  align-items-start w-100">
          <div class="d-flex _title_inner_parent">
            <button v-if="task.completed" class="_completed_btn _is_completed" @click="toggleCompleteEvent" @mouseover="removeCompleteMouseover" @mouseleave="removeCompleteMouseleave" :data-id="task.id"><span class="_completed_btn_check">✓</span></button>
            <button v-if="!task.completed" class="_completed_btn _not_completed" @click="toggleCompleteEvent" @mouseover="setCompleteMouseover" @mouseleave="setCompleteMouseleave" :data-id="task.id"><span class="_completed_btn_check"></span></button>
            <div class="_task_title"><p class="m-0 p-0" :class="{ '_title_recurring' : task.isRecurring}">{{task.title}}</p></div>
          </div>
          <div class="_task_date_time">
            <div class="_task_date">
              <time :datetime="task.dueDate">
                {{task.dueDate.substring(0,4)}}/{{task.dueDate.substring(5,7)}}/{{task.dueDate.substring(8,10)}}
              </time>
            </div>
            <div class="_task_time" :class="{'_hidden' : !task.dueStartTime && !task.dueEndTime,
        '_task_time_s' : task.dueStartTime && !task.dueEndTime,
        '_task_time_l' : task.dueStartTime && task.dueEndTime }">
              <time v-if="task.dueStartTime" :datetime="task.dueStartTime">
                {{Number(task.dueStartTime.substring(0, 2))}}
                :
                {{task.dueStartTime.substring(3, 5)}}
              </time>{{task.dueEndTime ? ' ～ ' : ''}}
              <time v-if="task.dueEndTime" :datetime="task.dueEndTime">
                {{Number(task.dueEndTime.substring(0, 2))}}
                :
                {{task.dueEndTime.substring(3, 5) }}</time>
            </div>
          </div>
          <div :class="{'_hidden' : !isSimpleDisplay || (task.isRecurring && !isBeforeYesterday)}" class="_simple_btns d-flex justify-content-around mt-2">
            <button class="btn _btn_primary _simple_edit" :data-id="task.id" @click="toEdit">E</button>
            <button class="btn btn-danger _simple_delete" :data-id="task.id" @click="toDelete">D</button>
          </div>
        </div>
        <div class="_tags_parent d-flex justify-content-center" :class="{'_hidden' : isSimpleDisplay}">
          <div class="_tags d-flex justify-content-center align-items-center">
            <div class="_tag_title">タグ：</div>
            <div v-if="task.tag1" class="_tag" :class="{'_c_default' : task.tag1.color == 1,
             '_c_red' : task.tag1.color == 2, '_c_orange' : task.tag1.color == 3, '_c_yellow': task.tag1.color == 4,
             '_c_green' : task.tag1.color == 5, '_c_blue' : task.tag1.color == 6, '_c_indigo': task.tag1.color == 7,
             '_c_purple' : task.tag1.color == 8 }">
              {{task.tag1.name}}
            </div>
            <div v-if="task.tag2" class="_tag" :class="{'_c_default' : task.tag2.color == 1,
             '_c_red' : task.tag2.color == 2, '_c_orange' : task.tag2.color == 3, '_c_yellow': task.tag2.color == 4,
             '_c_green' : task.tag2.color == 5, '_c_blue' : task.tag2.color == 6, '_c_indigo': task.tag2.color == 7,
             '_c_purple' : task.tag2.color == 8 }">
              {{task.tag2.name}}
            </div>
            <div v-if="task.tag3" class="_tag" :class="{'_c_default' : task.tag3.color == 1,
             '_c_red' : task.tag3.color == 2, '_c_orange' : task.tag3.color == 3, '_c_yellow': task.tag3.color == 4,
             '_c_green' : task.tag3.color == 5, '_c_blue' : task.tag3.color == 6, '_c_indigo': task.tag3.color == 7,
             '_c_purple' : task.tag3.color == 8 }">
              {{task.tag3.name}}
            </div>
            <div v-if="!task.tag1" class="text-secondary">
              タグが設定されていません
            </div>
          </div>
        </div>
      </div>
      <div class="_task_row_2 my-2 pt-2 d-flex justify-content-between" :class="{'_hidden' : isSimpleDisplay}">
        <div class="_task_description">{{task.description}}</div>
        <div class="_task_btns d-flex justify-content-around">
          <button @click="toEdit" :data-id="task.id" :class="{'_hidden' : task.isRecurring && !isBeforeYesterday}" class="_to_edit_btn btn _btn_primary btn-sm shadow-sm">編集</button>
          <button @click="toDelete" :data-id="task.id" :class="{'_hidden' : task.isRecurring && !isBeforeYesterday}" class="_delete_btn btn btn-danger btn-sm shadow-sm">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
._delete_fadeout {
  animation-name: fadeoutDelete;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes fadeoutDelete {
  0% {opacity: 1;}
  100% {opacity: 0;}
}
.text-secondary {
  font-size: 0.8rem;
  margin-left: 10px;
}
._task_date_time {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  min-width: 125px;
}
._task_date {
  display: flex;
  align-items: center;
  text-align: right;
}
._task_time {
  display: flex;
  align-items: center;
  justify-content: end;
  text-align: right;
}
._task_time_s {
  width: 3.5rem;
}
._task_time_l {
  width: 7.5rem;
}
._simple_btns {
  margin-right: 5px;
  width: 80px;
}
._task_container {
  position: relative;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  border-radius: 10px;
  padding: 5px;
  background-color: var(--card-bg-color);
}

._completed_task_container {
  background-color: var(--no-active-task-box-bg-color);
  box-shadow: var(--task-inset-shadow);
  -webkit-box-shadow: var(--task-inset-shadow);
}

._task_box {
  height: 100%;
  width: 100%;
  padding-top: 0;
}
._simple_row_1 {
  margin-bottom: 7px;
}
._task_row_1 {
  width: 100%;
}
._title_inner_parent {
  width: calc(100% - 210px);
  padding: 0 10px;
}
._task_title {
  width: auto;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-left: 10px;
}

._task_title p {
  display: inline-block;
  margin-bottom: 0;
}

._task_btns {
  width: 120px;
  height: 30px;
  min-width: 120px;
}

._task_row_2 {
  padding-left: 10px;
  padding-right: 0;
  margin-right: 10px;
  margin-left: 10px;
  border-top: var(--thin-border);
}

._title_recurring::after {
  content: "ルーティーン";
  border-radius: 5px;
  background-color: var(--theme-color1);
  color: white;
  font-size: 8px;
  padding: 2px 8px;
  margin-left: 6px;
}

._task_description {
  font-size: 12px;
  overflow-wrap: break-word;
  width: auto;
  margin-right: 5px;
}

._task_btns {
  flex-direction: column;
  width: 60px;
  min-width: 60px;
  min-height: 70px;
}

._not_completed {
  margin-left: 5px;
  width: 25px;
  min-width: 25px;
  height: 25px;
  border-radius: 15px;
  border: 4px solid var(--placeholder-color);
  background-color: transparent;
  color: var(--completed-color);
  position: relative;
}

._not_completed:hover {
  animation-name: compBtnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes compBtnAnimation {
  0% {}
  100% {
    background-color: var(--bg-color);
    border-color: var(--bg-color);
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
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

._fadeout_toggle_completed {
  animation-name: fadeoutToggleCompleted;
  animation-duration: 1s;
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
  100% {
    background-color: transparent;
  }
}

._tags_parent {
  border-top: var(--thin-border);
  margin: 10px 10px 8px 10px;
}

._tags {
  margin-top: 5px;
  flex-wrap: wrap;
}

._tag {
  border-radius: 3px;
  margin: 3px 0 0 5px;
  font-family: "Kosugi Maru", sans-serif;
  font-weight: 400;
  font-style: normal;
  vertical-align: middle;
  padding: 0 5px;
}

._tag_title {
  font-size: 0.8rem;
}

@media (max-width: 1080px) {
  ._tag {
    font-size: 0.8rem;
  }

  ._task_row_1 {
    flex-direction: column;
    justify-content: space-around;
    align-items: start;
    height: auto;
  }

  ._task_title {
    margin-left: 20px;
  }

  ._task_row_2 {
    margin-left: 30px;
  }

  ._task_btns {
    flex-direction: row;
    width: 120px;
    min-width: 120px;
    min-height: auto;
  }

  ._tags_parent {
    justify-content: end !important;
    margin-right: 10px;
    padding-right: 10px;
    margin-left: 30px;
  }
}

@media (max-width: 768px) {
  ._task_title {
    margin-left: 30px;
    justify-content: start;
    margin-right: 0;
  }

  ._task_btns {
    flex-direction: row;
    width: 120px;
    min-width: 120px;
    min-height: auto;
  }

  ._title_recurring::after {
    content: "ルーティーン";
  }

  ._tag {
    font-size: 0.8rem;
  }

  ._title_parent {
    flex-direction: row !important;
  }
}

@media (max-width: 576px) {
  ._task_container {
    margin: 0;
    width: 100%;
  }

  h4 {
    font-size: 1.2rem;
  }

  ._tags {
    width: 100%;
  }

  ._tag {
    font-size: 0.7rem;
    padding: 0 3px;
  }

  ._tag_title {
    font-size: 0.8rem;
  }

  ._task_row_1 {
    height: auto;
  }

  ._tags_parent {
    margin-right: 10px;
    margin-left: 20px;
  }

  ._task_row_2 {
    padding-left: 30px;
    margin-right: 10px;
    margin-left: 20px;

  }

  ._task_title {
    margin-left: 20px;
  }

  ._task_description {
    font-size: 0.8rem;
    overflow-wrap: break-word;

  }

  ._task_btns {
    flex-direction: column;
    width: 60px;
    min-width: 60px;
    min-height: 70px;
  }

  ._title_recurring::after {
    content: "ル";
  }

}

@media (max-width: 500px) {
  ._title_inner_parent {
    padding-right: 0;
  }
  ._task_title {
    width: 100%;
    justify-content: center;
    margin-left: 0;
    margin-right: 35px;
  }
  ._task_date_time {
    border: none;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    padding: 0;
    margin: 0 10px 0 0;
  }
  ._task_date {
    border: none;
    width: auto;
    justify-content: center;
    padding: 0;
    margin: 0 10px 0 0;
  }
  ._task_time {
    border: none;
    width: auto;
    justify-content: center;
    padding: 0;
    margin: 0 10px 0 0;
  }
  ._title_parent {
    flex-direction: column !important;
  }
  ._title_parent>div.d-flex {
    width: 100%;
  }
  ._simple_btns {
    width: 0 !important;
  }
  ._simple_edit {
    position: absolute;
    top: 10px;
    right: 12px;
    padding: 0.2rem 0.7rem !important;
    margin: 0 !important;
  }
  ._simple_delete {
    position: absolute;
    top: 40px;
    right: 12px;
    padding: 0.2rem 0.7rem !important;
    margin: 0 !important;
  }
  ._tags_parent {
    margin-left: 10px;
    margin-right: 10px;
  }
  ._task_row_2 {
    padding-left: 10px;
    margin-left: 10px;
  }
}
</style>
