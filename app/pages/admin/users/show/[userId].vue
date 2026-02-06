<script setup lang="ts">
import type {AdminUser, User} from "~/interfaces";

definePageMeta({
  layout: "admin",
  middleware: "admin"
})

useHead({
  title: "Yarucoto | Admin | Users | Show",
})

const token = useCookie('__yarucoto')
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const userId = useRoute().params.userId

const admin = useState<User | null>('auth-user')

const getUserUrl = baseUrl + '/admin/users/get/show/' + userId
const deleteUserUrl = baseUrl + '/admin/users/delete'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const user = ref<AdminUser>()
const taskCount = ref(0)
const routineCount = ref(0)
const goalCount = ref(0)
const evaluationCount = ref(0)
const tagCount = ref(0)

const createdAt = computed(() => useMakeStrFromTimestamp(user?.value?.createdAt ?? '0000-00-00 00:00:00.000000'))
const updatedAt = computed(() => useMakeStrFromTimestamp(user?.value?.updatedAt ?? '0000-00-00 00:00:00.000000'))

const getUser = async () => {
  try {
    const res = await $fetch(getUserUrl, {
      method: 'GET',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: getUserUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    user.value = res.user
    taskCount.value = res.taskCount
    routineCount.value = res.recurringTaskCount
    goalCount.value = res.goalCount
    evaluationCount.value = res.evaluationCount
    tagCount.value = res.tagCount
  } catch (error) {
    useErrorEvent(error)
  }
}

const deleteResult = ref('')
const deleteUser = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(deleteUserUrl, {
      method: 'DELETE',
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      body: {id: userId},
      key: deleteUserUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = "会員を削除しました"
      setTimeout(() => {
        useRouter().back()
      }, 3000)
    } else if (deleteResult.value === 'your-own') {
      modalMessage.value = "指定したIDの会員はあなた自身です。削除できません。"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else if (deleteResult.value === 'no-user') {
      modalMessage.value = "指定した会員が見つかりませんでした"
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
const toTasks = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/tasks/' + user?.value?.id)
}
const toRoutines = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/routines/' + user?.value?.id)
}
const toTags = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/tags/' + user?.value?.id)
}
const toGoals = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/goals/' + user?.value?.id)
}
const toEvaluations = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/evaluations/' + user?.value?.id)
}
const toInquiries = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/inquiries/' + user?.value?.id)
}
const deleteModalShow = ref(false)
const showModal = () => {
  deleteModalShow.value = true
}
const onDelete = async () => {
  deleteModalShow.value = false
  await deleteUser()
}
const returnEvent = () => {
  deleteModalShow.value = false
}
const toEdit = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/admin-user/edit/check-password')
}
const toChangePassword = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/admin-user/change-password/check-password')
}
await getUser()
</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>{{user?.username}}さんの会員情報</h3>
    </div>
    <nav class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/users/list?page=1" class="_normal_link mb-3">会員一覧</NuxtLink>
    </nav>
    <div id="user-parent">
      <div id="user" class="mt-4 mb-5">
        <div id="user-container" class="d-flex justify-content-center">
          <div id="user-box" class="d-flex flex-column justify-content-center align-items-center">
            <div id="inner-box">
              <div id="row1" class="_row">
                <div class="_left_item">氏名：</div>
                <div class="_right_item">{{user?.username}}</div>
              </div>
              <div id="row2" class="_row">
                <div class="_left_item">ニックネーム：</div>
                <div class="_right_item">{{user?.nickname}}</div>
              </div>
              <div id="row3" class="_row">
                <div class="_left_item">メールアドレス：</div>
                <div class="_right_item">{{user?.email}}</div>
              </div>
              <div id="row4" class="_row">
                <div class="_left_item">会員の種類：</div>
                <div v-if="user?.roleId == 1" class="_right_item _text_free">無料会員</div>
                <div v-if="user?.roleId == 2" class="_right_item _text_paid">有料会員</div>
                <div v-if="user?.roleId == 3" class="_right_item _text_admin">管理者</div>
              </div>
              <div id="row5" class="_row">
                <div class="_left_item">郵便番号：</div>
                <div class="_right_item" :class="{'_text_gray' : !user?.postalCode}">{{user?.postalCode === null || user?.postalCode === '' ? '設定されていません' : user?.postalCode}}
                </div>
              </div>
              <div id="row6" class="_row">
                <div class="_left_item">住所：</div>
                <div class="_right_item" :class="{'_text_gray' : !user?.address}">{{user?.address === null || user?.address === '' ? '設定されていません' : user?.address}}</div>
              </div>
              <div id="row7" class="_row">
                <div class="_left_item">電話番号：</div>
                <div class="_right_item" :class="{'_text_gray' : !user?.phoneNumber}">{{user?.phoneNumber === null || user?.phoneNumber === '' ? '設定されていません' : user?.phoneNumber}}</div>
              </div>
              <div id="row8" class="_row">
                <div class="_left_item">作成日時：</div>
                <div class="_right_item">{{createdAt}}</div>
              </div>
              <div id="row9" class="_row">
                <div class="_left_item">更新日時：</div>
                <div class="_right_item">{{updatedAt}}</div>
              </div>
              <div id="row10" class="_row">
                <div class="_left_item">タスク数：</div>
                <div class="_right_item">{{taskCount}}</div>
              </div>
              <div id="row11" class="_row">
                <div class="_left_item">ルーティーン数：</div>
                <div class="_right_item">{{routineCount}}</div>
              </div>
              <div id="row12" class="_row">
                <div class="_left_item">タグ数：</div>
                <div class="_right_item">{{tagCount}}</div>
              </div>
              <div id="row13" class="_row">
                <div class="_left_item">月ごとの目標数：</div>
                <div class="_right_item">{{goalCount}}</div>
              </div>
              <div id="row14" class="_row">
                <div class="_left_item">月ごとの評価数：</div>
                <div class="_right_item">{{evaluationCount}}</div>
              </div>
            </div>
          </div>
        </div>
        <div id="btns-parent">
          <div id="btns" class="mt-5">
            <template v-if="admin?.role === 'ROLE_ADMIN' && admin?.id === user?.id">
              <div class="_btn">
                <NuxtLink @click="toEdit" class="btn _btn_primary">編集</NuxtLink>
              </div>
              <div class="_btn">
                <NuxtLink @click="toChangePassword" class="btn _btn_primary">パスワード変更</NuxtLink>
              </div>
            </template>
            <div class="_btn">
              <NuxtLink @click="toTasks" class="btn btn-secondary">タスク一覧</NuxtLink>
            </div>
            <div class="_btn">
              <NuxtLink @click="toRoutines" class="btn btn-secondary">ルーティーン一覧</NuxtLink>
            </div>
            <div class="_btn">
              <NuxtLink @click="toTags" class="btn btn-secondary">タグ一覧</NuxtLink>
            </div>
            <div class="_btn">
              <NuxtLink @click="toGoals" class="btn btn-secondary">月ごとの目標一覧</NuxtLink>
            </div>
            <div class="_btn">
              <NuxtLink @click="toEvaluations" class="btn btn-secondary">月ごとの評価一覧</NuxtLink>
            </div>
            <div class="_btn">
              <NuxtLink @click="toInquiries" class="btn btn-secondary">お問合せ一覧</NuxtLink>
            </div>
            <div class="_btn">
              <a @click="showModal" class="btn btn-danger">削除</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <DeleteModal v-show="deleteModalShow" title="本当に削除しますか？" message="削除した場合、二度と戻せません" @delete="onDelete" @return="returnEvent"></DeleteModal>
    <Modal :modalShow="modalShow" :message="modalMessage"></Modal>
  </teleport>
