import type {Tag} from "~/interfaces";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const path = to.path
  const tagId = path.split('/')[3]
  const stateTags = useState<Tag[] | null>('tags')
  const tag = computed(() => stateTags?.value?.filter(t => t.id === Number(tagId))[0] ?? undefined)
  if (!tag.value) return navigateTo('/not-allowed')
})
