<template>
  <div class="map-container glass-panel" :style="mapStyle">
    <div ref="cesiumContainer" class="cesium-wrapper"></div>
    <!-- 3D控制面板 -->
    <div class="cesium-controls">
      <button @click="toggleTerrain" class="control-btn">
        <i class="el-icon-location"></i>
        地形
      </button>
      <button @click="toggleAnimation" class="control-btn">
        <i class="el-icon-video-play"></i>
        动画
      </button>
      <button @click="resetView" class="control-btn">
        <i class="el-icon-refresh"></i>
        重置
      </button>
      <button @click="toggleFullscreen" class="control-btn">
        <i class="el-icon-full-screen"></i>
        全屏
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as Cesium from 'cesium'
import { mapConfig } from '../config/map.config.js'
import { nodeTypes, commTypes, hainanRegion } from '../config/nodes.config.js'
import { 
  createRandomWalkPositionProperty, 
  resetAllNodeStates, 
  getNodeCurrentPosition
} from '../utils/waypoint.calculator.js'
import { sendNodeConfig, addWSListener, removeWSListener, connectWebSocket } from '../services/websocket.service.js'
import { addSimulationListener, removeSimulationListener, getRunningTime, commMode, setTimeMultiplier, startSimulation } from '../services/simulation.service.js'
import { toChineseName } from '../utils/node.name.mapper.js'

// 设置 Cesium Token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZDllYmM0Yy02MDkwLTRiNzMtYmQwOS1lNDFkYTZiNTI2ZjQiLCJpZCI6MzQ2MzA4LCJpYXQiOjE3NTkzMjI3NTV9.deKofHg9OeSbO2sYUyOLcUOTbKlizQ7g2ZGIc4Zy-W4'

// 定义 props
const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  links: {
    type: Array,
    default: () => []
  },
  showConnections: {
    type: Boolean,
    default: true
  }
})

// 定义 emits
const emit = defineEmits(['node-select'])

// 响应式数据
const cesiumContainer = ref(null)
const mapStyle = ref({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%'
})
let viewer = null
let nodeEntities = new Map()
let connectionLines = new Map()
let updateInterval = null

// 移动模型相关
let simulationStartTime = null // 仿真开始的JulianDate
let infoBoxUpdateInterval = null // 定期更新InfoBox的定时器
let clockMultiplierInterval = null // 监听时钟倍速变化的定时器
let isSimulationRunning = ref(false) // 仿真是否正在运行

// 🔧 统一的连线宽度
const LINE_WIDTH = 2.5  // 所有连线使用相同宽度（像素）

