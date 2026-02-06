<script setup lang="ts">

</script>

<template>
  <div id="header-logo">
    <NuxtLink to="/" id="logo-text" class="navbar-brand">
      <div class="d-flex align-items-center">
        Yarucoto
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
#header-logo {
  width: 160px;
  height: 50px;
  margin-left: 48px;
}
.navbar-brand {
  display: flex;
  align-items: center;
  color: rgb(70, 70, 70);
  margin: 0;
  font-size: 0.9rem;
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
  }
  #header-logo {
    width: 100px;
  }
  #logo-text {
    font-size: 2rem !important;
  }
  @media (max-height: 700px) {
    #header-logo {
      height: 40px;
    }
  }
}
</style>
