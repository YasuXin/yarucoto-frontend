<script setup lang="ts">

</script>

<template>
  <div id="yarucoto-wrapper">
    <Header></Header>
    <div id="content" class="d-flex">
      <main class="py-3 px-0 shadow">
        <slot></slot>
      </main>
    </div>
    <Footer></Footer>
  </div>
</template>

<style scoped>
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
  width: 100% !important;
}
</style>
