<script setup lang="ts">
const toInquiry = (e: Event) => {
  e.preventDefault()
  const auth = useAuth()
  if (auth?.isLoggedIn.value && auth.user.value && auth?.user?.value.role !== 'ROLE_ADMIN') {
    navigateTo('/inquiry/form')
  } else if (auth?.isLoggedIn.value && auth.user.value && auth?.user?.value.role === 'ROLE_ADMIN') {
    navigateTo('/admin/inquiry/form')
  } else {
    navigateTo('/inquiry/guest/form')
  }
}
</script>

<template>
  <footer id="footer" class="shadow">
    <div class="_footer_child d-flex justify-content-center align-items-center w-100">
      <div>
        <a @click="toInquiry" class="_footer_link">お問い合わせ</a>
      </div>
    </div>

  </footer>
</template>

<style scoped>
#footer {
  width: 100%;
  height: 300px;
  background-color: var(--footer-bg-color);
}
._footer_child {
  height: 150px;
}
._footer_link {
  color: var(--footer-font-color);
}
._footer_link:hover {
  color: var(--font-gray);
  cursor: pointer;
}
@media (max-width: 1280px) {
  #footer {
    height: 100px;
  }
  ._footer_child {
    height: 100%;
  }
}
</style>
