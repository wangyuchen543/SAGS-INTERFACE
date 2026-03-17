<template>
  <div class="node-adjacency-panel">
    <h4 class="panel-title">节点邻接</h4>
    <div class="adjacency-content">
      <div class="mini-network">
        <!-- 仿真未运行时的提示 -->
        <div v-if="!props.simulationState?.running" class="empty-state">
          <div class="empty-icon">⏸️</div>
          <div class="empty-text">请点击"开始"按钮启动仿真</div>
          <div class="empty-hint">启动后点击节点查看邻接关系</div>
        </div>
        
        <!-- 仿真运行但未选中节点 -->
        <div v-else-if="!selectedNodeFromMap" class="empty-state">
          <div class="empty-icon">👆</div>
          <div class="empty-text">请在地图上点击节点</div>
          <div class="empty-hint">查看该节点的邻接关系</div>
        </div>
        
        <!-- 仿真运行且已选中节点 -->
        <template v-else>
          <!-- 中心节点 -->
          <div 
            class="mini-node center-node"
            :style="getMiniCenterPosition()"
            :title="`中心: ${toChineseName(selectedNodeFromMap.name)}`"
          >
            {{ toChineseName(selectedNodeFromMap.name) }}
          </div>
          
          <!-- 邻居节点 -->
          <div 
            v-for="(node, index) in smallAdjacentNodes" 
            :key="node.name"
            class="mini-node"
            :style="getMiniNodePosition(index)"
            :title="`${toChineseName(node.name)}\n通信方式: ${node.comms.join(', ')}`"
          >
            {{ toChineseName(node.name) }}
          </div>
          
          <!-- 邻接连接线 -->
          <svg class="mini-connections" width="100%" height="100%">
            <line 
              v-for="(connection, idx) in smallAdjacencyLines" 
              :key="idx"
              :x1="connection.x1" 
              :y1="connection.y1" 
              :x2="connection.x2" 
              :y2="connection.y2" 
              :stroke="connection.color" 
              stroke-width="1.5"
              stroke-dasharray="3,3"
            />
          </svg>
        </template>
      </div>
      <div class="adjacency-stats">
        <span class="stat-text">邻接数: {{ smallAdjacentNodes.length }}</span>
      </div>
      <button class="zoom-btn" @click="openZoomWithCenter(null)" title="放大查看邻接关系">
        🔍
      </button>
    </div>
    
    <!-- 放大查看对话框 -->
    <el-dialog 
      v-model="showZoomDialog" 
      title="节点邻接 - 放大视图"
      width="80%"
      center
      append-to-body
      destroy-on-close
      class="zoom-dialog"
    >
      <div class="zoom-content">
        <div class="zoom-adjacency-graph">
          <div class="node-selector">
            <label>选择中心节点：</label>
            <select v-model="selectedCenterNode" class="center-node-select">
              <option v-for="node in props.nodes" :key="node.name" :value="node">
                {{ toChineseName(node.name) }}
              </option>
            </select>
          </div>
          
          <!-- 仿真未运行时的提示 -->
          <div v-if="!props.simulationState?.running" class="no-center-node">
            <div class="empty-icon" style="font-size: 48px; margin-bottom: 10px;">⏸️</div>
            <p style="font-size: 16px; margin: 5px 0;">仿真未运行</p>
            <p style="font-size: 14px; color: #999;">请点击"开始"按钮启动仿真后查看邻接关系</p>
          </div>
          
          <!-- 仿真运行中 -->
          <div v-else-if="selectedCenterNode" class="adjacency-graph-area">
            <!-- 中心节点 -->
            <div 
              class="zoom-center-node"
              :style="getAdjacencyZoomPosition(0, 0, true)"
              :title="`中心节点: ${toChineseName(selectedCenterNode.name)}`"
            >
              <span class="center-node-id">{{ toChineseName(selectedCenterNode.name) }}</span>
              <span class="center-node-name">{{ toChineseName(selectedCenterNode.name) }}</span>
              <div class="center-node-comms">
                <span v-for="comm in selectedCenterNode.comms" :key="comm" class="comm-badge" :style="{ background: getCommColor(comm) }">
                  {{ comm }}
                </span>
              </div>
            </div>
            
            <!-- 邻接节点 -->
            <div 
              v-for="(node, index) in adjacentNodes" 
              :key="node.name"
              class="zoom-adjacent-node"
              :style="getAdjacencyZoomPosition(index, adjacentNodes.length, false)"
              :title="`${toChineseName(node.name)}\n通信方式: ${node.comms.join(', ')}`"
            >
              <span class="adjacent-node-id">{{ toChineseName(node.name) }}</span>
              <span class="adjacent-node-name">{{ toChineseName(node.name) }}</span>
            </div>
            
            <!-- 邻接连接线 -->
            <svg class="zoom-adjacency-connections" width="100%" height="100%">
              <line 
                v-for="(connection, idx) in adjacencyZoomLines" 
                :key="idx"
                :x1="connection.x1" 
                :y1="connection.y1" 
                :x2="connection.x2" 
                :y2="connection.y2" 
                :stroke="connection.color" 
                stroke-width="3"
                stroke-dasharray="6,6"
              />
        </svg>
      </div>
          <div v-else class="no-center-node">
            <p>请选择一个中心节点查看邻接关系</p>
          </div>
        </div>
        <div class="zoom-info">
          <h5>邻接信息</h5>
          <div v-if="selectedCenterNode" class="info-section">
            <p><strong>中心节点:</strong> {{ selectedCenterNode.name }}</p>
            <p><strong>邻居数量:</strong> {{ adjacentNodes.length }}</p>
            <p><strong>连接数:</strong> {{ adjacencyZoomLines.length }}</p>
          </div>
          <div v-else class="info-section">
            <p style="color: #999;">未选择中心节点</p>
          </div>
          <h5 style="margin-top: 20px;">通信方式</h5>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-dot" style="background: #888888;"></span>
              <span>有线通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #00FFFF;"></span>
              <span>4G通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #0066FF;"></span>
              <span>5G通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #FFAA00;"></span>
              <span>卫星通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #00AA00;"></span>
              <span>Mesh自组网</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #C8A2FF;"></span>
              <span>水声通信</span>
            </div>
      </div>
    </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { commTypes } from '../../config/nodes.config.js'
