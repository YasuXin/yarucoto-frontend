<script setup lang="ts">
import type {Evaluation, Goal} from "~/interfaces";
import DeleteModal from "~/components/DeleteModal.vue";

definePageMeta({
  middleware: ["auth", "auth-trial"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Goals"
})
const token = useCookie('__yarucoto')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getGoalsUrl = baseUrl + '/goals/get'
const deleteGoalUrl = baseUrl + '/goals/delete'

const thisMonthPath = new Date().getFullYear() + '-' + (new Date().getMonth() + 1)

const allGoals = ref<Goal[]>([])
const goals = ref<Goal[]>([])

const currentYear = ref(new Date().getFullYear())

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const deleteId = ref(0)
const deleteModalShow = ref(false)
const showDeleteModalEvent = (id: number) => {
  deleteModalShow.value = true
  deleteId.value = id
}
const deleteResult = ref('')
const deleteEvent = async () => {
  deleteModalShow.value = false
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const params : {id :number} = {id: deleteId.value}
    const res = await $fetch(deleteGoalUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteGoalUrl + '/' + params.id
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    deleteResult.value = res
    modalMessage.value = '削除しました'
    await getGoals()
    setGoals()
    setTimeout(() => {
      modalShow.value = false
    }, 1000)
  } catch (error) {
    useErrorEvent(error)
  }
}
const returnEvent = () => {
  deleteModalShow.value = false
  deleteId.value = 0
}

const getGoals = async () => {
  try {
    const res = await $fetch(getGoalsUrl + '/' + currentYear.value, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      key: getGoalsUrl + '/' + currentYear.value
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    allGoals.value = res
  } catch (error: any) {
    useErrorEvent(error)
  }
}

const selectedYear = ref<string>('0')
const isSearching = ref<boolean>(false)
const searchValue = ref<string>('')
const searchArr = ref<string[]>([])
const searchGoals = (e: Event) => {
  const t = e.target as HTMLInputElement
  searchValue.value = t.value
  if (t.value.length > 0) {
    isSearching.value = true
    const arr1 = searchValue.value.split(' ')
    let arr2 = []
    for (const a of arr1) {
      const arr3 = a.split('\u3000')
      let arr4 = []
      for (const b of arr3) {
        arr4.push(b)
      }
      arr2.push(...arr4)
    }
    searchArr.value.length = 0
    searchArr.value.push(...arr2)
  } else {
    isSearching.value = false
  }
  setGoals()
}

const setGoals = () => {
  goals.value = []
  setTimeout(() => {
    if (!isSearching.value) {
      for (let i = 0; i < 12; i++) {
        let flag = false
        for (const goal of allGoals.value) {
          if (goal.month === i + 1) {
            goals.value.push(goal)
            flag = true
          }
        }
        if (!flag) {
          goals.value.push(
              {
                id: 0,
                title: '',
                description: '',
                month: i + 1,
                year: currentYear.value
              } as Goal
          )
        }
      }
    } else {
      if (allGoals.value === undefined) return
      for (const goal of allGoals.value) {
        if (Number(selectedYear.value) !== 0 && goal.year !== Number(selectedYear.value)) continue
        if (searchArr.value.length !== 0 && isSearching.value) {
          let matchCount = 0
          for (const a of searchArr.value) {
            if ((goal.title !== null && goal.title !== undefined && goal.title.includes(a)) ||
                (goal.description !== null && goal.description !== undefined && goal.description.includes(a))) {
              matchCount++
            }
          }
          if (matchCount === searchArr.value.length) {
            goals.value.push(goal)
          }
        } else {
          goals.value.push(goal)
        }
      }
    }
  }, 50)

}

const prevYearEvent = async () => {
  currentYear.value--
  allGoals.value = []
  await getGoals()
  setGoals()
}
const nextYearEvent = async () => {
  currentYear.value++
  await getGoals()
  setGoals()
}

const toThisMonthEvent = () => {
  navigateTo('/goals/edit/' + thisMonthPath)
}

const showShowModal = ref(false)
const selectedGoal = ref<Goal | null>()
const showModal = (goal: Goal) => {
  showShowModal.value = true
  selectedGoal.value = goal
}
const closeShowModal = () => {
  showShowModal.value = false
  selectedGoal.value = null
}

const afterLoad = ref(false)
onMounted(async () => {
  await getGoals()
  setGoals()
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>目標一覧</h3>
        </div>
        <div class="_link_to_register_parent">
          <button @click="toThisMonthEvent" id="link-to-register"
                  class="_link_to_register btn _btn_goals shadow-sm">今月の目標を設定
          </button>
        </div>
        <div id="search-parent">
          <div id="this-month-container" class="d-flex align-items-center shadow-sm">
            <div class="h-100">
              <button @click="prevYearEvent" id="prev-year" class="_year_btn">&#9664;</button>
            </div>
            <div id="this-month-box" class="d-flex align-items-center justify-content-center">
              <h6 id="this-month-text" class="mb-0">{{currentYear}}年</h6>
            </div>
            <div class="h-100">
              <button @click="nextYearEvent" id="next-year" class="_year_btn">&#9654;</button>
            </div>
          </div>
          <div id="search-container">
            <div id="search-keyword-box" class="form-group">
              <label for="search-keyword" class="form-label">キーワード</label>
              <input @input="searchGoals" id="search-keyword" class="form-control form-control-sm shadow-sm">
            </div>
          </div>
        </div>
        <div id="goals">
          <GoalsGoal class="_goal_fadein" v-if="goals.length > 0" v-for="goal in goals" :key="goal.month" :goal="goal" @delete="showDeleteModalEvent" @showModal="showModal"></GoalsGoal>
        </div>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <teleport to="body">
    <GoalsShowModal v-if="showShowModal" :goal="selectedGoal" @close="closeShowModal"></GoalsShowModal>
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
    <DeleteModal v-show="deleteModalShow" @delete="deleteEvent" @return="returnEvent" title="目標を削除しますか" message="一度削除すると元に戻せません"></DeleteModal>
  </teleport>
  <teleport to="body">

  </teleport>
</template>

<style scoped>
._goal_fadein {
  opacity: 0;
  animation-name: goalFadein;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-delay: calc(sibling-index() * 0.1s);
}
@keyframes goalFadein {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 .25rem rgba(180, 60, 210, .25)!important;
}

#search-parent {
  width: 100%;
  padding: 0 30px 0 100px;
  display: flex;
  justify-content: space-between;
  align-items: end;
}

#this-month-container {
  width: 180px;
  height: 50px;
  border: var(--middle-border);
  border-radius: 10px;
  background-color: var(--bg-color);
}
#this-month-box {
  width: 100px;
  text-align: center;
  height: 100%;
  border-left: var(--middle-border);
  border-right: var(--middle-border);
}
._year_btn {
  background-color: var(--bg-color);
  color: var(--font-color);
  border: none;
  width: 40px;
  height: 100%;
}
#prev-year {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
#next-year {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
._year_btn:hover {
  animation-name: btnHoverAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes btnHoverAnimation {
  0% {}
  100% {background-color: var(--card-bg-color);}
}
#search-container {
  display: flex;
  justify-content: end;
  width: 40%;
}
#search-keyword-box {
  width: 100%;
}
label {
  font-weight: bold;
}

#goals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 0 30px 30px;
  margin-top: 20px;
}

@media (max-width: 1400px) {
  #search-parent {
    padding: 0 30px;
  }
}

@media (max-width: 1080px) {
  #goals {
    padding: 0 10px 10px;
    grid-template-columns: 1fr;
  }
  #search-parent {
    padding: 0 10px;
  }
}

@media (max-width: 500px) {
  #search-parent {
    flex-direction: column-reverse;
    align-items: center;
  }
  #search-container {
    width: 100%;
    margin-bottom: 20px;
  }
  #search-keyword-box {
    width: 100%;
  }
  #this-month-box {
    width: 100%;
  }
}
</style>
