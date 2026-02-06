<script setup lang="ts">
import type {User} from "~/interfaces";

definePageMeta({
  middleware: "auth",
  layout: "user"
})
useHead({
  title: "Yarucoto | UserInformation"
})

const user = useState<User | null>('auth-user')

const route = useRoute()
const path = route.path

const modalShow = ref(false)
const modalMessage = ref('送信中...')

const afterLoad = ref(false)
onMounted(async () => {
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :current="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div v-show="afterLoad" id="main-child"
           class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>会員情報</h3>
        </div>
        <template v-if="user?.role === 'ROLE_FREE_MEMBER'">
          <div id="user-information" class="shadow">
            <div class="_grade_text">無料会員
              <span v-if="user?.trial">(トライアル期間 残り<span >{{user?.remainTrial}}</span>日)</span>
              <span v-else>(トライアル期間終了)</span>
            </div>
            <div id="username-box" class="d-flex _row">
              <div id="username-title" class="_row_title">氏名：</div>
              <div  class="_row_text">{{user?.username}}</div>
            </div>
            <div id="nickname-box" class="d-flex _row">
              <div id="nickname-title" class="_row_title">ニックネーム：</div>
              <div class="_row_text">{{user?.nickname}}</div>
            </div>
            <div id="email-box" class="d-flex _row">
              <div id="mail-title" class="_row_title">メールアドレス：</div>
              <div class="_row_text">{{user?.email}}</div>
            </div>
          </div>
          <div class="_btn_container">
            <div class="_btn_col shadow">
              <div class="_btn_row">
                <div class="_btn_text">有料会員に登録します</div>
                <NuxtLink to="/subscription/register/register" class="btn _btn_gold shadow-sm">有料会員登録</NuxtLink>
              </div>
              <div class="_btn_row">
                <div class="_btn_text">会員情報を編集します</div>
                <NuxtLink to="/user/edit/check-password"
                   class="btn _btn_primary shadow-sm">会員情報編集</NuxtLink>
              </div>
              <div class="_btn_row">
                <div class="_btn_text">パスワードを変更します</div>
                <NuxtLink to="/user/password/check-password"
                   class="btn _btn_primary shadow-sm">パスワード変更</NuxtLink>
              </div>
            </div>
            <div class="_btn_col _btn_col_alert shadow">
              <div class="_btn_row _btn_row_alert">
                <div class="_btn_text">タスクを一括削除します</div>
                <NuxtLink to="/tasks/all-delete/check-password"
                   class="btn btn-danger shadow-sm">タスク一括削除</NuxtLink>
              </div>
              <div class="_btn_row _btn_row_alert">
                <div class="_btn_text">会員情報以外の全データを削除します</div>
                <NuxtLink to="/user/all-data/delete/check-password"
                   class="btn btn-danger shadow-sm">全データ削除</NuxtLink>
              </div>
              <div class="_btn_row _btn_row_alert">
                <div class="_btn_text">本アプリを退会します</div>
                <NuxtLink to="/user/delete/check-password"
                   class="btn btn-danger shadow-sm">退会</NuxtLink>
              </div>
            </div>
          </div>
        </template>
        <template v-if="user?.role==='ROLE_PAID_MEMBER'">
          <div id="user-information" class="shadow">
            <div class="_user_absolute _bg_gold"></div>
            <div class="_user_text_information">
              <div class="_btn_gold _grade_text">有料会員</div>

              <div id="username-box" class="d-flex _row">
                <div id="username-title" class="_row_title">氏名：</div>
                <div class="_row_text">{{user?.username}}</div>
              </div>
              <div id="nickname-box" class="d-flex _row">
                <div id="nickname-title" class="_row_title">ニックネーム：</div>
                <div class="_row_text">{{user?.nickname}}</div>
              </div>
              <div id="email-box" class="d-flex _row">
                <div id="mail-title" class="_row_title">メールアドレス：</div>
                <div class="_row_text">{{user?.email}}</div>
              </div>
              <div id="postal-code-box" class="d-flex _row">
                <div id="postal-code-title" class="_row_title">郵便番号：</div>
                <div class="_row_text">{{user?.postalCode}}</div>
              </div>
              <div id="address-box" class="d-flex _row">
                <div id="address-title" class="_row_title">住所：</div>
                <div class="_row_text">{{user?.address}}</div>
              </div>
              <div id="phone-number-box" class="d-flex _row">
                <div id="phone-number-title" class="_row_title">電話番号：</div>
                <div class="_row_text">{{user?.phoneNumber}}</div>
              </div>
            </div>
          </div>

          <div class="_btn_container">
            <div class="_btn_col shadow">
              <div class="_btn_row">
                <div class="_btn_text">会員情報を編集します</div>
                <NuxtLink to="/user/edit/check-password"
                   class="btn _btn_primary shadow-sm">会員情報編集</NuxtLink>
              </div>
              <div class="_btn_row">
                <div class="_btn_text">パスワードを変更します</div>
                <NuxtLink to="/user/password/check-password"
                   class="btn _btn_primary shadow-sm">パスワード変更</NuxtLink>
              </div>
              <div class="_btn_row">
                <div class="_btn_text">クレジットカードの情報を編集します</div>
                <NuxtLink to="/subscription/edit/check-password"
                   class="btn _btn_primary shadow-sm">クレジット情報編集</NuxtLink>
              </div>
            </div>
            <div class="_btn_col _btn_col_alert shadow">
              <div class="_btn_row _btn_row_alert">
                <div class="_btn_text">タスクを一括削除します</div>
                <NuxtLink to="/tasks/all-delete/check-password"
                   class="btn btn-danger shadow-sm">タスク一括削除</NuxtLink>
              </div>
              <div class="_btn_row _btn_row_alert">
                <div class="_btn_text">会員情報以外の全データを削除します</div>
                <NuxtLink to="/user/all-data/delete/check-password"
                   class="btn btn-danger shadow-sm">全データ削除</NuxtLink>
              </div>
              <div class="_btn_row _btn_row_alert">
                <div class="_btn_text">本アプリを退会します</div>
                <NuxtLink to="/user/delete/check-password"
                   class="btn btn-danger shadow-sm">退会</NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
  <teleport to="body">
    <Modal :message="modalMessage" :modalShow="modalShow"></Modal>
  </teleport>
</template>

<style scoped>
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#user-information {
  width: 600px;
  border: none;
  border-radius: 10px;
  padding: 40px 60px;
  font-size: 1.1rem;
  position: relative;
  word-wrap: break-word;
}
._user_absolute {
  position:absolute;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  border-radius: 10px;
}

._grade_text {
  height: 42px;
  text-align: center;
  padding: 6px 2px;
  border-bottom: 3px solid var(--font-gray);
  font-size: 1.4rem;
  width: 100%;
  color: var(--font-color-dense);
}
._row {
  justify-content: center;
  padding: 10px 0;
  border-bottom: var(--thin-border);
}
._row_title {
  width: 160px;
  text-align: right;
  color: var(--font-color-dense);
}
._row_text {
  padding-left: 20px;
  width: 320px;
  color: var(--font-color-dense);
}
._btn_container {
  width: 600px;
  display: flex;
  flex-wrap:wrap;
  margin: 48px 0;
}
._btn_col {
  width: 100%;
  padding: 0 0;
  border: var(--thick-border);
  border-radius: 10px;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
._btn_col_alert {
  border-color: var(--bs-red);
  background-color: var(--alert-bg-color);
  margin-top: 24px;
}
._btn_row {
  width: 100%;
  padding: 24px 30px;
  border-bottom: var(--middle-border);
  display:flex;
  justify-content: space-between;
  align-items: center;
}
._btn_row_alert {
  border-color: var(--bs-red);
}
._btn_row:last-child {
  border: none;
}
._btn_text {
  font-size: 0.9rem;
}
._btn_row a, ._btn_row button {
  width: 200px;
}
@media (max-width: 768px) {
  #user-information {
    width: calc(100% - 20px);
    padding: 30px 20px;
    margin: 0 10px;
    font-size: 1.0rem;
  }
  ._grade_text {
    padding: 5px;
  }
  ._row_title {
    width: 140px;
  }
  ._row_text {
    width: 220px;
  }
  ._btn_container {
    flex-direction: column!important;
    width: 100%;
    padding: 0 10px;
    margin-top: 24px;
  }
  ._btn_col {
    width: 100%;
  }
}
@media (max-width: 576px) {
  #user-information {
    width: calc(100% - 20px);
    margin: 0;
    padding: 30px 20px;
    font-size: 0.9rem;
  }
  ._grade_text {
    padding: 6px;
    font-size: 1.3rem;
  }
  ._row_title {
    width: 120px;
  }
  ._row_text {
    width: calc(100% - 120px);
  }
  ._btn_container {
    flex-direction: column!important;
    width: 100%;
  }
  ._btn_row {
    flex-direction: column;
  }
  ._btn_text {
    margin-bottom: 4px;
  }
  ._btn_row a, ._btn_row button {
    width: calc(100% - 40px);
    margin-left: 20px;
    margin-right: 20px;
  }
}

@media (max-width: 500px) {
  #user-information {
    padding: 30px 10px;
    font-size: 0.85rem;
  }
}
</style>
