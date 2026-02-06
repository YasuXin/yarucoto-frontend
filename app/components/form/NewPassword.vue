<script setup lang="ts">
const emit = defineEmits(['submit'])

const params = reactive({
  password: '',
  confirmPassword: ''
})
const passwordFlag = ref(false)

const isSubmitDisabled = ref(true)

const valForm = () => {
  isSubmitDisabled.value = !passwordFlag.value;
}
const passwordReg = /^[a-zA-Z0-9.?/-]{8,20}$/
const passwordCheckEvent = () => {
  let checked1 = passwordReg.test(params.password)
  let checked2 = passwordReg.test(params.confirmPassword)
  passwordFlag.value = checked1 && checked2 && params.password === params.confirmPassword
  valForm()
}

const onSubmit = () => {
  emit('submit', params)
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="form-group my-2">
      <div class="_password_rule_text">パスワードは8～20文字 アルファベット小文字・大文字・数字を1文字以上使用してください</div>
    </div>
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="passwordLabel" for="password" class="form-label" :class="{ '_checked': passwordFlag }">新しいパスワード：</label>
      </div>
      <input v-model="params.password" @input="passwordCheckEvent" type="password" class="form-control shadow-sm" :class="{ '_clear': passwordFlag }" autofocus>
    </div>
    <div class="form-group my-2">
      <div class="_label_parent d-flex align-items-end">
        <label id="passwordLabel" for="password" class="form-label" :class="{ '_checked': passwordFlag }">新しいパスワード（確認用）：</label>
      </div>
      <input v-model="params.confirmPassword" @input="passwordCheckEvent" type="password" class="form-control shadow-sm" :class="{ '_clear': passwordFlag }">
    </div>
    <div class="mt-4 mb-5 d-flex justify-content-center">
      <button type="submit" id="submitBtn" class="btn _btn_primary shadow-sm" :class="{'_disabled' : isSubmitDisabled}" :disabled="isSubmitDisabled">送信</button>
    </div>
  </form>
</template>

<style scoped>
@import "~/assets/css/form_clear.css";
form {
  width: 300px;
}
.form-group {
  width: 100%;
}
._label_parent {
  height: 30px;
}
label {
  margin-bottom: 2px !important;
  padding-bottom: 3px;
  vertical-align: bottom;
}
@media (max-width: 576px) {
  form {
    width: 100%;
    padding: 0 10px;
  }
  #submitBtn {
    width: 100%;
  }
}
</style>