// 初始化3D地图（使用 Cesium 官方 World Imagery + World Terrain）
const initCesiumMap = () => {
  console.log('🌍 开始初始化 Cesium 地图（World Imagery + World Terrain）...')
  
  if (!cesiumContainer.value) {
    console.error('❌ Cesium容器未找到!')
    return
  }
  
  try {
    // 创建 Cesium 查看器，使用默认配置（兼容性最好）
    viewer = new Cesium.Viewer(cesiumContainer.value, {
      // ✅ 使用默认的 Cesium Ion 影像（World Imagery）
      // imageryProvider 使用默认值，即 Cesium Ion World Imagery
      
      // ✅ 使用默认的 Cesium Ion 地形（World Terrain）
      // terrainProvider 使用默认值，即 Cesium Ion World Terrain
      
      // 基础设置
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false, // ❌ 隐藏动画控制器
    timeline: false,  // ❌ 隐藏时间轴
    fullscreenButton: false,
      vrButton: false,
      infoBox: true, // 启用InfoBox（显示节点详细信息）
      selectionIndicator: true,
      
      // ✅ 性能优化（官方推荐）
      shouldAnimate: true, // 启用动画
      shadows: true, // 启用阴影
      requestRenderMode: false, // ⚠️ 关闭按需渲染，改为持续渲染（移动节点需要）
      maximumRenderTimeChange: Infinity
    })
    
    // 🔧 移除InfoBox的沙箱属性（避免警告）
    if (viewer.infoBox) {
      const frame = viewer.infoBox.frame
      if (frame) {
        frame.removeAttribute('sandbox')
        // 允许所有权限
        frame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
      }
    }
    
    // 🎨 高质量渲染效果配置（按照用户要求）
    const scene = viewer.scene
    
    // ✅ 启用光照（让地球表面更真实）
    scene.globe.enableLighting = true
    
    // ✅ 启用高动态范围渲染（HDR）
    scene.highDynamicRange = true
    
    // ✅ 启用抗锯齿（FXAA）- 消除锯齿边缘
    scene.postProcessStages.fxaa.enabled = true
    
    // ✅ 启用深度测试（让物体遮挡关系正确）
    scene.globe.depthTestAgainstTerrain = true
    
    // 设置分辨率缩放（根据设备性能调整）
    viewer.resolutionScale = window.devicePixelRatio || 1.0
    
    // 不加载 Google 3D Tiles，只使用 World Imagery + World Terrain
    console.log('ℹ️ 只使用 Cesium World Imagery + World Terrain，不加载第三方 3D Tiles')
    
    // 📷 设置初始相机位置（确保在Viewer创建后立即设置）
    setTimeout(() => {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(mapConfig.initial.center[0], mapConfig.initial.center[1], mapConfig.initial.altitude),
        orientation: {
          heading: Cesium.Math.toRadians(mapConfig.initial.heading),
          pitch: Cesium.Math.toRadians(mapConfig.initial.pitch),
          roll: mapConfig.initial.roll
        }
      })
      console.log(`地图初始位置设置为: ${mapConfig.initial.center[0]}°E, ${mapConfig.initial.center[1]}°N, 高度${mapConfig.initial.altitude}米`)
    }, 100)

    // 🎮 限制相机缩放范围
    scene.screenSpaceCameraController.minimumZoomDistance = mapConfig.cameraLimits.minimumZoomDistance
    scene.screenSpaceCameraController.maximumZoomDistance = mapConfig.cameraLimits.maximumZoomDistance
    
    // 🖱️ 添加点击事件监听
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction((click) => {
      const pickedObject = scene.pick(click.position)
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
        // 触发节点选择事件
        const nodeName = pickedObject.id.properties?.nodeName?._value
        if (nodeName) {
          const node = props.nodes.find(n => n.name === nodeName)
          if (node) {
            emit('node-select', node)
            console.log('✅ 节点选中:', node.name)
            
            // 显示实时位置信息
            showRealTimeNodeInfo(pickedObject.id)
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    
    // ✅ 启用Cesium时钟动画（节点移动的核心）
    viewer.clock.shouldAnimate = true
    viewer.clock.multiplier = 1 // 时间流速：1倍速（正常速度）
    
    // ✅ 设置时钟范围为无限循环，防止节点消失
    viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED
    
    // ✅ 设置一个很远的停止时间（100小时后）
    const farFutureTime = Cesium.JulianDate.addHours(Cesium.JulianDate.now(), 100, new Cesium.JulianDate())
    viewer.clock.stopTime = farFutureTime
    
    console.log('⏰ 时钟已设置为无限循环模式，节点不会消失')
    
    console.log('✅ 高清Cesium地图初始化完成!')
    console.log('📊 渲染配置:', {
      分辨率缩放: viewer.resolutionScale,
      抗锯齿: scene.postProcessStages.fxaa.enabled,
      HDR: scene.highDynamicRange,
      光照: scene.globe.enableLighting,
      地形: mapConfig.terrain.enabled,
      时钟动画: viewer.clock.shouldAnimate
    })
    
    // 启动倍速监听
    setTimeout(() => {
      watchClockMultiplier()
    }, 500)
    
  } catch (error) {
    console.error('❌ Cesium初始化失败:', error)
  }
}

// 显示节点实时位置信息
const showRealTimeNodeInfo = (entity) => {
  if (!entity || !viewer) return
  
  // 获取实时位置
  const position = entity.position.getValue(viewer.clock.currentTime)
  if (!position) return
  
  // 转换为地理坐标
  const cartographic = Cesium.Cartographic.fromCartesian(position)
  const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
  const lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
  const alt = cartographic.height.toFixed(2)
  
  // 获取节点信息
  const nodeName = entity.properties?.nodeName?._value || entity.name
  const nodeType = entity.properties?.nodeType?._value || '未知'
  const comms = entity.properties?.comms?._value || []
  const isStatic = entity.properties?.isStatic?._value
  
  // 转换为中文显示名称
  const displayName = toChineseName(nodeName)
  
  // 设置InfoBox内容
  entity.description = `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <h3 style="color: #00eaff; margin-top: 0;">${displayName}</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 5px; font-weight: bold;">类型:</td>
          <td style="padding: 5px;">${nodeType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 5px; font-weight: bold;">状态:</td>
          <td style="padding: 5px;">${isStatic ? '静止' : '移动中'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 5px; font-weight: bold;">纬度:</td>
          <td style="padding: 5px;">${lat}°</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 5px; font-weight: bold;">经度:</td>
          <td style="padding: 5px;">${lng}°</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 5px; font-weight: bold;">高度:</td>
          <td style="padding: 5px;">${alt} 米</td>
        </tr>
        <tr>
          <td style="padding: 5px; font-weight: bold;">通信方式:</td>
          <td style="padding: 5px;">${comms.join(', ')}</td>
        </tr>
      </table>
      <p style="color: #888; font-size: 12px; margin-top: 10px;">
        ${isStatic ? '' : '⚠️ 位置实时更新中'}
      </p>
    </div>
  `
  
  // 选中该实体
  viewer.selectedEntity = entity
  
  console.log(`📍 节点 ${nodeName} 当前位置:`, { lat, lng, alt })
}

// 创建节点实体（支持3D模型和平滑移动）
const createNodeEntity = (node) => {
  if (!viewer) return null
  
  const nodeConfig = nodeTypes[node.type]
  if (!nodeConfig) {
    console.warn(`⚠️ 未知节点类型: ${node.type}`)
    return null
  }
  
  // 获取节点对应的3D模型路径
  const modelPath = mapConfig.models.paths[node.type] || mapConfig.models.paths.default
  const color = Cesium.Color.fromCssColorString(nodeConfig.color)
  
  // 获取节点类型对应的显示配置
  const displayConfig = mapConfig.models.display[node.type] || mapConfig.models.display.default
  
  // 🎯 创建实体配置
  const entityConfig = {
    id: node.name,
    name: node.name,
    properties: {
      nodeName: node.name,
      nodeType: node.type,
      comms: node.comms,
      nodeData: node,
      isStatic: node.isStatic
    }
  }
  
  // 📍 设置节点位置（静态 vs 动态）
  if (node.isStatic) {
    // 静态节点：固定位置
    entityConfig.position = Cesium.Cartesian3.fromDegrees(node.lng, node.lat, node.alt)
  } else {
    // 移动节点：使用CallbackProperty实现随机游走
    if (isSimulationRunning.value) {
      const positionProperty = createRandomWalkPositionProperty(node)
      entityConfig.position = positionProperty
      console.log(`🚀 移动节点 ${node.name} 已配置随机游走位置属性`)
    } else {
      // 仿真未开始，使用初始位置
      entityConfig.position = Cesium.Cartesian3.fromDegrees(node.lng, node.lat, node.alt)
      console.log(`📍 移动节点 ${node.name} 暂时使用初始位置`)
    }
  }
  
  // 🚀 只使用3D模型（不使用散点）
  entityConfig.model = {
    uri: modelPath,
    minimumPixelSize: displayConfig.minimumPixelSize,
    maximumScale: displayConfig.maximumScale,
    scale: displayConfig.scale,
    runAnimations: mapConfig.models.runAnimations,
    clampAnimations: mapConfig.models.clampAnimations,
    // ✅ 修复：统一使用NONE，让节点完全按照给定的高度显示（不贴地）
    heightReference: Cesium.HeightReference.NONE,
    // 关闭深度测试，确保模型始终可见（不被地形遮挡）
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    // ✅ 添加：确保模型即使在地形后面也能被看到
    silhouetteColor: Cesium.Color.fromCssColorString(nodeConfig.color).withAlpha(0.3),
    silhouetteSize: 0
  }
  
  // ❌ 不使用点标记（散点），只用3D模型
  
  // 🏷️ 添加标签（添加状态指示）
  if (mapConfig.labels.show) {
    // 转换为中文显示名称
    const displayName = toChineseName(node.name)
    entityConfig.label = {
      text: node.isStatic ? displayName : `${displayName} 📍`, // 移动节点添加图标
      font: mapConfig.labels.font,
      fillColor: Cesium.Color.fromCssColorString(mapConfig.labels.fillColor),
      outlineColor: Cesium.Color.fromCssColorString(mapConfig.labels.outlineColor),
      outlineWidth: mapConfig.labels.outlineWidth,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(
        mapConfig.labels.pixelOffset.x,
        mapConfig.labels.pixelOffset.y
      ),
      scaleByDistance: new Cesium.NearFarScalar(
        mapConfig.labels.scaleByDistance.near,
        mapConfig.labels.scaleByDistance.nearValue,
        mapConfig.labels.scaleByDistance.far,
        mapConfig.labels.scaleByDistance.farValue
      ),
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      disableDepthTestDistance: Number.POSITIVE_INFINITY // 标签始终可见
    }
  }
  
  // 创建实体
  const entity = viewer.entities.add(entityConfig)
  nodeEntities.set(node.name, entity)
  
  console.log(`✅ 节点创建: ${node.name} (${node.type}) at [${node.lng}, ${node.lat}, ${node.alt}m]`)
  
  return entity
}

// 创建通信连线（使用CallbackProperty实现动态跟随）
const createConnectionLines = () => {
  // ⚠️ 只有仿真开始后才创建连线
  if (!isSimulationRunning.value) {
    return
  }
  
  if (!viewer || props.nodes.length < 2) {
    return
  }
  
  // 清除旧的连线
  connectionLines.forEach(line => {
    viewer.entities.remove(line)
  })
  connectionLines.clear()
  
  if (!props.showConnections) {
    return
  }
  
  // 检查是否有连接数据
  if (!props.links || props.links.length === 0) {
    return
  }
  
  // 遍历所有连接关系（直接渲染XML中的所有连线，不做时间判断）
  for (const link of props.links) {
    const fromNode = props.nodes.find(n => n.name === link.node1)
    const toNode = props.nodes.find(n => n.name === link.node2)
    
    if (!fromNode || !toNode) continue
    
    // 处理4G/5G切换：如果连接类型是4G/5G，根据当前通信制式显示
    let actualCommType = link.commType
    if (link.commType === '4G/5G') {
      actualCommType = commMode.value  // 使用当前选择的通信制式
    }
    
    const commConfig = commTypes[actualCommType]
    if (!commConfig) continue
    
    const color = Cesium.Color.fromCssColorString(commConfig.color).withAlpha(0.6)
    const lineId = `line_${actualCommType}_${link.node1}_${link.node2}`
    
    const fromEntity = nodeEntities.get(fromNode.name)
    const toEntity = nodeEntities.get(toNode.name)
    
    if (!fromEntity || !toEntity) continue
    
    // 🚀 使用 CallbackProperty 动态获取节点位置
    const positionsCallback = new Cesium.CallbackProperty((time, result) => {
      const fromPos = fromEntity.position.getValue(time, new Cesium.Cartesian3())
      const toPos = toEntity.position.getValue(time, new Cesium.Cartesian3())
      
      if (!fromPos || !toPos) return []
      
      return [fromPos, toPos]
    }, false)
    
    // 🌊 水声通信特殊处理：添加深度偏移属性，确保可见
    // 根据通信类型设置线宽：卫星通信使用更细的线
    let lineWidth = LINE_WIDTH
    if (link.commType === 'Satellite' || actualCommType === 'Satellite') {
      lineWidth = 1.5  // 卫星通信使用更细的线
    } else if (commConfig.width) {
      lineWidth = commConfig.width  // 使用配置中指定的宽度
    }
    
    const polylineOptions = {
      positions: positionsCallback,  // 动态位置
      width: lineWidth,  // 根据通信类型设置线宽
      material: color,
      clampToGround: false
    }
    
    // 如果配置了虚线样式，应用虚线
    if (commConfig.dash) {
      polylineOptions.material = new Cesium.PolylineDashMaterialProperty({
        color: color,
        dashLength: commConfig.dash[0],
        gapLength: commConfig.dash[1]
      })
    }
    
    // 如果是水声通信，添加深度偏移以确保可见
    if (link.commType === 'Underwater') {
      polylineOptions.depthFailMaterial = color  // 即使被遮挡也显示
      polylineOptions.arcType = Cesium.ArcType.NONE  // 直线连接，不沿地表
    }
        
        const line = viewer.entities.add({
          id: lineId,
          polyline: polylineOptions
        })
        
        connectionLines.set(lineId, line)
    console.log(`✅ 创建动态连线: ${link.node1} → ${link.node2} (${link.commType})`)
  }
  
  console.log(`✅ 已创建 ${connectionLines.size} 条动态连接线`)
}

// 显示节点信息
const showNodeInfo = (entity) => {
  if (!entity.properties || !entity.properties.nodeData) return
  
  const node = entity.properties.nodeData._value
  const nodeConfig = nodeTypes[node.type]
  
  const infoHtml = `
    <div style="padding: 10px; min-width: 200px;">
      <h3 style="margin: 0 0 10px 0; color: #0066ff;">${node.name}</h3>
      <p><strong>类型:</strong> ${nodeConfig?.labelCN || node.type}</p>
      <p><strong>位置:</strong> ${node.lat.toFixed(4)}°N, ${node.lng.toFixed(4)}°E</p>
      <p><strong>高度:</strong> ${node.alt}m</p>
      <p><strong>通信方式:</strong></p>
      <ul style="margin: 5px 0; padding-left: 20px;">
        ${node.comms.map(comm => `<li>${commTypes[comm]?.labelCN || comm}</li>`).join('')}
      </ul>
    </div>
  `
  
  entity.description = infoHtml
  viewer.selectedEntity = entity
}

// 更新所有节点
const updateNodes = () => {
  if (!viewer) return
  
  // 清除所有旧节点
  nodeEntities.forEach((entity, id) => {
    viewer.entities.remove(entity)
  })
  nodeEntities.clear()
  
  // 创建新节点
  props.nodes.forEach(node => {
    createNodeEntity(node)
  })
  
  // 只有仿真运行时才创建连线
  if (isSimulationRunning.value) {
  createConnectionLines()
  }
  
  console.log(`已更新 ${props.nodes.length} 个节点`)
}

// 监听节点变化
watch(() => props.nodes, () => {
  updateNodes()
}, { deep: true })

// 监听连线显示状态变化
watch(() => props.showConnections, () => {
  createConnectionLines()
})

// 监听连接关系变化
watch(() => props.links, () => {
  console.log('🔗 连接关系已更新，重新绘制连线')
  createConnectionLines()
}, { deep: true })

// 监听通信制式变化
watch(() => commMode.value, () => {
  console.log('📡 通信制式已切换，重新绘制连线')
  createConnectionLines()
})

// 地形控制
const toggleTerrain = () => {
  if (viewer && viewer.scene) {
  viewer.scene.globe.enableLighting = !viewer.scene.globe.enableLighting
  }
}

// 动画控制
const toggleAnimation = () => {
  if (viewer && viewer.clock) {
  viewer.clock.shouldAnimate = !viewer.clock.shouldAnimate
  }
}

// 重置视角（回到默认 45° 俯瞰视角）
const resetView = () => {
  if (viewer && viewer.camera) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(mapConfig.initial.center[0], mapConfig.initial.center[1], mapConfig.initial.altitude),
    orientation: {
      heading: Cesium.Math.toRadians(mapConfig.initial.heading),
      pitch: Cesium.Math.toRadians(mapConfig.initial.pitch),
      roll: mapConfig.initial.roll
    },
    duration: 2.0 // 飞行动画持续 2 秒
  })
    console.log('✅ 已重置到默认 45° 俯瞰视角')
  }
}

