export const mapConfig = {
  // Cesium Ion Access Token
  ionAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZDllYmM0Yy02MDkwLTRiNzMtYmQwOS1lNDFkYTZiNTI2ZjQiLCJpZCI6MzQ2MzA4LCJpYXQiOjE3NTkzMjI3NTV9.deKofHg9OeSbO2sYUyOLcUOTbKlizQ7g2ZGIc4Zy-W4',
  
  // 高清影像配置
  imagery: {
    useIon: true, // 使用 Cesium Ion 高清影像
    ionAssetId: 2275207, // Google Photorealistic 3D Tiles
    useBing: false // 如需使用 Bing Maps，请设置为 true 并配置 API Key
  },
  
  // 地形配置
  terrain: {
    enabled: true,
    useWorldTerrain: true, // 使用 Cesium World Terrain
    exaggeration: 1.0 // 地形夸张系数（1.0 = 真实高度）
  },
  
  // 渲染质量配置（高清优化）
  rendering: {
    enableLighting: true, // 启用光照
    enableShadows: false, // 阴影（影响性能，按需开启）
    enableFxaa: true, // 抗锯齿
    enableHDR: true, // HDR渲染
    maximumScreenSpaceError: 1.5, // 屏幕空间误差（越小越清晰）
    resolutionScale: window.devicePixelRatio || 1.0, // 使用设备像素比
    msaaSamples: 4 // 多重采样抗锯齿
  },
  
  // 相机初始配置
  camera: {
    position: {
      lng: 116.3, // 115-118度的中间
      lat: 32.6, // 34-37度的中间
      height: 30000
    },
    orientation: {
      heading: 0, // 方位角（度）
      pitch: -60, // 俯仰角（度）
      roll: 0 // 翻滚角（度）
    }
  },
  
  // 相机控制范围
  cameraLimits: {
    minimumZoomDistance: 100, // 最小缩放距离（米）
    maximumZoomDistance: 25000000 // 最大缩放距离（米）= 25,000km，可以看到GEO卫星
  },
  
  // 3D模型配置
  models: {
    // 节点模型路径
    paths: {
      // 🛩️ 无人机
      UAV: '/models/UAV.glb',
      
      // 🚀 A-无人机
      'A-UAV': '/models/A-UAV.glb',
      
      // ⚔️ B-无人机
      'B-UAV': '/models/B-UAV.glb',
      
      // 🚢 水面无人艇
      USV: '/models/USV.glb',
      
      // 🤿 水下航行器
      AUV: '/models/AUV.glb',
      
      // ⛵ 巡逻艇 (使用AUV模型)
      PB: '/models/AUV.glb',
      
      // 🎈 浮空基站
      HIBS: '/models/C.glb',
      
      // ⚓ 浮标
      BYO: '/models/BYO.glb',
      
      // 📡 岸基5G基站 (已删除CBS类型)
      
      // 📶 Mesh岸基站
      MBS: '/models/MBS.glb',
      
      // 🌐 岸基Mesh网关
      SMG: '/models/SMG.glb',
      
      // 🏢 控制管理中心
      OCC: '/models/OCC.glb',
      
      // 📡 卫星地面站
      SGS: '/models/SGS.glb',
      
      // 🏗️ 岸基感知站点
      SPB: '/models/MBS.glb',
      
      // 🏝️ 岛礁感知站点
      IPB: '/models/IPB.glb',
      
      // 📹 光电监测杆站
      EO: '/models/MBS.glb',
      
      // 📡 雷达监测站点
      RDR: '/models/MBS.glb',
      
      // 🚀 导弹发射车
      PV: '/models/PV.glb',
      
      // 🛰️ GEO卫星
      GEO: '/models/satellite.glb',
      
      // 🛰️ 卫星 (通用)
      satellite: '/models/satellite.glb',
      
      // 默认模型
      default: '/models/UAV.glb'
    },
    
    // 每种节点类型的显示配置
    display: {
      // 空中节点
      UAV: {
        minimumPixelSize: 130,
        maximumScale: 1500,
        scale: 80.0
      },
      'A-UAV': {
        minimumPixelSize: 110,
        maximumScale: 1200,
        scale: 70.0
      },
      'B-UAV': {
        minimumPixelSize: 200,
        maximumScale: 1300,
        scale: 80.0
      },
      HIBS: {
        minimumPixelSize: 150,
        maximumScale: 15000,
        scale: 200.0
      },
      GEO: {
        minimumPixelSize: 100,   // 增大最小像素尺寸
        maximumScale: 50000,     // 增大最大缩放
        scale: 10000.0            // 增大模型缩放（让远距离也能看到）
      },
      
      // 水面节点
      USV: {
        minimumPixelSize: 45,
        maximumScale: 12000,
        scale: 80.0
      },
      PB: {
        minimumPixelSize: 70,
        maximumScale: 12000,
        scale: 90.0
      },
      BYO: {
        minimumPixelSize: 30,
        maximumScale: 8000,
        scale: 60.0
      },
      
      // 水下节点
      AUV: {
        minimumPixelSize: 20,
        maximumScale: 10000,
        scale: 80.0
      },
      
      // 固定基础设施
      OCC: {
        minimumPixelSize: 100,
        maximumScale: 20000,
        scale: 300.0
      },
      // CBS类型已删除
      MBS: {
        minimumPixelSize: 90,
        maximumScale: 18000,
        scale: 160.0
      },
      SMG: {
        minimumPixelSize: 85,
        maximumScale: 16000,
        scale: 150.0
      },
      SGS: {
        minimumPixelSize: 60,
        maximumScale: 16000,
        scale: 100.0
      },
      SPB: {
        minimumPixelSize: 80,
        maximumScale: 15000,
        scale: 120.0
      },
      IPB: {
        minimumPixelSize: 150,
        maximumScale: 16000,
        scale: 130.0
      },
      // 🚀 导弹发射车
      PV: {
        minimumPixelSize: 100,
        maximumScale: 12000,
        scale: 40.0
      },
      RDR: {
        minimumPixelSize: 75,
        maximumScale: 14000,
        scale: 110.0
      },
      
      // 卫星
      satellite: {
        minimumPixelSize: 60,
        maximumScale: 10000,
        scale: 100.0
      },
      
      // 默认配置
      default: {
        minimumPixelSize: 64,
        maximumScale: 10000,
        scale: 80.0
      }
    },
    
    // 全局模型配置
    runAnimations: false,
    clampAnimations: true
  },
  
  // 标签配置
  labels: {
    show: true,
    font: '14px sans-serif',
    fillColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 3,
    pixelOffset: { x: 0, y: -30 },
    scaleByDistance: {
      near: 1500,
      nearValue: 1.0,
      far: 150000,
      farValue: 0.4
    }
  },
  
  // 连接线配置
  connections: {
    width: 2,
    alpha: 0.6,
    arcType: 'GEODESIC' // GEODESIC（大地线）或 NONE（直线）
  },
  
  // 旧配置（保持兼容性）
  initial: {
    center: [116.3, 32.6], // 115-118度经度，34-37度纬度的中间
    zoom: 2,
    minZoom: 1,
    maxZoom: 18,
    altitude: 290000,
    pitch: -45,
    heading: 0,
    roll: 0
  },
  
  style: {
    height: '100%',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  
  markers: {
    redTeam: { color: '#ff0000', size: 15, height: 0, scale: 1.0, glow: true },
    blueTeam: { color: '#00d4ff', size: 15, height: 0, scale: 1.0, glow: true },
    satellite: { color: '#00ff88', size: 12, height: 1000, scale: 0.8, glow: true },
    aircraft: { color: '#ffaa00', size: 12, height: 500, scale: 0.8, glow: true }
  },
  
  controls: {
    zoom: true,
    fullscreen: true,
    scale: true,
    attribution: true,
    terrain: true,
    animation: false,
    reset: true
  },
  
  effects: {
    enableParticles: true,
    enableTrails: true,
    trailLength: 100,
    enableGlow: true,
    glowIntensity: 1.0
  }
}
