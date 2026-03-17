<template>
  <div>
    <div class="control-bar glass-panel" :style="controlBarStyle">
      <div class="control-buttons">
        <el-button 
          v-for="button in controlButtons" 
          :key="button.id"
          :type="button.type"
          :icon="button.icon"
          :disabled="button.disabled"
          size="small"
          class="control-button"
          @click="handleButtonClick(button.id)"
        >
          {{ button.text }}
        </el-button>
      </div>
    </div>
    
    <!-- 仿真设置弹窗 -->
    <SimulationSettingsDialog 
      v-model="showSettingsDialog"
      @confirm="handleSettingsConfirm"
      @cancel="handleSettingsCancel"
    />
    
    
    <!-- WebSocket 连接配置弹窗 -->
    <WebSocketSettingsDialog v-model="showWebSocketDialog" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { layoutConfig } from '../config/layout.config.js'
import WebSocketSettingsDialog from './WebSocketSettingsDialog.vue'
import SimulationSettingsDialog from './SimulationSettingsDialog.vue'
import { 
  startSimulation, 
  pauseSimulation, 
  resumeSimulation, 
  stopSimulation, 
  simulationState 
} from '../services/simulation.service.js'

// 使用全局仿真状态

// 弹窗显示状态
const showSettingsDialog = ref(false)
const showWebSocketDialog = ref(false)

// 控制按钮配置（添加 disabled 属性）
const controlButtons = ref([
  { 
    id: 'settings', 
    text: '仿真设置', 
    type: 'primary',
    icon: 'Setting',
    disabled: false
  },
  { 
    id: 'start', 
    text: '开始', 
    type: 'success',
    icon: 'VideoPlay',
    disabled: false
  },
  { 
    id: 'pause', 
    text: '暂停', 
    type: 'warning',
    icon: 'VideoPause',
    disabled: true // 初始禁用
  },
  { 
    id: 'continue', 
    text: '继续', 
    type: 'success',
    icon: 'VideoPlay',
    disabled: true // 初始禁用
  },
  { 
    id: 'stop', 
    text: '终止', 
    type: 'danger',
    icon: 'VideoPause',
    disabled: true // 初始禁用
  },
  { 
    id: 'websocket', 
    text: 'WebSocket', 
    type: 'primary',
    icon: 'Connection',
    disabled: false
  }
])

// 控制栏样式
const controlBarStyle = computed(() => ({
  height: layoutConfig.layout.controlBarHeight,
  margin: '5px',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
}))

// 处理按钮点击（完善仿真控制逻辑）
const handleButtonClick = async (buttonId) => {
  console.log(`🎮 按钮 ${buttonId} 被点击`)
  
  switch (buttonId) {
    case 'settings':
      showSettingsDialog.value = true
      break
      
    case 'start':
      // 🚀 开始仿真
      const startResult = await startSimulation()
      if (startResult) {
        // 更新按钮状态
        updateButtonState('start', 'success')
        disableButton('start')
        enableButton('pause')
        enableButton('stop')
        disableButton('continue')
        console.log('✅ 开始按钮状态已更新')
      }
      break
      
    case 'pause':
      // ⏸️ 暂停仿真
      const pauseResult = await pauseSimulation()
      if (pauseResult) {
        // 更新按钮状态
        updateButtonState('pause', 'warning')
        disableButton('pause')
        enableButton('continue')
        console.log('✅ 暂停按钮状态已更新')
      }
      break
      
    case 'continue':
      // ▶️ 继续仿真
      const resumeResult = await resumeSimulation()
      if (resumeResult) {
        // 更新按钮状态
        updateButtonState('continue', 'success')
        disableButton('continue')
        enableButton('pause')
        console.log('✅ 继续按钮状态已更新')
      }
      break
      
    case 'stop':
      // ⏹️ 终止仿真
      const stopResult = await stopSimulation()
      if (stopResult) {
        // 更新按钮状态
        updateButtonState('stop', 'danger')
        enableButton('start')
        disableButton('pause')
        disableButton('continue')
        disableButton('stop')
        console.log('✅ 终止按钮状态已更新')
      }
      break
      
    case 'websocket':
      showWebSocketDialog.value = true
      break
  }
  
  // 触发自定义事件（通知父组件）
  emit('button-click', { buttonId, simulationState: simulationState })
}