// 全屏控制
const toggleFullscreen = () => {
  console.log('🔍 尝试切换全屏模式')
  
  // 首先尝试Cesium的全屏API
  if (viewer) {
    try {
      if (viewer.isFullscreen) {
        console.log('📱 退出全屏')
        viewer.exitFullscreen()
      } else {
        console.log('📱 进入全屏')
        viewer.requestFullscreen()
      }
      return
    } catch (error) {
      console.warn('⚠️ Cesium全屏API失败:', error)
    }
  }
  
  // 如果Cesium API失败，尝试使用原生全屏API
  try {
    const cesiumContainer = document.querySelector('.cesium-wrapper')
    if (cesiumContainer) {
      console.log('🔄 尝试使用原生全屏API')
      if (!document.fullscreenElement) {
        // 进入全屏
        if (cesiumContainer.requestFullscreen) {
          cesiumContainer.requestFullscreen()
        } else if (cesiumContainer.mozRequestFullScreen) {
          cesiumContainer.mozRequestFullScreen()
        } else if (cesiumContainer.webkitRequestFullscreen) {
          cesiumContainer.webkitRequestFullscreen()
        } else if (cesiumContainer.msRequestFullscreen) {
          cesiumContainer.msRequestFullscreen()
        }
        console.log('✅ 成功进入全屏')
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        console.log('✅ 成功退出全屏')
      }
    } else {
      console.error('❌ 找不到cesium-wrapper元素')
    }
  } catch (error) {
    console.error('❌ 全屏操作失败:', error)
  }
}

