/**
 * WebSocket 通信服务
 * 负责与后端建立WebSocket连接，发送节点配置，接收性能数据
 */

import { ref, reactive } from 'vue'
import { buildNodeConfigXML, parsePerformanceXML } from '../utils/websocket.xml.js'

// 测试模式配置
const testMode = true // 设置为true启用测试模式
const testXmlFiles = [
  '/test/test-performance-10s.xml',
  '/test/test-performance-20s.xml',
  '/test/test-performance-30s.xml',
  '/test/test-performance-40s.xml',
  '/test/test-performance-50s.xml'
]

// WebSocket配置
const wsConfig = reactive({
  host: 'localhost',      // 默认主机
  port: 50000,            // 默认端口
  path: ''                // WebSocket路径（无路径）
})

// WebSocket状态
const wsState = reactive({
  connected: false,
  connecting: false,
  error: null,
  lastMessage: null,
  lastPerformanceData: null,
  simulationData: [], // 存储多组仿真数据
  simulationComplete: false
})

// WebSocket实例
let ws = null

// 事件监听器
const listeners = new Map()

/**
 * 添加事件监听器
 * @param {String} event - 事件名称 (connected/disconnected/performance/error)
 * @param {Function} callback - 回调函数
 */
export const addWSListener = (event, callback) => {
  if (!listeners.has(event)) {
    listeners.set(event, [])
  }
  listeners.get(event).push(callback)
}

/**
 * 移除事件监听器
 */
export const removeWSListener = (event, callback) => {
  if (listeners.has(event)) {
    const callbacks = listeners.get(event)
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }
}

/**
 * 触发事件
 */
const emit = (event, data) => {
  console.log(`🔌 WebSocket事件: ${event}`, data)
  if (listeners.has(event)) {
    listeners.get(event).forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`WebSocket事件监听器错误 (${event}):`, error)
      }
    })
  }
}

/**
 * 加载本地测试XML文件
 * @param {String} filePath - XML文件路径
 * @returns {Promise<String>}
 */
const loadTestXmlFile = (filePath) => {
  return fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.text()
    })
    .catch(error => {
      console.error('❌ 加载测试XML文件失败:', error)
      throw error
    })
}

/**
 * 模拟WebSocket消息
 * @param {String} xmlString - XML字符串
 */
const simulateWebSocketMessage = (xmlString) => {
  console.log('📩 模拟收到WebSocket消息')
  wsState.lastMessage = xmlString

  // 解析性能数据XML
  const performanceData = parsePerformanceXML(xmlString)
  if (performanceData) {
    console.log('✅ XML解析成功:', performanceData)
    wsState.lastPerformanceData = performanceData
    
    // 存储仿真数据
    wsState.simulationData.push(performanceData)
    
    // 检查是否完成
    if (performanceData.status === 'complete') {
      console.log('🎯 仿真完成，触发simulation-complete事件')
      wsState.simulationComplete = true
      emit('simulation-complete', wsState.simulationData)
    } else {
      console.log('📊 发送performance事件')
      emit('performance', performanceData)
    }
  } else {
    console.error('❌ XML解析失败')
  }
}

/**
 * 开始测试模式，加载并解析测试XML文件
 */
