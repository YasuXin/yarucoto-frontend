<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: "user"
})
useHead({
  title: "Yarucoto | Inquiry"
})

const token = useCookie('__yarucoto')
const user = useState<any>('auth-user')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const postUrl = baseUrl + '/inquiries/create'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

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
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: postUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
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
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div v-show="afterLoad" id="main-child"
           class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>お問い合わせ</h3>
        </div>
        <div class="mt-3">
          <NuxtLink to="/home" class="_normal_link">戻る</NuxtLink>
        </div>
        <div id="link-to-list-parent" class="my-3 px-4">
          <NuxtLink to="/inquiry/list" id="link-to-list" class="my-3 btn _btn_primary shadow-sm">送信したお問い合わせ一覧</NuxtLink>
        </div>
        <div v-if="submitResult" class="w-100 d-flex justify-content-center my-3 px-4">
          <div id="success" class="d-flex flex-column justify-content-center align-items-center">
            <h5>正常に送信されました</h5>
            <div>お問い合わせフォームを送信いただきありがとうございます。</div>
            <div>引き続きアプリをご利用いただけますと幸いです。</div>
          </div>
        </div>
        <InquiriesForm :name="user?.username" :email="user?.email" :postalCode="user?.postalCode"
                       :address="user?.address" :phoneNumber="user?.phoneNumber" :text="text"
                       :registerUserId="registerUserId" @submit="onSubmit"></InquiriesForm>
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

#success {
  width: 500px;
  height: 150px;
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
@media (max-width: 576px) {
  #success {
    width: 100%;
  }
  #link-to-list-parent {
    width: 100%;
  }
  #link-to-list {
    width: 100%;
  }
}
</style>
