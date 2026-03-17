<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <header class="app-header" :style="headerStyle">
      <h1 class="app-title">ns3-SAGS仿真系统</h1>
    </header>

    <!-- 主要内容区域 -->
    <main class="dashboard-container" :style="dashboardStyle">
      <!-- 左侧面板 -->
      <aside class="left-panels" :style="leftPanelsStyle">
        <div 
          v-for="panel in layoutConfig.panels.left" 
          :key="panel.id"
          class="panel-wrapper"
          :style="{ height: panel.height }"
        >
          <component 
            :is="getPanelComponent(panel.component)"
            :panel-id="panel.id"
            :nodes="nodes"
            :links="links"
            :simulation-state="simulationState"
            @nodes-update="handleNodesUpdate"
            @node-select="handleNodeSelect"
            @toggle-connections="handleConnectionsToggle"
          />
        </div>
      </aside>

      <!-- 中央区域 -->
      <section class="center-area" :style="centerAreaStyle">
        <!-- 控制栏 -->
        <ControlBar @button-click="handleControlButtonClick" />
        
        <!-- 地图区域 -->
        <div class="map-area">
          <MapComponent 
            :nodes="nodes" 
            :links="links"
            :show-connections="showConnections" 
            @node-select="handleNodeSelect"
          />
        </div>
      </section>

      <!-- 右侧面板 -->
      <aside class="right-panels" :style="rightPanelsStyle">
        <div 
          v-for="panel in layoutConfig.panels.right" 
          :key="panel.id"
          class="panel-wrapper"
          :style="{ height: panel.height }"
        >
          <component 
            :is="getPanelComponent(panel.component)"
            :panel-id="panel.id"
            :nodes="nodes"
            :links="links"
            :selected-node-id="selectedNodeId"
            :simulation-state="simulationState"
            @toggle-connections="handleConnectionsToggle"
          />
        </div>
      </aside>

      <!-- 底部面板 -->
      <footer class="bottom-panels" :style="bottomPanelsStyle">
        <div 
          v-for="panel in layoutConfig.panels.bottom" 
          :key="panel.id"
          class="panel-wrapper"
          :class="getBottomPanelClass(panel.id)"
          :style="panel.config?.style || {}"
        >
          <component 
            :is="getPanelComponent(panel.component || panel.config?.component || 'PerformanceChart')"
            :panel-id="panel.id"
            :title="panel.config?.title || panel.id"
            :config="panel.config"
            :metric-type="panel.config?.metricType"
            :show-business-selector="panel.config?.showBusinessSelector"
            @business-change="handleBusinessChange"
            @data-request="handleDataRequest"
          />
        </div>
      </footer>
    </main>
    
    <!-- 仿真完成弹窗 -->
    <SimulationCompleteDialog 
      v-model:visible="showCompleteDialog"
      :simulation-time="simulationCompleteTime"
      :data-points="simulationCompleteDataPoints"
      :connections="links.length"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { layoutConfig } from './config/layout.config.js'
import ControlBar from './components/ControlBar.vue'
import MapComponent from './components/MapComponent.vue'
import NodeManager from './components/panels/NodeManager.vue'
import PerformanceChart from './components/panels/PerformanceChart.vue'
import SimulationInfoPanel from './components/panels/SimulationInfoPanel.vue'
import HitRatePanel from './components/panels/HitRatePanel.vue'
import NetworkTopologyPanel from './components/panels/NetworkTopologyPanel.vue'
import NodeAdjacencyPanel from './components/panels/NodeAdjacencyPanel.vue'
import NodeStatsPanel from './components/panels/NodeStatsPanel.vue'
import MessagePanel from './components/panels/MessagePanel.vue'
import BusinessTypeSelector from './components/panels/BT_throughput.vue'
import NetworkTrafficSelector from './components/panels/BT_pocketloss.vue'
import ConnectionsSelector from './components/panels/BT_transmissionrate.vue'
import ErrorRateSelector from './components/panels/BT_delay.vue'
import BusinessChart from './components/panels/BusinessChart.vue'
import SimulationCompleteDialog from './components/SimulationCompleteDialog.vue'
import { simulationState } from './services/simulation.service.js'
import { addWSListener, removeWSListener, resetSimulationData, getSimulationData } from './services/websocket.service.js'

