export const useErrorEvent = (error: any) => {
  if (error.response && error.response.status === 400) {
    showError({statusCode: 400})
  } else if (error.response && error.response.status === 401) {
    const auth = useAuth()
    console.error('セッションが切れました。ログイン画面へ移動します。');
    auth.logout()
  } else if (error.response && error.response.status === 403) {
    showError({statusCode: 403})
  } else if (error.response && error.response.status === 404) {
    showError({statusCode: 404})
  } else if (error.response && error.response.status === 408) {
    showError({statusCode: 408})
  } else if (error.response && error.response.status === 500) {
    showError({statusCode: 500})
  } else if (error.response && error.response.status === 503) {
    showError({statusCode: 503})
  } else if (error.response && error.toString().substring(error.toString().length - 15, error.toString().length) === 'Failed to fetch') {
    showError({statusCode: 408})
  }
}
