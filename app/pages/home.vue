<script setup lang="ts">
import type {Task, User} from "~/interfaces";

definePageMeta({
  middleware: ["auth", "home"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Home",
})

const token = useCookie('__yarucoto')

const user = useState<User>('auth-user')
const stateHomeTasks = useState<Task[] | null>('homeTasks')
const stateGoalTitle = useState<string>('goalTitle')
const stateGoalDescription = useState<string>('goalDescription')

const route = useRoute()
const path = route.path

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const now = new Date()
const weekday = useCreateWeekday(now)
const today = ref<string>(useGetTodayStr() + weekday)

const putToggleCompletedUrl = baseUrl + '/tasks/put/toggleCompleted'

const modalShow = ref(false)
const modalMessage = ref('送信に失敗しました')

const afterLoad = ref(false)

const goalTitle = computed(() => stateGoalTitle.value ?? '設定されていません')
const goalDescription = computed(() => stateGoalDescription.value ?? '設定されていません')

const tasks = ref<Task[]>([])// 昨日から明日までのタスクを格納する
const todayTasks = ref<Task[]>([]) // 今日のタスクのみを格納する
const didTasks = ref<Task[]>([])
const willDoTasks = ref<Task[]>([])
const doingTasks = ref<Task[]>([])
const noTimeTasks = ref<Task[]>([])

const didTime = ref(1)
const willDoTime = ref(1)

watch(didTime, () => {
  selectDidTime()
})
watch(willDoTime, () => {
  selectWillDoTime()
})

const completedRate = computed(() => {
  if (taskCount.value === 0) return 0
  return Math.round(completedCount.value / taskCount.value * 100)
})
const taskCount = ref(0)
const completedCount = ref(0)

const fixedSetCompTextHidden = ref(true)
const fixedRemoveCompTextHidden = ref(true)

const setCompleteRef = ref<HTMLElement | null>(null)
const setCompleteMouseover = (flag: boolean) => {
  fixedRemoveCompTextHidden.value = true
  if (flag) {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!setCompleteRef.value) return
      setCompleteRef.value.style.top = e.clientY - 20 + 'px'
      setCompleteRef.value.style.left =  e.clientX + 20 + 'px'
    })
    fixedSetCompTextHidden.value = false
  } else {
    fixedSetCompTextHidden.value = true
  }
}
const removeCompleteRef = ref<HTMLElement | null>(null)
const removeCompleteMouseover = (flag: boolean) => {
  fixedSetCompTextHidden.value = true
  if (flag) {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!removeCompleteRef.value) return
      removeCompleteRef.value.style.top = e.clientY - 20 + 'px'
      removeCompleteRef.value.style.left =  e.clientX + 20 + 'px'
    })
    fixedRemoveCompTextHidden.value = false
  } else {
    fixedRemoveCompTextHidden.value = true
  }
}

