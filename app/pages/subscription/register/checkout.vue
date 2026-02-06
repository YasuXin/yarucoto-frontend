<script setup lang="ts">
import {loadStripe} from "@stripe/stripe-js";
import {useCookie} from "#app";

definePageMeta({
  middleware: ["auth", "auth-free"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Subscription | Register"
})

const token = useCookie('__yarucoto')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const checkoutUrl = baseUrl + '/subscription/post/create'

const variables = reactive({
  colorBackground: 'rgb(240, 240, 240)',
  colorText: 'rgb(30, 30, 30)',
  colorPrimary: '#0d6efd',
  colorDanger: 'rgb(200, 30, 30)',
  colorPlaceholder: 'rgb(180, 180, 180)'
})
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  variables.colorBackground = 'rgb(60, 60, 60)'
  variables.colorText = 'rgb(200, 200, 200)'
  variables.colorPrimary = 'rgb(120, 120, 240)'
  variables.colorDanger = 'rgb(200, 30, 30)'
  variables.colorPlaceholder = 'rgb(90, 90, 90)'
}

const stripePromise = loadStripe(config.public.stripePublicKey);
const stripe = await stripePromise;
const elements = stripe?.elements({})

const cardElement = elements?.create('card', {style: {
    base: {
      backgroundColor: variables.colorBackground,
      color: variables.colorText,
      fontSize: '16px',
      '::placeholder': {
        color: variables.colorPlaceholder
      },
      iconColor: variables.colorText
    },
    invalid: {
      color: variables.colorDanger,
      iconColor: variables.colorDanger
    }
  },
  hidePostalCode: true
})

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const isSubmitDisabled = ref(true)

const cardHolderName = ref('');
const cardHolderNameFlag = ref(false);

const isCardElementError = ref(false);
const createPaidUserErrorMessage = ref('');

const valForm = () => {
  isSubmitDisabled.value = !cardHolderNameFlag.value;
}

const nameEvent = () => {
  cardHolderNameFlag.value = cardHolderName.value.length > 0;
  valForm()
}

const onSubmit = async () => {
  modalShow.value = true
  modalMessage.value = 'しばらくお待ちください...'
  isCardElementError.value = false
  if (!stripe) {
    modalMessage.value = '有料プランへの登録に失敗しました。再度お試しください'
    createPaidUserErrorMessage.value = "有料プランへの登録に失敗しました。再度お試しください"
    setTimeout(() => {
      modalShow.value = false
    }, 1000)
    return
  } else {
    stripe?.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: cardHolderName.value,
      },
    }).then((result) => {
      if (result.error) {
        // カード番号に不備がある場合はエラーメッセージを表示する
        isCardElementError.value = true;
        modalMessage.value = 'カード番号に不備があります'
        setTimeout(() => {
          modalShow.value = false
        }, 1000)
      } else {
        // Payment MethodのIDをサーバーに送信する
        stripePaymentIdHandler(result.paymentMethod.id);
      }
    })
  }
}

interface Result {
  error: string,
  success: string
}
const cardForm = ref<HTMLFormElement | null>(null);
const submitResult = ref<Result>({
  error: '',
  success: ''
});
const stripePaymentIdHandler = async (paymentMethodId: string | null) => {
  if (!paymentMethodId) {
    isCardElementError.value = true;
    modalMessage.value = 'カード番号に不備があります'
    setTimeout(() => {
      modalShow.value = false
    }, 1000)
    return
  }
  try {
    const params: { id: string } = { id: paymentMethodId }
    const res = await $fetch(checkoutUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      keys: checkoutUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    modalMessage.value = submitResult.value.success
    setTimeout(() => {
      modalShow.value = false
      const auth = useAuth()
      auth.fetchUser()
      navigateTo('/home')
    }, 2000)
  } catch (error: any) {
    if (error?.response) useErrorEvent(error)
    createPaidUserErrorMessage.value = "有料プランへの登録に失敗しました。再度お試しください"
    modalMessage.value = "有料プランへの登録に失敗しました。再度お試しください"
    setTimeout(() => {
      modalShow.value = false
    }, 1000)
  }
}

const afterLoad = ref(false)
onMounted(async () => {
  cardElement?.mount('#cardElement')
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :path="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div v-show="afterLoad" id="main-child"
           class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>有料プラン購入</h3>
        </div>
        <NuxtLink to="/subscription/register/user-information" class="_normal_link my-3">戻る</NuxtLink>
        <div class="my-3">手順3　：　クレジットカード情報を入力してください</div>
        <div v-if="!submitResult.success" id="form-parent" class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
          <form id="cardForm" method="post" ref="cardForm">
            <div class="_label_parent d-flex align-items-end">
              <label id="nameLabel" for="name" class="form-label" :class="{'_checked' : cardHolderNameFlag}">カード名義人：</label>
            </div>
            <input @input="nameEvent" v-model="cardHolderName" :class="{'_clear' : cardHolderNameFlag}" class="form-control shadow-sm" id="cardHolderName" type="text" placeholder="カード名義人" required>
            <div id="cardElementError" v-if="isCardElementError">
              <div class="text-danger small mb-2">カード番号に不備があります</div>
            </div>
            <div id="createPaidUserError" v-if="submitResult.error">
              <div class="text-danger small mb-2">{{submitResult.error}}</div>
            </div>
            <div class="_label_parent d-flex align-items-end mt-4">
              <label id="nameLabel" class="form-label">カード番号：</label>
            </div>
            <div class="mb-4 shadow-sm form-control" id="cardElement"></div>
          </form>
          <div class="d-flex justify-content-center w-100 my-4">
            <button class="btn _btn_primary text-white shadow-sm w-50 shadow-sm" id="cardButton"
                    @click="onSubmit" :class="{'_disabled' : isSubmitDisabled}"
                    :disabled="isSubmitDisabled">登録</button>
          </div>
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
#cardForm {
  width: 100%;
}
#cardElement {
  height: 40px;
  background-color: var(--form-bg-color);
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
  background-color: rgba(200, 255, 200, 0.7) !important;
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
@media(max-width: 576px) {
  #main-child {
    width: calc(100% - 20px);
    margin: 0 10px;
  }
  #form-parent {
    width: 100%;
  }
  #cardElement {
    height: 100%;
  }
  #cardButton {
    width: 100%!important;
  }
}
</style>
