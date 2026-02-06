import { useCookie } from '#app'
import type {User} from "~/interfaces";
import {useUserSession} from "~/composables/useUserSession";

export const useAuth = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  const loginUrl = baseUrl + '/auth/login'

  // ---------------------------------------
  // 状態：トークン & ユーザー情報
  // ---------------------------------------
  const token = useCookie<string | null>('__yarucoto', {
    maxAge: 60 * 60 // 1時間
  })
  const user = useState<User | null>('auth-user', () => null)
  const isAuthenticated = useState('auth-isAuthenticated', () => false)
  const isInitialized = useState('auth-initialized', () => false)

  // ---------------------------------------
  // ログイン処理（/api/auth/login）
  // ---------------------------------------
  const login = async (username: string, password: string) => {
    const params: {
      username: string,
      password: string
    } = {
      username: username,
      password: password
    }
    try {
      const res = await $fetch(loginUrl, {
          method: 'POST',
          body: params,
          key: 'login'
      }) as any
      token.value = res.token
      await fetchUser() // ←ログイン後にユーザー情報も取得
      isAuthenticated.value = true
      return true
    } catch (error) {
      return false
    }
  }

  // ---------------------------------------
  // JWT からログイン中ユーザー情報を取得
  // ---------------------------------------
  const fetchUser = async () => {
    const userSession = useUserSession(token.value)
    await userSession.initialize()
  }

  // ---------------------------------------
  // ログアウト
  // ---------------------------------------
  // ----------------------------------------
  //  ログアウト関数
  // ----------------------------------------
  const logout = () => {
    // Cookie の JWT を削除
    token.value = null
    // 状態を全て初期化
    isAuthenticated.value = false
    isInitialized.value = false
    useRemoveSession()
    navigateTo('/login')
  }

  // ---------------------------------------
  // ログイン済みか？
  // ---------------------------------------
  const isLoggedIn = computed(() => !!token.value)

  return {
    user,
    token,
    isLoggedIn,
    isAuthenticated,
    isInitialized,
    login,
    logout,
    fetchUser,
  }
}
