/**
 * 节点初始配置数据
 * 舟山海域节点网络配置
 */

export const initialNodesData = [
  // ========== 静态节点 ==========
  
  
  // 浮空基站
  {
    name: 'HIBS1',
    type: 'HIBS',
    lat: 35.0,
    lng: 115.4333,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS2',
    type: 'HIBS',
    lat: 35.0833,
    lng: 115.5,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS3',
    type: 'HIBS',
    lat: 35.1667,
    lng: 115.6667,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS4',
    type: 'HIBS',
    lat: 35.25,
    lng: 115.8333,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // ========== 可移动节点 ==========
  
  

  


  // 无人机（UAV1-4为静态节点）
  {
    name: 'UAV1',
    type: 'UAV',
    lat: 34.97,
    lng: 116.2,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV2',
    type: 'UAV',
    lat: 35.1,
    lng: 116.22,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV3',
    type: 'UAV',
    lat: 35.2,
    lng: 116.28,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV4',
    type: 'UAV',
    lat: 35.3,
    lng: 116.34,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV5',
    type: 'UAV',
    lat: 35.07,
    lng: 116.1,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV6',
    type: 'UAV',
    lat: 35.12,
    lng: 116.03,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV7',
    type: 'UAV',
    lat: 34.97,
    lng: 116.10,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV8',
    type: 'UAV',
    lat: 34.87,
    lng: 116.05,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false,
    target: {
      name: 'UAV9',
      lat: 34.87,
      lng: 116.1,
      alt: 200
    }
  },
  {
    name: 'UAV9',
    type: 'UAV',
    lat: 34.87,
    lng: 116.1,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV10',
    type: 'UAV',
    lat: 34.91,
    lng: 116.07,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV11',
    type: 'UAV',
    lat: 34.81,
    lng: 116.07,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false,
    target: {
      name: 'A-UAV2',
      lat: 34.8,
      lng: 116.18,
      alt: 600
    }
  },
  {
    name: 'UAV12',
    type: 'UAV',
    lat: 35.1,
    lng: 115.97,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV13',
    type: 'UAV',
    lat: 35.15,
    lng: 115.95,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false,
    target: {
      name: 'UAV16',
      lat: 35.0833,
      lng: 115.9,
      alt: 200
    }
  },
  {
    name: 'UAV14',
    type: 'UAV',
    lat: 34.99,
    lng: 115.85,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV15',
    type: 'UAV',
    lat: 34.97,
    lng: 115.95,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV16',
    type: 'UAV',
    lat: 35.0833,
    lng: 115.9,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV17',
    type: 'UAV',
    lat: 35.0833,
    lng: 115.8,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'UAV18',
    type: 'UAV',
    lat: 35.0833,
    lng: 115.6,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 导弹发射车（静态节点）
  {
    name: 'PV1',
    type: 'PV',
    lat: 35.1667,
    lng: 116.5,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'PV2',
    type: 'PV',
    lat: 34.9167,
    lng: 116.3,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'PV3',
    type: 'PV',
    lat: 34.75,
    lng: 116.2667,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },


  // 高级无人机（A-UAV，静态节点）
  {
    name: 'A-UAV1',
    type: 'A-UAV',
    lat: 34.85,
    lng: 116.15,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'A-UAV2',
    type: 'A-UAV',
    lat: 34.8,
    lng: 116.18,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'A-UAV3',
    type: 'A-UAV',
    lat: 34.75,
    lng: 116.2,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'A-UAV4',
    type: 'A-UAV',
    lat: 34.7,
    lng: 116.22,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 战斗无人机（B-UAV，静态节点）
  {
    name: 'B-UAV1',
    type: 'B-UAV',
    lat: 35.0,
    lng: 116.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'B-UAV2',
    type: 'B-UAV',
    lat: 34.95,
    lng: 116.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'B-UAV3',
    type: 'B-UAV',
    lat: 34.9,
    lng: 116.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'B-UAV4',
    type: 'B-UAV',
    lat: 34.85,
    lng: 116.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  }
]

/**
 * 获取节点初始数据
 * @returns {Array} 节点数组
 */
export function getInitialNodes() {
  // 返回深拷贝，避免直接修改原始数据
  return JSON.parse(JSON.stringify(initialNodesData))
}

