import type {Task} from "~/interfaces";
import {useOutOfCookie} from "~/composables/useOutOfCookie";
import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()
  const token = auth.token.value
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase
  const getTasksUrl = baseUrl + '/home/get/tasks'
  const stateHomeTasks = useState<Task[] | null>('homeTasks')
  if (!stateHomeTasks.value) {
    try {
      const res = await $fetch(getTasksUrl, {
        method: 'GET',
        headers:{
          Authorization: `Bearer ${token}`
        },
        key: 'getTasks',
      }) as any
      stateHomeTasks.value = res
    } catch (error) {
      useErrorEvent(error)
    }
  }
})
