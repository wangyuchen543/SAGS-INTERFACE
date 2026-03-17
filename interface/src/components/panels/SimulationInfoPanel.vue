<template>
  <div class="simulation-info-panel">
    <h4 class="panel-title">
      <i class="icon">📊</i> 仿真全局信息
    </h4>
    <div class="info-content">
      <div class="info-item">
        <div class="info-label">节点总数</div>
        <div class="info-value neon-text">{{ totalNodes }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">在线节点</div>
        <div class="info-value neon-text online">{{ onlineNodes }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">运行时长</div>
        <div class="info-value neon-text time">{{ runningTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { simulationState, getRunningTime, formatRunningTime } from '../../services/simulation.service.js'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  }
})

// 节点总数
const totalNodes = computed(() => props.nodes.length)

// 在线节点数（假设所有节点都在线）
const onlineNodes = computed(() => props.nodes.length)

// 运行时长
const currentTime = ref(Date.now())

const runningTime = computed(() => {
  // 强制响应式更新
  currentTime.value
  return formatRunningTime(getRunningTime())
})

// 定时器更新运行时长
let timer = null
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.simulation-info-panel {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid rgba(0, 234, 255, 0.3);
  border-radius: 12px;
  padding: 12px;
  margin: 5px;
  box-shadow: 
    0 0 20px rgba(0, 234, 255, 0.2),
    inset 0 0 20px rgba(0, 234, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.simulation-info-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(0, 234, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.panel-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #00eaff;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.icon {
  font-size: 16px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 234, 255, 0.05);
  border: 1px solid rgba(0, 234, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(0, 234, 255, 0.1);
  border-color: rgba(0, 234, 255, 0.4);
  transform: translateX(5px);
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.3);
}

.info-label {
  font-size: 12px;
  color: #8ab4f8;
  font-weight: 500;
}

.info-value {
  font-size: 18px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.neon-text {
  color: #00eaff;
  text-shadow: 
    0 0 5px rgba(0, 234, 255, 0.8),
    0 0 10px rgba(0, 234, 255, 0.5);
}

.neon-text.online {
  color: #00ff88;
  text-shadow: 
    0 0 5px rgba(0, 255, 136, 0.8),
    0 0 10px rgba(0, 255, 136, 0.5);
}

.neon-text.time {
  color: #ffa500;
  text-shadow: 
    0 0 5px rgba(255, 165, 0, 0.8),
    0 0 10px rgba(255, 165, 0, 0.5);
}
</style>

