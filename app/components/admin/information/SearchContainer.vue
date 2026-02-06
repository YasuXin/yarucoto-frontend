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
  createdStart: {
    type: String,
    required: true,
  },
  createdEnd: {
    type: String,
    required: true,
  },
  updatedStart: {
    type: String,
    required: true,
  },
  updatedEnd: {
    type: String,
  }
})

const emit = defineEmits(['search'])

const columnKeyword = ref(props.columnKeyword)
const keyword = ref(props.keyword)
const startId = ref(props.startId)
const endId = ref(props.endId)
const columnOrder = ref(props.columnOrder)
const order = ref(props.order)
const createdStart = ref(props.createdStart)
const createdEnd = ref(props.createdEnd)
const updatedStart = ref(props.updatedStart)
const updatedEnd = ref(props.updatedEnd)

const onSearch = () => {
  emit('search', {
    page: 1,
    columnKeyword: columnKeyword.value,
    keyword: keyword.value,
    startId: startId.value,
    endId: endId.value,
    columnOrder: columnOrder.value,
    order: order.value,
    createdStart: createdStart.value,
    createdEnd: createdEnd.value,
    updatedStart: updatedStart.value,
    updatedEnd: updatedEnd.value
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
          <div class="form-group _form_group my-2">
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
          <div class="form-group _form_group my-2">
            <div class="mx-2 _text_wide">ID：</div>
            <input v-model="startId" type="number" id="keyword-start-id" name="startId" class="_form _start_id form-control form-control-sm">
            <div class="mx-2">～</div>
            <input v-model="endId" type="number" id="keyword-end-id" name="endId" class="_form _end_id form-control form-control-sm">
          </div>
          <div class="mx-2 _text_narrow">作成日時：</div>
          <div class="form-group _form_group my-2">
            <div class="mx-2 _text_wide">作成日時：</div>
            <input v-model="createdStart" type="date" id="created-start" name="startDate" class="_form _created_start form-control form-control-sm">
            <div class="mx-2">～</div>
            <input v-model="createdEnd" type="date" id="created-end" name="endDate" class="_form _created_end form-control form-control-sm">
          </div>
          <div class="mx-2 _text_narrow">更新日時：</div>
          <div class="form-group _form_group my-2">
            <div class="mx-2 _text_wide">更新日時：</div>
            <input v-model="updatedStart" type="date" id="updated-start" name="startDate" class="_form _updated_start form-control form-control-sm">
            <div class="mx-2">～</div>
            <input v-model="updatedEnd" type="date" id="updated-end" name="endDate" class="_form _updated_end form-control form-control-sm">
          </div>

          <div class="mx-2 _text_narrow">並べ順：</div>
          <div class="form-group _form_group my-2">
            <div class="mx-2 _text_wide">並べ順：</div>
            <select v-model="columnOrder" name="columnOrder" id="keyword-column-order" class="_form _column_order form-select form-select-sm">
              <option value="id">ID</option>
              <option value="text">内容</option>
              <option value="createdAt">作成日時</option>
              <option value="updatedAt">更新日時</option>
            </select>
            <div class="mx-2">を</div>
            <select v-model="order" name="order" id="keyword-order" class="_form _order form-select form-select-sm">
              <option value="ASC">昇順</option>
              <option value="DESC">降順</option>
            </select>
            <div class="mx-2">で並べ替え</div>
          </div>
          <div class="d-flex justify-content-end my-2">
            <button id="keywordSqueezeBtn" type="submit" class="btn _btn_primary mx-2">絞る</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/admin_search_container.css";
._column_keyword {
  width: 130px;
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
._form_group {
  display: flex;
  justify-content: end;
}
._start_id, ._end_id {
  width: 80px;
}
._created_start, ._created_end, ._updated_start, ._updated_end {
  width: 150px;
}
@media (max-width: 1400px) {
  ._keyword {
    width: 250px;
  }
}
@media (max-width: 768px) {
  ._keyword {
    width: 150px;
  }
}
</style>
