<script setup lang="ts">
import type {Goal} from "~/interfaces";
import {useMakeStrFromTimestamp} from "~/composables/useMakeStrFromTimestamp";

definePageMeta({
  middleware: ["auth", "auth-trial"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Goals | Edit"
})
const token = useCookie('__yarucoto')
const stateGoalTitle = useState<string | null>('goalTitle')
const stateGoalDescription = useState<string | null>('goalDescription')

const route = useRoute()
const path = route.path
const yearMonth = useRoute().params.yearMonth as string
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getEditGoalUrl = baseUrl + '/goals/get/edit/' + yearMonth
const putGoalUrl = baseUrl + '/goals/put/update'

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const isThisYearMonth = ref(false)

const title = ref('')
const description = ref('')
const year = ref<number>()
const month = ref<number>()

const submitDisabled = ref(true)

const titleOk = ref(false)
const alertTitle = ref('')

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const textTitle = ref('')
const textDescription = ref('')

const thisGoal = ref<Goal>()

const createdAt = computed(() => useMakeStrFromTimestamp(thisGoal.value?.createdAt ?? '0000-00-00 00:00:00.000000'))
const updatedAt = computed(() => useMakeStrFromTimestamp(thisGoal.value?.updatedAt ?? '0000-00-00 00:00:00.000000'))

const getEditGoal = async () => {
  try {
    const res = await $fetch(getEditGoalUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      key: getEditGoalUrl
    }) as any
    if (res === 'illegal') navigateTo('not-allowed')
    thisGoal.value = res
    title.value = thisGoal.value?.title ?? ''
    description.value = thisGoal.value?.description ?? ''
    year.value = yearMonth ? Number(yearMonth.split('-')[0]) : 0
    month.value = yearMonth ? Number(yearMonth.split('-')[1]) : 0
    if (title.value.length > 0) {
      titleOk.value = true;
      valForm()
    }
    if (year.value === currentYear && month.value === currentMonth) {
      isThisYearMonth.value = true
    }
  } catch (error) {
    useErrorEvent(error)
  }
}

const submitResult = ref('')
const onSubmit = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const params : {
      title: string,
      description: string,
      year: number,
      month: number
    } = {
      title: title.value,
      description: description.value,
      year: year.value ? year.value : 0,
      month: month.value ? month.value : 0
    }
    const res = await $fetch(putGoalUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: putGoalUrl + '/' + params.year + '/' + params.month
    }) as any
    if (res === 'illegal') navigateTo('not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = '目標を編集しました'
      if (isThisYearMonth.value) {
        stateGoalTitle.value = title.value
        stateGoalDescription.value = description.value
      }
      setTimeout(() => {
        modalShow.value = false
        navigateTo('/goals/list')
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}
const valForm = () => {
  submitDisabled.value = !(titleOk.value)
}

const titleEvent = () => {
  if (title.value.length <= 0) {
    titleOk.value = false
    alertTitle.value = 'タイトルを入力してください'
  } else if (title.value.length > 16) {
    titleOk.value = false
    alertTitle.value = 'タイトルは16文字までです'
  } else {
    titleOk.value = true;
    alertTitle.value = "";
  }
  valForm()
}

const afterLoad = ref(false)
onMounted(async () => {
  await getEditGoal()
  textTitle.value = thisGoal.value?.title ?? ''
  textDescription.value = thisGoal.value?.description ?? ''
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>{{year}}年{{month}}月の目標の設定</h3>
        </div>
        <div id="return-goals-parent" class="my-3">
          <NuxtLink to="/goals/list" class="_normal_link">一覧へ</NuxtLink>
        </div>
        <div class="_created_updated">
          <div class="_created">
            <div>投稿日：</div>
            <div>{{createdAt}}</div>
          </div>
          <div class="_updated">
            <div>更新日：</div>
            <div>{{updatedAt}}</div>
          </div>
        </div>
        <form @submit.prevent="onSubmit" id="form" class="my-4">
          <div class="form-group mt-3">
            <label for="title" class="form-label">タイトル：</label>
            <input @input="titleEvent" v-model="title" id="title" type="text" name="title" class="form-control shadow-sm" placeholder="16文字まで">
            <div id="alert-title" class="_alert">{{alertTitle}}</div>
          </div>
          <div class="form-group mt-3">
            <label for="text" class="form-label">詳細：</label>
            <textarea v-model="description" name="description" id="description" class="form-control shadow-sm" placeholder="文字数制限なし"></textarea>
          </div>
          <div class="d-flex justify-content-center mt-4">
            <button id="submitBtn" class="btn _btn_goals shadow-sm" :class="{'_disabled' : submitDisabled}" :disabled="submitDisabled">更新</button>
          </div>
        </form>
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

#return-goals-parent {
  width: 100%;
  display: flex;
  justify-content: center;
}
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 .25rem rgba(180, 60, 210, .25)!important;
}
#description {
  height: 300px;
}
</style>
