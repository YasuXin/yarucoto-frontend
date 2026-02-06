<script setup lang="ts">
definePageMeta({
  middleware: "anonymous",
  layout: "anonymous"
})

useHead({
  title: "Yarucoto | Reset-Password | Check-Email",
})

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const checkEmailUrl = baseUrl + '/reset-password/check-email'
const recreatePasswordUrl = baseUrl + '/reset-password/recreate-password'

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordReg = /^[a-zA-Z0-9.?/-]{8,20}$/

const email = ref("")

const errorEmailValMessage = ref(false)
const errorEmailPostMessage = ref(false)

const emailFlag = ref(false)
const emailSubmitBtnDisabled = ref(true)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const recreateHidden = ref(true)

const resultEmail = ref('')

const password = ref("")
const confirmPassword = ref("")
const passwordFlag = ref(false)
const confirmPasswordFlag = ref(false)
const passwordSubmitBtnDisabled = ref(true)

const resultToken = ref('')

const errorPasswordValMessage = ref(false)
const errorPasswordPostMessage = ref(false)

const emailValForm = () => {
  emailSubmitBtnDisabled.value = !(emailFlag.value);
}

const emailCheckEvent = () => {
  emailFlag.value = emailReg.test(email.value);
  emailValForm()
}
const onEmailSubmit = async () => {
  errorEmailValMessage.value = false
  errorEmailPostMessage.value = false
  modalShow.value = true
  try {
    const params :{ email: string } = {email: email.value}
    resultEmail.value = await $fetch(checkEmailUrl, {
      method: 'POST',
      body: params,
      key: 'check-email'
    }) as any
    if (resultEmail.value === 'failed') {
      errorEmailValMessage.value = true
      modalShow.value = false
    } else {
      errorEmailValMessage.value = false
      modalShow.value = false
      recreateHidden.value = false
    }
  } catch (error) {
    errorEmailPostMessage.value = true
    modalShow.value = false
  }
}

const passwordValForm = () => {
  passwordSubmitBtnDisabled.value = !(passwordFlag.value && confirmPasswordFlag.value);
}
const passwordCheckEvent = () => {
  const check = passwordReg.test(password.value)
  passwordFlag.value = check && password.value.length >= 8 && password.value.length <= 20;
  passwordValForm()
}
const confirmPasswordCheckEvent = () => {
  const check = passwordReg.test(confirmPassword.value)
  confirmPasswordFlag.value = check && confirmPassword.value.length >= 8 && confirmPassword.value.length <= 20;
  passwordValForm()
}
const onPasswordSubmit = async () => {
  errorPasswordValMessage.value = false
  errorPasswordPostMessage.value = false
  modalShow.value = true
  try {
    const params :{
      email: string,
      password: string,
      confirmPassword: string
    } = {
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    }
    resultToken.value = await $fetch(recreatePasswordUrl, {
      method: 'POST',
      body: params,
      key: 'recreate-password'
    }) as any
    console.log(resultToken.value)
    if (resultToken.value === 'failed') {
      errorPasswordValMessage.value = true
      modalShow.value = false
    } else {
      navigateTo({
        path: '/reset-password/verify',
        query: {
          token: resultToken.value
        }
      })
    }
  } catch (error) {
    errorPasswordPostMessage.value = true
    modalShow.value = false
  }
}
</script>

<template>
  <div id="check-password-content" class="d-flex justify-content-center" :class="{ '_hidden': !recreateHidden}">
    <main>
      <h3 class="mt-3 mb-4 text-center">パスワードの再設定</h3>
      <div class="mx-4 text-center">使用しているメールアドレスを入力してください。</div>
      <form @submit.prevent="onEmailSubmit" class="d-flex justify-content-center align-items-center flex-column">
        <div class="form-group my-4">
          <div class="form-group my-3">
            <label id="email-label" for="username" class="form-label" :class="{ '_checked': emailFlag }">メールアドレス：</label>
            <input @input="emailCheckEvent" v-model="email" id="email" type="text" :class="{ '_clear': emailFlag }" class="form-control shadow-sm" required autocomplete="email"
                   placeholder="メールアドレス" autofocus>
          </div>
        </div>
        <div v-if="errorEmailValMessage" class="_alert alert alert-danger">
          入力内容にエラーがありました。ご確認ののち、再度送信してください。
        </div>
        <div v-if="errorEmailPostMessage" class="_alert alert alert-danger">
          通信エラーが発生しました。再度送信してください。
        </div>
        <div class="form-group d-flex justify-content-center my-4">
          <button type="submit" class="btn _btn_primary shadow-sm" :class="{ '_disabled': emailSubmitBtnDisabled}" :disabled="emailSubmitBtnDisabled">送信</button>
        </div>
      </form>
    </main>
  </div>
  <div id="reset-password-content" class="d-flex justify-content-center" :class="{ '_hidden': recreateHidden}">
    <main>
      <h3 class="mt-3 mb-5 text-center">パスワードの再設定</h3>
      <div id="reset-password-title" class="text-center">新しいパスワードを設定してください</div>
      <form @submit.prevent="onPasswordSubmit" class="d-flex justify-content-center align-items-center flex-column">
        <div class="form-group mt-4">
          <div class="_password_rule_text">パスワードは8～20文字 アルファベット小文字・大文字・数字を1文字以上使用してください</div>
        </div>
        <div class="form-group my-2">
          <div class="_label_parent d-flex align-items-end">
            <label id="password-label" for="password" class="form-label" :class="{ '_checked': passwordFlag }">パスワード：</label>
          </div>
          <input @input="passwordCheckEvent" v-model="password" type="password" :class="{ '_clear': passwordFlag }" class="form-control shadow-sm" required autocomplete="new-password"
                 placeholder="">
        </div>
        <div class="form-group my-2">
          <div class="_label_parent d-flex align-items-end">
            <label id="confirm-label" for="confirmPassword" class="form-label" :class="{ '_checked': confirmPasswordFlag }">パスワード（確認用）：</label>
          </div>
          <input @input="confirmPasswordCheckEvent" v-model="confirmPassword" type="password" :class="{ '_clear': confirmPasswordFlag }" class="form-control shadow-sm" required autocomplete="new-password">
        </div>
        <div v-if="errorPasswordValMessage" class="_alert alert alert-danger">
          入力内容にエラーがありました。ご確認ののち、再度送信してください。
        </div>
        <div v-if="errorPasswordPostMessage" class="_alert alert alert-danger">
          通信エラーが発生しました。再度送信してください。
        </div>
        <div class="form-group d-flex justify-content-center my-4">
          <button type="submit" class="btn _btn_primary shadow-sm" :class="{ '_disabled': passwordSubmitBtnDisabled}" :disabled="passwordSubmitBtnDisabled">送信</button>
        </div>
      </form>
    </main>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
@import "~/assets/css/annonymous_form.css";
@import "~/assets/css/annonymous_form_clear.css";
h3 {
  color: rgb(30,30,30) !important;
}
#check-password-content, #reset-password-content {
  background-color: var(--annonymous-bg-color);
}
</style>
