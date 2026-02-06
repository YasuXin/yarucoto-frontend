<script setup lang="ts">

</script>

<template>
  <div class="_anonymous_register_parent nav-item d-flex justify-content-center align-items-center">
    <NuxtLink class="_anonymous_register_link _normal_link" to="/signup/form">会員登録</NuxtLink>
  </div>
</template>

<style scoped>
._anonymous_register_link {
  display: inline-block;
  width: 90px;
  margin: 0 !important;
}
._normal_link:any-link {
  color: rgb(70, 70, 70) !important;
}
._normal_link:hover {
  color: rgb(30, 30, 30) !important;
}
@media (max-width: 576px) {
  ._anonymous_register_parent {
    width: 70px;
  }
}
</style>
