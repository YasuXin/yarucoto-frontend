<script setup lang="ts">
import type {Tag, Task} from "~/interfaces";
import flatpickr from "vue-flatpickr-component";
import Pagination from "~/components/Pagination.vue";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Tasks | Search"
})

const token = useCookie('__yarucoto')
const stateTasks = useState<Task[] | null>('allTasks')
const homeTasks = useState<Task[] | null>('homeTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getTasksUrl = baseUrl + '/tasks/get' // 検索で使用　全タスクを取得する
const putToggleCompletedUrl = baseUrl + '/tasks/put/toggleCompleted'
const deleteTaskUrl = baseUrl + '/tasks/delete'

const allTasks = computed(() => stateTasks.value as Task[] ?? [])
const tasks = ref<Task[]>()
const tags = computed(() => stateTags.value as Tag[] ?? [])

const selectedTag = ref(0)
const selectedTagName = computed(() => {
  let tagNames = ''
  if (selectedTag.value !== 0) {
    for (const tag of tags.value) {
      if (tag.id === selectedTag.value) {
        tagNames += tag.name + ' '
      }
    }
  }
  return tagNames
})

const dateConfig = useFlatpickr().configRangeDate

const fixedSetCompTextHidden = ref(true)
const fixedRemoveCompTextHidden = ref(true)

const setCompleteRef = ref<HTMLInputElement>()
const removeCompleteRef = ref<HTMLInputElement>()

const setCompleteMouseover = (flag: boolean) => {
  fixedRemoveCompTextHidden.value = true
  if (flag) {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      const setMouseover = setCompleteRef.value as HTMLElement
      if (setMouseover) {
        setMouseover.style.top = e.clientY - 20 + 'px'
        setMouseover.style.left =  e.clientX + 20 + 'px'
      }
    })
    fixedSetCompTextHidden.value = false
  } else {
    fixedSetCompTextHidden.value = true
  }
}
const removeCompleteMouseover = (flag: boolean) => {
  fixedSetCompTextHidden.value = true
  if (flag) {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      const removeMouseover = removeCompleteRef.value as HTMLElement
      if (removeMouseover) {
        removeMouseover.style.top = e.clientY - 20 + 'px'
        removeMouseover.style.left =  e.clientX + 20 + 'px'
      }
    })
    fixedRemoveCompTextHidden.value = false
  } else {
    fixedRemoveCompTextHidden.value = true
  }
}

const modalShow = ref(false)
const modalMessage = ref('送信に失敗しました')

const toggleSearchResult = ref('')
const toggleSearchEvent = async (toggleReq: { id: number, completed: boolean}) => {
  try {
    const params: { taskId: number } = {taskId: Number(toggleReq.id)}
    const res = await $fetch(putToggleCompletedUrl, {
      method: 'PUT',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: putToggleCompletedUrl + '/' + params.taskId
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    toggleSearchResult.value = res
    if (toggleSearchResult.value === 'success') {
      if (tasks.value !== undefined) {
        for (const task of tasks.value) {
          if (Number(task.id) === Number(toggleReq.id)) {
            task.completed = !task.completed;
          }
        }
      }
      await getTasks()
    } else {
      modalShow.value = true
      modalMessage.value = '送信に失敗しました'
      stateTasks.value = null
      if (tasks.value !== undefined) {
        for (const task of tasks.value) {
          if (Number(task.id) === Number(toggleReq.id)) {
            resetHomeTasks(task.dueDate)
          }
        }
      }
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    if (tasks.value !== undefined) {
      for (const task of tasks.value) {
        if (Number(task.id) === Number(toggleReq.id)) {
          resetHomeTasks(task.dueDate)
        }
      }
    }
    useErrorEvent(error)
  }
}

const getTasks = async () => {
  try {
    const res = await $fetch(getTasksUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      key: getTasksUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    stateTasks.value = res
    isSearchSubmitting.value = false
  } catch (error) {
    useErrorEvent(error)
  }
}

const resetHomeTasks = (dateStr: string) => {
  const now = new Date()
  if (dateStr === useMakeDateStrFromDate(now) ||
      dateStr === useMakeDateStrFromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)) ||
      dateStr === useMakeDateStrFromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))) {
    homeTasks.value = null
  }
}

