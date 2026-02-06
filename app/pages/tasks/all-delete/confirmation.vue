<script setup lang="ts">
import {useCookie} from "#app";
import flatpickr from "vue-flatpickr-component";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Tasks | AllDelete"
})
const token = useCookie('__yarucoto')
const stateTasks = useState('allTasks')
const stateHomeTasks = useState('homeTasks')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const deleteAllTasksUrl = baseUrl + '/tasks/delete/all'
const deletePastTasksUrl = baseUrl + '/tasks/delete/past'
const deleteTasksDateBetweenUrl = baseUrl + '/tasks/delete/dateBetween'

const dateConfig = useFlatpickr().configRangeDate

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const date = reactive({
  start: '',
  end: ''
})
const dateOk = ref(false)

const dateReg = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
const alertDate = ref('')

const dateEvent = (e: Event) => {
  e.preventDefault()
  const t = e.target as HTMLInputElement
  const dateArr = t.value.split(' から ')
  if (dateArr.length === 2) {
    if (!dateReg.test(dateArr[0] as string) || !dateReg.test(dateArr[1] as string)) {
      date.start = ''
      date.end = ''
      dateOk.value = false
      alertDate.value = '日付は範囲選択してください'
      return
    }
    date.start = dateArr[0] as string
    date.end = dateArr[1] as string
    dateOk.value = true
    alertDate.value = ''
  } else if (dateArr.length === 1) {
    if (!dateReg.test(dateArr[0] as string)) {
      date.start = ''
      date.end = ''
      dateOk.value = false
      alertDate.value = '日付は範囲選択してください'
      return
    }
    date.start = dateArr[0] as string
    date.end = date.start
    dateOk.value = false
    alertDate.value = '日付は範囲選択してください'
  } else {
    date.start = ''
    date.end = ''
    dateOk.value = false
    alertDate.value = '日付は範囲選択してください'
  }
}

const allDeleteResult = ref('')
const allDeleteSubmit = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(deleteAllTasksUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      keys: deleteAllTasksUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    allDeleteResult.value = res
    if (allDeleteResult.value === 'success') {
      modalMessage.value = 'すべてのタスクを削除しました'
      stateTasks.value = null
      stateHomeTasks.value = null
      setTimeout(() => {
        navigateTo('/home')
      }, 2000)
    } else {
      modalMessage.value = '送信に失敗しました'
      stateTasks.value = null
      stateHomeTasks.value = null
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    stateTasks.value = null
    stateHomeTasks.value = null
    useErrorEvent(error)
  }
}
const pastDeleteResult = ref('')
const pastDeleteSubmit = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(deletePastTasksUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      keys: deletePastTasksUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    pastDeleteResult.value = res
    if (pastDeleteResult.value === 'success') {
      modalMessage.value = '過去のすべてのタスクを削除しました'
      stateTasks.value = null
      stateHomeTasks.value = null
      setTimeout(() => {
        navigateTo('/home')
      }, 2000)
    } else {
      modalMessage.value = '送信に失敗しました'
      stateTasks.value = null
      stateHomeTasks.value = null
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    stateTasks.value = null
    stateHomeTasks.value = null
    useErrorEvent(error)
  }
}
const dateBetweenDeleteResult = ref('')
const deleteDateBetweenSubmit = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const params: {
      startDate: string,
      endDate: string
    } = {
      startDate: date.start,
      endDate: date.end
    }
    const res = await $fetch(deleteTasksDateBetweenUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      keys: deleteTasksDateBetweenUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    dateBetweenDeleteResult.value = res
    if (dateBetweenDeleteResult.value === 'success') {
      modalMessage.value = '指定された日付のすべてのタスクを削除しました'
      stateTasks.value = null
      stateHomeTasks.value = null
      setTimeout(() => {
        navigateTo('/home')
      }, 2000)
    } else {
      modalMessage.value = '送信に失敗しました'
      stateTasks.value = null
      stateHomeTasks.value = null
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    stateTasks.value = null
    stateHomeTasks.value = null
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
    <Sidebar :path="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div v-show="afterLoad" id="main-child"
           class="d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>タスクの一括削除</h3>
        </div>
        <div class="my-3">
          <NuxtLink to="/tasks/all-delete/check-password" class="_normal_link my-3">戻る</NuxtLink>
        </div>
        <div id="content-alert" class="my-2 shadow">
          <h3 class="text-center">警告!</h3>
          <div class="my-3 text-center">削除後は復元はできませんがよろしいですか？</div>
        </div>
        <div class="_btn_box mt-4 mb-3 d-flex justify-content-center">
          <button @click="allDeleteSubmit" type="submit" class="btn btn-danger shadow-sm">
            すべて削除
          </button>
        </div>
        <div class="_btn_box mt-4 mb-3 d-flex justify-content-center">
          <button @click="pastDeleteSubmit" type="submit" class="btn btn-danger shadow-sm">
            過去のタスクをすべて削除
          </button>
        </div>
        <div class="_btn_box mt-4 mb-3 d-flex justify-content-center">
          <form @submit.prevent="deleteDateBetweenSubmit">
            <div>{{alertDate}}</div>
            <flatpickr @change="dateEvent" :config="dateConfig" type="date" name="date" class="_search_date form-control form-control-sm shadow-sm"></flatpickr>
            <button id="yearMonthBtn" type="submit" class="btn btn-danger shadow-sm mt-2" :class="{'_disabled': !dateOk}" :disabled="!dateOk">
              指定した範囲のタスクを削除
            </button>
          </form>
        </div>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}

#content-alert {
  width: 500px;
  padding: 20px;
  border: var(--thick-border);
  border-radius: 10px;
  border-color: var(--bs-red);
  background-color: var(--alert-bg-color);
}

button {
  min-width: 200px;
}
@media(max-width: 576px) {
  #content-alert {
    width: calc(100% - 20px);
    margin-left: 10px;
    margin-right: 10px;
  }
  ._btn_box {
    width: 100%;
    padding: 0 10px;
  }
  form, button {
    width: 100%;
  }
}
</style>
