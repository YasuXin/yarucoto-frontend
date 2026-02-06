<script setup lang="ts">
import type {Tag} from "~/interfaces";

const props = defineProps({
  tag: {
    type: Object as () => Tag,
    required: true
  },
  isSimpleDisplay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['delete'])

const tag = computed<Tag>(() => props.tag as Tag)

const deleteFadeout = ref(false)

const toEdit = () => {
  navigateTo('/tags/edit/' + tag.value.id)
}
const toDelete = () => {
  deleteFadeout.value = true
  setTimeout(() => {
    emit('delete', tag.value.id)
  }, 200)
}
</script>

<template>
  <div class="_tag_container" :class="useGetTagColor(tag.color)">
    <div class="_tag_box" :class="{'_delete_fadeout' : deleteFadeout}">
      <div class="_tag_row_1">
        <div class="_tag_title_parent d-flex justify-content-start align-items-center">
          <div class="_hole mx-2">●</div>
          <div class="_tag_title"><p class="m-0 p-0">{{tag.name}}</p></div>
        </div>
        <div :class="{'_hidden' : !isSimpleDisplay}" class="_simple_btns d-flex justify-content-around">
          <button class="btn _btn_primary _simple_edit" :data-id="tag.id" @click="toEdit">E</button>
          <button class="btn btn-danger _simple_delete" :data-id="tag.id" @click="toDelete">D</button>
        </div>
      </div>
      <div class="_tag_row_2 my-2 pt-2 d-flex justify-content-between align-items-center" :class="{'_hidden' : props.isSimpleDisplay}">
        <div class="_tag_description">{{tag.description}}</div>
        <div class="_tag_btns d-flex justify-content-around">
          <button @click="toEdit" data-id="tag.id" class="_to_edit_btn btn _btn_primary btn-sm shadow-sm">編集</button>
          <button @click="toDelete" data-id="tag.id" class="_delete_btn btn btn-danger btn-sm shadow-sm">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
._delete_fadeout {
  animation-name: fadeoutDelete;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes fadeoutDelete {
  0% {opacity: 1;}
  100% {opacity: 0;}
}
._tag_container {
  position: relative;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  border-radius: 10px;
  padding: 5px;
  background-color: var(--card-bg-color);
}
._tag_box {
  height: 100%;
  width: 100%;
  padding-top: 0;
}
._tag_row_1 {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
._tag_title_parent {
  width: calc(100% - 80px);
  height: 30px;
}
._tag_title {
  width: auto;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-left: 10px;
}
._tag_title p {
  display: inline-block;
  margin-bottom: 0;
}
._simple_btns {
  width: 80px;
}
._tag_btns {
  width: 120px;
  height: 30px;
  min-width: 120px;
}
._tag_row_2 {
  padding-left: 10px;
  padding-right: 0;
  margin-right: 10px;
  margin-left: 10px;
  border-top: var(--thin-border);
}
._tag_description {
  font-size: 12px;
  overflow-wrap: break-word;
  width: auto;
  margin-right: 5px;
}
._tag_btns {
  flex-direction: column;
  width: 60px;
  min-width: 60px;
  min-height: 70px;
}
</style>
