<script setup lang="ts">
import type {Tag, Task} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Tasks | Edit"
})

const token = useCookie('__yarucoto')
const stateTasks = useState<Task[] | null>('allTasks')
const homeTasks = useState<Task[] | null>('homeTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path
const taskId = useRoute().params.id
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getTaskUrl = baseUrl + '/tasks/get/edit/' + taskId
const putUpdateTaskUrl = baseUrl + '/tasks/put/update'

const task = ref<Task>()
const tags = computed(() => stateTags.value ?? [])

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const resetHomeTasks = (dateStr: string) => {
  const now = new Date()
  if (dateStr === useMakeDateStrFromDate(now) ||
      dateStr === useMakeDateStrFromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)) ||
      dateStr === useMakeDateStrFromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))) {
    homeTasks.value = null
  }
}

const getTask = async () => {
  try {
    const res = await $fetch(getTaskUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      key: getTaskUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    task.value = res
  } catch (error) {
    useErrorEvent(error)
  }
}

const submitResult = ref('')
const onSubmit = async (params: {
  title: string,
  dueDate: string,
  tag1: number,
  tag2: number,
  tag3: number,
  dueStartTime: string | undefined,
  dueEndTime: string | undefined,
  description: string
}) => {
  modalMessage.value = '送信中...'
  modalShow.value = true
  const taskParams: {
    id: number,
    title: string,
    description: string,
    dueDate: string,
    dueStartTime: string | undefined,
    dueEndTime: string | undefined,
    tagId1: number,
    tagId2: number,
    tagId3: number,
  } = {
    id: task.value?.id ?? 0,
    title: params.title,
    description: params.description,
    dueDate: params.dueDate,
    dueStartTime: params.dueStartTime,
    dueEndTime: params.dueEndTime,
    tagId1: params.tag1 > 0 ? params.tag1 : 0,
    tagId2: params.tag2 > 0 ? params.tag2 : 0,
    tagId3: params.tag3 > 0 ? params.tag3 : 0,
  }
  try {
    const res = await $fetch(putUpdateTaskUrl, {
      method: 'PUT',
      body: taskParams,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: putUpdateTaskUrl + '/' + taskParams.id
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = 'タスクを編集しました'
      stateTasks.value = null
      resetHomeTasks(params.dueDate)
      setTimeout(() => {
        modalShow.value = false
        navigateTo('/tasks/list?date=' + params.dueDate)
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
      stateTasks.value = null
      resetHomeTasks(params.dueDate)
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    stateTasks.value = null
    resetHomeTasks(params.dueDate)
    useErrorEvent(error)
  }
}
const afterLoad = ref(false)
onMounted(async () => {
  await getTask()
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title">
          <h3>タスクの編集</h3>
        </div>
        <div id="return-tasks-parent" class="my-3">
          <NuxtLink to="/tasks/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <TasksEditForm @submit="onSubmit" :tagsList="tags" :task="task"></TasksEditForm>
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
#return-tasks-parent {
  width: 80%;
  display: flex;
  justify-content: center;
}
</style>
