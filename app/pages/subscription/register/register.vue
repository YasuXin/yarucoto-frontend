<script setup lang="ts">
import type {User} from "~/interfaces";

definePageMeta({
  middleware: ["auth", "auth-free"],
  layout: "user"
})
useHead({
  title: "Yarucoto | Subscription | Register"
})

const user = useState<User | null>('auth-user')

const route = useRoute()
const path = route.path

const afterLoad = ref(false)
onMounted(async () => {
  afterLoad.value = true
})
</script>

<template>
  <div id="content" class="d-flex">
    <Sidebar :path="path"></Sidebar>
    <main class="py-3 px-0 shadow">
      <div v-show="afterLoad" id="main-child"
           class="_main_child_fadein d-flex flex-column justify-content-center align-items-center">
        <div id="main-title" class="d-flex justify-content-center">
          <h3>有料プラン購入</h3>
        </div>
        <div v-if="!user?.trial && user?.remainTrial === 0" id="content-alert">
          <div>トライアル期間はすでに終了しています</div>
        </div>
        <div id="form-parent" class="d-flex flex-column justify-content-center align-items-center">
          <div id="premium-description-box" class="shadow-sm">
            <div id="premium-title">有料プランの内容</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">毎月<b style="font-size: 1.3rem;"> 300円 </b>で利用可能</li>
              <li class="list-group-item">ルーティーン・タグを<b style="font-size: 1.2rem;"> 制限なく </b>利用可能</li>
              <li class="list-group-item">過去のタスクの達成度を確認し、評価をつけられる</li>
              <li class="list-group-item">月ごとに目標を設定していつでも確認できる</li>
            </ul>
          </div>
          <div class="w-100 d-flex justify-content-center my-5">
            <NuxtLink to="/subscription/register/check-password" id="startRegister" class="btn _btn_primary shadow-sm">手続きはこちらから</NuxtLink>
          </div>
        </div>
      </div>
      <Loading v-if="!afterLoad"></Loading>
    </main>
  </div>
</template>

<style scoped>
#content {
  background-color: var(--bg-color);
  color: var(--font-color);
}
main {
  background-color: var(--card-bg-color);
}
#premium-description-box {
  border: var(--middle-border);
  border-radius: 10px;
  position: relative;
  padding: 20px;
  margin-top: 24px;
  width: 360px;
}
#premium-title {
  position: absolute;
  top: -16px;
  left: 90px;
  font-size: 1.2rem;
  padding: 0 10px;
  background-color: var(--card-bg-color);
}
.list-group-item {
  background-color: var(--card-bg-color)!important;
  color: var(--font-color)!important;
  border-bottom: var(--middle-border)!important;
}
.list-group-item:last-child {
  border: none!important;
}
label {
  margin-bottom: 2px !important;
  padding-bottom: 3px;
  vertical-align: bottom;
}
#content-alert {
  width: 360px;
  padding: 20px 30px;
  border: var(--thick-border);
  border-radius: 10px;
  border-color: var(--bs-red);
  background-color: var(--alert-bg-color);
}
@media(max-width: 576px) {
  #main-child {
    width: calc(100% - 20px);
    margin: 0 10px;
  }
}
</style>
