<script setup lang="ts">
import type {RecurringTask, Tag, User, Task} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Routines"
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

const deleteRecurringTaskUrl = baseUrl + '/recurringTasks/delete'
const putToggleActiveUrl = baseUrl + '/recurringTasks/put/toggleActive'

const tasks = ref<RecurringTask[]>([])
const tags = computed(() => stateTags.value) as Ref<Tag[]>

const tasksCount = computed(() => tasks.value.length)

const selectedTag = ref(0)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const resetState = () => {
  stateTasks.value = null
  stateRecurringTasks.value = null
  homeTasks.value = null
}

const toRegisterEvent = () => {
  if (user.value && user.value.role === 'ROLE_FREE_MEMBER' && tasks.value.length >= 5) {
    modalShow.value = true
    modalMessage.value = '無料会員のルーティーン設定数の上限に達しています'
    setTimeout(() => {
      navigateTo('/subscription/register/register')
    }, 1000)
  } else {
    navigateTo('/routines/register')
  }
}

const activateId = ref(0)
const isActivateModalShow = ref(false)
const showActivateModalShowEvent = async (taskId : number, isActive: boolean) => {
  activateId.value = taskId
  if (isActive) {
    isActivateModalShow.value = true
  } else {
    await toggleActivateEvent()
  }
}

const returnEvent = () => {
  isActivateModalShow.value = false
}