</template>

<style scoped>
#user-box {
  border: var(--thick-border);
  border-radius: 10px;
  width: 600px;
  padding: 30px;
  box-shadow: var(--task-shadow);
}
#row-role ._text_paid {
  color: white;
  font-size: 1.2rem;
}
._row {
  display: flex;
  margin: 10px 0;
}
._left_item {
  width: 200px;
  margin-right: 20px;
  text-align: right;
}
._right_item {
  width: calc(100% - 220px);
}
#btns-parent {
  display: flex;
  justify-content: center;
  width: 100%;
}
#btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 600px;
  padding: 0 20px;
}
._btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}
._btn a {
  width: 200px;
  display: inline-block;
}
._text_admin {
  color: var(--font-gray);
}
._text_paid {
  color: goldenrod;
}
._text_gray {
  color: var(--font-gray);
}
@media (max-width: 576px) {
  #user-box {
    width: 100%;
    padding: 0 10px;
    border: none;
    box-shadow: none;
  }
  #inner-box {
    border-top: var(--middle-border);
    border-bottom: var(--middle-border);
  }
  ._left_item {
    width: 45%;
    margin-right: 10px;
  }
  ._right_item {
    width: 55%;
    word-wrap: break-word;
  }
  #btns {
    grid-template-columns: 1fr;
  }
  ._btn {
    width: 100%;
  }
  ._btn a {
    width: 100%;
  }
}
</style>
