<script setup lang="ts">
import type {RecurringTask} from "~/interfaces";

const props = defineProps({
  task: {
    type: Object as () => RecurringTask,
  },
  selectedTagId: {
    type: Number,
    default: 0
  },
  isSimpleDisplay: {
    type: Boolean,
    default: true
  }
})

const task = computed<RecurringTask>(() => props.task as RecurringTask)
const selectedTagId = computed(() => props.selectedTagId)

const deleteFadeout = ref(false)

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

const emit = defineEmits(['delete', 'activate'])

const activate = () => {
  emit('activate', task.value.id, task.value.isActive)
}
const toEdit = () => {
  navigateTo('/routines/edit/' + task.value.id)
}
const toDelete = () => {
  deleteFadeout.value = true
  setTimeout(() => {
    emit('delete', task.value.id)
  }, 200)
}
onMounted(() => {

})
</script>

<template>
  <div v-if="isTaskShow" class="_task_container" :class="{'_not_active_task' : !task.isActive}">
    <div class="_task_box" :class="{'_delete_fadeout' : deleteFadeout}">
      <div class="_task_row_1">
        <div class="_title_parent d-flex justify-content-between align-items-center w-100">
          <div class="_title_inner_parent d-flex">
            <button @click="activate" class="_activate_btn" :class="{'_activate_btn_not_active' : !task.isActive}">A</button>
            <div class="_task_title">{{task.title}}</div>
          </div>
          <div class="_time_simple_parent">
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
            <div :class="{'_hidden' : !isSimpleDisplay}" class="_simple_btns d-flex justify-content-around">
              <button class="btn _btn_primary _simple_edit" :data-id="task.id" @click="toEdit">E</button>
              <button class="btn btn-danger _simple_delete" :data-id="task.id" @click="toDelete">D</button>
            </div>
          </div>
        </div>
      </div>

      <div class="_task_row_weeks d-flex justify-content-between align-items-end" :class="{'_hidden' : props.isSimpleDisplay}">
        <div class="d-flex justify-content-center _weeks_parent">
          <div class="d-flex justify-content-around align-items-center _weeks">
            <div class="_tag_title">実行日 : </div>
            <div :class="{'_is_sunday' : task.isSunday, '_not_active_text' : !task.isActive}" class="_week d-flex justify-content-center align-items-center"><div>日</div></div>
            <div :class="{'_is_monday' : task.isMonday, '_not_active_text' : !task.isActive}" class="_week d-flex justify-content-center align-items-center"><div>月</div></div>
            <div :class="{'_is_tuesday' : task.isTuesday, '_not_active_text' : !task.isActive}" class="_week d-flex justify-content-center align-items-center"><div>火</div></div>
            <div :class="{'_is_wednesday' : task.isWednesday, '_not_active_text' : !task.isActive}" class="_week d-flex justify-content-center align-items-center"><div>水</div></div>
            <div :class="{'_is_thursday' : task.isThursday, '_not_active_text' : !task.isActive}" class="_week d-flex justify-content-center align-items-center"><div>木</div></div>
            <div :class="{'_is_friday' : task.isFriday, '_not_active_text' : !task.isActive}" class="_week d-flex justify-content-center align-items-center"><div>金</div></div>
            <div :class="{'_is_saturday' : task.isSaturday, '_not_active_text' : !task.isActive}" class="_week d-flex justify-content-center align-items-center"><div>土</div></div>
          </div>
        </div>

        <div class="_tags_parent_r d-flex justify-content-end">
          <div class="_tags d-flex justify-content-center align-items-center">
            <div class="_tag_title">タグ：</div>
            <div v-if="task.tag1" class="_tag" :class="useGetTagColor(task.tag1.color)">
              {{task.tag1.name}}
            </div>
            <div v-if="task.tag2" class="_tag" :class="useGetTagColor(task.tag2.color)">
              {{task.tag2.name}}
            </div>
            <div v-if="task.tag3" class="_tag" :class="useGetTagColor(task.tag3.color)">
              {{task.tag3.name}}
            </div>
            <div v-if="!task.tag1" class="text-secondary">
              タグが設定されていません
            </div>
          </div>
        </div>
      </div>
      <div class="_task_row_2 my-2 pt-2 d-flex justify-content-between align-items-center" :class="{'_hidden' : props.isSimpleDisplay}">
        <div class="_task_description">{{task.description}}</div>
        <div class="_task_btns d-flex justify-content-around">
          <button @click="toEdit" class="_to_edit_btn btn _btn_primary btn-sm shadow-sm">編集</button>
          <button @click="toDelete" class="_delete_btn btn btn-danger btn-sm shadow-sm">削除</button>
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
._time_simple_parent {
  display: flex;
  justify-content: end;
  align-items: center;
  min-width: 220px;
}
._task_time {
  margin-right: 10px;
  text-align: right;
}
._task_time_l {
  width: auto;
}
._task_time_s {
  width: auto;
}
._simple_btns {
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

._task_box {
  height: 100%;
  width: 100%;
  padding: 8px 0 3px;
}

._not_active_task {
  background-color: var(--no-active-task-box-bg-color);
  box-shadow: var(--task-inset-shadow);
  -webkit-box-shadow: var(--task-inset-shadow);
  color: var(--disabled-form-font-color)!important;
}

._task_row_1 {
  width: 100%;
  padding-bottom: 5px;
}
._title_parent {
  height: 30px;
}
._title_inner_parent {
  width: auto;
  display: flex;
  justify-content: start;
  align-items: center;
  position: relative;
}

._activate_btn {
  position: absolute;
  top: -5px;
  left: 0;
  color: rgb(240,240,240);
  margin: 0 8px;
  width: 30px;
  height: 30px;
  border-radius: 20%;
  border: solid 1px rgb(200, 60, 60);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  background-image: linear-gradient(0, rgb(120, 0, 0) 0%, rgb(180, 0, 0) 100%);
}
._activate_btn_not_active {
  color: var(--font-gray);
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.8);
  background-image: linear-gradient(0, rgb(30, 0, 0) 0%, rgb(60, 0, 0) 100%);
}
@media (prefers-color-scheme: light) {
  ._activate_btn {
    background-image: linear-gradient(0, rgb(180, 0, 0) 0%, rgb(240, 0, 0) 100%);
  }
  ._activate_btn_not_active {
    background-image: linear-gradient(0, rgb(90, 0, 0) 0%, rgb(120, 0, 0) 100%);
  }
}
._activate_btn:hover {
  animation: activateBtnHoverAnimation 0.4s ease-in-out;
}
@keyframes activateBtnHoverAnimation {
  0% {}
  50% {transform: scale(1.3);}
  100% {}
}

