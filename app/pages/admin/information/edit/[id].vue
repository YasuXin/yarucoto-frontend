<script setup lang="ts">
import type {Information} from "~/interfaces";

definePageMeta({
  middleware: "admin",
  layout: "admin"
})
useHead({
  title: "Yarucoto | Admin | Information | Edit"
})

const token = useCookie('__yarucoto')

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase
const id = useRoute().params.id as string

const getInformationUrl = baseUrl + '/admin/information/get/edit/' + id
const updateInformationUrl = baseUrl + '/admin/information/update'
const deleteInformationUrl = baseUrl + '/admin/information/delete'

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const title = ref('')
const description = ref('')

const titleOk = ref(true)
const descriptionOk = ref(true)

const submitDisabled = ref(false)

const valForm = () => {
  submitDisabled.value = !(titleOk.value && descriptionOk.value)
}
const valTitle = () => {
  titleOk.value = title.value.length > 0 && title.value.length <= 40
  valForm()
}
const valDescription = () => {
  descriptionOk.value = description.value.length > 0
  valForm()
}

const createdAt = ref('')
watch(createdAt, () => {
  const date = new Date(createdAt.value)
  createdAtTime.value = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  createdAtDate.value = date.toLocaleDateString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
})
const updatedAt = ref('')
watch(updatedAt, () => {
  const date = new Date(updatedAt.value)
  updatedAtTime.value = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  updatedAtDate.value = date.toLocaleDateString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
})
const createdAtDate = ref('')
const updatedAtDate = ref('')
const createdAtTime = ref('')
const updatedAtTime = ref('')

const information = ref<Information | null>()

const getInformation = async () => {
  try {
    const res = await $fetch(getInformationUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      key: getInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    title.value = res.title
    description.value = res.description
    information.value = res
    createdAt.value = res.createdAt
    updatedAt.value = res.updatedAt
  } catch (error) {
    useErrorEvent(error)
  }
}

const editResult = ref('')
const onSubmit= async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  try {
    const res = await $fetch(updateInformationUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token.value
      },
      body: {
        id: Number(id) ?? 0,
        title: title.value,
        description: description.value
      },
      key: updateInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    editResult.value = res
    if (editResult.value === 'failed') {
      modalShow.value = true
      modalMessage.value = '送信内容に誤りがあります'
      setTimeout(() => {
        modalShow.value = false
      }, 1000)
    } else if (editResult.value === 'no-information') {
      modalMessage.value = "指定したお知らせが見つかりませんでした"
      setTimeout(() => {
        modalShow.value = false
      }, 3000)
    } else if (editResult.value === 'success') {
      modalMessage.value = 'お知らせを編集しました'
      setTimeout(() => {
        navigateTo('/admin/information/list')
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}

const isDeleteModalShow = ref(false)
const showDeleteModal = () => {
  isDeleteModalShow.value = true
}
const onDelete = async () => {
  isDeleteModalShow.value = false
  await deleteInformation()
}
const returnEvent = () => {
  isDeleteModalShow.value = false
}

const deleteResult = ref('')
const deleteInformation = async () => {
  modalShow.value = true
  modalMessage.value = '送信中...'
  const params: { id: number } = {id: Number(id) ?? 0}
  try {
    const res = await $fetch(deleteInformationUrl, {
      method: 'DELETE',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: deleteInformationUrl
    }) as any
    if (res === 'illegal') navigateTo('/admin/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success') {
      modalMessage.value = "お知らせを削除しました"
      setTimeout(() => {
        navigateTo('/admin/information/list')
      }, 1000)
    } else if (deleteResult.value === 'no-information') {
      modalMessage.value = "指定したお知らせが見つかりませんでした"
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

await getInformation()

</script>

<template>
  <div id="main-child">
    <div id="main-title" class="d-flex justify-content-center">
      <h3>新規お知らせ登録</h3>
    </div>
    <div class="d-flex flex-wrap justify-content-center my-3">
      <NuxtLink to="/admin/home" class="_normal_link mb-3">ホーム</NuxtLink>
      <span class="mx-2">></span>
      <NuxtLink to="/admin/information/list" class="_normal_link mb-3">お知らせ一覧</NuxtLink>
    </div>
    <div class="_information_info">
      <div class="d-flex my-2">
        <div>編集者：</div>
        <div>{{information?.editor ?? '不明'}}</div>
      </div>
      <div class="d-flex my-2">
        <div>投稿日：</div>
        <div>
          {{createdAtDate}}　{{createdAtTime}}
        </div>
      </div>
      <div class="d-flex my-2">
        <div>更新日：</div>
        <div>{{updatedAtDate}}　{{updatedAtTime}}</div>
      </div>
    </div>
    <form @submit.prevent="onSubmit" method="POST" class="d-flex justify-content-center align-items-center flex-column">
      <div class="w-100">
        <div class="_label_parent d-flex align-items-end">
          <label for="input-title" class="form-label">タイトル：</label>
        </div>
        <input v-model="title" @input="valTitle" id="input-title" type="text" class="form-control" placeholder="40文字まで">
      </div>
      <div class="w-100 mt-3">
        <div class="_label_parent d-flex align-items-end">
          <label for="input-description" class="form-label">内容：</label>
        </div>
        <textarea v-model="description" @input="valDescription" id="input-description" class="form-control" placeholder="文字制限なし"></textarea>
      </div>
      <div class="_btn_parent d-flex justify-content-center mt-5">
        <button type="submit" class="_submit_btn btn _btn_primary" :class="{'_disabled' : submitDisabled}" :disabled="submitDisabled">登録</button>
      </div>
    </form>
    <button @click="showDeleteModal" class="_delete_btn btn btn-danger my-5">削除</button>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
    <DeleteModal v-if="isDeleteModalShow" @delete="onDelete" @return="returnEvent" title="削除します" message="削除すると元に戻せませんがよろしいですか？"></DeleteModal>
  </teleport>
</template>

<style scoped>
@import '~/assets/css/form.css';
#input-title {
  width: 100%;
}
#input-description {
  width: 100%;
  height: 200px;
}
._btn_parent {
  width: 200px;
}
form {
  width: 70%;
}
._information_info {
  width: 70%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
@media (max-width: 768px) {
  form {
    width: 90%;
  }
}
@media (max-width: 576px) {
  ._information_info {
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  ._btn_parent {
    width: 100%;
  }
  ._submit_btn {
    width: 100% !important;
  }
  ._delete_btn {
    width: 90% !important;
  }
}
</style>
