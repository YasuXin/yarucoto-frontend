import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
    匿名のミドルウェア
   */
  const auth = useAuth()

  if (auth.token.value) {
    auth.isAuthenticated.value = true
    await auth.fetchUser()
  }
  // 認証チェック中（fetchUser が未実行）なら await する
  if (!auth.token.value) {
    await auth.fetchUser()
  }

  // Cookieがある場合は / に遷移
  if (auth.isAuthenticated.value) {
    return navigateTo('/home')
  }

  if (to.path === '/signup/verify' && from.path !== '/signup/form') {
    navigateTo('/signup/form')
  }

  if (to.path === '/reset-password/verify' && from.path !== '/reset-password/recreate') {
    navigateTo('/reset-password/recreate')
  }
})
