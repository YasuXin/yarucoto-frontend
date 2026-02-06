<script setup lang="ts">
const props = defineProps({
  columnKeyword: {
    type: String,
    default: "username"
  },
  keyword: {
    type: String,
    default: ""
  },
  startId: {
    type: Number,
    default: 1
  },
  endId: {
    type: Number,
  },
  roleId: {
    type: Number,
    default: 1
  },
  columnOrder: {
    type: String,
    default: "id"
  },
  order: {
    type: String,
  }
})

const emit = defineEmits(['onSearch'])

const columnKeyword =ref(props.columnKeyword)
const keyword = ref(props.keyword)
const startId = ref(props.startId)
const endId = ref(props.endId)
const roleId = ref(props.roleId)
const columnOrder = ref(props.columnOrder)
const order = ref(props.order)

const onSearch = () => {
  emit('onSearch', {
    page: 1,
    columnKeyword: columnKeyword.value,
    keyword: keyword.value,
    startId: startId.value,
    endId: endId.value,
    roleId: roleId.value,
    columnOrder: columnOrder.value,
    order: order.value
  })
}
</script>

<template>
  <div id="search">
    <form id="search-area" @submit.prevent="onSearch" class="d-flex flex-column align-items-center w-100">
      <div id="form-box" class="d-flex flex-column align-items-end">
        <div class="mx-2 _text_narrow">キーワード検索：</div>
        <div id="keyword-area" class="form-group my-3 _search_row">
          <div class="mx-2 _text_wide">キーワード検索：</div>
          <select v-model="columnKeyword" name="columnKeyword" id="column-keyword" class="form-select form-select-sm">
            <option value="username">氏名</option>
            <option value="nickname">ニックネーム</option>
            <option value="email">メールアドレス</option>
            <option value="postalCode">郵便番号</option>
            <option value="address">住所</option>
            <option value="phoneNumber">電話番号</option>
          </select>
          <div class="mx-2">から</div>
          <input id="keyword" name="keyword" type="text" class="form-control form-control-sm"
                 v-model="keyword" placeholder="キーワード">
          <div class="mx-2">を検索</div>
        </div>
        <div class="mx-2 _text_narrow">IDで絞る：</div>
        <div id="id-form" class="form-group d-flex align-items-center my-3">
          <div class="mx-2 _text_wide">IDで絞る：</div>
          <input type="number" v-model="startId" id="start-id" name="startId" class="form-control form-control-sm">
          <div class="mx-2">～</div>
          <input type="number" v-model="endId" id="end-id" name="endId" class="form-control form-control-sm">
        </div>
        <div class="mx-2 _text_narrow">ロールで絞る：</div>
        <div id="role-form" class="form-group d-flex align-items-center my-3">
          <div class="mx-2 _text_wide">ロールで絞る：</div>
          <select v-model="roleId" name="roleId" id="role" class="form-select form-select-sm">
            <option value="0">すべて</option>
            <option value="1">無料会員</option>
            <option value="2">有料会員</option>
            <option value="3">管理者</option>
          </select>
        </div>
        <div class="mx-2 _text_narrow">並べ順：</div>
        <div class="form-group my-3 _search_row">
          <div class="mx-2 _text_wide">並べ順：</div>
          <select v-model="columnOrder" name="columnOrder" id="column-order" class="form-select form-select-sm">
            <option value="id">ID</option>
            <option value="username">氏名</option>
            <option value="nickname">ニックネーム</option>
            <option value="email">メールアドレス</option>
            <option value="postal_code">郵便番号</option>
            <option value="address">住所</option>
            <option value="phone_number">電話番号</option>
          </select>
          <div class="mx-2">を</div>
          <select v-model="order" name="order" id="order" class="form-select form-select-sm">
            <option value="ASC">昇順</option>
            <option value="DESC">降順</option>
          </select>
          <div class="mx-2">で並び替え</div>
        </div>
        <div class="d-flex justify-content-end mt-4 w-100">
          <button id="search-submit-btn" type="submit" class="btn btn-sm _btn_primary mx-3">検索</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
#search {
  animation-name: showSearchAreaAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
@keyframes showSearchAreaAnimation {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
#search-area {
  width: 100%;
  padding: 0 100px;
}
#form-box {
  border: var(--thick-border);
  border-radius: 10px;
  width: 100%;
  padding: 15px 30px;
}

._search_row {
  display: flex;
  justify-content: end;
  align-items: center;
}
#column-keyword {
  width: 150px;
}
#keyword {
  width: 200px;
}
#column-order {
  width: 150px;
}
#order {
  width: 100px;
}
#search-submit-btn {
  width: 150px;
}
#search-words-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 0 100px;
}
#search-words {
  padding: 20px;
}
#search-words-child {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
#search-words > div {
  text-align: center;
}
#search-words-child span {
  font-weight: bold;
}
#start-id, #end-id {
  width: 100px;
}
#role {
  width:100px;
}
._text_narrow {
  display: none;
  width: 100%;
  text-align: start;
  margin: 0!important;
}
@media (max-width: 960px) {
  #keyword {
    width: 120px;
  }
}

@media (max-width: 768px) {
  #show-search-area {
    padding: 0 10px;
  }
  #search-words {
    margin: 0;
    padding-left: 0;
    padding-right: 0;
    width: calc(100% - 40px);
  }
  #search-area {
    padding: 0 10px;
  }
  #form-box {
    border: var(--thick-border);
    border-radius: 10px;
    width: calc(100% - 20px);
    padding: 30px;
  }
  #search-words-parent {
    padding: 0 10px;
  }
}
@media (max-width: 576px) {
  #search-words-child {
    grid-template-columns: 1fr;
  }
  #search-submit-btn {
    width: 100%;
  }
  ._search_row {
    flex-direction: column;
  }
  ._search_row {
    width: 100%;
  }
  #column-keyword, #keyword, #column-order, #order {
    width: 100%;
  }
  #search-submit-btn {
    margin: 0!important;
  }
  ._text_wide {
    display: none;
  }
  ._text_narrow {
    display: block;
  }
  #id-form, #role-form {
    flex-direction: column!important;
    width:100%;
    margin: 0;
  }
  #start-id, #end-id {
    width: 100%;
  }
  #role {
    width: 100%;
  }
}
</style>
