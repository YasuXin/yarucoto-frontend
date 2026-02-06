<script setup lang="ts">
import {useOutOfCookie} from "~/composables/useOutOfCookie";
import type {Tag, Task, User, RecurringTask} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Tasgs | Register"
})

const token = useCookie('__yarucoto')
const user = useState<User | null>('auth-user')
const stateTasks = useState<Task[] | null>('allTasks')
const homeTasks = useState<Task[] | null>('homeTasks')
const stateRecurringTasks = useState<RecurringTask[] | null>('recurringTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getTagsAndRecurringTasksUrl = baseUrl + '/tags/get/tagsAndRecurringTasks'
const postTagUrl = baseUrl + '/tags/post/create'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const tags = computed(() => stateTags?.value ?? [])

const resetState = () => {
  stateTasks.value = null
  stateRecurringTasks.value = null
  homeTasks.value = null
}

const getTagsAndRecurringTasks = async () => {
  try {
    const res = await $fetch(getTagsAndRecurringTasksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      keys: 'getTagsAndTasks'
    }) as any
    stateTags.value = res.tags
    stateRecurringTasks.value = res.recurringTasks
  } catch (error) {
    useErrorEvent(error)
  }
}

const submitResult = ref('')
const onSubmit = async (params: {name: string, color: number, description: string}) => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  if (user.value &&
      user.value.role === 'ROLE_FREE_MEMBER' &&
      !user.value.trial &&
      tags.value &&
      tags.value.length >= 3
  ) {
    modalMessage.value = '無料会員のタグ設定数の上限に達しています'
    setTimeout(() => {
      navigateTo('/subscription/register/register')
    }, 1000)
  } else {
    try {
      const res = await $fetch(postTagUrl, {
        method: 'POST',
        headers:{
          Authorization: `Bearer ${token.value}`
        },
        body: params,
        key: postTagUrl
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      submitResult.value = res
      if (submitResult.value === 'success') {
        modalMessage.value = 'タグを追加しました'
        homeTasks.value = null
        stateTasks.value = null
        await getTagsAndRecurringTasks()
        setTimeout(() => {
          modalShow.value = false
        }, 1000)
      } else if (submitResult.value === 'out-of-trial') {
        modalMessage.value = '無料会員のタグ設定数の上限に達しています'
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
          <h3>新規タグの追加</h3>
        </div>
        <div id="return-tags-parent" class="my-3">
          <NuxtLink to="/tags/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <TagsRegisterForm @submit="onSubmit"></TagsRegisterForm>
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
