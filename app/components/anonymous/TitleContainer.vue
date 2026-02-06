<script setup lang="ts">
const titleText = ref('Yarucoto')

</script>

<template>
  <div id="title-image" class="_image"></div>
  <div id="title-box" class="d-flex justify-content-center align-items-center flex-column">
    <h1 id="title" class="text-center">
      <span v-for="item in titleText" class="_title_text">{{item}}</span>
    </h1>
    <div id="text-parent" class="mt-3 _text_fadein">
      <div id="text" class="mb-3 py-3">
        <p>シンプルな操作性の個人向け予定管理アプリです。</p>
        <p>ユーザー操作に対してリアクティブに反応し、素早く動作します。</p>
        <p></p>
      </div>
    </div>
    <div class="_to_signup_btn_parent">
      <NuxtLink to="/signup/form" class="_to_signup_btn btn _btn_big btn-lg shadow-sm">無料会員登録</NuxtLink>
    </div>
    <div id="allow-narrow">
      <AnonymousAllow></AnonymousAllow>
    </div>
  </div>
</template>

<style scoped>
._title_text {
  opacity: 0;
  animation-name: titleTextFadein;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
  animation-delay: calc(sibling-index() * 0.1s + 0.2s);
  display: inline-block;
}
@keyframes titleTextFadein {
  0% {transform: translateY(-20%); opacity: 0;}
  30% {transform: translateY(0); opacity: 1;}
  80% {opacity: 0.4;}
  100% {opacity: 1;}
}
#title-image {
  background-image: url('~/assets/images/screen-shot-0.png');
  background-size: contain;
  background-position: right;
  background-repeat: no-repeat;
}
#title-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  animation-name: titleImageAnimation;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-delay: 0.5s;
  animation-timing-function: ease;
}
@keyframes titleImageAnimation {
  0% {transform: translateX(20%); opacity: 0;}
  100% {transform: translateX(0); opacity: 1;}
}
#title-box {
  width: 40rem;
  height: 100%;
  padding: 5rem;
  border-radius: 10px;
  z-index: 2;
  background-image: linear-gradient(90deg, rgba(250, 250, 250, 1), rgba(250, 250, 250, 1), rgba(250, 250, 250, 0));
}
#title {
  font-size: 5em!important;
  padding: 0;
  font-family: "Fjalla One", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: rgb(70, 70, 70);
}
#text-parent {
  height: 14rem;
}
#allow-narrow {
  display: none!important;
}
._text_fadein {
  opacity: 0;
  animation-name: textFadein;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-delay: 0.25s;
  animation-timing-function: ease;
}
@keyframes textFadein {
  0% {transform: translateY(3rem); opacity: 0;}
  100% {transform: translateY(0); opacity: 1;}
}
@media (max-width: 1200px) {
  #title-box {
    padding-left: 0;
    padding-right: 10rem;
  }
}
@media (max-width: 576px) or (orientation: portrait) {
  #allow-narrow {
    display: block !important;
  }
  #title-box {
    width: 100%;
    margin-bottom: 0;
    padding: 0;
  }
  #text-parent {
    margin: 0 !important;
    height: auto;
  }
  #title {
    font-size: 3.5em !important;
  }
  #title-image {
    background-image: none !important;
  }
}
</style>
