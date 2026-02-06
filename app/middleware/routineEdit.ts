import type {RecurringTask} from "~/interfaces";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const path = to.path
  const taskId = path.split('/')[3]
  const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')
  const task = computed(() => stateRecurringTasks?.value?.filter(r => r.id === Number(taskId))[0] ?? undefined)
  if (!task.value) return navigateTo('/not-allowed')
})
