<template>
  <div class="sidebar">
    <!-- Save Button Section -->
    <div class="save-section">
      <button 
        class="save-button" 
        @click="saveChanges"
        :class="{ 'saving': isSaving }"
      >
        <svg viewBox="0 0 24 24" class="save-icon">
          <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z" />
        </svg>
        {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
      <div v-if="showFeedback" :class="['save-feedback', feedbackType]">
        {{ feedbackMessage }}
      </div>
    </div>

    <div class="divider"></div>

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
  emits: ['save-changes'],
  setup(props, { emit }) {
    const isSaving = ref(false);
    const showFeedback = ref(false);
    const feedbackMessage = ref('');
    const feedbackType = ref('success');

    const showSaveFeedback = (message, type = 'success') => {
      feedbackMessage.value = message;
      feedbackType.value = type;
      showFeedback.value = true;
      
      setTimeout(() => {
        showFeedback.value = false;
      }, 3000);
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

    const saveChanges = async () => {
      try {
        isSaving.value = true;
        await emit('save-changes');
        showSaveFeedback('Cambios guardados correctamente');
      } catch (error) {
        showSaveFeedback('Error al guardar los cambios', 'error');
      } finally {
        isSaving.value = false;
      }
    };

    return {
      isSaving,
      showFeedback,
      feedbackMessage,
      feedbackType,
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
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a1a1a1;
    }
  }
}

.save-section {
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  background: #ffffff;
  padding-bottom: 16px;
  z-index: 10;
}

.divider {
  height: 1px;
  background: #eaeaea;
  margin: 16px 0;
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

  &:hover:not(.saving) {
    background: #033584;
  }

  &.saving {
    opacity: 0.8;
    cursor: wait;
    pointer-events: none;
  }

  .save-icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
}

.save-feedback {
  margin-top: 8px;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  animation: fadeIn 0.3s ease;

  &.success {
    background: #E8F5E9;
    color: #1B5E20;
  }

  &.error {
    background: #FFEBEE;
    color: #B71C1C;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
