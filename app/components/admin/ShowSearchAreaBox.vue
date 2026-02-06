<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean
  }
})
const emit = defineEmits(['showSearch'])

const showSearchEvent = () => {
  emit('showSearch')
}
</script>

<template>
  <div id="show-search-area" class="d-flex justify-content-center mb-4">
    <div id="show-search-area-box" class="d-flex">
      <div id="show-search-area-text">{{show ? '検索欄を閉じる' : '検索欄を表示する'}}</div>
      <div>
        <button @click="showSearchEvent" id="showSearchArea" :class="{'_is_show': show}">▼</button>
      </div>
    </div>
  </div>
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
@media (max-width: 1400px) {
  #show-search-area{
    padding: 0 20px;
  }
}
@media (max-width: 768px) {
  #show-search-area{
    padding: 0 10px;
  }
}
</style>
