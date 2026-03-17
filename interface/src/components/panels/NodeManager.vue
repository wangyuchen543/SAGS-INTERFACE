<template>
  <div class="node-manager-panel glass-panel" :style="panelStyle">
    <div class="panel-header">
      <h4 class="panel-title neon-text">节点管理</h4>
      <div class="header-actions">
        <el-button 
          type="primary" 
          size="small" 
          :icon="Refresh"
          @click="loadNodesFromServer"
          :loading="loading"
        >
          刷新
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          :icon="Plus"
          @click="handleAddNode"
        >
          新增节点
        </el-button>
      </div>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索节点名称"
        :prefix-icon="Search"
        size="small"
        clearable
        class="search-input"
      />
      <div class="filter-buttons">
        <el-button 
          size="small" 
          :type="filterType === 'all' ? 'primary' : ''"
          @click="filterType = 'all'"
        >
          全部
        </el-button>
        <el-button 
          size="small" 
          :type="filterType === '4G/5G' ? 'primary' : ''"
          @click="filterType = '4G/5G'"
        >
          4G/5G
        </el-button>
        <el-button 
          size="small" 
          :type="filterType === 'Satellite' ? 'primary' : ''"
          @click="filterType = 'Satellite'"
        >
          卫星
        </el-button>
        <el-button 
          size="small" 
          :type="filterType === 'Mesh' ? 'primary' : ''"
          @click="filterType = 'Mesh'"
        >
          Mesh
        </el-button>
        <el-button 
          size="small" 
          :type="filterType === 'Underwater' ? 'primary' : ''"
          @click="filterType = 'Underwater'"
        >
          水声
        </el-button>
      </div>
    </div>
    
    <div class="node-list">
      <el-scrollbar height="100%">
        <div 
          v-for="node in filteredNodes" 
          :key="node.name" 
          class="node-item"
          @click="selectNode(node)"
          :class="{ 'active': selectedNode?.name === node.name }"
        >
          <div class="node-info">
            <div class="node-name">{{ toChineseName(node.name) }}</div>
            <div class="node-type">{{ getNodeTypeName(node.type) }}</div>
            <div class="node-comms">
              <el-tag 
                v-for="comm in node.comms" 
                :key="comm"
                size="small"
                :color="getCommColor(comm)"
                class="comm-tag"
              >
                {{ comm }}
              </el-tag>
            </div>
          </div>
          <div class="node-actions">
            <el-button 
              type="primary" 
              size="small" 
              :icon="Edit"
              @click.stop="editNode(node)"
              circle
            />
            <el-button 
              type="danger" 
              size="small" 
              :icon="Delete"
              @click.stop="deleteNode(node)"
              circle
            />
          </div>
        </div>
        
        <el-empty v-if="filteredNodes.length === 0" description="暂无符合条件的节点" />
      </el-scrollbar>
    </div>
    
    <!-- 新增/编辑节点对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="editingNode ? '编辑节点 - ' + editingNode.name : '新增节点'"
      width="600px"
      :close-on-click-modal="false"
      center
      append-to-body
      destroy-on-close
    >
      <el-form :model="nodeForm" label-width="120px" size="default" ref="nodeFormRef">
        <el-form-item label="节点名称">
          <el-input 
            v-model="nodeForm.name" 
            placeholder="请输入节点名称（编辑时不可修改）"
            :disabled="!!editingNode"
          />
        </el-form-item>
        
        <el-form-item label="节点类型">
          <!-- 编辑模式：显示为不可编辑的文本框 -->
          <el-input 
            v-if="editingNode"
            :value="getNodeTypeLabel(nodeForm.type)"
            :disabled="true"
            placeholder="节点类型（编辑时不可修改）"
          />
          <!-- 新增模式：显示为下拉选择框 -->
          <el-select 
            v-else
            v-model="nodeForm.type" 
            placeholder="请选择节点类型"
            @change="onNodeTypeChange"
            style="width: 100%"
          >
            <el-option
              v-for="type in nodeTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="经度">
          <el-input-number 
            v-model="nodeForm.lng" 
            :min="122.0" 
            :max="124.0"
            :precision="6"
            :step="0.001"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="纬度">
          <el-input-number 
            v-model="nodeForm.lat" 
            :min="29.0" 
            :max="32.0"
            :precision="6"
            :step="0.001"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="高度(米)">
          <el-input-number 
            v-model="nodeForm.alt" 
            :min="-100" 
            :max="25000000"
            :precision="1"
            controls-position="right"
            style="width: 100%"
          />
          <span style="font-size: 12px; color: #909399; margin-left: 10px;">
            负值为水下，0为地面/海面
          </span>
        </el-form-item>
        
        <el-form-item label="通信方式">
          <el-checkbox-group v-model="nodeForm.comms">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <el-checkbox
                v-for="comm in availableComms"
                :key="comm"
                :label="comm"
                :disabled="!isCommAvailable(comm)"
              >
                {{ getCommLabel(comm) }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="设备选择">
          <el-checkbox-group v-model="nodeForm.devices">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <el-checkbox
                v-for="device in deviceOptions"
                :key="device.value"
                :label="device.value"
              >
                {{ device.label }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer-content">
          <div class="footer-buttons">
            <el-button size="large" @click="showAddDialog = false" style="min-width: 100px;">
              关闭
            </el-button>
            <el-button size="large" type="primary" @click="saveNode" style="min-width: 100px;">
              {{ editingNode ? '💾 保存修改' : '➕ 新增节点' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Refresh, Search } from '@element-plus/icons-vue'
import { getInitialNodes } from '../../config/nodes.data.js'
import { nodeTypes, commTypes, getNodeTypeList, getAvailableComms } from '../../config/nodes.config.js'
import { toChineseName } from '../../utils/node.name.mapper.js'

// 定义 emits
const emit = defineEmits(['nodes-update', 'node-select'])

// 响应式数据
const nodes = ref([])
const selectedNode = ref(null)
const showAddDialog = ref(false)
const editingNode = ref(null)
const loading = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const filterType = ref('all')

const nodeTypeList = ref(getNodeTypeList())
const allCommTypes = ref(Object.keys(commTypes))

// 过滤后的节点列表
const filteredNodes = computed(() => {
  let result = nodes.value
  
  // 按通信方式筛选
  if (filterType.value !== 'all') {
    result = result.filter(node => {
      if (!node.comms) return false
      
      // 如果筛选4G/5G，需要匹配 '4G/5G'、'4G' 或 '5G'
      if (filterType.value === '4G/5G') {
        return node.comms.includes('4G/5G') || 
               node.comms.includes('4G') || 
               node.comms.includes('5G')
      }
      
      // 其他通信方式直接匹配
      return node.comms.includes(filterType.value)
    })
  }
  
  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(node => 
      node.name.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 设备选项
const deviceOptions = [
  { label: '低空探测雷达', value: '低空探测雷达' },
  { label: '光电探测设备', value: '光电探测设备' },
  { label: '无线电探测设备', value: '无线电探测设备' },
  { label: '无线电反制设备', value: '无线电反制设备' },
  { label: '空中靶机', value: '空中靶机' }
]

// 节点表单
const nodeForm = ref({
  name: '',
  type: '',
  lat: 29.85,
  lng: 122.8,
  alt: 0,
  comms: [],
  devices: []
})

// 面板样式
const panelStyle = computed(() => ({
  padding: '15px',
  margin: '5px',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}))

// 可用通信方式
const availableComms = computed(() => {
  if (!nodeForm.value.type) return []
  return getAvailableComms(nodeForm.value.type)
})

// 获取节点类型名称
const getNodeTypeName = (type) => {
  return nodeTypes[type]?.labelCN || type
}

// 获取节点类型标签（用于编辑模式显示）
const getNodeTypeLabel = (type) => {
  if (!type) return ''
  const typeOption = nodeTypeList.value.find(t => t.value === type)
  return typeOption ? typeOption.label : (nodeTypes[type]?.labelCN || type)
}

// 获取通信方式颜色
const getCommColor = (comm) => {
  // 4G/5G 标签使用浅蓝色
  if (comm === '4G/5G') {
    return '#66B3FF'  // 浅蓝色
  }
  return commTypes[comm]?.color || '#888888'
}

// 获取通信方式标签
const getCommLabel = (comm) => {
  return commTypes[comm]?.labelCN || comm
}

// 检查通信方式是否可用
const isCommAvailable = (comm) => {
  return availableComms.value.includes(comm)
}

// 节点类型改变时
const onNodeTypeChange = () => {
  // 清除不可用的通信方式
  nodeForm.value.comms = nodeForm.value.comms.filter(comm => 
    availableComms.value.includes(comm)
  )
  
  // 设置默认高度
  if (nodeTypes[nodeForm.value.type]) {
    nodeForm.value.alt = nodeTypes[nodeForm.value.type].defaultAlt
  }
}

// 从配置加载节点
const loadNodesFromServer = async () => {
  loading.value = true
  try {
    // 从配置文件加载初始节点数据
    nodes.value = getInitialNodes()
    
    // 通知父组件更新
    emit('nodes-update', nodes.value)
    
    ElMessage.success(`节点数据已加载（共 ${nodes.value.length} 个节点）`)
  } catch (error) {
    console.error('加载节点失败:', error)
    ElMessage.error('加载节点失败')
    
    // 如果加载失败，使用空数组
    nodes.value = []
    emit('nodes-update', nodes.value)
  } finally {
    loading.value = false
  }
}


// 选择节点
const selectNode = (node) => {
  selectedNode.value = node
  emit('node-select', node)
}

// 新增节点
const handleAddNode = () => {
  editingNode.value = null
  resetForm()
  showAddDialog.value = true
}

// 编辑节点
const editNode = (node) => {
  editingNode.value = node
  // 如果节点没有设备选择或设备数组为空，默认选择前两个设备
  const defaultDevices = deviceOptions.slice(0, 2).map(d => d.value) // 前两个设备：低空探测雷达、光电探测设备
  const nodeDevices = node.devices && node.devices.length > 0 ? node.devices : defaultDevices
  nodeForm.value = { 
    ...node,
    devices: nodeDevices
  }
  showAddDialog.value = true
}

// 删除节点
const deleteNode = (node) => {
  ElMessageBox.confirm(
    `确定删除节点 "${node.name}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = nodes.value.findIndex(n => n.name === node.name)
    if (index > -1) {
      nodes.value.splice(index, 1)
      ElMessage.success('节点已删除')
      emit('nodes-update', nodes.value)
    }
  }).catch(() => {
    // 用户取消
  })
}

// 保存节点
const saveNode = () => {
  // 验证表单
  if (!nodeForm.value.name) {
    ElMessage.warning('请输入节点名称')
    return
  }
  if (!nodeForm.value.type) {
    ElMessage.warning('请选择节点类型')
    return
  }
  if (!nodeForm.value.lng || !nodeForm.value.lat) {
    ElMessage.warning('请输入有效的经纬度')
    return
  }
  if (nodeForm.value.comms.length === 0) {
    ElMessage.warning('请至少选择一种通信方式')
    return
  }
  
  if (editingNode.value) {
    // 编辑模式
    const index = nodes.value.findIndex(n => n.name === editingNode.value.name)
    if (index > -1) {
      nodes.value[index] = { ...nodeForm.value }
      ElMessage.success({
        message: `节点 ${nodeForm.value.name} 已更新`,
        type: 'success',
        duration: 2000
      })
    }
  } else {
    // 新增模式 - 检查名称是否重复
    const existingNode = nodes.value.find(n => n.name === nodeForm.value.name)
    if (existingNode) {
      ElMessage.warning(`节点名称 ${nodeForm.value.name} 已存在，请使用其他名称`)
      return
    }
    
    const newNode = { ...nodeForm.value }
    nodes.value.push(newNode)
    ElMessage.success({
      message: `节点 ${newNode.name} 已添加`,
      type: 'success',
      duration: 2000
    })
  }
  
  emit('nodes-update', nodes.value)
  showAddDialog.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  editingNode.value = null
  nodeForm.value = {
    name: '',
    type: '',
    lat: 29.85,
    lng: 122.8,
    alt: 0,
    comms: [],
    devices: []
  }
}

// 生命周期
onMounted(() => {
  loadNodesFromServer()
})

// 暴露方法供父组件调用
defineExpose({
  loadNodesFromServer,
  getNodes: () => nodes.value
})
</script>

<style scoped>

.node-manager-panel {
  position: relative;
  overflow: hidden;
}

.node-manager-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-cyan);
  border-radius: 16px 16px 0 0;
  z-index: 2;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  position: relative;
  z-index: 3;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 搜索筛选区域 */
.search-filter-section {
  margin-bottom: 12px;
  position: relative;
  z-index: 3;
}

.search-input {
  margin-bottom: 8px;
}

.search-input :deep(.el-input__wrapper) {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 234, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.1);
}

.search-input :deep(.el-input__inner) {
  color: #00eaff;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: rgba(0, 234, 255, 0.5);
}

.filter-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-buttons :deep(.el-button) {
  flex: 1;
  min-width: 60px;
  font-size: 11px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 234, 255, 0.3);
  color: #00eaff;
  transition: all 0.3s ease;
}

.filter-buttons :deep(.el-button:hover) {
  background: rgba(0, 234, 255, 0.2);
  border-color: rgba(0, 234, 255, 0.6);
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.4);
}

.filter-buttons :deep(.el-button--primary) {
  background: rgba(0, 234, 255, 0.3);
  border-color: rgba(0, 234, 255, 0.6);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.5);
}

.node-list {
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 3;
}

.node-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 102, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.node-item:hover {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(0, 102, 255, 0.4);
  transform: translateX(5px);
}

.node-item.active {
  background: rgba(0, 102, 255, 0.2);
  border-color: rgba(0, 102, 255, 0.6);
}

.node-info {
  flex: 1;
}

.node-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--neon-cyan);
  margin-bottom: 4px;
}

.node-type {
  font-size: 12px;
  color: #b3d9ff;
  margin-bottom: 6px;
}

.node-comms {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.comm-tag {
  font-size: 10px;
  border: none;
}

.node-actions {
  display: flex;
  gap: 6px;
}

/* Element Plus 覆盖 */
:deep(.el-button--small) {
  padding: 6px 12px;
}

:deep(.el-checkbox) {
  margin-right: 20px;
  margin-bottom: 10px;
}

:deep(.el-scrollbar__view) {
  padding-right: 10px;
}

/* 弹窗底部样式 */
.dialog-footer-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-hint {
  text-align: center;
  padding: 10px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 6px;
  border: 1px dashed #409eff;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 弹窗样式覆盖 */
:deep(.el-dialog) {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.98) 0%, rgba(13, 27, 42, 0.98) 100%) !important;
  border: 2px solid rgba(0, 234, 255, 0.3) !important;
  border-radius: 12px !important;
  box-shadow: 
    0 0 30px rgba(0, 234, 255, 0.3),
    inset 0 0 20px rgba(0, 234, 255, 0.05) !important;
}

:deep(.el-dialog__header) {
  background: linear-gradient(90deg, rgba(0, 234, 255, 0.1) 0%, rgba(0, 128, 255, 0.1) 100%) !important;
  border-bottom: 2px solid rgba(0, 234, 255, 0.3) !important;
  padding: 20px 24px !important;
  border-radius: 12px 12px 0 0 !important;
}

:deep(.el-dialog__title) {
  color: #00eaff !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.6) !important;
  letter-spacing: 1px !important;
}

:deep(.el-dialog__headerbtn) {
  top: 20px !important;
  right: 24px !important;
}

:deep(.el-dialog__close) {
  color: #00eaff !important;
  font-size: 20px !important;
}

:deep(.el-dialog__close:hover) {
  color: #ffffff !important;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.8) !important;
}

:deep(.el-dialog__body) {
  padding: 24px !important;
  background: transparent !important;
  color: #ffffff !important;
}

/* 表单项标签颜色 */
:deep(.el-form-item__label) {
  color: #00eaff !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  text-shadow: 0 0 5px rgba(0, 234, 255, 0.4) !important;
}

/* 输入框样式 */
:deep(.el-input__wrapper) {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.1) !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 234, 255, 0.5) !important;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.2) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #00eaff !important;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.4) !important;
}

:deep(.el-input__inner) {
  color: #ffffff !important;
  background: transparent !important;
  font-size: 14px !important;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* 下拉选择框样式 */
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.1) !important;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: rgba(0, 234, 255, 0.5) !important;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.2) !important;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #00eaff !important;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.4) !important;
}

:deep(.el-select .el-input__inner) {
  color: #ffffff !important;
  background: transparent !important;
  font-size: 14px !important;
}

:deep(.el-select .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* 下拉框选择后的文字颜色 */
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  border-color: #00eaff !important;
}

/* 下拉选项面板样式 */
:deep(.el-select-dropdown) {
  background: rgba(10, 22, 40, 0.98) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.3) !important;
}

:deep(.el-select-dropdown__item) {
  color: rgba(255, 255, 255, 0.9) !important;
  background: transparent !important;
  font-size: 14px !important;
}

:deep(.el-select-dropdown__item:hover) {
  background: rgba(0, 234, 255, 0.2) !important;
  color: #00eaff !important;
}

:deep(.el-select-dropdown__item.is-selected) {
  background: rgba(0, 234, 255, 0.3) !important;
  color: #00eaff !important;
  font-weight: 600 !important;
}

/* 数字输入框样式 */
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
}

:deep(.el-input-number .el-input__inner) {
  color: #ffffff !important;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: rgba(0, 0, 0, 0.3) !important;
  border-left: 1px solid rgba(0, 234, 255, 0.3) !important;
  color: #00eaff !important;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  background: rgba(0, 234, 255, 0.2) !important;
  color: #ffffff !important;
}

/* 复选框样式 */
:deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 14px !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #00eaff !important;
  border-color: #00eaff !important;
  box-shadow: 0 0 8px rgba(0, 234, 255, 0.4) !important;
}

:deep(.el-checkbox__inner) {
  border-color: rgba(0, 234, 255, 0.5) !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
}

:deep(.el-checkbox:hover .el-checkbox__inner) {
  border-color: #00eaff !important;
}

:deep(.el-checkbox:hover .el-checkbox__label) {
  color: #00eaff !important;
}

/* 按钮样式 */
:deep(.el-button--default) {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(0, 234, 255, 0.3) !important;
  color: #00eaff !important;
}

:deep(.el-button--default:hover) {
  background: rgba(0, 234, 255, 0.1) !important;
  border-color: #00eaff !important;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.3) !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #00a3cc 0%, #0080ff 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.4) !important;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #00eaff 0%, #0099ff 100%) !important;
  box-shadow: 0 0 20px rgba(0, 234, 255, 0.6) !important;
  transform: translateY(-2px);
}

</style>

