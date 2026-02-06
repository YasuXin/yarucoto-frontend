<script setup lang="ts">
import type {Tag, Task} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | Tasks"
})

const token = useCookie('__yarucoto')
const stateTasks = useState<Task[] | null>('allTasks')
const homeTasks = useState<Task[] | null>('homeTasks')
const stateTags = useState<Tag[] | null>('tags')

const route = useRoute()
const path = route.path
const query = ref<string>(route.query.date as string)

const router = useRouter()

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const getTasksUrl = baseUrl + '/tasks/get/calendar/'
const putToggleCompletedUrl = baseUrl + '/tasks/put/toggleCompleted'
const putAllCompleteUrl = baseUrl + '/tasks/put/allComplete'
const putAllNotCompleteUrl = baseUrl + '/tasks/put/allNotComplete'
const postCreateTaskUrl = baseUrl + '/tasks/post/create'
const deleteTaskUrl = baseUrl + '/tasks/delete'

const tasks = ref<Task[]>()
const tags = computed(() => stateTags.value as Tag[] ?? [])

const holidayMap = useState('holidays') as Ref<Record<string, string>>

const calendarArr = ref()
const calendarObj = ref()

const taskCount = computed(() => tasks.value?.length)

const completedCount = ref<number>(0)
const completedRate = computed(() => {
  if (taskCount.value === 0 || taskCount.value === undefined) return 0
  return Math.round(completedCount.value / taskCount.value * 100)
})

const now = new Date()
const dateState = reactive({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  date: now.getDate(),
  isBeforeToday: false,
  holiday: '',
})
const dateForm = computed(() => {
  let monthStr = ''
  let dateStr = ''
  if (dateState.month < 10) {
    monthStr = '0' + dateState.month
  } else {
    monthStr = dateState.month + ''
  }
  if (dateState.date < 10) {
    dateStr = '0' + dateState.date
  } else {
    dateStr = dateState.date + ''
  }
  return dateState.year + '-' + monthStr + '-' + dateStr
})

const taskDateStr = ref('')

const selectedTag = ref(0)

const isSubLoadingShow = ref(false)

const fixedSetCompTextHidden = ref(true)
const fixedRemoveCompTextHidden = ref(true)
const fixedSetAllCompTextHidden = ref(true)
const fixedRemoveAllCompTextHidden = ref(true)
const prevMonthTextHidden = ref(true)
const nextMonthTextHidden = ref(true)
const prevDateTextHidden = ref(true)
const nextDateTextHidden = ref(true)
const toggleSimpleTextHidden = ref(true)
const registerModalTextHidden = ref(true)

const setCompleteRef = ref<HTMLInputElement>()
const removeCompleteRef = ref<HTMLInputElement>()
const prevMonthRef = ref<HTMLInputElement>()
const nextMonthRef = ref<HTMLInputElement>()
const yesterdayRef = ref<HTMLInputElement>()
const tomorrowRef = ref<HTMLInputElement>()
const setAllCompleteRef = ref<HTMLInputElement>()
const removeAllCompleteRef = ref<HTMLInputElement>()
const allCompletedBtnRef = ref<HTMLInputElement>()
const allCompletedBtnCheckRef = ref<HTMLInputElement>()
const toggleSimpleRef = ref<HTMLInputElement>()
const registerModalRef = ref<HTMLInputElement>()

const setCompleteMouseover = (flag: boolean) => {
  fixedRemoveCompTextHidden.value = true
  if (flag) {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      const setMouseover = setCompleteRef.value as HTMLElement
      if (setMouseover) {
        setMouseover.style.top = e.clientY - 20 + 'px'
        setMouseover.style.left =  e.clientX + 20 + 'px'
      }
    })
    fixedSetCompTextHidden.value = false
  } else {
    fixedSetCompTextHidden.value = true
  }
}
const removeCompleteMouseover = (flag: boolean) => {
  fixedSetCompTextHidden.value = true
  if (flag) {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      const removeMouseover = removeCompleteRef.value as HTMLElement
      if (removeMouseover) {
        removeMouseover.style.top = e.clientY - 20 + 'px'
        removeMouseover.style.left =  e.clientX + 20 + 'px'
      }
    })
    fixedRemoveCompTextHidden.value = false
  } else {
    fixedRemoveCompTextHidden.value = true
  }
}

const prevMonthMouseover = (e: MouseEvent) => {
  prevMonthTextHidden.value = false
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const prevMouseover = prevMonthRef.value as HTMLElement
    if (prevMouseover) {
      prevMouseover.style.top = e.clientY - 20 + 'px'
      prevMouseover.style.left =  e.clientX + 20 + 'px'
    }
  })
}
const prevMonthMouseleave = () => {
  prevMonthTextHidden.value = true
}
const nextMonthMouseover = (e: MouseEvent) => {
  nextMonthTextHidden.value = false
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const nextMouseover = nextMonthRef.value as HTMLElement
    if (nextMouseover) {
      if (window.innerWidth <= 576) {
        nextMouseover.style.top = e.clientY - 20 + 'px'
        nextMouseover.style.left =  e.clientX - 100 + 'px'
      } else {
        nextMouseover.style.top = e.clientY - 20 + 'px'
        nextMouseover.style.left =  e.clientX + 20 + 'px'
      }
    }
  })
}
const nextMonthMouseleave = () => {
  nextMonthTextHidden.value = true
}