// 更新按钮状态
const updateButtonState = (buttonId, type) => {
  const button = controlButtons.value.find(b => b.id === buttonId)
  if (button) {
    button.type = type
  }
}

// 禁用按钮
const disableButton = (buttonId) => {
  const button = controlButtons.value.find(b => b.id === buttonId)
  if (button) {
    button.disabled = true
  }
}

// 启用按钮
const enableButton = (buttonId) => {
  const button = controlButtons.value.find(b => b.id === buttonId)
  if (button) {
    button.disabled = false
  }
}

// 处理设置确认
const handleSettingsConfirm = (settingsData) => {
  console.log('✅ 仿真设置已确认:', settingsData)
  // 可以在这里处理设置确认的逻辑
  // 后续可以保存设置到全局状态或发送到后端
}

// 处理设置取消
const handleSettingsCancel = () => {
  console.log('❌ 仿真设置已取消')
}




// 定义事件
const emit = defineEmits(['button-click'])
</script>

<style scoped>
.control-bar {
  position: relative;
  overflow: hidden;
}

.control-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-cyan);
  border-radius: 16px 16px 0 0;
  z-index: 2;
}

.control-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-glow);
  opacity: 0.3;
  pointer-events: none;
  z-index: 1;
}

.control-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 3;
}

.control-button {
  min-width: 100px;
  height: 40px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.control-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.control-button:hover::before {
  left: 100%;
}

.control-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 102, 255, 0.4);
}

.control-button:active {
  transform: translateY(-1px) scale(1.02);
}

/* Element Plus 按钮样式覆盖 - 增强蓝色调 */
:deep(.el-button--primary) {
  background: var(--gradient-blue) !important;
  border: none !important;
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.4) !important;
  color: white !important;
  font-weight: 600 !important;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #0052cc 0%, #00a3cc 50%, #0052cc 100%) !important;
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.6) !important;
  transform: translateY(-2px) !important;
}

:deep(.el-button--success) {
  background: var(--gradient-cyan) !important;
  border: none !important;
  box-shadow: 0 0 20px rgba(0, 204, 255, 0.4) !important;
  color: white !important;
  font-weight: 600 !important;
}

:deep(.el-button--success:hover) {
  background: linear-gradient(135deg, #00a3cc 0%, #4d4dff 50%, #00a3cc 100%) !important;
  box-shadow: 0 0 30px rgba(0, 204, 255, 0.6) !important;
  transform: translateY(-2px) !important;
}

:deep(.el-button--warning) {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a5c 50%, #ff6b35 100%) !important;
  border: none !important;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.4) !important;
  color: white !important;
  font-weight: 600 !important;
}

:deep(.el-button--warning:hover) {
  background: linear-gradient(135deg, #cc552a 0%, #ff6b35 50%, #cc552a 100%) !important;
  box-shadow: 0 0 30px rgba(255, 107, 53, 0.6) !important;
  transform: translateY(-2px) !important;
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #ff3366 0%, #ff5c85 50%, #ff3366 100%) !important;
  border: none !important;
  box-shadow: 0 0 20px rgba(255, 51, 102, 0.4) !important;
  color: white !important;
  font-weight: 600 !important;
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #cc2952 0%, #ff3366 50%, #cc2952 100%) !important;
  box-shadow: 0 0 30px rgba(255, 51, 102, 0.6) !important;
  transform: translateY(-2px) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .control-button {
    width: 140px;
    margin: 3px 0;
  }
}
</style>