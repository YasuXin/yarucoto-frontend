<script setup lang="ts">
const props = defineProps({
  isExplainPastCompletedBoxShow: {
    type: Boolean,
    default: false
  }
})
const title = ref('過去の達成度の振り返り')
</script>

<template>
  <div v-show="props.isExplainPastCompletedBoxShow" id="explain-past-completed-box" class="_explain_box">
    <div id="explain-past-completed-text-box" class="_explain_text_box _explain_text_fadein shadow-sm">
      <h5 class="mb-4">
        <span v-for="item in title" class="_title">{{item}}</span>
      </h5>
      <p>過去の達成度をグラフで確認することができます。</p>
      <p>日付・タグ・キーワードなどでフィルタリングして表示することもでき、円グラフと折れ線グラフから選んで表示できるため、用途に応じて視覚的に達成度を確認できます。</p>
      <p>月ごとに過去の達成率に対する評価を作成できます。</p>
      <p><small>トライアル期間終了後、達成度の振り返り機能を使用するには有料会員登録が必要です。</small></p>
    </div>
    <div class="_explain_image_parent _explain_image_fadein shadow-sm">
      <div class="_explain_image"></div>
      <div class="_explain_image_narrow"></div>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/index.css';
._explain_image {
  background-image: url('@/assets/images/screen-shot-4.png');
}
._explain_image_narrow {
  background-image: url('@/assets/images/screen-shot-4-m.png');
}
@media (max-width: 768px) {
  ._explain_box {
    flex-direction: column;
  }
}
</style>
