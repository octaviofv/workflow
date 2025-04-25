<template>
  <div class="flowchart-container" :style="containerStyle">
    <div class="flowchart-wrapper">
      <Sidebar class="flowchart-sidebar" />
      <VueFlow
        v-if="initialized"
        v-model="elements"
        :default-zoom="defaultZoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :fit-view-on-init="true"
        :nodes-draggable="!isEditing"
        :nodes-connectable="!isEditing"
        :elements-selectable="!isEditing"
        class="flowchart"
        @nodeClick="onNodeClick"
        @connect="onConnect"
        @paneClick="onPaneClick"
        @dragover="onDragOver"
        @drop="onDrop"
        @nodeDragStop="onNodeDragStop"
        @nodesDelete="onNodesDelete"
        @edgesDelete="onEdgesDelete"
      >
        <template #node-custom="nodeProps">
          <CustomNode v-bind="nodeProps" @update:data="onNodeDataUpdate" />
        </template>

        <Background :pattern-color="backgroundColor" :gap="backgroundGap" />
        <Controls />
        <MiniMap v-if="showMinimap" />
      </VueFlow>

      <div class="zoom-controls">
        <button class="zoom-button" @click="zoomIn" title="Acercar">+</button>
        <button class="zoom-button" @click="zoomOut" title="Alejar">-</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  VueFlow, 
  useVueFlow,
  Background, 
  Controls, 
  MiniMap, 
  Panel 
} from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';
import CustomNode from './components/CustomNode.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'FlowChart',
  components: {
    VueFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    CustomNode,
    Sidebar,
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event', 'update:content'],
  setup(props, { emit }) {
    const initialized = ref(false);
    const elements = ref([]);
    const selectedNode = ref(null);

    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState?.isEditing;
      /* wwEditor:end */
      return false;
    });

    const { findNode, addNodes, addEdges, removeNodes, project, zoomIn: vueFlowZoomIn, zoomOut: vueFlowZoomOut } = useVueFlow({
      defaultEdgeOptions: {
        type: 'smoothstep',
        animated: true,
      },
    });

    const containerStyle = computed(() => ({
      height: props.content?.height || '600px',
      backgroundColor: props.content?.backgroundColor || '#f5f5f5',
      position: 'relative',
      overflow: 'hidden'
    }));

    const defaultZoom = computed(() => props.content?.defaultZoom || 1);
    const minZoom = computed(() => props.content?.minZoom || 0.1);
    const maxZoom = computed(() => props.content?.maxZoom || 4);
    const backgroundGap = computed(() => props.content?.backgroundGap || 20);
    const showMinimap = computed(() => props.content?.showMinimap ?? true);
    const backgroundColor = computed(() => props.content?.backgroundColor || '#f5f5f5');

    const zoomIn = () => {
      vueFlowZoomIn();
    };

    const zoomOut = () => {
      vueFlowZoomOut();
    };

    // Default flow structure
    const defaultFlow = {
      nodes: [
        {
          id: 'input',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Entrada',
            content: 'Información de entrada',
            number: '1',
            backgroundColor: '#E3F2FD'
          }
        },
        {
          id: 'process',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Proceso',
            content: 'Procesamiento de información',
            number: '2',
            backgroundColor: '#F3E5F5'
          }
        },
        {
          id: 'output',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Salida',
            content: 'Información de salida',
            number: '3',
            backgroundColor: '#E8F5E9'
          }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'input',
          target: 'process',
          type: 'smoothstep',
          animated: true
        },
        {
          id: 'e2-3',
          source: 'process',
          target: 'output',
          type: 'smoothstep',
          animated: true
        }
      ]
    };

    // Watch for changes in content.flowData
    watch(() => props.content.flowData, (newFlowData) => {
      if (!newFlowData) return;
      
      try {
        const parsedData = typeof newFlowData === 'string' 
          ? JSON.parse(newFlowData) 
          : newFlowData;

        const currentData = {
          nodes: elements.value.filter(el => !el.source),
          edges: elements.value.filter(el => el.source)
        };

        if (JSON.stringify(currentData) !== JSON.stringify(parsedData)) {
          elements.value = [
            ...(parsedData.nodes || []),
            ...(parsedData.edges || [])
          ];
        }
      } catch (error) {
        console.error('Error parsing flow data:', error);
      }
    }, { deep: true });

    watch(elements, () => {
      const nodes = elements.value.filter(el => !el.source);
      const edges = elements.value.filter(el => el.source);

      const flowData = {
        nodes,
        edges
      };

      const stringifiedData = JSON.stringify(flowData, null, 2);
      
      if (stringifiedData !== props.content.flowData) {
        const updatedContent = {
          ...props.content,
          flowData: stringifiedData
        };
        emit('update:content', updatedContent);
      }
    }, { deep: true });

    onMounted(() => {
      try {
        if (props.content?.flowData) {
          const parsedData = typeof props.content.flowData === 'string' 
            ? JSON.parse(props.content.flowData) 
            : props.content.flowData;
          
          elements.value = [
            ...(parsedData.nodes || []),
            ...(parsedData.edges || [])
          ];
        } else {
          elements.value = [
            ...defaultFlow.nodes,
            ...defaultFlow.edges
          ];
        }
        initialized.value = true;
      } catch (error) {
        console.error('Error initializing flow data:', error);
        elements.value = [
          ...defaultFlow.nodes,
          ...defaultFlow.edges
        ];
        initialized.value = true;
      }
    });

    const generateId = () => `node_${Date.now()}`;

    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
      const data = JSON.parse(event.dataTransfer.getData('application/vueflow'));
      const position = project({ x: event.clientX, y: event.clientY });

      const newNode = {
        id: generateId(),
        ...data,
        position,
      };

      addNodes([newNode]);
      emit('trigger-event', { name: 'nodeAdded', event: { node: newNode } });
    };

    const onNodeClick = (event, node) => {
      selectedNode.value = node;
      emit('trigger-event', { name: 'nodeSelected', event: { node } });
    };

    const onConnect = (connection) => {
      if (connection?.source && connection?.target) {
        const newEdge = {
          id: `edge-${connection.source}-${connection.target}`,
          ...connection,
          type: 'smoothstep',
          animated: true,
        };
        
        addEdges([newEdge]);
        emit('trigger-event', { name: 'connectionCreated', event: { connection: newEdge } });
      }
    };

    const onPaneClick = () => {
      selectedNode.value = null;
      emit('trigger-event', { name: 'selectionCleared' });
    };

    const onNodeDragStop = (event, node) => {
      const updatedNode = findNode(node.id);
      if (updatedNode) {
        emit('trigger-event', { name: 'nodeMoved', event: { node: updatedNode } });
      }
    };

    const onNodesDelete = (nodes) => {
      nodes.forEach(node => {
        emit('trigger-event', { name: 'nodeDeleted', event: { nodeId: node.id } });
      });
    };

    const onEdgesDelete = (edges) => {
      edges.forEach(edge => {
        emit('trigger-event', { name: 'edgeDeleted', event: { edgeId: edge.id } });
      });
    };

    const onNodeDataUpdate = (nodeId, newData) => {
      const node = findNode(nodeId);
      if (node) {
        node.data = { ...node.data, ...newData };
        emit('trigger-event', { name: 'nodeUpdated', event: { node } });
      }
    };

    return {
      elements,
      initialized,
      isEditing,
      containerStyle,
      defaultZoom,
      minZoom,
      maxZoom,
      backgroundGap,
      showMinimap,
      backgroundColor,
      onNodeClick,
      onConnect,
      onPaneClick,
      onDragOver,
      onDrop,
      onNodeDragStop,
      onNodesDelete,
      onEdgesDelete,
      onNodeDataUpdate,
      zoomIn,
      zoomOut,
    };
  },
};
</script>

