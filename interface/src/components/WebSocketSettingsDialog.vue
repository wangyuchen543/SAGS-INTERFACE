<template>
  <el-dialog
    v-model="dialogVisible"
    title="WebSocket 连接配置"
    width="500px"
    :close-on-click-modal="false"
    class="websocket-dialog"
  >
    <el-form :model="form" label-width="120px" class="websocket-form">
      <el-form-item label="服务器地址">
        <el-input 
          v-model="form.host" 
          placeholder="例如: localhost 或 127.0.0.1"
          class="custom-input"
        />
      </el-form-item>
      
      <el-form-item label="端口">
        <el-input-number 
          v-model="form.port" 
          :min="1" 
          :max="65535" 
          placeholder="例如: 50000"
          class="custom-input-number"
        />
      </el-form-item>
      
      <el-form-item label="连接状态">
        <el-tag 
          :type="wsState.connected ? 'success' : 'info'"
          class="status-tag"
          effect="dark"
        >
          <i :class="wsState.connected ? 'el-icon-check' : 'el-icon-close'"></i>
          {{ wsState.connected ? '✅ 已连接' : '⭕ 未连接' }}
        </el-tag>
      </el-form-item>
      
      <el-form-item v-if="wsState.error" label="错误信息">
        <el-alert 
          :title="wsState.error" 
          type="error" 
          :closable="false"
          class="error-alert"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" class="cancel-btn">取消</el-button>
        <el-button 
          v-if="!wsState.connected" 
          type="primary" 
          @click="handleConnect"
          :loading="wsState.connecting"
          class="connect-btn"
        >
          {{ wsState.connecting ? '连接中...' : '🔌 连接' }}
        </el-button>
        <el-button 
          v-else 
          type="danger" 
          @click="handleDisconnect"
          class="disconnect-btn"
        >
          🔌 断开连接
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { connectWebSocket, disconnectWebSocket, getWSConfig, getWSState, wsState as wsStateReactive } from '../services/websocket.service.js'

// 对话框可见性
const dialogVisible = defineModel({ type: Boolean, default: false })

// 表单数据
const form = reactive({
  host: 'localhost',
  port: 50000
})

// WebSocket状态
const wsState = reactive(wsStateReactive)

// 初始化表单数据
const config = getWSConfig()
form.host = config.host
form.port = config.port

// 连接WebSocket
const handleConnect = async () => {
  try {
    await connectWebSocket(form.host, form.port)
    ElMessage.success('WebSocket 连接成功')
  } catch (error) {
    ElMessage.error(`WebSocket 连接失败: ${error.message}`)
  }
}

// 断开连接
const handleDisconnect = () => {
  disconnectWebSocket()
  ElMessage.info('WebSocket 已断开')
}
</script>

<style scoped>
/* 弹窗整体美化 */
:deep(.websocket-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog) {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.98) 0%, rgba(13, 27, 42, 0.98) 100%);
  border: 2px solid rgba(0, 234, 255, 0.3);
  border-radius: 16px;
  box-shadow: 
    0 0 30px rgba(0, 234, 255, 0.3),
    0 20px 60px rgba(0, 0, 0, 0.6);
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.2) 0%, rgba(0, 234, 255, 0.2) 100%);
  border-bottom: 2px solid rgba(0, 234, 255, 0.4);
  padding: 20px;
  margin: 0;
}

:deep(.el-dialog__title) {
  color: #00eaff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.6);
  letter-spacing: 1px;
}

:deep(.el-dialog__body) {
  padding: 30px;
  background: rgba(10, 22, 40, 0.5);
}

:deep(.el-dialog__footer) {
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 234, 255, 0.1) 100%);
  border-top: 2px solid rgba(0, 234, 255, 0.2);
  padding: 20px;
}

/* 表单样式 */
.websocket-form {
  margin: 0;
}

:deep(.el-form-item__label) {
  color: #8ab4f8;
  font-weight: 500;
  font-size: 14px;
}

/* 输入框美化 */
:deep(.el-input__wrapper) {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 8px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 234, 255, 0.5);
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(0, 234, 255, 0.2);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #00eaff;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(0, 234, 255, 0.4);
}

:deep(.el-input__inner) {
  color: #e0e0e0;
  font-size: 14px;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(138, 180, 248, 0.5);
}

/* 数字输入框美化 */
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 234, 255, 0.3);
}

/* 状态标签美化 */
.status-tag {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:deep(.el-tag.el-tag--success) {
  background: linear-gradient(135deg, #00cc88 0%, #00ff88 100%);
  border-color: #00ff88;
  color: white;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}

:deep(.el-tag.el-tag--info) {
  background: linear-gradient(135deg, #4a5568 0%, #718096 100%);
  border-color: #718096;
  color: white;
}

/* 错误提示美化 */
.error-alert {
  border-radius: 8px;
  border: 1px solid rgba(255, 51, 102, 0.4);
  background: rgba(255, 51, 102, 0.1);
}

:deep(.el-alert__title) {
  color: #ff5c85;
  font-size: 13px;
}

/* 按钮美化 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn,
.connect-btn,
.disconnect-btn {
  min-width: 100px;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

:deep(.cancel-btn) {
  background: rgba(74, 85, 104, 0.6);
  border: 1px solid rgba(138, 180, 248, 0.3);
  color: #e0e0e0;
}

:deep(.cancel-btn:hover) {
  background: rgba(74, 85, 104, 0.8);
  border-color: rgba(138, 180, 248, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.connect-btn.el-button--primary) {
  background: linear-gradient(135deg, #0066ff 0%, #00ccff 100%);
  border: none;
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.4);
}

:deep(.connect-btn.el-button--primary:hover) {
  background: linear-gradient(135deg, #0052cc 0%, #00a3cc 100%);
  box-shadow: 0 0 30px rgba(0, 234, 255, 0.6);
  transform: translateY(-2px);
}

:deep(.disconnect-btn.el-button--danger) {
  background: linear-gradient(135deg, #ff3366 0%, #ff5c85 100%);
  border: none;
  box-shadow: 0 0 20px rgba(255, 51, 102, 0.4);
}

:deep(.disconnect-btn.el-button--danger:hover) {
  background: linear-gradient(135deg, #cc2952 0%, #ff3366 100%);
  box-shadow: 0 0 30px rgba(255, 51, 102, 0.6);
  transform: translateY(-2px);
}

/* 加载状态美化 */
:deep(.el-button.is-loading) {
  position: relative;
  overflow: hidden;
}

:deep(.el-button.is-loading::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>

