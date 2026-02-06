<script setup lang="ts">
import type {User} from "~/interfaces";

definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | AdminUser | Edit"
})
const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const user = useState<User | null>('auth-user')

const emailCheckUrl = baseUrl + '/user/post/emailCheck'
const updateAdminUserUrl = baseUrl + '/admin/users/update'

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const postalCodeReg = /^[0-9]{7}$/
const phoneNumberReg = /^[0-9]{10,11}$/

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const username = ref(user.value?.username ?? '')
const nickname = ref(user.value?.nickname ?? '')
const email = ref(user.value?.email ?? '')
const postalCode = ref(user.value?.postalCode ?? '')
const address = ref(user.value?.address ?? '')
const phoneNumber = ref(user.value?.phoneNumber ?? '')

const usernameFlag = ref(true)
const nicknameFlag = ref(true)
const emailFlag = ref(true) // メールアドレス入力済みかのフラグ
const emailCheckFlag = ref(false) // メールチェック送信して成功した場合のフラグ
const postalCodeFlag = ref(true)
const addressFlag = ref(true)
const phoneNumberFlag = ref(true)

const isSubmitDisabled = ref(true)

const alertUsername = ref('')
const alertNickname = ref('')
const alertEmail = ref('')
const alertPostalCode = ref('')
const alertAddress = ref('')
const alertPhoneNumber = ref('')

const emailCheckHidden = ref(false)
const emailLoadingHidden = ref(true)
const emailTrueHidden = ref(true)
const emailFalseHidden = ref(true)
const emailErrorHidden = ref(true)
const emailSameHidden = ref(true)

const valForm = () => {
  isSubmitDisabled.value = !(
      usernameFlag.value &&
      nicknameFlag.value &&
      emailFlag.value &&
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

const registerResult = ref('')
const onSubmit= async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params :{
    username: string,
    nickname: string,
    email: string,
    postalCode: string,
    address: string,
    phoneNumber: string
  } = {
    username: username.value,
    nickname: nickname.value,
    email: email.value,
    postalCode: postalCode.value,
    address: address.value,
    phoneNumber: phoneNumber.value
  }
  try {
    const res = await $fetch(updateAdminUserUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      key: updateAdminUserUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    registerResult.value = res
    if (registerResult.value === 'success') {
      modalMessage.value = '会員情報を更新しました'
      setTimeout(() => {
        modalShow.value = false
        const auth = useAuth()
        auth.fetchUser()
        navigateTo('/admin/home')
      }, 2000)
    } else if (registerResult.value === 'failed') {
      modalMessage.value = '送信に失敗しました'
      setTimeout(() => {
        modalShow.value = false
      }, 2000)
    } else if (registerResult.value === 'not-unique') {
      modalMessage.value = 'そのメールアドレスは使用できません'
      setTimeout(() => {
        modalShow.value = false
      }, 2000)
    } else {
      modalMessage.value = '送信に失敗しました'
      setTimeout(() => {
        modalShow.value = false
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
    if (resultEmail.value === 't') {
      emailLoadingHidden.value = true
      emailTrueHidden.value = false
      emailCheckFlag.value = true
    } else if (resultEmail.value === 'f') {
      emailLoadingHidden.value = true
      emailFalseHidden.value = false
      emailCheckFlag.value = false
      setTimeout(() => {
        emailFalseHidden.value = true
        emailCheckHidden.value = false
      }, 5000)
    } else if (resultEmail.value === 'same') {
      emailLoadingHidden.value = true
      emailTrueHidden.value = true
      emailCheckFlag.value = true
      emailSameHidden.value = false
    } else {
      emailLoadingHidden.value = true
      emailErrorHidden.value = false
      emailCheckFlag.value = false
      setTimeout(() => {
        emailErrorHidden.value = true
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
const returnShow = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + user.value?.id)
}
</script>

<template>
  <div id="main-child" class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>管理者情報編集</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/users/list?page=1" class="_normal_link mb-3">会員一覧</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink @click="returnShow" class="_normal_link mb-3">会員情報</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/admin-user/edit/check-password" class="_normal_link mb-3">パスワード入力</NuxtLink>
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
          <input @input="nicknameCheckEvent" v-model="nickname" type="text" :class="{ '_clear': nicknameFlag }" class="form-control" required autocomplete="nickname"
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
          <div id="mail-same" class="d-flex flex-column justify-content-center align-items-center" :class="{'_hidden': emailSameHidden}">
            <div class="_mail_text">現在のあなたのメールアドレスです<br>
              そのまま送信するとメールアドレスを変更しません</div>
            <div class="mt-4"><button @click="clearEvent" id="emailClear2" class="btn btn-success btn-sm shadow-sm">クリア</button>
            </div>
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
@import "~/assets/css/form_clear.css";
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
