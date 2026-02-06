<script setup lang="ts">
import type {Task, Tag} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Tasks | Register"
})

const token = useCookie('__yarucoto')
const stateTasks = useState<Task[] | null>('allTasks')
const homeTasks = useState<Task[] | null>('homeTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const postCreateTaskUrl = baseUrl + '/tasks/post/create'

const tags = computed(() => stateTags.value ?? [])
const dateForm = ref('0000-00-00')

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
  try {
    const res = await $fetch(postCreateTaskUrl, {
      method: 'POST',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: postCreateTaskUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if(submitResult.value === 'success') {
      modalMessage.value = 'タスクを追加しました'
      stateTasks.value = null
      resetHomeTasks(params.dueDate)
      setTimeout(() => {
        modalShow.value = false
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
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title">
          <h3>新規タスクの追加</h3>
        </div>
        <div id="return-tasks-parent" class="my-3">
          <NuxtLink to="/tasks/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <TasksRegisterForm @submit="onSubmit" :tagsList="tags" :date="dateForm"></TasksRegisterForm>
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
