<script setup lang="ts">
import type {User} from "~/interfaces";

const props = defineProps({
  user: {
    type: Object as () => User | null,
    default: () => {}
  },
  goalTitle: {
    type: String,
  },
  goalDescription: {
    type: String,
  }
})

const toGoalEditEvent = (e: Event) => {
  e.preventDefault()
  navigateTo('/goals/edit/' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1))
}

const showBtnIsShow = ref(false)
const showBtnIsHidden = ref(false)
const showBtnClick = () => {
  if (showBtnIsShow.value) {
    showBtnIsShow.value = false
    showBtnIsHidden.value = true
  } else {
    showBtnIsHidden.value = false
    showBtnIsShow.value = true
  }
}
</script>

<template>
  <div id="goals">
    <div id="goal-container">
      <div id="goal-box" :class="{'_out_of_trial' : user?.role === 'ROLE_FREE_MEMBER' && !user?.trial}" class="mt-4 d-flex justify-content-center align-items-center flex-column shadow-sm">
        <div id="goal-top-text" v-if="!(user?.role === 'ROLE_FREE_MEMBER' && !user?.trial)">
          今月の目標
        </div>
        <div id="goal-title-parent" class="d-flex w-100 align-items-center">
          <div v-if="user?.role === 'ROLE_PAID_MEMBER' || (user?.role === 'ROLE_FREE_MEMBER' && user?.trial)" class="d-flex w-100 align-items-center">
            <div id="goal-title-title">タイトル：</div>
            <div id="goal-title" :class="{'_goal_title': goalTitle}">{{goalTitle}}</div>
            <button @click="toGoalEditEvent" id="to-goal-edit" class="btn _btn_goals btn-sm shadow-sm">編集</button>
          </div>
          <div v-if="user?.role === 'ROLE_FREE_MEMBER' && !user?.trial" class="d-flex flex-column w-100 align-items-center">
            <div id="goal-free" class="text-center my-2">トライアル期間終了後はご利用できません</div>
            <div class="d-flex justify-content-center my-2">
              <NuxtLink to="/subscription/register/register" id="toUpgradeBtn" class="text-center _normal_link">目標を設定するには</NuxtLink>
            </div>
          </div>
        </div>
        <div v-if="user?.role === 'ROLE_PAID_MEMBER' || (user?.role === 'ROLE_FREE_MEMBER' && user?.trial)" id="goal-description-parent" class="d-flex w-100 mt-2 py-2">
          <div id="goal-description-title">　　詳細：</div>
          <div id="goal-description" :class="{'_goal_description_wrap': !showBtnIsShow}">{{goalDescription}}</div>
          <div id="show-btn-parent">
            <button @click="showBtnClick" id="showBtn" :class="{'_show_btn_is_show': showBtnIsShow, '_show_btn_is_hidden': showBtnIsHidden}" class="_show_btn">&#9660;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#goal-container {
  width: 100%;
  padding: 0;
}
#goal-box {
  width: 100%;
  margin: 0;
  padding: 16px 20px;
  border: var(--thick-border);
  border-radius: 10px;
  position: relative;
  background-color: var(--card-bg-color);
}

#goal-top-text {
  width: 120px;
  text-align: center;
  margin: 0;
  font-size: 1.2rem;
  position: absolute;
  top: -16px;
  background-color: var(--card-bg-color);
}

#goal-description-parent {
  border-top: var(--middle-border);
}

#goal-title-title,
#goal-description-title {
  width: 90px;
  font-size: 0.9rem;
}

#goal-title {
  width: calc(100% - 130px);
  font-size: 1rem !important;
  font-weight: bold;
  overflow-wrap: break-word;
  font-style: italic;
}

#to-goal-edit {
  width: 3rem;
  margin: 0 5px;
}
#goal-description {
  width: calc(100% - 90px);
  font-size: 0.9rem;
  margin-right: 10px;
}

._goal_description_wrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: calc(100% - 70px);
}

._out_of_trial {
  border-color: var(--bs-red)!important;
  background-color: var(--alert-bg-color) !important;
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

@media (max-width: 1000px) {
  #goal-container {
    width: 100%;
  }

  #goal-box {
    padding: 16px 40px;
  }
}

@media (max-width: 576px) {
  #goal-container {
    width: 100%;
    padding: 0;
  }
  #goal-box {
    width: 100%;
    padding: 25px 20px;
  }
  #goal-title-title {
    width: 70px;
  }
  #goal-description-title {
    width: 70px;
  }
  #goal-title {
    width: calc(100% - 110px);
    font-size: 0.9rem;
  }
  #goal-description {
    font-size: 0.8rem;
    width: calc(100% - 100px);
  }
}

</style>
