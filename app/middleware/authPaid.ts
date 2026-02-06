import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
    有料会員用のミドルウェア
   */
  const auth = useAuth()
  // 無料ユーザー以外なら/not-allowedにリダイレクト
  if (auth.user.value && auth.user.value.role === 'ROLE_FREE_MEMBER') {
    return navigateTo('/not-allowed')
  }
  // クレジット情報編集は手順通りに進めないといけないようにする
  if (to.path === '/form/edit/checkout' && from.path !== '/form/edit/check-password') {
    return navigateTo('/form/edit/check-password')
  }
})
