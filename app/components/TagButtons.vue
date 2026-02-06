<script setup lang="ts">
import type {Tag} from "~/interfaces";

const props = defineProps({
  tags: {
    type: Array as () => Tag[],
    default: () => [],
    required: true
  },
  selectedTagId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['tagSelect'])

const tags = computed(() => props.tags)
const selectedTagId = computed(() => props.selectedTagId)

const q = (selector: string) => document.querySelector(selector) as HTMLElement
const tagSelectEvent = (e: Event) => {
  const tagsEl = q('#tag-btns-parent')
  for (const tag of tagsEl.children) {
    const tagParent = tag as HTMLElement
    tagParent.classList.remove('_tag_btn_wrapper_selected')
    const tagBtn = tagParent.children[0] as HTMLElement
    if (tagBtn) {
      tagBtn.classList.remove('_tag_btn_selected')
    }
  }
  const t = e.target as HTMLElement
  if (selectedTagId.value !== Number(t.dataset.id)) {
    const parentEl = t.parentElement as HTMLElement
    parentEl.classList.add('_tag_btn_wrapper_selected')
    t.classList.add('_tag_btn_selected')
  } else {
  }
  emit('tagSelect', parseInt((e.target as HTMLButtonElement).dataset.id!))
}
</script>

<template>
  <div v-for="tag in tags" :data-id="tag.id" :key="tag.id" class="_tag_btn_wrapper shadow-sm" :class="{'_tag_btn_wrapper_selected' : selectedTagId === tag.id}">
    <button @click="tagSelectEvent" :data-id="tag.id" :class="useGetTagColor(tag.color), {'_tag_btn_selected' : selectedTagId === tag.id}" class="_tag_btn shadow-sm">{{tag.name}}</button>
  </div>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
._tag_btn_wrapper {
  margin: 0 3px 3px;
  border-radius: 5px;
  font-size: 0.8rem!important;
  cursor: pointer;
}

._tag_btn_wrapper:hover {
  animation-name: tagBtnWrapperAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes tagBtnWrapperAnimation {
  0% {}
  100% {background-color: rgba(0, 0, 0, 0.5);}
}

._tag_btn {
  padding: 2px 5px;
  border-radius: 5px;
}

._tag_btn_wrapper_selected {
  animation: none;
  background-color: var(--tag-btn-selected-bg-color);
}

._tag_btn_selected {
  box-shadow: var(--task-inset-shadow) !important;
  -webkit-box-shadow: var(--task-inset-shadow) !important;
  border-color: var(--bg-default) !important;
  color: var(--disabled-form-font-color)!important;
}

</style>
