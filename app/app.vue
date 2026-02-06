<script setup lang="ts">

</script>

<template>
  <ClientOnly>
    <NuxtLayout v-cloak>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>

</template>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
