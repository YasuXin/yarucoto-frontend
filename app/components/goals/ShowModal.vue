<script setup lang="ts">
import type {Goal} from "~/interfaces";

const props = defineProps({
  goal: {
    type: Object as () => Goal,
    required: true
  }
})

const emit = defineEmits(['close'])
const closeEvent = () => {
  emit('close')
}
</script>

<template>
  <div class="_modal_background _bg_fadein" ref="modalBackground">
    <div class="_modal_window _window_fadein shadow" ref="modalWindow">
      <button class="_close_btn" @click="closeEvent"><img src="~/assets/images/batsu.png" width="24" alt="x"></button>
      <h4 class="text-center">{{props.goal?.year}}年{{props.goal?.month}}月の目標</h4>
      <div class="d-flex align-items-center mt-4">
        <h6 class="_left mb-0">タイトル：</h6>
        <div>{{props.goal?.title}}</div>
      </div>
      <h6 class="mt-4">詳細：</h6>
      <div class="_description">{{props.goal?.description}}</div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/modal_container.css";
._close_btn {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
h4 {
  margin-top: 20px;
}
._description {
  margin: 0 10px;
}
</style>
