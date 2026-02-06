<script setup lang="ts">
import type {AdminUser} from "~/interfaces";

definePageMeta({
  layout: "admin",
  middleware: "admin"
})

useHead({
  title: "Yarucoto | Admin | Users",
})

const token = useCookie('__yarucoto')

const currentPage = ref<number>(Number(useRoute().query.page ?? 1))

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getUsersUrl = baseUrl + '/admin/users/get'

const query = useRoute().query

const users = ref<AdminUser[] | []>([])
const startId = ref<number>(Number(query.startId ?? 0))
const endId = ref<number>(Number(query.endId ?? 0))
const columnKeyword = ref<string>(<string>query.columnKeyword ?? 'username')
const keyword = ref<string>(<string>query.keyword ?? '')
const columnOrder = ref<string>(<string>query.columnOrder ?? 'id')
const order = ref<string>(<string>query.order ?? 'ASC')
const roleId =  ref<number>(Number(query.roleId ?? 0))

const totalPages = ref(0)
const isPagination = ref(true)

const movePaginationEvent = (page: number) => {
  getUsers(page)
  navigateTo({path: '/admin/users/list', query: {
      page: page,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      roleId: roleId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null
    }
  })
}
const moveLastPaginationEvent = () => {
  getUsers(totalPages.value)
  navigateTo({path: '/admin/users/list', query: {
      page: totalPages.value,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      roleId: roleId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null
    }
  })
}
const moveFirstPaginationEvent = () => {
  getUsers(1)
  navigateTo({path: '/admin/users/list', query: {
      page: 1,
      columnKeyword: columnKeyword.value ?? null,
      keyword: keyword.value ?? null,
      startId: startId.value ?? null,
      endId: endId.value ?? null,
      roleId: roleId.value ?? null,
      columnOrder: columnOrder.value ?? null,
      order: order.value ?? null
    }
  })
}
const getUsers = async (page: number) => {
  const params = {
    page: page,
    columnKeyword: columnKeyword.value ?? null,
    keyword: keyword.value ?? null,
    startId: startId.value ?? null,
    endId: endId.value ?? null,
    roleId: roleId.value ?? null,
    columnOrder: columnOrder.value ?? null,
    order: order.value ?? null
  }
  try {
    const res = await $fetch(getUsersUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      query: params,
      key: getUsersUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    users.value = res.users
    totalPages.value = res.totalPages
    currentPage.value = page
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
  roleId: number,
  columnOrder: string,
  order: string
}
const onSearch = async (params: SearchParams) => {
  columnKeyword.value = params.columnKeyword
  keyword.value = params.keyword
  startId.value = params.startId
  endId.value = params.endId
  roleId.value = params.roleId
  columnOrder.value = params.columnOrder
  order.value = params.order
  currentPage.value = params.page
  await getUsers(params.page)
  navigateTo({path: '/admin/users/list', query: params as any})
}

await getUsers(currentPage.value)
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>会員一覧</h3>
    </div>
    <nav class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
    </nav>

    <AdminPagination
        :isPagination="isPagination"
        :paginationCurrentNum="currentPage"
        :paginationTotalNum="totalPages"
        @move="movePaginationEvent"
        @moveLast="moveLastPaginationEvent"
        @moveFirst="moveFirstPaginationEvent"></AdminPagination>
    <div id="user-parent">
      <div id="users" class="mt-4 mb-5">
        <div id="users-title" class="_user_container">
          <div class="_user_box">
            <div id="user-row-title" class="d-flex justify-content-between">
              <div class="_user_inner_row d-flex">
                <div id="user-id-title">
                  <div>ID</div>
                </div>
                <div id="username-title" class="d-flex justify-content-center">
                  <div>会員名</div>
                </div>
                <div id="nickname-title" class="d-flex justify-content-center">
                  <div>ニックネーム</div>
                </div>
                <div id="email-title" class="d-flex justify-content-center">
                  <div>メール</div>
                </div>
              </div>
              <div class="d-flex">
                <div id="role-title" class="_user_role">ロール</div>
                <div id="link-title" class="_show_btn_parent">リンク</div>
              </div>
            </div>
          </div>
        </div>
        <AdminUsersUser v-for="user in users" :key="user.id" :user="user"></AdminUsersUser>
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
  <div id="show-search-area" class="d-flex justify-content-center mb-4">
    <div id="show-search-area-box" class="d-flex">
      <div id="show-search-area-text">{{isSearchShow ? '検索欄を閉じる' : '検索欄を表示する'}}</div>
      <div>
        <button @click="showSearchEvent" id="showSearchArea" :class="{'_is_show': isSearchShow}">▼</button>
      </div>
    </div>
  </div>
  <AdminUsersSearchContainer
      v-show="isSearchShow"
      :columnKeyword="columnKeyword"
      :keyword="keyword"
      :columnOrder="columnOrder"
      :order="order"
      :startId="startId"
      :endId="endId"
      :roleId="roleId"
      :isSearchShow="isSearchShow"
      @onSearch="onSearch"
  ></AdminUsersSearchContainer>
</template>

<style scoped>
#show-search-area{
  width: 100%;
  padding: 0 100px;
}
#show-search-area-box {
  background-color: var(--bg-color);
  border-radius: 10px;
  width: 100%;
  padding: 10px 15px;
}
#show-search-area-text {
  width: calc(100% - 30px);
  text-align: center;
}
#showSearchArea {
  width: 30px;
  background-color: transparent;
  border: none;
  color: var(--font-color);
}
._is_show {
  transform: rotate(180deg);
}
#user-parent {
  padding:0 100px;
}
#user-id-title, #username-title, #nickname-title, #email-title, #role-title, #link-title {
  border: none;
}
._user_container {
  width: 100%;
}
._user_box {
  width: 100%;
}
#user-id-title{
  padding-left: 15px;
  width: 80px;
}
#role-title {
  width: 90px;
  text-align: center;
  border-left: var(--thin-border);
  margin-left: 10px;
  padding-left: 10px;
}
._show_btn_parent {
  width: 60px;
  margin-left: 10px;
  padding-left: 10px;
  border-left: var(--thin-border);
  text-align: center;
}
#user-row-title {
  background-color: var(--bg-color);
  font-weight: bold;
  border: var(--thick-border);
  border-radius: 10px;
  padding: 10px 28px;
}
#users-title ._user_inner_row {
  width: calc(100% - 190px);
}

#username-title {
  margin-left: 10px;
  width: 20rem;
}
#nickname-title {
  width: 20rem;
}
#email-title {
  width: calc(100% - 40rem - 100px);
}
@media (max-width: 1400px) {
  #email-title {
    display: none !important;
  }
}
@media (max-width: 1080px) {
  #role-title {
    display: none;
  }
  #users-title ._user_inner_row {
    width: calc(100% - 80px);
  }
}
@media (max-width: 960px) {
  #nickname-title {
    display: none !important;
  }
}
@media (max-width: 768px) {
  #show-search-area {
    padding: 0 20px;
  }
  #user-parent {
    width : 100%;
    padding: 0 10px;
  }
}
@media (max-width: 576px) {
  #user-parent {
    width : 100%;
    padding: 0 10px;
  }
  #user-row-title {
    padding: 10px 18px;
  }
  #user-id-title {
    width: 60px;
  }
}
@media (max-width: 500px) {
  #username-title {
    max-width: calc(100% - 80px);
  }
}
</style>
