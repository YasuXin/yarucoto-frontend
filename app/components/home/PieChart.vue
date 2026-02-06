<template>
  <Pie :data="chartData" :options="chartOptions" />
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
  }
})

const chart = reactive({ // Dark
  green: '#58A27C',
  red: '#BB5179',
  titleColor: 'rgb(90, 90, 90)',
  borderColor: 'rgb(220,220,220)',
  fontSize: 20
})

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  chart.green = '#050'
  chart.red = '#900'
  chart.titleColor = 'rgb(150,150,150)'
  chart.borderColor = 'rgb(180,180,180)'
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (event.matches) {
    chart.green = '#050'
    chart.red = '#900'
    chart.titleColor = 'rgb(150,150,150)'
    chart.borderColor = 'rgb(180,180,180)'
  } else {
    chart.green = '#58A27C'
    chart.red = '#BB5179'
    chart.titleColor = 'rgb(90, 90, 90)'
    chart.borderColor = 'rgb(220,220,220)'
  }
});

if (window.innerWidth < 576) chart.fontSize = 16

window.addEventListener('resize', () => {
  if (window.innerWidth < 576) chart.fontSize = 16
  else chart.fontSize = 20
})
const chartData = computed(() => ({
  labels: ['完了', '未完了'],
  datasets: [
    {
      backgroundColor: [
        chart.green,
        chart.red
      ],
      borderColor: chart.borderColor,
      data: [
        props.completedCount,
        props.taskCount - props.completedCount
      ],
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '今日の達成率',
      font: {
        size: chart.fontSize
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
</style>
