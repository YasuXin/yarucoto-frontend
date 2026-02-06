<script setup lang="ts">
import type {Tag, Task, User, RecurringTask} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Tags"
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

const deleteTagUrl = baseUrl + '/tags/delete'

const tags = ref<Tag[]>([])
const tagsCount = computed(() => tags.value.length)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const toRegisterEvent = () => {
  if (user.value && user.value.role === 'ROLE_FREE_MEMBER' && tags.value.length >= 3) {
    modalShow.value = true
    modalMessage.value = '無料会員のタグ設定数の上限に達しています'
    setTimeout(() => {
      navigateTo('/subscription/register/register')
    }, 1000)
  } else {
    navigateTo('/tags/register')
  }
}

const resetState = () => {
  stateTasks.value = null
  stateRecurringTasks.value = null
  homeTasks.value = null
}

const deleteResult = ref('')
const deleteEvent = async (id: number) => {
  try {
    const params: {tagId :number} = {tagId: id}
    const res = await $fetch(deleteTagUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteTagUrl + '/' + params.tagId
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      for (const tag of tags.value) {
        if (Number(tag.id) === Number(id)) {
          const index = tags.value.indexOf(tag)
          tags.value.splice(index, 1)
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
  setTagsEvent()
}
const setTagsEvent = () => {
  if (stateTags.value === undefined || stateTags.value === null) return
  tags.value.length = 0
  for (const tag of stateTags.value) {
    if (searchArr.value.length !== 0 && isSearching.value) {
      let matchCount = 0
      for (const a of searchArr.value) {
        if ((tag.name !== null && tag.name !== undefined && tag.name.includes(a)) ||
            (tag.description !== null && tag.description !== undefined && tag.description.includes(a))
        ) {
          matchCount++
        }
      }
      if (matchCount === searchArr.value.length) {
        tags.value.push(tag)
      }
    } else {
      tags.value.push(tag)
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
  setTagsEvent()
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>タグ設定</h3>
        </div>
        <div class="_link_to_register_parent">
          <button @click="toRegisterEvent" class="_link_to_register btn _btn_primary shadow-sm">タグの追加</button>
        </div>
        <div id="search-form-parent" class="d-flex justify-content-end">
          <div id="search-keyword-parent">
            <label for="search-keyword">キーワードで検索</label>
            <input @input="searchKeywordEvent" type="text" id="search-keyword" class="form-control form-control-sm my-1 shadow-sm"
                   placeholder="準備中">
          </div>
        </div>
        <div id="count-simple-parent">
          <div id="tag-count-parent" class="d-flex justify-content-end align-items-end mb-1">
            <div id="tag-count" class="mx-2">タグ数：<span id="tag-count-text">{{tagsCount}}</span></div>
          </div>
          <div class="_simple_btn_parent">
            <button @click="isSimpleDisplay=!isSimpleDisplay" @mouseover="toggleSimpleMouseover" @mouseleave="toggleSimpleMouseleave" class="_toggle_simple_display_btn shadow-sm" :class="{'_btn_primary_on' : !isSimpleDisplay}">
              <img src="~/assets/images/show.png" width="32" alt=""></button>
          </div>
        </div>
        <transition-group appear tag="div" name="tag-list" id="tags">
          <NoItems text="タグがありません" v-if="tags.length === 0" key="0"></NoItems>
          <TagsTag v-if="tags.length !== 0" v-for="tag in tags" :key="tag.id" :tag="tag" :isSimpleDisplay="isSimpleDisplay" @delete="deleteEvent"></TagsTag>
        </transition-group>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <div ref="toggleSimpleRef" id="toggle-simple-display-mouseover" class="_set_remove_window" :class="{ '_hidden': toggleSimpleTextHidden }">
    <div class="_mouseover_text">表示切替</div>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
@import "~/assets/css/set_remove_windows.css";
.tag-list-enter-active, .tag-list-leave-active {
  transition: all 0.5s;
}
.tag-list-enter-from, .tag-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.tag-list-leave-from {
  opacity: 0;
}
.tag-list-move {
  transition: transform 0.5s;
}
.tag-list-leave-active {
  position: absolute;
}
#count-simple-parent {
  display: flex;
  margin: 10px 0;
  padding: 0 30px;
  height: 40px;
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

#search-keyword-parent {
  width: 400px;
  margin: 0 30px;
}

#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#tag-count-parent {
  width: calc(100% - 36px);
  padding-right: 20px;
}

#tag-count-text {
  font-size: 1.5rem;
}
#tags {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px 10px;
  padding: 0 30px 30px;
}

@media (max-width: 1500px) {
  #tags {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media (max-width: 1080px) {
  #tags {
    grid-template-columns: 1fr 1fr;
  }
  #search-keyword-parent {
    width: 200px;
  }
}
@media (max-width: 960px) {
  #tag-count-text {
    font-size: 1.5rem;
  }
}
@media (max-width: 867.5px) {
  #tags {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  #count-simple-parent {
    margin: 5px 0;
    padding: 0 10px;
  }
  ._simple_btn_parent {
    width: 40px;
    display: flex;
    justify-content: end;
  }
  ._toggle_simple_display_btn {
    transform: scale(0.8);
  }
  #tag-count-parent {
    width: calc(100% - 40px);
    padding-right: 10px;
  }
  #search-keyword-parent {
    margin: 0 10px;
  }
  #tags {
    padding: 0 10px;
  }
}
@media (max-width: 576px) {
  #count-simple-parent {
    padding: 0 10px;
  }
  #tags {
    grid-template-columns: 1fr;
  }
  #tag-count-parent {
    margin: 0 15px;
  }
  #search-keyword-parent {
    width: 100%;
  }
}
</style>
