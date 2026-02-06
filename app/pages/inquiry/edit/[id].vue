<script setup lang="ts">
import type {Inquiry} from '~/interfaces'
import {useMakeStrFromTimestamp} from "~/composables/useMakeStrFromTimestamp";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Inquiry | Edit"
})

const token = useCookie('__yarucoto')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getInquiryUrl = baseUrl + '/inquiries/get/edit/' + useRoute().params.id
const postUrl = baseUrl + '/inquiries/update'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const inquiry = ref<Inquiry>()

const createdAt = computed(() => useMakeStrFromTimestamp(inquiry.value?.createdAt ?? '0000-00-00 00:00:00.000000'))
const updatedAt = computed(() => useMakeStrFromTimestamp(inquiry.value?.updatedAt ?? '0000-00-00 00:00:00.000000'))

const registerUserId = ref(true)

const getInquiry = async () => {
  try {
    const res = await $fetch(getInquiryUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      key: getInquiryUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    inquiry.value = res
  } catch (error) {
    useErrorEvent(error)
  }
}

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
    const params2: {
      id: number,
      name: string,
      email: string,
      postalCode: string,
      address: string,
      phoneNumber: string,
      text: string,
      registerUserId: boolean
    } = {
      id: inquiry?.value?.id ?? 0,
      name: params.name,
      email: params.email,
      postalCode: params.postalCode,
      address: params.address,
      phoneNumber: params.phoneNumber,
      text: params.text,
      registerUserId: params.registerUserId,
    }
    const res = await $fetch(postUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params2,
      key: postUrl + '/' + params2.id
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = '更新しました'
      setTimeout(() => {
        modalShow.value = false
        navigateTo('/inquiry/list')
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
  await getInquiry()
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
          <h3>お問い合わせの編集</h3>
        </div>
        <div class="my-3">
          <NuxtLink to="/inquiry/list" class="_normal_link my-3">戻る</NuxtLink>
        </div>
        <div class="_created_updated">
          <div class="_created">
            <div>投稿日：</div>
            <div>{{createdAt}}</div>
          </div>
          <div class="_updated">
            <div>更新日：</div>
            <div>{{updatedAt}}</div>
          </div>
        </div>
        <InquiriesForm :name="inquiry?.name" :email="inquiry?.email" :postalCode="inquiry?.postalCode"
                       :address="inquiry?.address" :phoneNumber="inquiry?.phoneNumber" :text="inquiry?.text"
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
@import "~/assets/css/form.css";
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
._created_updated {
  width: 600px;
}
@media (max-width: 576px) {
  form {
    width: 100%;
    padding: 0 20px;
  }
}
</style>
