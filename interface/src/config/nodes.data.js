/**
 * 节点初始配置数据
 * 舟山海域节点网络配置
 */

export const initialNodesData = [
  // ========== 静态节点 ==========
  
  // GEO卫星
  {
    name: 'GEO1',
    type: 'GEO',
    lat: 31.776179,
    lng: 123.283715,
    alt: 20000000,  // 20,000,000 米 = 20,000 公里
    comms: ['Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 卫星地面站
  {
    name: 'SGS1',
    type: 'SGS',
    lat: 29.950985,
    lng: 122.314937,
    alt: 0,
    comms: ['Wired', '4G/5G', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 控制中心
  {
    name: 'OCC1',
    type: 'OCC',
    lat: 30.023211,
    lng: 122.25964,
    alt: 0,
    comms: ['Wired'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 宏基站
  {
    name: 'MBS1',
    type: 'MBS',
    lat: 29.916553,
    lng: 122.378548,
    alt: 50,
    comms: ['Wired', '4G/5G'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 岸基mesh网关
  {
    name: 'SMG1',
    type: 'SMG',
    lat: 29.845698,
    lng: 122.403379,
    alt: 20,
    comms: ['Wired', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'SMG2',
    type: 'SMG',
    lat: 29.949758,
    lng: 122.453243,
    alt: 20,
    comms: ['Wired', 'Mesh'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 海上浮标
  {
    name: 'BYO1',
    type: 'BYO',
    lat: 29.621194,
    lng: 122.665816,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'BYO2',
    type: 'BYO',
    lat: 29.725836,
    lng: 122.745147,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'BYO3',
    type: 'BYO',
    lat: 30.040307,
    lng: 122.640241,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'BYO4',
    type: 'BYO',
    lat: 29.773754,
    lng: 122.609535,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'BYO5',
    type: 'BYO',
    lat: 29.897742,
    lng: 122.634049,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'BYO6',
    type: 'BYO',
    lat: 30.03595,
    lng: 122.812861,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'BYO7',
    type: 'BYO',
    lat: 29.706163,
    lng: 122.547821,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'BYO8',
    type: 'BYO',
    lat: 29.85447,
    lng: 122.780131,
    alt: 2,
    comms: ['4G/5G', 'Mesh', 'Underwater'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

  // 海上作业平台
  {
    name: 'IPB1',
    type: 'IPB',
    lat: 29.769203,
    lng: 123.423689,
    alt: 20,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },
  {
    name: 'IPB2',
    type: 'IPB',
    lat: 29.827673,
    lng: 122.954897,
    alt: 20,
    comms: ['4G/5G', 'Mesh', 'Satellite'],
    mobilityModel: 'ConstantPosition',
    isStatic: true
  },

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

  // ========== 可移动节点 ==========
  
  // 水下航行器
  {
    name: 'AUV1',
    type: 'AUV',
    lat: 29.759128,
    lng: 122.864988,
    alt: -50,
    comms: ['Underwater'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'AUV2',
    type: 'AUV',
    lat: 29.678147,
    lng: 122.771701,
    alt: -50,
    comms: ['Underwater'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'AUV3',
    type: 'AUV',
    lat: 29.819049,
    lng: 122.731872,
    alt: -50,
    comms: ['Underwater'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },

  // 无人艇
  {
    name: 'USV1',
    type: 'USV',
    lat: 29.690207,
    lng: 122.967043,
    alt: 3,
    comms: ['Satellite', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'USV2',
    type: 'USV',
    lat: 29.742249,
    lng: 122.971741,
    alt: 3,
    comms: ['Satellite', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'USV3',
    type: 'USV',
    lat: 29.717929,
    lng: 123.02699,
    alt: 3,
    comms: ['Satellite', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'USV4',
    type: 'USV',
    lat: 29.73202,
    lng: 123.239808,
    alt: 3,
    comms: ['Satellite', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'USV5',
    type: 'USV',
    lat: 29.686507,
    lng: 123.406732,
    alt: 3,
    comms: ['Satellite', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'USV6',
    type: 'USV',
    lat: 29.713709,
    lng: 123.350826,
    alt: 3,
    comms: ['Satellite', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },
  {
    name: 'USV7',
    type: 'USV',
    lat: 29.661986,
    lng: 123.344825,
    alt: 3,
    comms: ['Satellite', 'Mesh'],
    mobilityModel: 'Waypoint',
    isStatic: false
  },

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

  // 巡逻车
  {
    name: 'PV1',
    type: 'PV',
    lat: 29.857151,
    lng: 122.382741,
    alt: 0,
    comms: ['4G/5G'],
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

