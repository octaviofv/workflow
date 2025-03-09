<template>
  <div
    class="circle-node"
    :class="[`node-type-${type}`, { selected }]"
    :style="computedNodeStyle"
  >
    <div class="node-content">
      <i v-if="type === 'event-start'" class="fas fa-play node-icon"></i>
      <i v-if="type === 'event-end'" class="fas fa-stop node-icon"></i>
      <span class="node-label">{{ type === 'event-start' ? 'Inicio' : 'Fin' }}</span>
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
    selected: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const computedNodeStyle = computed(() => ({
      backgroundColor: props.type === 'event-start' ? '#ECFDF5' : '#FEF2F2',
      borderColor: props.selected ? '#6366F1' : props.type === 'event-start' ? '#10B981' : '#EF4444',
      cursor: 'pointer',
    }));

    const handleStyle = computed(() => ({
      width: '8px',
      height: '8px',
      background: props.selected ? '#6366F1' : props.type === 'event-start' ? '#10B981' : '#EF4444',
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &.selected {
    border-color: #6366F1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &.node-type-event-start {
    .node-icon {
      color: #10B981;
    }
    
    .node-label {
      color: #10B981;
    }
  }

  &.node-type-event-end {
    .node-icon {
      color: #EF4444;
    }
    
    .node-label {
      color: #EF4444;
    }
  }

  .node-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .node-icon {
    font-size: 18px;
    margin: 0;
    line-height: 1;
  }

  .node-label {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
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
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
