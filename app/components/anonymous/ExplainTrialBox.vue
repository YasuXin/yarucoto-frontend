<script setup lang="ts">
const props = defineProps({
  isExplainTrialBoxShow: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-show="props.isExplainTrialBoxShow" id="explain-trial-box" class="_explain_box _explain_text_fadein d-flex justify-content-center align-items-center flex-column">
    <div class="_relative mb-4">
      <div class="_absolute _bg_overlay"></div>
      <div class="_absolute _trial_bg_gold"></div>
      <h3 class="_absolute _title m-0 text-center text-black">トライアル期間</h3>
    </div>
    <p>無料会員登録から１か月間はトライアル期間として無料会員でも一部有料プランの機能をご利用いただけます。</p>
    <p>ご利用可能な機能は、「月ごとの目標設定」「月ごとの自己評価」「過去の達成度の振り返り」の3つです。</p>
    <p>トライアル期間終了後でも、有料プランに登録いただければすべてのデータを引き次いでご利用が可能です。</p>
    <div class="_space"></div>
    <h4 class="my-4">会員登録はこちらから</h4>
    <div class="_to_signup_btn_parent my-4">
      <NuxtLink to="/signup/form" class="_to_signup_btn btn _btn_big btn-lg shadow-sm">無料会員登録</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
#explain-trial-box {
  margin-bottom: 0;
  width: 100%;
  padding: 40px 50px;
  background-color: rgb(30,30,30);
  color: rgb(240,240,240);
}
._relative {
  position: relative;
  width: 300px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
._absolute {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
._title {
  top: 11px;
}
._trial_bg_gold {
  mix-blend-mode: overlay;
  background: linear-gradient(90deg,
  #B67B03 0%,
  #DAAF08 20%,
  #fff2c3 24%,
  #fff0f0 25%,
  #fff2c3 26%,
  #FEE9A0 32%,
  #DAAF08 35%,
  #B67B03 40%,
  #B67B03 45%,
  #DAAF08 50%,
  #fff2c3 55%,
  #DAAF08 60%,
  #B67B03 65%,
  #B67B03 75%,
  #DAAF08 95%,
  #fff2c3 99%,
  #fff0f0 100%);
  background-size: 400%;
  animation-name: slide;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
._bg_overlay {
  background-color: rgba(120, 100, 0, 0.8);
  border-radius: 10px;
}
._space {
  height: 20px;
}
@media (max-width: 768px) {

}
@media (max-width: 576px) or (orientation: portrait) {
  #explain-trial-box {
    padding: 40px 20px;
  }
  ._relative {
    width: 100%;
  }
}
</style>
