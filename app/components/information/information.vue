<script setup lang="ts">
import type {Information} from "~/interfaces";

const props = defineProps({
  information: {
    type: Object as () => Information,
    default: () => {return {}}
  },
  selectedId: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['show'])

const info = computed(() => props.information)

const showEvent = () => {
  emits('show', Number(info.value.id), info.value.newInformation)
}
</script>

<template>
  <div class="_info_container" :data-id="info.id">
    <div v-if="info.id !== selectedId" class="_info_box">
      <div class="_info_row d-flex justify-content-between">
        <div class="_info_title" :class="{'_latest_title': info.newInformation}">・
          <a @click="showEvent" class="_show_btn _info_link"
             :data-id="info.id">{{info.title}}</a>
        </div>
        <div class="_info_date"><time :datetime="info.updatedAt">{{info.updatedAt.substring(0,4)}}/{{info.updatedAt.substring(5,7)}}/{{info.updatedAt.substring(8,10)}}</time></div>
      </div>
    </div>
    <transition mode="out-in">
      <div v-if="info.id === selectedId" class="_selected_box">
        <div class="_selected_row_1 d-flex justify-content-between align-items-center">
          <h5 class="_selected_title mb-0 px-3" :class="{'_latest_title': info.newInformation}">{{info.title}}</h5>
          <div class="_selected_date">{{info.updatedAt.substring(0,4)}}/{{info.updatedAt.substring(5,7)}}/{{info.updatedAt.substring(8,10)}}</div>
        </div>
        <div class="_selected_row_2">
          <div class="_selected_description">{{info.description}}</div>
          <div class="text-end my-2">
            <span>編集者：</span>
            <span class="_selected_editor">{{info.editor}}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: all 0.5s;
}
.v-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.v-enter-to, .v-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.v-leave-active {
  position: absolute;
}
._info_container {
  width: 100%;
}
._info_box {
  width: 100%;
  background-color: var(--card-bg-color);
}
._info_row {
  padding: 10px 20px;
  margin: 0 10px;
  border-bottom: var(--middle-border);
}
._info_date {
  border-left: var(--thin-border);
  padding-left: 10px;
}
._info_link {
  color: var(--font-color);
}
._info_link:hover {
  cursor: pointer;
}
._latest_title::after {
  content: "new!";
  background-color: rgb(255,80,80);
  border-radius: 5px;
  padding: 0 5px;
  font-size: 0.7rem;
  color: white;
  margin-left: 10px;
}

._selected_box {
  width: 100%;
  border: var(--thick-border);
  border-radius: 10px;
  padding: 20px 10px 20px 0;
  background-color: var(--card-bg-color);
  box-shadow: var(--task-shadow);
}
._selected_row_1 {
  width: 100%;
  padding: 10px 20px;
}
._selected_date {
  border-left: var(--thin-border);
  padding-left: 10px;
}
._selected_row_2 {
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 10px 15px;
  border-top: var(--middle-border);
}

@media (max-width: 450px) {
  ._info_row {
    flex-direction: column;
    align-items: center!important;
  }
  ._info_date {
    margin-top: 10px;
    border: none;
  }

  ._selected_row_1, ._info_row {
    flex-direction: column;
    align-items: center!important;
  }
  ._selected_date, ._info_date {
    margin-top: 10px;
    border: none;
  }
}
</style>
