import type {User, Tag, RecurringTask, Information, Task} from "~/interfaces";

export const useUserSession = (token: string | null = null) => {
  if (!token) return { initialize: () => {} }

  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase

  const getInitializeUrl = baseUrl + '/initialize'

  const user = useState<User | null>('auth-user', () => null)
  const homeTasks = useState<Task[] | null>('homeTasks', () => null)
  const tags = useState<Tag[] | null>('tags', () => null)
  const recurringTasks = useState<RecurringTask[] | null>('recurringTasks', () => null)
  const informationArr = useState<Information[] | null>('informationArr', () => null)
  const goalTitle = useState<string | null>('goalTitle', () => null)
  const goalDescription = useState<string | null>('goalDescription', () => null)

  const initialize = async () => {
    try {
      const res = await $fetch(getInitializeUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        keys: 'initialize'
      }) as any
      user.value = res.user
      homeTasks.value = res.tasks
      tags.value = res.tags
      recurringTasks.value = res.recurringTasks
      informationArr.value = res.informationList
      goalTitle.value = res.goalTitle
      goalDescription.value = res.goalDescription
    } catch (error) {
      console.error(error)
    }
  }
  return { initialize }
}
