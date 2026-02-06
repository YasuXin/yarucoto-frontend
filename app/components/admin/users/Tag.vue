<script setup lang="ts">
import type {AdminTag, AdminUser} from "~/interfaces";
import {useColors} from "~/composables/useColors";

const props = defineProps({
  tag: {
    type: Object as () => AdminTag,
    required: true
  }
})

const colors = ref<string[]>(useColors())

const emit = defineEmits(['show'])
const tag = computed(() => props.tag)

const toShow = () => {
  emit('show', tag.value.id)
}
</script>

<template>
  <div class="_tag_container">
    <div class="_tag_box d-flex">
      <div class="_tag_id d-flex align-items-center _txt_limit">
        <span class="_id_no">No.</span>{{tag.id}}
      </div>
      <div class="_tag_column">
        <div class="_tag_row d-flex justify-content-between _text_free">
          <div class="_tag_left d-flex">
            <div class="_tag_name d-flex">{{tag.name}}</div>
            <div class="_tag_color d-flex justify-content-center">
              <div class="_tag d-flex justify-content-center w-100" :class="useGetTagColor(tag.color)">
                <div>{{colors[tag.color-1]}}</div>
              </div>
            </div>
          </div>
          <div class="d-flex _tag_right">
            <div class="_show_btn_parent">
              <a @click="toShow" class="_show_btn _tag_link">詳細</a>
            </div>
          </div>
        </div>
        <div class="_tag_row _tag_row_2 d-flex">
          <div class="_tag_description _txt_limit">
            {{tag.description ? tag.description : '-'}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
._tag_container {
  width: 100%;
}
._tag_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._tag_id {
  width: 100px;
  padding-left: 10px;
}
._tag_column {
  width: calc(100% - 100px);
  padding-left: 10px;
}
._tag_row {
  padding: 10px 0;
  border-bottom: var(--thin-border);
}
._tag_left {
  width: calc(100% - 60px);
}
._tag_name {
  width: calc(100% - 120px);
  margin-left: 10px;
}
._tag_color {
  width: 110px;
  padding: 0 5px;
}
._tag {
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.8rem;
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
._tag_link {
  color: var(--font-color);
}
._tag_link:hover {
  cursor: pointer;
}
._tag_description {
  width: 90%;
  padding: 0 10px;
  font-size: 0.8rem;
}
._txt_limit {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
._tag_row_2 {
  border-bottom: none;
}
#tags-title ._tag_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
@media (max-width: 960px) {
  ._tag_id {
    width: 80px;
  }
  ._tag_column {
    width: calc(100% - 80px);
  }
}
@media (max-width: 768px) {
  ._tag_id {
    padding:0;
  }
  ._tag_name {
    width: calc(100% - 80px);
  }
}
@media (max-width: 576px) {
  ._tag_box {
    margin: 0;
    padding: 0 5px 0 10px;
    width: 100%;
  }
  ._id_no {
    display: none;
  }
  ._tag_row {
    padding: 10px;
  }
  ._tag_id {
    width: 60px;
    justify-content: center;
  }
  ._tag_column {
    width: calc(100% - 60px);
  }
  ._tag_left {
    width: calc(100% - 50px);
  }
  ._tag_name {
    margin: 0;
    width: calc(100% - 60px);
  }
  ._tag_color {
    width: 60px;
  }
  ._show_btn_parent {
    width: 50px;
  }
  ._tag_description {
    padding: 0;
    width: 100%;
  }
}
</style>
