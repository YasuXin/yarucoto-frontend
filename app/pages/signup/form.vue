<script setup lang="ts">
definePageMeta({
  layout: "anonymous"
})

useHead({
  title: "Yarucoto | Signup"
})
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const emailCheckUrl = baseUrl + '/guest/post/checkEmail'
const signupUrl = baseUrl + '/auth/signup'

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordReg = /^[a-zA-Z0-9.?/-]{8,20}$/

const errorValMessage = ref(false)
const errorPostMessage = ref(false)

const username = ref("")
const nickname = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")

const usernameFlag = ref(false)
const nicknameFlag = ref(false)
const emailFlag = ref(false) // メールアドレス入力済みかのフラグ
const passwordFlag = ref(false)
const confirmPasswordFlag = ref(false)
const emailCheckFlag = ref(false) // メールチェック送信して成功した場合のフラグ
const submitBtnDisabled = ref(true)

const mailCheckHidden = ref(false)
const mailLoadingHidden = ref(true)
const mailTrueHidden = ref(true)
const mailFalseHidden = ref(true)
const mailErrorHidden = ref(true)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const resultToken = ref("")
const resultEmail = ref("")

const valForm = () => {
  submitBtnDisabled.value = !(usernameFlag.value && nicknameFlag.value && emailFlag.value && passwordFlag.value && confirmPasswordFlag.value && emailCheckFlag.value);
}

const usernameCheckEvent = () => {
  usernameFlag.value = username.value.length >= 1 && username.value.length <= 16;
  valForm()
}

const nicknameCheckEvent = () => {
  nicknameFlag.value = nickname.value.length >= 1 && nickname.value.length <= 16;
  valForm()
}

const emailCheckEvent = () => {
  let checked = emailReg.test(email.value)
  if (checked) {
    emailFlag.value = true
    emailCheckFlag.value = false
  } else {
    emailFlag.value = false
    emailCheckFlag.value = false
  }
  valForm()
}

const passwordCheckEvent = () => {
  let checked = passwordReg.test(password.value)
  passwordFlag.value = checked && password.value.length >= 8 && password.value.length <= 20;
  valForm()
}

const confirmPasswordCheckEvent = () => {
  let checked = passwordReg.test(confirmPassword.value)
  confirmPasswordFlag.value = checked && confirmPassword.value === password.value;
  valForm()
}

const onSubmit = async () => {
  modalShow.value = true
  errorValMessage.value = false
  errorPostMessage.value = false
  const params :{
    username: string,
    nickname: string,
    email: string,
    password: string
    confirmPassword: string
  } = {
    username: username.value,
    nickname: nickname.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  }
  try {
    resultToken.value = await $fetch(signupUrl, {
      method: 'POST',
      body: params,
      key: signupUrl,
    }) as any
    if (resultToken.value === 'failed') {
      errorValMessage.value = true
      modalShow.value = false
    } else {
      navigateTo({
        path: '/signup/verify',
        query: {
          token: resultToken.value
        }
      })
    }
  } catch {
    errorPostMessage.value = true
    modalShow.value = false
  }
}

const submitEmailCheck = async (e: Event) => {
  e.preventDefault()
  mailCheckHidden.value = true
  mailLoadingHidden.value = false
  const params :{ email: string } = {email: email.value}
  try {
    resultEmail.value = await $fetch(emailCheckUrl, {
      method: 'POST',
      body: params,
      key: 'email',
    }) as any
    if (resultEmail.value) {
      mailLoadingHidden.value = true
      mailTrueHidden.value = false
      emailCheckFlag.value = true
    } else {
      mailLoadingHidden.value = true
      mailFalseHidden.value = false
      emailCheckFlag.value = false
      setTimeout(() => {
        mailFalseHidden.value = true
        mailCheckHidden.value = false
      }, 5000)
    }
  } catch (error) {
    mailLoadingHidden.value = true
    mailErrorHidden.value = false
    emailCheckFlag.value = false
    setTimeout(() => {
      mailErrorHidden.value = true
      mailCheckHidden.value = false
    })
  }
  valForm()
}

const clearEvent = (e: Event) => {
  e.preventDefault()
  email.value = ''
  emailFlag.value = false
  emailCheckFlag.value = false
  mailTrueHidden.value = true
  mailCheckHidden.value = false
  valForm()
}

</script>

