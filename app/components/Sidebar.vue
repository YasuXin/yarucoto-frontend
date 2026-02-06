<script setup lang="ts">
import type {Information} from '~/interfaces'

const props = defineProps({
  current: {
    type: String,
    default: ''
  }
})

const homeHidden = ref(true)
const taskRegisterHidden = ref(true)
const taskListHidden = ref(true)
const routineListHidden = ref(true)
const tagListHidden = ref(true)
const goalListHidden = ref(true)
const evaluationListHidden = ref(true)
const pcrHidden = ref(true)
const userProfileHidden = ref(true)
const informationHidden = ref(true)

const currentHome = ref(false)
const currentTaskRegister = ref(false)
const currentTaskList = ref(false)
const currentRoutineList = ref(false)
const currentTagList = ref(false)
const currentGoalList = ref(false)
const currentEvaluationList = ref(false)
const currentPCRList = ref(false)
const currentUserProfileList = ref(false)
const currentInformationList = ref(false)

if (props.current.startsWith('/home')) {
  currentHome.value = true
} else if (props.current.startsWith('/tasks/register')) {
  currentTaskRegister.value = true
} else if (props.current.startsWith('/tasks')) {
  currentTaskList.value = true
} else if (props.current.startsWith('/routines')) {
  currentRoutineList.value = true
} else if (props.current.startsWith('/tags')) {
  currentTagList.value = true
} else if (props.current.startsWith('/goals')) {
  currentGoalList.value = true
} else if (props.current.startsWith('/evaluations')) {
  currentEvaluationList.value = true
} else if (props.current.startsWith('/past-completed-rate')) {
  currentPCRList.value = true
} else if (props.current.startsWith('/user/profile')) {
  currentUserProfileList.value = true
} else if (props.current.startsWith('/information')) {
  currentInformationList.value = true
}

const homeMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  homeHidden.value = false
  setTimeout(() => {homeHidden.value = true}, 3000)
}

const taskRegisterMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  taskRegisterHidden.value = false
  setTimeout(() => {taskRegisterHidden.value = true}, 3000)
}

const taskListMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  taskListHidden.value = false
  setTimeout(() => {taskListHidden.value = true}, 3000)
}

const routineListMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  routineListHidden.value = false
  setTimeout(() => {routineListHidden.value = true}, 3000)
}

const tagListMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  tagListHidden.value = false
  setTimeout(() => {tagListHidden.value = true}, 3000)
}

const goalListMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  goalListHidden.value = false
  setTimeout(() => {goalListHidden.value = true}, 3000)
}

const evaluationListMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  evaluationListHidden.value = false
  setTimeout(() => {evaluationListHidden.value = true}, 3000)
}

const pcrMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  pcrHidden.value = false
  setTimeout(() => {pcrHidden.value = true}, 3000)
}

const userProfileMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  userProfileHidden.value = false
  setTimeout(() => {userProfileHidden.value = true}, 3000)
}

const informationMouseEnter = () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) return
  informationHidden.value = false
  setTimeout(() => {informationHidden.value = true}, 3000)
}

const sidebarAbsoluteFixed = ref(false)

window.addEventListener('scroll', () => {
  if(window.innerWidth > 576) {
    if(window.scrollY >= 200) {
      sidebarAbsoluteFixed.value = true
    } else if (window.scrollY < 200) {
      sidebarAbsoluteFixed.value = false
    }
  }
})
window.addEventListener('resize', () => {
  if (window.innerWidth > 1200 || window.innerWidth <= 576) {
    homeHidden.value = true
    taskRegisterHidden.value = true
    taskListHidden.value = true
    routineListHidden.value = true
    tagListHidden.value = true
    goalListHidden.value = true
    evaluationListHidden.value = true
    pcrHidden.value = true
    userProfileHidden.value = true
    informationHidden.value = true
  }
})

