<script setup lang="ts">
import type {AdminInquiry} from "~/interfaces";

const props = defineProps({
  inquiry: {
    type: Object as () => AdminInquiry,
    required: true
  }
})
const emit = defineEmits(['show'])

const inquiry = computed(() => props.inquiry)

const createdAt = ref(new Date(inquiry.value.createdAt))
const createdAtDate = computed(() => createdAt.value.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'}))
const updatedAt = ref(new Date(inquiry.value.updatedAt))
const updatedAtDate = computed(() => updatedAt.value.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'}))

const toShow = (e: Event) => {
  e.preventDefault();
  emit('show', inquiry.value.id)
}
</script>

<template>
  <div class="_inquiry_container">
    <div class="_inquiry_box d-flex">
      <div class="_inquiry_id d-flex align-items-center _txt_limit">
        No.{{inquiry.id}}
      </div>
      <div class="_inquiry_column">
        <div class="_inquiry_row d-flex justify-content-between _text_free">
          <div class="_inquiry_left d-flex justify-content-between">
            <div class="_name_email d-flex justify-content-between">
              <div class="_name">
                {{inquiry.name}}
              </div>
              <div class="_email">
                <address>
                  <a :href="'mailto:' + inquiry.email" class="_normal_link">{{inquiry.email}}</a>
                </address>
              </div>
            </div>

            <div class="_date px-3 d-flex justify-content-between">
              <div class="_created_at">
                {{createdAtDate}}
              </div>
              <div class="_updated_at">
                {{updatedAtDate}}
              </div>
            </div>
          </div>
          <div class="d-flex _inquiry_right">
            <div class="_show_btn_parent">
              <a class="_show_btn _inquiry_link" @click="toShow">詳細</a>
            </div>
          </div>
        </div>
        <div class="_inquiry_row _inquiry_row_2 d-flex">
          <div class="_inquiry_text _txt_limit">
            {{inquiry.text}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
._inquiry_container {
  width: 100%;
}
._inquiry_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._inquiry_id {
  width: 100px;
  padding-left: 10px;
}
._inquiry_column {
  width: calc(100% - 100px);
  padding-left: 10px;
}
._name {
  padding-left: 10px;
}
._inquiry_row {
  padding: 10px 0;
  border-bottom: var(--thin-border);
}
._inquiry_left {
  width: calc(100% - 60px);
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
._inquiry_link {
  color: var(--font-color);
}
._inquiry_link:hover {
  cursor: pointer;
}
._inquiry_text {
  width: 90%;
  padding: 0 10px;
  font-size: 0.8rem;
}
._txt_limit {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
._inquiry_row_2 {
  border-bottom: none;
}
#inquiry-title ._inquiry_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
address {
  margin: 0;
}
._name_email {
  width: calc(100% - 200px);
  padding-right: 10px;
}
._date {
  width: 200px;
}
@media (max-width: 960px) {
  ._inquiry_id {
    width: 80px;
  }
  ._inquiry_column {
    width: calc(100% - 80px);
  }
  ._email {
    display: none;
  }
}
@media (max-width: 768px) {
  ._date {
    display: none !important;
  }
  ._name_email {
    width: 100%;
  }
  ._inquiry_id {
    padding:0;
  }
}
@media (max-width: 576px) {
  ._inquiry_box {
    width: 100%;
    margin: 0;
    padding: 0 5px 0 10px;
  }
  ._inquiry_column {
    width: calc(100% - 60px);
  }
  ._inquiry_row {
    padding: 10px;
  }
  ._inquiry_id {
    width: 60px;
  }
  ._inquiry_right {
    width: 50px;
  }
}
</style>