const prevDateMouseover = (e: MouseEvent) => {
  prevDateTextHidden.value = false
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const yesterdayMouseover = yesterdayRef.value as HTMLElement
    if (yesterdayMouseover) {
      yesterdayMouseover.style.top = e.clientY - 20 + 'px'
      yesterdayMouseover.style.left =  e.clientX + 20 + 'px'
    }
  })
}
const prevDateMouseleave = () => {
  prevDateTextHidden.value = true
}
const nextDateMouseover = (e: MouseEvent) => {
  nextDateTextHidden.value = false
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const tomorrowMouseover = tomorrowRef.value as HTMLElement
    if (tomorrowMouseover) {
      if (window.innerWidth <= 576) {
        tomorrowMouseover.style.top = e.clientY - 20 + 'px'
        tomorrowMouseover.style.left =  e.clientX - 100 + 'px'
      } else {
        tomorrowMouseover.style.top = e.clientY - 20 + 'px'
        tomorrowMouseover.style.left =  e.clientX + 20 + 'px'
      }

    }
  })
}
const nextDateMouseleave = () => {
  nextDateTextHidden.value = true
}
const toggleSimpleMouseover = (e: MouseEvent) => {
  toggleSimpleTextHidden.value = false
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const toggleSimpleMouseover = toggleSimpleRef.value as HTMLElement
    if (toggleSimpleMouseover) {
      toggleSimpleMouseover.style.top = e.clientY - 20 + 'px'
      toggleSimpleMouseover.style.left =  e.clientX - 100 + 'px'
    }
  })
}
const toggleSimpleMouseleave = () => {
  toggleSimpleTextHidden.value = true
}
const registerModalMouseover = (e: MouseEvent) => {
  registerModalTextHidden.value = false
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const registerModalMouseover = registerModalRef.value as HTMLElement
    if (registerModalMouseover) {
      registerModalMouseover.style.top = e.clientY - 20 + 'px'
      registerModalMouseover.style.left =  e.clientX - 100 + 'px'
    }
  })
}
const registerModalMouseleave = () => {
  registerModalTextHidden.value = true
}

const setAllCompleteMouseover = () => {
  fixedRemoveAllCompTextHidden.value = true
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const setAllMouseover = setAllCompleteRef.value as HTMLElement
    if (setAllMouseover) {
      setAllMouseover.style.top = e.clientY - 20 + 'px'
      setAllMouseover.style.left =  e.clientX + 20 + 'px'
    }
  })
  fixedSetAllCompTextHidden.value = false
  const btnCheckEl = allCompletedBtnCheckRef.value as HTMLElement
  btnCheckEl.textContent = '✓'
}
const setAllCompleteMouseLeave = (e: MouseEvent) => {
  fixedSetAllCompTextHidden.value = true
  const btnCheckEl = allCompletedBtnCheckRef.value as HTMLElement
  btnCheckEl.textContent = ''
}
const removeAllCompleteMouseover = () => {
  fixedSetAllCompTextHidden.value = true
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const removeAllMouseover = removeAllCompleteRef.value as HTMLElement
    if (removeAllMouseover) {
      removeAllMouseover.style.top = e.clientY - 20 + 'px'
      removeAllMouseover.style.left =  e.clientX + 20 + 'px'
    }
  })
  fixedRemoveAllCompTextHidden.value = false
}
const removeAllCompleteMouseLeave = () => {
  fixedRemoveAllCompTextHidden.value = true
}

const resetSearchTasks = () => {
  stateTasks.value = null
}

const resetHomeTasks = (dateStr: string) => {
  const now = new Date()
  if (dateStr === useMakeDateStrFromDate(now) ||
      dateStr === useMakeDateStrFromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)) ||
      dateStr === useMakeDateStrFromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))) {
    homeTasks.value = null
  }
}

