<script setup lang="ts">
import type {Evaluation} from "~/interfaces";
import DeleteModal from "~/components/DeleteModal.vue";

definePageMeta({
  middleware: ["auth", "auth-trial"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Evaluations"
})
const token = useCookie('__yarucoto')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getEvaluationsUrl = baseUrl + '/evaluations/get'
const deleteEvaluationUrl = baseUrl + '/evaluations/delete'

const thisYearMonthPath = new Date().getFullYear() + '-' + (new Date().getMonth() + 1)

const allEvaluations = ref<Evaluation[]>([])
const evaluations = ref<Evaluation[]>([])

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
    const res = await $fetch(deleteEvaluationUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteEvaluationUrl + '/' + params.id
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = '削除しました'
      await getEvaluations()
      setEvaluations()
      setTimeout(() => {
        modalShow.value = false
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
      await getEvaluations()
      setEvaluations()
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}
const returnEvent = () => {
  deleteModalShow.value = false
  deleteId.value = 0
}
const getEvaluations = async () => {
  try {
    const res = await $fetch(getEvaluationsUrl + '/' + currentYear.value, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      key: getEvaluationsUrl + '/' + currentYear.value
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    allEvaluations.value = res
  } catch (error) {
    useErrorEvent(error)
  }
}

const selectedYear = ref<string>('0')
const isSearching = ref<boolean>(false)
const searchValue = ref<string>('')
const searchArr = ref<string[]>([])
const searchEvaluations = (e: Event) => {
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
  setEvaluations()
}

const setEvaluations = () => {
  evaluations.value = []
  setTimeout(() => {
    if (!isSearching.value) {
      for (let i = 0; i < 12; i++) {
        let flag = false
        for (const evaluation of allEvaluations.value) {
          if (evaluation.month === i + 1) {
            evaluations.value.push(evaluation)
            flag = true
          }
        }
        if (!flag) {
          evaluations.value.push(
              {
                id: 0,
                rate: 0,
                text: '',
                month: i + 1,
                year: currentYear.value
              } as Evaluation
          )
        }
      }
    } else {
      if (allEvaluations.value === undefined) return
      for (const evaluation of allEvaluations.value) {
        if (Number(selectedYear.value) !== 0 && evaluation.year !== Number(selectedYear.value)) continue
        if (searchArr.value.length !== 0 && isSearching.value) {
          let matchCount = 0
          for (const a of searchArr.value) {
            if ((evaluation.text !== null && evaluation.text !== undefined && evaluation.text.includes(a))) {
              matchCount++
            }
          }
          if (matchCount === searchArr.value.length) {
            evaluations.value.push(evaluation)
          }
        } else {
          evaluations.value.push(evaluation)
        }
      }
    }
  }, 50)
}

const prevYearEvent = async () => {
  currentYear.value--
  allEvaluations.value = []
  await getEvaluations()
  setEvaluations()
}
const nextYearEvent = async () => {
  currentYear.value++
  await getEvaluations()
  setEvaluations()
}

const toThisMonthEvent = () => {
  navigateTo('/evaluations/edit/' + thisYearMonthPath)
}

const showShowModal = ref(false)
const selectedEvaluation = ref<Evaluation | null>()
const showModal = (evaluation: Evaluation) => {
  showShowModal.value = true
  selectedEvaluation.value = evaluation
}
const closeShowModal = () => {
  showShowModal.value = false
  selectedEvaluation.value = null
}

const afterLoad = ref(false)
onMounted(async () => {
  await getEvaluations()
  setEvaluations()
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>月ごとの評価一覧</h3>
        </div>
        <div class="_link_to_register_parent">
          <button @click="toThisMonthEvent"
                  class="_link_to_register btn _btn_past_completed_rate shadow-sm">今月の評価を設定
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
              <input @input="searchEvaluations" id="search-keyword" class="form-control form-control-sm shadow-sm">
            </div>
          </div>
        </div>
        <div id="evaluations">
          <EvaluationsEvaluation class="_evaluation_fadein" v-if="evaluations.length > 0" v-for="evaluation in evaluations" :key="evaluation.month" :evaluation="evaluation" @delete="showDeleteModalEvent" @showModal="showModal"></EvaluationsEvaluation>
        </div>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <teleport to="body">
    <EvaluationsShowModal v-if="showShowModal" :evaluation="selectedEvaluation" @close="closeShowModal"></EvaluationsShowModal>
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
    <DeleteModal v-show="deleteModalShow" @delete="deleteEvent" @return="returnEvent" title="目標を削除しますか" message="一度削除すると元に戻せません"></DeleteModal>
  </teleport>
</template>

<style scoped>
._evaluation_fadein {
  opacity: 0;
  animation-name: evaluationFadein;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-delay: calc(sibling-index() * 0.1s);
}
@keyframes evaluationFadein {
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

#evaluations {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 0 30px 30px;
  margin-top: 20px;
}
._show_btn_is_show {
  animation-name: showBtnShowAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes showBtnShowAnimation {
  0% {
    transform: rotate(0);
  } 100% {
      transform: rotate(180deg);
    }
}
._show_btn_is_hidden {
  animation-name: showBtnHiddenAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes showBtnHiddenAnimation {
  0% {transform: rotate(180deg);}
  100% {transform: rotate(0);}
}

@media (max-width: 1400px) {
  #search-parent {
    padding: 0 30px;
  }
}
@media (max-width: 1080px) {
  #evaluations {
    padding: 0 10px;
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
