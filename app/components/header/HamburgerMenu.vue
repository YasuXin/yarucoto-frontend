<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
const logoutEvent = (e: Event) => {
  e.preventDefault()
  auth.logout()
}

const props = defineProps({
  hamShow: {
    type: Boolean
  }
})

const hamShow = ref(props.hamShow)

watch(props, () => {
  hamShow.value = props.hamShow
})

</script>

<template>
  <transition>
    <div v-show="hamShow" id="hamburger-container" class="container my-2 py-1 px-0 rounded shadow">
      <nav class="navbar py-0 d-flex flex-column" aria-labelledby="dropDown">
        <div class="_hamburger_inner_box">
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/home">
              <p>ホーム</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/tasks/register">
              <p>タスクの追加</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/tasks/list">
              <p>タスク一覧</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/routines/list">
              <p>ルーティーン</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/tags/list">
              <p>タグの設定</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/goals/list">
              <p>目標の設定</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/evaluations/list">
              <p>月ごとの評価</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/past-completed-rate">
              <p>達成率の確認</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/user/profile">
              <p>会員情報</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <NuxtLink class="navbar-brand" to="/information/list">
              <p>お知らせ</p>
            </NuxtLink>
          </div>
          <div class="container-fluid _hamburger_link">
            <a class="navbar-brand" v-on:click="logoutEvent">
              <p>ログアウト</p>
            </a>
          </div>
        </div>
      </nav>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: opacity .8s, transform .8s;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
  transform: translateX(200px);
}
.v-enter-to, .v-leave-from {
  opacity: 1;
  transform: translateX(0);
}
#hamburger-container {
  position: fixed;
  top: 53px;
  right: 0;
  z-index: 20;
  width: 200px;
  background-color: var(--card-bg-color);
}

._hamburger_inner_box {
  width: 100%;
}
._hamburger_link {
  height: 40px;
  text-align:center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: var(--thin-border);
  cursor: pointer;
}
._hamburger_link:last-child {
  border-bottom: none;
}
._hamburger_link a {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
}
._hamburger_link a p {
  display: inline-block;
  margin: 0;
}
._hamburger_link:hover {
  animation-name: hamLinkAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes hamLinkAnimation {
  0% {}
  100% {background-color: rgba(0,0,0,0.1);}
}

._hamburger_link a {
  padding: 0;
}

@media (max-width: 576px) {
  #hamburger-container {
    top: 43px;
    width: 60%;
  }
  ._hamburger_link {
    height: calc((100vh - 60px) / 14);
  }
  p {
    font-size: 1.1rem;
  }
}
</style>