._task_title {
  margin-left: 56px;
  display: inline-block;
  margin-bottom: 0;
}

._task_btns {
  width: 120px;
  height: 30px;
  min-width: 120px;
}

._task_row_weeks {
  flex-direction: column;
  justify-content: center !important;
  align-items: center !important;
  border-top: var(--thin-border);
  margin: 0 10px;
}

._weeks_parent {
  padding-top: 5px;
}

._weeks {
  width: 330px;
}

._week {
  font-size: 0.8rem;
  width: 25px;
  height: 25px;
  color: rgb(220, 220, 220);
}
@media (prefers-color-scheme: dark) {
  ._week {
    color: var(--disabled-form-font-color);
  }
}
._is_sunday {
  border-bottom: 2px solid var(--bs-red);
  color: var(--bs-red);
  background-color: transparent;
  box-shadow: none;
}

._is_saturday {
  border-bottom: 2px solid var(--bs-blue);
  color: var(--bs-blue);
  background-color: transparent;
  box-shadow: none;
}

._is_monday,
._is_tuesday,
._is_wednesday,
._is_thursday,
._is_friday {
  border-bottom: 2px solid var(--font-color);
  color: var(--font-color);
  background-color: transparent;
  box-shadow: none;
}

._tags {
  margin-top: 5px;
}

._tag {
  border-radius: 3px;
  font-size: 0.8rem;
  padding: 2px 10px;
  margin-left: 10px;
  font-family: "Kosugi Maru", sans-serif;
  font-weight: 400;
  font-style: normal;
  vertical-align: middle;

}

._tag_title {
  font-size: 0.8rem;
}

