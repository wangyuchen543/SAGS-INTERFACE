<template>
  <div class="network-traffic-selector">
    <div class="selector-content">
      <div class="dropdown-container">
        <select 
          v-model="selectedType" 
          @change="handleTypeChange"
          class="traffic-dropdown"
        >
          <option value="A">业务类型A</option>
          <option value="B">业务类型B</option>
          <option value="C">业务类型C</option>
          <option value="D">业务类型D</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  panelId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

// 响应式数据
const selectedType = ref('voice')
const processingStatus = ref('active')
const typeStats = ref({
  voice: { packetLoss: 0.2, rate: 98.5 },
  image: { packetLoss: 0.5, rate: 95.2 },
  command: { packetLoss: 0.1, rate: 99.1 },
  data: { packetLoss: 0.3, rate: 97.8 }
})


// 计算属性
const getTypeDisplayName = (type) => {
  const typeNames = {
    voice: '语音类型',
    image: '图像类型', 
    command: '命令类型',
    data: '数据类型'
  }
  return typeNames[type] || type
}

const getCurrentTypeStats = computed(() => {
  return typeStats.value[selectedType.value] || { packetLoss: 0, rate: 0 }
})

const getStatusColor = computed(() => {
  const packetLoss = getCurrentTypeStats.value.packetLoss
  if (packetLoss <= 0.2) return '#00B050' // 绿色 - 良好
  if (packetLoss <= 0.5) return '#FFC000' // 黄色 - 一般
  return '#C5504B' // 红色 - 较差
})

// 方法
const handleTypeChange = () => {
  console.log('网络流量类型切换到:', selectedType.value)
  // 这里可以添加切换类型时的逻辑
  updateStats()
}

const updateStats = () => {
  // 数据由WebSocket实时提供，无需模拟
  console.log('丢包率数据由WebSocket实时提供')
}

// 生命周期
onMounted(() => {
  console.log('丢包率面板已加载，等待WebSocket数据')
})

onUnmounted(() => {
  console.log('丢包率面板已卸载')
})
</script>

<style scoped>
.network-traffic-selector {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 10px;
  margin: 2px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.selector-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dropdown-container {
  margin-bottom: 10px;
}

.traffic-dropdown {
  width: 100%;
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 11px;
  background-color: white;
  cursor: pointer;
}

.traffic-dropdown:focus {
  outline: none;
  border-color: #4472C4;
  box-shadow: 0 0 3px rgba(68, 114, 196, 0.3);
}

.traffic-dropdown option {
  padding: 5px;
  font-size: 11px;
}
</style>