/**
 * 节点名称映射工具
 * 用于在英文代码和中文显示名称之间转换
 */

// 英文代码到中文显示名称的映射表
export const nameMapping = {
  // 静态节点
  'GEO1': 'GEO卫星',
  'SGS1': '卫星地面站',
  'OCC1': '控制中心',
  'MBS1': '宏基站',
  'SMG1': '岸基mesh网关1',
  'SMG2': '岸基mesh网关2',
  
  // 海上浮标
  'BYO1': '海上浮标1',
  'BYO2': '海上浮标2',
  'BYO3': '海上浮标3',
  'BYO4': '海上浮标4',
  'BYO5': '海上浮标5',
  'BYO6': '海上浮标6',
  'BYO7': '海上浮标7',
  'BYO8': '海上浮标8',
  
  // 海上作业平台
  'IPB1': '海上作业平台1',
  'IPB2': '海上作业平台2',
  
  // 浮空基站
  'HIBS1': '浮空基站1',
  'HIBS2': '浮空基站2',
  'HIBS3': '浮空基站3',
  
  // 可移动节点
  'AUV1': '水下航行器1',
  'AUV2': '水下航行器2',
  'AUV3': '水下航行器3',
  
  'USV1': '无人艇1',
  'USV2': '无人艇2',
  'USV3': '无人艇3',
  'USV4': '无人艇4',
  'USV5': '无人艇5',
  'USV6': '无人艇6',
  'USV7': '无人艇7',
  
  'UAV1': '无人机1',
  'UAV2': '无人机2',
  'UAV3': '无人机3',
  'UAV4': '无人机4',
  'UAV5': '无人机5',
  'UAV6': '无人机6',
  'UAV7': '无人机7',
  'UAV8': '无人机8',
  'UAV9': '无人机9',
  'UAV10': '无人机10',
  'UAV11': '无人机11',
  'UAV12': '无人机12',
  'UAV13': '无人机13',
  'UAV14': '无人机14',
  'UAV15': '无人机15',
  'UAV16': '无人机16',
  'UAV17': '无人机17',
  'UAV18': '无人机18',
  
  'A-UAV1': 'A-无人机1',
  'A-UAV2': 'A-无人机2',
  'A-UAV3': 'A-无人机3',
  'A-UAV4': 'A-无人机4',
  
  'B-UAV1': 'B-无人机1',
  'B-UAV2': 'B-无人机2',
  'B-UAV3': 'B-无人机3',
  'B-UAV4': 'B-无人机4',
  
  'PV1': '导弹发射车',
  'PV2': '导弹发射车2',
  'PV3': '导弹发射车3',
  'PV4': '导弹发射车4'
}

// 中文显示名称到英文代码的反向映射表
const reverseMapping = Object.fromEntries(
  Object.entries(nameMapping).map(([key, value]) => [value, key])
)

/**
 * 将英文代码转换为中文显示名称
 * @param {string} englishCode - 英文代码（如 'UAV1'）
 * @returns {string} 中文显示名称（如 '无人机1'）
 */
export function toChineseName(englishCode) {
  return nameMapping[englishCode] || englishCode
}

/**
 * 将中文显示名称转换为英文代码
 * @param {string} chineseName - 中文显示名称（如 '无人机1'）
 * @returns {string} 英文代码（如 'UAV1'）
 */
export function toEnglishCode(chineseName) {
  return reverseMapping[chineseName] || chineseName
}

/**
 * 批量将英文代码转换为中文显示名称
 * @param {Array<string>} englishCodes - 英文代码数组
 * @returns {Array<string>} 中文显示名称数组
 */
export function toChineseNames(englishCodes) {
  return englishCodes.map(code => toChineseName(code))
}

/**
 * 批量将中文显示名称转换为英文代码
 * @param {Array<string>} chineseNames - 中文显示名称数组
 * @returns {Array<string>} 英文代码数组
 */
export function toEnglishCodes(chineseNames) {
  return chineseNames.map(name => toEnglishCode(name))
}

/**
 * 检查名称是否为英文代码
 * @param {string} name - 节点名称
 * @returns {boolean} 是否为英文代码
 */
export function isEnglishCode(name) {
  return nameMapping.hasOwnProperty(name)
}

/**
 * 检查名称是否为中文显示名称
 * @param {string} name - 节点名称
 * @returns {boolean} 是否为中文显示名称
 */
export function isChineseName(name) {
  return reverseMapping.hasOwnProperty(name)
}