const toggleAllResult = ref('')
const toggleCompleteEvent = async () => {
  const params: {
    dateStr: string,
  } = {
    dateStr: dateForm.value
  }
  if (allCompletedBtnRef.value && allCompletedBtnRef.value.classList.contains('_is_all_completed')) {
    modalMessage.value = '送信中...'
    modalShow.value = true
    try {
      const res = await $fetch(putAllNotCompleteUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: params
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      toggleAllResult.value = res
      if (toggleAllResult.value === 'failed') {
        modalMessage.value = '送信に失敗しました'
        resetSearchTasks()
        resetHomeTasks(dateForm.value)
        setTimeout(() => {
          modalShow.value = false
          window.location.reload()
        }, 1000)
      } else {
        modalMessage.value = 'すべて未完了に戻しました'
        await getTasks(params.dateStr)
        resetSearchTasks()
        resetHomeTasks(dateForm.value)
        setTimeout(() => {
          modalShow.value = false
          setTaskCount()
        }, 1000)
      }
    } catch (error) {
      resetSearchTasks()
      resetHomeTasks(dateForm.value)
      useErrorEvent(error)
    }
  } else if (allCompletedBtnRef.value && allCompletedBtnRef.value.classList.contains('_not_all_completed')) {
    modalMessage.value = '送信中...'
    modalShow.value = true
    try {
      const res = await $fetch(putAllCompleteUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: params
      }) as any
      if (res === 'illegal') navigateTo('/not-allowed')
      toggleAllResult.value = res
      if (toggleAllResult.value === 'failed') {
        modalMessage.value = '送信に失敗しました'
        resetSearchTasks()
        resetHomeTasks(dateForm.value)
        setTimeout(() => {
          modalShow.value = false
          window.location.reload()
        }, 1000)
      } else {
        modalMessage.value = 'すべて完了にしました'
        await getTasks(params.dateStr)
        resetSearchTasks()
        resetHomeTasks(dateForm.value)
        setTimeout(() => {
          modalShow.value = false
          setTaskCount()
        }, 1000)
      }
    } catch (error) {
      resetSearchTasks()
      resetHomeTasks(dateForm.value)
      useErrorEvent(error)
    }
  }
}

const modalShow = ref(false)
const modalMessage = ref('送信に失敗しました')