// 处理仿真开始事件
const handleSimulationStart = async (data) => {
  console.log('🚀 仿真开始，启动随机游走移动模型...')
  
  // 首先启动前端仿真状态
  startSimulation()
  
  // 设置仿真运行状态
  isSimulationRunning.value = true
  
  // 重置所有节点的移动状态
  resetAllNodeStates()
  
  // 设置仿真开始时间
  simulationStartTime = Cesium.JulianDate.now()
  
  // 确保Cesium时钟动画开启
  if (viewer && viewer.clock) {
    viewer.clock.shouldAnimate = true
    console.log('⏰ 已启用Cesium时钟动画')
  }
  
  // 重新创建所有节点实体（应用随机游走位置属性）
  updateNodes()
  console.log('✅ 所有节点已应用随机游走移动模型')
  
  // 启动WebSocket连接（测试模式下会加载XML文件）
  try {
    console.log('🔌 启动WebSocket连接（测试模式）...')
    await connectWebSocket()
  } catch (error) {
    console.error('❌ WebSocket连接失败:', error)
  }
  
  // ✅ 启动定时更新选中节点的InfoBox（每秒更新）
  if (infoBoxUpdateInterval) {
    clearInterval(infoBoxUpdateInterval)
  }
  
  infoBoxUpdateInterval = setInterval(() => {
    if (viewer && viewer.selectedEntity) {
      const entity = viewer.selectedEntity
      const isStatic = entity.properties?.isStatic?._value
      
      // 只更新移动节点的InfoBox
      if (!isStatic) {
        showRealTimeNodeInfo(entity)
      }
    }
  }, 1000) // 每秒更新一次
}

