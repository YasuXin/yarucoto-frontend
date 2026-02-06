<script setup lang="ts">
definePageMeta({
  layout: "anonymous"
})

useHead({
  title: "Yarucoto",
})

const isExplainTasksBoxShow = ref(false)
const isExplainRoutinesBoxShow = ref(false)
const isExplainTagsBoxShow = ref(false)
const isExplainPastCompletedBoxShow = ref(false)
const isExplainTrialBoxShow = ref(false)

const titleContainerRef = ref<HTMLElement | null>(null)
const explainTasksBoxRef = ref<HTMLElement | null>(null)
const explainRoutinesBoxRef = ref<HTMLElement | null>(null)
const explainTagsBoxRef = ref<HTMLElement | null>(null)
const explainPastCompletedBoxRef = ref<HTMLElement | null>(null)
const explainTrialBoxRef = ref<HTMLElement | null>(null)

window.addEventListener('scroll', () => {
  fadeinEvent()
  if (window.innerWidth < 960 || window.innerWidth < window.innerHeight) return
  scrollEvent()
})

const titleContainerHeight = computed(() => {
  if (!titleContainerRef.value) return 0
  if (window.innerWidth < 1400) {
    return titleContainerRef.value.getBoundingClientRect().bottom - titleContainerRef.value.getBoundingClientRect().top + 185
  } else {
    return titleContainerRef.value.getBoundingClientRect().bottom - titleContainerRef.value.getBoundingClientRect().top + 195
  }

})
const explainTasksBoxHeight = computed(() => {
  if (!explainTasksBoxRef.value) return 0
  return explainTasksBoxRef.value.getBoundingClientRect().bottom - explainTasksBoxRef.value.getBoundingClientRect().top
})
const explainRoutinesBoxHeight = computed(() => {
  if (!explainRoutinesBoxRef.value) return 0
  return explainRoutinesBoxRef.value.getBoundingClientRect().bottom - explainRoutinesBoxRef.value.getBoundingClientRect().top
})
const explainTagsBoxHeight = computed(() => {
  if (!explainTagsBoxRef.value) return 0
  return explainTagsBoxRef.value.getBoundingClientRect().bottom - explainTagsBoxRef.value.getBoundingClientRect().top
})
const explainPastCompletedBoxHeight = computed(() => {
  if (!explainPastCompletedBoxRef.value) return 0
  return explainPastCompletedBoxRef.value.getBoundingClientRect().bottom - explainPastCompletedBoxRef.value.getBoundingClientRect().top + 40
})

