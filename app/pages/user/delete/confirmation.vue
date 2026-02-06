<script setup lang="ts">
import {useCookie} from "#app";
import {useOutOfCookie} from "~/composables/useOutOfCookie";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | User | Delete"
})
const token = useCookie('__yarucoto')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const deleteUserUrl = baseUrl + '/user/delete'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const submitResult = ref('')
const onSubmit = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(deleteUserUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      key: deleteUserUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = '退会しました'
      setTimeout(() => {
        const auth = useAuth()
        auth.logout()
        navigateTo('/')
      }, 2000)
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
      <div v-show="afterLoad" id="main-child1"
           class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>退会</h3>
        </div>
        <div class="my-3">
          <NuxtLink to="/user/delete/check-password" class="_normal_link my-3">戻る</NuxtLink>
        </div>
        <div id="content-alert" class="my-2 shadow">
          <h3 class="text-center">警告!</h3>
          <div class="my-3 text-center">退会すると今まで登録したデータがすべて消えます。<br>
            復元はできませんがよろしいですか？</div>
        </div>
        <div class="_btn_box mt-4 mb-3 d-flex justify-content-center">
          <button @click="onSubmit" type="submit" class="btn btn-danger shadow-sm">
            退会する
          </button>
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

#content-alert {
  width: 500px;
  padding: 20px;
  border: var(--thick-border);
  border-radius: 10px;
  border-color: var(--bs-red);
  background-color: var(--alert-bg-color);
}

button {
  min-width: 200px;
}
@media(max-width: 576px) {
  #content-alert {
    width: calc(100% - 20px);
    margin-left: 10px;
    margin-right: 10px;
  }
  ._btn_box {
    width: 100%;
    padding: 0 10px;
  }
  form, button {
    width: 100%;
  }
}
</style>
