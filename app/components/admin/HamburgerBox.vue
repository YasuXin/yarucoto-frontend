<script setup lang="ts">
const emits = defineEmits(['hamShowEvent']);

// ハンバーガーメニューが開いた状態でスクロールしたとき、ハンバーガーメニューをフェードアウトさせる処理
window.addEventListener('scroll', e => {
  if(hamShow.value) {
    hamShow.value = false
    emits('hamShowEvent', hamShow.value)
  }
})
window.addEventListener('resize', () => {
  if (window.innerWidth > 767.5) {
    hamShow.value = false
    emits('hamShowEvent', hamShow.value)
  }
})
const hamShow = ref(false) // false: 三,  true: x
const btnEvent = () => {
  hamShow.value = !hamShow.value
  emits('hamShowEvent', hamShow.value)
}
</script>

<template>
  <div id="hamburger-box">
    <button id="hamburger-icon" @click="btnEvent">
      <transition name="hamFalse">
        <img v-show="!hamShow" id="ham-img" src="~/assets/images/hamburger.png" alt="三" width="31">
      </transition>
      <transition name="hamTrue">
        <img v-show="hamShow" id="ham-img-batsu" src="~/assets/images/batsu.png" alt="x" width="31">
      </transition>
    </button>
  </div>
</template>

<style scoped>
.hamFalse-enter-active, .hamFalse-leave-active, .hamTrue-enter-active, .hamTrue-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.hamFalse-enter-from, .hamFalse-leave-to, .hamTrue-enter-from, .hamTrue-leave-to {
  opacity: 0;
  transform: rotate3d(0, 0, 0, 0);
}
.hamFalse-enter-to, .hamFalse-leave-from, .hamTrue-enter-to, .hamTrue-leave-from {
  opacity: 1;
  transform: rotate3d(1, 1, 1, 360deg);
}
#hamburger-box {
  width: 36px;
  height: 36px;
  margin-left: 10px;
}
#hamburger-icon {
  position: relative;
  width: 36px;
  height: 36px;
  border: var(--hamburger-icon-border);
  border-radius: 5px;
  padding: 0;
  background-color: var(--hamburger-icon-bg-color);
}
#ham-img,
#ham-img-batsu {
  position: absolute;
  top: 0;
  left: 0;
}
@media (max-width: 768px) {
  #hamburger-box {
    margin-left: 5px;
  }
}
</style>
