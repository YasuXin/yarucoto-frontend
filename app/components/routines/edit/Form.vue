<script setup lang="ts">
import type {RecurringTask, Tag} from "~/interfaces";
import {useMakeStrFromTimestamp} from "~/composables/useMakeStrFromTimestamp";

const props = defineProps({
  task: {
    type: Object as () => RecurringTask,
    default: {}
  },
  tagsList: {
    type: Array as () => Tag[],
    default: []
  }
})
const emit = defineEmits(['submit'])

const task = computed<RecurringTask>(() => props.task as RecurringTask)
watch(task, () => {
  setInput()
})

const tagsList = computed<Tag[]>(() => props.tagsList as Tag[])
/*watch(tagsList, () => {
  setInput()
})*/

const createdAt = computed(() => useMakeStrFromTimestamp(task.value.createdAt))
const updatedAt = computed(() => useMakeStrFromTimestamp(task.value.updatedAt))

const title = ref(task.value.title)
const tags = reactive({
  tag1: {
    id: task.value.tag1 ? task.value.tag1.id : 0,
    color: task.value.tag1 ? task.value.tag1.color : 0
  },
  tag2: {
    id: task.value.tag2 ? task.value.tag2.id : 0,
    color: task.value.tag2 ? task.value.tag2.color : 0
  },
  tag3: {
    id: task.value.tag3 ? task.value.tag3.id : 0,
    color: task.value.tag3 ? task.value.tag3.color : 0
  }
})

const dueStart = reactive({
  hour: task.value.dueStartTime ? task.value.dueStartTime.split(':')[0] as string : '-',
  minute: task.value.dueStartTime ? task.value.dueStartTime.split(':')[1] as string : '00'
})
const dueEnd = reactive({
  hour: task.value.dueEndTime ? task.value.dueEndTime.split(':')[0] as string : '-',
  minute: task.value.dueEndTime ? task.value.dueEndTime.split(':')[1] as string : '45'
})
const overDateCheck = ref(false)
const description = ref(task.value.description ? task.value.description : "")
const weeks = ref<string[]>([])

const alertTitle = ref("")
const alertTag = ref("")
const alertTime = ref("")
const alertDescription = ref("")

const tag2Disabled = ref(!task.value.tag1)
const tag3Disabled = ref(!task.value.tag2)

const dueStartMinuteDisabled = ref(!task.value.dueStartTime)
const dueEndHourDisabled = ref(!task.value.dueStartTime)
const dueEndMinuteDisabled = ref(!task.value.dueEndTime)

const submitDisabled = ref(false)

const titleOk = ref(true)
const dueTimeOk = ref(true)
const descriptionOk = ref(true)
const weekOk = ref(true)

const q = (selector: string) => document.querySelector(selector) as HTMLElement

