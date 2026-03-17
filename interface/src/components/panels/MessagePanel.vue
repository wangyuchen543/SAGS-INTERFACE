<template>
  <div class="message-panel">
    <h4 class="panel-title">消息区域</h4>
    <div class="message-content">
      <div class="message-list">
        <div v-for="(message, index) in messages" :key="index" class="message-item">
          <span class="message-time">{{ message.time }}</span>
          <span class="message-text">{{ message.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { shouldUpdateData, addSimulationListener, removeSimulationListener } from '../../services/simulation.service.js'
import { addWSListener, removeWSListener } from '../../services/websocket.service.js'

const messages = ref([
  { time: '10:30:15', text: '系统就绪，等待仿真开始' }
])

let messageInterval = null

// 添加消息
const addMessage = (text) => {
  const now = new Date()
  const timeStr = now.toTimeString().split(' ')[0]
  const newMessage = {
    time: timeStr,
    text: text
  }
  messages.value.push(newMessage)
  
  // 保持最多10条消息
  if (messages.value.length > 10) {
    messages.value.shift()
  }
}

// WebSocket连接成功处理
const handleWSConnected = (data) => {
  const { host, port } = data
  addMessage(`🔌 已连接到 ws://${host}:${port}`)
}

// 仿真状态变化处理
const handleSimulationStart = () => {
  addMessage('🚀 仿真开始运行')
  addMessage('📡 节点通信已启动')
  addMessage('📊 数据采集开始')
}

const handleSimulationPause = () => {
  addMessage('⏸️ 仿真已暂停')
}

const handleSimulationResume = () => {
  addMessage('▶️ 仿真继续运行')
}

const handleSimulationStop = () => {
  addMessage('⏹️ 仿真已终止')
  addMessage('📊 数据采集停止')
  addMessage('📡 节点通信已断开')
}

// 模拟消息更新（只在仿真运行时）
const updateMessages = () => {
  if (!shouldUpdateData()) {
    return
  }
  
  const messageTypes = [
    '节点状态更新',
    '数据传输完成',
    '网络连接正常',
    '性能指标更新',
    '通信质量良好',
    '系统运行稳定'
  ]
  
  const randomMessage = messageTypes[Math.floor(Math.random() * messageTypes.length)]
  addMessage(randomMessage)
}

// 生命周期
onMounted(() => {
  // 监听仿真状态变化
  addSimulationListener('simulation:start', handleSimulationStart)
  addSimulationListener('simulation:pause', handleSimulationPause)
  addSimulationListener('simulation:resume', handleSimulationResume)
  addSimulationListener('simulation:stop', handleSimulationStop)
  
  // 监听WebSocket连接成功事件
  addWSListener('connected', handleWSConnected)
  
  // 启动消息更新定时器
  messageInterval = setInterval(updateMessages, 5000)
})

onUnmounted(() => {
  // 清理定时器
  if (messageInterval) {
    clearInterval(messageInterval)
  }
  
  // 移除事件监听器
  removeSimulationListener('simulation:start', handleSimulationStart)
  removeSimulationListener('simulation:pause', handleSimulationPause)
  removeSimulationListener('simulation:resume', handleSimulationResume)
  removeSimulationListener('simulation:stop', handleSimulationStop)
  
  // 移除WebSocket监听器
  removeWSListener('connected', handleWSConnected)
})
</script>

<style scoped>
.message-panel {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d1117 50%, #21262d 100%);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 12px;
  padding: 8px;
  margin: 5px;
  box-shadow: 
    0 0 20px rgba(138, 43, 226, 0.2),
    inset 0 0 20px rgba(138, 43, 226, 0.05);
  position: relative;
  overflow: hidden;
}

.panel-title {
  margin: 0 0 10px 0;
  font-size: 8px;
  text-align: center;
  color: #8a2be2;
  font-weight: bold;
  text-shadow: 
    0 0 10px rgba(138, 43, 226, 0.8),
    0 0 20px rgba(138, 43, 226, 0.6),
    0 0 30px rgba(138, 43, 226, 0.4);
  letter-spacing: 1px;
}

.message-content {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.message-item {
  display: flex;
  gap: 8px;
  font-size: 10px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.message-item:hover {
  background: rgba(138, 43, 226, 0.1);
  border-color: rgba(138, 43, 226, 0.4);
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.2);
}

.message-time {
  color: #8a2be2;
  font-size: 9px;
  min-width: 50px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(138, 43, 226, 0.6);
}

.message-text {
  color: #e0e0e0;
  font-size: 9px;
  flex: 1;
}

/* 自定义滚动条 */
.message-content::-webkit-scrollbar {
  width: 6px;
}

.message-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.message-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8a2be2 0%, #6a1b9a 100%);
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(138, 43, 226, 0.5);
}

.message-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #9c27b0 0%, #8a2be2 100%);
  box-shadow: 0 0 8px rgba(138, 43, 226, 0.6);
}
</style> 