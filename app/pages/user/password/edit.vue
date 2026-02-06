<script setup lang="ts">
import {useCookie} from "#app";
import {useOutOfCookie} from "~/composables/useOutOfCookie";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Password | Edit"
})
const token = useCookie('__yarucoto')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const updateUrl = baseUrl + '/user/put/password/update'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const submitResult = ref('')
const onSubmit = async (params: {password: string, confirmPassword: string}) => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      keys: updateUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = 'パスワードを変更しました'
      setTimeout(() => {
        navigateTo('/user/profile')
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
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
          <h3>パスワード変更</h3>
        </div>
        <div class="my-3">
          <NuxtLink to="/user/password/check-password" class="_normal_link my-3">戻る</NuxtLink>
        </div>
        <div id="form-parent"
             class="d-flex flex-column justify-content-center align-items-center">
          <FormNewPassword @submit="onSubmit"></FormNewPassword>
        </div>
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
</style>