import { getRunningTime } from '../../services/simulation.service.js'
import { toChineseName } from '../../utils/node.name.mapper.js'

const showZoomDialog = ref(false)
const selectedCenterNode = ref(null) // 选中的中心节点

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  links: {
    type: Array,
    default: () => []
  },
  selectedNodeId: {
    type: String,
    default: ''
  },
  simulationState: {
    type: Object,
    default: () => ({ running: false, paused: false })
  }
})

// 响应外部选中节点变化（现在使用name作为标识）
const selectedNodeFromMap = computed(() => {
  if (!props.selectedNodeId) {
    // ⚠️ 如果没有外部选中节点，返回null（不显示任何内容）
    return null
  }
  return props.nodes.find(node => node.name === props.selectedNodeId) || null
})

// 打开放大视图时选择第一个节点作为中心
const openZoomWithCenter = (node) => {
  selectedCenterNode.value = node || (props.nodes.length > 0 ? props.nodes[0] : null)
  showZoomDialog.value = true
}

// 限制显示的节点数量
const displayNodes = computed(() => {
  return props.nodes.slice(0, 6)
})

// 获取节点位置
const getNodePosition = (index) => {
  const positions = [
    { left: '20%', top: '25%' },
    { left: '50%', top: '15%' },
    { left: '80%', top: '30%' },
    { left: '75%', top: '70%' },
    { left: '40%', top: '75%' },
    { left: '15%', top: '60%' }
  ]
  return positions[index] || { left: '50%', top: '50%' }
}

// 获取通信方式颜色
const getCommColor = (comm) => {
  return commTypes[comm]?.color || '#888888'
}

