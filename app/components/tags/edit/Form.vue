<script setup lang="ts">
import type {Tag} from "~/interfaces";
import {useMakeStrFromTimestamp} from "~/composables/useMakeStrFromTimestamp";

const props = defineProps({
  tag: {
    type: Object as () => Tag,
  }
})
const emit = defineEmits(['submit'])

const tag = computed<Tag>(() => props.tag as Tag)
watch(tag, () => {
  name.value = tag.value.name
  color.value = tag.value.color
  description.value = tag.value.description
})

const createdAt = computed(() => useMakeStrFromTimestamp(tag.value.createdAt))
const updatedAt = computed(() => useMakeStrFromTimestamp(tag.value.updatedAt))

const name = ref<string>('')
const color = ref<number>(1)
const description = ref<string>('')

const alertTitle = ref<string>('')
const alertColor = ref<string>('')
const alertDescription = ref<string>('')

const submitDisabled = ref<boolean>(false)

const nameOk = ref<boolean>(true)
const colorOk = ref<boolean>(true)
const descriptionOk = ref<boolean>(true)

const valForm = () => {
  submitDisabled.value = !(nameOk.value && colorOk.value && descriptionOk.value)
}
const nameEvent = () => {
  if (name.value.length <= 0) {
    nameOk.value = false
    alertTitle.value = 'タイトルを入力してください'
  } else if (name.value.length > 16) {
    nameOk.value = false
    alertTitle.value = 'タイトルは16文字までです'
  } else {
    nameOk.value = true;
    alertTitle.value = "";
  }
  valForm()
}
const colorEvent = () => {
  if (color.value > 8 || color.value <= 0) {
    alertColor.value = '色の値が不正です'
    colorOk.value = false
  } else {
    alertColor.value = ''
    colorOk.value = true
  }
}
const descriptionEvent = () => {
  if (description.value.length <= 100) {
    descriptionOk.value = true;
    alertDescription.value = "";
  } else {
    descriptionOk.value = false
    alertDescription.value = '説明は100文字以内にしてください'
  }
  valForm()
}

const params :{
  id: number,
  name: string,
  color: number,
  description: string,
} = {
  id: tag.value.id,
  name: name.value,
  color: color.value,
  description: description.value,
}
const onSubmit = () => {
  params.id = tag.value.id
  params.name = name.value
  params.color = color.value
  params.description = description.value
  emit('submit', params)
}
onMounted(() => {
  name.value = tag.value.name
  color.value = tag.value.color
  description.value = tag.value.description
})
</script>

<template>
  <div class="_created_updated">
    <div class="_created">
      <div>投稿日：</div>
      <div>{{createdAt}}</div>
    </div>
    <div class="_updated">
      <div>更新日：</div>
      <div>{{updatedAt}}</div>
    </div>
  </div>
  <form @submit.prevent="onSubmit" id="form" class="d-flex justify-content-start align-items-center flex-column">
    <div id="name-color-box" class="_row">
      <div id="name-box">
        <label for="name" class="form-label">タイトル：<small style="color:var(--bs-red)">※必須</small></label>
        <input @input="nameEvent" v-model="name" type="text" id="name" name="name" class="form-control shadow-sm" placeholder="16文字まで" autofocus>
        <div id="alert-name" class="_alert">{{alertTitle}}</div>
      </div>
      <div id="color-box" class="d-flex flex-column form-check-label">
        <label for="color" class="form-label">色：<small style="color:var(--bs-red)">※必須</small></label>
        <div id="color-radio">
          <div id="color-default" class="_radio_item">
            <label for="default"><span class="_f_default">デフォルト</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="default" class="_r_default _r_border form-check-input shadow-sm" value="1" checked>
          </div>
          <div id="color-red" class="_radio_item">
            <label for="red"><span class="_f_red">赤</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="red" class="_r_red _r_border form-check-input shadow-sm" value="2">
          </div>
          <div id="color-orange" class="_radio_item">
            <label for="orange"><span class="_f_orange">橙</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="orange" class="_r_orange _r_border form-check-input shadow-sm" value="3">
          </div>
          <div id="color-yellow" class="_radio_item">
            <label for="yellow"><span class="_f_yellow">黄</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="yellow" class="_r_yellow _r_border form-check-input shadow-sm" value="4">
          </div>
          <div id="color-green" class="_radio_item">
            <label for="green"><span class="_f_green">緑</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="green" class="_r_green _r_border form-check-input shadow-sm" value="5">
          </div>
          <div id="color-blue" class="_radio_item">
            <label for="blue"><span class="_f_blue">青</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="blue" class="_r_blue _r_border form-check-input shadow-sm" value="6">
          </div>
          <div id="color-indigo" class="_radio_item">
            <label for="indigo"><span class="_f_indigo">藍</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="indigo" class="_r_indigo _r_border form-check-input shadow-sm" value="7">
          </div>
          <div id="color-purple" class="_radio_item">
            <label for="purple"><span class="_f_purple">紫</span>：</label>
            <input type="radio" @change="colorEvent" v-model="color" name="color" id="purple" class="_r_purple _r_border form-check-input shadow-sm" value="8">
          </div>
        </div>
        <div id="alert-color" class="_alert">{{alertColor}}</div>
      </div>
    </div>

    <div id="description-box" class="_row">
      <label for="description" class="form-label">説明：</label>
      <textarea @input="descriptionEvent" v-model="description" id="description" name="description" class="form-control shadow-sm" placeholder="100文字まで"></textarea>
      <div id="alert-description" class="_alert">{{alertDescription}}</div>
    </div>
    <button type="submit" id="submitBtn" class="btn _btn_primary shadow-sm" :class="{'_disabled' : submitDisabled}" :disabled="submitDisabled">更新</button>
  </form>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
@import "~/assets/css/tag_radio_color.css";
@import "~/assets/css/form.css";
#name-color-box {
  display: flex;
  justify-content: space-between;
}
#name-box {
  width: 45%;
}
#color-box {
  width: 50%;
}
#color-radio {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0 0 30px;
}
._radio_item {
  width: 75px;
  padding: 0 10px 10px 0;
}
#color-default {
  width: 150px;
}
input[type="radio"] {
  margin-left: 0;
}
#color-default input[type="radio"] {
  margin-left: 10px;
}
@media (max-width: 578px) {
  #name-color-box {
    flex-direction: column;
  }
  #name-box {
    width: 100%;
  }
  #color-box {
    width: 100%;
  }
}
</style>
