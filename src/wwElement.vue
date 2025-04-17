<template>
  <div class="flowchart-container" :style="containerStyle">
    <div class="flowchart-wrapper">
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
      <Sidebar class="flowchart-sidebar" @save-changes="handleSaveChanges" />
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

    const { findNode, addNodes, addEdges, removeNodes, project } = useVueFlow({
      defaultEdgeOptions: {
        type: 'smoothstep',
        animated: true,
      },
    });

    const containerStyle = computed(() => ({
      height: props.content?.height || '600px',
      backgroundColor: props.content?.backgroundColor || '#f5f5f5',
    }));

    const defaultZoom = computed(() => props.content?.defaultZoom || 1);
    const minZoom = computed(() => props.content?.minZoom || 0.1);
    const maxZoom = computed(() => props.content?.maxZoom || 4);
    const backgroundGap = computed(() => props.content?.backgroundGap || 20);
    const showMinimap = computed(() => props.content?.showMinimap ?? true);
    const backgroundColor = computed(() => props.content?.backgroundColor || '#f5f5f5');

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

        // Only update if the data is different
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

    const updateFlowData = () => {
      const nodes = elements.value.filter(el => !el.source);
      const edges = elements.value.filter(el => el.source);

      const flowData = {
        nodes,
        edges
      };

      const stringifiedData = JSON.stringify(flowData, null, 2);
      
      // Only emit if the data has actually changed
      if (stringifiedData !== props.content.flowData) {
        const updatedContent = {
          ...props.content,
          flowData: stringifiedData
        };
        emit('update:content', updatedContent);
      }
    };

    // Watch for changes in elements
    watch(elements, () => {
      updateFlowData();
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
          // Load default flow if no existing flow data
          elements.value = [
            ...defaultFlow.nodes,
            ...defaultFlow.edges
          ];
        }
        initialized.value = true;
      } catch (error) {
        console.error('Error initializing flow data:', error);
        // Load default flow on error
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
        // Forzar la actualización del flowData
        updateFlowData();
      }
    };

    const handleSaveChanges = () => {
      updateFlowData();
      emit('trigger-event', { name: 'flowSaved', event: { flowData: elements.value } });
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
      handleSaveChanges,
    };
  },
};
</script>

<style lang="scss" scoped>
.flowchart-container {
  width: 100%;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.flowchart-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.flowchart {
  flex-grow: 1;
  height: 100%;

  :deep(.vue-flow__node) {
    width: auto;
    height: auto;
  }

  :deep(.vue-flow__handle) {
    width: 8px;
    height: 8px;
    background: #2196F3;
    border: 2px solid white;
  }

  :deep(.vue-flow__edge-path) {
    stroke: #2196F3;
    stroke-width: 2;
  }
}

.flowchart-sidebar {
  flex-shrink: 0;
  height: 100%;
  border-left: 1px solid #ddd;
}
</style>