const deleteResult = ref('')
const deleteSearchTaskEvent = async (id: number) => {
  try {
    const params: {taskId :number} = {taskId: id}
    const res = await $fetch(deleteTaskUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteTaskUrl + '/' + params.taskId
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      if (allTasks.value !== undefined) {
        for (const task of allTasks.value) {
          if (Number(task.id) === Number(id) && stateTasks.value !== undefined && stateTasks.value !== null) {
            const index = allTasks.value.indexOf(task)
            stateTasks.value.splice(index, 1)
            resetHomeTasks(task.dueDate)
          }
        }
      }
      if (tasks.value !== undefined) {
        for (const task of tasks.value) {
          if (Number(task.id) === Number(id)) {
            const index = tasks.value.indexOf(task)
            tasks.value.splice(index, 1)
          }
        }
      }
      allSearchCount.value--
    } else {
      modalShow.value = true
      modalMessage.value = '送信に失敗しました'
      stateTasks.value = null
      if (allTasks.value !== undefined) {
        for (const task of allTasks.value) {
          if (Number(task.id) === Number(id)) {
            resetHomeTasks(task.dueDate)
          }
        }
      }
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    stateTasks.value = null
    if (allTasks.value !== undefined) {
      for (const task of allTasks.value) {
        if (Number(task.id) === Number(id)) {
          resetHomeTasks(task.dueDate)
        }
      }
    }
    useErrorEvent(error)
  }
}

const tagSelectEvent = (tagId: number) => {
  if (selectedTag.value == tagId) {
    selectedTag.value = 0
  } else {
    selectedTag.value = tagId
  }
  searchEvent()
}

const allSearchCount = ref(0)
const isSearchSubmitting = ref(false)
const isSettingTasks = ref(false)
const searchValue = ref('')
const searchArr = ref<string[]>([])
const isSearchDate = ref(false)
const searchStartDate = ref<string>(useMakeDateStrFromDate(new Date))
const searchEndDate = ref<string>(useMakeDateStrFromDate(new Date))

const searchKeywordEvent = async (e: Event) => {
  const t = e.target as HTMLInputElement
  searchValue.value = t.value
  if (t.value.length > 0) {
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
    await searchEvent()
  } else {
    searchArr.value.length = 0
    await searchEvent()
  }
}

const removeTasks = () => {
  searchArr.value.length = 0
  isPagination.value = false
  allSearchCount.value = 0
  isSettingTasks.value = false
  if (tasks.value !== undefined && tasks.value !== null) tasks.value.length = 0
}
const searchDateEvent = async (e: Event) => {
  const t = e.target as HTMLInputElement
  const keywordArr = t.value.split(' から ')
  if (keywordArr.length === 2) {
    searchStartDate.value = keywordArr[0] as string
    searchEndDate.value = keywordArr[1] as string
  } else if (keywordArr.length === 1) {
    searchStartDate.value = keywordArr[0] as string
    searchEndDate.value = keywordArr[0] as string
  } else {
    searchStartDate.value = ''
    searchEndDate.value = ''
    isSearchDate.value = false
  }
  await searchEvent()
}
const searchBoxEvent = async (e: Event) => {
  const t = e.target as HTMLInputElement
  if (t.checked) {
    isSearchDate.value = true
    await searchEvent()
  } else {
    isSearchDate.value = false
    await searchEvent()
  }
}
const searchEvent = async (init: boolean = true) => {
  isSettingTasks.value = true
  if (stateTasks.value === null || allTasks.value === undefined || allTasks.value.length === 0) {
    if (!isSearchSubmitting.value) {
      isSearchSubmitting.value = true
      await getTasks()
    }
  }
  if (searchArr.value.length === 0 && selectedTag.value === 0 && !isSearchDate.value) {
    removeTasks()
    return
  }
  let preTasks: any = []
  if (allTasks.value !== undefined) {
    tasks.value = []
    tasks.value.length = 0
    for (const task of allTasks.value) {
      if (selectedTag.value !== 0 &&
          !(task.tag1 && selectedTag.value === task.tag1.id) &&
          !(task.tag2 && selectedTag.value === task.tag2.id) &&
          !(task.tag3 && selectedTag.value === task.tag3.id)
      ) continue
      let matchCount = 0
      for (const a of searchArr.value) {
        if ((task.title !== null && task.title !== undefined && task.title.includes(a)) ||
            (task.description !== null && task.description !== undefined && task.description.includes(a))) {
          matchCount++
        }
      }
      if (matchCount === searchArr.value.length) {
        if (isSearchDate.value) {
          const startDate = new Date(searchStartDate.value)
          const endDate = new Date(searchEndDate.value)
          const taskDate = new Date(task.dueDate)
          if (taskDate >= startDate && taskDate <= endDate) {
            preTasks.push(task)
          }
        } else {
          preTasks.push(task)
        }
      }
    }
    allSearchCount.value = preTasks.length
    const showCount = 36
    if (init) paginationCurrentNum.value = 1
    if (preTasks.length > showCount) {
      isPagination.value = true
      paginationTotalNum.value = Math.ceil(preTasks.length / showCount)
      const start = (paginationCurrentNum.value - 1) * showCount
      const end = start + showCount
      for (let i = start; i < end; i++) {
        if (i >= preTasks.length) break
        tasks.value.push(preTasks[i])
      }
    } else {
      isPagination.value = false
      paginationCurrentNum.value = 1
      paginationTotalNum.value = 1
      tasks.value.push(...preTasks)
    }
    isSettingTasks.value = false
  }
}

const isPagination = ref(false)
const paginationTotalNum = ref(1)
const paginationCurrentNum = ref(1)
const movePaginationEvent = async (num: number) => {
  if (num) {
    paginationCurrentNum.value = num
    await searchEvent( false)
  }
}
const moveFirstPaginationEvent = async () => {
  paginationCurrentNum.value = 1
  await searchEvent(false)
}
const moveLastPaginationEvent = async () => {
  paginationCurrentNum.value = paginationTotalNum.value
  await searchEvent(false)
}

const isSimpleDisplay = ref(true)

const afterLoad = ref(true)
onMounted(async () => {
  await getTasks()
  afterLoad.value = true
})

</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>タスク検索</h3>
        </div>
        <div id="return-tasks-parent" class="my-3 d-flex justify-content-center">
          <NuxtLink to="/tasks/list" class="_normal_link text-center">一覧へ</NuxtLink>
        </div>
        <div id="search-form-container" class="d-flex justify-content-end align-items-center">
          <div id="search-form-box" class="d-flex justify-content-end">
            <div id="search-keyword-parent">
              <label for="search-keyword" class="mb-1">キーワード</label>
              <input @input="searchKeywordEvent" type="text" id="search-keyword" class="form-control form-control-sm mt-1 shadow-sm"
                     placeholder="準備中">
            </div>
            <div id="search-date-parent">
              <div class="d-flex">
                <label for="search-date-checkbox">日付で絞り込む</label>
                <div class="form-check form-switch">
                  <input type="checkbox" @change="searchBoxEvent" role="switch" class="form-check-input shadow-sm" id="search-date-checkbox">
                </div>
              </div>
              <div class="d-flex my-1">
                <flatpickr @change="searchDateEvent" :config="dateConfig" type="date" name="startDate" :class="{'_disabled' : !isSearchDate}" class="_search_date form-control form-control-sm shadow-sm" :disabled="!isSearchDate"></flatpickr>
              </div>
            </div>
          </div>
        </div>
        <div id="tag-btns-parent" class="d-flex flex-wrap px-4 pt-4">
          <label>タグ：</label>
          <TagButtons :tags="tags" :selectedTagId="selectedTag" @tagSelect="tagSelectEvent"></TagButtons>
        </div>
        <div class="_simple_btn_parent mb-2">
          <button @click="isSimpleDisplay=!isSimpleDisplay" class="_toggle_simple_display_btn shadow-sm" :class="{'_btn_primary_on' : !isSimpleDisplay}">
            <img src="~/assets/images/show.png" width="32" alt=""></button>
        </div>
        <div id="search-parent">
          <div v-if="searchValue" class="text-center mb-2">「{{searchValue}}」　の検索結果</div>
          <div v-if="selectedTag !== 0" class="text-center mb-2">タグ：{{selectedTagName}}</div>
          <div v-if="isSearchDate" class="text-center mb-2">
            日付：{{searchStartDate.substring(0, 4)}}/{{searchStartDate.substring(5, 7)}}/{{searchStartDate.substring(8, 10)}}
            <span v-show="searchStartDate !== searchEndDate">～{{searchEndDate.substring(0, 4)}}/{{searchEndDate.substring(5, 7)}}/{{searchEndDate.substring(8, 10)}}</span>
          </div>
          <div v-if="allSearchCount !== 0 && allTasks !== undefined && allTasks.length > 0" class="text-center">
            タスク数：{{allSearchCount}}
          </div>
          <div id="search-container" class="my-3">
            <Pagination :isPagination="isPagination"
                        :paginationCurrentNum="paginationCurrentNum"
                        :paginationTotalNum="paginationTotalNum"
                        @moveFirst="moveFirstPaginationEvent"
                        @move="movePaginationEvent"
                        @moveLast="moveLastPaginationEvent"></Pagination>
            <transition-group appear tag="div" name="task-list" id="search-tasks" >
              <NoItems text="検索を行ってください" v-if="searchValue.length === 0 && (tasks === undefined || tasks.length === 0) && !isSettingTasks" key="0"></NoItems>
              <NoItems text="タスクがありません" v-if="searchValue.length !== 0 && tasks !== undefined && tasks.length === 0" key="0"></NoItems>
              <TasksSearchTask v-if="tasks !== undefined && tasks.length !== 0"
                               @delete="deleteSearchTaskEvent" @toggleEvent="toggleSearchEvent"
                               @setCompleteMouseover="setCompleteMouseover"
                               @removeCompleteMouseover="removeCompleteMouseover"
                               v-for="task in tasks" :key="task.id"
                               :task="task" :selectedTagId="selectedTag" :isSimpleDisplay="isSimpleDisplay"></TasksSearchTask>
            </transition-group>
            <Loading v-if="isSearchSubmitting || isSettingTasks"></Loading>
          </div>
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
@import "~/assets/css/tag_color.css";
@import "~/assets/css/set_remove_windows.css";
.task-list-enter-active, .task-list-leave-active {
  transition: all 0.5s;
}
.task-list-enter-from, .task-list-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.task-list-leave-from {
  opacity: 0;
}
.task-list-move {
  transition: transform 0.5s;
}
.task-list-leave-active {
  position: absolute;
}

._simple_btn_parent {
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
}
._toggle_simple_display_btn {
  position: absolute;
  top: 10px;
  right: 40px;
  background-color: var(--bg-color);
  border: var(--middle-border);
  border-radius: 5px;
  padding: 2px;
}

._toggle_simple_display_btn:hover {
  animation-name: btnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

@keyframes btnAnimation {
  0% {}
  100% {background-color: var(--disabled-form-bg-color);}
}
.form-check-input:checked {
  background-color: var(--theme-color1) !important;
}

#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}

#search-form-container {
  width: 100%;
  padding: 0 16px;
}
#search-form-box {
  padding: 0 16px;
}
#search-keyword-parent {
  width: 260px;
  margin: 0 10px;
}
#search-date-parent {
  width: 300px;
  margin-left: 20px;
}
.form-switch {
  padding-left: 0!important;
}
#search-date-checkbox {
  margin-left: 10px;
}
#search-parent {
  padding: 20px 40px;
}

