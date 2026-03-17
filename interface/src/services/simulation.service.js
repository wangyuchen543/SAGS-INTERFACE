// 仿真状态管理服务
import { ref, reactive } from 'vue'

// 全局仿真状态
const simulationState = reactive({
  running: false,
  paused: false,
  startTime: null,
  pausedTime: 0,
  pauseStartTime: null
})

// 全局传输协议状态（TCP/UDP）
const transportProtocol = ref('TCP')  // 默认为TCP

// 全局通信制式状态（4G/5G）
const commMode = ref('5G')  // 默认为5G

// 全局路由协议状态（AODV/DSDV/OSPF）
const routingProtocol = ref('AODV')  // 默认为AODV

// 全局时间倍速状态
const timeMultiplier = ref(1)  // 默认1倍速

// 事件监听器
const listeners = new Map()

// 添加事件监听器
export const addSimulationListener = (event, callback) => {
  if (!listeners.has(event)) {
    listeners.set(event, [])
  }
  listeners.get(event).push(callback)
}

// 移除事件监听器
export const removeSimulationListener = (event, callback) => {
  if (listeners.has(event)) {
    const callbacks = listeners.get(event)
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }
}

// 触发事件
const emit = (event, data) => {
  console.log(`📡 触发事件: ${event}`, data)
  if (listeners.has(event)) {
    console.log(`📡 找到 ${listeners.get(event).length} 个监听器`)
    listeners.get(event).forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`仿真事件监听器错误 (${event}):`, error)
      }
    })
  } else {
    console.log(`📡 没有找到事件 ${event} 的监听器`)
  }
}

// 开始仿真
export const startSimulation = () => {
  if (simulationState.running) {
    console.warn('⚠️ 仿真已经在运行中')
    return false
  }
  
  console.log('🚀 开始仿真（前端控制）')
  simulationState.running = true
  simulationState.paused = false
  simulationState.startTime = Date.now()
  simulationState.pausedTime = 0
  simulationState.pauseStartTime = null
  
  // 触发开始事件
  emit('simulation:start', { timestamp: simulationState.startTime })
  
  return true
}

// 暂停仿真
export const pauseSimulation = () => {
  if (!simulationState.running || simulationState.paused) {
    console.warn('⚠️ 仿真未运行或已暂停')
    return false
  }
  
  console.log('⏸️ 暂停仿真（前端控制）')
  simulationState.paused = true
  simulationState.pauseStartTime = Date.now()
  
  // 触发暂停事件
  emit('simulation:pause', { timestamp: simulationState.pauseStartTime })
  
  return true
}

// 继续仿真
export const resumeSimulation = () => {
  if (!simulationState.running || !simulationState.paused) {
    console.warn('⚠️ 仿真未暂停')
    return false
  }
  
  console.log('▶️ 继续仿真（前端控制）')
  
  // 累计暂停时间
  if (simulationState.pauseStartTime) {
    simulationState.pausedTime += (Date.now() - simulationState.pauseStartTime)
    simulationState.pauseStartTime = null
  }
  
  simulationState.paused = false
  
  // 触发继续事件
  emit('simulation:resume', { timestamp: Date.now() })
  
  return true
}

// 终止仿真
export const stopSimulation = () => {
  if (!simulationState.running) {
    console.warn('⚠️ 仿真未运行')
    return false
  }
  
  console.log('⏹️ 终止仿真（前端控制）')
  simulationState.running = false
  simulationState.paused = false
  simulationState.startTime = null
  simulationState.pausedTime = 0
  simulationState.pauseStartTime = null
  
  // 触发终止事件
  emit('simulation:stop', { timestamp: Date.now() })
  
  return true
}

// 获取仿真状态
export const getSimulationState = () => {
  return { ...simulationState }
}

// 获取运行时间（秒）
export const getRunningTime = () => {
  if (!simulationState.running || !simulationState.startTime) {
    // console.log('⏰ 仿真未运行或未开始，返回0')
    return 0
  }
  
  let elapsed = Math.floor((Date.now() - simulationState.startTime - simulationState.pausedTime) / 1000)
  
  // 如果当前处于暂停状态，减去当前暂停的时间
  if (simulationState.paused && simulationState.pauseStartTime) {
    const currentPauseDuration = Date.now() - simulationState.pauseStartTime
    elapsed = Math.floor((Date.now() - simulationState.startTime - simulationState.pausedTime - currentPauseDuration) / 1000)
  }
  
  // console.log('⏰ 运行时间计算:', {
  //   running: simulationState.running,
  //   paused: simulationState.paused,
  //   startTime: simulationState.startTime,
  //   pausedTime: simulationState.pausedTime,
  //   elapsed: elapsed
  // })
  
  return Math.max(0, elapsed)
}

// 格式化运行时间
export const formatRunningTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// 检查是否应该更新数据
export const shouldUpdateData = () => {
  return simulationState.running && !simulationState.paused
}

// 设置传输协议
export const setTransportProtocol = (protocol) => {
  if (protocol === 'TCP' || protocol === 'UDP') {
    transportProtocol.value = protocol
    console.log(`📡 全局传输协议已设置为: ${protocol}`)
    
    // 触发协议变更事件
    emit('protocol:change', { protocol })
  } else {
    console.warn(`⚠️ 无效的传输协议: ${protocol}`)
  }
}

// 获取当前传输协议
export const getTransportProtocol = () => {
  return transportProtocol.value
}

// 设置通信制式
export const setCommMode = (mode) => {
  if (mode === '4G' || mode === '5G') {
    commMode.value = mode
    console.log(`📡 全局通信制式已设置为: ${mode}`)
    
    // 触发通信制式变更事件
    emit('comm:change', { mode })
  } else {
    console.warn(`⚠️ 无效的通信制式: ${mode}`)
  }
}

// 获取当前通信制式
export const getCommMode = () => {
  return commMode.value
}

// 设置路由协议
export const setRoutingProtocol = (protocol) => {
  if (protocol === 'AODV' || protocol === 'DSDV' || protocol === 'OSPF') {
    routingProtocol.value = protocol
    console.log(`📡 全局路由协议已设置为: ${protocol}`)
    
    // 触发路由协议变更事件
    emit('routing:change', { protocol })
  } else {
    console.warn(`⚠️ 无效的路由协议: ${protocol}`)
  }
}

// 获取当前路由协议
export const getRoutingProtocol = () => {
  return routingProtocol.value
}

// 设置时间倍速
export const setTimeMultiplier = (multiplier) => {
  if (multiplier > 0) {
    timeMultiplier.value = multiplier
    console.log(`⏱️ 时间倍速已更新: ${multiplier.toFixed(2)}x`)
  }
}

// 获取时间倍速
export const getTimeMultiplier = () => {
  return timeMultiplier.value
}

// 导出状态对象（用于响应式绑定）
export { simulationState, transportProtocol, commMode, routingProtocol, timeMultiplier }
