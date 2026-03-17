export const btTransmissionrateConfig = {
  // 面板基本信息
  title: '平均传输速率',
  component: 'btTransmissionrateSelector',
  
  // 样式配置
  style: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    padding: '10px',
    margin: '0'
  },

  // 图表配置
  chart: {
    type: 'line',
    backgroundColor: '#ffffff',
    borderColor: '#FF6600',
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: '#FF6600'
  },

  // 数据配置（由WebSocket实时提供）
  data: {
    labels: [],
    datasets: [{
      label: '传输速率 (Mbps)',
      data: [],
      borderColor: '#FF6600',
      backgroundColor: 'rgba(255, 102, 0, 0.1)'
    }]
  },

  // Y轴配置
  yAxis: {
    min: 0,
    max: 1500,
    unit: 'Mbps',
    stepSize: 300
  },

  // 更新配置
  update: {
    interval: 2000, // 2秒更新一次
    enableAnimation: true,
    animationDuration: 300
  },

  // WebSocket配置
  websocket: {
    endpoint: 'ws://localhost:8080/connections',
    autoConnect: true,
    reconnectInterval: 5000
  }
}