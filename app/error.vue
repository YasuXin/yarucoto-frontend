<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

useHead({
  title: "Yarucoto | Error"
})
interface Props {
  error: Object;
}
const props = defineProps<Props>();
const errors = useError().value
const auth = useAuth()
const logoutEvent = (e: Event) => {
  e.preventDefault()
  auth.logout()
}
</script>

<template>
  <main v-if="errors?.statusCode === 400" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h3>{{errors?.statusCode}}エラー</h3>
      <p class="mt-3">不正なリクエストです</p>
      <p>URLをご確認ください</p>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
        <a @click="logoutEvent" class="_normal_link my-3 mx-3">ログアウト</a>
      </div>
    </div>
  </main>
  <main v-if="errors?.statusCode === 401" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h3>{{errors?.statusCode}}エラー</h3>
      <p class="mt-3">セッションが切れました</p>
      <p>再度ログインしてください</p>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
      </div>
    </div>
  </main>
  <main v-if="errors?.statusCode === 403" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h3>{{errors?.statusCode}}エラー</h3>
      <p class="mt-3">許可されていないページです</p>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
        <a @click="logoutEvent" class="_normal_link my-3 mx-3">ログアウト</a>
      </div>
    </div>
  </main>
  <main v-if="errors?.statusCode === 404" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h2>{{errors?.statusCode}}エラー</h2>
      <p class="mt-3">指定したURLのページは見つかりません</p>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
        <a @click="logoutEvent" class="_normal_link my-3 mx-3">ログアウト</a>
      </div>
    </div>
  </main>
  <main v-if="errors?.statusCode === 408" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h2>{{errors?.statusCode}}エラー</h2>
      <p class="mt-3">通信エラーが発生しました</p>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
        <a @click="logoutEvent" class="_normal_link my-3 mx-3">ログアウト</a>
      </div>
    </div>
  </main>
  <main v-if="errors?.statusCode === 500" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h3>{{errors?.statusCode}}エラー</h3>
      <p class="mt-3">予期せぬサーバーエラーが発生しました</p>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
        <a @click="logoutEvent" class="_normal_link my-3 mx-3">ログアウト</a>
      </div>
    </div>
  </main>
  <main v-if="errors?.statusCode === 503" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h3>{{errors?.statusCode}}エラー</h3>
      <p class="mt-3">現在ご利用できません</p>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
        <a @click="logoutEvent" class="_normal_link my-3 mx-3">ログアウト</a>
      </div>
    </div>
  </main>
  <main v-if="!errors" class="m-0 w-100">
    <div class="d-flex flex-column justify-content-center align-items-center py-5">
      <h3>予期せぬエラー</h3>
      <div class="d-flex justify-content-center">
        <NuxtLink to="/" class="_normal_link my-3 mx-3">トップページへ</NuxtLink>
        <a @click="logoutEvent" class="_normal_link my-3 mx-3">ログアウト</a>
      </div>
    </div>
  </main>

</template>

<style scoped>
@media (prefers-color-scheme: light) {
  main {
    color: rgb(30, 30, 30);
    background-color: rgb(220, 220, 220);
  }
}
@media (prefers-color-scheme: dark) {
  main {
    color: rgb(220, 220, 220);
    background-color: rgb(30, 30, 30);
  }
}
main {
  border-radius: 0 !important;
  height: 100vh;
}
</style>
