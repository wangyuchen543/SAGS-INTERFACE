// 统一导出所有面板配置
export { networkTrafficConfig } from './btPocketloss.config.js'
export { connectionsConfig } from './btTransmissionrate.config.js'
export { errorRateConfig } from './btDelay.config.js'

// 面板配置映射
export const panelConfigs = {
  networkTraffic: () => import('./btPocketloss.config.js').then(m => m.networkTrafficConfig),
  connections: () => import('./btTransmissionrate.config.js').then(m => m.connectionsConfig),
  errorRate: () => import('./btDelay.config.js').then(m => m.errorRateConfig)
}

// 获取面板配置的工具函数
export const getPanelConfig = async (panelId) => {
  const configLoader = panelConfigs[panelId]
  if (configLoader) {
    return await configLoader()
  }
  throw new Error(`Panel config not found for: ${panelId}`)
}

// 获取所有面板配置
export const getAllPanelConfigs = async () => {
  const configs = {}
  for (const [panelId, configLoader] of Object.entries(panelConfigs)) {
    configs[panelId] = await configLoader()
  }
  return configs
}