<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

definePageMeta({
  middleware: "anonymous",
  layout: "anonymous"
})

useHead({
  title: 'Yarucoto | Reset-Password | Verify'
})
const { login } = useAuth()

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const postVerifyUrl = baseUrl + '/reset-password/verify'

const route = useRoute()
const token: string | undefined = route.query.token as string | undefined
const resultSubmit = ref('')

const intReg = /^[0-9]{1}$/

// 6桁の数字の要素
const intEl1 = ref()
const intEl2 = ref()
const intEl3 = ref()
const intEl4 = ref()
const intEl5 = ref()
const intEl6 = ref()

// 6桁の数字の要素に入力された値
const int1 = ref()
const int2 = ref()
const int3 = ref()
const int4 = ref()
const int5 = ref()
const int6 = ref()

// 6桁の数字がそれぞれ適切な値かどうか
const intFlag1 = ref(false)
const intFlag2 = ref(false)
const intFlag3 = ref(false)
const intFlag4 = ref(false)
const intFlag5 = ref(false)
const intFlag6 = ref(false)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const errorPostMessage = ref(false)
const errorNoRecordMessage = ref(false)
const errorNotEqualsNumberMessage = ref(false)
const errorThirtyOverMessage = ref(false)

const int1Event = () => {
  const checked = intReg.test(int1.value)
  if (checked) {
    intFlag1.value = true
    intEl2.value.focus()
  } else {
    intFlag1.value = false
    int1.value = ''
  }
  valForm()
}
const int2Event = () => {
  const checked = intReg.test(int2.value)
  if (checked) {
    intFlag2.value = true
    intEl3.value.focus()
  } else {
    intFlag2.value = false
    int2.value = ''
  }
  valForm()
}
const int3Event = () => {
  const checked = intReg.test(int3.value)
  if (checked) {
    intFlag3.value = true
    intEl4.value.focus()
  } else {
    intFlag3.value = false
    int1.value = ''
  }
  valForm()
}
const int4Event = () => {
  const checked = intReg.test(int4.value)
  if (checked) {
    intFlag4.value = true
    intEl5.value.focus()
  } else {
    intFlag4.value = false
    int1.value = ''
  }
  valForm()
}
const int5Event = () => {
  const checked = intReg.test(int5.value)
  if (checked) {
    intFlag5.value = true
    intEl6.value.focus()
  } else {
    intFlag5.value = false
    int1.value = ''
  }
  valForm()
}
const int6Event = () => {
  const checked = intReg.test(int6.value)
  if (checked) {
    intFlag6.value = true
  } else {
    intFlag6.value = false
    int6.value = ''
  }
  valForm()
}

const  valForm = async () => {
  if (intFlag1 && intFlag2 && intFlag3 && intFlag4 && intFlag5 && intFlag6) {
    const numbersText = '' + int1.value + int2.value + int3.value + int4.value + int5.value + int6.value
    if (numbersText.length === 6) {
      await onVerify(numbersText)
    }
  }
}
const onVerify = async (numbersText: string) => {
  modalShow.value = true

  const params: {
    token: string,
    numbers: string
  } = {
    token: token ? token : '',
    numbers: numbersText
  }
  try {
    resultSubmit.value = await $fetch(postVerifyUrl, {
      method: 'POST',
      body: params,
      key: 'token',
    }) as any
    if (resultSubmit.value === 'no-record') {
      errorNoRecordMessage.value = true
      modalShow.value = false
    } else if (resultSubmit.value === 'not-equals-number') {
      errorNotEqualsNumberMessage.value = true
      modalShow.value = false
    } else if (resultSubmit.value === 'thirty-over') {
      errorThirtyOverMessage.value = true
      modalShow.value = false
    } else {
      modalMessage.value = 'パスワードの再設定が完了しました'
      email.value = resultSubmit.value
      setTimeout(() => {
        modalShow.value = false
        loginHidden.value = false
      }, 1000)

    }
  } catch {
    errorPostMessage.value = true
    modalShow.value = false
  } finally {
    int1.value = ''
    int2.value = ''
    int3.value = ''
    int4.value = ''
    int5.value = ''
    int6.value = ''
    intEl1.value.focus()
  }
}

const loginHidden = ref(true)
const email = ref('')

const passwordReg = /^[a-zA-Z0-9.?/-]{8,20}$/

const password = ref('')
const passwordFlag = ref(false)
const submitBtnDisabled = ref(true)
const errorLoginMessage = ref(false)

const passwordCheckEvent = () => {
  let checked = passwordReg.test(password.value)

  passwordFlag.value = checked && password.value.length >= 8 && password.value.length <= 20;
  loginValForm()
}
const loginValForm = () => {
  submitBtnDisabled.value = !(passwordFlag.value);
}
const onSubmit = async () => {
  modalMessage.value = '送信中...'
  modalShow.value = true
  const success = await login(email.value, password.value)
  if (!success) {
    modalShow.value = false
    errorLoginMessage.value = true
  } else {
    navigateTo('/home')
  }
}
</script>

