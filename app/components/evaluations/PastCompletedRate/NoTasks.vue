<script setup lang="ts">

</script>

<template>
  <div class="_task_container">
    <div class="_task_box d-flex justify-content-center align-items-center">
      <div>タスクがありません</div>
    </div>
  </div>
</template>

<style scoped>
._task_container {
  position: relative;
  margin: 0;
  display: flex;
  justify-content: center;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  height: 100px;
}

._task_box {
  height: 100%;
  width: 100%;
  padding-top: 0;
}
</style>
