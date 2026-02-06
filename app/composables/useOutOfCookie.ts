export const useOutOfCookie = (error: any) => {
  const auth = useAuth()
  if (error.response && error.response.status === 401) {
    // 401エラー（セッション切れ）の場合の処理
    console.error('セッションが切れました。ログイン画面へ移動します。');
    auth.logout()
  }
}
