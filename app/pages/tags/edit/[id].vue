<script setup lang="ts">
import type {Tag, Task, RecurringTask} from "~/interfaces";

definePageMeta({
  middleware: ["auth", "tag-edit"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Tasgs | Edit"
})

const token = useCookie('__yarucoto')
const stateTasks = useState<Task[] | null>('allTasks')
const homeTasks = useState<Task[] | null>('homeTasks')
const stateTags = useState<Tag[] | null>('tags')
const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')

const route = useRoute()
const path = route.path
const tagId = useRoute().params.id
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getTagsAndRecurringTasksUrl = baseUrl + '/tags/get/tagsAndRecurringTasks'
const putTagUrl = baseUrl + '/tags/put/update'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const tag = computed(() => stateTags?.value?.filter(t => t.id === Number(tagId))[0] as Tag ?? undefined)

const getTagsAndRecurringTasks = async () => {
  try {
    const res = await $fetch(getTagsAndRecurringTasksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      keys: getTagsAndRecurringTasksUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    stateTags.value = res.tags
    stateRecurringTasks.value = res.recurringTasks
  } catch (error) {
    useErrorEvent(error)
  }
}

const submitResult = ref('')
const onSubmit = async (params: {id: number, name: string, color: number, description: string}) => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(putTagUrl, {
      method: 'PUT',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: putTagUrl + '/' + params.id
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = 'タグを編集しました'
      await getTagsAndRecurringTasks()
      homeTasks.value = null
      stateTasks.value = null
      setTimeout(() => {
        modalShow.value = false
        navigateTo('/tags/list')
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
      homeTasks.value = null
      stateTasks.value = null
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    homeTasks.value = null
    stateTasks.value = null
    useErrorEvent(error)
  }
}

const afterLoad = ref(false)
onMounted(async () => {
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title">
          <h3>タグの編集</h3>
        </div>
        <div id="return-tags-parent" class="my-3">
          <NuxtLink to="/tags/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <TagsEditForm @submit="onSubmit" :tag="tag"></TagsEditForm>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
@import "~/assets/css/form.css";
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#return-tags-parent {
  width: 80%;
  display: flex;
  justify-content: center;
}
</style>
