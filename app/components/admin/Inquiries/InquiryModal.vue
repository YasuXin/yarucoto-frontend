<script setup lang="ts">
import type {AdminInquiry} from "~/interfaces";

const props = defineProps({
  inquiry: {
    type: Object as () => AdminInquiry,
    required: true
  }
})

const emits = defineEmits(['delete', 'return'])

const inquiry = computed(() => props.inquiry)

const createdAt = computed(() => useMakeStrFromTimestamp(inquiry.value.createdAt))
const updatedAt = computed(() => useMakeStrFromTimestamp(inquiry.value.updatedAt))

const onDelete = () => {
  emits('delete')
}
const onReturn = () => {
  emits('return')
}
const toUser = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + inquiry?.value?.userId)
}
</script>

<template>
  <div class="_modal_background">
    <div class="_modal_window">
      <div class="d-flex justify-content-center">
        <h5>お問合せ詳細</h5>
      </div>
      <div id="show-container" class="d-flex justify-content-center">
        <div id="show-box">
          <div class="_row _row1">
            <div class="_id d-flex">
              <div class="_left_item">ID：</div>
              <div class="_right_item">{{inquiry?.id}}</div>
            </div>
            <div class="_name d-flex">
              <div class="_left_item">氏名：</div>
              <div v-if="inquiry?.userId === 0" class="_right_item">{{inquiry?.name}}</div>
              <a v-else @click="toUser" class="_right_item _normal_link">{{inquiry?.name}}</a>
            </div>
            <div class="_email d-flex">
              <div class="_left_item">メール：</div>
              <address>
                <a :href="'mailto:' + inquiry?.email" class="_right_item _normal_link">{{inquiry?.email}}</a>
              </address>
            </div>
          </div>
          <div class="_row">
            <div class="_postal_code d-flex">
              <div class="_left_item">郵便番号：</div>
              <div class="_right_item" :class="{'_text_gray' : inquiry?.postalCode === ''}">
                {{inquiry?.postalCode !== '' ? inquiry?.postalCode : '設定されていません'}}
              </div>
            </div>
            <div class="_phone_number d-flex">
              <div class="_left_item">電話番号：</div>
              <div class="_right_item" :class="{'_text_gray' : inquiry?.phoneNumber === ''}">
                {{inquiry?.phoneNumber !== '' ? inquiry?.phoneNumber : '設定されていません'}}
              </div>
            </div>
          </div>
          <div class="_row _address">
            <div class="_left_item">住所：</div>
            <div class="_right_item" :class="{'_text_gray' : inquiry?.address === ''}">
              {{inquiry?.address !== '' ? inquiry?.address : '設定されていません'}}
            </div>
          </div>
          <div class="_row">
            <div class="_created_at d-flex">
              <div class="_left_item">作成日時：</div>
              <div class="_right_item">
                {{createdAt}}
              </div>
            </div>
            <div class="_updated_at d-flex">
              <div class="_left_item">更新日時：</div>
              <div class="_right_item">
                {{updatedAt}}
              </div>
            </div>
          </div>
          <div class="_text_box mt-3 mb-5">
            <div class="_text_title mb-2 fw-bold">お問い合わせ内容：</div>
            <div class="mb-3">
              {{inquiry?.text}}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center align-items-center w-100">
        <div style="width: 300px;" class="d-flex justify-content-around align-items-center">
          <button @click="onDelete" class="btn btn-danger">削除</button>
          <button @click="onReturn" class="btn _btn_primary">戻る</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "~/assets/css/modal_container.css";
address {
  margin: 0;
}
._row {
  display: flex;
  flex-wrap: wrap;
}
._id ._right_item, ._name ._right_item {
  margin-right: 40px;
}
._id, ._name, ._email, ._postal_code, ._phone_number, ._created_at, ._updated_at, ._address {
  margin: 5px 0;
}
._left_item {
  margin-right: 10px;
  text-align: right;
  font-weight: bold;
}
._postal_code, ._phone_number, ._created_at, ._updated_at {
  min-width: 50%;
}
._text_gray {
  color: var(--font-gray);
}
._text_box {
  position: relative;
  border: var(--middle-border);
  border-radius: 10px;
  padding: 20px 20px 10px;
}
._text_title {
  position: absolute;
  top: -10px;
  left: 10px;
  background-color: var(--card-bg-color);
  padding: 0 5px;
}
</style>
