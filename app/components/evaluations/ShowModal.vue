<script setup lang="ts">
import type {Evaluation} from "~/interfaces";

const props = defineProps({
  evaluation: {
    type: Object as () => Evaluation,
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
      <h4 class="text-center">{{props.evaluation?.year}}年{{props.evaluation?.month}}月の評価</h4>
      <div class="d-flex align-items-center mt-4">
        <h6 class="_left mb-0">5段階評価：</h6>
        <div class="d-flex">
          <div v-for="n in props.evaluation.rate" class="_evaluation_star mx-1">&#9733;</div>
          <div v-for="n in 5 - props.evaluation.rate" class="_evaluation_star mx-1">&#9734;</div>
        </div>
      </div>
      <h6 class="mt-4">文章：</h6>
      <div class="_text">{{props.evaluation?.text}}</div>
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
._evaluation_star {
  color: rgb(200,180,50);
}
._text {
  margin: 0 10px;
}
</style>