const stateInformationArr = useState<Information[]>('informationArr') as Ref<Information[]>
const hasNewInformation = computed(() => stateInformationArr?.value?.some(info => info.newInformation))

</script>

<template>
  <div id="sidebar-relative">
    <div id="sidebar-absolute" class="container my-2 py-1 px-0 rounded shadow" :class="{'_sidebar_fixed': sidebarAbsoluteFixed}">
      <nav class="navbar py-0">
        <div class="_sidebar_inner_box">
          <div class="_link_wrapper">
            <div @mouseenter="homeMouseEnter">
              <NuxtLink to="/home" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentHome }" :disable="currentHome">
                <img src="~/assets/images/home.png" width="26" alt=""><span>ホーム</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!homeHidden">
              <div class="_visible_link">ホーム</div>
            </div>
          </div>
        </div>
        <div class="_sidebar_inner_box">
          <div class="_link_wrapper">
            <div @mouseenter="taskRegisterMouseEnter">
              <NuxtLink to="/tasks/register" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentTaskRegister }" :disable="currentTaskRegister">
                <img src="~/assets/images/task-a.png" width="26" alt=""><span>タスクの追加</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!taskRegisterHidden">
              <div class="_visible_link">タスクの追加</div>
            </div>
          </div>
          <div class="_link_wrapper">
            <div @mouseenter="taskListMouseEnter">
              <NuxtLink to="/tasks/list" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentTaskList }" :disable="currentTaskList">
                <img src="~/assets/images/calendar.png" width="26" alt=""><span>タスク一覧</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!taskListHidden">
              <div class="_visible_link">タスク一覧</div>
            </div>
          </div>
          <div class="_link_wrapper">
            <div @mouseenter="routineListMouseEnter">
              <NuxtLink to="/routines/list" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentRoutineList }" :disable="currentRoutineList">
                <img src="~/assets/images/routine-a.png" width="26" alt=""><span>ルーティーン</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!routineListHidden">
              <div class="_visible_link">ルーティーン</div>
            </div>
          </div>
          <div class="_link_wrapper">
            <div @mouseenter="tagListMouseEnter">
              <NuxtLink to="/tags/list" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentTagList }" :disable="currentTagList">
                <img src="~/assets/images/tag.png" width="26" alt=""><span>タグの設定</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!tagListHidden">
              <div class="_visible_link">タグの設定</div>
            </div>
          </div>
        </div>
        <div class="_sidebar_inner_box">
          <div class="_link_wrapper">
            <div @mouseenter="goalListMouseEnter">
              <NuxtLink to="/goals/list" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentGoalList }" :disable="currentGoalList">
                <img src="~/assets/images/goal.png" width="26" alt=""><span>目標の設定</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!goalListHidden">
              <div class="_visible_link">目標の設定</div>
            </div>
          </div>
          <div class="_link_wrapper">
            <div @mouseenter="evaluationListMouseEnter">
              <NuxtLink to="/evaluations/list" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentEvaluationList }" :disable="currentEvaluationList">
                <img src="~/assets/images/star.png" width="26" alt=""><span>月ごとの評価</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!evaluationListHidden">
              <div class="_visible_link">月ごとの評価</div>
            </div>
          </div>
          <div class="_link_wrapper">
            <div @mouseenter="pcrMouseEnter">
              <NuxtLink to="/past-completed-rate" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentPCRList }" :disable="currentPCRList">
                <img src="~/assets/images/rate.png" width="26" alt=""><span>達成率の確認</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!pcrHidden">
              <div class="_visible_link">達成率の確認</div>
            </div>
          </div>
        </div>
        <div class="_sidebar_inner_box">
          <div class="_link_wrapper">
            <div @mouseenter="userProfileMouseEnter">
              <NuxtLink to="/user/profile" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentUserProfileList }" :disable="currentUserProfileList">
                <img src="~/assets/images/user.png" width="26" alt=""><span>会員情報</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!userProfileHidden">
              <div class="_visible_link">会員情報</div>
            </div>
          </div>
          <div class="_link_wrapper">
            <div @mouseenter="informationMouseEnter">
              <NuxtLink to="/information/list" class="navbar-brand container-fluid _sidebar_link" :class="{ '_current_page_button': currentInformationList }" :disable="currentInformationList">
                <img src="~/assets/images/info.png" width="26" alt=""><span :class="{'_new_information' : hasNewInformation}">お知らせ</span>
              </NuxtLink>
            </div>
            <div class="_visible_link_parent shadow navbar-brand" v-show="!informationHidden">
              <div class="_visible_link">お知らせ</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div id="sidebar-space" class="my-2 py-1 px-0"></div>
