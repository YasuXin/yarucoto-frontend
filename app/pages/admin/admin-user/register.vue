<script setup lang="ts">
definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | AdminUser | Register"
})
const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const emailCheckUrl = baseUrl + '/guest/post/emailCheck'
const createAdminUserUrl = baseUrl + '/admin/users/create'

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordReg = /^[a-zA-Z0-9.?/-]{8,20}$/
const postalCodeReg = /^[0-9]{7}$/
const phoneNumberReg = /^[0-9]{10,11}$/

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const username = ref("")
const nickname = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const postalCode = ref("")
const address = ref("")
const phoneNumber = ref("")

const usernameFlag = ref(false)
const nicknameFlag = ref(false)
const emailFlag = ref(false) // メールアドレス入力済みかのフラグ
const passwordFlag = ref(false)
const confirmPasswordFlag = ref(false)
const emailCheckFlag = ref(false) // メールチェック送信して成功した場合のフラグ
const postalCodeFlag = ref(false)
const addressFlag = ref(false)
const phoneNumberFlag = ref(false)

const isSubmitDisabled = ref(true)

const alertUsername = ref('')
const alertNickname = ref('')
const alertEmail = ref('')
const alertPassword = ref('')
const alertPostalCode = ref('')
const alertAddress = ref('')
const alertPhoneNumber = ref('')

const emailCheckHidden = ref(false)
const emailLoadingHidden = ref(true)
const emailTrueHidden = ref(true)
const emailFalseHidden = ref(true)
const emailErrorHidden = ref(true)

const valForm = () => {
  isSubmitDisabled.value = !(
      usernameFlag.value &&
      nicknameFlag.value &&
      emailFlag.value &&
      passwordFlag.value &&
      confirmPasswordFlag.value &&
      emailCheckFlag.value &&
      postalCodeFlag.value &&
      addressFlag.value &&
      phoneNumberFlag.value
  );
}

