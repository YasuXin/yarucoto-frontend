<script setup lang="ts">
import LoginBtn from "~/components/LoginBtn.vue";
import RegisterBtn from "~/components/anonymous/RegisterBtn.vue";

const token = useCookie('__yarucoto')

const isHeaderFixed = ref(false)
const isHeaderSpaceHidden = ref(true)
const isHeaderNavNoShadow = ref(false)

const prevScrollY = ref(0)
const currentScrollY = ref(0)

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
onMounted(() => {
  if (window.innerWidth <= 576) {
    isHeaderSpaceHidden.value = true
  }
})
</script>

<template>
  <div class="_header_space" :class="{ '_hidden': isHeaderSpaceHidden }"></div>
  <header :class="{ '_header_fixed': isHeaderFixed }">
    <nav class="_header_nav navbar d-flex justify-content-between align-items-center shadow-sm" :class="{ '_no_shadow': isHeaderNavNoShadow }">
      <AnonymousHeaderLogo></AnonymousHeaderLogo>
      <div class="_header_menu">
        <div class="_anonymous_box d-flex justify-content-between">
          <RegisterBtn></RegisterBtn>
          <LoginBtn v-if="!token"></LoginBtn>
          <MyPageBtn v-if="token"></MyPageBtn>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* ヘッダーアニメーション */
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
  100% {transform: translateY(0); opacity: 1;}
}
._no_shadow {
  box-shadow: none !important;
}
._header_space {
  height: 50px;
  width: 100%;
}
header {
  background-image: linear-gradient(180deg, rgb(255, 255, 255), rgb(240, 240, 240));
  width: 100%;
  height: 50px;
}
.navbar {
  padding: 0 !important;
}
._header_nav {
  height: 50px;
}
._anonymous_box {
  width: 180px;
  font-size: 1.1rem;
}
._header_menu {
  height: 36px;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  ._header_menu {
    margin-right: 30px;
  }
}

@media (max-width: 576px) {
  ._header_menu {
    margin-right: 10px;
    width: 160px;
    justify-content: end;
  }
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
  ._header_space {
    display: block;
  }
  ._anonymous_box {
    width: 100%;
    justify-content: end !important;
  }
  @media (max-height: 700px) {
    header {
      height: 40px;
    }
    ._header_space {
      height: 40px;
    }
    ._header_nav {
      height: 40px;
    }
  }
}
</style>
