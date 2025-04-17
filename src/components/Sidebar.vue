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
            <span>Nuevo Nodo</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de Save -->
    <div class="save-section">
      <button class="save-button" @click="saveChanges">
        <svg viewBox="0 0 24 24" class="save-icon">
          <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z" />
        </svg>
        Guardar Cambios
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  emits: ['save-changes'],
  setup(props, { emit }) {
    const onDragStart = (event, nodeType) => {
      const nodeData = {
        type: nodeType,
        data: {
          label: 'Nuevo Nodo',
          content: '',
          number: 'N',
          backgroundColor: '#ffffff',
        }
      };

      event.dataTransfer.setData('application/vueflow', JSON.stringify(nodeData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const saveChanges = () => {
      emit('save-changes');
    };

    return {
      onDragStart,
      saveChanges
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 280px;
  background: #ffffff;
  border-left: 1px solid #eaeaea;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #262627;
  margin-bottom: 20px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.draggable-node {
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.preview-node {
  padding: 12px;
  background: #ffffff;
  border: 2px solid #eaeaea;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0445AF;
    background: #f8f9fa;
  }
}

.preview-number {
  width: 28px;
  height: 28px;
  background-color: #0445AF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
}

.preview-content {
  font-size: 14px;
  color: #262627;
  font-weight: 500;
}

.save-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.save-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #0445AF;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #033584;
  }

  .save-icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
}
</style>
