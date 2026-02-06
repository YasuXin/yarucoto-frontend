<script setup lang="ts">
import type {User} from "~/interfaces";

definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | AdminUser | Edit"
})

const token = useCookie('__yarucoto')

const user = useState<User | null>('auth-user')

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
    const params : { password: string } = {password: password}
    const res = await $fetch(postPasswordUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      keys: postPasswordUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      navigateTo('/admin/admin-user/change-password/form')
    } else if (submitResult.value === 'failed') {
      modalMessage.value = 'パスワードが間違っています'
      setTimeout(() => {
        modalShow.value = false
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}
const returnShow = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + user.value?.id)
}
</script>

<template>
  <div id="main-child" class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>管理者パスワード変更</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/users/list?page=1" class="_normal_link mb-3">会員一覧</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink @click="returnShow" class="_normal_link mb-3">会員情報</NuxtLink>
    </div>
    <FormCheckPasswordForm message="パスワードを入力してください" @submit="onSubmit"></FormCheckPasswordForm>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>

</style>
