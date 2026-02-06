<script setup lang="ts">

const user = useState<any | null>('auth-user', () => null)
const username = computed(() => user.value?.username)
const role = computed(() => user.value?.role)

</script>

<template>
  <div class="d-flex align-items-center justify-content-center">
    <div class="w-50 d-flex justify-content-between">
      <div>ユーザー名：<span class="fw-bold">{{username}}</span></div>
      <div>ロール：<span class="fw-bold">{{role}}</span></div>
    </div>

  </div>

</template>

<style scoped>

</style>
