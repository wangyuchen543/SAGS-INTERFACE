<template>
  <div class="business-chart-panel">
    <!-- 业务类型选择器（仅业务面板显示） -->
    <div class="chart-header" v-if="showBusinessSelector">
      <select v-model="selectedBusiness" @change="onBusinessChange" class="business-selector">
        <option value="A">业务类型A</option>
        <option value="B">业务类型B</option>
        <option value="C">业务类型C</option>
        <option value="D">业务类型D</option>
      </select>
    </div>
    
    <!-- 全局面板标题（仅全局面板显示） -->
    <div class="chart-header" v-else>
      <h4 class="panel-title">{{ title }}</h4>
    </div>
    
    <!-- 折线图画布 -->
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <!-- 统计信息 -->
    <div class="chart-stats">
      <div class="stat-item">
        <span class="stat-label">当前值</span>
        <span class="stat-value">{{ currentValue }} {{ unit }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">平均值</span>
        <span class="stat-value">{{ averageValue }} {{ unit }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">峰值</span>
        <span class="stat-value">{{ peakValue }} {{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { shouldUpdateData, addSimulationListener, removeSimulationListener, timeMultiplier } from '../../services/simulation.service.js'
import { addWSListener, removeWSListener, getLatestPerformanceData, getSimulationData, isSimulationComplete, resetSimulationData } from '../../services/websocket.service.js'

// 注册Chart.js组件
Chart.register(...registerables)

// Props
const props = defineProps({
  panelId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  metricType: {
    type: String,
    default: 'throughput', // throughput, delay, packetLoss, transmissionRate
    validator: (value) => ['throughput', 'delay', 'packetLoss', 'transmissionRate'].includes(value)
  },
  showBusinessSelector: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['business-change', 'data-request'])

// 响应式数据
const selectedBusiness = ref('A')
const chartCanvas = ref(null)
let chart = null

// 数据存储 - 使用 ref 确保深度响应式
const chartData = ref({
  A: { values: [], simulationTimes: [], current: 0, average: 0, peak: 0 },
  B: { values: [], simulationTimes: [], current: 0, average: 0, peak: 0 },
  C: { values: [], simulationTimes: [], current: 0, average: 0, peak: 0 },
  D: { values: [], simulationTimes: [], current: 0, average: 0, peak: 0 }
})

// 存储所有仿真数据，按时间排序
const allSimulationData = ref([])
// 当前显示的时间点
const currentDisplayTime = ref(0)
// 显示定时器
let displayTimer = null

// 计算属性
const currentValue = computed(() => {
  const data = chartData.value[selectedBusiness.value]
  return data.current.toFixed(2)
})

const averageValue = computed(() => {
  const data = chartData.value[selectedBusiness.value]
  return data.average.toFixed(2)
})

const peakValue = computed(() => {
  const data = chartData.value[selectedBusiness.value]
  return data.peak.toFixed(2)
})

// 获取单位
const unit = computed(() => {
  return getMetricConfig().unit
})

// 获取业务类型的Y轴范围配置
const getBusinessRange = (businessType, metricType) => {
  // 业务类型范围配置
  const businessRanges = {
    throughput: {
      A: { min: 0, max: 360 },
      B: { min: 0, max: 3.6 },
      C: { min: 0, max: 3.6 },
      D: { min: 0, max: 0.36 }
    },
    packetLoss: {
      A: { min: 0, max: 1.2 },
      B: { min: 0, max: 1.0 },
      C: { min: 0, max: 0.1 },
      D: { min: 0, max: 0.1 }
    },
    transmissionRate: {
      // 传输速率范围和吞吐量一样
      A: { min: 0, max: 360 },
      B: { min: 0, max: 3.6 },
      C: { min: 0, max: 3.6 },
      D: { min: 0, max: 0.36 }
    },
    delay: {
      // 时延保持全局范围
      A: { min: 0, max: 100 },
      B: { min: 0, max: 100 },
      C: { min: 0, max: 100 },
      D: { min: 0, max: 100 }
    }
  }
  
  return businessRanges[metricType]?.[businessType] || { min: 0, max: 100 }
}

// 获取指标配置
const getMetricConfig = () => {
  // 全局范围配置（用于全局面板）
  const globalConfigs = {
    throughput: {
      label: '吞吐量',
      unit: 'Mbps',
      color: '#00eaff',
      range: { min: 0, max: 360 }
    },
    delay: {
      label: '时延',
      unit: 'ms',
      color: '#ffa500',
      range: { min: 0, max: 100 }
    },
    packetLoss: {
      label: '丢包率',
      unit: '%',
      color: '#ff5c85',
      range: { min: 0, max: 1.2 }
    },
    transmissionRate: {
      label: '传输速率',
      unit: 'Mbps',
      color: '#00ff88',
      range: { min: 0, max: 360 }
    }
  }
  
  const baseConfig = globalConfigs[props.metricType] || globalConfigs.throughput
  
  // 如果是业务面板（有业务选择器），根据选中的业务类型动态设置范围
  if (props.showBusinessSelector) {
    const businessRange = getBusinessRange(selectedBusiness.value, props.metricType)
    return {
      ...baseConfig,
      range: businessRange
    }
  }
  
  // 全局面板使用全局范围
  return baseConfig
}

// 初始化图表
const initChart = () => {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  const config = getMetricConfig()
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: `${config.label} (${config.unit})`,
        data: [],
        borderColor: config.color,
        backgroundColor: `${config.color}20`,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: config.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 20, 40, 0.9)',
          titleColor: '#00eaff',
          bodyColor: '#fff',
          borderColor: '#00eaff',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: 'rgba(0, 234, 255, 0.1)',
            borderColor: 'rgba(0, 234, 255, 0.3)'
          },
          ticks: {
            color: '#8ab4f8',
            font: { size: 10 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
            callback: function(value, index, ticks) {
              // 自定义标签显示逻辑
              const label = this.getLabelForValue(value)
              return label
            }
          }
        },
        y: {
          display: true,
          min: config.range.min,
          max: config.range.max,
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 234, 255, 0.1)',
            borderColor: 'rgba(0, 234, 255, 0.3)'
          },
          ticks: {
            color: '#8ab4f8',
            font: { size: 10 }
          }
        }
      },
      animation: {
        duration: 300
      }
    }
  })
}