const setInput =  async() => {
  if (!(task.value && tagsList.value)) return
  title.value = task.value.title
  if (task.value.isSunday) {
    weeks.value.push('sunday')
    q('#sunday').setAttribute('checked', 'checked')
  }
  if (task.value.isMonday) {
    weeks.value.push('monday')
    q('#monday').setAttribute('checked', 'checked')
  }
  if (task.value.isTuesday) {
    weeks.value.push('tuesday')
    q('#tuesday').setAttribute('checked', 'checked')
  }
  if (task.value.isWednesday) {
    weeks.value.push('wednesday')
    q('#wednesday').setAttribute('checked', 'checked')
  }
  if (task.value.isThursday) {
    weeks.value.push('thursday')
    q('#thursday').setAttribute('checked', 'checked')
  }
  if (task.value.isFriday) {
    weeks.value.push('friday')
    q('#friday').setAttribute('checked', 'checked')
  }
  if (task.value.isSaturday) {
    weeks.value.push('saturday')
    q('#saturday').setAttribute('checked', 'checked')
  }
  dueStart.hour = task.value.dueStartTime ? task.value.dueStartTime.split(':')[0] as string : '-'
  dueStart.minute = task.value.dueStartTime ? task.value.dueStartTime.split(':')[1] as string : '00'
  dueEnd.hour = task.value.dueEndTime ? task.value.dueEndTime.split(':')[0] as string : '-'
  dueEnd.minute = task.value.dueEndTime ? task.value.dueEndTime.split(':')[1] as string : '45'
  description.value = task.value.description ? task.value.description : ""
  if (dueStart.hour !== '-' && dueEnd.hour !== '-') {
    const dueStartHour = parseInt(dueStart.hour)
    const dueStartMinute = parseInt(dueStart.minute)
    const dueEndHour = parseInt(dueEnd.hour)
    const dueEndMinute = parseInt(dueEnd.minute)
    overDateCheck.value = dueStartHour > dueEndHour || (dueStartHour === dueEndHour && dueStartMinute > dueEndMinute)
    dueStartMinuteDisabled.value = false
    dueEndHourDisabled.value = false
    dueEndMinuteDisabled.value = false
  }
  if (dueStart.hour !== '-' && dueEnd.hour === '-') {
    dueStartMinuteDisabled.value = false
    dueEndHourDisabled.value = false
  }
  tags.tag1.id = task.value.tag1 ? task.value.tag1.id : 0
  tags.tag1.color = task.value.tag1 ? task.value.tag1.color : 0
  tag2Disabled.value = !task.value.tag1
  tags.tag2.id = task.value.tag2 ? task.value.tag2.id : 0
  tags.tag2.color = task.value.tag2 ? task.value.tag2.color : 0
  tag3Disabled.value = !task.value.tag2
  tags.tag3.id = task.value.tag3 ? task.value.tag3.id : 0
  tags.tag3.color = task.value.tag3 ? task.value.tag3.color : 0
  await nextTick()
  tagEvent()
}

