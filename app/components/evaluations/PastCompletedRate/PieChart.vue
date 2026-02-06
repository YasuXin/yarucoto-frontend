<template>
  <Pie v-show="!isMaximizeChartShow && taskCount !== 0" :data="chartData" :options="chartOptions" />
  <teleport to="body">
    <transition>
      <div v-show="isMaximizeChartShow" class="_container">
        <div class="_close_btn_parent">
          <button @click="closeMaximizeChartEvent" class="_close_btn d-flex justify-content-center align-items-center">
            <img src="~/assets/images/batsu.png" width="24" alt="x">
          </button>
        </div>
        <div class="_parent">
          <Pie :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

import { Pie } from 'vue-chartjs'

const props = defineProps({
  completedCount: {
    type: Number,
    default: 0
  },
  taskCount: {
    type: Number,
    default: 0
  },
  data: {
    type: Array,
    default: []
  },
  chartTitle: {
    type: String,
    default: ""
  },
  isMaximizeChartShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['closeMaximizeChart'])

const closeMaximizeChartEvent = () => {
  emits('closeMaximizeChart')
}

const completedCount = computed(() => props.completedCount)
const taskCount = computed(() => props.taskCount)
const chartTitle = computed(() => props.chartTitle)
const isMaximizeChartShow = computed(() => props.isMaximizeChartShow)

const chart = reactive({ // Dark
  green: '#58A27C',
  red: '#BB5179',
  titleColor: 'rgb(90, 90, 90)',
  borderColor: 'rgb(220,220,220)'
})

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  chart.green = '#050'
  chart.red = '#900'
  chart.titleColor = 'rgb(200,200,200)'
  chart.borderColor = 'rgb(180,180,180)'
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (event.matches) {
    chart.green = '#050'
    chart.red = '#900'
    chart.titleColor = 'rgb(200,200,200)'
    chart.borderColor = 'rgb(180,180,180)'
  } else {
    chart.green = '#58A27C'
    chart.red = '#BB5179'
    chart.titleColor = 'rgb(90, 90, 90)'
    chart.borderColor = 'rgb(220,220,220)'
  }
});

const chartData : any = computed(() => ({
  labels: ['完了', '未完了'],
  datasets: [
    {
      backgroundColor: [
        chart.green,
        chart.red
      ],
      borderColor: chart.borderColor,
      data: [
        completedCount.value,
        taskCount.value - completedCount.value
      ],
    }
  ]
}))

const chartOptions : any = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: chartTitle.value + 'の達成率',
      font: {
        size: 20
      },
      color: chart.titleColor
    },
    legend: {
      labels: {
        color: chart.titleColor
      }
    }
  }
}))

</script>

<style scoped>
/* 高さ指定しないと表示されないので注意 */
div {
  height: auto;
}
canvas {
  height: 100%!important;
}

.v-enter-active, .v-leave-active {
  transition: all .5s;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
  transform: scale(0, 0);
}
.v-enter-to, .v-leave-from {
  opacity: 1;
  transform: scale(1, 1);
}
._container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: var(--card-bg-color);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
._parent {
  height: 70%!important;
  width: 96%;
}

._close_btn_parent{
  position: absolute;
  top: 20px;
  right: 30px;
}

._close_btn {
  border: none;
  background-color: transparent;
}

</style>
