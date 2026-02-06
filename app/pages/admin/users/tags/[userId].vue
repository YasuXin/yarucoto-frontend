<script setup lang="ts">
import type {AdminTag, AdminUser} from "~/interfaces";

definePageMeta({
  layout: "admin",
  middleware: "admin"
})

useHead({
  title: "Yarucoto | Admin | Users | Tags",
})

const token = useCookie('__yarucoto')
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const userId = useRoute().params.userId

const getUserAndTagsUrl = baseUrl + '/admin/users/tags/get/' + userId
const deleteTagUrl = baseUrl + '/admin/tags/delete'

const currentPage = ref<number>(Number(useRoute().query.page ?? 1))

const query = useRoute().query

const user = ref<AdminUser | null>()
const tags = ref<AdminTag[] | []>([])
const startId = ref<number>(Number(query.startId ?? 0))
const endId = ref<number>(Number(query.endId ?? 0))
const columnKeyword = ref<string>(<string>query.columnKeyword ?? 'name')
const keyword = ref<string>(<string>query.keyword ?? '')
const columnOrder = ref<string>(<string>query.columnOrder ?? 'id')
const order = ref<string>(<string>query.order ?? 'ASC')
const color = ref<number>(Number(query.color ?? 0))

const totalPages = ref(0)
const isPagination = ref(true)

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const movePaginationEvent = (page: number) => {
  getUserAndTags(page)
  navigateTo({path: '/admin/users/tags/' + userId, query: {
      page: page,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      color: color.value ?? null
    }})
  window.scrollTo(0, 0)
}
const moveLastPaginationEvent = () => {
  getUserAndTags(totalPages.value)
  navigateTo({path: '/admin/users/tags/' + userId, query: {
      page: totalPages.value,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      color: color.value ?? null
    }})
  window.scrollTo(0, 0)
}
const moveFirstPaginationEvent = () => {
  getUserAndTags(1)
  navigateTo({path: '/admin/users/tags/' + userId, query: {
      page: 1,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null,
      color: color.value ?? null
    }})
  window.scrollTo(0, 0)
}

const returnShow = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + userId)
}

