<script setup lang="ts">

</script>

<template>
  <div class="_allow_parent d-flex justify-content-center align-items-center mt-3">
    <div class="_allow">&#9660;</div>
    <div class="_allow_text">下にスクロールするとアプリの詳細が見られます</div>
  </div>
</template>

<style scoped>
._allow_parent {
  position: relative;
  z-index: 4;
}
._allow {
  font-size: 1.5rem;
  animation-name: allowAnimation;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease;
  animation-delay: 0.5s;
  color: #193f76;
}

@keyframes allowAnimation {
  0% {}
  5% {transform: rotate(20deg);}
  15% {transform: rotate(-20deg);}
  25% {transform: rotate(15deg);}
  35% {transform: rotate(-15deg);}
  45% {transform: rotate(0);}
  100% {transform: rotate(0);}
}
@media (max-width: 960px) {
  ._allow_parent {
    justify-content: center!important;
    padding-left: 0;
  }
  ._allow_text {
    font-size: 0.7rem;
  }
}
</style>
