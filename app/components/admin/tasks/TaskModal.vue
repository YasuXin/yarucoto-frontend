<script setup lang="ts">
import type {AdminTask, AdminUser} from "~/interfaces";

const props = defineProps({
  task: {
    type: Object as () => AdminTask,
    required: true
  },
  user: {
    type: Object as () => AdminUser,
    required: true
  }
})

const emits = defineEmits(['delete', 'return'])

const task = computed(() => props.task)
const user = computed(() => props.user)

const createdAt = computed(() => useMakeStrFromTimestamp(task.value.createdAt))
const updatedAt = computed(() => useMakeStrFromTimestamp(task.value.updatedAt))

const onDelete = () => {
  emits('delete')
}
const onReturn = () => {
  emits('return')
}
const toUser = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + user?.value?.id)
}
</script>

<template>
  <div class="_modal_background">
    <div class="_modal_window">
      <div class="d-flex justify-content-center">
        <h5>タスク詳細</h5>
      </div>
      <div id="show-container" class="d-flex justify-content-center">
        <div id="show-box">
          <div id="row0" class="_row">
            <div class="_left_item">会員名：</div>
            <a @click="toUser" class="_right_item _normal_link">{{user?.username}}</a>
          </div>
          <div id="row1" class="_row">
            <div class="_left_item">ID：</div>
            <div class="_right_item">{{task?.id}}</div>
          </div>
          <div id="row2" class="_row">
            <div class="_left_item">タイトル：</div>
            <div class="_right_item">{{task?.title}}</div>
          </div>
          <div id="row8" class="_row" v-if="task?.isRecurring">
            <div class="_left_item"></div>
            <div class="_right_item">（ルーティーンタスク）</div>
          </div>
          <div id="row3" class="_row">
            <div class="_left_item">説明：</div>
            <div class="_right_item" :class="{'_text_gray' : task?.description === ''}">
              {{task?.description !== '' ? task?.description : '設定されていません'}}
            </div>
          </div>
          <div id="row4" class="_row">
            <div class="_left_item">完了・未完了：</div>
            <div v-if="task?.completed" class="_right_item _task_completed">完了</div>
            <div v-else class="_right_item _text_gray">未完了</div>
          </div>
          <div id="row5" class="_row">
            <div class="_left_item">日付：</div>
            <div v-if="task?.dueDate" class="_right_item">{{task?.dueDate}}</div>
          </div>
          <div id="row6" class="_row">
            <div class="_left_item">開始時間：</div>
            <div class="_right_item" :class="{'_text_gray' : !task?.dueStartTime}">
              {{task?.dueStartTime ? task?.dueStartTime.substring(0,5) : '設定されていません'}}
            </div>
          </div>
          <div id="row7" class="_row">
            <div class="_left_item">終了時間：</div>
            <div class="_right_item" :class="{'_text_gray' : !task?.dueEndTime}">
              {{task?.dueEndTime ? task?.dueEndTime.substring(0,5) : '設定されていません'}}
            </div>
          </div>
          <div id="row9" class="_row">
            <div class="_left_item">タグ：</div>
            <div v-if="task?.tag1" class="_right_item d-flex">
              <div v-if="task?.tag1" :class="useGetTagColor(task?.tag1.color)" class="_tag">{{task?.tag1.name}}</div>
              <div v-if="task?.tag2" :class="useGetTagColor(task?.tag2.color)" class="_tag">・<span>{{task?.tag2.name}}</span></div>
              <div v-if="task?.tag3" :class="useGetTagColor(task?.tag3.color)" class="_tag">・<span>{{task?.tag3.name}}</span></div>
            </div>
            <div v-else class="_right_item _text_gray">設定されていません</div>
          </div>
          <div id="row10" class="_row">
            <div class="_left_item">作成日時：</div>
            <div class="_right_item">
              {{createdAt}}
            </div>
          </div>
          <div id="row11" class="_row">
            <div class="_left_item">更新日時：</div>
            <div class="_right_item">
              {{updatedAt}}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center align-items-center w-100 mt-4">
        <div style="width: 300px;" class="d-flex justify-content-around align-items-center">
          <button @click="onDelete" class="btn btn-danger">削除</button>
          <button @click="onReturn" class="btn _btn_primary">戻る</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
@import "~/assets/css/modal_container.css";
._row {
  display: flex;
  margin: 10px 0;
}
._left_item {
  width: 100px;
  margin-right: 10px;
  text-align: right;
}
._right_item {
  max-width: calc(100% - 110px);
}
._text_gray {
  color: var(--font-gray);
}
._task_completed {
  color: var(--completed-color);
  font-weight: bold;
}
._tag {
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.8rem;
}
</style>