// 📡 检查两个节点是否连接（根据后端数据）
const isNodesConnected = (node1, node2) => {
  // 直接检查 props.links 中是否存在连接（不做时间判断）
  for (const link of props.links) {
    // 检查是否匹配当前节点对（使用node1和node2）
    if ((link.node1 === node1.name && link.node2 === node2.name) ||
        (link.node1 === node2.name && link.node2 === node1.name)) {
      return { commType: link.commType, color: commTypes[link.commType]?.color || '#888888' }
    }
  }
  
  return null
}

// 计算邻接节点（小视图）- 以外部选中节点为中心（根据后端连接数据）
const smallAdjacentNodes = computed(() => {
  // ⚠️ 只有仿真运行时才显示邻接节点
  if (!props.simulationState?.running) {
    return []
  }
  
  const centerNode = selectedNodeFromMap.value
  if (!centerNode) return []
  
  const neighbors = []
  
  props.nodes.forEach(node => {
    if (node.name === centerNode.name) return
    
    // 检查是否有实际连接（使用后端数据）
    const connectionInfo = isNodesConnected(centerNode, node)
    if (connectionInfo) {
      neighbors.push({
        ...node,
        commonComm: connectionInfo.commType // 保存通信方式
      })
    }
  })
  
  return neighbors.slice(0, 5) // 小视图最多显示5个邻接节点
})

// 小视图中心节点位置
const getMiniCenterPosition = () => {
  return { left: '50%', top: '50%' }
}

// 小视图邻居节点位置（围绕中心节点）
const getMiniNodePosition = (index) => {
  const centerX = 50, centerY = 50, radius = 30
  const total = smallAdjacentNodes.value.length
  if (total === 0) return { left: '50%', top: '50%' }
  
  const angle = (index * 2 * Math.PI) / total
  
  const x = centerX + radius * Math.cos(angle)
  const y = centerY + radius * Math.sin(angle)
  
  return { left: `${x}%`, top: `${y}%` }
}

// 小视图邻接连接线
const smallAdjacencyLines = computed(() => {
  // ⚠️ 只有仿真运行时才显示连线
  if (!props.simulationState?.running) {
    return []
  }
  
  const centerPos = { x: 50, y: 50 }
  const lines = []
  
  smallAdjacentNodes.value.forEach((node, index) => {
    const angle = (index * 2 * Math.PI) / smallAdjacentNodes.value.length
    const radius = 30
    const nodePos = {
      x: centerPos.x + radius * Math.cos(angle),
      y: centerPos.y + radius * Math.sin(angle)
    }
    
    const color = getCommColor(node.commonComm)
    
    lines.push({
      x1: centerPos.x + '%',
      y1: centerPos.y + '%',
      x2: nodePos.x + '%',
      y2: nodePos.y + '%',
      color: color
    })
  })
  
  return lines
})

// 计算邻接节点（放大视图）- 以选中节点为中心（根据后端连接数据）
const adjacentNodes = computed(() => {
  // ⚠️ 只有仿真运行时才显示邻接节点
  if (!props.simulationState?.running) {
    return []
  }
  
  if (!selectedCenterNode.value) return []
  
  const neighbors = []
  const centerNode = selectedCenterNode.value
  
  // 找出所有与中心节点有实际连接的节点（使用后端数据）
  props.nodes.forEach(node => {
    if (node.name === centerNode.name) return // 跳过中心节点自己
    
    const connectionInfo = isNodesConnected(centerNode, node)
    if (connectionInfo) {
      neighbors.push(node)
    }
  })
  
  return neighbors
})

// 计算邻接节点的位置（放大视图） - 中心节点在中间，邻居节点围绕
const getAdjacencyZoomPosition = (index, total, isCenter = false) => {
  if (isCenter) {
    return { left: '50%', top: '50%' }
  }
  
  const centerX = 50
  const centerY = 50
  const radius = 30
  const angle = (index * 2 * Math.PI) / total
  
  const x = centerX + radius * Math.cos(angle)
  const y = centerY + radius * Math.sin(angle)
  
  return { left: `${x}%`, top: `${y}%` }
}

