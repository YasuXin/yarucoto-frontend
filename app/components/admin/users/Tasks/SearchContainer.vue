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
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
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
  completed: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(['onSearch'])

const columnKeyword = ref(props.columnKeyword)
const keyword = ref(props.keyword)
const startId = ref(props.startId)
const endId = ref(props.endId)
const startDate = ref(props.startDate)
const endDate = ref(props.endDate)
const columnOrder = ref(props.columnOrder)
const order = ref(props.order)
const completed = ref(props.completed)

const onSearch = () => {
  emit('onSearch', {
    page: 1,
    columnKeyword: columnKeyword.value,
    keyword: keyword.value,
    startId: startId.value,
    endId: endId.value,
    startDate: startDate.value,
    endDate: endDate.value,
    columnOrder: columnOrder.value,
    order: order.value,
    completed: completed.value
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
          <div class="mx-2 _text_narrow">日付：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">日付：</div>
            <input v-model="startDate" type="date" id="keyword-start-date" name="startDate" class="_form _start_date form-control form-control-sm">
            <div class="mx-2">～</div>
            <input v-model="endDate" type="date" id="keyword-end-date" name="endDate" class="_form _end_date form-control form-control-sm">
          </div>

          <div class="mx-2 _text_narrow">並べ順：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">並べ順：</div>
            <select v-model="columnOrder" name="columnOrder" id="keyword-column-order" class="_form _column_order form-select form-select-sm">
              <option value="id">ID</option>
              <option value="title">タイトル</option>
              <option value="description">説明</option>
              <option value="dueDate">日付</option>
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
          <div class="mx-2 _text_narrow">完了・未完了：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">完了・未完了：</div>
            <select v-model="completed" name="completed" id="keyword-completed" class="_form _completed form-select form-select-sm">
              <option value="all">すべて</option>
              <option value="true">完了</option>
              <option value="false">未完了</option>
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
._start_date, ._end_date {
  width: 150px;
}
._completed {
  width: 150px;
}
@media (max-width: 1400px) {
  ._keyword {
    width: 250px;
  }
}
</style>
