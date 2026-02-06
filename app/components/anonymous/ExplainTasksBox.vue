<script setup lang="ts">
const props = defineProps({
  isExplainTasksBoxShow: {
    type: Boolean,
    default: false
  }
})
const title = ref('タスクの管理')
</script>

<template>
  <div v-if="props.isExplainTasksBoxShow" id="explain-tasks-box" class="_explain_box">
    <div class="_explain_image_parent _explain_image_fadein_reverse shadow-sm">
      <div class="_explain_image"></div>
      <div class="_explain_image_narrow"></div>
    </div>
    <div id="explain-tasks-text-box" class="_explain_text_box _explain_text_fadein shadow-sm">
      <h5 class="mb-4">
        <span v-for="item in title" class="_title">{{item}}</span>
      </h5>
      <p>タスクの登録は素早く簡単に行うことができ、タスクには日付・タグ・開始時間・終了時間・説明を設定できます</p>
      <p>登録したタスクは一覧画面で日付ごとに管理でき、いつでも確認できます。</p>
      <p>タスクが終了した場合、チェックボタンを押すことで完了タスクにでき、日付ごとの全タスクに対する完了タスクの割合が達成率として表示されます。</p>
      <p>タスク機能は無料でご利用いただけます。</p>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/index.css';
._explain_image {
  background-image: url('~/assets/images/screen-shot-1.png');
}
._explain_image_narrow {
  background-image: url('~/assets/images/screen-shot-1-m.png');
}
@media (max-width: 768px)  {
  ._explain_box {
    flex-direction: column-reverse;
  }
}
</style>