const scrollFlag = ref(false)
const currentY = ref(0)
const scrollEvent = () => {
  const y = window.scrollY
  if (window.innerWidth < 960 || window.innerWidth < window.innerHeight || window.innerHeight < 500) return
  const scrollYFlag = y > currentY.value
  if (scrollYFlag) {
    if (!scrollFlag.value && explainTasksBoxRef.value && explainTasksBoxRef.value.getBoundingClientRect().top > 50) {
      scrollFlag.value = true
      window.scrollTo({ top: titleContainerHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainRoutinesBoxRef.value && explainRoutinesBoxRef.value.getBoundingClientRect().top > 50) {
      scrollFlag.value = true
      window.scrollTo({ top: titleContainerHeight.value + explainTasksBoxHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainTagsBoxRef.value && explainTagsBoxRef.value.getBoundingClientRect().top > 50) {
      scrollFlag.value = true
      window.scrollTo({ top: titleContainerHeight.value + explainTasksBoxHeight.value + explainRoutinesBoxHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainPastCompletedBoxRef.value && explainPastCompletedBoxRef.value.getBoundingClientRect().top > 50) {
      scrollFlag.value = true
      window.scrollTo({ top:
            titleContainerHeight.value +
            explainTasksBoxHeight.value +
            explainRoutinesBoxHeight.value +
            explainTagsBoxHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainTrialBoxRef.value && explainTrialBoxRef.value.getBoundingClientRect().top > 50) {
      scrollFlag.value = true
      window.scrollTo({ top:
            titleContainerHeight.value +
            explainTasksBoxHeight.value +
            explainRoutinesBoxHeight.value +
            explainTagsBoxHeight.value +
            explainPastCompletedBoxHeight.value - 36, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
  } else if (!scrollYFlag) {
    if (!scrollFlag.value && explainTasksBoxRef.value && explainTasksBoxRef.value.getBoundingClientRect().top > 0) {
      scrollFlag.value = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainRoutinesBoxRef.value && explainRoutinesBoxRef.value.getBoundingClientRect().top > 0) {
      scrollFlag.value = true
      window.scrollTo({ top: titleContainerHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainTagsBoxRef.value && explainTagsBoxRef.value.getBoundingClientRect().top > 0) {
      scrollFlag.value = true
      window.scrollTo({ top: titleContainerHeight.value + explainTasksBoxHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainPastCompletedBoxRef.value && explainPastCompletedBoxRef.value.getBoundingClientRect().top > 0) {
      scrollFlag.value = true
      window.scrollTo({ top:
            titleContainerHeight.value +
            explainTasksBoxHeight.value +
            explainRoutinesBoxHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
    if (!scrollFlag.value && explainTrialBoxRef.value && explainTrialBoxRef.value.getBoundingClientRect().top > 0) {
      scrollFlag.value = true
      window.scrollTo({ top:
            titleContainerHeight.value +
            explainTasksBoxHeight.value +
            explainRoutinesBoxHeight.value +
            explainTagsBoxHeight.value, behavior: 'smooth' })
      setTimeout(() => {
        scrollFlag.value = false
      }, 1000)
    }
  }
  currentY.value = y
}
const tasksFlag = ref(true)
const routinesFlag = ref(false)
const tagsFlag = ref(false)
const pastCompletedFlag = ref(false)
const trialFlag = ref(false)
const fadeinEvent = (init = false) => {
  let scrollInt = window.innerWidth / 2
  if (window.innerWidth < 960 || window.innerWidth < window.innerHeight) {
    scrollInt = window.innerWidth + 400
  }
  if (!init) {
    if (explainTasksBoxRef.value && explainTasksBoxRef.value.getBoundingClientRect().top + 100 <= scrollInt) {
      if (tasksFlag.value) isExplainTasksBoxShow.value = true
      routinesFlag.value = true
    }
  }
  if (explainRoutinesBoxRef.value && explainRoutinesBoxRef.value.getBoundingClientRect().top + 100 <= scrollInt) {
    if (routinesFlag.value) isExplainRoutinesBoxShow.value = true
    tagsFlag.value = true
  }
  if (explainTagsBoxRef.value && explainTagsBoxRef.value.getBoundingClientRect().top + 100 <= scrollInt) {
    if (tagsFlag.value) isExplainTagsBoxShow.value = true
    pastCompletedFlag.value = true
  }
  if (explainPastCompletedBoxRef.value && explainPastCompletedBoxRef.value.getBoundingClientRect().top + 100 <= scrollInt) {
    if (pastCompletedFlag.value) isExplainPastCompletedBoxShow.value = true
    trialFlag.value = true
  }
  if (explainTrialBoxRef.value && explainTrialBoxRef.value.getBoundingClientRect().top <= scrollInt) {
    console.log('trialFlag.value', trialFlag.value)
    if (trialFlag.value) isExplainTrialBoxShow.value = true
  }
}

onMounted(() => {
  fadeinEvent(true)
})

</script>

<template>
  <div id="content" class="d-flex">
    <main id="anonymous-main">
      <div ref="titleContainerRef" id="yarucoto-title-container" class="my-5 d-flex">
        <AnonymousTitleContainer></AnonymousTitleContainer>
      </div>
      <div id="yarucoto-title-image-narrow-parent">
        <div id="yarucoto-title-image-narrow" class="_image"></div>
      </div>
      <div class="_yarucoto_space">
        <AnonymousAllow></AnonymousAllow>
      </div>
      <div id="explain-container" class="_explain_container">
        <div ref="explainTasksBoxRef" id="explain-tasks-box-parent" class="_explain_box_parent">
          <AnonymousExplainTasksBox :isExplainTasksBoxShow="isExplainTasksBoxShow"></AnonymousExplainTasksBox>
        </div>
        <div ref="explainRoutinesBoxRef" id="explain-routines-box-parent" class="_explain_box_parent">
          <AnonymousExplainRoutinesBox :isExplainRoutinesBoxShow="isExplainRoutinesBoxShow"></AnonymousExplainRoutinesBox>
        </div>
        <div ref="explainTagsBoxRef" id="explain-tags-box-parent" class="_explain_box_parent">
          <AnonymousExplainTagsBox :isExplainTagsBoxShow="isExplainTagsBoxShow"></AnonymousExplainTagsBox>
        </div>
        <div ref="explainPastCompletedBoxRef" id="explain-past-completed-box-parent" class="_explain_box_parent">
          <AnonymousExplainPcrBox :isExplainPastCompletedBoxShow="isExplainPastCompletedBoxShow"></AnonymousExplainPcrBox>
        </div>
        <div ref="explainTrialBoxRef" id="explain-trial-box-parent">
          <AnonymousExplainTrialBox :isExplainTrialBoxShow="isExplainTrialBoxShow"></AnonymousExplainTrialBox>
        </div>
      </div>
    </main>
  </div>
  <AnonymousToTopBottomBtn></AnonymousToTopBottomBtn>
</template>

<style scoped>
@import "~/assets/css/index.css";
body {
  background-color: rgb(230, 230, 230);
  color: rgb(30, 30, 30);
}
main {
  background-color: rgb(250, 250, 250);
}
#yarucoto-title-image-narrow {
  background-image: url('@/assets/images/screen-shot-0-m.png');
  background-size: contain;
  background-position: center;
}
#anonymous-main {
  width: 100%;
  margin: 0;
  max-width: 100vw;
}
#yarucoto-title-container {
  padding: 0 4rem;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: calc(100vh - 150px - 6rem);
  min-height: 20rem;
}
#yarucoto-title-image-narrow-parent {
  display: none;
}
._yarucoto_space {
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100px;
  width: 100%;
  background-image: linear-gradient(180deg, rgb(250, 250, 250), rgb(230, 230, 230));
}
._explain_container {
  margin: 0;
  padding: 0;
  min-height: 2000px;
  background-color: rgb(230, 230, 230);
}
._explain_box_parent {
  height: calc(100vh - 50px);
  background-image: linear-gradient(180deg, rgb(230, 230, 230), rgb(200, 200, 200));
  padding: 36px 0;
  min-height: 36rem;
}
._explain_box_parent:nth-child(2n) {
  background-image: linear-gradient(0, rgb(230, 230, 230), rgb(200, 200, 200));
}
#explain-trial-box-parent {
  height: 800px;
}
@media (max-width: 1280px) {
  ._yarucoto_space {
    align-items: center;
  }
  #explain-trial-box-parent {
    height: 500px;
  }
}
@media (max-width: 768px) {
  ._explain_box_parent {
    height: auto;
    padding: 0;
    background-image: none !important;
    background-color: transparent;
  }
}

@media (max-width: 576px) or (orientation: portrait) {
  #yarucoto-title-container {
    padding: 0 20px;
    flex-direction: column;
    height: auto;
    margin: 32px 32px 0 32px!important;
  }
  #yarucoto-title-image-narrow-parent {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 54vh;
  }
  #yarucoto-title-image-narrow {
    height: 100%;
    width: 90%;
    max-width: 600px;
  }
  #explain-trial-box-parent {
    height: 600px;
  }
}
</style>
