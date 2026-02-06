<script setup lang="ts">
import type {AdminEvaluation} from "~/interfaces";

const props = defineProps({
  evaluation: {
    type: Object as () => AdminEvaluation,
    required: true
  }
})

const emit = defineEmits(['show'])

const evaluation = computed(() => props.evaluation)

const toShow = () => {
  emit('show', evaluation.value.id)
}
</script>

<template>
  <div class="_evaluation_container">
    <div class="_evaluation_box d-flex">
      <div class="_evaluation_id d-flex align-items-center _txt_limit">
        <span class="_id_no">No.</span>{{evaluation.id}}
      </div>
      <div class="_evaluation_column">
        <div class="_evaluation_row d-flex justify-content-between _text_free">
          <div class="_evaluation_left d-flex justify-content-between">
            <div class="_evaluation_rate d-flex justify-content-center">
              <div>
                <span class="_rate_star" v-if="evaluation.rate <= 0 || evaluation.rate >= 6">-</span>
                <span class="_rate_star">
                  <span v-for="i in evaluation.rate" :key="i">&#9733;</span>
                  <span v-for="i in (5-evaluation.rate)" :key="i">&#9734;</span>
                </span>
              </div>
            </div>
            <div class="d-flex">
              <div class="_evaluation_year d-flex justify-content-center">
                <div>{{evaluation.year}}年</div>
              </div>
              <div class="_evaluation_month d-flex justify-content-center">
                <div>{{evaluation.month}}月</div>
              </div>
            </div>
          </div>

          <div class="d-flex _evaluation_right">
            <div class="_show_btn_parent">
              <a @click="toShow" class="_show_btn _evaluation_link">詳細</a>
            </div>
          </div>
        </div>
        <div class="_evaluation_row _evaluation_row_2 d-flex">
          <div class="_evaluation_text d-flex _txt_limit">{{evaluation.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
._evaluation_container {
  width: 100%;
}
._evaluation_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._evaluation_id {
  width: 100px;
  padding-left: 10px;
}
._evaluation_column {
  width: calc(100% - 100px);
  padding-left: 10px;
}
._evaluation_row {
  padding: 10px 0;
  border-bottom: var(--thin-border);
}
._evaluation_left {
  width: calc(100% - 60px);
}
._evaluation_rate {
  width: 100px;
}
._evaluation_text {
  width: calc(100% - 100px);
}
._rate_star {
  color: var(--star-color);
}
._evaluation_year {
  width: 100px;
}
._evaluation_month {
  width: 100px;
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
._evaluation_link {
  color: var(--font-color);
}
._evaluation_link:hover {
  cursor: pointer;
}
._evaluation_text {
  width: 90%;
  padding: 0 10px;
  font-size: 0.8rem;
}
._txt_limit {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
._evaluation_row_2 {
  border-bottom: none;
}
#evaluations-title ._evaluation_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}

@media (max-width: 960px) {
  ._evaluation_id {
    width: 80px;
  }
  ._evaluation_column {
    width: calc(100% - 80px);
  }
}
@media (max-width: 768px) {
  ._evaluation_id {
    padding:0;
  }
  ._evaluation_year {
    width: 80px;
  }
  ._evaluation_month {
    width: 80px;
  }
}
@media (max-width: 576px) {
  ._id_no {
    display: none;
  }
  ._evaluation_box {
    width: 100%;
    margin: 0;
    padding: 0 5px 0 10px;
  }
  ._evaluation_row {
    padding: 10px 10px 10px 0;
  }
  ._evaluation_id {
    width: 60px;
    justify-content: center;
  }
  ._evaluation_rate {
    width: 80px;
  }
  ._evaluation_column {
    width: calc(100% - 60px);
    padding: 0;
  }
  ._evaluation_year {
    width: 60px;
  }
  ._evaluation_month {
    width: 40px;
  }
  ._evaluation_left {
    width: calc(100% - 40px);
  }
  ._evaluation_right {
    width: 40px;
  }
}

</style>