const usernameCheckEvent = () => {
  if (username.value.length >= 1 && username.value.length <= 16) {
    alertUsername.value = ''
    usernameFlag.value = true
  } else if (username.value.length === 0) {
    alertUsername.value = '氏名を入力してください'
    usernameFlag.value = false
  } else if (username.value.length > 16) {
    alertUsername.value = '氏名は16文字までで入力してください'
    usernameFlag.value = false
  }
  valForm()
}
const nicknameCheckEvent = () => {
  if (nickname.value.length >= 1 && nickname.value.length <= 16) {
    alertNickname.value = ''
    nicknameFlag.value = true
  } else if (nickname.value.length === 0) {
    alertNickname.value = 'ニックネームを入力してください'
    nicknameFlag.value = false
  } else if (nickname.value.length > 16) {
    alertNickname.value = 'ニックネームは16文字までで入力してください'
    nicknameFlag.value = false
  }
  valForm()
}
const emailCheckEvent = () => {
  let checked = emailReg.test(email.value)
  if (email.value.length === 0) {
    emailFlag.value = false
    emailCheckFlag.value = false
    alertEmail.value = 'メールアドレスを入力してください'
  } else if (checked) {
    emailFlag.value = true
    emailCheckFlag.value = false
    alertEmail.value = ''
  } else {
    emailFlag.value = false
    emailCheckFlag.value = false
    alertEmail.value = ''
  }
  valForm()
}
const postalCodeCheckEvent = () => {
  if (postalCodeReg.test(postalCode.value)) {
    postalCodeFlag.value = true
    alertPostalCode.value = ''
  } else {
    postalCodeFlag.value = false
    alertPostalCode.value = '郵便番号の形式で入力してください'
  }
  valForm()
}
const addressCheckEvent = () => {
  if (address.value.length > 0) {
    addressFlag.value = true
    alertAddress.value = ''
  } else {
    addressFlag.value = false
    alertAddress.value = '住所を入力してください'
  }
  valForm()
}
const phoneNumberCheckEvent = () => {
  if (phoneNumberReg.test(phoneNumber.value)) {
    phoneNumberFlag.value = true
    alertPhoneNumber.value = ''
  } else {
    phoneNumberFlag.value = false
    alertPhoneNumber.value = '電話番号の形式で入力してください'
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

const registerResult = ref('')
const onSubmit= async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params :{
    username: string,
    nickname: string,
    email: string,
    password: string,
    confirmPassword: string,
    postalCode: string,
    address: string,
    phoneNumber: string
  } = {
    username: username.value,
    nickname: nickname.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    postalCode: postalCode.value,
    address: address.value,
    phoneNumber: phoneNumber.value
  }
  try {
    const res = await $fetch(createAdminUserUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      key: createAdminUserUrl
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
      modalMessage.value = '管理者を追加しました'
      setTimeout(() => {
        modalShow.value = false
        navigateTo('/admin/home')
      }, 2000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}

const resultEmail = ref<string>('')
const submitEmailCheck = async (e: Event) => {
  e.preventDefault()
  emailCheckHidden.value = true
  emailLoadingHidden.value = false
  const params :{ email: string } = {email: email.value}
  try {
    const res = await $fetch(emailCheckUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      keys: emailCheckUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    resultEmail.value = res
    if (resultEmail.value) {
      emailLoadingHidden.value = true
      emailTrueHidden.value = false
      emailCheckFlag.value = true
    } else {
      emailLoadingHidden.value = true
      emailFalseHidden.value = false
      emailCheckFlag.value = false
      setTimeout(() => {
        emailFalseHidden.value = true
        emailCheckHidden.value = false
      }, 5000)
    }
  } catch (error) {
    emailLoadingHidden.value = true
    emailErrorHidden.value = false
    emailCheckFlag.value = false
    setTimeout(() => {
      emailErrorHidden.value = true
      emailCheckHidden.value = false
    }, 5000)
  }
  valForm()
}

const clearEvent = (e: Event) => {
  e.preventDefault()
  email.value = ''
  emailFlag.value = false
  emailCheckFlag.value = false
  emailTrueHidden.value = true
  emailFalseHidden.value = true
  emailCheckHidden.value = false
  valForm()
}

</script>

<template>
  <div id="main-child" class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>新規管理者登録</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
    </div>
    <div id="form-parent">
      <form @submit.prevent="onSubmit" class="d-flex justify-content-center align-items-center flex-column">
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="name-label" for="username" class="form-label" :class="{ '_checked': usernameFlag }">氏名：</label>
          </div>
          <input @input="usernameCheckEvent" v-model="username" type="text" :class="{ '_clear': usernameFlag }" class="form-control" required autocomplete="username" autofocus
                 placeholder="田中 太郎">
          <div id="alert-postal-code" class="_alert">{{alertUsername}}</div>
        </div>
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="nickname-label" for="nickname" class="form-label" :class="{ '_checked': nicknameFlag }">ニックネーム：</label>
          </div>
          <input @input="nicknameCheckEvent" v-model="nickname" type="text" :class="{ '_clear': nicknameFlag }" class="form-control" required autocomplete="nickname" autofocus
                 placeholder="ニックネーム">
          <div id="alert-postal-code" class="_alert">{{alertNickname}}</div>
        </div>
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="email-label" for="email" class="form-label" :class="{ '_checked': emailCheckFlag }">メールアドレス：</label>
          </div>
          <input @input="emailCheckEvent" v-model="email" type="text" :class="{ '_clear': emailCheckFlag }" class="form-control" required autocomplete="email"
                 placeholder="taro_tanaka@example.com">
          <div id="alert-postal-code" class="_alert">{{alertEmail}}</div>
        </div>
        <div id="mail-check-space"></div>
        <div class="form-group mt-4">
          <div class="_password_rule_text">パスワードは8～20文字 アルファベット小文字・大文字・数字を1文字以上使用してください</div>
        </div>
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="password-label" for="password" class="form-label" :class="{ '_checked': passwordFlag }">パスワード：</label>
          </div>
          <input @input="passwordCheckEvent" v-model="password" type="password" :class="{ '_clear': passwordFlag }" class="form-control" required autocomplete="new-password"
                 placeholder="">
          <div id="alert-password" class="_alert">{{alertPassword}}</div>
        </div>
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="confirm-label" for="confirmPassword" class="form-label" :class="{ '_checked': confirmPasswordFlag }">パスワード（確認用）：</label>
          </div>
          <input @input="confirmPasswordCheckEvent" v-model="confirmPassword" type="password" :class="{ '_clear': confirmPasswordFlag }" class="form-control" required autocomplete="new-password">
          <div id="alert-password" class="_alert">{{alertPassword}}</div>
        </div>
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="postalCodeLabel" for="postalCode" class="form-label" :class="{'_checked' : postalCodeFlag}">郵便番号：</label>
          </div>
          <input @input="postalCodeCheckEvent" v-model="postalCode" type="text" class="form-control" :class="{'_clear' : postalCodeFlag}" placeholder="例)1234567">
          <div id="alert-postal-code" class="_alert">{{alertPostalCode}}</div>
        </div>
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="addressLabel" for="address" class="form-label" :class="{'_checked' : addressFlag}">住所：</label>
          </div>
          <input @input="addressCheckEvent" v-model="address" type="text" class="form-control" :class="{'_clear' : addressFlag}" placeholder="例)東京都××区〇〇町1-1-1">
          <div id="alert-address" class="_alert">{{alertAddress}}</div>
        </div>
        <div class="form-group">
          <div class="_label_parent d-flex align-items-end">
            <label id="phoneNumberLabel" for="phoneNumber" class="form-label" :class="{'_checked' : phoneNumberFlag}">電話番号:</label>
          </div>
          <input @input="phoneNumberCheckEvent" v-model="phoneNumber" type="tel" class="form-control" :class="{'_clear' : phoneNumberFlag}" placeholder="例)09012345678">
          <div id="alert-phone-number" class="_alert">{{alertPhoneNumber}}</div>
        </div>
        <div class="mt-4 mb-5 d-flex justify-content-center">
          <button type="submit" id="submitBtn" class="btn _btn_primary shadow-sm" :class="{'_disabled' : isSubmitDisabled}" :disabled="isSubmitDisabled">登録</button>
        </div>
      </form>
      <div id="mail-check-container">
        <div id="mail-check-box" class="form-group my-4 d-flex flex-column justify-content-center">
          <div id="mail-check-title">メールアドレスチェック</div>
          <div id="mail-check" class="d-flex flex-column align-items-center justify-content-center" :class="{ '_hidden': emailCheckHidden}">
            <div class="px-3 my-3"><small>下のボタンをクリックしてメールアドレスが既に使用されているかチェックします</small></div>
            <button @click="submitEmailCheck" id="emailCheck" class="btn btn-success btn-sm shadow-sm" :class="{ '_disabled': !emailFlag}" :disabled="!emailFlag">チェック</button>
          </div>
          <div id="mail-loading" class="d-flex justify-content-center align-items-center" :class="{ '_hidden': emailLoadingHidden}">
            <div class="_mail_text"><small>取得中...</small></div>
          </div>
          <div id="mail-true" class="d-flex flex-column justify-content-center align-items-center" :class="{ '_hidden': emailTrueHidden}">
            <div class="_mail_text">使用されていないメールアドレスです</div>
            <div class="mt-4"><button @click="clearEvent" id="emailClear" class="btn btn-success btn-sm shadow-sm">クリア</button></div>
          </div>
          <div id="mail-false" class="d-flex flex-column justify-content-center align-items-center"  :class="{ '_hidden': emailFalseHidden}">
            <div class="_mail_text">既に使用されているメールアドレスです<br>別のメールアドレスを使用してください</div>
            <div><small>5秒後にチェックボタンが戻ります</small></div>
          </div>
          <div id="mail-error" class="d-flex flex-column justify-content-center align-items-center" :class="{ '_hidden': emailErrorHidden}">
            <div class="_mail_text">エラーが発生しました</div>
            <div><small>5秒後にチェックボタンが戻ります</small></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
#form-parent {
  position: relative;
  width: 400px;
}
.form-group {
  margin: 0!important;
  width: 100%;
}
._label_parent {
  height: 30px;
}
label {
  margin-bottom: 2px!important;
  padding-bottom: 3px;
  vertical-align: bottom;
}
._clear {
  background-color: rgba(200,255,200, 0.7)!important;
}
._clear:focus {
  background-color: rgba(200,255,200, 0.3)!important;
  border-color: rgb(30,255,60)!important;
  box-shadow: 0 0 0 .25rem rgba(13, 255, 60, 0.25)!important;
  -webkit-box-shadow: 0 0 0 .25rem rgba(13, 255, 60, 0.25)!important;
}
._checked::after {
  content: "✓";
  color: var(--completed-color);
  font-size: 1.5rem;
}
#mail-check-space {
  margin-top: 10px;
  height: 180px;
}
#mail-check-container {
  width: 100%;
  position: absolute;
  top: 270px;
  left: 0;
}
#mail-check-box {
  width: 100%;
  height: 160px;
  border-radius: 10px;
  border: var(--middle-border);
  padding: 10px;
  position: relative;
}

#mail-check-title {
  position: absolute;
  top: -14px;
  font-size: 1rem;
  background-color: var(--card-bg-color);
}
#mail-loading ._mail_text {
  color: var(--placeholder-color);
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
._alert {
  width: 100%;
  min-height: 20px;
  margin: 5px 10px 0;
  font-size: 0.9rem;
  color: var(--bs-red);
}

@media (max-width: 576px) {
  #form-parent {
    width: 100%;
  }
  form {
    width: 100%;
    padding: 0 20px;
  }
  #submitBtn {
    width: 100%;
  }
  #mail-check-container {
    width: calc(100% - 40px);
    left: 20px;
  }
  #emailCheck {
    width: 100%;
  }
}
</style>