// 响应式数据
// 使用全局仿真状态

// 节点数据
const nodes = ref([])

// 选中的节点名称（替代ID）
const selectedNodeId = ref('')

// 通信连线显示状态
const showConnections = ref(true)

// 节点连接关系（从后端接收）
const links = ref([])

// 仿真完成弹窗状态
const showCompleteDialog = ref(false)
const simulationCompleteTime = ref(0)
const simulationCompleteDataPoints = ref(0)
const chartCompleteTriggered = ref(false) // 防止多次触发

// 窗口尺寸响应式状态
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

// 样式计算
const headerStyle = computed(() => ({
  height: layoutConfig.layout.headerHeight,
  backgroundColor: layoutConfig.theme.primaryColor,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontWeight: 'bold'
}))

const dashboardStyle = computed(() => {
  const width = windowWidth.value
  let gridTemplateColumns = '1fr 4fr 1fr'
  let gridTemplateRows = '3fr 2fr'
  
  if (width <= layoutConfig.responsive.breakpoints.mobile) {
    gridTemplateColumns = '1fr'
    gridTemplateRows = 'auto auto 1fr auto'
  } else if (width <= layoutConfig.responsive.breakpoints.tablet) {
    gridTemplateColumns = '1.2fr 3fr 1.2fr'
    gridTemplateRows = '1fr 0.4fr'
  }
  
  return {
    display: 'grid',
    gridTemplateColumns,
    gridTemplateRows,
    gap: '10px',
    height: `calc(100vh - ${layoutConfig.layout.headerHeight} - 20px)`,
    padding: '10px',
    boxSizing: 'border-box'
  }
})

const leftPanelsStyle = computed(() => {
  const width = windowWidth.value
  let gridRow = '1 / 3'  // 纵跨两行
  let gridColumn = '1'
  
  if (width <= layoutConfig.responsive.breakpoints.mobile) {
    gridRow = '1'
    gridColumn = '1'
  }
  
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    gridRow,
    gridColumn
  }
})

const centerAreaStyle = computed(() => {
  const width = windowWidth.value
  let gridRow = '1'
  let gridColumn = '2'
  
  if (width <= layoutConfig.responsive.breakpoints.mobile) {
    gridRow = '3'
    gridColumn = '1'
  }
  
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    gridRow,
    gridColumn
  }
})

const rightPanelsStyle = computed(() => {
  const width = windowWidth.value
  let gridRow = '1 / 3'
  let gridColumn = '3'
  
  if (width <= layoutConfig.responsive.breakpoints.mobile) {
    gridRow = '2'
    gridColumn = '1'
  }
  
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    gridRow,
    gridColumn
  }
})

const bottomPanelsStyle = computed(() => {
  const width = windowWidth.value
  let gridTemplateColumns = 'repeat(4, 1fr)'
  let gridTemplateRows = 'repeat(2, 1fr)'
  let gridColumn = '2 / 3'
  let gridRow = '2'
  
  if (width <= layoutConfig.responsive.breakpoints.mobile) {
    gridTemplateColumns = '1fr'
    gridTemplateRows = 'repeat(8, 1fr)'
    gridColumn = '1'
    gridRow = '4'
  } else if (width <= layoutConfig.responsive.breakpoints.tablet) {
    gridTemplateColumns = 'repeat(2, 1fr)'
    gridTemplateRows = 'repeat(4, 1fr)'
    gridColumn = '2 / 3'
    gridRow = '2'
  }
  
  return {
    width: '100%',
    justifySelf: 'stretch',
    gridRow,
    gridColumn,
    display: 'grid',
    gridTemplateColumns,
    gridTemplateRows,
    gap: '5px',
    padding: '0px'
  }
})