// 从性能数据中提取指定指标值
const extractMetricValue = (performanceData) => {
  if (!performanceData) return null
  
  // 如果显示业务选择器，则使用业务类型数据
  if (props.showBusinessSelector) {
    const businessData = performanceData.business?.[selectedBusiness.value]
    if (businessData) {
      return businessData[props.metricType] || null
    }
  } else {
    // 否则使用整体数据
    return performanceData.overall?.[props.metricType] || null
  }
  
  return null
}

// 优化横轴时间标签显示
const optimizeTimeLabels = (simulationTimes) => {
  if (!simulationTimes || simulationTimes.length === 0) {
    return []
  }
  
  const dataCount = simulationTimes.length
  const maxLabels = 8 // 最多显示8个标签
  
  // 如果数据点少于等于8个，显示所有时间点
  if (dataCount <= maxLabels) {
    return simulationTimes.map(time => formatTimeLabel(time))
  }
  
  // 如果数据点较多，智能选择显示点
  const step = Math.ceil(dataCount / maxLabels)
  const labels = []
  
  // 总是显示第一个时间点
  labels.push(formatTimeLabel(simulationTimes[0]))
  
  // 选择中间的关键时间点
  for (let i = step; i < dataCount - 1; i += step) {
    labels.push(formatTimeLabel(simulationTimes[i]))
  }
  
  // 总是显示最后一个时间点
  const lastTime = simulationTimes[dataCount - 1]
  if (labels[labels.length - 1] !== formatTimeLabel(lastTime)) {
    labels.push(formatTimeLabel(lastTime))
  }
  
  return labels
}

// 格式化时间标签
const formatTimeLabel = (time) => {
  if (time >= 60) {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return seconds === 0 ? `${minutes}m` : `${minutes}m${seconds}s`
  } else {
    return `${time}s`
  }
}

// 处理仿真完成事件
const handleSimulationComplete = (simulationData) => {
  // 存储所有仿真数据，按时间排序
  allSimulationData.value = simulationData.sort((a, b) => a.simulationTime - b.simulationTime)
  
  // 清空当前显示数据
  Object.keys(chartData.value).forEach(business => {
    chartData.value[business].values = []
    chartData.value[business].simulationTimes = []
  })
  
  // 重置显示时间
  currentDisplayTime.value = 0
  
  // 开始按时间逐步显示数据
  startTimelineDisplay()
}

// 开始按时间线显示数据
const startTimelineDisplay = () => {
  // 清除之前的定时器
  if (displayTimer) {
    clearInterval(displayTimer)
    displayTimer = null
  }
  
  // 根据倍速计算interval：1000ms / 倍速，最小50ms防止太快
  const interval = Math.max(50, 1000 / timeMultiplier.value)
  
  console.log(`🎬 开始以 ${timeMultiplier.value.toFixed(2)}x 倍速播放数据 (interval: ${interval.toFixed(0)}ms)`)
  
  // 按照动态interval显示数据点
  displayTimer = setInterval(() => {
    addNextTimePoint()
  }, interval)
}