<style lang="scss" scoped>
.flowchart-container {
  width: 100%;
  border: 1px solid #E9E9E8;
  border-radius: 4px;
  overflow: hidden;
  padding-left: 64px;
  transition: padding-left 0.3s ease;
}

.flowchart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  background: #FFFFFF;
}

.flowchart {
  flex-grow: 1;
  height: 100%;

  :deep(.vue-flow__node) {
    width: auto;
    height: auto;
  }

  :deep(.vue-flow__handle) {
    width: 6px;
    height: 6px;
    background: #37352F;
    border: 2px solid #FFFFFF;
  }

  :deep(.vue-flow__edge-path) {
    stroke: #37352F;
    stroke-width: 1;
  }

  :deep(.vue-flow__controls) {
    border: 1px solid #E9E9E8;
    box-shadow: none;
    background: #FFFFFF;
    
    button {
      background: #F7F6F3;
      border: none;
      color: #37352F;
      
      &:hover {
        background: #E9E9E8;
      }
    }
  }

  :deep(.vue-flow__minimap) {
    background-color: #F7F6F3;
    border: 1px solid #E9E9E8;
  }
}

.flowchart-sidebar {
  flex-shrink: 0;
  height: 100%;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 0;
}

.zoom-button {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #FFFFFF;
  border: 1px solid #E9E9E8;
  color: #37352F;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: #F7F6F3;
    border-color: #37352F;
  }

  &:active {
    background: #E9E9E8;
  }
}
</style>