// 组件映射
const componentMap = {
  'NodeManager': NodeManager,
  'PerformanceChart': PerformanceChart,
  'SimulationInfoPanel': SimulationInfoPanel,
  'HitRatePanel': HitRatePanel,
  'NetworkTopologyPanel': NetworkTopologyPanel,
  'NodeAdjacencyPanel': NodeAdjacencyPanel,
  'NodeStatsPanel': NodeStatsPanel,
  'MessagePanel': MessagePanel,
  'BusinessTypeSelector': BusinessTypeSelector,
  'NetworkTrafficSelector': NetworkTrafficSelector,
  'ConnectionsSelector': ConnectionsSelector,
  'ErrorRateSelector': ErrorRateSelector,
  'BusinessChart': BusinessChart,
  // 添加配置文件中使用的组件名称映射
  'BtThroughputConfig': BusinessTypeSelector,
  'btDelaySelector': ErrorRateSelector,
  'btTransmissionrateSelector': ConnectionsSelector
}

// 获取面板组件
const getPanelComponent = (componentName) => {
  return componentMap[componentName] || NodeManager
}

// 处理节点更新
const handleNodesUpdate = (updatedNodes) => {
  nodes.value = updatedNodes
  console.log('节点数据已更新:', updatedNodes)
}

// 处理节点选择
const handleNodeSelect = (node) => {
  selectedNodeId.value = node?.name || ''
  console.log('节点已选择:', node, '选中名称:', selectedNodeId.value)
}

// 处理连线显示切换
const handleConnectionsToggle = (value) => {
  showConnections.value = value
  console.log('连线显示状态已切换:', value)
}

// 处理业务类型切换
const handleBusinessChange = (data) => {
  console.log('业务类型切换:', data)
  // 预留接口：可以在这里通知后端业务类型变更
  // apiService.notifyBusinessChange(data)
}

// 处理数据请求
const handleDataRequest = (request) => {
  console.log('数据请求:', request)
  // 预留接口：可以在这里从后端获取真实数据
  // apiService.requestBusinessData(request).then(data => {
  //   // 更新图表数据
  // })
}

// 获取底部面板的CSS类，用于定位在4x2网格中
const getBottomPanelClass = (panelId) => {
  const panelClasses = {
    'throughput': 'grid-item-1-1',
    'packetLoss': 'grid-item-2-1', 
    'transmissionRate': 'grid-item-3-1',
    'delay': 'grid-item-4-1',
    'businessThroughput': 'grid-item-1-2',
    'businessDelay': 'grid-item-2-2',
    'businessPacketLoss': 'grid-item-3-2',
    'businessBandwidth': 'grid-item-4-2'
  }
  return panelClasses[panelId] || ''
}

// 处理控制按钮点击
const handleControlButtonClick = (event) => {
  const { buttonId, simulationState: newState } = event
  simulationState.value = newState
  
  // 开始仿真时重置数据
  if (buttonId === 'start') {
    resetSimulationData()
    chartCompleteTriggered.value = false // 重置完成标记
    showCompleteDialog.value = false // 关闭弹窗
  }
}

// 响应式处理
const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

// 处理WebSocket性能数据接收（包含连接关系）
const handlePerformanceData = (performanceData) => {
  console.log('📊 App收到performance事件:', performanceData)
  if (performanceData && performanceData.links) {
    links.value = performanceData.links
    console.log('🔗 连接关系已更新:', links.value.length, '条连接')
  }
}

// 处理仿真完成事件
const handleSimulationComplete = (simulationData) => {
  console.log('🎯 App收到仿真完成事件，数据量:', simulationData.length)
  
  // 获取最后一组数据的连接关系
  if (simulationData.length > 0) {
    const lastData = simulationData[simulationData.length - 1]
    if (lastData.links) {
      links.value = lastData.links
      console.log('🔗 连接关系已更新，连接数:', links.value.length)
    }
  }
}

// 处理图表绘制完成事件（折线图绘制到最后一秒时触发）
const handleChartComplete = (event) => {
  // 防止多次触发（因为有多个图表组件）
  if (chartCompleteTriggered.value) {
    return
  }
  
  console.log('📊 图表绘制完成，显示完成弹窗')
  chartCompleteTriggered.value = true
  
  const simulationData = getSimulationData()
  
  if (simulationData.length > 0) {
    // 计算最大仿真时间
    const maxTime = Math.max(...simulationData.map(data => data.simulationTime))
    simulationCompleteTime.value = maxTime
    simulationCompleteDataPoints.value = simulationData.length
    
    // 显示弹窗
    showCompleteDialog.value = true
  }
}

