/**
 * 移动模型工具
 * 实现随机游走模型（Random Walk Mobility Model）
 */

import * as Cesium from 'cesium'
import { regionBounds, getMobilityParams } from '../config/mobility.config.js'

// 存储每个节点的移动状态
const nodeMovementState = new Map()

/**
 * 随机数生成器（指定范围）
 */
function randomInRange(min, max) {
  return min + Math.random() * (max - min)
}

/**
 * 将角度归一化到0-360度
 */
function normalizeAngle(angle) {
  while (angle < 0) angle += 360
  while (angle >= 360) angle -= 360
  return angle
}

/**
 * 初始化节点的移动状态
 */
function initNodeMovementState(node) {
  const params = getMobilityParams(node.type)
  
  return {
    lat: node.lat,
    lng: node.lng,
    alt: node.alt,
    speed: randomInRange(params.speed.min, params.speed.max),
    direction: randomInRange(0, 360), // 移动方向（度）
    lastUpdateTime: 0
  }
}

/**
 * 获取或创建节点的移动状态
 */
function getNodeState(node) {
  if (!nodeMovementState.has(node.name)) {
    nodeMovementState.set(node.name, initNodeMovementState(node))
  }
  return nodeMovementState.get(node.name)
}

/**
 * 更新节点位置（随机游走模型）
 * @param {Object} state - 节点移动状态
 * @param {Number} deltaTime - 时间增量（秒）
 * @param {String} nodeType - 节点类型
 * @returns {Object} 新的位置 {lat, lng, alt}
 */
function updatePosition(state, deltaTime, nodeType) {
  const params = getMobilityParams(nodeType)
  
  // 计算移动距离
  const distance = state.speed * deltaTime
  
  // 使用Haversine公式计算新位置
  const R = 6371000 // 地球半径（米）
  const lat1 = state.lat * Math.PI / 180
  const lng1 = state.lng * Math.PI / 180
  const bearingRad = state.direction * Math.PI / 180
  
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
  let newAlt = state.alt
  
  // 边界检测和处理
  let hitBoundary = false
  
  if (newLat < regionBounds.lat.min || newLat > regionBounds.lat.max) {
    // 碰到南北边界，反弹
    state.direction = 180 - state.direction
    newLat = Math.max(regionBounds.lat.min, Math.min(regionBounds.lat.max, newLat))
    hitBoundary = true
  }
  
  if (newLng < regionBounds.lng.min || newLng > regionBounds.lng.max) {
    // 碰到东西边界，反弹
    state.direction = -state.direction
    newLng = Math.max(regionBounds.lng.min, Math.min(regionBounds.lng.max, newLng))
    hitBoundary = true
  }
  
  // 归一化方向角
  state.direction = normalizeAngle(state.direction)
  
  // 如果没有碰到边界，有一定概率随机改变方向（模拟随机游走）
  if (!hitBoundary && Math.random() < 0.01) { // 1%概率每帧改变方向
    state.direction = randomInRange(0, 360)
    // 同时随机改变速度
    state.speed = randomInRange(params.speed.min, params.speed.max)
  }
  
  // 更新状态
  state.lat = newLat
  state.lng = newLng
  state.alt = newAlt
  
  return { lat: newLat, lng: newLng, alt: newAlt }
}

/**
 * 创建随机游走的位置回调属性
 * @param {Object} node - 节点对象
 * @returns {Cesium.CallbackProperty}
 */
export function createRandomWalkPositionProperty(node) {
  if (node.isStatic) {
    // 静态节点返回固定位置
    return new Cesium.ConstantPositionProperty(
      Cesium.Cartesian3.fromDegrees(node.lng, node.lat, node.alt)
    )
  }
  
  // 初始化节点状态
  const state = getNodeState(node)
  let lastTime = 0
  
  // 创建CallbackProperty实现实时位置更新
  return new Cesium.CallbackProperty((time) => {
    if (!time) {
      return Cesium.Cartesian3.fromDegrees(state.lng, state.lat, state.alt)
    }
    
    // 获取当前仿真时间（秒）
    const currentTime = Cesium.JulianDate.secondsDifference(time, Cesium.JulianDate.fromIso8601('2024-01-01T00:00:00Z'))
    
    // 计算时间差
    const deltaTime = Math.max(0, currentTime - lastTime)
    
    if (deltaTime > 0 && deltaTime < 10) { // 防止时间跳跃过大
      // 更新位置
      updatePosition(state, deltaTime, node.type)
      lastTime = currentTime
    } else if (lastTime === 0) {
      lastTime = currentTime
    }
    
    return Cesium.Cartesian3.fromDegrees(state.lng, state.lat, state.alt)
  }, false) // false表示位置不是常量
}

/**
 * 重置所有节点的移动状态
 */
export function resetAllNodeStates() {
  nodeMovementState.clear()
  console.log('🔄 所有节点移动状态已重置')
}

/**
 * 重置指定节点的移动状态
 */
export function resetNodeState(nodeName) {
  nodeMovementState.delete(nodeName)
}

/**
 * 获取节点当前位置
 * @param {Object} node - 节点对象
 * @returns {Object} 当前位置 {lat, lng, alt}
 */
export function getNodeCurrentPosition(node) {
  if (node.isStatic) {
    return { lat: node.lat, lng: node.lng, alt: node.alt }
  }
  
  const state = getNodeState(node)
  return { lat: state.lat, lng: state.lng, alt: state.alt }
}

// 为了保持兼容性，保留这些函数名
export function generateWaypoints() {
  return []
}

export function generateAllWaypoints() {
  return new Map()
}

export function waypointsToCartesian() {
  return []
}

export function createSampledPositionProperty() {
  return new Cesium.SampledPositionProperty()
}

export function createNodePositionProperty() {
  return new Cesium.SampledPositionProperty()
}

export function createAllPositionProperties() {
  return new Map()
}

export function updatePositionProperty() {
  // 空实现
}

export function updateNodePosition() {
  return null
}