// 处理仿真暂停事件
const handleSimulationPause = () => {
  console.log('⏸️ 仿真暂停，暂停 Cesium 时钟动画')
  
  // 暂停 Cesium 时钟动画
  if (viewer && viewer.clock) {
    viewer.clock.shouldAnimate = false
  }
  
  // 暂停 InfoBox 更新定时器（不清除，只是停止更新）
  if (infoBoxUpdateInterval) {
    clearInterval(infoBoxUpdateInterval)
    infoBoxUpdateInterval = null
  }
}

// 处理仿真继续事件
const handleSimulationResume = () => {
  console.log('▶️ 仿真继续，恢复 Cesium 时钟动画')
  
  // 恢复 Cesium 时钟动画
  if (viewer && viewer.clock) {
    viewer.clock.shouldAnimate = true
  }
  
  // 恢复 InfoBox 更新定时器
  if (isSimulationRunning.value && !infoBoxUpdateInterval) {
    infoBoxUpdateInterval = setInterval(() => {
      if (viewer && viewer.selectedEntity) {
        const entity = viewer.selectedEntity
        const isStatic = entity.properties?.isStatic?._value
        
        // 只更新移动节点的InfoBox
        if (!isStatic) {
          showRealTimeNodeInfo(entity)
        }
      }
    }, 1000) // 每秒更新一次
  }
}

