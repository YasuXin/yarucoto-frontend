<script setup lang="ts">
import type {RecurringTask, Task, Tag} from "~/interfaces";

definePageMeta({
  middleware: ["auth", "routine-edit"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Routines | Edit"
})

const token = useCookie('__yarucoto')

const stateTags = useState<Tag[] | null>('tags')
const stateTasks = useState<Task[] | null>('allTasks')
const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')
const homeTasks = useState<Task[] | null>('homeTasks')

const route = useRoute()
const path = route.path
const taskId = useRoute().params.id
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const putUpdateRecurringTaskUrl = baseUrl + '/recurringTasks/put/update'

const task = computed(() => stateRecurringTasks?.value?.filter(r => r.id === Number(taskId))[0] ?? undefined)

const tags = computed(() => stateTags?.value ?? [])

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const resetState = () => {
  stateRecurringTasks.value = null
  stateTasks.value = null
  homeTasks.value = null
}

const submitResult = ref('')
const onSubmit = async (params: {
  id: number,
  title: string,
  tagId1: number,
  tagId2: number,
  tagId3: number,
  dueStartTime: string | undefined,
  dueEndTime: string | undefined,
  description: string,
  isSunday: boolean,
  isMonday: boolean,
  isTuesday: boolean,
  isWednesday: boolean,
  isThursday: boolean,
  isFriday: boolean,
  isSaturday: boolean,
}) => {
  modalMessage.value = '送信中...'
  modalShow.value = true
  try {
    const res = await $fetch(putUpdateRecurringTaskUrl, {
      method: 'PUT',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: putUpdateRecurringTaskUrl + '/' + params.id
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
  } catch (error) {
    resetState()
    useErrorEvent(error)
  }
  if (submitResult.value === 'success') {
    modalMessage.value = 'ルーティーンを編集しました'
    resetState()
    setTimeout(() => {
      modalShow.value = false
      navigateTo('/routines/list')
    }, 1000)

  } else {
    modalMessage.value = '送信に失敗しました'
    resetState()
    setTimeout(() => {
      modalShow.value = false
      window.location.reload()
    }, 1000)
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
          <h3>ルーティーンの編集</h3>
        </div>
        <div id="return-tasks-parent" class="my-3">
          <NuxtLink to="/routines/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <RoutinesEditForm @submit="onSubmit" :tagsList="tags" :task="task"></RoutinesEditForm>
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
