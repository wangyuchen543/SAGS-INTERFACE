/**
 * 节点类型配置
 */
export const nodeTypes = {
  OCC: {
    label: 'Control Management Center',
    labelCN: '控制管理中心',
    color: '#FF0000',
    icon: '/icons/OCC.png',
    defaultAlt: 10,
    availableComms: ['Wired']
  },
  SGS: {
    label: 'Satellite Ground Station',
    labelCN: '卫星地面站',
    color: '#FFAA00',
    icon: '/icons/SGS.png',
    defaultAlt: 20,
    availableComms: ['Wired', '4G/5G', 'Satellite']
  },
  GEO: {
    label: 'Geostationary Orbit Satellite',
    labelCN: 'GEO卫星',
    color: '#FFD700',
    icon: '/icons/satellite.png',
    defaultAlt: 20000000,
    availableComms: ['Satellite']
  },
  MBS: {
    label: '5G Macro Base Station',
    labelCN: '岸基5G基站',
    color: '#0066FF',
    icon: '/icons/MBS.png',
    defaultAlt: 50,
    availableComms: ['Wired', '4G/5G']
  },
  SMG: {
    label: 'Shore Mesh Gateway',
    labelCN: '岸基Mesh网关',
    color: '#00AAAA',
    icon: '/icons/SMG.png',
    defaultAlt: 20,
    availableComms: ['Wired', 'Mesh']
  },
  EO: {
    label: 'Electro-Optical Monitoring Station',
    labelCN: '光电监测杆站',
    color: '#AA00AA',
    icon: '/icons/EO.png',
    defaultAlt: 20,
    availableComms: ['4G/5G']
  },
  RDR: {
    label: 'Radar Monitoring Station',
    labelCN: '雷达监测站点',
    color: '#AA5500',
    icon: '/icons/RDR.png',
    defaultAlt: 30,
    availableComms: ['4G/5G']
  },
  IPB: {
    label: 'Island Perception Base',
    labelCN: '海上作业平台',
    color: '#5500AA',
    icon: '/icons/IPB.png',
    defaultAlt: 10,
    availableComms: ['4G/5G', 'Mesh', 'Satellite']
  },
  BYO: {
    label: 'Buoy',
    labelCN: '浮标',
    color: '#00FFFF',
    icon: '/icons/BYO.png',
    defaultAlt: 0,
    availableComms: ['4G/5G', 'Mesh', 'Underwater']
  },
  UAV: {
    label: 'Unmanned Aerial Vehicle',
    labelCN: '无人机',
    color: '#FF00FF',
    icon: '/icons/UAV.png',
    defaultAlt: 500,
    availableComms: ['4G/5G', 'Mesh']
  },
  USV: {
    label: 'Unmanned Surface Vehicle',
    labelCN: '水面无人艇',
    color: '#00FF00',
    icon: '/icons/USV.png',
    defaultAlt: 0,
    availableComms: ['Satellite', 'Mesh']
  },
  PV: {
    label: 'Patrol Vehicle',
    labelCN: '巡逻车',
    color: '#AA6600',
    icon: '/icons/AUV.png',
    defaultAlt: 0,
    availableComms: ['4G/5G']
  },
  HIBS: {
    label: 'High-Altitude Platform Station',
    labelCN: '浮空基站',
    color: '#FF5500',
    icon: '/icons/HIPS.png',
    defaultAlt: 20000,
    availableComms: ['4G/5G', 'Satellite']
  },
  AUV: {
    label: 'Unmanned Underwater Vehicle',
    labelCN: '水下航行器',
    color: '#0055FF',
    icon: '/icons/AUV.png',
    defaultAlt: -50,
    availableComms: ['Underwater']
  }
}

/**
 * 通信方式配置
 */
export const commTypes = {
  Wired: {
    label: 'Wired Communication',
    labelCN: '有线通信',
    color: '#888888',
    width: 3
  },
  '4G/5G': {
    label: '4G/5G',
    labelCN: '4G/5G通信',
    color: '#0066FF',  // 使用5G的深蓝色作为代表色
    width: 2
  },
  '4G': {
    label: '4G LTE',
    labelCN: '4G通信',
    color: '#00FFFF',  // 青色（保留用于后端传来的4G连线）
    width: 2
  },
  '5G': {
    label: '5G NR',
    labelCN: '5G通信',
    color: '#0066FF',  // 深蓝色（保留用于后端传来的5G连线）
    width: 2
  },
  Satellite: {
    label: 'Satellite Communication',
    labelCN: '卫星通信',
    color: '#FFAA00',
    width: 2
  },
  Mesh: {
    label: 'Mesh Network (1.4G WiFi)',
    labelCN: 'Mesh自组网',
    color: '#00AA00',
    width: 2
  },
  Underwater: {
    label: 'Underwater Acoustic Communication',
    labelCN: '水声通信',
    color: '#C8A2FF',  // 浅紫色
    width: 2
  }
}

/**
 * 舟山海域区域配置
 */
export const hainanRegion = {
  center: {
    lat: 29.85,
    lng: 122.8,
    alt: 50000
  },
  bounds: {
    north: 31.8,
    south: 29.5,
    east: 123.5,
    west: 122.2
  }
}

/**
 * 获取节点类型列表
 */
export function getNodeTypeList() {
  return Object.keys(nodeTypes).map(key => ({
    value: key,
    label: `${nodeTypes[key].labelCN} (${key})`,
    labelEN: nodeTypes[key].label
  }))
}

/**
 * 获取节点可用通信方式
 */
export function getAvailableComms(nodeType) {
  return nodeTypes[nodeType]?.availableComms || []
}

/**
 * 获取通信方式列表
 */
export function getCommTypeList() {
  return Object.keys(commTypes).map(key => ({
    value: key,
    label: `${commTypes[key].labelCN} (${key})`,
    labelEN: commTypes[key].label
  }))
}

