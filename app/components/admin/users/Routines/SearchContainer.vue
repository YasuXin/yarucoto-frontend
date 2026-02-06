<script setup lang="ts">
const props = defineProps({
  columnKeyword: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  startId: {
    type: Number,
    required: true,
  },
  endId: {
    type: Number,
    required: true,
  },
  columnOrder: {
    type: String,
    required: true,
  },
  order: {
    type: String,
    required: true,
  },
  week: {
    type: Array,
    required: true,
  },
  weekSelect: {
    type: String,
    required: true,
  },
  active: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(['onSearch'])

const columnKeyword = ref(props.columnKeyword)
const keyword = ref(props.keyword)
const startId = ref(props.startId)
const endId = ref(props.endId)
const columnOrder = ref(props.columnOrder)
const order = ref(props.order)
const week = ref(props.week)
const weekSelect = ref(props.weekSelect)
const active = ref(props.active)

const onSearch = () => {
  emit('onSearch', {
    page: 1,
    columnKeyword: columnKeyword.value,
    keyword: keyword.value,
    startId: startId.value,
    endId: endId.value,
    columnOrder: columnOrder.value,
    order: order.value,
    week: week.value,
    weekSelect: weekSelect.value,
    active: active.value
  })
}
</script>

<template>
  <div id="search">
    <div id="squeeze-area" class="mt-4 d-flex flex-column align-items-center w-100">
      <div id="squeeze-box" class="d-flex flex-column align-items-end">
        <form @submit.prevent="onSearch" id="keyword-form" class="d-flex flex-column w-100">
          <div class="my-3 mx-3 d-flex justify-content-center">
            <h4>キーワード検索</h4>
          </div>
          <div class="mx-2 _text_narrow">キーワード：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">キーワード：</div>
            <select v-model="columnKeyword" name="columnKeyword" id="keyword-column-keyword" class="_form _column_keyword form-select form-select-sm">
              <option value="title">タイトル</option>
              <option value="description">説明</option>
            </select>
            <div class="mx-2">から</div>
            <input v-model="keyword" id="keyword-keyword" name="keyword" type="text" class="_form _keyword form-control form-control-sm"
                   placeholder="キーワード">
            <div class="mx-2">を検索</div>
          </div>

          <div class="mx-2 _text_narrow">ID：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">ID：</div>
            <input v-model="startId" type="number" id="keyword-start-id" name="startId" class="_form _start_id form-control form-control-sm">
            <div class="mx-2">～</div>
            <input v-model="endId" type="number" id="keyword-end-id" name="endId" class="_form _end_id form-control form-control-sm">
          </div>
          <div class="mx-2 _text_narrow">曜日：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">曜日：</div>
            <div id="keyword-weeks" class="_weeks">
              <div class="form-check d-flex justify-content-between align-items-center flex-wrap w-100">
                <label class="form-label">：<span style="color: var(--bs-red)">日</span>
                  <input v-model="week" type="checkbox" name="weeks" class="form-check-input _keyword_week" value="isSunday">
                </label>
                <label class="form-label">：月<input type="checkbox" name="weeks" class="form-check-input _keyword_week"
                                                    value="isMonday" v-model="week"></label>
                <label class="form-label">：火<input type="checkbox" name="weeks" class="form-check-input _keyword_week"
                                                    value="isTuesday" v-model="week"></label>
                <label class="form-label">：水<input type="checkbox" name="weeks" class="form-check-input _keyword_week"
                                                    value="isWednesday" v-model="week"></label>
                <label class="form-label">：木<input type="checkbox" name="weeks" class="form-check-input _keyword_week"
                                                    value="isThursday" v-model="week"></label>
                <label class="form-label">：金<input type="checkbox" name="weeks" class="form-check-input _keyword_week"
                                                    value="isFriday" v-model="week"></label>
                <label class="form-label">：<span style="color: var(--bs-blue)">土</span>
                  <input v-model="week" type="checkbox" name="weeks" class="form-check-input _keyword_week" value="isSaturday">
                </label>
              </div>
            </div>
          </div>

          <div class="mx-2 _text_narrow">曜日の検索方法：</div>
          <div class="my-2 form-group _form_group d-flex justify-content-end">
            <div class="mx-2 _text_wide">曜日の検索方法：</div>
            <select name="weekSelect" v-model="weekSelect" id="keyword-week-select" class="_form _week_select form-select form-select-sm">
              <option value="none">指定しない</option>
              <option value="match">と一致する</option>
              <option value="include">を含む</option>
            </select>
          </div>

          <div class="mx-2 _text_narrow">並べ順：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">並べ順：</div>
            <select v-model="columnOrder" name="columnOrder" id="keyword-column-order" class="_form _column_order form-select form-select-sm">
              <option value="id">ID</option>
              <option value="title">タイトル</option>
              <option value="description">説明</option>
              <option value="dueStartTime">開始時間</option>
              <option value="dueEndTime">終了時間</option>
            </select>
            <div class="mx-2">を</div>
            <select v-model="order" name="order" id="keyword-order" class="_form _order form-select form-select-sm">
              <option value="ASC">昇順</option>
              <option value="DESC">降順</option>
            </select>
            <div class="mx-2">で並べ替え</div>
          </div>
          <div class="mx-2 _text_narrow">アクティブ：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">アクティブ：</div>
            <select name="active" v-model="active" id="keyword-is-active" class="_form _is_active form-select form-select-sm">
              <option value="all">すべて</option>
              <option value="true">オン</option>
              <option value="false">オフ</option>
            </select>
          </div>
          <div class="d-flex justify-content-end my-2">
            <button id="keywordSqueezeBtn" type="submit" class="btn _btn_primary mx-2"
            >絞る</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/admin_search_container.css";
._column_keyword {
  width: 100px;
}
._keyword {
  width: 300px;
}
._column_order {
  width: 100px;
}
._order {
  width: 80px;
}
._start_id, ._end_id {
  width: 80px;
}
._is_active {
  width: 150px;
}
._weeks {
  width: 500px;
}
input[type="checkbox"] {
  width: 16px;
}
._week_select {
  width: 120px;
}
.form-label {
  margin-bottom: 0;
  margin-right: 5px;
  width: 50px;
}
@media (max-width: 1400px) {
  ._keyword {
    width: 250px;
  }
}
@media (max-width: 960px) {
  ._keyword {
    width: 180px;
  }
}
@media (max-width: 768px) {
  ._weeks {
    max-width: 500px;
    width: auto;
    padding-left: 10px;
  }
  .form-label {
    margin-bottom: 5px;
  }
}
</style>
