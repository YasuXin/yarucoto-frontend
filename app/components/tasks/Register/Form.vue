<script setup lang="ts">
import type {Tag} from "~/interfaces";
import flatpickr from "vue-flatpickr-component";

const props = defineProps({
  tagsList: {
    type: Array as () => Tag[],
    default: []
  }
})

const emit = defineEmits(['submit'])

const tagsList = computed<Tag[]>(() => props.tagsList as Tag[])

const title = ref("")
const tags = reactive({
  tag1: {
    id: 0,
    color: 0
  },
  tag2: {
    id: 0,
    color: 0
  },
  tag3: {
    id: 0,
    color: 0
  }
})
const today = new Date()

const dueDate = ref(useMakeDateStrFromDate(today))
const dueStart = reactive({
  hour: '-',
  minute: '00'
})
const dueEnd = reactive({
  hour: '-',
  minute: '45'
})
const overDateCheck = ref(false)
const description = ref("")

const alertTitle = ref("")
const alertDueDate = ref("")
const alertTag = ref("")
const alertTime = ref("")
const alertDescription = ref("")

const tag2Disabled = ref(true)
const tag3Disabled = ref(true)

const dueStartMinuteDisabled = ref(true)
const dueEndHourDisabled = ref(true)
const dueEndMinuteDisabled = ref(true)

const submitDisabled = ref(true)

const titleOk = ref(false)
const dueDateOk = ref(true)
const dueTimeOk = ref(true)
const descriptionOk = ref(true)

const q = (selector: string) => document.querySelector(selector) as HTMLElement

const valForm = () => {
  submitDisabled.value = !(titleOk.value && dueDateOk.value && dueTimeOk.value && descriptionOk.value)
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
const dueDateEvent = (e?: Event) => {
  const dateEl = e?.target as HTMLInputElement
  const inputDate = new Date(dateEl.value)
  const td = new Date(
      today.getFullYear(), today.getMonth(), today.getDate()
  )
  if (inputDate > td) {
    dueDateOk.value = true;
    alertDueDate.value = "";
  } else {
    dueDateOk.value = false
    alertDueDate.value = '過去の日付は設定できません'
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

const config = useFlatpickr().configDate

const params: {
  title: string,
  dueDate: string,
  tag1: number,
  tag2: number,
  tag3: number,
  dueStartTime: string | undefined,
  dueEndTime: string | undefined,
  description: string
} = reactive({
  title: '',
  dueDate: '',
  tag1: 0,
  tag2: 0,
  tag3: 0,
  dueStartTime: '',
  dueEndTime: '',
  description: ''
})
const onSubmit = () => {
  params.title = title.value
  params.dueDate = dueDate.value
  params.tag1 = tags.tag1.id
  params.tag2 = tags.tag2.id
  params.tag3 = tags.tag3.id
  params.dueStartTime = dueStart.hour !== '-' ? dueStart.hour + ':' + dueStart.minute + ':00' : undefined
  params.dueEndTime = dueEnd.hour !== '-' ? dueEnd.hour + ':' + dueEnd.minute + ':00' : undefined
  params.description = description.value

  emit('submit', params)
}

onMounted(() => {

})
</script>

<template>
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

    <div id="due-date-time-box" class="_row">
      <div id="due-date-box">
        <div class="_due_date">
          <label for="dueDate" class="form-label">日付：<small style="color:var(--bs-red)">※必須</small></label>
          <flatpickr :config="config" type="date" @change="dueDateEvent" v-model="dueDate" id="dueDate" name="dueDate" class="form-control form-control-sm shadow-sm"></flatpickr>
          <div id="alert-date" class="_alert">{{alertDueDate}}</div>
        </div>
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
          <span class="fw-bold">日をまたいで設定する：</span><input @change="overDateEvent" v-model="overDateCheck" type="checkbox" id="overDateCheckBtn"
                                                                   class="form-check-input shadow-sm">
        </div>
        <div id="alert-time" class="_alert">{{alertTime}}</div>
      </div>

    </div>

    <div id="description-box" class="_row">
      <label for="description" class="form-label">説明：</label>
      <textarea @input="descriptionEvent" v-model="description" id="description" name="description" class="form-control shadow-sm" placeholder="100文字まで"></textarea>
      <div id="alert-description" class="_alert">{{alertDescription}}</div>
    </div>
    <button type="submit" id="submitBtn" class="btn _btn_primary shadow-sm" :class="{'_disabled' : submitDisabled}" :disabled="submitDisabled">追加</button>
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

#dueStartHour, #dueStartMinute, #dueEndHour, #dueEndMinute {
  width: 55px;
  padding-right: 1.75rem!important;
}

#due-date-time-box {
  display: flex;
  justify-content: space-between;
}
#due-date-box {
  width: 45%;
}

#due-time-box {
  width: 55%;
  max-width: 300px;
  margin-top: 0;
}
._due_time_parent {
  padding-left: 1rem;
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
}
@media (max-width: 578px) {
  #title-tag-box {
    flex-direction: column;
  }
  #title-box {
    width: 100%;
  }
  #tag-box {
    width: 100%;
    margin-top: 10px;
  }
  #due-date-time-box {
    flex-direction: column;
    align-items: center;
  }
  #due-date-box {
    width: 100%;
  }
  #due-time-box {
    width: 100%;
    max-width: 100%;
    margin-top: 8px;
  }
  ._due_time_parent {
    padding: 0;
  }
  #dueStartHour, #dueStartMinute, #dueEndHour, #dueEndMinute {
    min-width: 60px;
  }
}
</style>
