<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  postalCode: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  registerUserId: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['submit'])

const name = ref(props.name)
const email = ref(props.email)
const postalCode = ref(props.postalCode)
const address = ref(props.address)
const phoneNumber = ref(props.phoneNumber)
const text = ref(props.text)
const registerUserId = ref(props.registerUserId)
watch(props, () => {
  name.value = props.name
  email.value = props.email
  postalCode.value = props.postalCode
  address.value = props.address
  phoneNumber.value = props.phoneNumber
  text.value = props.text
  registerUserId.value = props.registerUserId
  if (text.value.length > 0) {
    textOk.value = true
    valForm()
  }
})
const isSubmitDisabled = ref(true)

const alertName = ref('')
const alertEmail = ref('')
const alertText = ref('')

const nameOk = ref(false)
const emailOk = ref(false)
const textOk = ref(false)

const valForm = () => {
  if (nameOk.value && emailOk.value && textOk.value) {
    isSubmitDisabled.value = false
  } else {
    isSubmitDisabled.value = true
  }
}
const nameEvent = () => {
  if (name.value.length === 0) {
    alertName.value = '氏名を入力してください'
    nameOk.value = false
  } else if (name.value.length > 16) {
    alertName.value = '氏名は16文字までで入力してください'
    nameOk.value = false
  } else {
    alertName.value = ''
    nameOk.value = true
  }
  valForm()
}
const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const emailEvent = () => {
  const checked = emailReg.test(email.value)
  if (checked) {
    alertEmail.value = ''
    emailOk.value = true
  } else if (email.value.length === 0) {
    alertEmail.value = 'メールアドレスを入力してください'
    emailOk.value = false
  } else {
    alertEmail.value = ''
    emailOk.value = false
  }
  valForm()
}
const textEvent = () => {
  if (text.value.length === 0) {
    alertText.value = '内容を入力してください'
    textOk.value = false
  } else {
    alertText.value = ''
    textOk.value = true
  }
  valForm()
}

const onSubmit = () =>  {
  const params = {
    name: name.value,
    email: email.value,
    postalCode: postalCode.value,
    address: address.value,
    phoneNumber: phoneNumber.value,
    text: text.value,
    registerUserId: registerUserId.value,
  }
  emit('submit', params)
}

onMounted(() => {

})
</script>

<template>
  <form @submit.prevent="onSubmit"
        class="d-flex justify-content-center align-items-center flex-column">
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="nameLabel" for="name" class="form-label" :class="{'_checked' : nameOk}">氏名：<small class="_required">※必須</small></label>
      </div>
      <input @input="nameEvent" v-model="name" type="text" class="form-control shadow-sm" :class="{'_clear' : nameOk}" required placeholder="例)田中太郎" autofocus>
      <div class="_alert">{{alertName}}</div>
    </div>
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="emailLabel" for="email" class="form-label" :class="{'_checked' : emailOk}">メールアドレス：<small class="_required">※必須</small></label>
      </div>
      <input @input="emailEvent" v-model="email" type="email" class="form-control shadow-sm" :class="{'_clear' : emailOk}" required placeholder="例)taro_tanaka@example.com">
      <div class="_alert">{{alertEmail}}</div>
    </div>
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="postalCodeLabel" for="postalCode" class="form-label">郵便番号：</label>
      </div>
      <input v-model="postalCode" type="text" class="form-control shadow-sm" placeholder="例)1234567">
      <div class="_alert"></div>
    </div>
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="addressLabel" for="address" class="form-label">住所：</label>
      </div>
      <input v-model="address" type="text" class="form-control shadow-sm" placeholder="例)東京都××区〇〇町1-1-1">
      <div class="_alert"></div>
    </div>
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="phoneNumberLabel" for="phoneNumber" class="form-label">電話番号：</label>
      </div>
      <input v-model="phoneNumber" type="tel" class="form-control shadow-sm" placeholder="例)09012345678">
      <div class="_alert"></div>
    </div>
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="textLabel" for="text" class="form-label" :class="{'_checked' : textOk}">内容：<small class="_required">※必須</small></label>
      </div>
      <textarea @input="textEvent" v-model="text" class="form-control shadow-sm" rows="8" :class="{'_clear' : textOk}" required placeholder="お問い合わせ内容をご記入ください">お問い合わせ内容をご記入ください</textarea>
      <div class="_alert">{{alertText}}</div>
    </div>
    <div class="form-group d-flex justify-content-center my-4">
      <button id="submitBtn" type="submit" class="btn _btn_primary shadow-sm" :class="{'_disabled' : isSubmitDisabled}" :disabled="isSubmitDisabled">送信</button>
    </div>
  </form>
</template>

<style scoped>
form {
  width: 500px;
}
.form-group {
  width: 100%;
}
._required {
  color: var(--bs-red);
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
._alert {
  width: 100%;
  min-height: 24px;
  margin: 5px 10px 0;
  font-size: 0.9rem;
  color: var(--bs-red);
}
::-webkit-resizer {
  background: rgb(210, 210, 210) !important;
}
input,
textarea,
select {
  background-color: rgb(240, 240, 240) !important;
  border-color: #dee2e6 !important;
  color: rgb(30, 30, 30) !important;
  scrollbar-color: rgb(150, 150, 150) rgb(220, 220, 220);
}

input::placeholder,
textarea::placeholder {
  color: rgb(180, 180, 180) !important;
}
@media (max-width: 576px) {
  form {
    width:100%;
    padding: 0;
  }
}
</style>
