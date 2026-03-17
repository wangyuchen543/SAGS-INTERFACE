/**
 * WebSocket XML 构建和解析工具
 */

import { getTransportProtocol, getCommMode, getRoutingProtocol } from '../services/simulation.service.js'

/**
 * 构建发送给后端的节点配置XML
 * @param {Array} nodes - 节点数组
 * @param {Map} waypointsMap - 节点航点映射表
 * @returns {String} XML字符串
 */
export function buildNodeConfigXML(nodes, waypointsMap) {
  // 获取当前选择的传输协议、通信制式和路由协议
  let protocol = getTransportProtocol()
  const commMode = getCommMode()
  const routingProtocol = getRoutingProtocol()
  
  // 
  if (protocol === 'SCTP') {
    protocol = 'TCP'
    console.log(' 检测到 SCTP 协议')
  }
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<simulation>\n'
  
  // 添加全局配置
  xml += '  <config>\n'
  xml += `    <transportProtocol>${protocol}</transportProtocol>\n`
  xml += `    <CellularMode>${commMode}</CellularMode>\n`
  xml += `    <routingProtocol>${routingProtocol}</routingProtocol>\n`
  xml += '  </config>\n'
  
  xml += '  <nodes>\n'
  
  nodes.forEach(node => {
    // 去掉type属性，只保留name
    xml += `    <node name="${node.name}">\n`
    xml += `      <initialPosition lat="${node.lat}" lng="${node.lng}" alt="${node.alt}" />\n`
    xml += `      <mobilityModel>${node.mobilityModel}</mobilityModel>\n`
    
    // 如果是移动节点，添加航点信息
    if (!node.isStatic && waypointsMap.has(node.name)) {
      const waypoints = waypointsMap.get(node.name)
      xml += `      <waypoints>\n`
      
      waypoints.forEach((wp, index) => {
        xml += `        <waypoint index="${index}" time="${wp.time.toFixed(2)}" `
        xml += `lat="${wp.lat.toFixed(6)}" lng="${wp.lng.toFixed(6)}" alt="${wp.alt.toFixed(2)}" />\n`
      })
      
      xml += `      </waypoints>\n`
    }
    
    xml += `    </node>\n`
  })
  
  xml += '  </nodes>\n'
  xml += '</simulation>'
  
  return xml
}

/**
 * 解析从后端接收的性能数据XML（包含连接关系）
 * @param {String} xmlString - XML字符串
 * @returns {Object} 性能数据对象（包含性能指标和连接关系）
 */
export function parsePerformanceXML(xmlString) {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    
    // 检查解析错误
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      console.error('XML解析错误:', parserError.textContent)
      return null
    }
    
    const performanceData = {
      timestamp: Date.now(),
      simulationTime: 0,
      status: '',
      overall: {},
      business: {},
      links: []
    }
    
    // 解析仿真时间和状态
    const simulationTimeElement = xmlDoc.querySelector('simulationTime')
    if (simulationTimeElement) {
      performanceData.simulationTime = parseFloat(simulationTimeElement.textContent || '0')
    }
    
    const statusElement = xmlDoc.querySelector('status')
    if (statusElement) {
      performanceData.status = statusElement.textContent?.trim() || ''
    }
    
    // 解析整体性能指标
    const overall = xmlDoc.querySelector('overall')
    if (overall) {
      performanceData.overall = {
        throughput: parseFloat(overall.querySelector('throughput')?.textContent || '0'),
        delay: parseFloat(overall.querySelector('delay')?.textContent || '0'),
        transmissionRate: parseFloat(overall.querySelector('transmissionRate')?.textContent || '0'),
        packetLoss: parseFloat(overall.querySelector('packetLoss')?.textContent || '0')
      }
    }
    
    // 解析各业务类型的性能指标
    const businesses = xmlDoc.querySelectorAll('business')
    businesses.forEach(business => {
      const type = business.getAttribute('type')
      if (type) {
        performanceData.business[type] = {
          throughput: parseFloat(business.querySelector('throughput')?.textContent || '0'),
          delay: parseFloat(business.querySelector('delay')?.textContent || '0'),
          transmissionRate: parseFloat(business.querySelector('transmissionRate')?.textContent || '0'),
          packetLoss: parseFloat(business.querySelector('packetLoss')?.textContent || '0')
        }
      }
    })
    
    // 解析节点连接关系（新增）
    const linksElement = xmlDoc.querySelector('links')
    if (linksElement) {
      const linkElements = linksElement.querySelectorAll('link')
      linkElements.forEach(link => {
        const node1 = link.querySelector('node1')?.textContent?.trim()
        const node2 = link.querySelector('node2')?.textContent?.trim()
        const commType = link.querySelector('commType')?.textContent?.trim()
        
        if (node1 && node2 && commType) {
          performanceData.links.push({
            node1,
            node2,
            commType
          })
        }
      })
      
      console.log(`📡 解析到 ${performanceData.links.length} 条连接关系`)
    }
    
    return performanceData
  } catch (error) {
    console.error('解析性能数据XML失败:', error)
    return null
  }
}

