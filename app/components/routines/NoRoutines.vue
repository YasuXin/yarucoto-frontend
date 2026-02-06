<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "ルーティーンがありません"
  }
})
</script>

<template>
  <div class="_task_container">
    <div class="_task_box d-flex justify-content-center align-items-center">
      <div class="my-3">{{props.text}}</div>
    </div>
  </div>
</template>

<style scoped>
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
}

._task_box {
  height: 100%;
  width: 100%;
  padding-top: 0;
}

</style>
