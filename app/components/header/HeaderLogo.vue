<script setup lang="ts">

</script>

<template>
  <div id="header-logo">
    <NuxtLink to="/home" id="logo-text" class="navbar-brand">
      <div class="d-flex align-items-center">
        Yarucoto
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
#header-logo {
  width: 160px;
  margin-left: 48px;
}

#logo-text {
  font-size: 2.5rem !important;
  padding: 0;
  font-family: "Fjalla One", sans-serif;
  font-weight: 400;
  font-style: normal;
}
@media (max-width: 576px) {
  #header-logo {
    margin-left: 10px;
    width: 100px;
  }
  #logo-text {
    font-size: 2rem !important;
  }
}
</style>
