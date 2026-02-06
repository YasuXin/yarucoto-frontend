<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
const logoutEvent = () => {
  auth.logout()
}

const isHeaderSmHidden = ref(true)

const prevScrollY = ref(0)
const currentScrollY = ref(0)

window.addEventListener('scroll', () => {
  if (window.scrollY <= 576) {
    currentScrollY.value = window.scrollY
    if (currentScrollY.value > prevScrollY.value) {
      isHeaderSmHidden.value = false
    } else {
      isHeaderSmHidden.value = true
    }
    prevScrollY.value = currentScrollY.value
  }
})

</script>

<template>
  <div id="header-sm-parent" :class="{ '_hidden': isHeaderSmHidden }">
    <div id="header-sm" class="shadow-sm">
      <div class="w-100 d-flex justify-content-around align-items-center">
        <NuxtLink to="/tasks/register">
          <img src="~/assets/images/task-a.png" width="24" alt="">
        </NuxtLink>
        <NuxtLink to="/tasks/list">
          <img src="~/assets/images/calendar.png" width="24" alt="">
        </NuxtLink>
        <NuxtLink to="/routines/list">
          <img src="~/assets/images/routine.png" width="24" alt="">
        </NuxtLink>
        <NuxtLink to="/tags/list">
          <img src="~/assets/images/tag.png" width="24" alt="">
        </NuxtLink>

      </div>
      <div class="w-100 d-flex justify-content-around align-items-center">
        <NuxtLink to="/goals/list">
          <img src="~/assets/images/goal.png" width="24" alt="">
        </NuxtLink>
        <NuxtLink to="/evaluations/list">
          <img src="~/assets/images/star.png" width="24" alt="">
        </NuxtLink>
        <NuxtLink to="/past-completed-rate">
          <img src="~/assets/images/rate.png" width="24" alt="">
        </NuxtLink>
        <NuxtLink to="/user/profile">
          <img src="~/assets/images/user.png" width="24" alt="">
        </NuxtLink>
        <a v-on:click="logoutEvent">
          <img src="~/assets/images/logout.png" width="24" alt="">
        </a>
      </div>

    </div>
  </div>
</template>

<style scoped>
#header-sm {
  display: none;
}

@media (max-width: 576px) {
  #header-sm {
    display: flex;
    flex-direction: column;
    background-image: var(--header-bg-color);
    height: 100%;
  }

  #header-sm-parent {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 9;
    animation-name: headerSmFadein1;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }

  #header-sm > div {
    margin: 6px 0;
    padding: 0 20px;
  }

  @media (max-height: 700px) {
    #header-sm-parent {
      height: 80px;
      top: 50px;
      animation-name: headerSmFadein2;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

  }
}

@keyframes headerSmFadein1 {
  0% {transform: translateY(-60px);opacity: 0;}
  100% {transform: translateY(0);opacity: 1;}
}

@keyframes headerSmFadein2 {
  0% {transform: translateY(-50px);opacity: 0;}
  100% {transform: translateY(0);opacity: 1;}
}
</style>
