<template>
  <div class="sidebar" :class="{ collapsed }">
    <button class="collapse-button" @click="toggleCollapse">
      {{ collapsed ? '→' : '←' }}
    </button>
    
    <div class="sidebar-content">
      <h3 class="sidebar-title">{{ collapsed ? '' : 'Elementos' }}</h3>
      <div class="node-list">
        <div
          class="draggable-node"
          draggable="true"
          @dragstart="onDragStart($event, 'custom')"
        >
          <div class="preview-node">
            <div class="preview-number">N</div>
            <div class="preview-content" v-if="!collapsed">
              <span>Nuevo Proceso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Sidebar',
  setup() {
    const collapsed = ref(false);

    const toggleCollapse = () => {
      collapsed.value = !collapsed.value;
    };

    const onDragStart = (event, nodeType) => {
      const nodeData = {
        type: nodeType,
        data: {
          label: 'Nuevo Proceso',
          content: '',
          number: 'N',
          backgroundColor: '#ffffff',
        }
      };

      event.dataTransfer.setData('application/vueflow', JSON.stringify(nodeData));
      event.dataTransfer.effectAllowed = 'move';
    };

    return {
      collapsed,
      toggleCollapse,
      onDragStart
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  background: #FFFFFF;
  border-right: 1px solid #E9E9E8;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  z-index: 0;
  transition: all 0.3s ease;
  width: 250px;

  &.collapsed {
    width: 64px;

    .sidebar-content {
      opacity: 0.5;
    }

    .preview-node {
      padding: 8px;
      justify-content: center;
    }
  }

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #F7F6F3;
  }

  &::-webkit-scrollbar-thumb {
    background: #E9E9E8;
    border-radius: 3px;

    &:hover {
      background: #787774;
    }
  }
}

.collapse-button {
  position: absolute;
  right: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  background: #FFFFFF;
  border: 1px solid #E9E9E8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 0;
  transition: all 0.2s ease;
  color: #37352F;
  font-size: 12px;
  padding: 0;

  &:hover {
    background: #F7F6F3;
    border-color: #37352F;
  }
}

.sidebar-content {
  padding: 24px 16px;
  width: 100%;
  transition: opacity 0.2s ease;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 500;
  color: #37352F;
  margin-bottom: 16px;
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.draggable-node {
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.preview-node {
  padding: 12px;
  background: #F7F6F3;
  border: 1px solid #E9E9E8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #FFFFFF;
    border-color: #37352F;
  }
}

.preview-number {
  width: 24px;
  height: 24px;
  background-color: #37352F;
  color: #FFFFFF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  flex-shrink: 0;
}

.preview-content {
  font-size: 14px;
  color: #37352F;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
