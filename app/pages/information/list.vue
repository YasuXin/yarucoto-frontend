<script setup lang="ts">
import type {Information} from "~/interfaces";
import Pagination from "~/components/Pagination.vue";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Information"
})

const token = useCookie('__yarucoto')

const stateInformation = useState('informationArr')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getInformationUrl = baseUrl + '/information/get/all'
const postBrowseInformationUrl = baseUrl + '/information/post/browse'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const allInformation = computed(() => stateInformation.value as Information[] ?? [])
const informationArr = ref<Information[]>([])
const selectedInformation = ref<Information>()

const getInformationArr = async () => {
  try {
    const res = await $fetch(getInformationUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      key: getInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    stateInformation.value = res
  } catch (error) {
    useErrorEvent(error)
  }
}
const pageCount = ref(10)
const paginationCurrentNum = ref(1)
const paginationTotalNum = computed(() => Math.ceil(allInformation.value.length / pageCount.value))
const isPagination = ref(false)
const moveFirstPaginationEvent = (): void => {
  paginationCurrentNum.value = 1
  setPaginationEvent(paginationCurrentNum.value)
}
const moveLastPaginationEvent = (): void => {
  paginationCurrentNum.value = paginationTotalNum.value
  setPaginationEvent(paginationCurrentNum.value)
}
const movePaginationEvent = (num: number): void => {
  if (num) {
    paginationCurrentNum.value = num
    setPaginationEvent(paginationCurrentNum.value)
  }
}
const setPaginationEvent = (pageNum: number = 1): void => {
  setTimeout(() => {
    if (allInformation.value && allInformation.value?.length > pageCount.value) {
      isPagination.value = true
    } else if (allInformation.value && allInformation.value?.length <= pageCount.value) {
      isPagination.value = false
    }
    paginationCurrentNum.value = pageNum ?? 1
    informationArr.value = []
    if (allInformation.value === undefined || allInformation.value === null) return
    const start = (paginationCurrentNum.value - 1) * pageCount.value
    const end = start + pageCount.value
    for (let i = start; i < end; i++) {
      if (allInformation.value[i] === undefined || allInformation.value[i] === null) continue
      const information = allInformation.value[i] as Information
      informationArr.value.push(information)
    }
  }, 50)
}
const setSelectedInformation = async (id: number, newInformation: boolean) => {
  selectedInformation.value = allInformation.value.filter(i => i.id === id)[0] as Information
  if (newInformation) {
    await postBrowseInformation(id)
  }
}

const browseResult = ref('')
const postBrowseInformation = async (id: number) => {
  try {
    const params: { id: number } = {id: id}
    const res = await $fetch(postBrowseInformationUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: params,
      key: postBrowseInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    browseResult.value = res
    await getInformationArr()
    if (browseResult.value === 'failed') {
      modalShow.value = true
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

const afterLoad = ref(false)
onMounted(async () => {
  setPaginationEvent()
  selectedInformation.value = allInformation.value[0] as Information
  await postBrowseInformation(selectedInformation.value.id)
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>お知らせ</h3>
        </div>
        <div id="information-parent">
          <Pagination :isPagination="isPagination"
                      :paginationCurrentNum="paginationCurrentNum"
                      :paginationTotalNum="paginationTotalNum"
                      @moveFirst="moveFirstPaginationEvent"
                      @move="movePaginationEvent"
                      @moveLast="moveLastPaginationEvent"></Pagination>
          <transition-group appear name="list" tag="div" id="information">
            <Information v-for="information in informationArr" :key="information.id" :information="information"
            :selectedId="selectedInformation?.id" @show="setSelectedInformation" class="_information_fadein"></Information>
          </transition-group>
          <Pagination :isPagination="isPagination"
                      :paginationCurrentNum="paginationCurrentNum"
                      :paginationTotalNum="paginationTotalNum"
                      @moveFirst="moveFirstPaginationEvent"
                      @move="movePaginationEvent"
                      @moveLast="moveLastPaginationEvent"></Pagination>
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
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from{
  opacity: 0;
}
.list-leave-to {
  opacity: 0;
  transform: translateX(160px);
}
.list-leave-from, .list-enter-to {
  opacity: 1;
}
.list-move {
  transition: transform 0.5s;
}
.list-leave-active {
  position: absolute;
}
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#information-parent {
  padding:0 300px;
}
._information_fadein {
  opacity: 0;
  animation-name: informationFadein;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-delay: calc(sibling-index() * 0.1s);
}
@keyframes informationFadein {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

@media (max-width: 1280px) {
  #information-parent {
    padding:0 100px;
  }
}
@media (max-width: 768px) {
  #information-parent {
    width : 100%;
    padding: 0 10px;
  }
}
</style>