// 暂停图表显示
const pauseTimelineDisplay = () => {
  console.log('⏸️ 图表暂停显示')
  if (displayTimer) {
    clearInterval(displayTimer)
    displayTimer = null
  }
}

// 继续图表显示
const resumeTimelineDisplay = () => {
  console.log('▶️ 图表继续显示')
  // 只有在有数据且尚未完成时才继续
  if (allSimulationData.value.length > 0) {
    const maxTime = Math.max(...allSimulationData.value.map(data => data.simulationTime))
    if (currentDisplayTime.value <= maxTime) {
      startTimelineDisplay()
    }
  }
}

// 添加下一个时间点的数据
const addNextTimePoint = () => {
  // 找到当前时间点的数据
  const currentData = allSimulationData.value.find(data => data.simulationTime === currentDisplayTime.value)
  
  if (currentData) {
    // 提取当前业务类型的指标值
    const value = extractMetricValue(currentData)
    if (value !== null) {
      const business = selectedBusiness.value
      const chartDataItem = chartData.value[business]
      
      // 🆕 滑动窗口：限制最多显示8个数据点
      const maxDataPoints = 8
      
      // 添加数据点
      chartDataItem.values.push(value)
      chartDataItem.simulationTimes.push(currentData.simulationTime)
      chartDataItem.current = value
      
      // 🆕 如果超过最大点数，移除最早的数据点（滑动窗口）
      if (chartDataItem.values.length > maxDataPoints) {
        chartDataItem.values.shift()  // 移除第一个元素
        chartDataItem.simulationTimes.shift()
      }
      
      // 计算统计值
      if (chartDataItem.values.length > 0) {
        chartDataItem.average = chartDataItem.values.reduce((a, b) => a + b, 0) / chartDataItem.values.length
        chartDataItem.peak = Math.max(...chartDataItem.values)
      }
      
      // 更新图表
      updateChart()
    }
  }
  
  // 移动到下一个时间点
  currentDisplayTime.value++
  
  // 检查是否所有数据都已显示
  const maxTime = Math.max(...allSimulationData.value.map(data => data.simulationTime))
  if (currentDisplayTime.value > maxTime) {
    // 停止定时器
    if (displayTimer) {
      clearInterval(displayTimer)
      displayTimer = null
    }
    
    // 🎯 触发图表绘制完成事件，显示完成弹窗
    console.log('✅ 折线图已绘制到最后一秒，触发完成事件')
    window.dispatchEvent(new CustomEvent('simulation-chart-complete', {
      detail: {
        maxTime,
        dataPoints: allSimulationData.value.length
      }
    }))
  }
}

// 更新图表显示
const updateChart = () => {
  if (chart) {
    const data = chartData.value[selectedBusiness.value]
    const config = getMetricConfig()
    
    // 如果是业务面板，确保Y轴范围正确
    if (props.showBusinessSelector) {
      chart.options.scales.y.min = config.range.min
      chart.options.scales.y.max = config.range.max
    }
    
    // 根据数据量优化横轴显示
    const timeLabels = optimizeTimeLabels(data.simulationTimes)
    chart.data.labels = timeLabels
    chart.data.datasets[0].data = [...data.values]
    chart.update('none')
  }
}

// 更新图表数据（仅使用WebSocket数据）
const updateChartData = async () => {
  // 检查是否应该更新数据
  if (!shouldUpdateData()) {
    return
  }
  
  // 检查仿真是否完成
  if (isSimulationComplete()) {
    const simulationData = getSimulationData()
    handleSimulationComplete(simulationData)
  }
}

// 业务类型切换
const onBusinessChange = () => {
  // 重新构建当前业务类型的数据
  rebuildCurrentBusinessData()
  
  // 更新Y轴范围（如果是业务面板）
  if (props.showBusinessSelector && chart) {
    const config = getMetricConfig()
    chart.options.scales.y.min = config.range.min
    chart.options.scales.y.max = config.range.max
  }
  
  // 更新图表
  updateChart()
  
  emit('business-change', {
    business: selectedBusiness.value,
    metricType: props.metricType
  })
}