const toggleResult = ref('')
const toggleEvent = async (toggleReq: { id: number, completed: boolean}) => {
  try {
    const params: {taskId: number } = {taskId: Number(toggleReq.id)}
    const res = await $fetch(putToggleCompletedUrl, {
      method: 'PUT',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: putToggleCompletedUrl + '/' + params.taskId
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    toggleResult.value = res
    if (toggleResult.value === 'success') {
      if (tasks.value !== undefined) {
        for (const task of tasks.value) {
          if (Number(task.id) === Number(toggleReq.id)) {
            task.completed = !toggleReq.completed
          }
        }
      }
      resetHomeTasks(dateForm.value)
      setTaskCount()
      resetSearchTasks()
    } else {
      modalShow.value = true
      modalMessage.value = '送信に失敗しました'
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    useErrorEvent(error)
  }
}

const createStateHoliday = (dateStr: string) => {
  dateState.holiday = ''
  if (holidayMap.value) {
    for (const key of Object.keys(holidayMap.value)) {
      if (key === dateStr) {
        dateState.holiday = holidayMap.value[key] as string
      }
    }
  }
}

const initTasks = async () => {
  if (homeTasks.value === null || homeTasks.value === undefined) {
    await getTasks(useMakeDateStrFromDate(new Date))
  } else {
    const date = useMakeDateStrFromDate(new Date)
    tasks.value = homeTasks.value.filter(task => task.dueDate === date)
    createStateHoliday(date)
  }
}

const getTasks = async (dateStr: string) => {
  try {
    const res = await $fetch(getTasksUrl + dateStr, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    tasks.value = res
    createStateHoliday(dateStr)
  } catch (error) {
    useErrorEvent(error)
  }
}

const setTaskCount = () => {
  completedCount.value = 0
  if (tasks.value === undefined) return
  for (const task of tasks.value) {
    if (task.completed) completedCount.value++
  }
}

const createCalendar = (year: number, month: number, selectedDateStr: string = useMakeDateStrFromDate(new Date)) => {
  calendarArr.value = useMakeCalendarArr(year, month) as number[][]
  let arr = []
  for (const week of calendarArr.value) {
    let innerArr = []
    for (let i = 0; i < week.length; i++) {
      if (Number(week[i]) !== 0) {
        const day = week[i]
        const dateObj = {date: Number(day), week: i, selectedDate: false, holiday: false}
        let monthStr = ''
        let dayStr = ''
        if (month < 10) {
          monthStr = '0' + month
        } else {
          monthStr = month + ''
        }
        if (day < 10) {
          dayStr = '0' + day
        } else {
          dayStr = day
        }
        const dateStr = year + '-' + monthStr + '-' + dayStr
        for (const hol in holidayMap.value) {
          if (dateStr === hol) {
            dateObj.holiday = true
          }
        }
        if (dateStr === selectedDateStr) dateObj.selectedDate = true
        innerArr.push(dateObj)
      }
    }
    arr.push(innerArr)
  }
  calendarObj.value = arr
}

const createDateStr = (year: number, month: number, date: number) => {
  let monthStr = ''
  let dayStr = ''
  if (month < 10) {
    monthStr = '0' + month
  } else {
    monthStr = month + ''
  }
  if (date < 10) {
    dayStr = '0' + date
  } else {
    dayStr = date + ''
  }
  const str = year + '/' + monthStr + '/' + dayStr
  const weekday = useCreateWeekday(new Date(str))

  taskDateStr.value = str + weekday
}

const deleteResult = ref('')
const deleteEvent = async (id: number) => {
  try {
    const params: {taskId :number} = {taskId: id}
    const res = await $fetch(deleteTaskUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: params
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    deleteResult.value = res
    if (deleteResult.value === 'success' && tasks.value !== undefined) {
      for (const task of tasks.value) {
        if (Number(task.id) === Number(id)) {
          const index = tasks.value.indexOf(task)
          tasks.value.splice(index, 1)
        }
      }
      resetHomeTasks(dateForm.value)
      resetSearchTasks()
    } else {
      modalShow.value = true
      modalMessage.value = '送信に失敗しました'
      resetHomeTasks(dateForm.value)
      resetSearchTasks()
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    resetHomeTasks(dateForm.value)
    resetSearchTasks()
    useErrorEvent(error)
  }
}

const movePrevDateEvent = async () => {
  const date = new Date(dateState.year, dateState.month - 1, dateState.date)
  date.setDate(dateState.date - 1)
  dateState.year = date.getFullYear()
  dateState.month = date.getMonth() + 1
  dateState.date = date.getDate()
  await changeDate(dateState.date)
  await router.push({
    'query' : {
      date : dateState.year + '-' + dateState.month + '-' + dateState.date
    }
  })
}
const moveNextDateEvent = async () => {
  const date = new Date(dateState.year, dateState.month - 1, dateState.date)
  date.setDate(dateState.date + 1)
  dateState.year = date.getFullYear()
  dateState.month = date.getMonth() + 1
  dateState.date = date.getDate()
  await changeDate(dateState.date)
  await router.push({
    'query' : {
      date : dateState.year + '-' + dateState.month + '-' + dateState.date
    }
  })
}
const changeDate = async (date: number) => {
  createDateStr(dateState.year, dateState.month, date)
  let monthStr = ''
  let dateStr = ''
  if (dateState.month < 10) {
    monthStr = '0' + dateState.month
  } else {
    monthStr = dateState.month + ''
  }
  if (date < 10) {
    dateStr = '0' + date
  } else {
    dateStr = date + ''
  }
  createCalendar(dateState.year, dateState.month, dateState.year + '-' + monthStr + '-' + dateStr)
  await getTasks(dateState.year + '-' + monthStr + '-' + dateStr)
  setTaskCount()
  dateState.date = date
  const today = useMakeDateStrFromDate(new Date)
  const dateDate = useMakeDateStrFromDate(new Date(dateState.year + '/' + monthStr + '/' + dateStr))
  dateState.isBeforeToday = dateDate < today;
}
const changeDateEvent = async (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const date = Number(target.dataset.date)
  if (date) {
    await changeDate(date)
    await router.push({
      'query' : {
        date : dateState.year + '-' + dateState.month + '-' + date
      }
    })
  }
}

const prevMonthEvent = async () => {
  if (dateState.month === 1) {
    dateState.year -= 1
    dateState.month = 12
  } else {
    dateState.month -= 1
  }
  dateState.date = 1
  await changeMonth()
  await router.push({
    'query' : {
      date : dateState.year + '-' + dateState.month + '-' + dateState.date
    }
  })
}
const nextMonthEvent = async () => {
  if (dateState.month === 12) {
    dateState.year += 1
    dateState.month = 1
  } else {
    dateState.month += 1
  }
  dateState.date = 1
  await changeMonth()
  await router.push({
    'query' : {
      date : dateState.year + '-' + dateState.month + '-' + dateState.date
    }
  })
}
const changeMonth = async () => {
  createDateStr(dateState.year, dateState.month, dateState.date)
  let monthStr = ''
  let dateStr = ''
  if (dateState.month < 10) {
    monthStr = '0' + dateState.month
  } else {
    monthStr = dateState.month + ''
  }
  if (dateState.date < 10) {
    dateStr = '0' + dateState.date
  } else {
    dateStr = dateState.date + ''
  }
  createCalendar(dateState.year, dateState.month, dateState.year + '-' + monthStr + '-' + dateStr)
  await getTasks(dateState.year + '-' + monthStr + '-' + dateStr)
  setTaskCount()
  const today = new Date()
  const dateDate = new Date(dateState.year + '/' + monthStr + '/' + dateStr)
  dateState.isBeforeToday = dateDate <= today;
  await router.push({
    'query' : {
      date : dateState.year + '-' + dateState.month + '-' + dateState.date
    }
  })
}

const tagSelectEvent = (tagId: number) => {
 if (selectedTag.value == tagId) {
   selectedTag.value = 0
 } else {
   selectedTag.value = tagId
 }
}

const isSimpleDisplay = ref(true)
const isRegisterModalShow = ref(false)

const submitResult = ref('')
const onSubmit = async (params: {
  title: string,
  dueDate: string,
  tag1: number,
  tag2: number,
  tag3: number,
  dueStartTime: string | undefined,
  dueEndTime: string | undefined,
  description: string
}) => {
  modalMessage.value = '送信中...'
  modalShow.value = true
  try {
    const res = await $fetch(postCreateTaskUrl, {
      method: 'POST',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: 'postTask',
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    submitResult.value = res
    if (submitResult.value === 'success') {
      modalMessage.value = 'タスクを追加しました'
      await getTasks(params.dueDate)
      resetHomeTasks(params.dueDate)
      resetSearchTasks()
      setTimeout(() => {
        modalShow.value = false
        setTaskCount()
      }, 1000)
    } else {
      modalMessage.value = '送信に失敗しました'
      resetHomeTasks(dateForm.value)
      resetSearchTasks()
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    resetHomeTasks(dateForm.value)
    resetSearchTasks()
    useErrorEvent(error)
  }
}

const afterLoad = ref(false)
onMounted(async () => {
  if (query.value) {
    // queryがある場合の処理
    const dateArr = query.value.split('-')
    if (dateArr.length === 3) {
      // queryの文字列が日付形式の場合、指定した日付のタスクを表示する
      const year = Number(dateArr[0])
      const month = Number(dateArr[1])
      const date = Number(dateArr[2])
      dateState.year = year
      dateState.month = month
      dateState.date = date
      await changeDate(date)
    } else {
      // queryの文字列が日付形式でない場合は、今日の日付のタスクを取得する
      createDateStr(dateState.year, dateState.month, dateState.date)
      createCalendar(dateState.year, dateState.month)
      await initTasks()
      setTaskCount()
    }
  } else {
    // queryがない場合は今日の日付のタスクを取得する
    createDateStr(dateState.year, dateState.month, dateState.date)
    createCalendar(dateState.year, dateState.month)
    await initTasks()
    setTaskCount()
  }
  afterLoad.value = true
  isSubLoadingShow.value = true
})

</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>タスク一覧</h3>
        </div>
        <div class="d-flex justify-content-center">
          <div class="_link_to_register_parent mx-2">
            <NuxtLink to="/tasks/register" class="_link_to_register btn _btn_primary shadow-sm">タスクの追加</NuxtLink>
          </div>
          <div class="_link_to_register_parent mx-2">
            <NuxtLink to="/tasks/search" class="_link_to_register btn _btn_primary shadow-sm">検索ページへ</NuxtLink>
          </div>
        </div>
        <div id="tag-btns-parent" class="d-flex flex-wrap px-4 pt-3">
          <label>タグ：</label>
          <TagButtons :tags="tags" :selectedTagId="selectedTag" @tagSelect="tagSelectEvent"></TagButtons>
        </div>
        <div id="tasks-parent" class="d-flex justify-content-between align-items-start">
          <div id="dates-tasks" class="d-flex justify-content-center flex-column">
            <div id="year-container">
              <div id="year-header" class="shadow-sm">
                <div id="year-box">
                  <div><span id="year-text">{{dateState.year}}</span>年</div>
                </div>
              </div>
              <div id="prev-next-container" class="shadow-sm">
                <div>
                  <button @mouseenter="prevMonthMouseover" @mouseleave="prevMonthMouseleave" @click="prevMonthEvent" id="prev-month" class="_prev_btn">&#9664;</button>
                </div>
                <div id="month-box-sm">
                  <div class="d-flex justify-content-center align-items-center">
                    <span id="month-text-sm" class="_month_text">{{dateState.month}}</span>
                    <div id="mon-sm">月</div>
                  </div>
                </div>
                <div>
                  <button @mouseenter="nextMonthMouseover" @mouseleave="nextMonthMouseleave" @click="nextMonthEvent" id="next-month" class="_next_btn">&#9654;</button>
                </div>
              </div>
              <div id="month-container" class="shadow">
                <div id="month-header">
                  <div id="month-box" class="d-flex justify-content-end">
                    <div><span id="month-text" class="_month_text">{{dateState.month}}</span>月</div>
                  </div>
                </div>
                <div id="cal-table">
                  <div id="cal-inner-table">
                    <template v-for="(weekObj, index1) in calendarObj" :key="index1">
                      <template v-for="(day, index2) in weekObj" :key="index2">
                        <div v-if="day !== 0" class="_cal_col" :class="{'_sunday': day.week === 0, '_saturday': day.week === 6, '_holiday' : day.holiday, '_selected_date' : day.selectedDate}">
                          <button @click="changeDateEvent" :data-date="day.date">{{day.date}}日</button>
                        </div>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="tasks-box" class="d-flex justify-content-start flex-column shadow">
            <div id="sub-child" v-show="isSubLoadingShow" class="d-flex flex-column align-items-center">
              <div class="_simple_btn_parent mb-2">
                <button @click="isRegisterModalShow=true" @mouseover="registerModalMouseover" @mouseleave="registerModalMouseleave" v-if="!dateState.isBeforeToday" class="_toggle_register_display_btn shadow-sm">
                  <img src="~/assets/images/register.png" width="32" alt=""></button>
                <button @click="isSimpleDisplay=!isSimpleDisplay" @mouseover="toggleSimpleMouseover" @mouseleave="toggleSimpleMouseleave" class="_toggle_simple_display_btn shadow-sm" :class="{'_btn_primary_on' : !isSimpleDisplay}">
                  <img src="~/assets/images/show.png" width="32" alt=""></button>
              </div>
              <div id="sub-date" class="d-flex justify-content-center mt-2 mb-2">
                <div class="_prev_btn_parent shadow-sm">
                  <button @click="movePrevDateEvent" @mouseenter="prevDateMouseover" @mouseleave="prevDateMouseleave" class="_prev_btn">&#9664;</button>
                </div>
                <h4><span class="_sub_date mx-2" v-html="taskDateStr"></span><span class="_sub_date" style="color: var(--bs-red)"> {{dateState.holiday}}</span></h4>
                <div class="_next_btn_parent shadow-sm">
                  <button @click="moveNextDateEvent" @mouseenter="nextDateMouseover" @mouseleave="nextDateMouseleave" class="_next_btn">&#9654;</button>
                </div>
              </div>

              <div id="completed-rate" class="d-flex justify-content-between align-items-end mb-2 w-100">
                <div id="all-completed-btn-parent" class="d-flex align-items-end">
                  <template v-if="tasks !== undefined && tasks.length !== 0">
                    <button  ref="allCompletedBtnRef" v-if="completedRate !== 100" @click="toggleCompleteEvent" @mouseenter="setAllCompleteMouseover" @mouseleave="setAllCompleteMouseLeave" id="all-completed-btn" class="_not_all_completed">
                      <span ref="allCompletedBtnCheckRef" id="all-completed-btn-check"></span>
                    </button>
                    <button ref="allCompletedBtnRef" v-if="completedRate === 100" @click="toggleCompleteEvent" @mouseenter="removeAllCompleteMouseover" @mouseleave="removeAllCompleteMouseLeave" id="all-completed-btn" class="_is_all_completed">
                      <span ref="allCompletedBtnCheckRef" id="all-completed-btn-check">✓</span>
                    </button>
                    <span v-if="completedRate !== 100" id="all-completed-btn-text">すべて完了にする</span>
                    <span v-if="completedRate === 100" id="all-completed-btn-text">すべて未完了に戻す</span>
                  </template>
                </div>

                <div id="task-count-and-rate" class="d-flex justify-content-between">
                  <div id="task-count-parent">
                    <div id="task-count">タスク数<span id="task-count-text" class="_task_count_text">{{taskCount}}</span></div>
                  </div>
                  <div id="completed-rate-text-parent">達成率<span id="completed-rate-text" class="_completed_rate_text">{{completedRate}}</span>%
                  </div>
                </div>
              </div>
              <transition-group appear tag="div" name="task-list" id="tasks">
                <NoItems text="タスクがありません" v-if="tasks === undefined || tasks.length === 0" key="0"></NoItems>
                <TasksTask v-if="tasks !== undefined && tasks.length !== 0" @delete="deleteEvent" @toggleEvent="toggleEvent" @setCompleteMouseover="setCompleteMouseover" @removeCompleteMouseover="removeCompleteMouseover"
                           v-for="task in tasks" :key="task.id" :task="task" :selectedTagId="selectedTag"
                           :isSimpleDisplay="isSimpleDisplay"></TasksTask>
              </transition-group>
            </div>
            <div id="sub-loading" class="_loading" v-show="!isSubLoadingShow">
              <div id="sub-loading-text" class="_loading_text">取得中...</div>
            </div>
          </div>
        </div>
      </div>
      <Loading v-if="!afterLoad"></Loading>
      <div ref="setCompleteRef" id="set-complete" class="_set_remove_window" :class="{ '_hidden' : fixedSetCompTextHidden }">
        <div class="_set_complete_text">完了にする</div>
      </div>
      <div ref="removeCompleteRef" id="remove-complete" class="_set_remove_window" :class="{ '_hidden' : fixedRemoveCompTextHidden }">
        <div class="_remove_complete_text">未完了に戻す</div>
      </div>
      <div ref="setAllCompleteRef" id="set-all-complete" class="_set_remove_window" :class="{ '_hidden' : fixedSetAllCompTextHidden }">
        <div class="_set_complete_text">すべて完了にする</div>
      </div>
      <div ref="removeAllCompleteRef" id="remove-all-complete" class="_set_remove_window" :class="{ '_hidden' : fixedRemoveAllCompTextHidden }">
        <div class="_remove_complete_text">すべて未完了に戻す</div>
      </div>
      <div ref="yesterdayRef" id="yesterday-mouseover" class="_set_remove_window" :class="{ '_hidden': prevDateTextHidden }">
        <div class="_mouseover_text">前日へ移動</div>
      </div>
      <div ref="tomorrowRef" id="tomorrow-mouseover" class="_set_remove_window" :class="{ '_hidden': nextDateTextHidden }">
        <div class="_mouseover_text">翌日へ移動</div>
      </div>
      <div ref="prevMonthRef" id="prev-mouseover" class="_set_remove_window" :class="{ '_hidden': prevMonthTextHidden }">
        <div class="_mouseover_text">前月へ移動</div>
      </div>
      <div ref="nextMonthRef" id="next-mouseover" class="_set_remove_window" :class="{ '_hidden': nextMonthTextHidden }">
        <div class="_mouseover_text">翌月へ移動</div>
      </div>
      <div ref="toggleSimpleRef" id="toggle-simple-display-mouseover" class="_set_remove_window" :class="{ '_hidden': toggleSimpleTextHidden }">
        <div class="_mouseover_text">表示切替</div>
      </div>
      <div ref="registerModalRef" id="register-modal-show-mouseover" class="_set_remove_window" :class="{ '_hidden': registerModalTextHidden }">
        <div class="_mouseover_text">タスク追加</div>
      </div>
    </main>
  </div>
  <teleport to="body">
    <transition name="form-slide">
      <TasksFormModal v-show="isRegisterModalShow" @submit="onSubmit" @close="isRegisterModalShow=false" :tagsList="tags" :date="dateForm"></TasksFormModal>
    </transition>
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
@import "~/assets/css/tag_color.css";
@import "~/assets/css/set_remove_windows.css";
.task-list-enter-active, .task-list-leave-active {
  transition: all 0.5s;
}
.task-list-enter-from, .task-list-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.task-list-leave-from {
  opacity: 0;
}
.task-list-move {
  transition: transform 0.5s;
}
.task-list-leave-active {
  position: absolute;
}

.form-slide-enter-active, .form-slide-leave-active {
  transition: all 0.5s;
}
.form-slide-enter-from, .form-slide-leave-to {
  opacity: 0;
  transform: translateX(70%);
}
.form-slide-leave-from, .form-slide-enter-to {
  opacity: 1;
}

._simple_btn_parent {
  position: relative;
  width: 100%;
}
._toggle_simple_display_btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--bg-color);
  border: var(--middle-border);
  border-radius: 5px;
  padding: 2px;
}
._toggle_register_display_btn {
  position: absolute;
  top: 10px;
  right: 60px;
  background-color: var(--bg-color);
  border: var(--middle-border);
  border-radius: 5px;
  padding: 2px;
}
._toggle_simple_display_btn:hover, ._toggle_register_display_btn:hover {
  animation-name: btnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes btnAnimation {
  0% {}
  100% {background-color: var(--disabled-form-bg-color);}
}
.form-check-input:checked {
  background-color: var(--theme-color1) !important;
}
._loading {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}
._loading_text {
  font-size: 24px;
  color: var(--font-color);
  animation-name: loadingAnimation;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  opacity: 0;
  animation-delay: 0.5s;
}
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#tasks-parent {
  margin-top: 12px;
  padding: 0 10px;
}
#prev-next-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: var(--middle-border);
  background-color: var(--bg-color);
  height: 40px;
}
#prev-next-container div {
  width: 50%;
  height: 100%;
}
#prev-next-container button {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  padding: 0;
  color: gray;
}
._prev_btn_parent {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border: var(--middle-border);
  background-color: var(--bg-color);
  width: 30px;
  height: 30px;
}
._next_btn_parent {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border: var(--middle-border);
  background-color: var(--bg-color);
  width: 30px;
  height: 30px;
  margin-left: 4px;
}
._prev_btn_parent button,
._next_btn_parent button {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none!important;
  padding: 0;
  color: gray;
}
._prev_btn {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
._next_btn {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
#next-month {
  border-left: var(--middle-border) !important;
}
#prev-next-container button:hover,
._prev_btn_parent:hover,
._next_btn_parent:hover,
._cal_col:hover {
  animation-name: btnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
@keyframes btnAnimation {
  0% {}
  100% {background-color: var(--selected-date-bg-color);}
}
#year-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  height: 40px;
  border-radius: 10px;
  border: var(--middle-border);
  margin-bottom: 10px;
  width: 100%;
}
#year-box {
  width: 100%;
  text-align: center;
}
#dates-tasks {
  width: 90px;
}
#month-container {
  border-radius: 10px;
  border: var(--middle-border);
  padding: 0;
  margin-top: 10px;
}
#month-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 100%;
  height: 50px;
  border-bottom: none;
  padding-bottom: 5px;
  background-image: var(--month-header-bg-image);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
#month-box {
  width: 100%;
}
#month-box div {
  margin-right: 8px;
}
#month-box span {
  display: inline-block;
  margin: 0 4px;
  width: 36px;
}
#month-box-sm span {
  display: inline-block;
  margin: 0 4px;
  width: 36px;
}
._month_text {
  font-style: italic;
  font-size: 1.8rem;
  width: 100%;
  text-align: center;
}
#cal-table {
  width: 100%;
  border-radius: 10px;
}
#cal-inner-table {
  width: 100%;
}
._cal_col {
  border-bottom: var(--middle-border);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: start;
  height: 30px;
  padding: 0;
}
._cal_col button {
  color: var(--font-color)!important;
}
._cal_col:last-child {
  border: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
._cal_col button:last-child {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  text-align: end;
}
._selected_date {
  background-color: var(--selected-date-bg-color) !important;
  pointer-events: none;
  cursor: not-allowed;
  box-shadow: var(--task-inset-shadow);
  -webkit-box-shadow: var(--task-inset-shadow);
}
._sunday {
  background-color: var(--sunday-bg-color);
}
._saturday {
  background-color: var(--saturday-bg-color);
}
._holiday {
  background-color: var(--sunday-bg-color);
}
#tasks-box {
  width: calc(100% - 110px);
  border-radius: 10px;
  position: relative;
  border: var(--middle-border);
  min-height: 500px;
  padding: 20px 10px;
}
#tasks {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px 10px;
  padding: 0 0 15px;
}
#sub-date {
  height: 30px;
}
#completed-rate {
  padding-left: 5px;
  font-size: 1rem;
}
#completed-rate-text-parent {
  font-size: 0.9rem;
  margin: 0 15px 0 10px;
}
._completed_rate_text,
._task_count_text {
  display: inline-block;
  margin: 0 8px;
  font-size: 1.4rem;
}
#all-completed-btn {
  margin-left: 5px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 6px double rgb(150, 150, 150);
  background-color: transparent;
  color: var(--all-completed-color);
  position: relative;
}
#all-completed-btn~span {
  display: inline-block;
  margin-left: 5px;
  font-size: 0.8rem;
}
#all-completed-btn-check {
  position: absolute;
  display: inline-block;
  top: 0;
  left: -3px;
  font-weight: bold;
  font-size: 36px;
  line-height: 0;
}
._not_all_completed:hover {
  animation-name: compAllBtnAnimation;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}