const valForm = () => {
  submitDisabled.value = !(titleOk.value && dueTimeOk.value && descriptionOk.value && weekOk.value)
}
const titleEvent = () => {
  if (title.value.length <= 0) {
    titleOk.value = false
    alertTitle.value = 'タイトルを入力してください'
  } else if (title.value.length > 16) {
    titleOk.value = false
    alertTitle.value = 'タイトルは16文字までです'
  } else {
    titleOk.value = true;
    alertTitle.value = "";
  }

  valForm()
}
const tag1Event = (e?: Event) => {
  const tag1El = e?.target as HTMLSelectElement
  if (tag1El === undefined || tag1El.options === undefined) return
  for (let i = 0; i < tag1El.options.length; i++) {
    const tag1OptionEl = tag1El.options[i] as HTMLOptionElement
    if (tag1OptionEl.selected) {
      tags.tag1.id = Number(tag1OptionEl.dataset.id)
      tags.tag1.color = Number(tag1OptionEl.dataset.color)
      break;
    }
  }
  tagEvent()
}
const tag2Event = (e?: Event) => {
  const tag2El = e?.target as HTMLSelectElement
  if (tag2El === undefined || tag2El.options === undefined) return
  for (let i = 0; i < tag2El.options.length; i++) {
    const tag2OptionEl = tag2El.options[i] as HTMLOptionElement
    if (tag2OptionEl.selected) {
      tags.tag2.id = Number(tag2OptionEl.dataset.id)
      tags.tag2.color = Number(tag2OptionEl.dataset.color)
      break
    }
  }
  tagEvent()
}
const tag3Event = (e?: Event) => {
  const tag3El = e?.target as HTMLSelectElement
  if (tag3El === undefined || tag3El.options === undefined) return
  for (let i = 0; i < tag3El.options.length; i++) {
    const tag3OptionEl = tag3El.options[i] as HTMLOptionElement
    if (tag3OptionEl.selected) {
      tags.tag3.id = Number(tag3OptionEl.dataset.id)
      tags.tag3.color = Number(tag3OptionEl.dataset.color)
      break
    }
  }
  tagEvent()
}
const tagEvent = () => {
  if (tags.tag1.id == 0) {
    tags.tag2.id = 0;
    tags.tag2.color = 0
    tags.tag3.id = 0
    tags.tag3.color = 0
    tag2Disabled.value = true;
    tag3Disabled.value = true;
  } else if (tags.tag1.id !== 0 && tags.tag2.id == 0) {
    tags.tag3.id = 0;
    tags.tag3.color = 0
    tag2Disabled.value = false
    tag3Disabled.value = true;
  } else if (tags.tag1.id !== 0 && tags.tag2.id !== 0 && tags.tag3.id == 0) {
    tag3Disabled.value = false;
  }
  const tag1El = q('#tag1') as HTMLSelectElement
  const tag2El = q('#tag2') as HTMLSelectElement
  const tag3El = q('#tag3') as HTMLSelectElement
  if (tag1El !== undefined && tag1El.options !== undefined) {
    for (let i = 0; i < tag1El.options.length; i++) {
      const tag1OptionEl = tag1El.options[i] as HTMLOptionElement
      tag1OptionEl.classList.remove('_hidden')
      if (Number(tag1OptionEl.value) == tags.tag2.id && Number(tag1OptionEl.value) != 0) {
        tag1OptionEl.classList.add('_hidden')
      }
      if (Number(tag1OptionEl.value) == tags.tag3.id && Number(tag1OptionEl.value) != 0) {
        tag1OptionEl.classList.add('_hidden')
      }
    }
  }
  if (tag2El !== undefined && tag2El.options !== undefined) {
    for (let i = 0; i < tag2El.options.length; i++) {
      const tag2OptionEl = tag2El.options[i] as HTMLOptionElement
      tag2OptionEl.classList.remove('_hidden')
      if (Number(tag2OptionEl.value) == tags.tag1.id && Number(tag2OptionEl.value) != 0) {
        tag2OptionEl.classList.add('_hidden')
      }
      if (Number(tag2OptionEl.value) == tags.tag3.id && Number(tag2OptionEl.value) !== 0) {
        tag2OptionEl.classList.add('_hidden')
      }
    }
  }
  if (tag3El !== undefined && tag3El.options !== undefined) {
    for (let i = 0; i < tag3El.options.length; i++) {
      const tag3OptionEl = tag3El.options[i] as HTMLOptionElement
      tag3OptionEl.classList.remove('_hidden')
      if (Number(tag3OptionEl.value) == tags.tag1.id && Number(tag3OptionEl.value) !== 0) {
        tag3OptionEl.classList.add('_hidden')
      }
      if (Number(tag3OptionEl.value) == tags.tag2.id && Number(tag3OptionEl.value) !== 0) {
        tag3OptionEl.classList.add('_hidden')
      }
    }
  }
  valForm()
}
const dueStarHourEvent = (e?: Event) => {
  const selectEl = e?.target as HTMLSelectElement
  dueStart.hour = selectEl.value
  dueTimeEvent()
}
const dueStartMinuteEvent = (e?: Event) => {
  const selectEl = e?.target as HTMLSelectElement
  dueStart.minute = selectEl.value
  dueTimeEvent()
}
const dueEndHourEvent = (e?: Event) => {
  const selectEl = e?.target as HTMLSelectElement
  dueEnd.hour = selectEl.value
  dueTimeEvent()
}
const dueEndMinuteEvent = (e?: Event) => {
  const selectEl = e?.target as HTMLSelectElement
  dueEnd.minute = selectEl.value
  dueTimeEvent()
}
const dueTimeEvent = () => {
  if (dueStart.hour === '-') {
    dueTimeOk.value = true
    dueStartMinuteDisabled.value = true
    dueEndHourDisabled.value = true
    dueEndMinuteDisabled.value = true
    dueEnd.hour = '-'
    alertTime.value = ""
  } else if (dueStart.hour !== '-') {
    dueTimeOk.value = true
    dueStartMinuteDisabled.value = false
    dueEndHourDisabled.value = false
    dueEndMinuteDisabled.value = true
    alertTime.value = ""
    if (dueEnd.hour !== '-') {
      dueEndMinuteDisabled.value = false
      const dueStartHour = parseInt(dueStart.hour)
      const dueStartMinute = parseInt(dueStart.minute)
      const dueEndHour = parseInt(dueEnd.hour)
      const dueEndMinute = parseInt(dueEnd.minute)
      if (!overDateCheck.value &&
          (dueStartHour > dueEndHour ||
              (dueStartHour === dueEndHour && dueStartMinute > dueEndMinute)
          )
      ) {
        // 開始時間よりも終了時間が先の場合の処理
        // overDateCheckがtrueの場合は行わない
        alertTime.value = '開始時間は終了時間よりも前に設定してください'
        dueEnd.hour = '-'
        dueEndMinuteDisabled.value = true
      } else {
        alertTime.value = ""
      }
    }
  }
  valForm()
}
const overDateEvent = () => {
  if (!overDateCheck.value) {
    dueTimeEvent()
  }
  valForm()
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
const weekEvent = () => {
  weekOk.value = weeks.value.length > 0;
  valForm()
}

const params: {
  id: number,
  title: string,
  tagId1: number,
  tagId2: number,
  tagId3: number,
  dueStartTime: string | undefined,
  dueEndTime: string | undefined,
  description: string,
  isSunday: boolean,
  isMonday: boolean,
  isTuesday: boolean,
  isWednesday: boolean,
  isThursday: boolean,
  isFriday: boolean,
  isSaturday: boolean,
} = reactive({
  id: task.value.id,
  title: '',
  tagId1: 0,
  tagId2: 0,
  tagId3: 0,
  dueStartTime: '',
  dueEndTime: '',
  description: '',
  isSunday: false,
  isMonday: false,
  isTuesday: false,
  isWednesday: false,
  isThursday: false,
  isFriday: false,
  isSaturday: false,
})
const onSubmit = () => {
  params.id = task.value.id
  params.title = title.value
  params.tagId1 = tags.tag1.id
  params.tagId2 = tags.tag2.id
  params.tagId3 = tags.tag3.id
  params.dueStartTime = dueStart.hour !== '-' ? dueStart.hour + ':' + dueStart.minute + ':00' : undefined
  params.dueEndTime = dueEnd.hour !== '-' ? dueEnd.hour + ':' + dueEnd.minute + ':00' : undefined
  params.description = description.value
  params.isSunday =weeks.value.includes('sunday')
  params.isMonday =weeks.value.includes('monday')
  params.isTuesday = weeks.value.includes('tuesday')
  params.isWednesday = weeks.value.includes('wednesday')
  params.isThursday = weeks.value.includes('thursday')
  params.isFriday = weeks.value.includes('friday')
  params.isSaturday = weeks.value.includes('saturday')

  emit('submit', params)
}

onMounted(async () => {
  await setInput()
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
    <div id="title-tag-box" class="_row">
      <div id="title-box">
        <label for="title" class="form-label">タイトル：<small style="color:var(--bs-red)">※必須</small></label>
        <input @input="titleEvent" v-model="title" type="text" id="title" name="title" class="form-control shadow-sm" placeholder="16文字まで" autofocus>
        <div id="alert-title" class="_alert">{{alertTitle}}</div>
      </div>
      <div id="tag-box">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <label for="tag1" class="form-label">タグ1：</label>
          <select @change="tag1Event" v-model="tags.tag1.id" id="tag1" name="tag1" class="form-select form-select-sm shadow-sm"
                  :class="{'_c_default' : tags.tag1.color == 1,
                    '_c_red' : tags.tag1.color == 2, '_c_orange' : tags.tag1.color == 3, '_c_yellow': tags.tag1.color == 4,
                    '_c_green' : tags.tag1.color == 5, '_c_blue' : tags.tag1.color == 6, '_c_indigo': tags.tag1.color == 7,
                    '_c_purple' : tags.tag1.color == 8 }">
            <option id="tag1default" data-id="0" value="0" selected>タグなし</option>
            <option v-for="tag in tagsList" :key="tag.id" :data-id="tag.id" :data-color="tag.color" :value="tag.id"
                    :class="useGetTagColor(tag.color)">{{tag.name}}</option>
          </select>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-1">
          <label for="tag2" class="form-label">タグ2：</label>
          <select @change="tag2Event" v-model="tags.tag2.id" id="tag2" name="tag2" class="form-select form-select-sm shadow-sm" :disabled="tag2Disabled"
                  :class="{'_disabled': tag2Disabled, '_c_default' : tags.tag2.color == 1,
                    '_c_red' : tags.tag2.color == 2, '_c_orange' : tags.tag2.color == 3, '_c_yellow': tags.tag2.color == 4,
                    '_c_green' : tags.tag2.color == 5, '_c_blue' : tags.tag2.color == 6, '_c_indigo': tags.tag2.color == 7,
                    '_c_purple' : tags.tag2.color == 8 }">
            <option id="tag2default" data-id="0" value="0" selected>タグなし</option>
            <option v-for="tag in tagsList" :key="tag.id" :data-id="tag.id" :data-color="tag.color" :value="tag.id"
                    :class="useGetTagColor(tag.color)">{{tag.name}}</option>
          </select>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-1">
          <label for="tag3" class="form-label">タグ3：</label>
          <select @change="tag3Event" v-model="tags.tag3.id" id="tag3" name="tag3" class="form-select form-select-sm shadow-sm" :disabled="tag3Disabled"
                  :class="{'_disabled': tag3Disabled, '_c_default' : tags.tag3.color == 1,
                    '_c_red' : tags.tag3.color == 2, '_c_orange' : tags.tag3.color == 3, '_c_yellow': tags.tag3.color == 4,
                    '_c_green' : tags.tag3.color == 5, '_c_blue' : tags.tag3.color == 6, '_c_indigo': tags.tag3.color == 7,
                    '_c_purple' : tags.tag3.color == 8 }">
            <option id="tag3default" data-id="0" value="0" selected>タグなし</option>
            <option v-for="tag in tagsList" :key="tag.id" :data-id="tag.id" :data-color="tag.color" :value="tag.id"
                    :class="useGetTagColor(tag.color)">{{tag.name}}</option>
          </select>
        </div>
        <div id="alert-tag" class="_alert">{{alertTag}}</div>
      </div>
    </div>

    <div id="due-time-weeks-box" class="_row">
      <div id="weeks-box" class="d-flex flex-column form-check-label">
        <label for="weeks" class="form-label">曜日：<small style="color:var(--bs-red)">※1つ以上指定してください</small></label>
        <div id="weeks">
          <div class="form-check d-flex flex-wrap w-100">
            <label class="form-label">：<span style="color: var(--bs-red)">日</span>
              <input type="checkbox" id="sunday" @change="weekEvent" v-model="weeks" name="weeks" class="form-check-input shadow-sm" value="sunday">
            </label>
            <label class="form-label">：月<input id="monday" type="checkbox" @change="weekEvent" v-model="weeks" name="weeks" class="form-check-input shadow-sm"
                                                value="monday"></label>
            <label class="form-label">：火<input id="tuesday" type="checkbox" @change="weekEvent" v-model="weeks" name="weeks" class="form-check-input shadow-sm"
                                                value="tuesday"></label>
            <label class="form-label">：水<input id="wednesday" type="checkbox" @change="weekEvent" v-model="weeks" name="weeks" class="form-check-input shadow-sm"
                                                value="wednesday"></label>
            <label class="form-label">：木<input id="thursday" type="checkbox" @change="weekEvent" v-model="weeks" name="weeks" class="form-check-input shadow-sm"
                                                value="thursday"></label>
            <label class="form-label">：金<input id="friday" type="checkbox" @change="weekEvent" v-model="weeks" name="weeks" class="form-check-input shadow-sm"
                                                value="friday"></label>
            <label class="form-label">：<span style="color: var(--bs-blue)">土</span>
              <input type="checkbox" id="saturday" @change="weekEvent" v-model="weeks" name="weeks" class="form-check-input shadow-sm" value="saturday">
            </label>
          </div>
        </div>
        <div id="alert-weeks" class="_alert"></div>
      </div>
      <div id="due-time-box" class="_due_date_time d-flex flex-column">
        <div class="d-flex w-100">
          <div class="_due_time_parent w-50">
            <label for="dueTime" class="form-label">開始時間：</label>
            <div id="due-start-time" class="d-flex justify-content-end align-items-center">
              <select @change="dueStarHourEvent" v-model="dueStart.hour" name="dueStartHour" id="dueStartHour" class="form-select form-select-sm shadow-sm">
                <option value="-" selected>-</option>
                <option v-for="n in 24" :value="(n - 1) <= 9 ? '0' + (n - 1) : (n - 1)">{{(n - 1) <= 9 ? '0' + (n - 1) : (n - 1)}}</option>
              </select>
              <span>：</span>
              <select @change="dueStartMinuteEvent" v-model="dueStart.minute" name="dueStartMinute" id="dueStartMinute" class="form-select form-select-sm shadow-sm"
                      :class="{'_disabled' : dueStartMinuteDisabled}" :disabled="dueStartMinuteDisabled">
                <option v-for="n in 4" :value="(n -1) * 15 <= 9 ? '0' + ((n -1) * 15) : (n -1) * 15" :selected="n === 1">{{(n -1) * 15 <= 9 ? '0' + ((n -1) * 15) : (n -1) * 15}}</option>
              </select>
            </div>
          </div>
          <div class="_due_time_parent w-50">
            <label for="dueTime" class="form-label">終了時間：</label>
            <div id="due-end-time" class="d-flex justify-content-end align-items-center">
              <select @change="dueEndHourEvent" v-model="dueEnd.hour" name="dueEndHour" id="dueEndHour" class="form-select form-select-sm shadow-sm"
                      :class="{'_disabled' : dueEndHourDisabled}" :disabled="dueEndHourDisabled">
                <option value="-" selected>-</option>
                <option v-for="n in 24" :value="(n - 1) <= 9 ? '0' + (n - 1) : (n - 1)">{{(n - 1) <= 9 ? '0' + (n - 1) : (n - 1)}}</option>
              </select>
              <span>：</span>
              <select @change="dueEndMinuteEvent" v-model="dueEnd.minute" name="dueEndMinute" id="dueEndMinute" class="form-select form-select-sm shadow-sm"
                      :class="{'_disabled' : dueEndMinuteDisabled}" :disabled="dueEndMinuteDisabled">
                <option v-for="n in 4" :value="(n -1) * 15 <= 9 ? '0' + ((n -1) * 15) : (n -1) * 15"  :selected="n === 4">{{(n -1) * 15 <= 9 ? '0' + ((n -1) * 15) : (n -1) * 15}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-2 text-center">
          <span class="fw-bold">日をまたいで設定する：</span>
          <input @change="overDateEvent" v-model="overDateCheck" type="checkbox" id="overDateCheckBtn" class="form-check-input shadow-sm">
        </div>
        <div id="alert-time" class="_alert">{{alertTime}}</div>
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
@import "~/assets/css/form.css";
#title-tag-box {
  display: flex;
  justify-content: space-between;
}
#title-box {
  width: 45%;
}
#tag-box {
  width: 40%;
}
#tag-box select {
  width: calc(100% - 60px)
}
#tag-box label {
  width: 60px;
}
#tag1, #tag2, #tag3 {
  width: 70%!important;
}