const toggleRes = ref('')
const toggleEvent = async (toggleReq: { id: number, completed: boolean}) => {
  try {
    const params: { taskId: number } = {taskId: Number(toggleReq.id)}
    const res = await $fetch(putToggleCompletedUrl, {
      method: 'PUT',
      body: params,
      headers:{
        Authorization: `Bearer ${token.value}`
      },
      key: putToggleCompletedUrl
    }) as any
    if (res === 'illegal') navigateTo('/not-allowed')
    toggleRes.value = res
    if (toggleRes.value === 'success') {
      for (const task of tasks.value) {
        if (Number(task.id) === Number(toggleReq.id)) {
          if (task.completed) {
            if (toggleReq.completed && task.dueDate === useMakeDateStrFromDate(new Date)) {
              completedCount.value--
            }
            task.completed = false
          } else {
            if (!toggleReq.completed && task.dueDate === useMakeDateStrFromDate(new Date)) {
              completedCount.value++
            }
            task.completed = true
          }
        }
      }
      stateHomeTasks.value = tasks.value
    } else {
      modalShow.value = true
      modalMessage.value = '送信に失敗しました'
      stateHomeTasks.value = null
      setTimeout(() => {
        modalShow.value = false
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
   useErrorEvent(error)
  }
}

// tasksから各tasksリストを作成する関数
const createTasks = () => {
  // 完了にする・未完了にするモーダルを隠す
  fixedSetCompTextHidden.value = true
  fixedRemoveCompTextHidden.value = true
  // タスク情報を初期化する
  didTasks.value.length = 0
  willDoTasks.value.length = 0
  doingTasks.value.length = 0
  noTimeTasks.value.length = 0
  taskCount.value = 0
  completedCount.value = 0

  // 今日の日付をハイフン区切り文字列として取得
  const nowDate = new Date()
  const nowStr = useMakeDateStrFromDate(nowDate)
  for (const task of tasks.value) {
    const dueDateStr: string = task.dueDate as string // taskの日付を取得
    if (dueDateStr === nowStr) taskCount.value++ // タスクが今日の日付ならtaskCountに1加算する
    todayTasks.value.push(task) // todayTasksにプッシュする
    if (dueDateStr === nowStr && task.completed) completedCount.value++ // 完了済のタスクならcompletedCountに１加算する
    if (dueDateStr === nowStr && !task.dueStartTime) {
      noTimeTasks.value.push(task) // 時間指定がない場合はnoTimeTasksにプッシュしてcontinueする
      continue
    }

    // 開始時間を文字列にする
    const dueStartTimeStr: string = task.dueStartTime ? task.dueStartTime as string : '00:00'
    // 開始時間の時間だけ取得
    const dueStartHour: string = dueStartTimeStr ? dueStartTimeStr.split(':')[0] as string : ''
    // 開始時間の分だけ取得
    const dueStartMinute: string = dueStartTimeStr ? dueStartTimeStr.split(':')[1] as string : ''
    const dueStartTimeDate = new Date( // 開始時間をDate型で生成
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
        Number(dueStartHour),
        Number(dueStartMinute),
        0
    )
    const didTimeDate = new Date( // 過去のタスクをDate型で取得
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
        nowDate.getHours() - Number(didTime.value),
        nowDate.getMinutes(),
        0
    )
    const willDoDate = new Date( // 未来のタスクをDate型で取得
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
        nowDate.getHours() + Number(willDoTime.value),
        nowDate.getMinutes(),
        0
    )
    if (dueDateStr === nowStr) {
      // willDoTasksにプッシュする
      if (dueStartTimeDate < willDoDate && nowDate < dueStartTimeDate) willDoTasks.value.push(task)

      if (!task.dueEndTime) {
        // 終了時間の指定がない場合、didTasksにプッシュする
        if (dueStartTimeDate > didTimeDate && nowDate > dueStartTimeDate) didTasks.value.push(task)
        continue
      }
      // 終了時間を文字列で取得
      const dueEndTimeStr: string = task.dueEndTime ? task.dueEndTime as string : '00:00'
      // 終了時間の時間のみを取得
      const dueEndHour: string = dueEndTimeStr ? dueEndTimeStr.split(':')[0] as string : ''
      // 終了時間の分のみを取得
      const dueEndMinute: string = dueEndTimeStr ? dueEndTimeStr.split(':')[1] as string : ''
      const dueEndTimeDate = new Date( // 終了時間をDate型で生成
          nowDate.getFullYear(),
          nowDate.getMonth(),
          nowDate.getDate(),
          Number(dueEndHour),
          Number(dueEndMinute),
          0
      )
      // 終了時間が開始時間よりも前の場合は、日をまたいでいるので、終了時間Dateを翌日に設定する
      if (dueEndTimeDate < dueStartTimeDate) dueEndTimeDate.setDate(dueEndTimeDate.getDate() + 1)
      // 現在実行中のタスクはdoingTasksにプッシュする
      if (dueStartTimeDate < nowDate && nowDate < dueEndTimeDate) doingTasks.value.push(task)
      // didTasksにプッシュする
      if (dueEndTimeDate > didTimeDate && nowDate > dueEndTimeDate) didTasks.value.push(task)
    } else { // タスクの日付が今日でない場合
      const yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      const yesterdayStr = useMakeDateStrFromDate(yesterdayDate)
      const tomorrowDate = new Date()
      tomorrowDate.setDate(tomorrowDate.getDate() + 1)
      const tomorrowStr = useMakeDateStrFromDate(tomorrowDate)
      if (yesterdayStr === dueDateStr) { // 昨日のタスクの場合
        if (!task.dueEndTime) continue
        // 終了時間を文字列で取得
        const dueEndTimeStr: string = task.dueEndTime ? task.dueEndTime as string : '00:00'
        // 終了時間の時間のみを取得
        const dueEndHour: string = dueEndTimeStr ? dueEndTimeStr.split(':')[0] as string : ''
        // 終了時間の分のみを取得
        const dueEndMinute: string = dueEndTimeStr ? dueEndTimeStr.split(':')[1] as string : ''
        const dueEndTimeDate = new Date( // 終了時間をDate型で生成
            nowDate.getFullYear(),
            nowDate.getMonth(),
            nowDate.getDate(),
            Number(dueEndHour),
            Number(dueEndMinute),
            0
        )
        if (task.dueStartTime !== undefined && nowDate < dueEndTimeDate && // 現在時刻が終了時刻よりも前
            (Number(dueStartHour) > Number(dueEndHour) || // 開始時刻が終了時刻よりも後
                (Number(dueStartHour) === Number(dueEndHour) && Number(dueStartMinute) > Number(dueEndMinute))
            )
        ) {
          doingTasks.value.push(task) // 実行中のタスクに追加する
        } else if (task.dueStartTime !== undefined && dueEndTimeDate > didTimeDate && nowDate > dueEndTimeDate &&
            (Number(dueStartHour) > Number(dueEndHour) || // 開始時刻が終了時刻よりも後
                (Number(dueStartHour) === Number(dueEndHour) && Number(dueStartMinute) > Number(dueEndMinute))

        )) {
          didTasks.value.push(task)
        }
      } else if(tomorrowStr === dueDateStr) {// 日付が明日の場合
        dueStartTimeDate.setDate(dueStartTimeDate.getDate() + 1)
        if (dueStartTimeDate < willDoDate && nowDate < dueStartTimeDate) {
          willDoTasks.value.push(task)
        }
      }
    }
  }
}

const selectDidTime = () => {
  createTasks()
}
const selectWillDoTime = () => {
  createTasks()
}

const noTimeTasksShow = ref(false)
const noTimeTasksHidden = ref(false)

const noTimeTaskShowEvent = () => {
  if (noTimeTasksShow.value) {
    noTimeTasksShow.value = false
    noTimeTasksHidden.value = true
  } else {
    noTimeTasksHidden.value = false
    noTimeTasksShow.value = true
  }
}

onMounted(async () => {
  tasks.value = stateHomeTasks.value ?? []
  createTasks()
  afterLoad.value = true
})

</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div id="main-child" v-show="afterLoad">
        <div id="today" class="text-center" v-html="today"></div>
        <div id="main-title" class="d-flex justify-content-center">
          <h3><span id="nickname">{{user?.nickname ? user?.nickname : 'あだ名不明'}}</span>さんのマイページ</h3>
        </div>
        <div id="home-container">
          <div v-if="user === null" class="w-100 d-flex justify-content-center flex-column">
            <h3 class="my-5 text-center">ユーザー情報の取得に失敗しました</h3>
            <p class="text-center">ログアウトしてから再度ログインしてください</p>
            <LogoutBtn></LogoutBtn>
          </div>
          <div v-else id="user-info-container">
            <HomeGoalContainer :user="user" :goalTitle="goalTitle" :goalDescription="goalDescription" class="_fadein"></HomeGoalContainer>
            <div id="tasks-container" class="d-flex justify-content-start align-items-center flex-column _fadein">
              <div id="task-top-text">
                今日のタスク
              </div>
              <div id="tasks-box" class="mt-4 d-flex shadow">
                <div id="tasks-parent">
                  <div id="task-count-parent" class="shadow-sm">
                    <div class="d-flex w-100">
                      <div class="_task_count_text">現在の達成率：</div>
                      <div id="completed-rate" class="_task_count_math" :class="{'_completed_text' : completedRate === 100}">{{completedRate}}</div>
                      <div :class="{'_completed_text' : completedRate === 100}">%</div>
                    </div>
                    <div class="d-flex w-100">
                      <div class="_task_count_text">タスク数：</div>
                      <div id="task-count" class="_task_count_math">{{taskCount}}</div>
                    </div>
                    <div class="d-flex w-100">
                      <div class="_task_count_text">完了済み：</div>
                      <div id="completed-count" class="_task_count_math">{{completedCount}}</div>
                    </div>
                  </div>
                  <div id="tasks-did" class="mt-4">
                    <h6 class="mb-3">実行終了したタスク</h6>
                    <h6>（
                      <select id="taskDidSelect" v-model="didTime" class="form-select form-select-sm shadow-sm">
                        <option value="1" selected>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                      </select>時間前までに）
                    </h6>
                    <transition-group name="task-list" tag="div" class="mt-2">
                      <HomeTask @toggleEvent="toggleEvent" @setCompleteMouseover="setCompleteMouseover" @removeCompleteMouseover="removeCompleteMouseover" v-for="task in didTasks" key="task.id" :task="task"></HomeTask>
                    </transition-group>
                    <HomeNoTasks v-if="didTasks.length === 0"></HomeNoTasks>
                  </div>
                  <div id="tasks-will-do" class="mt-4">
                    <h6 class="mb-3">もうすぐ実行するタスク</h6>
                    <h6>（
                      <select id="taskWillDoSelect" v-model="willDoTime" class="form-select form-select-sm shadow-sm">
                        <option value="1" selected>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                      </select>時間以内）
                    </h6>
                    <transition-group name="task-list" tag="div" class="mt-2">
                      <HomeTask @toggleEvent="toggleEvent" @setCompleteMouseover="setCompleteMouseover" @removeCompleteMouseover="removeCompleteMouseover" v-for="task in willDoTasks" key="task.id" :task="task"></HomeTask>
                    </transition-group>
                    <HomeNoTasks v-if="willDoTasks.length === 0"></HomeNoTasks>
                  </div>
                  <div id="tasks-doing" class="mt-4">
                    <h6 class="mb-3">実行中のタスク</h6>
                    <transition-group name="task-list" tag="div" class="mt-2">
                      <HomeTask @toggleEvent="toggleEvent" @setCompleteMouseover="setCompleteMouseover" @removeCompleteMouseover="removeCompleteMouseover" v-for="task in doingTasks" key="task.id" :task="task"></HomeTask>
                    </transition-group>
                    <HomeNoTasks v-if="doingTasks.length === 0"></HomeNoTasks>
                  </div>
                  <div id="tasks-no-time" class="mt-4">
                    <div class="d-flex justify-content-between align-items-center">
                      <h6 class="mb-3">時間設定のないタスク</h6>
                      <button class="_show_btn mb-3" @click="noTimeTaskShowEvent" :class="{'_show_btn_is_show': noTimeTasksShow, '_show_btn_is_hidden': noTimeTasksHidden}">&#9660;</button>
                    </div>
                    <div v-show="noTimeTasksShow" class="_no_time_fadein">
                      <transition-group name="task-list" tag="div" class="mt-2">
                        <HomeTask @toggleEvent="toggleEvent" @setCompleteMouseover="setCompleteMouseover" @removeCompleteMouseover="removeCompleteMouseover" v-for="task in noTimeTasks" key="task.id" :task="task"></HomeTask>
                      </transition-group>
                      <HomeNoTasks v-if="noTimeTasks.length === 0"></HomeNoTasks>
                    </div>
                  </div>
                  <div class="w-100 d-flex justify-content-center">
                    <NuxtLink id="linkToCalendarBtn" to="/tasks/list" class="btn _btn_primary my-4 shadow-sm">全タスクを確認</NuxtLink>
                  </div>
                </div>
                <div id="chart-parent" class="d-flex justify-content-center">
                  <div v-if="todayTasks.length === 0" id="chart" class="d-flex justify-content-center align-items-center flex-column w-100">
                    <h6>今日のタスクはまだありません</h6>
                  </div>
                  <div v-if="todayTasks.length > 0" id="chart">
                    <client-only>
                      <HomePieChart :completedCount="completedCount" :taskCount="taskCount" :data="todayTasks"></HomePieChart>
                    </client-only>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <HomeLinks></HomeLinks>
        </div>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <div ref="setCompleteRef" id="set-complete" :class="{ '_hidden' : fixedSetCompTextHidden }">
    <div class="_set_complete_text">
      完了にする
    </div>
  </div>

  <div ref="removeCompleteRef" id="remove-complete" :class="{ '_hidden' : fixedRemoveCompTextHidden }">
    <div class="_remove_complete_text">
      未完了に戻す
    </div>
  </div>

  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
@import "~/assets/css/set_remove_windows.css";
.task-list-enter-active, .task-list-leave-active {
  transition: all 0.5s;
}
.task-list-enter-from, .task-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
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
._fadein {
  opacity: 0;
  animation-name: fadein;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-delay: calc(sibling-index() * 0.1s);
}
@keyframes fadein {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
._no_time_fadein {
  animation-name: noTimeFadein;
  animation-duration: 0.5s;
}
@keyframes noTimeFadein {
  0% {opacity: 0; transform: translateX(20px);}
  100% {opacity: 1;}
}
._completed_text {
  color: var(--completed-color);
  font-weight: bold;
}
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#main-title h3 {
  margin-top: 48px;
  margin-bottom: 0;
  position: relative;
}

#today {
  position: absolute;
  top: 30px;
  right: 40px;
  font-size: 1.3rem;
}

#home-container {
  display: flex;
}

#user-info-container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin: 20px 0 10px;
  padding: 0 20px;
  width: 720px;
  min-width: 720px;
}

