<template>
  <div class="error-rate-selector">
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
    default: '错误率'
  }
})

// 响应式数据
const selectedType = ref('voice')
const typeStats = ref({
  voice: {
    errorRate: 0.5,
    delay: 15.2
  },
  image: {
    errorRate: 0.8,
    delay: 22.5
  },
  command: {
    errorRate: 0.3,
    delay: 8.7
  },
  data: {
    errorRate: 1.2,
    delay: 35.8
  }
})

// 计算属性
const currentStats = computed(() => {
  return typeStats.value[selectedType.value] || typeStats.value.voice
})

// 方法
const onTypeChange = () => {
  console.log('错误率类型切换到:', selectedType.value)
  // 这里可以添加类型切换的逻辑
}

const updateStats = () => {
  // 数据由WebSocket实时提供，无需模拟
  console.log('时延数据由WebSocket实时提供')
}

// 生命周期
onMounted(() => {
  console.log('时延面板已加载，等待WebSocket数据')
})

onUnmounted(() => {
  console.log('时延面板已卸载')
})
</script>

<style scoped>
.error-rate-selector {
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
  border-color: #E74C3C;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .type-selector {
    width: 100%;
    min-width: auto;
  }
}
</style>