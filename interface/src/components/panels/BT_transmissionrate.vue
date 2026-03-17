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
    default: '连接数'
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
  console.log('连接数类型切换到:', selectedType.value)
  // 这里可以添加类型切换的逻辑
}

const updateStats = () => {
  // 数据由WebSocket实时提供，无需模拟
  console.log('传输速率数据由WebSocket实时提供')
}

// 生命周期
onMounted(() => {
  console.log('传输速率面板已加载，等待WebSocket数据')
})

onUnmounted(() => {
  console.log('传输速率面板已卸载')
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