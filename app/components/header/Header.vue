<script setup lang="ts">
import type {Information} from "~/interfaces";

const user = useState<any | null>('auth-user', () => null)
const role = computed(() => user.value?.role)

const isHeaderFixed = ref(false)
const isHeaderSpaceHidden = ref(true)
const isHeaderNavNoShadow = ref(false)

const prevScrollY = ref(0)
const currentScrollY = ref(0)

const hamShow = ref(false)

window.addEventListener('scroll', () => {
  if(window.innerWidth > 576) {
    if(window.scrollY >= 200) {
      isHeaderSpaceHidden.value = false
      isHeaderFixed.value = true
    } else if (window.scrollY < 200) {
      isHeaderSpaceHidden.value = true
      isHeaderFixed.value = false
    }
  } else {
    isHeaderSpaceHidden.value = false

    currentScrollY.value = window.scrollY
    if (currentScrollY > prevScrollY) {
      isHeaderNavNoShadow.value = true
    } else {
      isHeaderNavNoShadow.value = false
    }
    prevScrollY.value = currentScrollY.value
  }
})

const hamShowEvent = (e: boolean) => {
  hamShow.value = e
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 576) {
    isHeaderSpaceHidden.value = true
  } else {
    isHeaderSpaceHidden.value = false
  }
})

const stateInformationArr = useState<Information[]>('informationArr') as Ref<Information[]>
const hasNewInformation = computed(() => stateInformationArr?.value?.some(info => info.newInformation))

const toAdmin = (e: Event) => {
  e.preventDefault()
  navigateTo('/admin/users/show/' + user?.value?.id, {replace: true})
}

onMounted(() => {
  if (window.innerWidth <= 576) {
    isHeaderSpaceHidden.value = false
  }
})
</script>

<template>
  <div class="_header_space" :class="{ '_hidden': isHeaderSpaceHidden }"></div>
  <header :class="{ '_header_fixed': isHeaderFixed }">
    <nav class="_header_nav navbar d-flex justify-content-between align-items-center shadow-sm" :class="{ '_no_shadow': isHeaderNavNoShadow }">
      <HeaderLogo></HeaderLogo>
      <div class="_header_menu">
        <div v-if="role==='ROLE_FREE_MEMBER'" class="_free_member_box d-flex justify-content-between align-items-center">
          <!-- 無料会員 -->
          <NuxtLink to="/information/list" class="_information">
            <img src="~/assets/images/info.png" width="32" alt="i"><span :class="{'_new_information' : hasNewInformation}"></span>
          </NuxtLink>
          <div class="_gold_btn_box">
            <div class="btn _btn_gold_parent">
              <NuxtLink to="/subscription/register/register" class="btn _btn_gold _header_btn shadow-sm">有料会員登録</NuxtLink>
            </div>
          </div>
          <LogoutBtn></LogoutBtn>
          <HeaderHamburgerBox @hamShowEvent="hamShowEvent"></HeaderHamburgerBox>
        </div>
        <div v-if="role==='ROLE_PAID_MEMBER'" class="_paid_member_box d-flex justify-content-between align-items-center">
          <!-- 有料会員 -->
          <NuxtLink to="/information/list" class="_information">
            <img src="~/assets/images/info.png" width="32" alt="i"><span :class="{'_new_information' : hasNewInformation}"></span>
          </NuxtLink>
          <LogoutBtn></LogoutBtn>
          <HeaderHamburgerBox @hamShowEvent="hamShowEvent"></HeaderHamburgerBox>
        </div>
        <div v-if="role==='ROLE_ADMIN'" class="_paid_member_box d-flex justify-content-between align-items-center">
          <!-- 管理者 -->
          <div class="_admin_user_link">
            <span class="_admin">管理者：　</span><a @click="toAdmin" class="_normal_link">{{user?.username ?? '不明'}}</a>
          </div>
          <LogoutBtn></LogoutBtn>
          <AdminHamburgerBox @hamShowEvent="hamShowEvent"></AdminHamburgerBox>
        </div>
      </div>
    </nav>
  </header>
  <template v-if="role === 'ROLE_ADMIN'">
    <AdminHamburgerMenu :hamShow="hamShow"></AdminHamburgerMenu>
  </template>
  <template v-else>
    <HeaderHamburgerMenu :hamShow="hamShow"></HeaderHamburgerMenu>
  </template>

</template>

<style scoped>
._information {
  margin-right: 20px;
}
._new_information::after {
  content: '！';
  background-color: var(--bs-danger);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  margin-left: -20px;
  display: inline-block;
  position: absolute;
  top: 28px;
}
._header_fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  animation-name: headerFadein;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes headerFadein {
  0% {transform: translateY(-60px); opacity: 0;}
  100% {transform: translateY(0);opacity: 1;}
}
._no_shadow {
  box-shadow: none !important;
}
._header_space {
  height: 60px;
  width: 100%;
}

header {
  background-image: var(--header-bg-color);
  width: 100%;
  height: 60px;
}

.navbar {
  padding: 0 !important;
}

._header_nav {
  height: 60px;
}

._header_menu {
  height: 36px;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

._gold_btn_box {
  margin-right: 30px;
}

._admin_user_link {
  color: var(--font-color);
  margin-right: 20px;
}
@media (max-width: 768px) {
  ._header_menu {
    margin-right: 20px;
  }
  ._header_btn {
    margin: 0 15px !important;
  }
  ._information {
    margin-right: 10px;
  }
  ._gold_btn_box {
    margin: 0;
  }
  ._btn_gold {
    margin-left: 0 !important;
  }
  ._admin {
    display: none;
  }
}
@media (max-width: 576px) {
  ._header_menu {
    margin-right: 10px;
    width: auto;
    justify-content: end;
  }
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    height: 50px;
  }
  ._header_nav {
    height: 50px;
  }
  ._header_space {
    display: block;
    height: 50px;
  }
  ._header_btn {
    transform: scale(0.9, 0.9);
    margin: 0 !important;
  }
  ._paid_member_box,
  ._free_member_box {
    justify-content: space-around !important;
  }
  ._free_member_box {
    width: 190px;
  }
}
</style>
