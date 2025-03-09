<template>
  <div
    class="circle-node"
    :class="[`node-type-${type}`, { selected }]"
    :style="computedNodeStyle"
  >
    <div class="node-content">
      <i v-if="icon" :class="icon" class="node-icon"></i>
      <span v-if="label" class="node-label">{{ label }}</span>
    </div>

    <div class="node-handles">
      <Handle v-if="type === 'event-start'" id="source-handle" type="source" position="right" :style="handleStyle" />
      <Handle v-if="type === 'event-end'" id="target-handle" type="target" position="left" :style="handleStyle" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { Handle } from '@vue-flow/core';

export default {
  name: 'CircleNode',
  components: {
    Handle,
  },
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['event-start', 'event-end'].includes(value),
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    selected: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
  },
  setup(props) {
    const computedNodeStyle = computed(() => ({
      backgroundColor: props.backgroundColor || '#ffffff',
      borderColor: props.selected ? '#6366F1' : '#E5E7EB',
      cursor: 'pointer',
    }));

    const handleStyle = computed(() => ({
      width: '10px',
      height: '10px',
      background: props.selected ? '#6366F1' : '#E5E7EB',
    }));

    return {
      computedNodeStyle,
      handleStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.circle-node {
  min-width: 50px;
  min-height: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &.selected {
    border-color: #6366F1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }

  &.node-type-event-start {
    color: #10B981;
  }

  &.node-type-event-end {
    color: #EF4444;
  }

  .node-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
    gap: 4px;
  }

  .node-icon {
    font-size: 16px;
    margin: 0;
    line-height: 1;
  }

  .node-label {
    font-size: 11px;
    white-space: nowrap;
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    color: #6B7280;
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
      width: 6px;
      height: 6px;
      background: #E5E7EB;
      border: 2px solid white;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        background: #6366F1;
        transform: scale(1.2);
      }
    }
  }
}
</style>
