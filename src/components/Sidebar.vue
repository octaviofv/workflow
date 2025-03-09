<template>
  <div class="sidebar">
    <h3 class="sidebar-title">Elementos</h3>
    <div class="node-list">
      <div
        class="draggable-node"
        draggable="true"
        @dragstart="onDragStart($event, 'custom', 'question')"
      >
        <div class="preview-node">
          <div class="preview-number">Q</div>
          <div class="preview-content">
            <span>Pregunta</span>
          </div>
        </div>
      </div>

      <div
        class="draggable-node"      
        draggable="true"
        @dragstart="onDragStart($event, 'custom', 'statement')"
      >
        <div class="preview-node">
          <div class="preview-number">S</div>
          <div class="preview-content">
            <span>Declaración</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  setup() {
    const onDragStart = (event, nodeType, variant) => {
      let nodeData = {
        type: nodeType,
        data: {
          label: variant === 'question' ? 'Nueva Pregunta' : 'Nueva Declaración',
          content: '',
          number: variant === 'question' ? 'Q' : 'S',
          backgroundColor: variant === 'question' ? '#ffffff' : '#f8f9fa',
        },
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
  width: 280px;
  background: #ffffff;
  border-left: 1px solid #eaeaea;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
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
</style>