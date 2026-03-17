<template>
  <div class="network-topology-panel">
    <h4 class="panel-title">网络拓扑</h4>
    <div class="topology-content">
      <div class="network-graph">
        <!-- 网络节点 -->
        <div 
          v-for="(node, index) in displayNodes" 
          :key="node.name"
          class="node"
          :style="getNodePosition(index)"
          :title="`${toChineseName(node.name)}`"
        >
          <span class="node-label">{{ toChineseName(node.name) }}</span>
        </div>
        
        <!-- 连接线 -->
        <svg class="connections" width="100%" height="100%">
          <line 
            v-for="(connection, idx) in connections" 
            :key="idx"
            :x1="connection.x1" 
            :y1="connection.y1" 
            :x2="connection.x2" 
            :y2="connection.y2" 
            :stroke="connection.color" 
            stroke-width="2"
            :stroke-dasharray="connection.dash"
          />
        </svg>
      </div>
      <div class="stats-info">
        <span class="stat-item">节点: {{ displayNodes.length }}</span>
        <span class="stat-item">连接: {{ connections.length }}</span>
      </div>
      <button class="zoom-btn" @click="showZoomDialog = true" title="放大查看">
        🔍
      </button>
    </div>
    
    <!-- 放大查看对话框 -->
    <el-dialog 
      v-model="showZoomDialog" 
      title="网络拓扑 - 放大视图"
      width="85%"
      center
      append-to-body
      destroy-on-close
      class="zoom-dialog"
    >
      <div class="zoom-content">
        <div class="zoom-network-graph">
          <!-- 放大的网络节点 -->
          <div 
            v-for="node in allNodes" 
            :key="node.name"
            class="zoom-node"
            :class="'role-' + getNodeRole(node)"
            :style="getZoomNodePosition(node)"
            :title="`${toChineseName(node.name)}\n类型: ${node.type}\n通信: ${node.comms.join(', ')}`"
          >
            <span class="zoom-node-label">{{ toChineseName(node.name) }}</span>
            <span class="zoom-node-name">{{ toChineseName(node.name) }}</span>
          </div>
          
          <!-- 放大的连接线 -->
          <svg class="zoom-connections" width="100%" height="100%">
            <line 
              v-for="(connection, idx) in allConnections" 
              :key="idx"
              :x1="connection.x1" 
              :y1="connection.y1" 
              :x2="connection.x2" 
              :y2="connection.y2" 
              :stroke="connection.color" 
              stroke-width="2.5"
              :stroke-dasharray="connection.dash"
              opacity="0.7"
            />
        </svg>
      </div>
        <div class="zoom-legend">
          <h5>网络拓扑</h5>
          <div class="info-section">
            <p><strong>总节点数:</strong> {{ allNodes.length }}</p>
            <p><strong>连接数:</strong> {{ allConnections.length }}</p>
          </div>
          <h5 style="margin-top: 20px;">节点角色</h5>
          <div class="legend-items">
            <div class="legend-item">
              <span class="role-dot satellite"></span>
              <span>卫星/卫星地面站</span>
            </div>
            <div class="legend-item">
              <span class="role-dot airborne"></span>
              <span>高空平台(HIPS)</span>
            </div>
            <div class="legend-item">
              <span class="role-dot ground"></span>
              <span>基站/控制中心</span>
            </div>
            <div class="legend-item">
              <span class="role-dot terminal"></span>
              <span>终端节点</span>
            </div>
          </div>
          <h5 style="margin-top: 20px;">通信类型</h5>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-line" style="background: #888888;"></span>
              <span>有线通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-line dashed" style="background: #00FFFF;"></span>
              <span>4G通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-line dashed" style="background: #0066FF;"></span>
              <span>5G通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-line dashed" style="background: #FFAA00;"></span>
              <span>卫星通信</span>
            </div>
            <div class="legend-item">
              <span class="legend-line dashed" style="background: #00AA00;"></span>
              <span>Mesh自组网</span>
            </div>
            <div class="legend-item">
              <span class="legend-line dashed" style="background: #C8A2FF;"></span>
              <span>水声通信</span>
            </div>
      </div>
    </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { commTypes } from '../../config/nodes.config.js'
