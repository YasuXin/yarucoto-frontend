<script setup lang="ts">
const isBtnHidden = ref(true);

window.addEventListener('scroll', () => {
  if(window.innerWidth > 576) {
    if(window.scrollY >= 150) {
      isBtnHidden.value = false;
    } else if (window.scrollY < 150) {
      isBtnHidden.value = true;
    }
  }
})
window.addEventListener('resize', () => {
  if (window.innerWidth <= 576) {
    isBtnHidden.value = true
  }
})
const btnEvent = () => {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <button id="to-top-button" @click="btnEvent" :class="{ '_hidden': isBtnHidden}" class="shadow">
    &#9650;
  </button>
</template>

<style scoped>
#to-top-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius:100px;
  background-color: rgb(90,90,220);
  border: none;
  color: white;
  font-size: 24px;
  animation-name: toTopButtonFadein;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes toTopButtonFadein {
  0% {transform: translateY(60px); opacity: 0;}
  100% {transform: translateY(0); opacity: 1;}
}

@media (max-width: 500px) {
  #to-top-button {
    bottom: 50px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
}
</style>
