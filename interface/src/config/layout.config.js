// 导入底部面板配置
import { btThroughputConfig } from './panels/btThroughput.config.js'
import { btPocketlossConfig } from './panels/btPocketloss.config.js'
import { btDelayConfig } from './panels/btDelay.config.js'
import { btTransmissionrateConfig } from './panels/btTransmissionrate.config.js'


export const layoutConfig = {
  // 主题配置
  theme: {
    primaryColor: '#4472C4',
    secondaryColor: '#70AD47',
    warningColor: '#FFC000',
    dangerColor: '#C5504B',
    backgroundColor: '#f0f0f0',
    panelBackground: '#ffffff',
    borderColor: '#cccccc',
    textColor: '#333333'
  },

  // 布局配置
  layout: {
    headerHeight: '30px',
    controlBarHeight: '50px',
    leftPanelWidth: '16.66%',
    rightPanelWidth: '16.66%',
    bottomPanelWidth: '16.66%',
    bottomPanelHeight: '20%',
    gap: '10px'
  },

  // 响应式配置
  responsive: {
    breakpoints: {
      desktop: 1200,
      tablet: 768,
      mobile: 480
    },
    panelSizes: {
      desktop: {
        leftPanel: '16.66%',
        rightPanel: '16.66%',
        bottomPanel: '20%'
      },
      tablet: {
        leftPanel: '20%',
        rightPanel: '20%',
        bottomPanel: '25%'
      },
      mobile: {
        leftPanel: '100%',
        rightPanel: '100%',
        bottomPanel: '30%'
      }
    }
  },

  // 面板配置（优化高度分配，消除空白）
  panels: {
    left: [
      { id: 'simulationInfo', component: 'SimulationInfoPanel', height: '22%' },
      { id: 'nodeManager', component: 'NodeManager', height: '58%' },
      { id: 'hitRate', component: 'HitRatePanel', height: '20%' }
    ],
    right: [
      { id: 'networkTopology', component: 'NetworkTopologyPanel', height: '25%' },
      { id: 'nodeAdjacency', component: 'NodeAdjacencyPanel', height: '25%' },
      { id: 'nodeStats', component: 'NodeStatsPanel', height: '30%' },
      { id: 'message', component: 'MessagePanel', height: '20%' }
    ],
    bottom: [
      { 
        id: 'throughput', 
        component: 'BusinessChart',
        config: { 
          title: '网络吞吐量',
          metricType: 'throughput',
          showBusinessSelector: false
        }
      },
      { 
        id: 'packetLoss', 
        component: 'BusinessChart',
        config: { 
          title: '时延',
          metricType: 'delay',
          showBusinessSelector: false
        }
      },
      { 
        id: 'transmissionRate', 
        component: 'BusinessChart',
        config: { 
          title: '丢包率',
          metricType: 'packetLoss',
          showBusinessSelector: false
        }
      },
      { 
        id: 'delay', 
        component: 'BusinessChart',
        config: { 
          title: '平均传输速率',
          metricType: 'transmissionRate',
          showBusinessSelector: false
        }
      },
      { 
        id: 'businessThroughput', 
        component: 'BusinessChart',
        config: { 
          title: '业务吞吐量',
          metricType: 'throughput'
        }
      },
      { 
        id: 'businessDelay', 
        component: 'BusinessChart',
        config: { 
          title: '业务时延',
          metricType: 'delay'
        }
      },
      { 
        id: 'businessPacketLoss', 
        component: 'BusinessChart',
        config: { 
          title: '业务丢包率',
          metricType: 'packetLoss'
        }
      },
      { 
        id: 'businessBandwidth', 
        component: 'BusinessChart',
        config: { 
          title: '业务传输速率',
          metricType: 'transmissionRate'
        }
      }
    ]
  }
}