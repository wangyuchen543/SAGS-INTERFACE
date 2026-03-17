<template>
  <el-dialog
    v-model="dialogVisible"
    title="仿真设置"
    width="700px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    class="simulation-settings-dialog"
    @close="handleClose"
  >
    <div class="settings-content">
      <!-- 应用层协议模拟 -->
      <div class="settings-section">
        <h3 class="section-title">应用层协议模拟</h3>
        <div class="protocol-selector">
          <el-segmented 
            v-model="applicationProtocol" 
            :options="applicationProtocolOptions"
            size="default"
            @change="handleApplicationProtocolChange"
          />
        </div>
      </div>

      <!-- 流量生成策略 -->
      <div class="settings-section">
        <h3 class="section-title">流量生成策略</h3>
        <div class="strategy-selector">
          <el-segmented 
            v-model="trafficStrategy" 
            :options="trafficStrategyOptions"
            size="default"
            @change="handleTrafficStrategyChange"
          />
        </div>
      </div>

      <!-- 路由算法选择 -->


      <!-- IP协议栈选择 -->
      <div class="settings-section">
        <h3 class="section-title">IP协议栈选择</h3>
        <div class="ip-protocol-selector">
          <el-segmented 
            v-model="ipProtocol" 
            :options="ipProtocolOptions"
            size="default"
            @change="handleIPProtocolChange"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// 弹窗显示状态
const dialogVisible = ref(false)

// 应用层协议
const applicationProtocol = ref('HTTP')
const applicationProtocolOptions = [
  { label: 'HTTP', value: 'HTTP' },
  { label: '视频流', value: 'VideoStream' }
]

// 流量生成策略
const trafficStrategy = ref('恒定速率')
const trafficStrategyOptions = [
  { label: '恒定速率', value: '恒定速率' },
  { label: '突发流量', value: '突发流量' }
]

// 路由算法
const routingAlgorithm = ref('AODV')
const routingAlgorithmOptions = [
  { label: 'AODV', value: 'AODV' },
  { label: 'DSDV', value: 'DSDV' },
  { label: 'OSPF', value: 'OSPF' }
]

// IP协议栈
const ipProtocol = ref('IPv4')
const ipProtocolOptions = [
  { label: 'IPv4', value: 'IPv4' },
  { label: 'IPv6', value: 'IPv6' }
]

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

// 监听 dialogVisible 变化
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// 处理应用层协议变化
const handleApplicationProtocolChange = (value) => {
  console.log('应用层协议已更改:', value)
}

// 处理流量生成策略变化
const handleTrafficStrategyChange = (value) => {
  console.log('流量生成策略已更改:', value)
}

// 处理路由算法变化
const handleRoutingAlgorithmChange = (value) => {
  console.log('路由算法已更改:', value)
}

// 处理IP协议栈变化
const handleIPProtocolChange = (value) => {
  console.log('IP协议栈已更改:', value)
}

// 处理关闭
const handleClose = () => {
  emit('update:modelValue', false)
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

// 处理确定
const handleConfirm = () => {
  const settings = {
    applicationProtocol: applicationProtocol.value,
    trafficStrategy: trafficStrategy.value,
    routingAlgorithm: routingAlgorithm.value,
    ipProtocol: ipProtocol.value
  }
  emit('confirm', settings)
  dialogVisible.value = false
  console.log('✅ 仿真设置已确认:', settings)
}
</script>

<style scoped>
.simulation-settings-dialog :deep(.el-dialog) {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.98) 0%, rgba(13, 27, 42, 0.98) 100%);
  border: 2px solid rgba(0, 234, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 0 30px rgba(0, 234, 255, 0.3),
    inset 0 0 20px rgba(0, 234, 255, 0.05);
}

.simulation-settings-dialog :deep(.el-dialog__header) {
  background: linear-gradient(90deg, rgba(0, 234, 255, 0.1) 0%, rgba(0, 128, 255, 0.1) 100%);
  border-bottom: 2px solid rgba(0, 234, 255, 0.3);
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.simulation-settings-dialog :deep(.el-dialog__title) {
  color: #00eaff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.6);
  letter-spacing: 1px;
}

.simulation-settings-dialog :deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 24px;
}

.simulation-settings-dialog :deep(.el-dialog__close) {
  color: #00eaff;
  font-size: 20px;
}

.simulation-settings-dialog :deep(.el-dialog__close:hover) {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.8);
}

.simulation-settings-dialog :deep(.el-dialog__body) {
  padding: 24px;
  background: transparent;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 234, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.settings-section:hover {
  border-color: rgba(0, 234, 255, 0.4);
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.1);
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #00eaff;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.6);
  letter-spacing: 0.5px;
}

.protocol-selector,
.strategy-selector,
.routing-selector,
.ip-protocol-selector {
  width: 100%;
}

/* Element Plus Segmented 样式覆盖 */
:deep(.el-segmented) {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  padding: 2px !important;
  width: 100%;
}

:deep(.el-segmented__item) {
  color: rgba(255, 255, 255, 0.7) !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  transition: all 0.3s ease !important;
  padding: 8px 16px !important;
}

:deep(.el-segmented__item:hover) {
  color: #00eaff !important;
}

:deep(.el-segmented__item.is-selected) {
  background-color: #00eaff !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.6) !important;
}

/* Element Plus Button 样式覆盖 */
.dialog-footer :deep(.el-button) {
  min-width: 100px;
  height: 36px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.dialog-footer :deep(.el-button--default) {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  color: #00eaff !important;
}

.dialog-footer :deep(.el-button--default:hover) {
  background: rgba(0, 234, 255, 0.1) !important;
  border-color: #00eaff !important;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.3) !important;
}

.dialog-footer :deep(.el-button--primary) {
  background: linear-gradient(135deg, #00a3cc 0%, #0080ff 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.4) !important;
}

.dialog-footer :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #00eaff 0%, #0099ff 100%) !important;
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.6) !important;
  transform: translateY(-2px);
}
</style>
