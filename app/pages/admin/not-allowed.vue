<script setup lang="ts">
definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | NotAllowed"
})

</script>

<template>
  <div id="main-child" class="_main_child_fadein d-flex flex-column justify-content-center align-items-center my-5">
    <h3>許可されていないページにアクセスしました</h3>
    <NuxtLink to="/admin/home" class="_normal_link my-3">ホームへ</NuxtLink>
  </div>
</template>

<style scoped>

</style>
