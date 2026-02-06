<script setup lang="ts">
const emit = defineEmits(['submit', 'close'])
const title = ref('')
const description = ref('')

const valTitle = computed(() => title.value.length > 0 && title.value.length <= 40)
const valDescription = computed(() => description.value.length > 0)

const onClose = () => {
  emit('close')
}

const onSubmit = () => {
  emit('submit', {title: title.value, description: description.value})
  emit('close')
}
</script>

<template>
  <div class="_modal_background">
    <div class="_modal_window">
      <div class="d-flex justify-content-center align-items-center mb-3">
        <h5>新規追加</h5>
      </div>
      <form @submit.prevent="onSubmit" method="POST" class="d-flex justify-content-center align-items-center flex-column">
        <div class="w-100">
          <div class="_label_parent d-flex align-items-end">
            <label for="input-title" class="form-label">タイトル：</label>
          </div>
          <input v-model="title" id="input-title" type="text" class="form-control" placeholder="40文字まで">
        </div>
        <div class="w-100 mt-3">
          <div class="_label_parent d-flex align-items-end">
            <label for="input-description" class="form-label">内容：</label>
          </div>
          <textarea v-model="description" id="input-description" class="form-control" placeholder="文字制限なし"></textarea>
        </div>
        <div class="_btn_parent mt-5">
          <button type="submit" class="btn _btn_primary" :class="{'_disabled' : !valTitle || !valDescription}" :disabled="!valTitle || !valDescription">登録</button>
          <button @click="onClose" class="btn btn-secondary">閉じる</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/modal_container.css';
@import '@/assets/css/form.css';
#input-title {
  width: 100%;
}
#input-description {
  width: 100%;
  height: 200px;
}
._btn_parent {
  width: 200px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}
@media (max-width: 576px) {
  ._btn_parent {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
