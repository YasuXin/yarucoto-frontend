<script setup lang="ts">
import type {AdminUser} from "~/interfaces";

const props = defineProps({
  user: {
    type: Object as () => AdminUser,
    required: true
  }
})

const user = computed(() => props.user)
const show = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + user.value.id)
}
</script>

<template>
  <div class="_user_container">
    <div class="_user_box">
      <div class="_user_row d-flex justify-content-between _text_free" :class="{'_text_free' : user.roleId === 1, '_text_paid' : user.roleId === 2, '_text_admin' : user.roleId === 3}">
        <div class="_user_left d-flex">
          <div class="_user_id">
            No.{{user.id}}
          </div>
          <div class="_user_name">
            {{user.username}}
          </div>
          <div class="_user_nickname">
            {{user.nickname}}
          </div>
          <div class="_user_email">
            {{user.email}}
          </div>
        </div>
        <div class="d-flex _user_right">
          <div v-if="user.roleId === 1" class="_user_role">無料会員</div>
          <div v-if="user.roleId === 2" class="_user_role">有料会員</div>
          <div v-if="user.roleId === 3" class="_user_role">管理者</div>
          <div class="_show_btn_parent">
            <a @click="show" class="_show_btn _user_link">詳細</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
._user_container {
  width: 100%;
}
._user_box {
  width: 100%;
}
._user_row {
  padding: 10px 20px;
  margin: 0 10px;
  border-bottom: var(--middle-border);
}
._user_left {
  width: calc(100% - 170px);
}
._user_id {
  width: 80px;
  border-right: var(--thin-border);
}
._user_name {
  margin-left: 20px;
  width: 20rem;
}
._user_nickname {
  width: 20rem;
}
._user_email {
  width: auto;
}
._user_role {
  width: 90px;
  text-align: center;
  border-left: var(--thin-border);
  margin-left: 10px;
  padding-left: 10px;
}
._text_admin {
  color: var(--font-gray);
}
._text_paid {
  color: goldenrod;
}
._show_btn_parent {
  width: 60px;
  margin-left: 10px;
  padding-left: 10px;
  border-left: var(--thin-border);
  text-align: center;
}
._user_link {
  color: var(--font-color);
}
._user_link:hover {
  cursor: pointer;
}

._user_id {
  padding-left: 15px;
}
@media (max-width: 1400px) {
  ._user_email {
    display: none;
  }
}
@media (max-width: 1080px) {
  ._user_role {
    display: none;
  }
  ._user_left {
    width: calc(100% - 80px);
  }
}
@media (max-width: 960px) {
  ._user_nickname {
    display: none;
  }
}
@media (max-width: 576px) {
  ._user_row {
    padding: 10px;
  }
  ._user_id {
    width: 60px;
  }
}
@media (max-width: 500px) {
  ._user_name {
    max-width: calc(100% - 80px);
  }
}
</style>