#search-tasks {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px 10px;
}

@media (max-width: 1600px) {
  #search-tasks {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1080px) {
  #search-form-box {
    width: 100%;
  }
  #search-tasks {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 867.5px) {
  #search-keyword-parent {
    width: 200px;
  }
  #search-date-parent {
    width: 250px;
  }
  #search-tasks{
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  #search-form-container {
    width: 100%;
  }
  #search-form-box {
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
  #tag-btns-parent {
    padding-left: 32px!important;
    padding-right: 32px!important;
  }
  #search-keyword-parent {
    width: 100%;
    margin: 0;
  }
  #search-date-parent {
    width: 100%;
    margin: 8px 0 0;
  }
  #search-parent {
    padding: 20px 32px;
  }
}
@media (max-width: 576px) {
  ._toggle_simple_display_btn {
    right: 10px;
    transform: scale(0.8);
  }
  #search-parent {
    padding: 20px 10px;
  }
  #search-tasks {
    padding: 0 0 15px;
  }
  #search-tasks {
    padding: 0 0 15px;
  }
  #search-form-container {
    padding: 0 10px;
  }
  #search-form-box {
    padding: 0;
  }
  #tag-btns-parent {
    padding-left: 10px!important;
    padding-right: 10px!important;
  }
  h4 {
    font-size: 1.2rem;
  }
}

</style>
