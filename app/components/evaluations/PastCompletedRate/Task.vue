<script setup lang="ts">
import type {Task} from "~/interfaces";

const props = defineProps({
  task: {
    type: Object as () => Task,
    required: true
  },
  isSimpleDisplay: {
    type: Boolean,
    default: false
  }
})

const task =  computed(() => props.task)

</script>

<template>
  <div class="_task_container">
    <div class="_task_box">
      <div class="_task_row_1 mt-2" :class="{'_simple_row_1' : isSimpleDisplay}">
        <div class="_title_parent d-flex justify-content-between w-100">
          <div class="d-flex mb-1">
            <div class="_comp d-flex justify-content-center align-items-center" :class="{'_is_completed' : task.completed, '_not_completed' : !task.completed}">
              <div>{{task.completed ? '✓' : '-'}}</div>
            </div>
            <div class="_task_title"><p class="m-0 p-0" :class="{'_title_recurring' : task.isRecurring}">{{task.title}}</p></div>
          </div>
          <div class="_task_datetime d-flex justify-content-center">
            <div class="_task_date">
              <time :datetime="task.dueDate">{{task.dueDate.substring(0,4)}}/{{task.dueDate.substring(5,7)}}/{{task.dueDate.substring(8,10)}}</time>
            </div>
            <div v-if="task.dueStartTime" class="_task_time">
              <time>{{task.dueStartTime ? task.dueStartTime.substring(0,2) : ''}}{{task.dueStartTime ? ':' : ''}}{{task.dueStartTime ? task.dueStartTime.substring(3,5) : ''}}</time>
              {{task.dueEndTime ? ' ～ ' : ''}}
              <time>{{task.dueEndTime ? task.dueEndTime.substring(0,2) : ''}}{{task.dueEndTime ? ':' : ''}}{{task.dueEndTime ? task.dueEndTime.substring(3,5) : ''}}</time>
            </div>
          </div>
        </div>
        <div class="_task_tags_parent d-flex justify-content-center" :class="{'_hidden' : isSimpleDisplay}">
          <div class="_task_tags d-flex justify-content-center align-items-center">
            <div class="_task_tag_title">タグ：</div>
            <div v-if="task.tag1" class="_task_tag" :class="useGetTagColor(task.tag1.color)">
              {{task.tag1.name}}
            </div>
            <div v-if="task.tag2" class="_task_tag" :class="useGetTagColor(task.tag2.color)">
              {{task.tag2.name}}
            </div>
            <div v-if="task.tag3" class="_task_tag" :class="useGetTagColor(task.tag3.color)">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
._task_container {
  position: relative;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  border-radius: 10px;
  padding: 10px;
  background-color: var(--card-bg-color);
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

._task_date {
  margin-left: 0;
  width: auto;
  min-width: 70px;
  text-align: center;
  margin-right: 16px;
}

._task_time {
  margin-right: 16px;
  padding-left: 10px;
  border-left: var(--thin-border);
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

._task_tags_parent {
  border-top: var(--thin-border);
  margin: 8px 10px 8px 30px;
}

._task_tags {
  margin-top: 5px;
  flex-wrap: wrap;
}

._task_tag {
  border-radius: 3px;
  margin: 3px 0 0 5px;
  font-family: "Kosugi Maru", sans-serif;
  font-weight: 400;
  font-style: normal;
  vertical-align: middle;
  padding: 0 5px;
  font-size: 0.7rem;
}

._task_tag_title {
  font-size: 0.8rem;
}

._not_completed {
  background-color: gray;
}

._is_completed {
  background-color: var(--completed-color);
}

._comp {
  border-radius: 12px;
  color: white;
  margin-left: 15px;
  margin-right: 5px;
  width: 20px;
  min-width: 20px;
  height: 20px;
  padding-top: 1px;
  text-align: center;
  font-size: 0.7rem;
}
._title_parent {
  flex-direction: column !important;
}
@media (max-width: 960px) {
  ._title_parent {
    flex-direction: column !important;
  }
  ._task_title {
    margin-left: 10px;
  }
}

@media (max-width: 768px) {
  ._task_title {
    margin-left: 10px;
    justify-content: start;
    margin-right: 0;
  }
  ._task_date {
    margin-right: 0;
  }
  ._task_time {
    margin-right: 10px;
  }
  ._task_tags_parent {
    justify-content: end !important;
    margin-right: 20px;
    margin-left: 30px;
  }
  ._task_tag {
    font-size: 0.8rem;
  }
  ._title_parent {
    flex-direction: row !important;
  }
  ._title_recurring::after {
    content: "ル";
  }
}

@media (max-width: 576px) {
  ._task_container {
    margin: 0;
    width: 100%;
  }
  ._task_tags {
    width: 100%;
  }
  ._task_tag {
    font-size: 0.8rem;
    padding: 0 3px;
  }
  ._task_tag_title {
    font-size: 0.8rem;
  }
  ._task_row_1 {
    height: auto;
  }
  ._task_tags_parent {
    margin-right: 10px;
    margin-left: 20px;
  }
  ._task_row_2 {
    padding-left: 30px;
    margin-right: 10px;
    margin-left: 20px;
  }
  ._task_title {
    margin-left: 5px;
  }
  ._task_description {
    font-size: 0.8rem;
    overflow-wrap: break-word;
  }
  ._task_time {
    margin-right: 0;
  }
}

@media (max-width: 500px) {
  ._task_title {
    width: 100%;
    justify-content: center;
    margin-left: 10px;
    margin-right: 25px;
  }

  ._task_time {
    border: none;
    width: auto;
    text-align: center;
    margin-right: 0;
    padding-left: 10px;
  }
  ._task_datetime {
    margin-top: 5px;
  }
  ._task_date {
    margin: 0;
  }

  ._task_datetime {
    width: 105px;
    min-width: 105px;
  }

  ._task_datetime {
    width: 50px;
    min-width: 50px;
  }

  ._title_parent {
    flex-direction: column !important;
  }

  ._title_parent>div.d-flex {
    width: 100%;
  }

  ._task_tags_parent {
    margin-left: 10px;
    margin-right: 10px;
  }

  ._task_row_2 {
    padding-left: 10px;
    margin-left: 10px;
  }
}
</style>
