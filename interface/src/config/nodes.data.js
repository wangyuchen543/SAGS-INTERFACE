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
    lat: 29.750514,
    lng: 122.634049,
    alt: 20000,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS2',
    type: 'HIBS',
    lat: 29.750514,
    lng: 122.967868,
    alt: 20000,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'HIBS3',
    type: 'HIBS',
    lat: 29.759203,
    lng: 123.322458,
    alt: 20000,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
   {
    name: 'HIBS4',
    type: 'HIBS',
    lat: 29.659203,
    lng: 123.522458,
    alt: 20000,
    comms: ['4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // ========== 可移动节点 ==========
  
  

  

  // 无人机
  {
    name: 'UAV1',
    type: 'UAV',
    lat: 29.997445,
    lng: 122.971921,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV2',
    type: 'UAV',
    lat: 29.949269,
    lng: 123.322458,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV3',
    type: 'UAV',
    lat: 29.971557,
    lng: 122.933483,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV4',
    type: 'UAV',
    lat: 29.977381,
    lng: 123.382591,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV5',
    type: 'UAV',
    lat: 30.017484,
    lng: 123.337814,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV6',
    type: 'UAV',
    lat: 30.032733,
    lng: 122.932584,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV7',
    type: 'UAV',
    lat: 29.994988,
    lng: 123.147343,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV8',
    type: 'UAV',
    lat: 29.9949,
    lng: 123.1443,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV9',
    type: 'UAV',
    lat: 30.024949,
    lng: 123.1643,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV10',
    type: 'UAV',
    lat: 29.964949,
    lng: 123.1243,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV11',
    type: 'UAV',
    lat: 30.014949,
    lng: 123.1843,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV12',
    type: 'UAV',
    lat: 29.984949,
    lng: 123.1043,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'UAV13',
    type: 'UAV',
    lat: 30.004949,
    lng: 123.1543,
    alt: 200,
    comms: ['4G/5G', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },

  // 导弹发射车
  {
    name: 'PV1',
    type: 'PV',
    lat: 29.857151,
    lng: 122.382741,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'PV2',
    type: 'PV',
    lat: 29.867151,
    lng: 122.392741,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'PV3',
    type: 'PV',
    lat: 29.847151,
    lng: 122.372741,
    alt: 0,
    comms: ['4G/5G'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },


  // 高级无人机（A-UAV）
  {
    name: 'A-UAV1',
    type: 'A-UAV',
    lat: 30.007445,
    lng: 122.981921,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'A-UAV2',
    type: 'A-UAV',
    lat: 29.959269,
    lng: 123.332458,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'A-UAV3',
    type: 'A-UAV',
    lat: 29.981557,
    lng: 122.943483,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'A-UAV4',
    type: 'A-UAV',
    lat: 29.987381,
    lng: 123.392591,
    alt: 600,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },

  // 战斗无人机（B-UAV）
  {
    name: 'B-UAV1',
    type: 'B-UAV',
    lat: 30.017445,
    lng: 122.991921,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'B-UAV2',
    type: 'B-UAV',
    lat: 29.969269,
    lng: 123.342458,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'B-UAV3',
    type: 'B-UAV',
    lat: 29.991557,
    lng: 122.953483,
    alt: 700,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'B-UAV4',
    type: 'B-UAV',
    lat: 29.997381,
    lng: 123.402591,
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

