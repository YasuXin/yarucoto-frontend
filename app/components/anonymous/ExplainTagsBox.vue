<script setup lang="ts">
const props = defineProps({
  isExplainTagsBoxShow: {
    type: Boolean,
    default: false
  }
})
const title = ref('タグの設定')
</script>

<template>
  <div v-show="isExplainTagsBoxShow" id="explain-tags-box" class="_explain_box">
    <div class="_explain_image_parent _explain_image_fadein_reverse shadow-sm">
      <div class="_explain_image"></div>
      <div class="_explain_image_narrow"></div>
    </div>
    <div id="explain-tags-text-box" class="_explain_text_box _explain_text_fadein shadow-sm">
      <h5 class="mb-4">
        <span v-for="item in title" class="_title">{{item}}</span></h5>
      <p>タグを設定することで、タスクとルーティーンを分類できるようになります。</p>
      <p>タグには、色・説明を設定できます。</p>
      <p>タスクとルーティンの追加・編集画面で、タグを最大3つずつ設定できます。</p>
      <p><small>無料会員で追加できるタグの上限は3つまでです。それ以上追加される場合は有料プランにご契約ください。</small></p>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/index.css';
#explain-tags-box ._explain_image {
  background-image: url('@/assets/images/screen-shot-3.png');
}
#explain-tags-box ._explain_image_narrow {
  background-image: url('@/assets/images/screen-shot-3-m.png');
}
@media (max-width: 768px) {
  ._explain_box {
    flex-direction: column-reverse;
  }
}
</style>
