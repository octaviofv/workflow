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

      <div
        class="draggable-node"
        draggable="true"
        @dragstart="onDragStart($event, 'circle', 'event-start')"
      >
        <div class="preview-node preview-node-circle">
          <div class="preview-circle start">
            <span>Inicio</span>
          </div>
        </div>
      </div>

      <div
        class="draggable-node"
        draggable="true"
        @dragstart="onDragStart($event, 'circle', 'event-end')"
      >
        <div class="preview-node preview-node-circle">
          <div class="preview-circle end">
            <span>Fin</span>
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
        data: {}
      };

      if (nodeType === 'custom') {
        nodeData.data = {
          label: variant === 'question' ? 'Nueva Pregunta' : 'Nueva Declaración',
          content: '',
          number: variant === 'question' ? 'Q' : 'S',
          backgroundColor: '#ffffff',
        };
      } else if (nodeType === 'circle') {
        nodeData.data = {
          type: variant,
          label: variant === 'event-start' ? 'Inicio' : 'Fin',
          icon: variant === 'event-start' ? 'fas fa-play' : 'fas fa-stop',
          backgroundColor: '#ffffff',
        };
      }

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
  width: 240px;
  background: #ffffff;
  border-left: 1px solid #E5E7EB;
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  padding: 10px;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366F1;
    background: #F9FAFB;
  }

  &.preview-node-circle {
    padding: 6px;
    justify-content: center;
  }
}

.preview-number {
  width: 20px;
  height: 20px;
  background-color: #F3F4F6;
  color: #4B5563;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 11px;
}

.preview-content {
  font-size: 13px;
  color: #374151;
  font-weight: 400;
}

.preview-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 500;
  background: #F3F4F6;

  &.start {
    color: #10B981;
  }

  &.end {
    color: #EF4444;
  }

  span {
    color: #4B5563;
    font-size: 11px;
  }
}
</style>