<template>
  <div id="content" class="d-flex justify-content-center" :class="{'_hidden': !loginHidden}">
    <main>
      <h3 class="mt-3 mb-4 text-center">パスワードの再設定</h3>
      <form class="d-flex justify-content-center align-items-center flex-column">
        <div id="" class="form-label mx-4">先ほど入力いただいたメールアドレスにメールを送信しました。メールに記載された6桁の数字を入力して会員登録を完了してください。</div>
        <div id="intParent" class="form-group my-3 d-flex justify-content-between">
          <input ref="intEl1" v-model="int1" @input="int1Event" id="int1" type="tel" :class="{ '_clear': intFlag1 }" class="form-control form-control-sm _int shadow-sm" required maxlength="1"
                 autofocus pattern="^[0-9]+$">
          <input ref="intEl2" v-model="int2" @input="int2Event" id="int2" type="tel" :class="{ '_clear': intFlag2 }" class="form-control form-control-sm _int shadow-sm" required maxlength="1"
                 pattern="^[0-9]+$">
          <input ref="intEl3" v-model="int3" @input="int3Event" id="int3" type="tel" :class="{ '_clear': intFlag3 }" class="form-control form-control-sm _int shadow-sm" required maxlength="1"
                 pattern="^[0-9]+$">
          <input ref="intEl4" v-model="int4" @input="int4Event" id="int4" type="tel" :class="{ '_clear': intFlag4 }" class="form-control form-control-sm _int shadow-sm" required maxlength="1"
                 pattern="^[0-9]+$">
          <input ref="intEl5" v-model="int5" @input="int5Event" id="int5" type="tel" :class="{ '_clear': intFlag5 }" class="form-control form-control-sm _int shadow-sm" required maxlength="1"
                 pattern="^[0-9]+$">
          <input ref="intEl6" v-model="int6" @input="int6Event" id="int6" type="tel" :class="{ '_clear': intFlag6 }" class="form-control form-control-sm _int shadow-sm" required maxlength="1"
                 pattern="^[0-9]+$">
        </div>
        <ul id="verify-texts">
          <li>パスワードの再設定から30分以内に再設定手続きを完了してください</li>
          <li>6桁の数字の入力は必ずこのページから行ってください</li>
          <li>送信したメールは迷惑メールフォルダに入ることがあるので、ご確認ください</li>
        </ul>
      </form>
      <div v-if="errorPostMessage" class="_alert alert alert-danger">
        通信エラーが発生しました。再度送信してください。
      </div>
      <div v-if="errorNoRecordMessage" class="_alert alert alert-danger">
        レコードが見つかりません。再度パスワードの再設定を行ってください。
      </div>
      <div v-if="errorNotEqualsNumberMessage" class="_alert alert alert-danger">
        6桁の数字が間違っています。再度入力してください。
      </div>
      <div v-if="errorThirtyOverMessage" class="_alert alert alert-danger">
        パスワードの再設定から30分以上経過しています。再度パスワードの再設定を行ってください。
      </div>
    </main>
  </div>
  <div id="login-content" class="d-flex justify-content-center" :class="{'_hidden': loginHidden}">
    <main>
      <h3 class="mt-3 mb-5 text-center">パスワードの再設定完了</h3>
      <div id="login-title" class="form-label mx-4">パスワードを入力してログインできます。</div>
      <form @submit.prevent="onSubmit" class="d-flex justify-content-center align-items-center flex-column">
        <div class="form-group my-3">
          <div class="_label_parent d-flex align-items-end">
            <label id="email-label" for="email" class="form-label _checked">メールアドレス：</label>
          </div>
          <div id="email-text">{{email}}</div>
        </div>
        <div class="form-group my-3">
          <div class="form-group my-3">
            <label id="password-label" for="password" class="form-label" :class="{ '_checked': passwordFlag }">パスワード：</label>
            <input @input="passwordCheckEvent" v-model="password" id="password" type="password" :class="{ '_clear': passwordFlag }" class="form-control shadow-sm" required autocomplete="new-password"
                   placeholder="パスワード">
          </div>
        </div>
        <div v-if="errorLoginMessage" class="_alert alert alert-danger">
          パスワードが正しくありません。
        </div>
        <div class="form-group d-flex justify-content-center my-4">
          <button id="submitBtn" type="submit" class="btn _btn_primary shadow-sm" :class="{ '_disabled': submitBtnDisabled}" :disabled="submitBtnDisabled">ログイン</button>
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
#login-content {
  background-color: var(--annonymous-bg-color);
}
._int {
  width: 40px;
  height: 50px;
  text-align:center;
  font-size: 1.4rem;
  caret-color: transparent;
}
#verify-texts {
  font-size: 0.9rem;
  margin: 16px 48px 16px 30px;
}

@media (max-width: 576px) {
  #intParent {
    width: 280px !important;
  }
  ._int {
    width: 35px;
  }
  #verify-texts {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
@media (max-width: 374px) {
  #intParent {
    width: 100% !important;
  }
}
</style>
