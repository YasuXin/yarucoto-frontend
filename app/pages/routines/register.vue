<script setup lang="ts">
import type {Task, Tag, RecurringTask, User} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Routines | Register"
})

const token = useCookie('__yarucoto')
const user = useState<User | null>('auth-user')
const stateTasks = useState<Task[] | null>('allTasks')
const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')
const homeTasks = useState<Task[] | null>('homeTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getRecurringTasksUrl = baseUrl + '/recurringTasks/get'
const postCreateRecurringTaskUrl = baseUrl + '/recurringTasks/post/create'

const tasks = computed(() => stateRecurringTasks?.value ?? [])
const tags = computed(() => stateTags?.value ?? [])

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const resetState = () => {
  stateRecurringTasks.value = null
  stateTasks.value = null
  homeTasks.value = null
}
const getRecurringTasks = async () => {
  try {
    const res = await $fetch(getRecurringTasksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      key: getRecurringTasksUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    stateRecurringTasks.value = res
  } catch (error) {
    useErrorEvent(error)
  }
}

const submitResult = ref('')
const onSubmit = async (params: {
  title: string,
  tag1: number,
  tag2: number,
  tag3: number,
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
  if (user.value &&
      user.value.role === 'ROLE_FREE_MEMBER' &&
      !user.value.trial &&
      tasks.value &&
      tasks.value.length >= 5
  ) {
    modalShow.value = true
    modalMessage.value = '無料会員のルーティーン設定数の上限に達しています'
    setTimeout(() => {
      navigateTo('/subscription/register/register')
    }, 1000)
  } else {
    try {
      const res = await $fetch(postCreateRecurringTaskUrl, {
        method: 'POST',
        body: params,
        headers:{
          Authorization: `Bearer ${token.value}`
        },
        key: postCreateRecurringTaskUrl
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      submitResult.value = res
      if (submitResult.value === 'success') {
        modalMessage.value = 'ルーティーンを追加しました'
        await getRecurringTasks()
        homeTasks.value = null
        stateTasks.value = null
        setTimeout(() => {
          modalShow.value = false
        }, 1000)
      } else if (submitResult.value === 'out-of-trial') {
        modalShow.value = true
        modalMessage.value = '無料会員のルーティーン設定数の上限に達しています'
        setTimeout(() => {
          navigateTo('/subscription/register/register')
        }, 1000)
      } else {
        modalMessage.value = '送信に失敗しました'
        resetState()
        setTimeout(() => {
          modalShow.value = false
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      resetState()
      useErrorEvent(error)
    }
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
          <h3>新規ルーティーンの追加</h3>
        </div>
        <div id="return-tasks-parent" class="my-3">
          <NuxtLink to="/routines/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <RoutinesRegisterForm @submit="onSubmit" :tagsList="tags"></RoutinesRegisterForm>
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
