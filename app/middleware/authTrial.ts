import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
    無料会員用のミドルウェア
    トライアル期間のみ許可する
   */
  const auth = useAuth()
  // 無料会員でトライアル期間が終了しているなら/subscription/register/registerにリダイレクト
  if (auth.user.value && auth.user.value.role === 'ROLE_FREE_MEMBER' && !auth.user.value.trial) {
    return navigateTo('/subscription/register/register')
  }
})
