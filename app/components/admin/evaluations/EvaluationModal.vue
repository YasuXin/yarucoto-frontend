<script setup lang="ts">
import type {AdminEvaluation, AdminUser} from "~/interfaces";

const props = defineProps({
  evaluation: {
    type: Object as () => AdminEvaluation,
    required: true
  },
  user: {
    type: Object as () => AdminUser,
    required: true
  }
})

const emits = defineEmits(['delete', 'return'])

const evaluation = computed(() => props.evaluation)
const user = computed(() => props.user)

const createdAt = computed(() => useMakeStrFromTimestamp(evaluation.value.createdAt))
const updatedAt = computed(() => useMakeStrFromTimestamp(evaluation.value.updatedAt))

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
        <h5>評価詳細</h5>
      </div>
      <div id="show-container" class="d-flex justify-content-center">
        <div id="show-box">
          <div id="row0" class="_row">
            <div class="_left_item">会員名：</div>
            <a @click="toUser" class="_right_item _normal_link">{{user?.username}}</a>
          </div>
          <div id="row1" class="_row">
            <div class="_left_item">年月：</div>
            <div class="_right_item">{{evaluation?.year}}年{{evaluation?.month}}月</div>
          </div>
          <div id="row2" class="_row">
            <div class="_left_item">ID：</div>
            <div class="_right_item">{{evaluation?.id}}</div>
          </div>
          <div id="row3" class="_row">
            <div class="_left_item">5段階評価：</div>
            <div class="_right_item">
              <span class="" v-if="evaluation.rate <= 0 || evaluation.rate >= 6">-</span>
              <template v-else>
                <span v-for="i in evaluation.rate" :key="i" class="_rate_star">&#9733;</span>
                <span v-for="i in (5 - evaluation.rate)" :key="i" class="_rate_star">&#9734;</span>
              </template>
            </div>
          </div>
          <div id="row4" class="_row">
            <div class="_left_item">テキスト：</div>
            <div class="_right_item" :class="{'_text_gray' : evaluation?.text === ''}">
              {{evaluation?.text !== '' ? evaluation?.text : '設定されていません'}}
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
._rate_star {
  color: var(--star-color);
}
@media (max-width: 768px) {
  ._modal_window {
    padding: 20px;
  }
}
</style>
