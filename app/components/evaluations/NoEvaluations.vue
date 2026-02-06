<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '目標が設定されていません'
  }
})
</script>

<template>
  <div class="_container">
    <div class="_box d-flex justify-content-center align-items-center">
      <div class="my-3">{{props.text}}</div>
    </div>
  </div>
</template>

<style scoped>
._container {
  position: relative;
  width: 100%;
  margin: 20px 0 0;
  display: flex;
  justify-content: center;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  border-radius: 10px;
  padding: 5px;
}

._box {
  height: 100%;
  width: 100%;
  padding-top: 0;
}
</style>