// 计算邻接连线（放大视图）
const adjacencyZoomLines = computed(() => {
  // ⚠️ 只有仿真运行时才显示连线
  if (!props.simulationState?.running) {
    return []
  }
  
  if (!selectedCenterNode.value) return []
  
  const lines = []
  const centerPos = { x: 50, y: 50 }
  
  // 从中心节点到每个邻居节点画线（使用后端连接数据）
  adjacentNodes.value.forEach((node, index) => {
    const total = adjacentNodes.value.length
    const radius = 30
    const angle = (index * 2 * Math.PI) / total
    const nodePos = {
      x: centerPos.x + radius * Math.cos(angle),
      y: centerPos.y + radius * Math.sin(angle)
    }
    
    // 获取连接信息
    const connectionInfo = isNodesConnected(selectedCenterNode.value, node)
    if (connectionInfo) {
      lines.push({
        x1: centerPos.x + '%',
        y1: centerPos.y + '%',
        x2: nodePos.x + '%',
        y2: nodePos.y + '%',
        color: connectionInfo.color,
        commType: connectionInfo.commType
      })
    }
  })
  
  return lines
})

// 计算邻接关系（小预览视图）- 以第一个节点为中心
const adjacencyLines = computed(() => {
  const lines = []
  
  if (displayNodes.value.length === 0) return lines
  
  // 使用第一个节点作为中心节点
  const centerNode = displayNodes.value[0]
  const centerPos = { x: 50, y: 50 } // 中心位置
  
  // 计算其他节点的位置（环绕中心）
  const radius = 35
  
  for (let i = 1; i < displayNodes.value.length; i++) {
    const node = displayNodes.value[i]
    const angle = ((i - 1) * 2 * Math.PI) / (displayNodes.value.length - 1)
    const nodePos = {
      x: centerPos.x + radius * Math.cos(angle),
      y: centerPos.y + radius * Math.sin(angle)
    }
    
    // 查找中心节点与该节点的共同通信方式
    const commonComms = centerNode.comms.filter(comm => node.comms.includes(comm))
    
    if (commonComms.length > 0) {
      const commType = commonComms[0]
      const color = commTypes[commType]?.color || '#888888'
      
      lines.push({
        x1: centerPos.x + '%',
        y1: centerPos.y + '%',
        x2: nodePos.x + '%',
        y2: nodePos.y + '%',
        color: color
      })
    }
  }
  
  return lines
})

watch(() => props.nodes, (newNodes) => {
  console.log('节点邻接更新，节点数:', newNodes.length)
}, { deep: true })
</script>

<style scoped>
.node-adjacency-panel {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(13, 27, 42, 0.95) 100%);
  border: 2px solid rgba(255, 165, 0, 0.3);
  border-radius: 12px;
  padding: 12px;
  margin: 5px;
  position: relative;
  overflow: hidden;
  height: 100%;
  box-shadow: 
    0 0 20px rgba(255, 165, 0, 0.2),
    inset 0 0 15px rgba(255, 165, 0, 0.05);
}

.node-adjacency-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffa500 0%, #ff8c00 50%, #ffa500 100%);
  border-radius: 12px 12px 0 0;
  z-index: 1;
}

.panel-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #ffa500;
  text-shadow: 0 0 10px rgba(255, 165, 0, 0.6);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
}

.adjacency-content {
  position: relative;
  height: calc(100% - 40px);
}

.mini-network {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 20, 40, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(255, 165, 0, 0.2);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
}

.empty-icon {
  font-size: 32px;
  opacity: 0.6;
}

.empty-text {
  font-size: 13px;
  color: #ffa500;
  font-weight: 600;
  text-align: center;
}

.empty-hint {
  font-size: 11px;
  color: rgba(255, 165, 0, 0.7);
  text-align: center;
}

.mini-node {
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
  border-radius: 50%;
  border: 2px solid rgba(255, 165, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.4);
  transform: translate(-50%, -50%); /* 让节点中心对齐到坐标点 */
}

.mini-node:hover {
  transform: translate(-50%, -50%) scale(1.2); /* 保持居中的同时放大 */
  z-index: 10;
  box-shadow: 0 0 15px rgba(255, 165, 0, 0.8);
  background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
}

