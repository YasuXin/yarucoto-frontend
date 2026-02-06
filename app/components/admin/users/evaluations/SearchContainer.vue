<script setup lang="ts">
const props = defineProps({
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
  startYear: {
    type: Number,
    required: true,
  },
  endYear: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits(['onSearch'])

const keyword = ref(props.keyword)
const startId = ref(props.startId)
const endId = ref(props.endId)
const columnOrder = ref(props.columnOrder)
const order = ref(props.order)
const startYear = ref(props.startYear)
const endYear = ref(props.endYear)
const rate = ref(props.rate)

const onSearch = () => {
  emit('onSearch', {
    page: 1,
    keyword: keyword.value,
    startId: startId.value,
    endId: endId.value,
    columnOrder: columnOrder.value,
    order: order.value,
    startYear: startYear.value,
    endYear: endYear.value,
    rate: rate.value
  })
}

const yearList = ref([2025, 2026, 2027, 2028, 2029, 2030])

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
          <div id="keyword-area" class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">キーワード：</div>
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
          <div class="mx-2 _text_narrow">年：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">年：</div>
            <select v-model="startYear" name="startYear" id="keyword-start-year" class="_form form-select form-select-sm">
              <option value="0">指定しない</option>
              <option v-for="i in yearList" :key="i" :value="i">{{i}}年</option>
            </select>
            <div class="mx-2">～</div>
            <select v-model="endYear" name="endYear" id="keyword-end-year" class="_form form-select form-select-sm">
              <option value="0">指定しない</option>
              <option v-for="i in yearList" :key="i" :value="i">{{i}}年</option>
            </select>
          </div>
          <div class="mx-2 _text_narrow">5段階評価：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">5段階評価：</div>
            <select v-model="rate" name="rate" id="keyword-rate" class="_form _rate form-select form-select-sm">
              <option value="0">指定なし</option>
              <option value="1">&#9733;&#9734;&#9734;&#9734;&#9734;</option>
              <option value="2">&#9733;&#9733;&#9734;&#9734;&#9734;</option>
              <option value="3">&#9733;&#9733;&#9733;&#9734;&#9734;</option>
              <option value="4">&#9733;&#9733;&#9733;&#9733;&#9734;</option>
              <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>
            </select>
          </div>
          <div class="mx-2 _text_narrow">並べ順：</div>
          <div class="form-group _form_group d-flex align-items-center justify-content-end my-2">
            <div class="mx-2 _text_wide">並べ順：</div>
            <select v-model="columnOrder" name="columnOrder" id="keyword-column-order"
                    class="_form _column_order form-select form-select-sm">
              <option value="id">ID</option>
              <option value="yearMonth">年月</option>
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
._keyword {
  width: 300px;
}
._rate {
  width: 100px;
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
#keyword-start-year, #keyword-end-year {
  width: 160px;
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
@media (max-width: 576px) {
  ._keyword {
    width: 100%;
  }
}
</style>
