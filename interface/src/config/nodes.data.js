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
    lng: 86.3333,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS2',
    type: 'HIBS',
    lat: 35.0833,
    lng: 86.5,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS3',
    type: 'HIBS',
    lat: 35.1667,
    lng: 86.6667,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS4',
    type: 'HIBS',
    lat: 35.25,
    lng: 86.8333,
    alt: 0,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // ========== 可移动节点 ==========
  
  

  

  // 无人机
  {
    name: 'UAV1',
    type: 'UAV',
    lat: 34.97,
    lng: 87.2,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV2',
    type: 'UAV',
    lat: 35.1,
    lng: 87.22,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV3',
    type: 'UAV',
    lat: 35.2,
    lng: 87.28,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV4',
    type: 'UAV',
    lat: 35.3,
    lng: 87.34,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV5',
    type: 'UAV',
    lat: 35.07,
    lng: 87.1,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV6',
    type: 'UAV',
    lat: 35.12,
    lng: 87.03,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV7',
    type: 'UAV',
    lat: 34.97,
    lng: 87.10,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV8',
    type: 'UAV',
    lat: 34.87,
    lng: 87.05,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV9',
    type: 'UAV',
    lat: 34.87,
    lng: 87.1,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV10',
    type: 'UAV',
    lat: 34.91,
    lng: 87.07,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV11',
    type: 'UAV',
    lat: 34.81,
    lng: 87.07,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV12',
    type: 'UAV',
    lat: 35.1,
    lng: 86.97,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV13',
    type: 'UAV',
    lat: 35.12,
    lng: 86.95,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV14',
    type: 'UAV',
    lat: 34.99,
    lng: 86.85,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV15',
    type: 'UAV',
    lat: 34.97,
    lng: 86.95,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV16',
    type: 'UAV',
    lat: 35.0833,
    lng: 86.9,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV17',
    type: 'UAV',
    lat: 35.0833,
    lng: 86.8,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV18',
    type: 'UAV',
    lat: 35.0833,
    lng: 86.6,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },

  // 导弹发射车
  {
    name: 'PV1',
    type: 'PV',
    lat: 35.1667,
    lng: 87.6,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'PV2',
    type: 'PV',
    lat: 34.9167,
    lng: 87.5,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'PV3',
    type: 'PV',
    lat: 34.75,
    lng: 87.4667,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },


  // 高级无人机（A-UAV）
  {
    name: 'A-UAV1',
    type: 'A-UAV',
    lat: 34.85,
    lng: 87.15,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'A-UAV2',
    type: 'A-UAV',
    lat: 34.8,
    lng: 87.18,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'A-UAV3',
    type: 'A-UAV',
    lat: 34.75,
    lng: 87.2,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'A-UAV4',
    type: 'A-UAV',
    lat: 34.7,
    lng: 87.22,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },

  // 战斗无人机（B-UAV）
  {
    name: 'B-UAV1',
    type: 'B-UAV',
    lat: 35.0,
    lng: 87.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'B-UAV2',
    type: 'B-UAV',
    lat: 34.95,
    lng: 87.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'B-UAV3',
    type: 'B-UAV',
    lat: 34.9,
    lng: 87.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'B-UAV4',
    type: 'B-UAV',
    lat: 34.85,
    lng: 87.0,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
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

