<template>
  <div class="sidebar">
    <h3 class="sidebar-title">Elementos</h3>
    <div class="node-list">
      <div
        class="draggable-node"
        draggable="true"
        @dragstart="onDragStart($event, 'custom')"
      >
        <div class="preview-node">
          <div class="preview-number">N</div>
          <div class="preview-content">
            <span>Nuevo Proceso</span>
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
      onDragStart
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  background: #FFFFFF;
  border-right: 1px solid #E9E9E8;
  padding: 24px 16px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

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

.sidebar-title {
  font-size: 14px;
  font-weight: 500;
  color: #37352F;
  margin-bottom: 16px;
  padding: 0 8px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.draggable-node {
  cursor: grab;
  width: 100%;
  
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
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background: #FFFFFF;
    border-color: #37352F;
  }
}

.preview-number {
  width: 24px;
  height: 24px;
  min-width: 24px;
  background-color: #37352F;
  color: #FFFFFF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
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
