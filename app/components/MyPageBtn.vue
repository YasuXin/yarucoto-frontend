<script setup lang="ts">
const toHomeEvent = () => {
  const user = useState<any | null>('auth-user', () => null)
  if (user?.value?.role === 'ROLE_ADMIN') {
    navigateTo('/admin/home')
  }
  else {
    navigateTo('/home')
  }
}
</script>

<template>
  <div id="my-page" class="nav-item">
    <button @click="toHomeEvent" class="btn _btn_past_completed_rate _header_btn_anonymous shadow-sm">マイページ</button>
  </div>
</template>

<style scoped>
#my-page button {
  font-size: 0.8rem
}
@media (max-width: 1400px) {
  font-size: 0.9rem
}
@media (max-width: 576px) {
  #my-page button {
    transform: scale(0.9, 0.9);
  }
}
</style>