#month-box-sm {
  display: none;
}
@keyframes compAllBtnAnimation {
  0% {}
  100% {
    background-color: var(--comp-btn-animation-color);
    border-color: var(--comp-btn-animation-color);
    color: var(--all-completed-color);
  }
}
._is_all_completed {
  background-color: var(--comp-btn-animation-color) !important;
  border-color: var(--comp-btn-animation-color) !important;
  color: var(--all-completed-color) !important;
}
@media (max-width: 1550px) {
  #tasks {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1200px) {
  #dates-tasks {
    width: 90px;
  }
  #year-box {
    font-size: 1rem;
  }
}

@media (max-width: 960px) {
  #dates-tasks {
    width: 90px;
  }
  #year-box {
    font-size: 1rem;
  }
  #tasks-box {
    width: calc(100% - 100px);
  }
  #tasks {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 867.5px) {
  #task-count-parent {
    text-align: right;
    margin-right: 12px;
  }
  #completed-rate-text-parent {
    text-align: right;
  }
}
@media (max-width: 768px) {
  ._simple_btn_parent {
    height: 36px;
    display: flex;
    justify-content: end;
  }
  ._toggle_simple_display_btn {
    position: static;
    transform: scale(0.8);
  }
  ._toggle_register_display_btn {
    position: static;
    transform: scale(0.8);
  }
}
@media (max-width: 576px) {
  ._simple_btn_parent {
    margin-right: 8px;
    margin-top: 8px;
  }
  #tasks-parent {
    padding: 0 0 15px;
    flex-direction: column !important;
  }
  #dates-tasks {
    width: 75px;
  }
  #year-container {
    padding: 0 5px;
  }
  #year-box {
    font-size: 0.9rem;
  }
  #month-box div {
    margin-right: 8px;
  }
  ._month_text {
    font-size: 1.3rem;
  }
  #dates-tasks {
    width: 100%;
  }
  #year-text {
    font-size: 1rem;
  }
  #month-box-sm {
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: var(--middle-border) !important;
  }
  #month-text-sm {
    font-size: 1.7rem;
  }
  #mon-sm {
    height: 40% !important;
  }
  #month-container {
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 75px;
  }
  #month-header {
    display: none !important;
  }
  #prev-next-container {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  ._prev_btn {
    border-bottom-left-radius: 0;
  }
  ._next_btn {
    border-bottom-right-radius: 0;
  }
  #cal-table {
    overflow-x: scroll;
    border-radius: 0;
  }
  #cal-inner-table {
    display: flex;
    width: auto;
    height: 70px;
    min-width: 1400px;
  }
  ._cal_col {
    width: 50px;
    height: 100%;
    border-right: var(--middle-border);
  }
  ._cal_col:last-child {
    border-right: none;
    border-radius: 0;
  }
  ._cal_col button {
    padding: 0 10px 0 0;
    text-align: center;
  }
  #tasks {
    padding: 0 0 15px;
  }
  #tasks-box {
    border: none;
    border-radius: 0;
    width: 100%;
    margin-top: 20px;
    padding: 5px;
  }
  h4 {
    font-size: 1.2rem;
  }
  ._prev_btn_parent,
  ._next_btn_parent {
    height: 27px;
    width: 27px;
  }
  #task-count-and-rate {
    flex-direction: column;
  }
  #all-completed-btn~span {
    margin-left: 4px;
    font-size: 1rem;
  }
  #completed-rate-text-parent {
    font-size: 1rem;
    margin-left: 5px;
  }
  #completed-rate {
    margin-left: 15px;
  }
  #completed-rate-text-parent {
    margin: 0 12px 0 6px;
  }
  ._completed_rate_text,
  ._task_count_text {
    display: inline-block;
    margin: 0 4px;
    font-size: 1.4rem;
  }
}

@media (max-width: 500px) {
  #tag-btns-parent {
    padding-left: 10px!important;
    padding-right: 10px!important;
  }
  #completed-rate {
    padding: 0;
  }
  #completed-rate {
    margin-left: 10px;
  }
  #task-count-parent {
    margin: 0;
  }
  #task-count-and-rate {
    margin-right: 10px;
  }
  #completed-rate-text-parent {
    margin: 0;
  }
}
</style>
