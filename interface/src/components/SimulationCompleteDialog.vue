<template>
  <div v-if="visible" class="tech-dialog-overlay" @click.self="handleClose">
    <div class="tech-dialog-container">
      <!-- 弹窗头部 -->
      <div class="tech-dialog-header">
        <h3>🎯 仿真完成</h3>
        <button class="tech-close-btn" @click="handleClose" title="关闭">×</button>
      </div>
      
      <!-- 弹窗内容 -->
      <div class="tech-dialog-content">
        <div class="simulation-summary">
          <!-- 成功图标动画 -->
          <div class="success-icon">
            <div class="icon-circle">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="35" 
                  stroke="#00eaff" 
                  stroke-width="3" 
                  fill="none"
                  stroke-dasharray="220"
                  stroke-dashoffset="220"
                  class="circle-animation"
                />
                <path 
                  d="M 25 40 L 35 50 L 55 30" 
                  stroke="#00eaff" 
                  stroke-width="4" 
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-dasharray="50"
                  stroke-dashoffset="50"
                  class="check-animation"
                />
              </svg>
            </div>
          </div>
          
           <!-- 统计信息 -->
           <div class="summary-stats">
             <div class="stat-row">
               <span class="stat-label">总仿真时间</span>
               <span class="stat-value">{{ simulationTime }}秒</span>
             </div>
           </div>
          
          <!-- 提示信息 -->
          <div class="completion-message">
            <p>✅ 所有仿真数据已处理完成</p>
           
          </div>
        </div>
      </div>
      
      <!-- 弹窗底部 -->
      <div class="tech-dialog-footer">
        <button class="tech-primary-btn" @click="handleClose">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  simulationTime: {
    type: Number,
    default: 0
  },
  dataPoints: {
    type: Number,
    default: 0
  },
  connections: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:visible', 'close'])

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
@import '../style/dialog.css';

/* 仿真完成弹窗特殊样式 */
.simulation-summary {
  padding: 30px;
  text-align: center;
}

.success-icon {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-circle {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-animation {
  animation: drawCircle 1s ease-out forwards;
}

.check-animation {
  animation: drawCheck 0.6s ease-out 0.8s forwards;
}

@keyframes drawCircle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

.summary-stats {
  margin: 30px 0;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 234, 255, 0.1);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: #8ab4f8;
  font-size: 14px;
  font-weight: 500;
}

.stat-value {
  color: #00eaff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.6);
}

.completion-message {
  margin-top: 25px;
  padding: 20px;
  background: rgba(0, 234, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.completion-message p {
  margin: 8px 0;
  color: #00eaff;
  font-size: 14px;
  line-height: 1.8;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.4);
}

.completion-message p:first-child {
  font-size: 16px;
  font-weight: 600;
  color: #00eaff;
  margin-bottom: 12px;
}

.tech-dialog-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 234, 255, 0.2);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.tech-primary-btn {
  background: linear-gradient(135deg, #00eaff 0%, #0066ff 100%);
  border: 2px solid rgba(0, 234, 255, 0.5);
  color: #ffffff;
  padding: 10px 30px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.3);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.tech-primary-btn:hover {
  background: linear-gradient(135deg, #00d4ff 0%, #0055ff 100%);
  box-shadow: 0 0 25px rgba(0, 234, 255, 0.5);
  transform: translateY(-2px);
}

.tech-primary-btn:active {
  transform: translateY(0);
}
</style>

