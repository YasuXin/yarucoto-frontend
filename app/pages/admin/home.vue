<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin"
})

useHead({
  title: "Yarucoto | Admin",
})

const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const usersCountAll = ref(0)
const usersCountAllCreatedBeforeMonth = ref(0)
const usersCountByFreeMember = ref(0)
const usersCountByFreeMemberCreatedBeforeMonth = ref(0)
const usersCountByPaidMember = ref(0)
const usersCountByPaidMemberCreatedBeforeMonth = ref(0)
const tasksCountAll = ref(0)
const tasksCountAllCreatedBeforeMonth = ref(0)
const tasksCountByFreeMember = ref(0)
const tasksCountByFreeMemberCreatedBeforeMonth = ref(0)
const tasksCountByPaidMember = ref(0)
const tasksCountByPaidMemberCreatedBeforeMonth = ref(0)
const recurringTasksCountAll = ref(0)
const recurringTasksCountAllCreatedBeforeMonth = ref(0)
const recurringTasksCountByFreeMember = ref(0)
const recurringTasksCountByFreeMemberCreatedBeforeMonth = ref(0)
const recurringTasksCountByPaidMember = ref(0)
const recurringTasksCountByPaidMemberCreatedBeforeMonth = ref(0)
const tagsCountAll = ref(0)
const tagsCountAllCreatedBeforeMonth = ref(0)
const tagsCountByFreeMember = ref(0)
const tagsCountByFreeMemberCreatedBeforeMonth = ref(0)
const tagsCountByPaidMember = ref(0)
const tagsCountByPaidMemberCreatedBeforeMonth = ref(0)

