<script setup lang="ts">
import {useCookie} from "#app";
import {useOutOfCookie} from "~/composables/useOutOfCookie";

definePageMeta({
  middleware: ["auth", "auth-paid"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Subscription | Edit"
})
const token = useCookie('__yarucoto')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const postPasswordUrl = baseUrl + '/user/post/checkPassword'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const submitResult = ref('')
const onSubmit = async (password: string) => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const params : { password: string } = { password: password }
    const res = await $fetch(postPasswordUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      key: postPasswordUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
  } catch (error) {
    useErrorEvent(error)
  }
  if (submitResult.value === 'success') {
    navigateTo('/subscription/edit/checkout')
  } else if (submitResult.value === 'failed') {
    modalMessage.value = 'パスワードが間違っています'
    setTimeout(() => {
      modalShow.value = false
    }, 1000)
  }
}
const afterLoad = ref(false)
onMounted(async () => {
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :path="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div v-show="afterLoad" id="main-child"
           class="d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>クレジット情報の編集</h3>
        </div>
        <div class="my-3">
          <NuxtLink to="/user/profile" class="_normal_link my-3">戻る</NuxtLink>
        </div>
        <FormCheckPasswordForm message="手順1　：　パスワードを入力してください" @submit="onSubmit"></FormCheckPasswordForm>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}

@media(max-width: 576px) {
  #main-child {
    width: calc(100% - 20px);
    margin: 0 10px;
  }
}
</style>
