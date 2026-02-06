<script setup lang="ts">
const props = defineProps({
  isExplainRoutinesBoxShow: {
    type: Boolean,
    default: false
  }
})
const title = ref('ルーティーンの設定')
</script>

<template>
  <div v-show="props.isExplainRoutinesBoxShow" id="explain-routines-box" class="_explain_box">
    <div id="explain-routines-text-box" class="_explain_text_box _explain_text_fadein shadow-sm">
      <h5 class="mb-4">
        <span v-for="item in title" class="_title">{{item}}</span>
      </h5>
      <p>ルーティーンを設定して、決まった曜日ごとにタスクを自動的に生成します。</p>
      <p>ルーティーンには、タグ・開始時間・終了時間・曜日・説明を設定できます。</p>
      <p>定期的に実行するタスクをルーティーンに設定することで、ユーザーのタスクを追加する負担を大幅に減らします。</p>
      <p><small>無料会員で追加できるルーティーンの上限は5つまでです。それ以上追加される場合は有料プランにご契約ください。</small></p>
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
  background-image: url('@/assets/images/screen-shot-2.png');
}
._explain_image_narrow {
  background-image: url('@/assets/images/screen-shot-2-m.png');
}
@media (max-width: 768px) {
  ._explain_box {
    flex-direction: column;
  }
}
</style>
