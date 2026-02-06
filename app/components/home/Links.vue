<script setup lang="ts">

</script>

<template>
  <div id="links-container" class="d-flex justify-content-center">
    <div id="links">
      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/tasks/register" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/task-a.png" width="32" alt="" class="_link_icon">タスクの追加
            </h6>
            <div class="_link_card_text">
              タスクを追加しましょう。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/tasks/list" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/calendar.png" width="32" alt="" class="_link_icon">今日のタスク
            </h6>
            <div class="_link_card_text">
              今日のタスクを確認しましょう。カレンダーから別の日付のタスクも確認できます。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/routines/list" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/routine.png" width="32" alt="" class="_link_icon">ルーティーン
            </h6>
            <div class="_link_card_text">
              ルーティーンを確認・追加しましょう。曜日を指定して繰り返しタスクを作成できます。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/tags/list" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/tag.png" width="32" alt="" class="_link_icon">タグの設定
            </h6>
            <div class="_link_card_text">
              タグを確認・追加しましょう。タスクを分類して管理しやすくなります。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/goals/list" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/goal.png" width="32" alt="" class="_link_icon">目標の設定
            </h6>
            <div class="_link_card_text">
              月ごとの目標の確認・追加・編集をしましょう。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/evaluations/list" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/star.png" width="32" alt="" class="_link_icon">月ごとの評価一覧
            </h6>
            <div class="_link_card_text">
              過去の達成率に対する月ごとの自己評価の設定・確認をしましょう。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/past-completed-rate" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/rate.png" width="32" alt="" class="_link_icon">達成率の確認
            </h6>
            <div class="_link_card_text">
              過去の達成率と自己評価の設定をしましょう。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/user/profile" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/user.png" width="32" alt="" class="_link_icon">会員情報
            </h6>
            <div class="_link_card_text">
              会員情報を確認・設定しましょう。
            </div>
          </NuxtLink>
        </transition>
      </div>

      <div class="_link_card_parent">
        <transition>
          <NuxtLink to="/information/list" class="_link_card shadow-sm">
            <h6>
              <img src="~/assets/images/info.png" width="32" alt="" class="_link_icon">お知らせ
            </h6>
            <div class="_link_card_text">
              お知らせを確認しましょう。
            </div>
          </NuxtLink>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
#links-container {
  padding: 0 20px 0 0;
  margin: 40px 0 10px;
}

#links {
  width: 100%;
  height: 620px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px
}

._link_card_parent {
  height: 200px;
  opacity: 0;
  animation-name: linkCardAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-delay: calc(sibling-index() * 0.1s);
}
@keyframes linkCardAnimation {
   0% {opacity: 0;}
   100% {opacity: 1;}
}
a._link_card {
  display: block;
  border: var(--thick-border);
  border-radius: 10px;
  text-decoration: none;
  padding: 20px;
  height: 100%;
  background-color: var(--card-bg-color);
}

a._link_card:any-link {
  color: var(--font-color);
}

a._link_card:hover {
  color: var(--font-color);
  animation-name: linkCardHoverAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

img._link_icon {
  margin-bottom: 5px;
  margin-right: 5px;
}

@keyframes linkCardHoverAnimation {
  0% {}
  100% {
    background-color: var(--button-hoverd-bg-color);
    transform: translateY(10px);
  }
}

._link_card_text {
  font-size: 0.8rem;
  border-top: var(--middle-border);
  margin-top: 10px;
  padding-top: 10px;
}

._link_card_fadein {
  animation-name: linkCardFadeInAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes linkCardFadeInAnimation {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
  }
}

@media (max-width: 1600px) {
  #links {
    grid-template-columns: 1fr 1fr;
    height: 990px;
  }

  ._link_card_parent {
    height: 190px;
  }
}

@media (max-width: 1400px) {
  #links {
    grid-template-columns: 1fr;
    height: 1250px;
    gap: 10px;
  }
  ._link_card_parent {
    height: 130px;
  }
  ._link_card {
    padding: 15px !important;
  }
  ._link_card h6 {
    margin: 0;
  }
  ._link_card_text {
    margin: 0;
  }
}

@media (max-width: 1200px) {
  #links {
    height: 1700px;
  }
  ._link_card_parent {
    height: 180px;
  }
}

@media (max-width: 1080px) {
  #links-container {
    padding: 0 10px;
    height: auto;
    margin-top: 10px;
  }
  #links {
    padding: 0 10px;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    height: auto;
  }
  ._link_card_parent {
    height: 150px;
  }
}

@media (max-width: 960px) {
  #links {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  #links-container {
    margin-top: 20px;
  }
  #links {
    padding: 0;
  }
}
@media (max-width: 576px) {
  #links-container {
    margin-top: 0;
    padding: 0 10px;
  }
  #links {
    width: 100%;
    grid-template-columns: 1fr;
    padding: 0;
    gap: 5px;
  }
  ._link_card_parent {
    padding: 5px 0;
    height: 120px;
  }
}

</style>