const toggleActivateResult = ref('')
const toggleActivateEvent = async () => {
  if (activateId.value === 0) {
    modalShow.value = true
    modalMessage.value = 'ルーティーンが設定されていません'
    setTimeout(() => {
      modalShow.value = false
      window.location.reload()
    }, 1000)
  }
  try {
    const params: {recurringTaskId: number } = {recurringTaskId: activateId.value}
    const res = await $fetch(putToggleActiveUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: putToggleActiveUrl + '/' + params.recurringTaskId
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    toggleActivateResult.value = res
    if (toggleActivateResult.value === 'success') {
      for (const task of tasks.value) {
        if (Number(task.id) === Number(activateId.value)) {
          task.isActive = task.isActive !== true;
          homeTasks.value = null
        }
      }
      isActivateModalShow.value = false
      resetState()
    } else {
      modalShow.value = true
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
  activateId.value = 0
}

const deleteResult = ref('')
const deleteEvent = async (id: number) => {
  try {
    const params: {id :number} = {id: id}
    const res = await $fetch(deleteRecurringTaskUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteRecurringTaskUrl + '/' + params.id
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      for (const task of tasks.value) {
        if (Number(task.id) === Number(id)) {
          const index = tasks.value.indexOf(task)
          tasks.value.splice(index, 1)
        }
      }
      resetState()
    } else {
      modalShow.value = true
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

const tagSelectEvent = (tagId: number) => {
  if (selectedTag.value == tagId) {
    selectedTag.value = 0
  } else {
    selectedTag.value = tagId
  }
  setTasksEvent()
}

const isSearching = ref(false)
const searchValue = ref('')
const searchArr = ref<string[]>([])
const searchKeywordEvent = async (e: Event) => {
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
  setTasksEvent()
}
const setTasksEvent = () => {
  if (stateRecurringTasks.value === undefined || stateRecurringTasks.value === null) return
  tasks.value.length = 0
  for (const task of stateRecurringTasks.value) {
    if (searchArr.value.length !== 0 && isSearching.value) {
      if (selectedTag.value !== 0 &&
          !(task.tag1 && selectedTag.value === task.tag1.id) &&
          !(task.tag2 && selectedTag.value === task.tag2.id) &&
          !(task.tag3 && selectedTag.value === task.tag3.id)
      ) {
        continue
      }
      let matchCount = 0
      for (const a of searchArr.value) {
        if ((task.title !== null && task.title !== undefined && task.title.includes(a)) ||
            (task.description !== null && task.description !== undefined && task.description.includes(a))) {
          matchCount++
        }
      }
      if (matchCount === searchArr.value.length) {
        tasks.value.push(task)
      }
    } else {
      tasks.value.push(task)
    }
  }
}

const isSimpleDisplay = ref(true)
const toggleSimpleTextHidden = ref(true)
const toggleSimpleRef = ref<HTMLDivElement | null>(null)
const toggleSimpleMouseover = (e: MouseEvent) => {
  toggleSimpleTextHidden.value = false
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const toggleSimpleMouseover = toggleSimpleRef.value as HTMLElement
    if (toggleSimpleMouseover) {
      toggleSimpleMouseover.style.top = e.clientY - 20 + 'px'
      toggleSimpleMouseover.style.left =  e.clientX - 100 + 'px'
    }
  })
}
const toggleSimpleMouseleave = () => {
  toggleSimpleTextHidden.value = true
}

const afterLoad = ref(false)
onMounted(async () => {
  setTasksEvent()
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
  <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>ルーティーン</h3>
        </div>
        <div class="_link_to_register_parent">
          <button @click="toRegisterEvent" class="_link_to_register btn _btn_primary shadow-sm">ルーティーンの追加</button>
        </div>
        <div id="search-form-parent" class="d-flex justify-content-end">
          <div id="search-keyword-parent">
            <label for="search-keyword">キーワードで検索</label>
            <input @input="searchKeywordEvent" type="text" id="search-keyword" class="form-control form-control-sm mt-1 shadow-sm"
                   placeholder="準備中">
          </div>
        </div>
        <div id="tag-btns-parent" class="d-flex flex-wrap px-4 pt-4">
          <label>タグ：</label>
          <TagButtons :tags="tags" :selectedTagId="selectedTag" @tagSelect="tagSelectEvent"></TagButtons>
        </div>
        <div id="count-simple-parent">
          <div id="rtask-count-parent" class="d-flex justify-content-end align-items-end mb-1">
            <div id="rtask-count" class="mx-2">
              <span v-if="isSearching">「{{searchValue}}」　の検索結果　</span>
              ルーティーン数：<span id="rtask-count-text">{{tasksCount}}</span>
            </div>
          </div>
          <div class="_simple_btn_parent">
            <button @click="isSimpleDisplay=!isSimpleDisplay" @mouseover="toggleSimpleMouseover" @mouseleave="toggleSimpleMouseleave" class="_toggle_simple_display_btn shadow-sm" :class="{'_btn_primary_on' : !isSimpleDisplay}">
              <img src="~/assets/images/show.png" width="32" alt=""></button>
          </div>
        </div>
        <transition-group appear tag="div" name="task-list" id="tasks">
          <NoItems text="ルーティーンがありません" v-if="tasks.length === 0" key="0"></NoItems>
          <RoutinesTask v-if="tasks.length !== 0" v-for="task in tasks" :key="task.id"
                        :task="task" :selectedTagId="selectedTag" :isSimpleDisplay="isSimpleDisplay"
                        @delete="deleteEvent" @activate="showActivateModalShowEvent"></RoutinesTask>
        </transition-group>
        <Loading v-if="!afterLoad"></Loading>
      </div>
    </main>
  </div>
  <div ref="toggleSimpleRef" id="toggle-simple-display-mouseover" class="_set_remove_window" :class="{ '_hidden': toggleSimpleTextHidden }">
    <div class="_mouseover_text">表示切替</div>
  </div>
  <teleport to="body">
    <RoutinesActivateModal v-if="isActivateModalShow" @activate="toggleActivateEvent" @return="returnEvent"></RoutinesActivateModal>
  </teleport>
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
  transform: translateY(-30px);
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

#count-simple-parent {
  display: flex;
  justify-content: end;
  padding: 10px 20px 10px 0;
}
._simple_btn_parent {
  display: flex;
  justify-content: end;
  width: 36px;
  height: 36px;
}
._toggle_simple_display_btn {
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

#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}

#rtask-count-parent {
  padding: 0 20px;
}

#rtask-count-text {
  font-size: 1.5rem;
}

#search-keyword-parent {
  width: 400px;
  margin: 0 20px;
}

#tasks {
  width: 100%;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px 10px;
}
@media (max-width: 1500px) {
  #tasks {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1080px) {
  #tasks {
    grid-template-columns: 1fr;
  }
  #search-keyword-parent {
    width: 200px;
  }
}

@media (max-width: 960px) {
  #rtask-count-text {
    font-size: 1.5rem;
  }
  #tasks {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 867.5px) {
  #tasks {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  #count-simple-parent {
    padding-right: 20px;
  }
  ._simple_btn_parent {
    display: flex;
    justify-content: end;
  }
  ._toggle_simple_display_btn {
    transform: scale(0.8);
  }
}
@media (max-width: 576px) {
  #count-simple-parent {
    padding-right: 10px;
  }
  #tasks {
    padding: 0;
  }
  #search-keyword-parent {
    width: calc(50% - 20px);
    margin: 0 10px;
  }
}

@media(max-width: 500px) {
  #rtask-count-parent {
    padding: 0 15px;
  }

  #tasks {
    padding: 0;
  }

  #search-keyword-parent {
    width: calc(100% - 20px);
  }

  #tag-btns-parent {
    padding-left: 10px!important;
    padding-right: 10px!important;
  }

  #main-child {
    margin-bottom: 50px !important;
  }
}
</style>
