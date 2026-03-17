export const btThroughputConfig = {
  // 面板基本信息
  title: '网络吞吐量',
  component: 'BtThroughputConfig',
  
  // 样式配置
  style: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    padding: '0',
    margin: '0'
  },

  // 业务类型配置
  businessTypes: {
    typeA: {
      name: '类型 A',
      priority: '高',
      color: '#2d8f2d',
      backgroundColor: '#e8f5e8'
    },
    typeB: {
      name: '类型 B',
      priority: '中',
      color: '#4472C4',
      backgroundColor: '#e8f0ff'
    },
    typeC: {
      name: '类型 C',
      priority: '最高',
      color: '#ff8c00',
      backgroundColor: '#fff2e8'
    },
    typeD: {
      name: '类型 D',
      priority: '中',
      color: '#7030A0',
      backgroundColor: '#f0e8ff'
    }
  },

  // 默认选中类型
  defaultType: 'typeA',

  // 统计数据配置
  statistics: {
    typeA: { count: 1245, rate: 98.5 },
    typeB: { count: 856, rate: 95.2 },
    typeC: { count: 2341, rate: 99.1 },
    typeD: { count: 3567, rate: 97.8 }
  },

  // 更新配置
  update: {
    interval: 3000, // 3秒更新一次
    enableAnimation: true,
    animationDuration: 300
  },

  // WebSocket配置
  websocket: {
    endpoint: 'ws://localhost:8080/businesstype',
    autoConnect: true,
    reconnectInterval: 5000
  }
}