// 加载测试XML数据（仅用于开发测试，不设置连线）
const loadTestData = async () => {
  // 注释掉测试数据加载，连线应该只从后端XML获取
  // try {
  //   const response = await fetch('/test/test-performance.xml')
  //   const xmlText = await response.text()
  //   
  //   // 使用现有的XML解析函数
  //   const { parsePerformanceXML } = await import('./utils/websocket.xml.js')
  //   const performanceData = parsePerformanceXML(xmlText)
  //   
  //   if (performanceData && performanceData.links) {
  //     links.value = performanceData.links
  //     console.log('✅ 已加载测试数据:', links.value.length, '条连接')
  //   }
  // } catch (error) {
  //   console.error('❌ 加载测试数据失败:', error)
  // }
}

// 生命周期
onMounted(() => {
  // 初始化响应式布局
  handleResize()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  
  // 监听WebSocket性能数据和仿真完成事件
  addWSListener('performance', handlePerformanceData)
  addWSListener('simulation-complete', handleSimulationComplete)
  
  // 监听图表绘制完成事件（自定义事件）
  window.addEventListener('simulation-chart-complete', handleChartComplete)
  
  // 加载测试数据
  loadTestData()
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
  
  // 清理WebSocket监听器
  removeWSListener('performance', handlePerformanceData)
  removeWSListener('simulation-complete', handleSimulationComplete)
  
  // 清理图表完成事件监听器
  window.removeEventListener('simulation-chart-complete', handleChartComplete)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--gradient-primary);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  position: relative;
}

.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 102, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 204, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(77, 77, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 60% 60%, rgba(153, 51, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
  animation: backgroundShift 25s ease-in-out infinite;
}

.app-header {
  background: var(--gradient-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.4);
  border-bottom: 3px solid var(--neon-blue);
  overflow: hidden;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
  animation: shimmer 4s ease-in-out infinite;
}

.app-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 8s ease-in-out infinite;
}

.app-title {
  margin: 0;
  font-size: 18px;
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 20px rgba(255, 255, 255, 0.4);
  position: relative;
  z-index: 2;
  letter-spacing: 2px;
  font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

.dashboard-container {
  position: relative;
  z-index: 1;
  /* 样式由JavaScript动态计算 */
}

.left-panels,
.right-panels {
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 15px;
}

.center-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 15px;
}

.map-area {
  flex: 1;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-glow), var(--shadow-deep);
  position: relative;
}

.map-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-glow);
  opacity: 0.4;
  pointer-events: none;
  z-index: 1;
}

.map-area::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 102, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 204, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

.bottom-panels {
  width: 100%;
  height: 100%;
  grid-column: 2 / 3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
}

.panel-wrapper {
  height: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: var(--shadow-glow), var(--shadow-deep);
  transition: all 0.4s ease;
  position: relative;
}

.panel-wrapper::before {
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

.panel-wrapper::after {
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

.panel-wrapper:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 20px 60px rgba(0, 102, 255, 0.4),
    0 30px 80px rgba(0, 0, 0, 0.6);
  border-color: var(--neon-blue);
}

.panel-wrapper:hover::before {
  background: var(--gradient-blue);
  box-shadow: 0 0 20px var(--neon-blue);
}

/* 4x2网格定位类 */
.grid-item-1-1 { grid-column: 1; grid-row: 1; }
.grid-item-2-1 { grid-column: 2; grid-row: 1; }
.grid-item-3-1 { grid-column: 3; grid-row: 1; }
.grid-item-4-1 { grid-column: 4; grid-row: 1; }
.grid-item-1-2 { grid-column: 1; grid-row: 2; }
.grid-item-2-2 { grid-column: 2; grid-row: 2; }
.grid-item-3-2 { grid-column: 3; grid-row: 2; }
.grid-item-4-2 { grid-column: 4; grid-row: 2; }

/* 响应式设计现在由JavaScript动态处理 */
</style>

