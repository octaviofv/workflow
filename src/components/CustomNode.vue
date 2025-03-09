<template>
  <div 
    class="note-node" 
    :class="{ selected }"
    :style="{ backgroundColor: data.backgroundColor || '#ffffff' }"
  >
    <div class="note-content">
      <div class="node-number">{{ data.number || '1' }}</div>
      <div class="content-wrapper">
        <div class="note-title">{{ data.label || 'Question' }}</div>
        <div class="note-text">{{ data.content || '' }}</div>
      </div>
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
import { ref, watch } from 'vue';

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
    isReadOnly: {
      type: Boolean,
      default: true,
    }
  },
  emits: ['update:data'],
  setup(props, { emit }) {
    const localContent = ref(props.data.content || '');

    watch(() => props.data.content, (newContent) => {
      localContent.value = newContent || '';
    });

    const handles = [
      { id: 'top', type: 'target', position: 'top' },
      { id: 'right', type: 'source', position: 'right' },
      { id: 'bottom', type: 'source', position: 'bottom' },
      { id: 'left', type: 'target', position: 'left' },
    ];

    const updateContent = () => {
      emit('update:data', {
        ...props.data,
        content: localContent.value
      });
    };

    return {
      handles,
      localContent,
      updateContent
    };
  },
};
</script>

<style lang="scss" scoped>
.note-node {
  min-width: 280px;
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &.selected {
    border-color: #6366F1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }

  &:hover {
    border-color: #6366F1;
  }
}

.note-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.node-number {
  width: 24px;
  height: 24px;
  background-color: #F3F4F6;
  color: #4B5563;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  flex-shrink: 0;
}

.content-wrapper {
  flex-grow: 1;
}

.note-title {
  font-weight: 500;
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.4;
}

.note-text {
  font-size: 13px;
  line-height: 1.5;
  color: #6B7280;
  white-space: pre-wrap;
  word-break: break-word;
}

.node-handles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;

  :deep(.vue-flow__handle) {
    pointer-events: all;
    width: 8px;
    height: 8px;
    background: #E5E7EB;
    border: 2px solid #ffffff;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background: #6366F1;
      transform: scale(1.2);
    }

    &.vue-flow__handle-top {
      top: -4px;
    }

    &.vue-flow__handle-right {
      right: -4px;
    }

    &.vue-flow__handle-bottom {
      bottom: -4px;
    }

    &.vue-flow__handle-left {
      left: -4px;
    }
  }
}
</style>