const getAdminHomeUrl = baseUrl + '/admin/home/get'
const getAdminHome = async () => {
  try {
    const res = await $fetch(getAdminHomeUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: getAdminHomeUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    usersCountAll.value = res.usersCountAll
    usersCountAllCreatedBeforeMonth.value = res.usersCountAllCreatedBeforeMonth
    usersCountByFreeMember.value = res.usersCountByFreeMember
    usersCountByFreeMemberCreatedBeforeMonth.value = res.usersCountByFreeMemberCreatedBeforeMonth
    usersCountByPaidMember.value = res.usersCountByPaidMember
    usersCountByPaidMemberCreatedBeforeMonth.value = res.usersCountByPaidMemberCreatedBeforeMonth
    tasksCountAll.value = res.tasksCountAll
    tasksCountAllCreatedBeforeMonth.value = res.tasksCountAllCreatedBeforeMonth
    tasksCountByFreeMember.value = res.tasksCountByFreeMember
    tasksCountByFreeMemberCreatedBeforeMonth.value = res.tasksCountByFreeMemberCreatedBeforeMonth
    tasksCountByPaidMember.value = res.tasksCountByPaidMember
    recurringTasksCountAll.value = res.recurringTasksCountAll
    recurringTasksCountAllCreatedBeforeMonth.value = res.recurringTasksCountAllCreatedBeforeMonth
    recurringTasksCountByFreeMember.value = res.recurringTasksCountByFreeMember
    recurringTasksCountByFreeMemberCreatedBeforeMonth.value = res.recurringTasksCountByFreeMemberCreatedBeforeMonth
    recurringTasksCountByPaidMember.value = res.recurringTasksCountByPaidMember
    recurringTasksCountByPaidMemberCreatedBeforeMonth.value = res.recurringTasksCountByPaidMemberCreatedBeforeMonth
    tagsCountAll.value = res.tagsCountAll
    tagsCountAllCreatedBeforeMonth.value = res.tagsCountAllCreatedBeforeMonth
    tagsCountByFreeMember.value = res.tagsCountByFreeMember
    tagsCountByFreeMemberCreatedBeforeMonth.value = res.tagsCountByFreeMemberCreatedBeforeMonth
    tagsCountByPaidMember.value = res.tagsCountByPaidMember
  } catch (error) {
    useErrorEvent(error)
  }
}

await getAdminHome()

const isWide = ref(true)
isWide.value = window.innerWidth >= 767.5;

window.addEventListener('resize', () => {
  isWide.value = window.innerWidth >= 767.5;
})
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>管理者ホーム</h3>
    </div>
    <div id="home-container" class="w-100 h-100 d-flex justify-content-center my-3">
      <div id="home-box">
        <div id="home-btns" class="my-3">
          <div><NuxtLink to="/admin/admin-user/register" class="btn _btn_primary">新規管理者登録</NuxtLink></div>
          <div><NuxtLink to="/admin/users/list?page=1" class="btn _btn_primary">会員一覧</NuxtLink></div>
          <div><NuxtLink to="/admin/information/list?page=1" class="btn _btn_primary">お知らせ一覧</NuxtLink></div>
          <div><NuxtLink to="/admin/inquiries/list?page=1" class="btn _btn_primary">お問合わせ一覧</NuxtLink></div>
        </div>

        <div id="users-count-box">
          <AdminHomeTable class="_table_animation"
              title="会員数" :isWide="isWide"
              :countAll="usersCountAll"
              :countByFreeMember="usersCountByFreeMember"
              :countByPaidMember="usersCountByPaidMember"
              :countAllCreatedBeforeMonth="usersCountAllCreatedBeforeMonth"
              :countByFreeMemberCreatedBeforeMonth="usersCountByFreeMemberCreatedBeforeMonth"
              :countByPaidMemberCreatedBeforeMonth="usersCountByPaidMemberCreatedBeforeMonth"
          ></AdminHomeTable>
          <AdminHomeTable class="_table_animation"
              title="タスク数" :isWide="isWide"
              :countAll="tasksCountAll"
              :countByFreeMember="tasksCountByFreeMember"
              :countByPaidMember="tasksCountByPaidMember"
              :countAllCreatedBeforeMonth="tasksCountAllCreatedBeforeMonth"
              :countByFreeMemberCreatedBeforeMonth="tasksCountByFreeMemberCreatedBeforeMonth"
              :countByPaidMemberCreatedBeforeMonth="tasksCountByPaidMemberCreatedBeforeMonth"
          ></AdminHomeTable>
          <AdminHomeTable class="_table_animation"
              title="ルーティーン数" :isWide="isWide"
              :countAll="recurringTasksCountAll"
              :countByFreeMember="recurringTasksCountByFreeMember"
              :countByPaidMember="recurringTasksCountByPaidMember"
              :countAllCreatedBeforeMonth="recurringTasksCountAllCreatedBeforeMonth"
              :countByFreeMemberCreatedBeforeMonth="recurringTasksCountByFreeMemberCreatedBeforeMonth"
              :countByPaidMemberCreatedBeforeMonth="recurringTasksCountByPaidMemberCreatedBeforeMonth"
          ></AdminHomeTable>
          <AdminHomeTable class="_table_animation"
              title="タグ数" :isWide="isWide"
              :countAll="tagsCountAll"
              :countByFreeMember="tagsCountByFreeMember"
              :countByPaidMember="tagsCountByPaidMember"
              :countAllCreatedBeforeMonth="tagsCountAllCreatedBeforeMonth"
              :countByFreeMemberCreatedBeforeMonth="tagsCountByFreeMemberCreatedBeforeMonth"
              :countByPaidMemberCreatedBeforeMonth="tagsCountByPaidMemberCreatedBeforeMonth"
          ></AdminHomeTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#home-box {
  width: 100%;
  padding: 0 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#home-btns {
  display: flex;
  justify-content: space-between;
  max-width: 1000px;
  width: 100%;
  padding: 0 100px;
}
#users-count-box {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
._table_animation {
  opacity: 0;
  animation-name: tableAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-delay: calc(0.1s * sibling-index());
}
@keyframes tableAnimation {
  0% {opacity: 0; transform: translateY(10px);}
  100% {opacity: 1; transform: translateY(0);}
}
@media (max-width: 960px) {
  #home-btns {
    width: 100%;
    padding: 0 10px;
  }
}
@media (max-width: 768px) {
  #home-box {
    padding: 0 10px;
  }
}
@media (max-width: 567px) {
  #users-count-box {
    grid-template-columns: 1fr;
  }
  #home-btns {
    flex-direction: column;
    padding: 0;
  }
  #home-btns a {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
