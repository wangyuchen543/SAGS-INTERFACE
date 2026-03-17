<template>
  <div class="connection-control-panel">
    <div class="control-content">
      <!-- 连线显示开关 -->
      <div class="switch-container compact">
        <span class="switch-label">显示连线</span>
        <el-switch 
          v-model="showConnections"
          size="default"
          @change="handleConnectionToggle"
        />
      </div>
      
      <!-- TCP/UDP协议切换 -->
      <div class="protocol-selector">
        <span class="protocol-label">传输协议</span>
        <el-segmented 
          v-model="transportProtocol" 
          :options="protocolOptions"
          size="small"
          @change="handleProtocolChange"
        />
      </div>
      
      <!-- 4G/5G通信切换 -->
      <div class="comm-selector">
        <span class="comm-label">通信制式</span>
        <el-segmented 
          v-model="commMode" 
          :options="commOptions"
          size="small"
          @change="handleCommChange"
        />
      </div>
      
      <!-- 路由协议切换 -->
      <div class="routing-selector">
        <span class="routing-label">路由协议</span>
        <el-segmented 
          v-model="routingProtocol" 
          :options="routingOptions"
          size="small"
          @change="handleRoutingChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { transportProtocol, setTransportProtocol, commMode, setCommMode, routingProtocol, setRoutingProtocol } from '../../services/simulation.service.js'

// 定义 emits
const emit = defineEmits(['toggle-connections'])

// 连线显示状态
const showConnections = ref(true)

// 协议选项
const protocolOptions = [
  { label: 'TCP', value: 'TCP' },
  { label: 'UDP', value: 'UDP' },
  { label: 'SCTP', value: 'SCTP' }
]

// 通信制式选项
const commOptions = [
  { label: '4G', value: '4G' },
  { label: '5G', value: '5G' }
]

// 路由协议选项
const routingOptions = [
  { label: 'AODV', value: 'AODV' },
  { label: 'DSDV', value: 'DSDV' },
  { label: 'OSPF', value: 'OSPF' }
]

// 切换连线显示
const handleConnectionToggle = (value) => {
  console.log('通信连线显示状态:', value ? '开启' : '关闭')
  emit('toggle-connections', value)
}

// 切换传输协议
const handleProtocolChange = (value) => {
  setTransportProtocol(value)
}

// 切换通信制式
const handleCommChange = (value) => {
  setCommMode(value)
}

// 切换路由协议
const handleRoutingChange = (value) => {
  setRoutingProtocol(value)
}
</script>

<style scoped>
.connection-control-panel {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(13, 27, 42, 0.95) 100%);
  border: 2px solid rgba(0, 234, 255, 0.3);
  border-radius: 12px;
  padding: 6px;
  margin: 5px;
  text-align: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 20px rgba(0, 234, 255, 0.2),
    inset 0 0 15px rgba(0, 234, 255, 0.05);
  display: flex;
  flex-direction: column;
}

.connection-control-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #00eaff 0%, #0080ff 50%, #00eaff 100%);
  border-radius: 12px 12px 0 0;
  z-index: 1;
}

.panel-title {
  margin: 0 0 6px 0;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #00eaff;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.6);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.control-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 2px;
  padding: 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.switch-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.switch-container.compact {
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(0, 234, 255, 0.2);
  flex-shrink: 0;
}

.switch-label {
  font-size: 10px;
  color: #00eaff;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.6);
}

/* 协议选择器 */
.protocol-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  width: 100%;
  padding: 2px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(0, 234, 255, 0.2);
  flex-shrink: 0;
}

/* 通信制式选择器 */
.comm-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  width: 100%;
  padding: 2px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(0, 234, 255, 0.2);
  flex-shrink: 0;
}

/* 路由协议选择器 */
.routing-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  width: 100%;
  padding: 2px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(0, 234, 255, 0.2);
  flex-shrink: 0;
}

.protocol-label,
.comm-label,
.routing-label {
  font-size: 9px;
  color: #00eaff;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.6);
  margin-bottom: 0;
  line-height: 1.2;
}

/* Element Plus Switch 样式覆盖 */
:deep(.el-switch) {
  height: 18px;
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #00eaff !important;
  box-shadow: 0 0 8px rgba(0, 234, 255, 0.4) !important;
}

:deep(.el-switch__core) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  width: 36px !important;
  height: 16px !important;
}

:deep(.el-switch__core::after) {
  width: 12px !important;
  height: 12px !important;
}

/* Element Plus Segmented 样式覆盖 */
:deep(.el-segmented) {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  padding: 1px !important;
  height: 18px !important;
}

:deep(.el-segmented__item) {
  color: rgba(255, 255, 255, 0.7) !important;
  font-weight: 600 !important;
  font-size: 9px !important;
  transition: all 0.3s ease !important;
  padding: 0 4px !important;
  line-height: 16px !important;
  height: 16px !important;
}

:deep(.el-segmented__item:hover) {
  color: #00eaff !important;
}

:deep(.el-segmented__item.is-selected) {
  background-color: #00eaff !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.6) !important;
}
</style>