const getUserAndTags = async (page: number) => {
  const params = {
    page: page,
    columnKeyword: columnKeyword.value ?? null,
    keyword: keyword.value ?? null,
    startId: startId.value ?? null,
    endId: endId.value ?? null,
    columnOrder: columnOrder.value ?? null,
    order: order.value ?? null,
    color: color.value ?? null
  }
  try {
    const res = await $fetch(getUserAndTagsUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      query: params,
      key: getUserAndTagsUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    user.value = res.user
    tags.value = res.tags
    totalPages.value = res.totalPages
    currentPage.value = page
  } catch (error) {
    useErrorEvent(error)
  }
}

const deleteResult = ref('')
const deleteTag = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params: {
    userId: number,
    tagId: number
  } = {
    userId: user?.value?.id ?? 0,
    tagId: Number(selectedTag?.value?.id) ?? 0
  }
  try {
    const res = await $fetch(deleteTagUrl, {
      method: 'DELETE',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      body: params,
      key: deleteTagUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = "タグを削除しました"
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else if (deleteResult.value === 'no-user') {
      modalMessage.value = "指定した会員が見つかりませんでした"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else if (deleteResult.value === 'no-tag') {
      modalMessage.value = "指定したタグが見つかりませんでした"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else {
      modalMessage.value = "予期せぬエラーが発生しました"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}

const isSearchShow = ref(false)
const showSearchEvent = () => {
  isSearchShow.value = !isSearchShow.value
}

interface SearchParams {
  page: number,
  columnKeyword: string,
  keyword: string,
  startId: number,
  endId: number,
  columnOrder: string,
  order: string,
  color: number
}

const onSearch = async (params: SearchParams) => {
  columnKeyword.value = params.columnKeyword
  keyword.value = params.keyword
  startId.value = params.startId
  endId.value = params.endId
  columnOrder.value = params.columnOrder
  order.value = params.order
  color.value = params.color
  await getUserAndTags(currentPage.value)
  navigateTo({path: '/admin/users/tags/' + userId, query: params as any})
  window.scrollTo(0, 0)
}

const selectedTag = ref<AdminTag | null>()
const isTagModalShow = ref(false)
const showTagModal = (tagId: number) => {
  for (const tag of tags.value) {
    if (tag.id === tagId) {
      selectedTag.value = tag
      break
    }
  }
  isTagModalShow.value = true
  isDeleteModalShow.value = false
}

const isDeleteModalShow = ref(false)
const showDeleteModal = () => {
  isDeleteModalShow.value = true
  isTagModalShow.value = false
}
const onDelete = async () => {
  isDeleteModalShow.value = false
  isTagModalShow.value = false
  await deleteTag()
}
const returnEvent = () => {
  isDeleteModalShow.value = false
  isTagModalShow.value = false
}

await getUserAndTags(currentPage.value)
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>{{user?.username}}のタスク一覧</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/users/list?page=1" class="_normal_link mb-3">会員一覧</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink @click="returnShow" class="_normal_link mb-3">会員情報</NuxtLink>
    </div>
    <AdminPagination
        :isPagination="isPagination"
        :paginationCurrentNum="currentPage"
        :paginationTotalNum="totalPages"
        @move="movePaginationEvent"
        @moveLast="moveLastPaginationEvent"
        @moveFirst="moveFirstPaginationEvent"></AdminPagination>
    <div id="tag-parent">
      <div id="tags" class="mt-4 mb-5">
        <div id="tags-title" class="_tag_container">
          <div class="_tag_box">
            <div id="tag-row-title" class="d-flex justify-content-between">
              <div class="_tag_inner_row d-flex">
                <div class="_tag_id_title">
                  <div>ID</div>
                </div>
                <div class="_tag_name_title d-flex justify-content-center">
                  <div>名前</div>
                </div>
                <div class="_tag_color_title d-flex justify-content-center">
                  <div>色</div>
                </div>
              </div>
              <div class="d-flex">
                <div id="link-title" class="_show_btn_parent">リンク</div>
              </div>
            </div>
          </div>
        </div>
        <AdminUsersTag v-for="tag in tags" :key="tag.id" :tag="tag" @show="showTagModal"></AdminUsersTag>
      </div>
    </div>
  </div>
  <AdminPagination
      :isPagination="isPagination"
      :paginationCurrentNum="currentPage"
      :paginationTotalNum="totalPages"
      @move="movePaginationEvent"
      @moveLast="moveLastPaginationEvent"
      @moveFirst="moveFirstPaginationEvent"></AdminPagination>
  <AdminShowSearchAreaBox :show="isSearchShow" @showSearch="showSearchEvent"></AdminShowSearchAreaBox>
  <AdminUsersTagsSearchContainer
      v-show="isSearchShow"
      :columnKeyword="columnKeyword"
      :keyword="keyword"
      :columnOrder="columnOrder"
      :order="order"
      :startId="startId"
      :endId="endId"
      :color="color"
      @search="onSearch"
  ></AdminUsersTagsSearchContainer>
  <teleport to="body">
    <AdminTagsTagModal v-if="isTagModalShow" :tag="selectedTag" :user="user" @delete="showDeleteModal" @return="returnEvent"></AdminTagsTagModal>
    <DeleteModal v-if="isDeleteModalShow" title="本当に削除しますか？" message="削除した場合、二度と戻せません" @delete="onDelete" @return="returnEvent"></DeleteModal>
    <Modal :modalShow="modalShow" :message="modalMessage"></Modal>
  </teleport>
</template>

<style scoped>
#main-child {
  max-width: 1000px;
  margin: 0 auto;
}
#tag-parent {
  padding:0 100px;
}
._tag_container {
  width: 100%;
}
._tag_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._tag_id_title {
  width: 100px;
  padding-left: 30px;
}
._tag_name_title {
  width: calc(100% - 210px);
}
._tag_color_title {
  width: 110px;
}
#link-title {
  border: none;
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
#tag-row-title {
  background-color: var(--bg-color);
  font-weight: bold;
  border: var(--thick-border);
  border-radius: 10px;
  padding: 10px 18px;
}
#tags-title ._tag_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
#tags-title ._tag_inner_row {
  width: calc(100% - 60px);
}
@media (max-width: 1400px) {
  #tag-parent {
    padding: 0 20px;
  }
}
@media (max-width: 1080px) {
  #tags-name ._tag_inner_row {
    width: calc(100% - 80px);
  }
}
@media (max-width: 960px) {
  ._tag_id_title {
    width: 100px;
    padding-left: 15px;
  }
}
@media (max-width: 768px) {
  #tag-parent {
    width : 100%;
    padding: 0 10px;
  }
  ._tag_name_title {
    width: calc(100% - 180px);
  }
  ._tag_id_title {
    width: 80px;
  }
}
@media (max-width: 576px) {
  #tag-parent {
    width : 100%;
    padding: 0 10px;
  }
  #tag-row-title {
    padding: 10px 5px;
  }
  ._tag_id_title {
    width: 60px;
  }
  ._tag_name_title {
    width: calc(100% - 100px);
  }
  ._tag_color_title {
    width: 50px;
  }
}
</style>