._task_row_2 {
  padding-left: 10px;
  padding-right: 0;
  margin-right: 10px;
  margin-left: 10px;
  border-top: var(--thin-border);
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

._not_active_text {
  color: var(--disabled-form-font-color);
}
@media (max-width: 1080px) {
  ._task_box {
    margin: 0;
  }
  ._task_row_1 {
    flex-direction: column;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding-bottom: 5px;
  }
  ._task_row_weeks {
    flex-direction: row;
    justify-content: space-between !important;
    align-items: end !important;
    margin: 0 10px;
    padding-left: 10px;
  }
  ._tags {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
  }
  ._tag {
    margin-left: 5px;
  }
  ._weeks {
    width: 260px;
  }
  ._task_row_2 {
    margin: 0 10px;
    padding-top: 5px;
  }
  ._task_btns {
    flex-direction: row;
    min-width: 120px;
    min-height: 30px;
  }
}

@media (max-width: 960px) {
  ._task_container {
    min-height: 70px;
  }
  ._time_simple_parent {
    width: 100%;
    min-width: auto;
  }
  ._task_time {
    border: none;
    width: calc(100% - 80px);
    max-width: 55%;
    text-align: center;
    margin-right: 0;
    margin-top: 5px;
    padding: 0;
  }
  ._title_parent {
    flex-direction: column !important;
    height: auto;
  }
  ._title_inner_parent {
    width: 100%;
    justify-content: center;
  }
  ._task_title {
    margin: 0;
  }
  ._task_row_weeks {
    flex-direction: column;
    justify-content: space-around !important;
    align-items: center !important;
    margin: 0;
  }
  ._tags {
    margin-top: 5px !important;
  }
  ._weeks_parent {
    padding: 5px 0 3px 0;
  }
  ._weeks {
    width: 300px;
  }
  ._task_btns {
    flex-direction: column;
    width: 60px;
    min-width: 60px;
    min-height: 70px;
  }
  ._task_row_2 {
    margin: 0;
    padding-left: 20px;
  }
}

@media (max-width: 867px) {
  ._task_container {
    min-height: auto;
  }
  ._time_simple_parent {
    display: flex;
    justify-content: end;
    align-items: center;
    min-width: 220px;
    width: auto;
  }
  ._task_time {
    width: auto;
    margin-right: 10px;
    text-align: right;
  }
  ._task_time_l {
    width: auto;
  }
  ._task_time_s {
    width: auto;
  }
  ._tags {
    margin-bottom: 0 !important;
    margin-top: 10px !important;
  }
  ._tag_title {
    font-size: 0.7rem;
  }
  ._title_parent {
    flex-direction: row !important;
  }
  ._title_inner_parent {
    width: auto;
    justify-content: start !important;
  }
  ._task_title {
    margin-left: 56px;
  }
  ._task_box {
    margin: 0;
  }
  ._task_row_1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding-bottom: 5px;
  }
  ._task_row_weeks {
    flex-direction: row;
    justify-content: space-between !important;
    align-items: center !important;
    margin: 0 10px;
    padding-left: 0;
    padding-top: 7px;
  }
  ._tags {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
  }
  ._tag {
    margin-left: 5px;
  }
  ._weeks {
    width: 200px;
  }
  ._week {
    font-size: 0.8rem;
    width: 20px;
    height: 20px;
  }
  ._task_row_2 {
    margin: 0 10px;
    padding-left: 10px;
    padding-top: 5px;
    border-top: var(--thin-border);
  }
  ._task_btns {
    flex-direction: row;
    min-width: 120px;
    min-height: 30px;
  }
}

@media (max-width: 576px) {
  ._task_container {
    width: calc(100% - 20px);
    margin: 0 10px;
  }
  ._task_box {
    margin-left: 0;
  }
  ._title_inner_parent {
    margin-left: 5px;
    min-width: 0 !important;
    width: auto !important;
    max-width: 300px !important;
  }
  ._task_row_weeks {
    flex-direction: column;
    justify-content: space-around !important;
    align-items: center !important;
    margin-left: 10px;
  }
  ._task_row_1 {
    height: auto;
  }
  ._task_row_2 {
    padding-left: 30px;
    margin-right: 10px;
    margin-left: 10px;
  }
  ._task_btns {
    flex-direction: column;
    width: 60px;
    min-width: 60px;
    min-height: 70px;
  }
  ._weeks_parent {
    padding: 5px 0;
  }
  ._weeks {
    width: 320px;
  }
  ._tags {
    margin-top: 5px !important;
    width: 100%;
  }
  ._tag {
    font-size: 0.8rem;
    padding: 0 3px;
  }
  ._tag_title {
    font-size: 0.8rem;
  }
  ._task_description {
    font-size: 0.8rem;
    overflow-wrap: break-word;
  }
}

@media(max-width: 500px) {
  ._task_container {
    min-height: 70px;
  }
  ._title_inner_parent {
    justify-content: center !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0;
  }
  ._weeks {
    width: 240px;
  }
  ._task_row_2 {
    padding-left: 10px;
    margin-left: 10px;
  }
  ._title_parent {
    flex-direction: column !important;
    align-items: center !important;
  }
  ._task_title {
    margin: 0;
  }
  ._task_time {
    border: none;
    width: 100%;
    max-width: 100%;
    text-align: center;
    margin-right: 0;
    margin-top: 5px;
    padding: 0;
  }
  ._time_simple_parent {
    width: 100%;
    min-width: auto;
  }
  ._simple_btns {
    width: 0 !important;
  }
  ._simple_edit {
    position: absolute;
    top: -5px;
    right: 5px;
    padding: 0.2rem 0.7rem !important;
    margin: 0 !important;
  }
  ._simple_delete {
    position: absolute;
    top: 25px;
    right: 5px;
    padding: 0.2rem 0.7rem !important;
    margin: 0 !important;
  }
}
</style>
