import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
    無料会員用のミドルウェア
   */
  const auth = useAuth()
  // 無料ユーザー以外なら/not-allowedにリダイレクト
  if (auth.user.value && auth.user.value.role === 'ROLE_PAID_MEMBER') {
    return navigateTo('/not-allowed')
  }
  // 有料会員登録は手順通りに進めないといけないようにする
  if ((to.path === '/form/register/user-information' &&
      (from.path !== '/form/register/check-password' && from.path !== '/form/register/checkout')) ||
    (to.path === '/form/register/checkout' && from.path !== '/form/register/user-information')
  ) {
    return navigateTo('/form/register/register')
  }
})