const startTestMode = async () => {
  console.log('🧪 启动测试模式，加载本地XML文件...')
  
  // 标记为已连接状态
  wsState.connected = true
  wsState.connecting = false
  wsState.error = null
  
  // 触发连接成功事件
  emit('connected', { host: 'localhost', port: 50000 })
  
  // 依次加载并解析测试XML文件
  for (let i = 0; i < testXmlFiles.length; i++) {
    try {
      console.log(`📁 加载测试文件: ${testXmlFiles[i]}`)
      const xmlString = await loadTestXmlFile(testXmlFiles[i])
      
      // 模拟WebSocket消息
      simulateWebSocketMessage(xmlString)
      
      // 等待一段时间再加载下一个文件（2秒间隔）
      if (i < testXmlFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    } catch (error) {
      console.error('❌ 处理测试文件失败:', error)
    }
  }
  
  console.log('✅ 测试模式完成，所有XML文件已处理')
}

/**
 * 连接WebSocket
 * @param {String} host - 主机地址
 * @param {Number} port - 端口号
 * @returns {Promise<Boolean>}
 */
export const connectWebSocket = (host = wsConfig.host, port = wsConfig.port) => {
  return new Promise((resolve, reject) => {
    if (testMode) {
      console.log('🧪 启用测试模式，使用本地XML文件')
      startTestMode()
      resolve(true)
      return
    }

    if (wsState.connected) {
      console.log('⚠️ WebSocket已连接')
      resolve(true)
      return
    }

    if (wsState.connecting) {
      console.log('⚠️ WebSocket正在连接中')
      reject(new Error('正在连接中'))
      return
    }

    wsConfig.host = host
    wsConfig.port = port
    wsState.connecting = true
    wsState.error = null

    const wsUrl = `ws://${host}:${port}${wsConfig.path}`
    console.log(`🔌 正在连接WebSocket: ${wsUrl}`)

    try {
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('✅ WebSocket连接成功')
        wsState.connected = true
        wsState.connecting = false
        wsState.error = null
        emit('connected', { host, port })
        resolve(true)
      }

      ws.onmessage = (event) => {
        console.log('📩 收到WebSocket消息:', event.data)
        wsState.lastMessage = event.data

        // 解析性能数据XML
        const performanceData = parsePerformanceXML(event.data)
        if (performanceData) {
          console.log('✅ XML解析成功:', performanceData)
          wsState.lastPerformanceData = performanceData
          
          // 存储仿真数据
          wsState.simulationData.push(performanceData)
          
          // 检查是否完成
          if (performanceData.status === 'complete') {
            console.log('🎯 仿真完成，触发simulation-complete事件')
            wsState.simulationComplete = true
            emit('simulation-complete', wsState.simulationData)
          } else {
            console.log('📊 发送performance事件')
            emit('performance', performanceData)
          }
        } else {
          console.error('❌ XML解析失败')
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket错误:', error)
        wsState.error = error.message || '连接错误'
        wsState.connecting = false
        emit('error', error)
        reject(error)
      }

      ws.onclose = (event) => {
        console.log('🔌 WebSocket连接关闭:', event.code, event.reason)
        wsState.connected = false
        wsState.connecting = false
        emit('disconnected', { code: event.code, reason: event.reason })
      }
    } catch (error) {
      console.error('❌ WebSocket连接失败:', error)
      wsState.error = error.message
      wsState.connecting = false
      reject(error)
    }
  })
}

/**
 * 断开WebSocket连接
 */
export const disconnectWebSocket = () => {
  if (ws) {
    console.log('🔌 主动断开WebSocket连接')
    ws.close()
    ws = null
    wsState.connected = false
    wsState.connecting = false
  }
}

/**
 * 发送节点配置XML到后端
 * @param {Array} nodes - 节点数组
 * @param {Map} waypointsMap - 航点映射表
 * @returns {Boolean} 是否发送成功
 */
export const sendNodeConfig = (nodes, waypointsMap) => {
  if (testMode) {
    console.log('🧪 测试模式：模拟发送节点配置XML')
    try {
      const xml = buildNodeConfigXML(nodes, waypointsMap)
      console.log('📤 模拟发送节点配置XML:', xml)
      return true
    } catch (error) {
      console.error('❌ 构建XML失败:', error)
      return false
    }
  }

  if (!wsState.connected || !ws) {
    console.error('❌ WebSocket未连接，无法发送数据')
    return false
  }

  try {
    const xml = buildNodeConfigXML(nodes, waypointsMap)
    console.log('📤 发送节点配置XML到后端:', xml)
    ws.send(xml)
    return true
  } catch (error) {
    console.error('❌ 发送节点配置失败:', error)
    return false
  }
}

/**
 * 发送原始XML消息
 * @param {String} xmlString - XML字符串
 * @returns {Boolean} 是否发送成功
 */
export const sendXML = (xmlString) => {
  if (testMode) {
    console.log('🧪 测试模式：模拟发送XML消息')
    console.log('📤 模拟发送XML消息:', xmlString)
    return true
  }

  if (!wsState.connected || !ws) {
    console.error('❌ WebSocket未连接，无法发送数据')
    return false
  }

  try {
    console.log('📤 发送XML消息:', xmlString)
    ws.send(xmlString)
    return true
  } catch (error) {
    console.error('❌ 发送XML失败:', error)
    return false
  }
}

/**
 * 获取WebSocket状态
 */
export const getWSState = () => {
  return { ...wsState }
}

/**
 * 获取最新性能数据
 */
export const getLatestPerformanceData = () => {
  return wsState.lastPerformanceData
}

/**
 * 获取所有仿真数据
 */
export const getSimulationData = () => {
  return wsState.simulationData
}

/**
 * 检查仿真是否完成
 */
export const isSimulationComplete = () => {
  return wsState.simulationComplete
}

/**
 * 重置仿真数据
 */
export const resetSimulationData = () => {
  wsState.simulationData = []
  wsState.simulationComplete = false
}

/**
 * 更新WebSocket配置
 */
export const updateWSConfig = (config) => {
  Object.assign(wsConfig, config)
}

/**
 * 获取WebSocket配置
 */
export const getWSConfig = () => {
  return { ...wsConfig }
}

// 导出状态对象（用于响应式绑定）
export { wsState, wsConfig }

