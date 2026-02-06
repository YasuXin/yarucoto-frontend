<script setup lang="ts">
import type {Evaluation} from "~/interfaces";

const props = defineProps({
  evaluation: {
    type: Object as () => Evaluation,
  }
})
const emit = defineEmits(['delete', 'showModal'])
const evaluation = computed<Evaluation>(() => props.evaluation as Evaluation)
const isCurrentYearMonth = computed(() => evaluation.value.year === new Date().getFullYear() && evaluation.value.month === new Date().getMonth() + 1)

const toEdit = () => {
  navigateTo('/evaluations/edit/' + evaluation.value.year + '-' + evaluation.value.month, {replace: true})
}
const toDelete = () => {
  emit('delete', evaluation.value.id)
}
const showModal = () => {
  emit('showModal', evaluation.value)
}
</script>

<template>
  <div class="_evaluation_container">
    <div class="_evaluation_box d-flex justify-content-center align-items-center flex-column" :class="{'_current_year_month': isCurrentYearMonth}">
      <div class="_evaluation_date_parent">
        <div class="_evaluation_date">
          {{evaluation.month}}月
        </div>
      </div>
      <div class="_evaluation_rate_parent d-flex align-items-center">
        <div class="_evaluation_rate_title">5段階評価：</div>
        <div class="_evaluation_rate d-flex">
          <div v-for="n in evaluation.rate" class="_evaluation_star mx-1">&#9733;</div>
          <div v-for="n in 5 - evaluation.rate" class="_evaluation_star mx-1">&#9734;</div>
        </div>
      </div>

      <div class="_evaluation_text_parent mt-2 py-2">
        <div class="_evaluation_text">{{evaluation.text ? evaluation.text : '-'}}</div>
      </div>
      <div class="d-flex justify-content-end w-100 mt-2">
        <div class="_btns">
          <button @click="showModal" class="btn btn-sm _btn_past_completed_rate shadow-sm">詳細</button>
          <button @click="toEdit" class="_to_edit_btn btn btn-sm _btn_past_completed_rate mx-2 shadow-sm">設定</button>
          <button v-if="evaluation.id !== 0" @click="toDelete" class="_to_delete_btn btn btn-sm btn-danger shadow-sm">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  font-weight: bold;
}
._evaluation_container {
  width: 100%;
}
._evaluation_box {
  width: 100%;
  margin: 0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
}
._evaluation_text_parent {
  width: 100%;
  padding: 0 15px 15px 15px;
  border-top: var(--middle-border);
  max-height: 150px;
}
._evaluation_text {
  overflow-y: auto;
  height: 100px;
}
._current_year_month {
  background-color: rgba(200,150,100,0.1);
  border: var(--thick-border);
  border-color: var(--theme-color4) !important;
}
._current_year_month ._evaluation_date::after {
  content: "(今月)";
  font-weight: bold;
  padding: 2px 10px;
}
._evaluation_date_parent {
  width: 100%;
  font-size: 1rem;
  text-align: center;
}
._evaluation_star {
  color: rgb(200,180,50);
}

@media (max-width: 576px) {
  ._evaluation_box {
    padding: 14px;
  }
}

</style>
