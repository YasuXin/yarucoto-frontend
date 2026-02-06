<script setup lang="ts">
import {useCookie} from "#app";
import type {User} from "~/interfaces";

definePageMeta({
  middleware: ["auth", "auth-free"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Subscription | Register"
})
const token = useCookie('__yarucoto')
const user = useState<User | null>('auth-user')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const postInformationUrl = baseUrl + '/subscription/post/information'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const postalCode = ref(user?.value?.postalCode ?? '')
const address = ref(user?.value?.address ?? '')
const phoneNumber = ref(user?.value?.phoneNumber ?? '')

const postalCodeFlag = ref(false)
const addressFlag = ref(false)
const phoneNumberFlag = ref(false)

const isSubmitDisabled = ref(true)

const postalCodeReg = /^[0-9]{7}$/
const phoneNumberReg = /^[0-9]{10,11}$/

const alertPostalCode = ref('')
const alertAddress = ref('')
const alertPhoneNumber = ref('')

const valForm = () => {
  isSubmitDisabled.value = !(postalCodeFlag.value && addressFlag.value && phoneNumberFlag.value);
}
const postalCodeCheckEvent = () => {
  postalCodeFlag.value = postalCodeReg.test(postalCode.value);
  valForm()
}
const addressCheckEvent = () => {
  addressFlag.value = address.value.length > 0;
  valForm()
}
const phoneNumberCheckEvent = () => {
  phoneNumberFlag.value = phoneNumberReg.test(phoneNumber.value);
  valForm()
}
const submitResult = ref('')
const onSubmit = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const params : {
      postalCode: string,
      address: string,
      phoneNumber: string
    } = {
      postalCode: postalCode.value,
      address: address.value,
      phoneNumber: phoneNumber.value
    }
    const res = await $fetch(postInformationUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      key: postInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      navigateTo('/form/register/checkout')
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

onMounted(() => {
  if (user.value &&
      !user?.value?.postalCode &&
      !user?.value?.address &&
      !user?.value?.phoneNumber
  ) {
    postalCode.value = user.value.postalCode
    address.value = user.value.address
    phoneNumber.value = user.value.phoneNumber
  }
  postalCodeCheckEvent()
  addressCheckEvent()
  phoneNumberCheckEvent()
})

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
          <h3>有料プラン購入</h3>
        </div>
        <div class="my-3">
          <NuxtLink to="/subscription/register/check-password" class="_normal_link my-3">戻る</NuxtLink>
        </div>
        <div class="my-3">手順2　：　郵便番号・住所・電話番号を登録してください</div>
        <div id="form-parent"
             class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
          <form @submit.prevent="onSubmit">
            <div class="form-group">
              <div class="_label_parent d-flex align-items-end">
                <label id="postalCodeLabel" for="postalCode" class="form-label" :class="{'_checked' : postalCodeFlag}">郵便番号：</label>
              </div>
              <input @input="postalCodeCheckEvent" v-model="postalCode" type="text" class="form-control shadow-sm" :class="{'_clear' : postalCodeFlag}" placeholder="例)1234567">
              <div id="alert-postal-code" class="_alert">{{alertPostalCode}}</div>
            </div>
            <div class="form-group">
              <div class="_label_parent d-flex align-items-end">
                <label id="addressLabel" for="address" class="form-label" :class="{'_checked' : addressFlag}">住所：</label>
              </div>
              <input @input="addressCheckEvent" v-model="address" type="text" class="form-control shadow-sm" :class="{'_clear' : addressFlag}" placeholder="例)東京都××区〇〇町1-1-1">
              <div id="alert-address" class="_alert">{{alertAddress}}</div>
            </div>
            <div class="form-group">
              <div class="_label_parent d-flex align-items-end">
                <label id="phoneNumberLabel" for="phoneNumber" class="form-label" :class="{'_checked' : phoneNumberFlag}">電話番号：</label>
              </div>
              <input @input="phoneNumberCheckEvent" v-model="phoneNumber" type="tel" class="form-control shadow-sm" :class="{'_clear' : phoneNumberFlag}" placeholder="例)09012345678">
              <div id="alert-phone-number" class="_alert">{{alertPhoneNumber}}</div>
            </div>
            <div class="mt-4 mb-5 d-flex justify-content-center">
              <button type="submit" id="submitBtn" class="btn _btn_primary shadow-sm" :class="{'_disabled' : isSubmitDisabled}" :disabled="isSubmitDisabled">送信</button>
            </div>
          </form>
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
#form-parent {
  width: 360px;
}
form {
  width: 100%;
}
.form-group {
  width: 100%;
}

._label_parent {
  height: 36px;
}

label {
  margin-bottom: 2px !important;
  padding-bottom: 3px;
  vertical-align: bottom;
}

._clear {
  background-color: rgba(200, 255, 200, 0.3) !important;
}

._clear:focus {
  background-color: rgba(200, 255, 200, 0.3) !important;
  border-color: rgb(30, 255, 60) !important;
  box-shadow: 0 0 0 .25rem rgba(13, 255, 60, 0.25) !important;
  -webkit-box-shadow: 0 0 0 .25rem rgba(13, 255, 60, 0.25) !important;
}

._checked::after {
  content: "✓";
  color: var(--completed-color);
  font-size: 1.5rem;
}

._alert {
  width: 100%;
  min-height: 24px;
  margin: 5px 10px 0;
  font-size: 0.9rem;
  color: var(--bs-red);
}

@media(max-width: 576px) {
  #main-child {
    width: calc(100% - 20px);
    margin: 0 10px;
  }
  #form-parent {
    width: 100%;
  }
}
</style>
