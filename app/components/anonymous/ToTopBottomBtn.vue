<script setup lang="ts">
const isTopBtnHidden = ref(false)
const isBottomBtnHidden = ref(false)

window.addEventListener('scroll', () => {
  if(window.innerWidth > 960 && window.innerWidth > window.innerHeight) {
    isTopBtnHidden.value = false
    isBottomBtnHidden.value = false
  } else {
    isTopBtnHidden.value = true
    isBottomBtnHidden.value = true
  }
})
window.addEventListener('resize', () => {
  if(window.innerWidth > 960 && window.innerWidth > window.innerHeight) {
    isTopBtnHidden.value = false
    isBottomBtnHidden.value = false
  } else {
    isTopBtnHidden.value = true
    isBottomBtnHidden.value = true
  }
})

const isDisabled = ref(false)
const toTopBtnEvent = () => {
  isDisabled.value = true
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
  setTimeout(() => {
    isDisabled.value = false
  }, 1000)
}
const toBottomBtnEvent = () => {
  isDisabled.value = true
  window.scroll({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  setTimeout(() => {
    isDisabled.value = false
  }, 1000)
}
if(window.innerWidth > 960 && window.innerWidth > window.innerHeight) {
  isTopBtnHidden.value = false
  isBottomBtnHidden.value = false
} else {
  isTopBtnHidden.value = true
  isBottomBtnHidden.value = true
}
</script>

<template>
  <button id="to-top-button" @click="toTopBtnEvent" :class="{ '_hidden': isTopBtnHidden}" class=" _btn shadow" :disabled="isDisabled">
    &#9650;
  </button>
  <button id="to-bottom-button" @click="toBottomBtnEvent" :class="{ '_hidden': isBottomBtnHidden}" class="_btn shadow" :disabled="isDisabled">
    &#9660;
  </button>
</template>

<style scoped>
._btn {
  position: fixed;
  width: 36px;
  height: 36px;
  border-radius: 100px;
  background-color: #4d6ea0;
  border: none;
  color: white;
  font-size: 12px;
  z-index: 100;
}
._btn:hover {
  cursor: pointer;
  animation-name: hover;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
@keyframes hover {
  0% {}
  100% {background-color: #374254;}
}
#to-top-button {
  top: calc(50vh - 50px);
  right: 10px;
}
#to-bottom-button {
  top: calc(50vh + 50px);
  right: 10px;
}
</style>
