<script setup lang="ts">
import type {AdminGoal, AdminUser} from "~/interfaces";

const props = defineProps({
  goal: {
    type: Object as () => AdminGoal,
    required: true
  },
  user: {
    type: Object as () => AdminUser,
    required: true
  }
})

const emits = defineEmits(['delete', 'return'])

const goal = computed(() => props.goal)
const user = computed(() => props.user)

const createdAt = computed(() => useMakeStrFromTimestamp(goal.value.createdAt))
const updatedAt = computed(() => useMakeStrFromTimestamp(goal.value.updatedAt))

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
        <h5>目標詳細</h5>
      </div>
      <div id="show-container" class="d-flex justify-content-center">
        <div id="show-box">
          <div id="row0" class="_row">
            <div class="_left_item">会員名：</div>
            <a @click="toUser" class="_right_item _normal_link">{{user?.username}}</a>
          </div>
          <div id="row1" class="_row">
            <div class="_left_item">年月：</div>
            <div class="_right_item">{{goal?.year}}年{{goal?.month}}月</div>
          </div>
          <div id="row2" class="_row">
            <div class="_left_item">ID：</div>
            <div class="_right_item">{{goal?.id}}</div>
          </div>
          <div id="row3" class="_row">
            <div class="_left_item">タイトル：</div>
            <div class="_right_item">{{goal?.title}}</div>
          </div>
          <div id="row4" class="_row">
            <div class="_left_item">説明：</div>
            <div class="_right_item" :class="{'_text_gray' : goal?.description === ''}">
              {{goal?.description !== '' ? goal?.description : '設定されていません'}}
            </div>
          </div>
          <div id="row5" class="_row">
            <div class="_left_item">作成日時：</div>
            <div class="_right_item">
              {{createdAt}}
            </div>
          </div>
          <div id="row6" class="_row">
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
@import "~/assets/css/modal_container.css";
._row {
  display: flex;
  margin: 10px 0;
}
._left_item {
  width: 80px;
  margin-right: 10px;
  text-align: right;
}
._right_item {
  max-width: calc(100% - 90px);
}
._text_gray {
  color: var(--font-gray);
}
@media (max-width: 768px) {
  ._modal_window {
    padding: 20px;
  }
}
</style>
