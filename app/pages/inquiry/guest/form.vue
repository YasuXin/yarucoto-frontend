<script setup lang="ts">
import {useOutOfCookie} from "~/composables/useOutOfCookie";

definePageMeta({
  middleware: 'anonymous',
  layout: "anonymous"
})
useHead({
  title: "Yarucoto | Inquiry"
})

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const postUrl = baseUrl + '/inquiries/guest/create'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const name = ref('')
const email = ref('')
const postalCode = ref('')
const address = ref('')
const phoneNumber = ref('')
const text = ref('')
const registerUserId = ref(false)

const submitResult = ref('')
const onSubmit = async (params: {
  name: string,
  email: string,
  postalCode: string,
  address: string,
  phoneNumber: string,
  text: string,
  registerUserId: boolean
}) => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(postUrl, {
      method: 'POST',
      body: params,
      keys: 'postInquiry',
    }) as any
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalShow.value = false
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
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
  <div id="content" class="d-flex justify-content-center">
    <main>
      <div v-show="afterLoad" id="main-child"
           class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>お問い合わせ</h3>
        </div>
        <div v-if="submitResult" class="w-100 d-flex justify-content-center my-3">
          <div id="success" class="d-flex flex-column justify-content-center align-items-center">
            <h5>正常に送信されました</h5>
            <div>お問い合わせフォームを送信いただきありがとうございます</div>
            <NuxtLink to="/" class="_normal_link">トップページへ</NuxtLink>
          </div>
        </div>
        <InquiriesGuestForm v-if="!submitResult" :name="name" :email="email" :postalCode="postalCode"
                       :address="address" :phoneNumber="phoneNumber" :text="text"
                       :registerUserId="registerUserId" @submit="onSubmit"></InquiriesGuestForm>
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
  background-color: rgb(230, 230, 230);
}
main {
  width: 600px;
  padding: 20px;
  animation-name: mainFadein;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  background-color: rgb(250,250,250);
}
#success {
  width: 500px;
  height: 120px;
  padding: 10px 20px;
  min-height: 60px;
  border-radius: 10px;
  border: none;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  animation-name: successFadein;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes successFadein {
  0% {transform: translateY(20px); opacity: 0;}
  100% {transform: translateY(0); opacity: 1;}
}
@media (max-width: 768px) {
  main {
    width: 100%;
  }
}
@media (max-width: 576px) {
  #success {
    width: 100%;
  }
}

</style>