.mini-node.center-node {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
  border: 2px solid rgba(255, 0, 0, 0.8);
  box-shadow: 0 0 12px rgba(255, 0, 0, 0.6);
  font-size: 8px;
  font-weight: bold;
  transform: translate(-50%, -50%); /* 中心节点也需要居中 */
}

.mini-node.center-node:hover {
  background: linear-gradient(135deg, #ff3333 0%, #cc0000 100%);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.9);
  transform: translate(-50%, -50%) scale(1.2); /* 中心节点悬停时保持居中 */
}

.mini-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.adjacency-stats {
  position: absolute;
  bottom: 3px;
  right: 5px;
  font-size: 10px;
  color: #ffa500;
  background: rgba(0, 20, 40, 0.8);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 165, 0, 0.3);
  box-shadow: 0 0 5px rgba(255, 165, 0, 0.2);
}

.stat-text {
  font-weight: 600;
}

.zoom-btn {
  position: absolute;
  bottom: 3px;
  left: 5px;
  width: 26px;
  height: 26px;
  border: none;
  background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.zoom-btn:hover {
  background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 165, 0, 0.8);
}

/* 放大视图弹窗样式 */
.zoom-dialog :deep(.el-dialog) {
  background: #ffffff;
  border-radius: 12px;
}

.zoom-dialog :deep(.el-dialog__header) {
  background: linear-gradient(90deg, #007BFF 0%, #0056b3 100%);
  padding: 20px;
  border-radius: 10px 10px 0 0;
  margin: 0;
}

.zoom-dialog :deep(.el-dialog__title) {
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
}

.zoom-dialog :deep(.el-dialog__headerbtn .el-icon) {
  color: #ffffff;
  font-size: 24px;
}

.zoom-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: #f8f8f8;
}

.zoom-content {
  display: flex;
  height: 600px;
}

.zoom-adjacency-graph {
  flex: 1;
  position: relative;
  background-color: #ffffff;
  border-right: 2px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.node-selector {
  padding: 15px 20px;
  background: #f5f7fa;
  border-bottom: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.node-selector label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.center-node-select {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
}

.center-node-select:focus {
  outline: none;
  border-color: #007BFF;
}

.adjacency-graph-area {
  flex: 1;
  position: relative;
}

.no-center-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

/* 中心节点样式 */
.zoom-center-node {
  position: absolute;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 4px 16px rgba(238, 90, 82, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  transform: translate(-50%, -50%);
}

.center-node-id {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: white;
  font-weight: bold;
}

.center-node-name {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #333;
  background: rgba(255, 107, 107, 0.95);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.center-node-comms {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 180px;
}

/* 邻接节点样式 */
.zoom-adjacent-node {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #4472C4;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
  transform: translate(-50%, -50%);
}

.zoom-adjacent-node:hover {
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 15;
  box-shadow: 0 4px 16px rgba(68, 114, 196, 0.6);
}

.adjacent-node-id {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.adjacent-node-name {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #666;
  background: rgba(255, 255, 255, 0.95);
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.zoom-mini-node {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: #4472C4;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
  transform: translate(-50%, -50%); /* 让节点中心对齐到坐标点 */
}

.zoom-mini-node:hover {
  transform: translate(-50%, -50%) scale(1.2); /* 保持居中的同时放大 */
  z-index: 15;
  box-shadow: 0 4px 16px rgba(68, 114, 196, 0.6);
}

.zoom-node-id {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: white;
  font-weight: bold;
}

.zoom-node-info {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: #333;
  background: rgba(255, 255, 255, 0.95);
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.zoom-node-comms {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 150px;
}

.comm-badge {
  font-size: 9px;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.zoom-adjacency-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.zoom-info {
  width: 220px;
  padding: 20px;
  background: #ffffff;
  overflow-y: auto;
}

.zoom-info h5 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #007BFF;
  padding-bottom: 8px;
}

.info-section {
  margin-bottom: 15px;
}

.info-section p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.info-section strong {
  color: #333;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style> 