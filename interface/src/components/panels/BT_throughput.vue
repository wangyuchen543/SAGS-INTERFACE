<template>
  <div class="connections-selector">
    <div class="selector-header">
      <select v-model="selectedType" @change="onTypeChange" class="type-selector">
        <option value="A">业务类型A</option>
        <option value="B">业务类型B</option>
        <option value="C">业务类型C</option>
        <option value="D">业务类型D</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: '网络吞吐量'
  }
})

// 响应式数据
const selectedType = ref('voice')
const typeStats = ref({
  voice: {
    connections: 125,
    transmissionRate: 45.2,
    peakRate: 52.8
  },
  image: {
    connections: 89,
    transmissionRate: 78.5,
    peakRate: 95.3
  },
  command: {
    connections: 156,
    transmissionRate: 12.3,
    peakRate: 18.7
  },
  data: {
    connections: 203,
    transmissionRate: 156.8,
    peakRate: 189.2
  }
})

// 计算属性
const currentStats = computed(() => {
  return typeStats.value[selectedType.value] || typeStats.value.voice
})

// 方法
const onTypeChange = () => {
  console.log('网络吞吐量类型切换到:', selectedType.value)
  // 这里可以添加类型切换的逻辑
}

const updateStats = () => {
  // 模拟数据更新
  Object.keys(typeStats.value).forEach(type => {
    const stats = typeStats.value[type]
    stats.connections = Math.floor(Math.random() * 100) + 80
    stats.transmissionRate = Math.round((Math.random() * 100 + 20) * 10) / 10
    stats.peakRate = Math.round((stats.transmissionRate * 1.2 + Math.random() * 20) * 10) / 10
  })
}

// 生命周期
let updateInterval = null

onMounted(() => {
  // 每3秒更新一次数据
  updateInterval = setInterval(updateStats, 3000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.connections-selector {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.selector-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-selector {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  background-color: #fff;
  cursor: pointer;
  min-width: 180px;
}

.type-selector:focus {
  outline: none;
  border-color: #FF6600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .type-selector {
    width: 100%;
    min-width: auto;
  }
}
</style>