import { getRunningTime } from '../../services/simulation.service.js'
import { toChineseName } from '../../utils/node.name.mapper.js'

const showZoomDialog = ref(false)

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  links: {
    type: Array,
    default: () => []
  },
  simulationState: {
    type: Object,
    default: () => ({ running: false, paused: false })
  }
})

// 小视图显示前8个节点
const displayNodes = computed(() => props.nodes.slice(0, 8))

// 放大视图显示所有节点
const allNodes = computed(() => props.nodes)

// 定义节点角色
const getNodeRole = (node) => {
  if (node.type === 'SGS') return 'satellite_hub'
  if (['HIPS', 'BYO'].includes(node.type)) return 'airborne_hub'
  if (['MBS', 'SMG', 'OCC'].includes(node.type)) return 'ground_hub'
  if (node.type === 'SPB') return 'surface_hub'
  return 'terminal'
}

// 获取节点位置（小视图）
const getNodePosition = (index) => {
  const positions = [
    { left: '15%', top: '25%' },
    { left: '45%', top: '15%' },
    { left: '75%', top: '20%' },
    { left: '85%', top: '50%' },
    { left: '70%', top: '75%' },
    { left: '40%', top: '80%' },
    { left: '15%', top: '70%' },
    { left: '25%', top: '45%' }
  ]
  return positions[index] || { left: '50%', top: '50%' }
}

// 获取放大视图节点位置（分层布局）
const getZoomNodePosition = (node) => {
  const role = getNodeRole(node)
  const nodeIndex = allNodes.value.findIndex(n => n.name === node.name)
  
  // 按角色分组节点
  const roleNodes = {
    satellite_hub: [],
    airborne_hub: [],
    ground_hub: [],
    surface_hub: [],
    terminal: []
  }
  
  allNodes.value.forEach(n => {
    roleNodes[getNodeRole(n)].push(n)
  })
  
  // 卫星层（顶部中心）
  if (role === 'satellite_hub') {
    return { left: '50%', top: '5%' }
  }
  
  // 高空平台层（第二层，水平分布）
  if (role === 'airborne_hub') {
    const index = roleNodes.airborne_hub.findIndex(n => n.name === node.name)
    const total = roleNodes.airborne_hub.length
    const spacing = 60 / (total + 1)
    return { 
      left: `${20 + spacing * (index + 1)}%`, 
      top: '22%' 
    }
  }
  
  // 地面基站层（第三层）
  if (role === 'ground_hub') {
    const index = roleNodes.ground_hub.findIndex(n => n.name === node.name)
    const total = roleNodes.ground_hub.length
    const spacing = 40 / (total + 1)
    return { 
      left: `${10 + spacing * (index + 1)}%`, 
      top: '45%' 
    }
  }
  
  // 海面平台层
  if (role === 'surface_hub') {
    const index = roleNodes.surface_hub.findIndex(n => n.name === node.name)
    const total = roleNodes.surface_hub.length
    const spacing = 40 / (total + 1)
    return { 
      left: `${50 + spacing * (index + 1)}%`, 
      top: '45%' 
    }
  }
  
  // 终端节点层（底层，按类型分布）
  const terminalIndex = roleNodes.terminal.findIndex(n => n.id === node.id)
  const terminalTotal = roleNodes.terminal.length
  
  // 根据节点类型分组
  const uavs = roleNodes.terminal.filter(n => n.type === 'UAV')
  const usvs = roleNodes.terminal.filter(n => n.type === 'USV')
  const auvs = roleNodes.terminal.filter(n => n.type === 'AUV')
  const buoys = roleNodes.terminal.filter(n => n.type === 'BYO')
  const others = roleNodes.terminal.filter(n => !['UAV', 'USV', 'AUV', 'BYO'].includes(n.type))
  
  // UAV（左上区域）
  if (node.type === 'UAV') {
    const index = uavs.findIndex(n => n.name === node.name)
    const row = Math.floor(index / 4)
    const col = index % 4
    return {
      left: `${10 + col * 12}%`,
      top: `${60 + row * 10}%`
    }
  }
  
  // USV（右上区域）
  if (node.type === 'USV') {
    const index = usvs.findIndex(n => n.name === node.name)
    const row = Math.floor(index / 4)
    const col = index % 4
    return {
      left: `${55 + col * 10}%`,
      top: `${60 + row * 10}%`
    }
  }
  
  // 浮标（中下区域）
  if (node.type === 'BYO') {
    const index = buoys.findIndex(n => n.name === node.name)
    const spacing = 50 / (buoys.length + 1)
    return {
      left: `${25 + spacing * (index + 1)}%`,
      top: '75%'
    }
  }
  
  // AUV（底部）
  if (node.type === 'AUV') {
    const index = auvs.findIndex(n => n.name === node.name)
    const spacing = 50 / (auvs.length + 1)
    return {
      left: `${25 + spacing * (index + 1)}%`,
      top: '90%'
    }
  }
  
  // 其他终端节点
  const otherIndex = others.findIndex(n => n.name === node.name)
  return {
    left: `${15 + (otherIndex * 15) % 70}%`,
    top: `${65 + Math.floor(otherIndex / 5) * 10}%`
  }
}

