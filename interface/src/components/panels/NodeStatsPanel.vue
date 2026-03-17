<template>
  <div class="node-stats-panel">
    <h4 class="panel-title">节点信息</h4>
    <div class="stats-content">
      <table class="stats-table">
        <thead>
          <tr>
            <th>节点类型</th>
            <th>数量</th>
            <th>在线量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in nodeStats" :key="item.type">
            <td>{{ item.type }}</td>
            <td>{{ item.total }}</td>
            <td>{{ item.online }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { nodeTypes } from '../../config/nodes.config.js'

// 定义 props 接收节点数据
const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  }
})

// 计算节点统计信息
const nodeStats = computed(() => {
  const stats = {}
  
  // 初始化所有节点类型统计
  Object.keys(nodeTypes).forEach(type => {
    stats[type] = {
      type: nodeTypes[type].labelCN,
      total: 0,
      online: 0
    }
  })
  
  // 统计实际节点数量
  props.nodes.forEach(node => {
    if (stats[node.type]) {
      stats[node.type].total++
      stats[node.type].online++ // 假设所有节点都在线
    }
  })
  
  // 过滤掉数量为0的节点类型
  return Object.values(stats).filter(item => item.total > 0)
})
</script>

<style scoped>
.node-stats-panel {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(13, 27, 42, 0.95) 100%);
  border: 2px solid rgba(255, 92, 133, 0.3);
  border-radius: 12px;
  padding: 12px;
  margin: 5px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 20px rgba(255, 92, 133, 0.2),
    inset 0 0 15px rgba(255, 92, 133, 0.05);
}

.node-stats-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff5c85 0%, #ff4081 50%, #ff5c85 100%);
  border-radius: 12px 12px 0 0;
  z-index: 1;
}

.panel-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #ff5c85;
  text-shadow: 0 0 10px rgba(255, 92, 133, 0.6);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
}

.stats-content {
  height: 200px;
  overflow-y: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  background: rgba(0, 20, 40, 0.4);
  border-radius: 8px;
  overflow: hidden;
}

.stats-table th,
.stats-table td {
  padding: 8px 10px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 92, 133, 0.2);
  color: #ffffff;
}

.stats-table th {
  background: linear-gradient(135deg, #ff5c85 0%, #ff4081 100%);
  font-weight: 600;
  font-size: 11px;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(255, 92, 133, 0.8);
}

.stats-table td {
  font-size: 11px;
  color: #e0e0e0;
}

.stats-table tr:hover {
  background: rgba(255, 92, 133, 0.1);
}
</style> 