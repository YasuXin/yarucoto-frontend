<script setup lang="ts">
import type {Evaluation} from "~/interfaces"
import {useMakeStrFromTimestamp} from "~/composables/useMakeStrFromTimestamp";
const props = defineProps({
  evaluation: {
    type: Object as () => Evaluation,
    default: (): Evaluation => ({
      id: 0,
      year: 0,
      month: 0,
      rate: 0,
      text: '',
      createdAt: '',
      updatedAt: ''
    })
  }
})

const emit = defineEmits(['updateEvaluation'])
const evaluation = computed(() => props.evaluation as Evaluation)

const createdAt = computed(() => useMakeStrFromTimestamp(evaluation.value?.createdAt ?? '0000-00-00 00:00:00.000000'))
const updatedAt = computed(() => useMakeStrFromTimestamp(evaluation.value?.updatedAt ?? '0000-00-00 00:00:00.000000'))
console.log(createdAt.value)
watch(evaluation, (newVal, oldVal) => {
  rate.value = newVal.rate ? newVal.rate : 0
  text.value = newVal.text ? newVal.text: ''
})
const rate = ref(0)
const text = ref('')
watch(text, () => {
  if (text.value.length > 0) {
    alertText.value = ''
  } else {
    alertText.value = 'テキストに値を入力してください'
  }
  textOk.value = text.value.length > 0
})
const alertText = ref('')

const textOk = ref(false)

const disabledSubmit = computed(() => !textOk.value)

const rateEvent = (e: Event) => {
  e.preventDefault();
  const t = e.target as HTMLButtonElement
  rate.value = Number(t.dataset.rank)
  if (rate.value > 5) {
    rate.value = 5
  }
  if (rate.value < 1) {
    rate.value = 1
  }
}
const onSubmit = () => {
  emit('updateEvaluation', {
    rate: rate.value,
    text: text.value,
    year: evaluation.value.year,
    month: evaluation.value.month
  })
}

</script>

<template>
  <transition>
    <div id="evaluation-container">
      <div id="evaluation-box">
        <div class="d-flex justify-content-center">
          <h5><span id="evaluation-year">{{evaluation.year}}</span>年<span id="evaluation-month">{{evaluation.month}}</span>月の評価</h5>
        </div>
        <form id="evaluation-form">
          <div id="created-updated-rate">
            <div class="_created_updated">
              <div class="_created">
                <div>投稿日：</div>
                <div>{{createdAt}}</div>
              </div>
              <div class="_updated">
                <div>更新日：</div>
                <div>{{updatedAt}}</div>
              </div>
            </div>
            <div class="form-group mb-2">
              <label for="" class="form-label fw-bold">5段階評価：</label>
              <div>
                <button @click="rateEvent" v-for="n in rate" :key="n" :data-rank="n" class="_evaluation_star_on">&#9733;</button>
                <button @click="rateEvent" v-for="n in (5 - rate)" :key="n" :data-rank="rate + n" class="_evaluation_star_off">&#9734;</button>
              </div>
            </div>
          </div>
          <div class="form-group mb-2">
            <label for="input-evaluation-text" class="form-label fw-bold">テキスト：<small
                style="color:var(--bs-red)">※必須</small></label>
            <textarea v-model="text" name="text" id="input-evaluation-text" class="form-control shadow-sm"
                      placeholder="文字制限なし"></textarea>
            <div id="alert-text" class="_alert">{{alertText}}</div>
          </div>
          <div class="w-100 d-flex justify-content-center">
            <button @click="onSubmit" id="evaluation-submit-btn" class="btn _btn_past_completed_rate shadow-sm" :class="{'_disabled' : disabledSubmit }" :disabled="disabledSubmit">送信</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: opacity .2s;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
.v-enter-to, .v-leave-from {
  opacity: 1;
}
#evaluation-container {
  font-size: 0.9rem;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 10px 0 10px;
}
#evaluation-box {
  width: 100%;
  border: var(--middle-border);
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  -webkit-box-shadow: var(--task-shadow);
  padding: 20px 30px;
}

#input-evaluation-text {
  height: 120px;
}

input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 .25rem rgba(255, 178, 46, 0.491) !important;
}

._evaluation_star_on, ._evaluation_star_off {
  background-color: transparent;
  color: var(--star-color);
  border: none;
  font-size: 1.2rem;
}
._alert {
  color: red;
  font-size: 0.8rem;
  margin-top: 5px!important;
  height: 10px;
}
#created-updated-rate {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
}
._created_updated {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
}
._created, ._updated {
  flex-basis: 50%;
  display: flex;
  justify-content: center;
}
@media (max-width: 1400px) {
  #created-updated-rate {
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  ._created_updated {
    flex-direction: column;
    align-items: end;
    width: auto;
  }
}
@media (max-width: 1200px) {
  #evaluation-container {
    padding: 10px 20px 0 20px;
  }
  #created-updated-rate {
    flex-direction: column;
  }
  ._created_updated {
    flex-direction: row;
    align-items: center;
  }
}
@media (max-width: 1080px) {
  #input-evaluation-text {
    height: 160px;
  }
}

@media (max-width: 768px) {
  #evaluation-container {
    padding: 10px 10px 0 10px;
  }
  #evaluation-box {
    width: 100%;
  }
}

@media (max-width: 576px) {
  #evaluation-box {
    padding: 30px 10px;
  }
  #evaluation-submit-btn {
    width: 100%;
  }
  #created-updated-rate {
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  ._created_updated {
    flex-direction: column;
    align-items: end;
  }
}
@media (max-width: 375px) {
  #created-updated-rate {
    flex-direction: column;
  }
  ._created_updated {
    display: none;
  }
}

</style>