#weeks-box {
  width: 55%;
  min-width: calc(100% - 300px);
}

#weeks label {
  display: inline-block;
  width: 48px;
  margin: 5px 10px 0;
}

._due_time_parent {
  padding-left: 1rem;
}
#dueStartHour, #dueStartMinute, #dueEndHour, #dueEndMinute {
  width: 55px;
  padding-right: 1.75rem!important;
}
#due-time-weeks-box {
  display: flex;
  justify-content: space-between;
}
#due-time-box {
  width: 55%;
  max-width: 300px;
  margin-top: 0;
}
@media (max-width: 960px) {
  #tag-box {
    width: 40%;
  }
  #due-time-box {
    width: 300px;
  }
}
@media (max-width: 768px) {
  #tag-box {
    width: 50%;
  }
  #weeks-box {
    width: 100%;
  }
}
@media (max-width: 578px) {
  #title-tag-box {
    flex-direction: column;
  }
  #title-box {
    width: 100%;
  }
  #tag-box {
    margin-top: 10px;
    width: 100%;
  }
  #due-time-weeks-box {
    flex-direction: column;
    align-items: center;
  }
  #weeks-box {
    width: 100%;
  }
  ._due_time_parent {
    padding: 0;
  }
  #due-time-box {
    width: 100%;
    max-width: 100%;
    margin-top: 10px;
  }
  #dueStartHour, #dueStartMinute, #dueEndHour, #dueEndMinute {
    min-width: 60px;
  }
}
</style>
