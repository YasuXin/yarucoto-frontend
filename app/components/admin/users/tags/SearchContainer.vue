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
  },
  endId: {
    type: Number,
  },
  columnOrder: {
    type: String,
    required: true,
  },
  order: {
    type: String,
    required: true,
  },
  color: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits(['search'])

const columnKeyword = ref(props.columnKeyword)
const keyword = ref(props.keyword)
const startId = ref(props.startId)
const endId = ref(props.endId)
const columnOrder = ref(props.columnOrder)
const order = ref(props.order)
const color = ref(props.color)

const onSearch = () => {
  emit('search', {
    page: 1,
    columnKeyword: columnKeyword.value,
    keyword: keyword.value,
    startId: startId.value,
    endId: endId.value,
    columnOrder: columnOrder.value,
    order: order.value,
    color: color.value
  })
}
</script>

<template>
  <div id="search">
    <div id="squeeze-area" class="mt-4 d-flex flex-column align-items-center w-100">
      <div id="squeeze-box" class="d-flex flex-column align-items-end">
        <form id="keyword-form" @submit.prevent="onSearch"
              class="d-flex flex-column w-100">
          <div class="my-3 mx-3 d-flex justify-content-center">
            <h4>キーワード検索</h4>
          </div>
          <div class="mx-2 _text_narrow">キーワード：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">キーワード：</div>
            <select v-model="columnKeyword" name="columnKeyword" id="keyword-column-keyword"
                    class="_form _column_keyword form-select form-select-sm">
              <option value="name">名前</option>
              <option value="description">説明</option>
            </select>
            <div class="mx-2">から</div>
            <input id="keyword-keyword" name="keyword" type="text" class="_form _keyword form-control form-control-sm"
                   v-model="keyword" placeholder="キーワード">
            <div class="mx-2">を検索</div>
          </div>

          <div class="mx-2 _text_narrow">ID：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">ID：</div>
            <input type="number" id="keyword-start-id" name="startId"
                   class="_form _start_id form-control form-control-sm" v-model="startId">
            <div class="mx-2">～</div>
            <input type="number" id="keyword-end-id" name="endId" class="_form _end_id form-control form-control-sm"
                   v-model="endId">
          </div>
          <div class="mx-2 _text_narrow">色：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">色：</div>
            <select v-model="color" id="keyword-color" name="color" class="_form form-select form-select-sm">
              <option class="" name="color" value="0">指定なし</option>
              <option id="color-default" class="_c_default" name="color" value="1">デフォルト</option>
              <option class="_c_red" name="color" value="2">赤</option>
              <option class="_c_orange" name="color" value="3">橙</option>
              <option class="_c_yellow" name="color" value="4">黄</option>
              <option class="_c_green" name="color" value="5">緑</option>
              <option class="_c_blue" name="color" value="6">青</option>
              <option class="_c_indigo" name="color" value="7">藍</option>
              <option class="_c_purple" name="color" value="8">紫</option>
            </select>
          </div>

          <div class="mx-2 _text_narrow">並べ順：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">並べ順：</div>
            <select v-model="columnOrder" name="columnOrder" id="keyword-column-order"
                    class="_form _column_order form-select form-select-sm">
              <option value="id">ID</option>
              <option value="name">名前</option>
              <option value="description">説明</option>
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
#keyword-color {
  width: 120px;
}
@media (max-width: 1400px) {
  ._keyword {
    width: 250px;
  }
}
@media (max-width: 768px) {
  ._keyword {
    width: 180px;
  }
}
</style>