/**
 * 构建仿真控制XML（可选，如需要）
 * @param {String} action - 控制动作 (start/pause/resume/stop)
 * @param {Object} params - 其他参数
 * @returns {String} XML字符串
 */
export function buildControlXML(action, params = {}) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<control>\n'
  xml += `  <action>${action}</action>\n`
  
  if (params.timestamp) {
    xml += `  <timestamp>${params.timestamp}</timestamp>\n`
  }
  
  xml += '</control>'
  
  return xml
}

/**
 * 示例：后端期望接收的XML格式（包含全局传输协议配置）
 * 
 * <?xml version="1.0" encoding="UTF-8"?>
 * <simulation>
 *   <config>
 *     <transportProtocol>TCP</transportProtocol>  <!-- 全局传输协议: TCP 或 UDP -->
 *   </config>
 *   <nodes>
 *     <node name="UAV1">
 *       <initialPosition lat="29.997445" lng="122.971921" alt="200" />
 *       <mobilityModel>Waypoint</mobilityModel>
 *       <waypoints count="5">
 *         <waypoint index="0" time="0.00" lat="29.997445" lng="122.971921" alt="200.00" />
 *         <waypoint index="1" time="30.50" lat="30.012345" lng="122.985678" alt="210.00" />
 *         ...
 *       </waypoints>
 *     </node>
 *     <node name="SGS1">
 *       <initialPosition lat="29.950985" lng="122.314937" alt="0" />
 *       <mobilityModel>ConstantPosition</mobilityModel>
 *     </node>
 *   </nodes>
 * </simulation>
 */

/**
 * 示例：后端发送的XML格式
 * 
 * <?xml version="1.0" encoding="UTF-8"?>
 * <performance>
 *   <overall>
 *     <throughput>1250.5</throughput>
 *     <delay>15.3</delay>
 *     <transmissionRate>850.2</transmissionRate>
 *     <packetLoss>2.1</packetLoss>
 *   </overall>
 *   <business type="A">
 *     <throughput>350.2</throughput>
 *     <delay>12.5</delay>
 *     <transmissionRate>280.1</transmissionRate>
 *     <packetLoss>1.8</packetLoss>
 *   </business>
 *   <business type="B">
 *     <throughput>420.3</throughput>
 *     <delay>18.2</delay>
 *     <transmissionRate>320.5</transmissionRate>
 *     <packetLoss>2.5</packetLoss>
 *   </business>
 *   <business type="C">
 *     <throughput>280.0</throughput>
 *     <delay>14.8</delay>
 *     <transmissionRate>150.3</transmissionRate>
 *     <packetLoss>1.9</packetLoss>
 *   </business>
 *   <business type="D">
 *     <throughput>200.0</throughput>
 *     <delay>16.5</delay>
 *     <transmissionRate>99.3</transmissionRate>
 *     <packetLoss>2.3</packetLoss>
 *   </business>
 * </performance>
 */

