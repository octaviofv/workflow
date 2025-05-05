<template>
  <div 
    class="custom-node" 
    :class="{ selected }"
    @dblclick="startEditing"
  >
    <div class="node-header">
      <div class="node-icon">
        <div class="node-number">{{ data.number || '1' }}</div>
      </div>
      <div class="node-title" v-if="!isEditing">{{ data.label || 'Action' }}</div>
      <input
        v-else
        v-model="editedLabel"
        class="edit-input"
        @keyup.enter="saveChanges"
        @keyup.esc="cancelEdit"
        ref="labelInput"
        placeholder="Enter title"
      />
      <div class="tool-selector" v-if="isEditing">
        <select 
          v-model="editedToolName"
          class="tool-select"
          @change="updateToolName"
        >
          <option v-for="tool in toolOptions" :key="tool" :value="tool">
            {{ tool }}
          </option>
        </select>
      </div>
      <div class="tool-name" v-else>{{ data.toolName || 'Sin herramienta' }}</div>
    </div>
    
    <div class="node-content">
      <div class="content-text" v-if="!isEditing">{{ data.content || '' }}</div>
      <textarea
        v-else
        v-model="editedContent"
        class="edit-textarea"
        @keyup.esc="cancelEdit"
        ref="contentTextarea"
        placeholder="Enter content"
      ></textarea>
    </div>

    <div v-if="isEditing" class="edit-actions">
      <button class="save-button" @click="saveChanges">Save</button>
      <button class="cancel-button" @click="cancelEdit">Cancel</button>
    </div>

    <div class="node-handles">
      <Handle
        v-for="handle in handles"
        :key="handle.id"
        :id="handle.id"
        :type="handle.type"
        :position="handle.position"
      />
    </div>
  </div>
</template>

<script>
import { Handle } from '@vue-flow/core';
import { ref, watch, computed } from 'vue';

export default {
  name: 'CustomNode',
  components: {
    Handle,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:data'],
  setup(props, { emit }) {
    const handles = [
      { id: 'top', type: 'target', position: 'top' },
      { id: 'right', type: 'source', position: 'right' },
      { id: 'bottom', type: 'source', position: 'bottom' },
      { id: 'left', type: 'target', position: 'left' },
    ];

    const isEditing = ref(false);
    const editedLabel = ref('');
    const editedContent = ref('');
    const editedToolName = ref('');
    const labelInput = ref(null);
    const contentTextarea = ref(null);

    // Get toolOptions from the root component's content prop
    const toolOptions = computed(() => {
      const rootComponent = document.querySelector('ww-flow-chart');
      if (rootComponent && rootComponent.__vueParentComponent?.ctx?.content?.toolOptions) {
        return rootComponent.__vueParentComponent.ctx.content.toolOptions;
      }
      return ['Sin herramienta', 'Hubspot', 'Gmail', 'Outlook']; // Fallback options
    });

    const startEditing = () => {
      editedLabel.value = props.data.label || '';
      editedContent.value = props.data.content || '';
      editedToolName.value = props.data.toolName || 'Sin herramienta';
      isEditing.value = true;
      
      setTimeout(() => {
        labelInput.value?.focus();
      }, 0);
    };

    const updateToolName = () => {
      const updatedData = {
        ...props.data,
        toolName: editedToolName.value
      };
      emit('update:data', props.id, updatedData);
    };

    const saveChanges = () => {
      const updatedData = {
        ...props.data,
        label: editedLabel.value,
        content: editedContent.value,
        toolName: editedToolName.value
      };
      
      emit('update:data', props.id, updatedData);
      isEditing.value = false;
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const handleClickOutside = (event) => {
      if (isEditing.value && !event.target.closest('.custom-node')) {
        saveChanges();
      }
    };

    watch(isEditing, (newValue) => {
      if (newValue) {
        document.addEventListener('click', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }
    });

    return {
      handles,
      isEditing,
      editedLabel,
      editedContent,
      editedToolName,
      toolOptions,
      labelInput,
      contentTextarea,
      startEditing,
      saveChanges,
      cancelEdit,
      updateToolName,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-node {
  min-width: 280px;
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(55, 53, 47, 0.1);
  border: 1px solid #E9E9E8;
  overflow: hidden;
  transition: all 0.2s ease;

  &.selected {
    border-color: #37352F;
    box-shadow: 0 0 0 1px #37352F;
  }
}

.node-header {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #F7F6F3;
  border-bottom: 1px solid #E9E9E8;
  gap: 12px;
}

.node-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #37352F;
  border-radius: 4px;
  flex-shrink: 0;
}

.node-number {
  color: #FFFFFF;
  font-weight: 500;
  font-size: 12px;
}

.node-title {
  font-weight: 400;
  color: #37352F;
  font-size: 14px;
  flex-grow: 1;
}

.tool-name {
  font-size: 12px;
  color: #787774;
  padding: 2px 6px;
  background: #F7F6F3;
  border-radius: 3px;
  border: 1px solid #E9E9E8;
}

.tool-selector {
  min-width: 120px;
}

.tool-select {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #E9E9E8;
  border-radius: 4px;
  font-size: 12px;
  color: #37352F;
  background: #FFFFFF;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #37352F;
  }
}

.node-content {
  padding: 12px;
  background: #FFFFFF;
}

.content-text {
  font-size: 14px;
  color: #37352F;
  line-height: 1.5;
  white-space: pre-wrap;
}

.edit-input {
  flex-grow: 1;
  padding: 6px 8px;
  border: 1px solid #E9E9E8;
  border-radius: 4px;
  font-size: 14px;
  color: #37352F;
  background: #FFFFFF;
  margin-right: 8px;

  &:focus {
    outline: none;
    border-color: #37352F;
  }
}

.edit-textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #E9E9E8;
  border-radius: 4px;
  font-size: 14px;
  color: #37352F;
  resize: vertical;
  background: #FFFFFF;

  &:focus {
    outline: none;
    border-color: #37352F;
  }
}

.edit-actions {
  display: flex;
  gap: 8px;
  padding: 8px 12px 12px;
  justify-content: flex-end;
  background: #FFFFFF;

  button {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;

    &.save-button {
      background: #37352F;
      color: #FFFFFF;
      border: none;

      &:hover {
        background: #2B2B2B;
      }
    }

    &.cancel-button {
      background: #F7F6F3;
      color: #37352F;
      border: 1px solid #E9E9E8;

      &:hover {
        background: #E9E9E8;
      }
    }
  }
}

.node-handles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;

  :deep(.vue-flow__handle) {
    width: 6px;
    height: 6px;
    background: #FFFFFF;
    border: 1px solid #37352F;
    border-radius: 50%;
    pointer-events: all;
    transition: all 0.2s ease;

    &:hover {
      background: #F7F6F3;
      transform: scale(1.2);
    }

    &.vue-flow__handle-connecting {
      background: #37352F;
    }

    &.vue-flow__handle-valid {
      background: #37352F;
      border-color: #37352F;
    }

    &.vue-flow__handle-invalid {
      background: #E9E9E8;
      border-color: #787774;
    }
  }
}
</style>
