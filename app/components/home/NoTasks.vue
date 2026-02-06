<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "タスクがありません"
  }
})
</script>

<template>
<div class="_task_container">
  <div class="_task_box d-flex justify-content-center align-items-center">
    <div class="my-2">{{props.text}}</div>
  </div>
</div>
</template>

<style scoped>

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
}

@media (max-width: 767.5px) {
  ._task_container {
    margin-left: 0;
  }
}
</style>
