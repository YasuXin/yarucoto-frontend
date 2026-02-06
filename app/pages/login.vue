<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

definePageMeta({
  middleware: "anonymous",
  layout: "anonymous"
})

useHead({
  title: "Yarucoto | Login",
})

const { login } = useAuth()

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordReg = /^[a-zA-Z0-9.?/-]{8,20}$/

const email = ref("")
const password = ref("")
const errorMessage = ref("")

const emailFlag = ref(false)
const passwordFlag = ref(false)
const submitBtnDisabled = ref(true)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const resultSubmit = ref(false)

const valForm = () => {
  submitBtnDisabled.value = !(emailFlag.value && passwordFlag.value);
}
const emailCheckEvent = () => {
  emailFlag.value = emailReg.test(email.value);
  valForm()
}
const passwordCheckEvent = () => {
  let checked = passwordReg.test(password.value)
  passwordFlag.value = checked && password.value.length >= 8 && password.value.length <= 20;
  valForm()
}

const loginAnimation = ref(false)

const onSubmit = async () => {
  modalShow.value = true
  try {
    resultSubmit.value = await login(email.value, password.value)
  } catch (error) {
    errorMessage.value = "送信に失敗しました"
    setTimeout(() => {
      modalShow.value = false
    }, 1000)
  }
  if (!resultSubmit.value) {
    errorMessage.value = "ユーザー名またはパスワードが間違っています"
    setTimeout(() => {
      modalShow.value = false
    }, 1000)
  } else {
    modalShow.value = false
    loginAnimation.value = true
    setTimeout(() => {
      const auth = useAuth()
      if (auth.user !== undefined && auth?.user?.value?.role === 'ROLE_ADMIN') navigateTo('/admin/home')
      else navigateTo('/home')
    }, 2000)

  }
}
</script>

<template>
  <div id="content" class="d-flex justify-content-center" :class="{'_login_fadeout' : loginAnimation}">
    <main>
      <h3 class="mt-3 mb-4 text-center">ログイン</h3>
      <form @submit.prevent="onSubmit" class="d-flex justify-content-center align-items-center flex-column">
        <div class="form-group my-3">
          <label id="email-label" for="username" class="form-label" :class="{ '_checked': emailFlag }">メールアドレス：</label>
          <input @input="emailCheckEvent" v-model="email" id="email" type="text" :class="{ '_clear': emailFlag }" class="form-control shadow-sm" required autocomplete="email"
                 placeholder="メールアドレス" autofocus>
        </div>
        <div class="form-group my-3">
          <label id="password-label" for="password" class="form-label" :class="{ '_checked': passwordFlag }">パスワード：</label>
          <input @input="passwordCheckEvent" v-model="password" id="password" type="password" :class="{ '_clear': passwordFlag }" class="form-control shadow-sm" required autocomplete="new-password"
                 placeholder="パスワード">
        </div>
        <div v-if="errorMessage" class="_alert alert alert-danger">
          メールアドレスまたはパスワードが正しくありません。
        </div>
        <div class="form-group d-flex justify-content-center my-4">
          <button id="submitBtn" type="submit" class="btn _btn_primary shadow-sm" :class="{ '_disabled': submitBtnDisabled}" :disabled="submitBtnDisabled">ログイン</button>
        </div>
      </form>
      <div class="text-center mt-4">
        <NuxtLink to="/signup/form">
          新規会員登録はこちら
        </NuxtLink>
      </div>
      <div class="text-center mt-4">
        <NuxtLink to="/reset-password/recreate">
          パスワードを忘れた場合
        </NuxtLink>
      </div>
    </main>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
    <div v-if="loginAnimation" class="_login_fadeout_modal d-flex justify-content-center align-items-center">
      <h1>✓</h1>
    </div>
  </teleport>
</template>

<style scoped>
@import "~/assets/css/annonymous_form.css";
@import "~/assets/css/annonymous_form_clear.css";
h3 {
  color: rgb(30,30,30) !important;
}
._login_fadeout {
  animation-name: loginFadeout;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
}
@keyframes loginFadeout {
  from {opacity: 1; transform: translateY(0);}
  to {opacity: 0; transform: translateY(-100vh);}
}
._login_fadeout_modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(230,230,230,1);
  opacity: 0;
  animation-name: modalFadeout;
  animation-duration: 0.75s;
  animation-fill-mode: forwards;
  animation-delay: 0.25s;
  animation-timing-function: ease-in;
}
._login_fadeout_modal h1 {
  opacity: 0;
  animation-name: modalCheckFadeout;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-delay: 0.25s;
  animation-timing-function: ease-in;
  color: var(--completed-color) !important;
  font-size: 10rem;
}
@keyframes modalFadeout {
  from {opacity: 0;}
  to {opacity: 1;}
}
@keyframes modalCheckFadeout {
  0% {opacity: 0;}
  20% {opacity: 0.4; transform: rotate(10deg)}
  25% {opacity: 0.5; transform: rotate(-10deg)}
  30% {opacity: 0.6; transform: rotate(6deg)}
  40% {opacity: 0.8; transform: rotate(-6deg)}
  50% {opacity: 1; transform: rotate(0)}
  60% {opacity: 1;}
  70% {opacity: 1;}
  80% {opacity: 0.5;}
  90% {opacity: 0.2;}
  100% {opacity: 0;}
}

</style>
