<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "モーダルタイトル"
  },
  message: {
    type: String,
    default: 'モーダルメッセージ'
  }
})
const emits = defineEmits(['delete', 'return'])

const title = computed(() => props.title)
const message = computed(() => props.message)

const deleteEvent = () => {
  emits('delete')
}
const returnEvent = () => {
  emits('return')
}
</script>

<template>
  <transition>
    <div class="_modal_bg">
      <div class="d-flex justify-content-center align-items-center w-100 h-100">
        <div class="_modal_window">
          <h5>{{title}}</h5>
          <p>{{message}}</p>
          <div class="_delete_modal_btns d-flex justify-content-around">
            <button @click="deleteEvent" class="btn btn-danger shadow-sm">削除する</button>
            <button @click="returnEvent" class="btn btn-secondary shadow-sm">戻る</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
.v-enter-to, .v-leave-from {
  opacity: 1;
}
._modal_bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.9);
  color: var(--font-color);
}
._modal_window {
  background-color: var(--modal-window-color);
  width: calc(100% - 40px);
  max-width: 500px;
  margin: 0 20px;
  height: auto;
  padding: 38px 20px;
  border-radius: 5px;
}
._modal_window h5 {
  margin: 0 auto;
  padding-bottom: 10px;
  border-bottom: var(--middle-border);
  display: flex;
  justify-content: center;
  align-items: center;
}
._modal_window p {
  display: inline-block;
  margin: 20px;
}
._modal_btns {
  margin: 0 auto;
  width: 70%;
}
</style>
