<script setup lang="ts">
import type {Inquiry} from "~/interfaces";

const props = defineProps({
  inquiry: {
    type: Object as () => Inquiry,
    default: () => ({})
  }
})

const emits = defineEmits(['delete'])

const inquiry = computed(() => props.inquiry)
const createdAtArr = ref<string[]>(inquiry.value ? inquiry.value.createdAt.split('T') : ['2025-01-01', '00:00:00'])
const createdDate = ref<string>(createdAtArr.value[0] !== undefined ? createdAtArr?.value[0].replaceAll('-', '/') : '')
const createdTime = ref<string>(createdAtArr.value[1] !== undefined ? createdAtArr?.value[1].slice(0, 8) : '')
const updatedAtArr = ref<string[]>(inquiry.value ? inquiry.value.updatedAt.split('T') : ['2025-01-01', '00:00:00'])
const updatedDate = ref<string>(updatedAtArr.value[0] !== undefined ? updatedAtArr?.value[0].replaceAll('-', '/') : '')
const updatedTime = ref<string>(updatedAtArr.value[1] !== undefined ? updatedAtArr?.value[1].slice(0, 8) : '')

const toEdit = (e: Event) => {
  const t = e.target as HTMLInputElement
  navigateTo('/admin/inquiry/edit/' + t.dataset.id)
}
const toDelete = (e: Event) => {
  const t = e.target as HTMLInputElement
  const id = Number(t.dataset.id)
  emits('delete', id)
}
</script>

<template>
  <div class="_container">
    <div class="_box">
      <div class="_created_at">
        <span>送信日時　　：</span>
        <time class="mx-3" :datetime="createdDate.split('/')[0] + '-' + createdDate.split('/')[1] + '-' + createdDate.split('/')[2]">
          {{createdDate}}
        </time>
        <time :datetime="createdTime">
          {{createdTime}}
        </time>
      </div>
      <div class="_updated_at">
        <span>最終更新日時：</span>
        <time class="mx-3" :datetime="updatedDate.split('/')[0] + '-' + updatedDate.split('/')[1] + '-' + updatedDate.split('/')[2]">
          {{updatedDate}}
        </time>
        <time :datetime="updatedTime">
          {{updatedTime}}
        </time>
      </div>
      <div class="_row_2">
        <div class="_text">{{inquiry.text}}</div>
        <div class="_btns">
          <button @click="toEdit" :data-id="inquiry.id" class="_to_edit_btn btn _btn_primary btn-sm shadow-sm">編集</button>
          <button @click="toDelete" :data-id="inquiry.id" class="_delete_btn btn btn-danger btn-sm shadow-sm">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
._container {
  min-height: 150px;
}
._box {
  height: 100%;
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  padding: 20px;
}
._created_at {
  padding-left: 10px;
}
._updated_at {
  padding-left: 10px;
  margin-bottom: 5px;
}
._row_2 {
  display: flex;
  min-height: calc(100% - 70px);
  padding: 5px 10px;
  border-top: var(--thin-border);
}
._text {
  min-height: 60px;
  flex-basis: calc(100% - 60px);
  padding-top: 5px;
  padding-right: 10px;
  overflow-y: auto;
}
._btns {
  margin-left: 10px;
  width: 50px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-top: 10px;
}
._to_edit_btn {
  margin-bottom: 10px;
}
@media (max-width: 576px) {
  ._created_at, ._updated_at {
    padding-left: 0;
  }
  ._row_2 {
    flex-direction: column;
    padding: 5px 0;
  }
  ._text {
    padding-right: 0;
  }
  ._btns {
    flex-direction: row;
    justify-content: end;
    width: 100%;
    margin-right: 10px;
  }
  ._to_edit_btn {
    margin-right: 10px;
    margin-bottom: 0;
  }
}
</style>
