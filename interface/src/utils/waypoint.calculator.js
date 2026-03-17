/**
 * 航点计算工具
 * 实现三维随机游走模型（Random Waypoint Mobility Model）
 */

import * as Cesium from 'cesium'
import { regionBounds, getMobilityParams, getAltitudeRange } from '../config/mobility.config.js'

/**
 * 随机数生成器（指定范围）
 */
function randomInRange(min, max) {
  return min + Math.random() * (max - min)
}

/**
 * 生成随机三维坐标（经纬高）
 */
function generateRandomPosition(nodeType, currentLat, currentLng, currentAlt, params) {
  const altRange = getAltitudeRange(nodeType)
  
  // 计算新位置（基于当前位置和距离范围）
  const distance = randomInRange(params.minWaypointDistance, params.maxWaypointDistance)
  const bearing = randomInRange(0, 360) // 随机方向角度
  
  // 使用Haversine公式计算新的经纬度
  const R = 6371000 // 地球半径（米）
  const lat1 = currentLat * Math.PI / 180
  const lng1 = currentLng * Math.PI / 180
  const bearingRad = bearing * Math.PI / 180
  
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
    Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearingRad)
  )
  
  const lng2 = lng1 + Math.atan2(
    Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(lat1),
    Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
  )
  
  let newLat = lat2 * 180 / Math.PI
  let newLng = lng2 * 180 / Math.PI
  
  // 确保在区域边界内
  newLat = Math.max(regionBounds.lat.min, Math.min(regionBounds.lat.max, newLat))
  newLng = Math.max(regionBounds.lng.min, Math.min(regionBounds.lng.max, newLng))
  
  // 随机高度（根据节点类型设置不同的变化幅度）
  let altChangeRange = 20  // 默认±20米
  if (nodeType === 'UAV') {
    altChangeRange = 100  // 无人机±100米（变化更大）
  } else if (nodeType === 'AUV') {
    altChangeRange = 15  // 水下航行器±15米
  }
  
  let newAlt = currentAlt + randomInRange(-altChangeRange, altChangeRange)
  newAlt = Math.max(altRange.min, Math.min(altRange.max, newAlt))
  
  return { lat: newLat, lng: newLng, alt: newAlt }
}

/**
 * 计算两点间的距离（米）
 */
function calculateDistance(lat1, lng1, alt1, lat2, lng2, alt2) {
  const R = 6371000 // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const horizontalDist = R * c
  const verticalDist = alt2 - alt1
  
  return Math.sqrt(horizontalDist * horizontalDist + verticalDist * verticalDist)
}

/**
 * 为单个节点生成航点序列
 * @param {Object} node - 节点对象
 * @param {Number} currentTime - 当前仿真时间（秒）
 * @param {Number} duration - 生成航点的总时长（秒）
 * @returns {Array} 航点数组 [{lat, lng, alt, time}, ...]
 */
export function generateWaypoints(node, currentTime, duration = 300) {
  if (node.isStatic || node.mobilityModel !== 'Waypoint') {
    // 静态节点返回单个航点
    return [{
      lat: node.lat,
      lng: node.lng,
      alt: node.alt,
      time: currentTime
    }]
  }
  
  const params = getMobilityParams(node.type)
  const waypoints = []
  const MAX_WAYPOINTS = 20  // 最大航点数量限制（防止XML过大）
  
  let currentLat = node.lat
  let currentLng = node.lng
  let currentAlt = node.alt
  let time = currentTime
  
  // 添加起始点
  waypoints.push({
    lat: currentLat,
    lng: currentLng,
    alt: currentAlt,
    time: time
  })
  
  // 生成航点直到达到持续时间或达到最大数量
  while (time < currentTime + duration && waypoints.length < MAX_WAYPOINTS) {
    // 生成下一个随机航点
    const nextPos = generateRandomPosition(node.type, currentLat, currentLng, currentAlt, params)
    
    // 计算到达该航点所需时间
    const distance = calculateDistance(
      currentLat, currentLng, currentAlt,
      nextPos.lat, nextPos.lng, nextPos.alt
    )
    const speed = randomInRange(params.speed.min, params.speed.max)
    const travelTime = distance / speed
    
    // 添加航点
    time += travelTime
    if (time > currentTime + duration) {
      break // 超出时长限制
    }
    
    waypoints.push({
      lat: nextPos.lat,
      lng: nextPos.lng,
      alt: nextPos.alt,
      time: time
    })
    
    // 添加停留时间
    const pauseTime = randomInRange(params.pauseTime.min, params.pauseTime.max)
    time += pauseTime
    
    // 停留期间位置不变
    if (time < currentTime + duration) {
      waypoints.push({
        lat: nextPos.lat,
        lng: nextPos.lng,
        alt: nextPos.alt,
        time: time
      })
    }
    
    // 更新当前位置
    currentLat = nextPos.lat
    currentLng = nextPos.lng
    currentAlt = nextPos.alt
  }
  
  return waypoints
}

/**
 * 将航点转换为Cesium的笛卡尔坐标
 * @param {Array} waypoints - 航点数组（经纬高格式）
 * @returns {Array} 笛卡尔坐标数组
 */
export function waypointsToCartesian(waypoints) {
  return waypoints.map(wp => ({
    position: Cesium.Cartesian3.fromDegrees(wp.lng, wp.lat, wp.alt),
    time: wp.time,
    lat: wp.lat,
    lng: wp.lng,
    alt: wp.alt
  }))
}

/**
 * 为所有可移动节点生成航点
 * @param {Array} nodes - 节点数组
 * @param {Number} currentTime - 当前仿真时间（秒）
 * @param {Number} duration - 航点持续时长（秒）
 * @returns {Map} 节点名称 -> 航点数组的映射
 */
export function generateAllWaypoints(nodes, currentTime, duration = 300) {
  const waypointsMap = new Map()
  
  nodes.forEach(node => {
    const waypoints = generateWaypoints(node, currentTime, duration)
    waypointsMap.set(node.name, waypoints)
  })
  
  return waypointsMap
}

/**
 * 创建Cesium的SampledPositionProperty
 * @param {Array} waypoints - 航点数组（笛卡尔坐标）
 * @param {Number} startTime - 仿真开始的JulianDate
 * @returns {Cesium.SampledPositionProperty}
 */
export function createSampledPositionProperty(waypoints, startTime) {
  const positionProperty = new Cesium.SampledPositionProperty()
  positionProperty.setInterpolationOptions({
    interpolationDegree: 1,
    interpolationAlgorithm: Cesium.LinearApproximation
  })
  
  if (!waypoints || waypoints.length === 0) {
    console.warn('⚠️ 航点数组为空，无法创建位置属性')
    return positionProperty
  }
  
  waypoints.forEach(wp => {
    const time = Cesium.JulianDate.addSeconds(startTime, wp.time, new Cesium.JulianDate())
    positionProperty.addSample(time, wp.position)
  })
  
  // ✅ 关键修复：在最后一个航点之后添加一个延长的航点
  // 这样即使时钟超过原定范围，节点也会停留在最后位置，而不是消失
  const lastWaypoint = waypoints[waypoints.length - 1]
  if (lastWaypoint) {
    // 添加一个延长到很远未来的航点（保持最后一个位置）
    const extendedTime = Cesium.JulianDate.addSeconds(
      startTime, 
      lastWaypoint.time + 86400, // 延长24小时
      new Cesium.JulianDate()
    )
    positionProperty.addSample(extendedTime, lastWaypoint.position)
  }
  
  return positionProperty
}

