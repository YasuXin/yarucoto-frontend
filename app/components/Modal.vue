<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    default: '送信中...'
  },
  modalShow: {
    type: Boolean,
    default: false
  }
})
const message = computed(() => props.message)
const modalShow = computed(() => props.modalShow)

</script>

<template>
  <transition>
    <div v-show="modalShow" id="modal-container">
      <div id="modal-message-box" class="_modal_message_box_animation">
        <div id="modal-message" class="_modal_message_animation">{{message}}</div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: opacity 0.2s;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
.v-enter-to, .v-leave-from {
  opacity: 1;
}
#modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);
  color: white;
  z-index: 1001;
  animation-name: containerAnimation;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}
@keyframes containerAnimation {
  0% {background-color: rgba(0,0,0,0.4);}
  50% {background-color: rgba(0,0,0,0.9);}
  100% {background-color: rgba(0,0,0,0.4);}
}
#modal-message-box {
  background-image: var(--modal-message-box-bg-image);
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 100%;
  font-size: 1.3rem;
  font-style: italic;
}
</style>