// 📡 根据后端连接数据判断两个节点是否连接（取代旧的自动规则）
const isNodesConnected = (node1, node2) => {
  // 直接检查 props.links 中是否存在连接（不做时间判断）
  for (const link of props.links) {
    // 检查是否匹配当前节点对（使用node1和node2）
    if ((link.node1 === node1.name && link.node2 === node2.name) ||
        (link.node1 === node2.name && link.node2 === node1.name)) {
      const commConfig = commTypes[link.commType]
      if (commConfig) {
        return { commType: link.commType, color: commConfig.color }
      }
    }
  }
  
  return null
}

// 小视图连接
const connections = computed(() => {
  // ⚠️ 只有仿真运行时才显示连线
  if (!props.simulationState?.running) {
    return []
  }
  
  const lines = []
  const positions = [
    { x: 15, y: 25 },
    { x: 45, y: 15 },
    { x: 75, y: 20 },
    { x: 85, y: 50 },
    { x: 70, y: 75 },
    { x: 40, y: 80 },
    { x: 15, y: 70 },
    { x: 25, y: 45 }
  ]
  
  for (let i = 0; i < displayNodes.value.length; i++) {
    for (let j = i + 1; j < displayNodes.value.length; j++) {
      const connectionInfo = isNodesConnected(displayNodes.value[i], displayNodes.value[j])
      if (connectionInfo) {
        lines.push({
          x1: positions[i].x + '%',
          y1: positions[i].y + '%',
          x2: positions[j].x + '%',
          y2: positions[j].y + '%',
          color: connectionInfo.color,
          dash: connectionInfo.commType === 'Wired' ? '' : '3,3'
        })
      }
    }
  }
  
  return lines
})

// 放大视图连接
const allConnections = computed(() => {
  // ⚠️ 只有仿真运行时才显示连线
  if (!props.simulationState?.running) {
    return []
  }
  
  const lines = []
  
  for (let i = 0; i < allNodes.value.length; i++) {
    for (let j = i + 1; j < allNodes.value.length; j++) {
      const node1 = allNodes.value[i]
      const node2 = allNodes.value[j]
      const connectionInfo = isNodesConnected(node1, node2)
      
      if (connectionInfo) {
        const pos1 = getZoomNodePosition(node1)
        const pos2 = getZoomNodePosition(node2)
        
        lines.push({
          x1: pos1.left,
          y1: pos1.top,
          x2: pos2.left,
          y2: pos2.top,
          color: connectionInfo.color,
          dash: connectionInfo.commType === 'Wired' ? '' : '5,5',
          commType: connectionInfo.commType
        })
      }
    }
  }
  
  return lines
})
</script>

