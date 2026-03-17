export const btPocketlossConfig = {
  // 面板基本信息
  title: '丢包率',
  component: 'NetworkTrafficSelector',
  
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
    borderColor: '#00B050',
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: '#00B050'
  },

  // 数据配置（由WebSocket实时提供）
  data: {
    labels: [],
    datasets: [{
      label: '丢包率 (%)',
      data: [],
      borderColor: '#00B050',
      backgroundColor: 'rgba(0, 176, 80, 0.1)'
    }]
  },

  // Y轴配置
  yAxis: {
    min: 0,
    max: 10,
    unit: '%',
    stepSize: 2
  },

  // 更新配置
  update: {
    interval: 2000, // 2秒更新一次
    enableAnimation: true,
    animationDuration: 300
  },

  // WebSocket配置
  websocket: {
    endpoint: 'ws://localhost:8080/traffic',
    autoConnect: true,
    reconnectInterval: 5000
  }
}