// 处理仿真停止事件
const handleSimulationStop = () => {
  console.log('⏹️ 仿真停止，清理移动节点状态')
  
  // 设置仿真运行状态
  isSimulationRunning.value = false
  
  // 暂停 Cesium 时钟动画
  if (viewer && viewer.clock) {
    viewer.clock.shouldAnimate = false
  }
  
  // 清除所有连线
  connectionLines.forEach(line => {
    viewer.entities.remove(line)
  })
  connectionLines.clear()
  
  // 清除定时器
  if (infoBoxUpdateInterval) {
    clearInterval(infoBoxUpdateInterval)
    infoBoxUpdateInterval = null
  }
  
  // 重置所有移动节点到初始位置
  props.nodes.forEach(node => {
    if (!node.isStatic && nodeEntities.has(node.name)) {
      const entity = nodeEntities.get(node.name)
      entity.position = Cesium.Cartesian3.fromDegrees(node.lng, node.lat, node.alt)
    }
  })
  
  simulationStartTime = null
  
  // 重置所有节点移动状态
  resetAllNodeStates()
}

// 监听Cesium时钟倍速变化
const watchClockMultiplier = () => {
  // 先清除之前的定时器
  if (clockMultiplierInterval) {
    clearInterval(clockMultiplierInterval)
    clockMultiplierInterval = null
  }
  
  if (!viewer || !viewer.clock) {
    console.warn('⚠️ viewer 或 clock 未初始化，无法监听倍速变化')
    return
  }
  
  let lastMultiplier = 1
  
  clockMultiplierInterval = setInterval(() => {
    // 添加严格检查，确保 viewer 和 clock 都存在
    if (!viewer || !viewer.clock) {
      return
    }
    
    try {
      const currentMultiplier = viewer.clock.multiplier
      
      // 只有倍速变化时才更新
      if (Math.abs(currentMultiplier - lastMultiplier) > 0.01) {
        lastMultiplier = currentMultiplier
        setTimeMultiplier(currentMultiplier)
      }
    } catch (error) {
      console.error('❌ 读取时钟倍速失败:', error)
    }
  }, 200)  // 每200ms检查一次
}