<template>
  <div id="content" class="d-flex justify-content-center">
    <main>
      <h3 class="mt-3 mb-4 text-center">無料会員登録</h3>
      <form @submit.prevent="onSubmit" class="d-flex justify-content-center align-items-center flex-column">
        <div class="form-group my-2">
          <div class="_label_parent d-flex align-items-end">
            <label id="name-label" for="username" class="form-label" :class="{ '_checked': usernameFlag }">氏名：</label>
          </div>
          <input @input="usernameCheckEvent" v-model="username" type="text" :class="{ '_clear': usernameFlag }" class="form-control shadow-sm" required autocomplete="username" autofocus
                 placeholder="田中 太郎">
        </div>
        <div class="form-group my-2">
          <div class="_label_parent d-flex align-items-end">
            <label id="nickname-label" for="nickname" class="form-label" :class="{ '_checked': nicknameFlag }">ニックネーム：</label>
          </div>
          <input @input="nicknameCheckEvent" v-model="nickname" type="text" :class="{ '_clear': nicknameFlag }" class="form-control shadow-sm" required autocomplete="nickname" autofocus
                 placeholder="ニックネーム">
        </div>
        <div class="form-group my-2">
          <div class="_label_parent d-flex align-items-end">
            <label id="email-label" for="email" class="form-label" :class="{ '_checked': emailCheckFlag }">メールアドレス：</label>
          </div>
          <input @input="emailCheckEvent" v-model="email" type="text" :class="{ '_clear': emailCheckFlag }" class="form-control shadow-sm" required autocomplete="email"
                 placeholder="taro_tanaka@example.com">
        </div>
        <div id="mail-check-space"></div>
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
        <div v-if="errorValMessage" class="_alert alert alert-danger">
          入力内容にエラーがありました。ご確認ののち、再度送信してください。
        </div>
        <div v-if="errorPostMessage" class="_alert alert alert-danger">
          通信エラーが発生しました。再度送信してください。
        </div>
        <div class="form-group d-flex justify-content-center my-4">
          <button id="submitBtn" type="submit" class="btn _btn_primary shadow-sm" :class="{'_disabled': submitBtnDisabled}" :disabled="submitBtnDisabled">登録</button>
        </div>
      </form>
      <div id="mail-check-container">
        <div id="mail-check-box" class="form-group my-4 d-flex flex-column justify-content-center">
          <div id="mail-check-title">メールアドレスチェック</div>
          <div id="mail-check" class="d-flex flex-column align-items-center justify-content-center" :class="{ '_hidden': mailCheckHidden}">
            <div class="px-3 my-3"><small>下のボタンをクリックしてメールアドレスが既に使用されているかチェックします</small></div>
            <button @click="submitEmailCheck" id="emailCheck" class="btn btn-success btn-sm shadow-sm" :class="{ '_disabled': !emailFlag}" :disabled="!emailFlag">チェック</button>
          </div>
          <div id="mail-loading" class="d-flex justify-content-center align-items-center" :class="{ '_hidden': mailLoadingHidden}">
            <div class="_mail_text"><small>取得中...</small></div>
          </div>
          <div id="mail-true" class="d-flex flex-column justify-content-center align-items-center" :class="{ '_hidden': mailTrueHidden}">
            <div class="_mail_text">使用されていないメールアドレスです</div>
            <div class="mt-4"><button @click="clearEvent" id="emailClear" class="btn btn-success btn-sm shadow-sm">クリア</button></div>
          </div>
          <div id="mail-false" class="d-flex flex-column justify-content-center align-items-center"  :class="{ '_hidden': mailFalseHidden}">
            <div class="_mail_text">既に使用されているメールアドレスです<br>別のメールアドレスを使用してください</div>
            <div><small>5秒後にチェックボタンが戻ります</small></div>
          </div>
          <div id="mail-error" class="d-flex flex-column justify-content-center align-items-center" :class="{ '_hidden': mailErrorHidden}">
            <div class="_mail_text">エラーが発生しました</div>
            <div><small>5秒後にチェックボタンが戻ります</small></div>
          </div>
        </div>
      </div>
      <div class="text-center my-4">
        <NuxtLink to="/login">すでに登録済みの方はこちら</NuxtLink>
      </div>
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
._label_parent {
  height: 36px;
}
#mail-check-space {
  margin-top: 10px;
  height: 180px;
}
#mail-check-container {
  width: 320px;
  position: absolute;
  top: 350px;
  left: 40px;
}
#mail-check-box {
  width: 100%;
  height: 140px;
  border-radius: 10px;
  border: 1px rgb(200, 200, 200) solid;
  padding: 10px;
  position: relative;
}

#mail-check-title {
  position: absolute;
  top: -14px;
  font-size: 1rem;
  background-color: rgb(240, 240, 240);
}
#mail-loading ._mail_text {
  color: rgb(180, 180, 180);
  font-weight: bold;
}
#mail-true ._mail_text {
  color: var(--bs-green);
  font-weight: bold;
}
#mail-false ._mail_text {
  color: var(--bs-red);
  font-weight: bold;
}
._password_rule_text {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  #mail-check-container {
    left: calc(50% - 160px);
  }
}

@media (max-width: 576px) {
  #mail-check-container {
    width: calc(100% - 40px);
    left: 20px;
  }
  #emailCheck {
    width: 100%;
  }
}
</style>
