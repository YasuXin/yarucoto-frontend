import type {RecurringTask} from "~/interfaces";

export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
    管理者用のミドルウェア
   */
  const auth = useAuth()
  // 未ログインなら /login にリダイレクト
  if (!auth.isLoggedIn.value) return navigateTo('/login')
  if (auth.user.value?.role !== 'ROLE_ADMIN') return navigateTo('/not-allowed')

  if (to.path === '/admin/admin-user/edit/form' && from.path !== '/admin/admin-user/edit/check-password') {
    return navigateTo('/admin/admin-user/edit/check-password')
  }
  if (to.path === '/admin/admin-user/change-password/form' && from.path !== '/admin/admin-user/change-password/check-password') {
    return navigateTo('/admin/admin-user/change-password/check-password')
  }
})
