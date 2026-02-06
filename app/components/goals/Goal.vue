<script setup lang="ts">
import type {Goal} from "~/interfaces";

const props = defineProps({
  goal: {
    type: Object as () => Goal,
    required: true
  }
})
const emit = defineEmits(['delete', 'showModal'])
const goal = computed<Goal>(() => props.goal as Goal)
const isCurrentYearMonth = computed(() => goal.value.year === new Date().getFullYear() && goal.value.month === new Date().getMonth() + 1)

const showModal = () => {
  emit('showModal', goal.value)
}
const toEdit = () => {
  navigateTo('/goals/edit/' + goal.value.year + '-' + goal.value.month, {replace: true})
}
const toDelete = () => {
  emit('delete', goal.value.id)
}
</script>

<template>
  <div class="_goal_container">
    <div class="_goal_box d-flex justify-content-center align-items-center flex-column" :class="{'_current_year_month': isCurrentYearMonth}">
      <div class="_goal_date_parent">
        <div class="_goal_date">
          {{goal.month}}月
        </div>
      </div>
      <div class="_goal_title_parent">
        <div class="_goal_title">{{goal.title ? goal.title : '-'}}</div>
      </div>
      <div class="_goal_description_parent d-flex w-100 mt-2 py-2">
        <div class="_goal_description_title">　詳細：</div>
        <div class="_goal_description">{{goal.description ? goal.description : '設定されていません'}}</div>
      </div>
      <div class="d-flex justify-content-end w-100 mt-2">
        <div class="_btns">
          <button @click="showModal" class="btn btn-sm _btn_goals shadow-sm">詳細</button>
          <button @click="toEdit" class="_to_edit_btn btn btn-sm _btn_goals mx-2 shadow-sm">設定</button>
          <button v-if="goal.id !== 0" @click="toDelete" class="_to_delete_btn btn btn-sm btn-danger shadow-sm">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

label {
  font-weight: bold;
}
._goal_container {
  width: 100%;
}
._goal_box {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
}
._current_year_month {
  background-color: rgba(200,100,200,0.1);
  border: var(--thick-border);
  border-color: var(--theme-color3) !important;
}
._current_year_month ._goal_date::after {
  content: "(今月)";
  padding: 2px 10px;
  font-weight: bold;
}
._goal_title_parent {
  width: 100%;
}
._goal_title {
  font-size: 1.1rem!important;
  font-weight:bold;
  overflow-wrap: break-word;
  font-style: italic;
  text-align: center;
  width: 100%;
}

._goal_date_parent {
  width: 100%;
  font-size: 1rem;
  text-align: center;
}
._goal_description_parent {
  border-top: var(--middle-border);
}
._goal_description_title {
  width: 60px;
  font-size: 0.9rem;
}
._goal_description {
  overflow-y: auto;
  max-width: calc(100% - 60px);
  height: 100px;
  padding-right: 10px;
}

@media (max-width: 1080px) {
  ._goal_container {
    width: 100%;
  }
}
@media (max-width: 576px) {
  ._goal_box {
    padding: 14px;
  }
}
@media (max-width: 500px) {
  ._goal_description_title {
    font-size: 0.8rem;
    width: 70px;
  }
  ._goal_description {
    font-size: 0.8rem;
  }
}
</style>