// 重新构建当前业务类型的数据
const rebuildCurrentBusinessData = () => {
  const business = selectedBusiness.value
  const chartDataItem = chartData.value[business]
  
  // 清空当前数据
  chartDataItem.values = []
  chartDataItem.simulationTimes = []
  
  // 根据当前显示时间重建数据
  for (let time = 0; time <= currentDisplayTime.value; time++) {
    const data = allSimulationData.value.find(d => d.simulationTime === time)
    if (data) {
      const value = extractMetricValue(data)
      if (value !== null) {
        chartDataItem.values.push(value)
        chartDataItem.simulationTimes.push(time)
        chartDataItem.current = value
      }
    }
  }
  
  // 计算统计值
  if (chartDataItem.values.length > 0) {
    chartDataItem.average = chartDataItem.values.reduce((a, b) => a + b, 0) / chartDataItem.values.length
    chartDataItem.peak = Math.max(...chartDataItem.values)
  }
}

// 对外暴露方法：接收WebSocket数据
const updateWithRealData = (business, value, simulationTime) => {
  const data = chartData.value[business]
  
  data.values.push(value)
  data.simulationTimes.push(simulationTime || 0)
  data.current = value
  
  if (data.values.length > 0) {
    data.average = data.values.reduce((a, b) => a + b, 0) / data.values.length
    data.peak = Math.max(...data.values)
  }
  
  // 如果是当前选中的业务，更新图表
  if (business === selectedBusiness.value && chart) {
    chart.data.labels = data.simulationTimes.map(time => `${time}s`)
    chart.data.datasets[0].data = [...data.values]
    chart.update('none')
  }
}

// 监听倍速变化，重新调整播放速度
watch(() => timeMultiplier.value, (newMultiplier) => {
  console.log(`📊 图表检测到倍速变化: ${newMultiplier.toFixed(2)}x，重新调整播放速度`)
  
  // 如果正在播放，重启定时器以应用新的倍速
  if (displayTimer) {
    clearInterval(displayTimer)
    startTimelineDisplay()
  }
})

// 仿真事件处理函数（需要在组件级别定义，以便在 onUnmounted 中移除）
const handleSimulationStart = () => {
  resetSimulationData()
  // 如果正在播放，先暂停
  pauseTimelineDisplay()
}

const handleSimulationPause = () => {
  // 暂停图表显示
  pauseTimelineDisplay()
}

const handleSimulationResume = () => {
  // 继续图表显示
  resumeTimelineDisplay()
}

const handleSimulationStop = () => {
  // 仿真停止时，停止图表显示
  pauseTimelineDisplay()
}

// 生命周期
onMounted(() => {
  initChart()
  
  // 添加WebSocket仿真完成监听器
  addWSListener('simulation-complete', handleSimulationComplete)
  
  // 添加仿真状态监听器
  addSimulationListener('simulation:start', handleSimulationStart)
  addSimulationListener('simulation:pause', handleSimulationPause)
  addSimulationListener('simulation:resume', handleSimulationResume)
  addSimulationListener('simulation:stop', handleSimulationStop)
})

onUnmounted(() => {
  // 移除WebSocket监听器
  removeWSListener('simulation-complete', handleSimulationComplete)
  
  // 移除仿真状态监听器
  removeSimulationListener('simulation:start', handleSimulationStart)
  removeSimulationListener('simulation:pause', handleSimulationPause)
  removeSimulationListener('simulation:resume', handleSimulationResume)
  removeSimulationListener('simulation:stop', handleSimulationStop)
  
  // 清理定时器
  if (displayTimer) {
    clearInterval(displayTimer)
    displayTimer = null
  }
  
  // 销毁图表
  if (chart) {
    chart.destroy()
  }
})

// 暴露方法给父组件
defineExpose({
  updateWithRealData
})
</script>

<style scoped>
.business-chart-panel {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(13, 27, 42, 0.95) 100%);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 
    0 0 15px rgba(0, 234, 255, 0.2),
    inset 0 0 15px rgba(0, 234, 255, 0.05);
}

.chart-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
}

.business-selector {
  padding: 6px 12px;
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 234, 255, 0.4);
  border-radius: 6px;
  color: #00eaff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.5);
  min-width: 150px;
  text-align: center;
}

.business-selector:hover {
  border-color: #00eaff;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.4);
}

.business-selector:focus {
  border-color: #00eaff;
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.6);
}

.business-selector option {
  background: #0a1628;
  color: #00eaff;
  padding: 8px;
}

.panel-title {
  color: #00eaff;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.5);
  letter-spacing: 1px;
}

.chart-container {
  flex: 1;
  min-height: 0;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 6px 4px;
  background: rgba(0, 20, 40, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: #8ab4f8;
  font-weight: 500;
}

.stat-value {
  font-size: 13px;
  color: #00eaff;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.6);
}

/* 响应式 */
@media (max-width: 768px) {
  .business-selector {
    min-width: 120px;
    font-size: 11px;
  }
  
  .stat-label {
    font-size: 9px;
  }
  
  .stat-value {
    font-size: 11px;
  }
}
</style>


