<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['submit'])

const password = ref('')
const passwordFlag = ref(false)

const isSubmitDisabled = ref(true)

const valForm = () => {
  isSubmitDisabled.value = !passwordFlag;
}
const passwordReg = /^[a-zA-Z0-9.?/-]{8,20}$/
const passwordCheckEvent = () => {
  let checked = passwordReg.test(password.value)
  passwordFlag.value = checked && password.value.length >= 8 && password.value.length <= 20;
  valForm()
}

const onSubmit = () => {
  emit('submit', password.value)
}
</script>

<template>
  <div id="form-parent" class="d-flex flex-column justify-content-center align-items-center">
    <div>{{props.message}}</div>
    <form @submit.prevent="onSubmit">
      <div class="form-group my-4">
        <div class="_label_parent d-flex align-items-end">
          <label id="passwordLabel" for="password" class="form-label" :class="{ '_checked': passwordFlag }">パスワード：</label>
        </div>
        <input v-model="password" @input="passwordCheckEvent" type="password" class="form-control shadow-sm" :class="{ '_clear': passwordFlag }" autofocus>
        <div id="alert-password" class="_alert"></div>
      </div>
      <div class="mt-4 mb-5 d-flex justify-content-center">
        <button type="submit" id="submitBtn" class="btn _btn_primary shadow-sm" :class="{'_disabled' : isSubmitDisabled}" :disabled="isSubmitDisabled">送信</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
@import "~/assets/css/form_clear.css";
.form-group {
  width: 300px;
}
._label_parent {
  height: 36px;
}
label {
  margin-bottom: 2px !important;
  padding-bottom: 3px;
  vertical-align: bottom;
}
._alert {
  width: 100%;
  min-height: 24px;
  margin: 5px 10px 0;
  font-size: 0.9rem;
  color: var(--bs-red);
}
@media (max-width: 576px) {
  #form-parent {
    width: 100%;
    padding: 0 20px;
  }
  form {
    width: 100%;
  }
  .form-group {
    width: 100%;
  }
}
</style>
