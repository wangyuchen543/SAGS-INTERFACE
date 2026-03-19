/**
 * 移动模型配置
 */

// 舟山海域边界配置
export const regionBounds = {
  lat: { min: 29.5, max: 31.8 },
  lng: { min: 122.2, max: 123.5 },
  // 不同类型节点的高度范围
  altRanges: {
    AUV: { min: -100, max: -20 },     // 水下航行器
    USV: { min: 0, max: 5 },          // 无人艇
    UAV: { min: 100, max: 500 },      // 无人机
    'A-UAV': { min: 400, max: 800 },   // 高级无人机
    'B-UAV': { min: 500, max: 900 },   // 战斗无人机
    PV: { min: 0, max: 0 }            // 巡逻车（地面）
  }
}

// 移动模型参数配置
export const mobilityParams = {
  // RandomWaypoint移动模型参数
  Waypoint: {
    AUV: {
      speed: { min: 50, max: 150 },          // 速度范围 m/s (提升10倍)
      pauseTime: { min: 5, max: 5 },         // 停留时间 秒
      waypointInterval: 60,                   // 航点间隔时间 秒
      minWaypointDistance: 500,               // 最小航点距离 米
      maxWaypointDistance: 3000               // 最大航点距离 米
    },
    USV: {
      speed: { min: 80, max: 200 },          // 速度范围 m/s (提升10倍)
      pauseTime: { min: 5, max: 5 },         // 停留时间 秒
      waypointInterval: 45,
      minWaypointDistance: 800,
      maxWaypointDistance: 5000
    },
    UAV: {
      speed: { min: 2500, max: 3000 },       // 速度范围 m/s (提升100倍)
      pauseTime: { min: 5, max: 5 },         // 停留时间 秒
      waypointInterval: 30,
      minWaypointDistance: 10000,
      maxWaypointDistance: 80000
    },
    'A-UAV': {
      speed: { min: 200, max: 400 },         // 速度范围 m/s (提升10倍)
      pauseTime: { min: 5, max: 5 },         // 停留时间 秒
      waypointInterval: 25,
      minWaypointDistance: 1200,
      maxWaypointDistance: 10000
    },
    'B-UAV': {
      speed: { min: 250, max: 500 },         // 速度范围 m/s (提升10倍)
      pauseTime: { min: 5, max: 5 },         // 停留时间 秒
      waypointInterval: 20,
      minWaypointDistance: 1500,
      maxWaypointDistance: 12000
    },
    PV: {
      speed: { min: 100, max: 250 },         // 速度范围 m/s (提升10倍)
      pauseTime: { min: 5, max: 5 },         // 停留时间 秒
      waypointInterval: 40,
      minWaypointDistance: 500,
      maxWaypointDistance: 3000
    }
  }
}

/**
 * 获取节点类型的移动参数
 */
export function getMobilityParams(nodeType) {
  return mobilityParams.Waypoint[nodeType] || mobilityParams.Waypoint.USV
}

/**
 * 获取节点类型的高度范围
 */
export function getAltitudeRange(nodeType) {
  return regionBounds.altRanges[nodeType] || { min: 0, max: 100 }
}

