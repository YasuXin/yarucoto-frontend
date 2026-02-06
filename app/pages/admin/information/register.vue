<script setup lang="ts">
definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | Information | Register"
})

const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const createInformationUrl = baseUrl + '/admin/information/create'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const title = ref('')
const description = ref('')

const titleOk = ref(false)
const descriptionOk = ref(false)
const submitDisabled = ref(true)

const valForm = () => {
  submitDisabled.value = !(titleOk.value && descriptionOk.value)
}
const valTitle = () => {
  titleOk.value = title.value.length > 0 && title.value.length <= 40
  valForm()
}
const valDescription = () => {
  descriptionOk.value = description.value.length > 0
  valForm()
}

const registerResult = ref('')
const onSubmit= async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(createInformationUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: {
        title: title.value,
        description: description.value
      },
      key: createInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    registerResult.value = res
    if (registerResult.value === 'failed') {
      modalShow.value = true
      modalMessage.value = '送信内容に誤りがあります'
      setTimeout(() => {
        modalShow.value = false
      }, 1000)
    } else if (registerResult.value === 'success') {
      modalMessage.value = 'お知らせを追加しました'
      setTimeout(() => {
        modalShow.value = false
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>新規お知らせ登録</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/information/list" class="_normal_link mb-3">お知らせ一覧</NuxtLink>
    </div>
    <form @submit.prevent="onSubmit" method="POST" class="d-flex justify-content-center align-items-center flex-column">
      <div class="w-100">
        <div class="_label_parent d-flex align-items-end">
          <label for="input-title" class="form-label">タイトル：</label>
        </div>
        <input v-model="title" @input="valTitle" id="input-title" type="text" class="form-control" placeholder="40文字まで">
      </div>
      <div class="w-100 mt-3">
        <div class="_label_parent d-flex align-items-end">
          <label for="input-description" class="form-label">内容：</label>
        </div>
        <textarea v-model="description" @input="valDescription" id="input-description" class="form-control" placeholder="文字制限なし"></textarea>
      </div>
      <div class="_btn_parent d-flex justify-content-center mt-5">
        <button type="submit" class="btn _btn_primary" :class="{'_disabled' : submitDisabled}" :disabled="submitDisabled">登録</button>
      </div>
    </form>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
@import '~/assets/css/form.css';
#input-title {
  width: 100%;
}
#input-description {
  width: 100%;
  height: 200px;
}
._btn_parent {
  width: 200px;
}
form {
  width: 70%;
}
@media (max-width: 768px) {
  form {
    width: 90%;
  }
}
@media (max-width: 576px) {
  ._btn_parent {
    width: 100%;
  }
  .btn {
    width: 100% !important;
  }
}
</style>
