<template>
  <div class="performance-chart">
    <h4 class="panel-title">{{ title }}</h4>
    <div class="chart-content">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '性能指标'
  }
})

const chartCanvas = ref(null)
let chart = null

// 生成模拟数据
const generateData = () => {
  const data = []
  for (let i = 0; i < 20; i++) {
    data.push(Math.random() * 100)
  }
  return data
}

// 绘制图表
const drawChart = () => {
  const canvas = chartCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 绘制背景
  ctx.fillStyle = '#f8f8f8'
  ctx.fillRect(0, 0, width, height)
  
  // 生成数据
  const data = generateData()
  const stepX = width / (data.length - 1)
  
  // 绘制网格
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = (height / 4) * i
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  
  // 绘制数据线
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = 2
  ctx.beginPath()
  
  data.forEach((value, index) => {
    const x = index * stepX
    const y = height - (value / 100) * height
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
  
  // 绘制数据点
  ctx.fillStyle = '#ff0000'
  data.forEach((value, index) => {
    const x = index * stepX
    const y = height - (value / 100) * height
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, 2 * Math.PI)
    ctx.fill()
  })
}

// 更新数据
const updateChart = () => {
  drawChart()
}

onMounted(() => {
  drawChart()
  
  // 定期更新数据
  setInterval(() => {
    updateChart()
  }, 3000)
})

// 监听标题变化
watch(() => props.title, () => {
  drawChart()
})
</script>

<style scoped>
.performance-chart {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 10px;
  margin: 2px;
}

.panel-title {
  margin: 0 0 8px 0;
  font-size: 8px;
  text-align: center;
  color: #333;
  background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
  color: white;
  padding: 3px;
  border-radius: 3px;
}

.chart-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 30px);
  width: 100%;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>