</template>

<style scoped>
._new_information::after {
  content: '！';
  background-color: var(--bs-danger);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  margin-left: 10px;
  display: inline-block;
}
._link_wrapper {
  position: relative;
}
#sidebar-space {
  width: 140px;
  height: auto;
  min-height: 500px;
  padding: 0 10px;
  margin-left: 16px;
}
#sidebar-relative {
  position: relative;
}
#sidebar-absolute {
  position: absolute;
  top: 7.5px;
  left: 0;
  width: 140px;
  height: 405px;
  background-color: var(--card-bg-color);
  margin-left: 16px;
  z-index: 5;
}

._sidebar_fixed {
  position: fixed!important;
  top: 57px!important;
  animation-name: sidebarFadein;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes sidebarFadein {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

._sidebar_inner_box {
  width: 100%;
  padding: 2px 0;
  margin: 0 5px;
  border-bottom: var(--middle-border);
}
._sidebar_inner_box:last-child {
  border: none;
}
._sidebar_link {
  padding: 0 6px;
  height: 32px;
}

._sidebar_link:hover {
  background-color: var(--button-hoverd-bg-color);
  cursor: pointer;
}

.navbar-brand {
  display: flex;
  align-items: center;
  color: var(--sidebar-link-font-color);
  margin: 0;
  font-size: 0.9rem;
}

._sidebar_link span {
  display:inline-block;
  width:100%;
  margin-left: 5px;
}

._sidebar_link {
  background-color: var(--card-bg-color);
  color: var(--sidebar-link-font-color);
  overflow: hidden;
  position: relative;
  z-index: 1;
}
._sidebar_link::after {
  background: var(--button-hoverd-bg-color);
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  transform: scale(0, 1);
  transform-origin: left top;
  transition: .2s cubic-bezier(0.45, 0, 0.55, 1);
  z-index: 4;
}

._sidebar_link:hover::after {
  transform: scale(1, 1);
}
._current_page_button {
  background-color: var(--button-hoverd-bg-color);
  box-shadow: inset 1px 1px 2px 2px rgba(0,0,0,0.1);
}

@media (max-width: 1200px) {
  ._visible_link_parent {
    position: absolute;
    top: 0;
    left: 50px;
    height: 34px;
    width: 150px;
    background-color: var(--card-bg-color);
    animation-name: visibleLinkAnimation;
    animation-duration: 3s;
    animation-fill-mode: forwards;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  #sidebar-absolute {
    width: 50px;
  }
  ._sidebar_link span {
    display: none;
  }
  #sidebar-space {
    width: 50px;
  }
  ._sidebar_inner_box {
    margin: 0;

  }
  ._sidebar_link {
    padding:0;
    padding-left: 11px;
    padding-right: 11px;
  }
}

@media (max-width: 768px) {
  #sidebar-space, #sidebar-relative {
    display: none;
  }
}

@keyframes visibleLinkAnimation {
  0% {transform: translateX(-66px); opacity: 0;}
  15%{transform: translateX(0); opacity: 1;}
  50%{transform: translateX(0); opacity: 1;}
  100%{transform: translateX(-30px); opacity: 0;}
}
</style>