._show_btn {
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: none;
  color: var(--font-color);
}
._show_btn_is_show {
  animation-name: showBtnShowAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes showBtnShowAnimation {
  0% {transform: rotate(0);}
  100% {transform: rotate(180deg);}
}
._show_btn_is_hidden {
  animation-name: showBtnHiddenAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes showBtnHiddenAnimation {
  0% {transform: rotate(180deg);}
  100% {transform: rotate(0);}
}

#tasks-container {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
}

#tasks-box {
  width: 100%;
  margin: 0;
  padding: 30px 0 30px 20px;
  border: var(--thick-border);
  border-radius: 10px;
  background-color: var(--card-bg-color);
}

#task-top-text {
  width: 140px;
  text-align: center;
  margin: 0;
  font-size: 1.2rem;
  position: absolute;
  top: 7px;
  background-color: var(--card-bg-color);
}

#tasks-parent {
  width: calc(100% - 300px);
}

#taskWillDoSelect,
#taskDidSelect {
  width: 60px;
  display: inline-block !important;
}

#task-count-parent {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: var(--middle-border);
  padding: 10px 20px;
}

._task_count_text {
  width: 120px;
  text-align: end;
}

._task_count_math {
  width: 50px;
  text-align: end;
}

#linkToCalendarBtn {
  width: 160px;
  border-radius: 20px;
}

