<script setup lang="ts">

</script>

<template>
  <div id="loading" class="_loading">
    <div id="loading-text" class="_loading_text">取得中...</div>
  </div>
</template>

<style scoped>
#loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#loading-text {
  font-size: 24px;
  color: var(--font-color);
  animation-name: loadingAnimation;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  opacity: 0;
  animation-delay: 0.5s;
}
@keyframes loadingAnimation {
  0% {opacity: 0.2;}
  20% {opacity: 1;}
  100% {opacity: 0.2;}
}
</style>