<style scoped>
.network-topology-panel {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(13, 27, 42, 0.95) 100%);
  border: 2px solid rgba(0, 234, 255, 0.3);
  border-radius: 12px;
  padding: 12px;
  margin: 5px;
  position: relative;
  overflow: hidden;
  height: 100%;
  box-shadow: 
    0 0 20px rgba(0, 234, 255, 0.2),
    inset 0 0 15px rgba(0, 234, 255, 0.05);
}

.network-topology-panel::before {
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
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #00eaff;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.6);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
}

.topology-content {
  position: relative;
  height: calc(100% - 40px);
}

.network-graph {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 20, 40, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(0, 234, 255, 0.2);
}

.node {
  position: absolute;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #00eaff 0%, #0080ff 100%);
  border-radius: 50%;
  border: 2px solid rgba(0, 234, 255, 0.8);
  box-shadow: 0 0 8px rgba(0, 234, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translate(-50%, -50%);
}

.node:hover {
  transform: translate(-50%, -50%) scale(1.3);
  z-index: 10;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.8);
  background: linear-gradient(135deg, #00ffff 0%, #0099ff 100%);
}

.node-label {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 1px 3px;
  border-radius: 2px;
  white-space: nowrap;
  font-weight: bold;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.stats-info {
  position: absolute;
  bottom: 3px;
  right: 5px;
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: #00eaff;
  background: rgba(0, 20, 40, 0.8);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 234, 255, 0.3);
  box-shadow: 0 0 5px rgba(0, 234, 255, 0.2);
}

.stat-item {
  font-weight: 600;
}

.zoom-btn {
  position: absolute;
  bottom: 3px;
  left: 5px;
  width: 26px;
  height: 26px;
  border: none;
  background: linear-gradient(135deg, #00eaff 0%, #0080ff 100%);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.zoom-btn:hover {
  background: linear-gradient(135deg, #00ffff 0%, #0099ff 100%);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.8);
}

/* 放大视图 */
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
  height: 650px;
}

.zoom-network-graph {
  flex: 1;
  position: relative;
  background: linear-gradient(to bottom, #e3f2fd 0%, #ffffff 50%, #f0f9ff 100%);
  border-right: 2px solid #e0e0e0;
}

.zoom-node {
  position: absolute;
  width: 32px;
  height: 32px;
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

.zoom-node.role-satellite_hub {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  width: 40px;
  height: 40px;
}

.zoom-node.role-airborne_hub {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  width: 36px;
  height: 36px;
}

.zoom-node.role-ground_hub {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  width: 34px;
  height: 34px;
}

.zoom-node.role-surface_hub {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  width: 34px;
  height: 34px;
}

.zoom-node.role-terminal {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  width: 28px;
  height: 28px;
}

.zoom-node:hover {
  transform: translate(-50%, -50%) scale(1.3);
  z-index: 15;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}

.zoom-node-label {
  color: white;
  font-size: 11px;
  font-weight: bold;
}

.zoom-node-name {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #333;
  background: rgba(255, 255, 255, 0.95);
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.zoom-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.zoom-legend {
  width: 240px;
  padding: 20px;
  background: #ffffff;
  overflow-y: auto;
}

.zoom-legend h5 {
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
  gap: 10px;
  font-size: 13px;
  color: #666;
}

.role-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.role-dot.satellite {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.role-dot.airborne {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.role-dot.ground {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.role-dot.terminal {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.legend-line {
  width: 35px;
  height: 3px;
  border-radius: 2px;
}

.legend-line.dashed {
  height: 2px;
  background-image: linear-gradient(to right, currentColor 50%, transparent 50%);
  background-size: 8px 2px;
  background-repeat: repeat-x;
}
</style> 
