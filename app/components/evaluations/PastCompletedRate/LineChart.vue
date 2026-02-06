<template>
  <Line v-show="!isMaximizeChartShow && compRateArr.length !== 0" :data="chartData" :options="chartOptions" />
  <teleport to="body">
    <transition>
      <div v-show="isMaximizeChartShow" class="_container">
        <div class="_close_btn_parent">
          <button @click="closeMaximizeChartEvent" class="_close_btn d-flex justify-content-center align-items-center">
            <img src="~/assets/images/batsu.png" width="24" alt="x">
          </button>
        </div>
        <div class="_parent">
          <Line :data="chartData" :options="chartOptions" />
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
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
)

import {Line} from 'vue-chartjs'

const props = defineProps({
  labelArr: {
    type: Array,
    default: []
  },
  compRateArr: {
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

const chart = reactive({ // Dark
  green: '#58A27C',
  red: '#BB5179',
  titleColor: 'rgb(90, 90, 90)',
  gridColor: '#ccc'
})

const emits = defineEmits(['closeMaximizeChart'])

const closeMaximizeChartEvent = () => {
  emits('closeMaximizeChart')
}

const labelArr = computed(() => props.labelArr)
const compRateArr = computed(() => props.compRateArr)
const chartTitle = computed(() => props.chartTitle)
const isMaximizeChartShow = computed(() => props.isMaximizeChartShow)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  chart.green = '#050'
  chart.red = '#900'
  chart.titleColor = 'rgb(200,200,200)'
  chart.gridColor = '#333'
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (event.matches) {
    chart.green = '#050'
    chart.red = '#900'
    chart.titleColor = 'rgb(200,200,200)'
    chart.gridColor = '#333'
  } else {
    chart.green = '#58A27C'
    chart.red = '#BB5179'
    chart.titleColor = 'rgb(90, 90, 90)'
    chart.gridColor = '#ccc'
  }
});

const chartData : any = computed(() => ({
  labels: labelArr.value,
  datasets: [{
      label: "達成率",
      backgroundColor: chart.titleColor,
      borderColor: chart.green,
      data: compRateArr.value,
    }],
}))

const chartOptions : any = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: chartTitle.value + 'の達成率の推移',
      font: {
        size: 20
      },
      color: chart.titleColor
    },
  },
  scales: {
    y: {
      display: true,
      suggestedMax: 100,
      beginAtZero: true,
      ticks: {
        display: true,
        stepSize: 1,
        maxTicksLimit: 20,
        callback: function (value: string, index: number, values: string) {
          return value + '%';
        },
        color: chart.titleColor
      },
      grid: {
        color: chart.gridColor
      }
    },
    x: {
      ticks: {
        color: chart.titleColor
      },
      grid: {
        color: chart.gridColor
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
  height: auto!important;
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

._close_btn_parent {
  position: absolute;
  top: 20px;
  right: 30px;
}

._close_btn {
  border: none;
  background-color: transparent;
}

._parent {
  width: 90%;
  height: 70%;
}

</style>
