<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const auth = useAuth()
const logoutEvent = () => {
  auth.logout()
}
</script>

<template>
  <div class="_logout_btn_box d-flex justify-content-center align-items-center my-3">
    <a v-on:click="logoutEvent" class="_logout_btn btn btn-secondary _header_btn shadow-sm">
      ログアウト
    </a>
  </div>
</template>

<style scoped>
._logout_btn_box {
  margin-right: 16px;
}
@media (max-width: 1400px) {
  ._logout_btn {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  ._logout_btn_box {
    margin-right: 10px;
  }
  ._logout_btn {
    font-size: 1rem;
  }
}
@media (max-width: 576px) {
  ._logout_btn_box {
    margin-right: 0;
  }
  ._logout_btn {
    transform: scale(0.8, 0.8);
    margin: 0;
    display: none;
  }
}

</style>
