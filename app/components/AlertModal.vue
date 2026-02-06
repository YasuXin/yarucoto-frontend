<script setup lang="ts">
const props = defineProps({
  modalShow: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  btnMessage: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['delete', 'return'])

const deleteEvent = () => {
  emits('delete')
}
const returnEvent = () => {
  emits('return')
}
</script>

<template>
  <div v-if="modalShow" class="_alert_modal_bg">
    <div class="d-flex justify-content-center align-items-center w-100 h-100">
      <div class="_alert_modal_window">
        <h5>{{props.title}}</h5>
        <div class="d-flex justify-content-center">
          <p v-html="props.message"></p>
        </div>
        <div class="_alert_modal_btns d-flex justify-content-around">
          <button @click="deleteEvent" id="delete" class="btn btn-danger shadow-sm">{{props.btnMessage}}</button>
          <button @click="returnEvent" id="delete-modal-close" class="btn btn-secondary shadow-sm">戻る</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
._alert_modal_bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.9);
  z-index: 50;
}
._alert_modal_window {
  width: calc(100% - 40px);
  max-width: 500px;
  margin: 0 20px;
  height: auto;
  padding: 38px 20px;
  border-radius: 5px;
  color: var(--font-color);
  border: var(--thick-border);
  border-color: var(--bs-red);
  background-color: var(--alert-bg-color);
}
._alert_modal_window h5 {
  margin: 0 auto;
  padding-bottom: 10px;
  border-bottom: var(--middle-border);
  border-color: var(--bs-red);
  display: flex;
  justify-content: center;
  align-items: center;
}
._alert_modal_window p {
  display: inline-block;
  margin: 20px;
}
._alert_modal_btns {
  margin: 0 auto;
  width: 70%;
}
</style>
