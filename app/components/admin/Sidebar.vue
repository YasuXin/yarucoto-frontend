<script setup lang="ts">
const sidebarAbsoluteFixed = ref(false)

window.addEventListener('scroll', () => {
  if(window.innerWidth > 576) {
    if(window.scrollY >= 200) {
      sidebarAbsoluteFixed.value = true
    } else if (window.scrollY < 200) {
      sidebarAbsoluteFixed.value = false
    }
  }
})
</script>

<template>
  <div id="sidebar-relative">
    <div id="sidebar-absolute" class="container my-2 py-1 px-0 rounded shadow" :class="{'_sidebar_fixed': sidebarAbsoluteFixed}">
      <nav class="navbar py-0">
        <div class="_sidebar_inner_box">
          <div class="_link_wrapper">
            <div>
              <NuxtLink to="/admin/home" class="navbar-brand container-fluid _sidebar_link">
                <img src="~/assets/images/home.png" width="26" alt=""><span>ホーム</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="_sidebar_inner_box">
          <div class="_link_wrapper">
            <div>
              <NuxtLink to="/admin/users/list" class="navbar-brand container-fluid _sidebar_link">
                <img src="~/assets/images/user.png" width="26" alt=""><span>会員一覧</span>
              </NuxtLink>
            </div>
          </div>
          <div class="_link_wrapper">
            <div>
              <NuxtLink to="/admin/tasks/list" class="navbar-brand container-fluid _sidebar_link">
                <img src="~/assets/images/calendar.png" width="26" alt=""><span>タスク一覧</span>
              </NuxtLink>
            </div>
          </div>

        </div>
        <div class="_sidebar_inner_box">
          <div class="_link_wrapper">
            <div>
              <NuxtLink to="/admin/inquiries/list" class="navbar-brand container-fluid _sidebar_link">
                <img src="~/assets/images/mail.png" width="26" alt=""><span>お問合せ一覧</span>
              </NuxtLink>
            </div>
          </div>

          <div class="_link_wrapper">
            <div>
              <NuxtLink to="/admin/information/list" class="navbar-brand container-fluid _sidebar_link">
                <img src="~/assets/images/info.png" width="26" alt=""><span>お知らせ一覧</span>
              </NuxtLink>
            </div>
          </div>

        </div>
      </nav>
    </div>
  </div>

  <div id="sidebar-space" class="my-2 py-1 px-0"></div>
</template>

<style scoped>
._link_wrapper {
  position: relative;
}
#sidebar-space {
  width: 140px;
  height: auto;
  min-height: 500px;
  padding: 0 10px;
  margin-left: 16px;
}
#sidebar-relative {
  position: relative;
}
#sidebar-absolute {
  position: absolute;
  top: 7.5px;
  left: 0;
  width: 140px;
  height: 405px;
  background-color: var(--card-bg-color);
  margin-left: 16px;
  z-index: 5;
}

._sidebar_fixed {
  position: fixed!important;
  top: 57px!important;
  animation-name: sidebarFadein;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes sidebarFadein {
  0% {opacity: 0;}
  100% {opacity: 1;}
}

._sidebar_inner_box {
  width: 100%;
  padding: 2px 0;
  margin: 0 5px;
  border-bottom: var(--middle-border);
}
._sidebar_inner_box:last-child {
  border: none;
}
._sidebar_link {
  padding: 0 6px;
  height: 32px;
}

._sidebar_link:hover {
  background-color: var(--button-hoverd-bg-color);
  cursor: pointer;
}

.navbar-brand {
  display: flex;
  align-items: center;
  color: var(--sidebar-link-font-color);
  margin: 0;
  font-size: 0.9rem;
}

._sidebar_link span {
  display:inline-block;
  width:100%;
  margin-left: 5px;
}

._sidebar_link {
  background-color: var(--card-bg-color);
  color: var(--sidebar-link-font-color);
  overflow: hidden;
  position: relative;
  z-index: 1;
}
._sidebar_link::after {
  background: var(--button-hoverd-bg-color);
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  transform: scale(0, 1);
  transform-origin: left top;
  transition: .2s cubic-bezier(0.45, 0, 0.55, 1);
  z-index: 4;
}

._sidebar_link:hover::after {
  transform: scale(1, 1);
}

@media (max-width: 1200px) {
  ._visible_link_parent {
    position: absolute;
    top: 0;
    left: 50px;
    height: 34px;
    width: 150px;
    background-color: var(--card-bg-color);
    animation-name: visibleLinkAnimation;
    animation-duration: 3s;
    animation-fill-mode: forwards;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  #sidebar-absolute {
    width: 50px;
  }
  ._sidebar_link span {
    display: none;
  }
  #sidebar-space {
    width: 50px;
  }
  ._sidebar_inner_box {
    margin: 0;

  }
  ._sidebar_link {
    padding:0;
    padding-left: 11px;
    padding-right: 11px;
  }
}

@media (max-width: 768px) {
  #sidebar-space, #sidebar-relative {
    display: none;
  }
}

@keyframes visibleLinkAnimation {
  0% {transform: translateX(-66px); opacity: 0;}
  15%{transform: translateX(0); opacity: 1;}
  50%{transform: translateX(0); opacity: 1;}
  100%{transform: translateX(-30px); opacity: 0;}
}
</style>