#chart-parent {
  width: 300px;
}
#chart {
  width: 80%;
  max-height: 300px;
  margin-top: 20px;
}

@media (max-width: 1080px) {
  #home-container {
    flex-direction: column;
    width: 100%;
  }
  #user-info-container {
    width: 100%;
    min-width: auto;
  }
  #tasks-container {
    width: 100%;
  }
  #tasks-box {
    padding: 30px 0 16px 40px;
  }
}

@media (max-width: 960px) {
  #today {
    top: 15px;
  }
  #linkToCalendarBtn {
    width: 100%;
  }
}

@media (max-width: 768px) {
  #user-info-container {
    padding: 0 0.8rem;
  }
  #tasks-container {
    padding: 0;
  }
  #tasks-box {
    padding: 30px 0 16px 10px;
  }
  #tasks-parent {
    width: calc(100% - 250px);
  }
  #chart-parent {
    width: 250px;
  }
}
@media (max-width: 576px) {
  #main-title h3 {
    width: 90%;
    font-size: 1.3rem;
    text-align: center;
  }
  #today {
    top: 20px;
    left: 0;
    width: 100%;
    font-size: 1.1rem;
  }
  #tasks-box {
    flex-direction: column;
    align-items: center;
    padding: 30px 10px;
  }
  #tasks-parent {
    width: 100%;
  }
  #chart-parent {
    width: 300px;
  }
  ._task_count_text {
    width: 50%;
  }
}

</style>
