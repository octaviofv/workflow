<template>
  <div
    class="circle-node"
    :class="[`node-type-${type}`, { selected }]"
    :style="computedNodeStyle"
  >
    <!-- Label & Icon -->
    <div class="node-content">
      <i v-if="icon" :class="icon" class="node-icon"></i>
      <span class="node-label">{{ label }}</span>
    </div>

    <!-- Connection Handles -->
    <div class="node-handles">
      <Handle v-if="type === 'event-start'" id="source-handle" type="source" position="right" />
      <Handle v-if="type === 'event-end'" id="target-handle" type="target" position="left" />
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
    // Dynamic node style based on backgroundColor
    const computedNodeStyle = computed(() => ({
      backgroundColor: props.backgroundColor || '#ffffff',
      borderColor: props.selected ? '#2196F3' : 'currentColor',
    }));

    return {
      computedNodeStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.circle-node {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;

  &.selected {
    border-color: #2196f3;
    box-shadow: 0 0 8px rgba(33, 150, 243, 0.5);
  }

  &.node-type-event-start {
    color: #4caf50;
  }

  &.node-type-event-end {
    color: #f44336;
  }

  .node-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
  }

  .node-icon {
    font-size: 18px;
    margin: 0;
  }

  .node-label {
    font-size: 12px;
    white-space: nowrap;
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
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
      border: 2px solid white;
      background: currentColor;
      border-radius: 50%;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
