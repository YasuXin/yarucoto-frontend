<script setup lang="ts">
import type {User} from "~/interfaces";

definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | AdminUser | ChangePassword"
})
const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const user = useState<User | null>('auth-user')

const updateUrl = baseUrl + '/admin/users/password/update'

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
        navigateTo('/admin/home')
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
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
      <span class="mx-2">></span>
      <NuxtLink to="/admin/admin-user/change-password/check-password" class="_normal_link mb-3">パスワード入力</NuxtLink>
    </div>
    <div id="form-parent" class="d-flex flex-column justify-content-center align-items-center">
      <FormNewPassword @submit="onSubmit"></FormNewPassword>
    </div>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
#form-parent {
  position: relative;
  width: 400px;
}
@media (max-width: 576px) {
  #form-parent {
    width: 100%;
  }
}
</style>
