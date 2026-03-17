export const btDelayConfig = {
  // 面板基本信息
  title: '时延',
  component: 'btDelaySelector',
  
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
    borderColor: '#E74C3C',
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: '#E74C3C'
  },

  // 数据配置（由WebSocket实时提供）
  data: {
    labels: [],
    datasets: [{
      label: '时延 (ms)',
      data: [],
      borderColor: '#E74C3C',
      backgroundColor: 'rgba(231, 76, 60, 0.1)'
    }]
  },

  // Y轴配置
  yAxis: {
    min: 0,
    max: 100,
    unit: 'ms',
    stepSize: 20
  },

  // 更新配置
  update: {
    interval: 2000, // 2秒更新一次
    enableAnimation: true,
    animationDuration: 300
  },

  // WebSocket配置
  websocket: {
    endpoint: 'ws://localhost:8080/errorrate',
    autoConnect: true,
    reconnectInterval: 5000
  }
}