// 生命周期
onMounted(() => {
  // 延迟初始化，确保 DOM 已渲染
  setTimeout(() => {
  // 初始化3D地图
  initCesiumMap()
  
    // 延迟初始化节点显示，确保地图已创建
    setTimeout(() => {
      updateNodes()
    }, 500)
  }, 100)
  
  // 添加仿真事件监听器
  addSimulationListener('simulation:start', handleSimulationStart)
  addSimulationListener('simulation:pause', handleSimulationPause)
  addSimulationListener('simulation:resume', handleSimulationResume)
  addSimulationListener('simulation:stop', handleSimulationStop)
})

onUnmounted(() => {
  // 移除仿真事件监听器
  removeSimulationListener('simulation:start', handleSimulationStart)
  removeSimulationListener('simulation:pause', handleSimulationPause)
  removeSimulationListener('simulation:resume', handleSimulationResume)
  removeSimulationListener('simulation:stop', handleSimulationStop)
  
  // 清除定时器
  if (movementUpdateInterval) {
    clearInterval(movementUpdateInterval)
  }
  
  if (infoBoxUpdateInterval) {
    clearInterval(infoBoxUpdateInterval)
    infoBoxUpdateInterval = null
  }
  
  // 清除时钟倍速监听定时器
  if (clockMultiplierInterval) {
    clearInterval(clockMultiplierInterval)
    clockMultiplierInterval = null
  }
  
  // 销毁地图
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
  
  // 清理节点和连线
  nodeEntities.clear()
  connectionLines.clear()
  waypointsMap.clear()
})
</script>

<style scoped>
.map-container {
  position: relative;
  overflow: hidden;
  padding: 8px;
  margin: 5px;
}

.map-container::before {
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

.map-container::after {
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

.cesium-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(0, 102, 255, 0.2);
  position: relative;
  z-index: 3;
}

.cesium-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-glow);
  opacity: 0.2;
  pointer-events: none;
  border-radius: 12px;
}

.cesium-controls {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-btn {
  background: rgba(0, 102, 255, 0.8);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 102, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 80px;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(0, 102, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 102, 255, 0.4);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn i {
  font-size: 12px;
}

/* Cesium控件样式覆盖 */
:deep(.cesium-viewer-bottom) {
  display: none;
}

:deep(.cesium-viewer-toolbar) {
  display: none;
}

:deep(.cesium-widget-credits) {
  display: none;
}
</style>