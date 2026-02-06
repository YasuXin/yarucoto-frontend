<script setup lang="ts">
import type {RecurringTask} from "~/interfaces";

const props = defineProps({
  task: {
    type: Object as () => RecurringTask,
    required: true
  }
})

const emit = defineEmits(['show'])
const task = computed(() => props.task)

const toShow = () => {
  emit('show', task.value.id)
}
</script>

<template>
  <div class="_task_container">
    <div class="_task_box d-flex">
      <div class="_task_id d-flex align-items-center _txt_limit">
        <span class="_id_no">No.</span>{{task.id}}
      </div>
      <div class="_task_column">
        <div class="_task_row d-flex justify-content-between _text_free">
          <div class="_task_left d-flex">
            <div class="_task_title _txt_limit">
              <span>{{task.title}}</span>
            </div>
            <div class="_task_tags">
              <div v-if="task.tag1" class="_tag mx-1" :class="useGetTagColor(task.tag1.color)">
                {{task.tag1.name}}
              </div>
              <div v-if="task.tag2" class="_tag mx-1" :class="useGetTagColor(task.tag2.color)">
                {{task.tag2.name}}
              </div>
              <div v-if="task.tag3" class="_tag mx-1" :class="useGetTagColor(task.tag3.color)">
                {{task.tag3.name}}
              </div>
              <div v-if="!task.tag1" class="text-secondary">
                タグが設定されていません
              </div>
            </div>
          </div>
          <div class="d-flex _task_right">
            <div class="_task_active_parent">
              <div v-if="task.isActive" class="_task_active">アクティブ</div>
              <div v-else class="_task_not_active">非アクティブ
              </div>
            </div>
            <div class="_show_btn_parent">
              <a class="_show_btn _task_link"
                 @click="toShow">詳細</a>
            </div>
          </div>
        </div>
        <div class="_task_row _task_row_2 d-flex">
          <div class="_task_description _txt_limit">
            <span>{{task.description}}</span>
          </div>
          <div class="_task_weeks d-flex justify-content-end">
            <div class="_task_week" v-if="task.isSunday" style="color: var(--bs-red);">日</div>
            <div class="_task_week" v-if="task.isMonday">月</div>
            <div class="_task_week" v-if="task.isTuesday">火</div>
            <div class="_task_week" v-if="task.isWednesday">水</div>
            <div class="_task_week" v-if="task.isThursday">木</div>
            <div class="_task_week" v-if="task.isFriday">金</div>
            <div class="_task_week" v-if="task.isSaturday" style="color: var(--bs-blue);">土</div>
          </div>
          <div v-if="task.dueStartTime"
               class="_due_times d-flex justify-content-end">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
._task_container {
  width: 100%;
}
._task_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._task_id {
  width: 100px;
  padding-left: 10px;
}
._task_column {
  width: calc(100% - 100px);
  padding-left: 10px;
}
._task_row {
  padding: 10px 0;
  border-bottom: var(--thin-border);
}
._task_left {
  width: calc(100% - 220px);
}
._task_title {
  width: calc(100% - 350px);
  margin-left: 10px;
}
._task_tags {
  width: 440px;
  border-left: var(--thin-border);
  padding: 0 5px;
  display: flex;
  flex-wrap: wrap;
}
._tag {
  padding: 1px 5px;
  border-radius: 5px;
}
._task_active_parent {
  width: 120px;
  text-align: center;
  padding: 0 5px;
  border-left: var(--thin-border);
}
._task_active {
  color: var(--completed-color);
}
._task_not_active {
  color: var(--font-gray)
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
._task_link {
  color: var(--font-color);
}
._task_link:hover {
  cursor: pointer;
}
._task_description {
  width: 60%;
  padding: 0 10px;
  font-size: 0.8rem;
}
._txt_limit {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
._task_weeks {
  width: 20%;
}
._task_week {
  margin: 0 2px;
}
._due_times {
  width: 20%;
  min-width: 110px;
}
._task_row_2 {
  border-bottom: none;
}
#tasks-title ._task_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}

@media (max-width: 1400px) {
  ._task_title {
    width: calc(100% - 340px);
    margin-left: 10px;
  }
  ._task_tags {
    width: 330px;
  }
}
@media (max-width: 960px) {
  ._task_id {
    width: 80px;
  }
  ._task_column {
    width: calc(100% - 80px);
  }
  ._task_left {
    width: calc(100% - 160px);
  }
  ._task_title {
    width: calc(100% - 240px);
    margin-left: 10px;
  }
  ._task_tags {
    width: 300px;
  }
  ._task_active_parent {
    width: 100px;
  }
  ._task_description {
    width: 60%;
  }
}
@media (max-width: 860px) {
  ._task_tags {
    display: none;
  }
}
@media (max-width: 768px) {
  ._task_id {
    padding:0;
  }
  ._task_title {
    width: 100%;
  }
  ._task_weeks {
    display: none!important;
  }
  ._task_description {
    width: 80%;
  }
}
@media (max-width: 576px) {
  ._task_box {
    width: 100%;
    margin: 0;
    padding: 0 5px 0 10px;
  }
  ._task_column {
    width: calc(100% - 50px);
  }
  ._id_no {
    display: none;
  }
  ._task_row {
    padding: 10px;
  }
  ._task_left {
    width: calc(100% - 50px);
  }
  ._task_id {
    width: 60px;
    justify-content: center;
  }
  ._task_title {
    margin: 0;
  }
  ._task_active_parent {
    display: none !important;
  }
  ._show_btn_parent {
    width: 40px;
  }
  ._task_description {
    padding: 0;
    width: 100%;
  }
  ._due_times {
    display: none !important;
  }
}
</style>
