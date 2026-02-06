import type {RecurringTask} from "~/interfaces";

export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
    会員用のミドルウェア
   */
  const auth = useAuth()
  // 未ログインなら /login にリダイレクト
  if (!auth.isLoggedIn.value) return navigateTo('/login')
  if (auth.user.value?.role === 'ROLE_ADMIN') return navigateTo('/admin/home')

  const token = auth.token.value
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  const getTagsAndRecurringTasksUrl = baseUrl + '/tags/get/tagsAndRecurringTasks'
  const getTagsAndRecurringTasks = async () => {
    try {
      const res = await $fetch(getTagsAndRecurringTasksUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        keys: 'getTagsAndTasks'
      }) as any
      stateTags.value = res.tags
      stateRecurringTasks.value = res.recurringTasks
    } catch (error) {
      useErrorEvent(error)
    }
  }
  const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')
  const stateTags = useState<string[] | null>('tags')

  if (stateRecurringTasks.value === null || stateTags.value === null) {
    await getTagsAndRecurringTasks()
  }

  if (to.path === '/user/edit/profile' && from.path !== '/user/edit/check-password') {
    return navigateTo('/user/edit/check-password')
  }
  if (to.path === '/user/password/edit' && from.path !== '/user/password/check-password') {
    return navigateTo('/user/password/check-password')
  }
  if (to.path === '/tasks/all-delete/confirmation' && from.path !== '/tasks/all-delete/check-password') {
    return navigateTo('/tasks/all-delete/check-password')
  }
  if (to.path === '/user/all-data/delete/confirmation' && from.path !== '/user/all-data/delete/check-password') {
    return navigateTo('/user/all-data/delete/check-password')
  }
  if (to.path === '/user/delete/confirmation' && from.path !== '/user/delete/check-password') {
    return navigateTo('/user/delete/check-password')
  }
})
