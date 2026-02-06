<script setup lang="ts">

</script>

<template>
  <div class="nav-item">
    <NuxtLink class="btn _btn_primary _header_btn_anonymous shadow-sm" to="/login">ログイン</NuxtLink>
  </div>
</template>

<style scoped>
@media (max-width: 1400px) {
  ._header_btn_anonymous  {
    font-size: 1.1rem;
  }
}
@media (max-width: 576px) {
  ._header_btn_anonymous  {
    transform: scale(0.9, 0.9);
  }
}
</style>
