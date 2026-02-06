<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | NotAllowed"
})
const path = ref('')
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :path="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child"
           class="_main_child_fadein d-flex flex-column justify-content-center align-items-center my-5">
        <h3>許可されていないページにアクセスしました</h3>
        <NuxtLink to="/home" class="_normal_link my-3">ホームへ</NuxtLink>
      </div>
    </main>
  </div>
</template>

<style scoped>
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
</style>
