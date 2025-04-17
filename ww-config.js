export default {
  backgroundColor: {
    label: { en: 'Background Color' },
    type: 'Color',
    section: 'style',
    bindable: true,
    defaultValue: '#ffffff',
    /* wwEditor:start */
    bindingValidation: {
      type: 'string',
      tooltip: 'Set the background color of the flow chart',
    },
    propertyHelp: {
      tooltip: 'Define the background color of the flow chart container',
    },
    /* wwEditor:end */
  },

  backgroundGap: {
    label: { en: 'Background Grid Gap' },
    type: 'Number',
    section: 'style',
    bindable: true,
    defaultValue: 20,
    options: {
      min: 10,
      max: 100,
      step: 5,
    },
    /* wwEditor:start */
    bindingValidation: {
      type: 'number',
      tooltip: 'The gap between background grid lines (in pixels)',
    },
    propertyHelp: {
      tooltip: 'Set the spacing between background grid lines',
    },
    /* wwEditor:end */
  },

  width: {
    label: { en: 'Width' },
    type: 'Length',
    section: 'settings',
    bindable: true,
    defaultValue: '100%',
    /* wwEditor:start */
    bindingValidation: {
      type: 'string',
      tooltip: 'The width of the flow chart container (e.g., "100%", "500px")',
    },
    propertyHelp: {
      tooltip: 'Set the width of the flow chart container',
    },
    /* wwEditor:end */
  },

  height: {
    label: { en: 'Height' },
    type: 'Length',
    section: 'settings',
    bindable: true,
    defaultValue: '500px',
    /* wwEditor:start */
    bindingValidation: {
      type: 'string',
      tooltip: 'The height of the flow chart container (e.g., "500px", "80vh")',
    },
    propertyHelp: {
      tooltip: 'Set the height of the flow chart container',
    },
    /* wwEditor:end */
  },

  nodes: {
    label: { en: 'Initial Flow' },
    type: 'object', // Cambiado a minúscula
    section: 'settings',
    bindable: true, // Añadido bindable: true
    defaultValue: {
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
    },
    /* wwEditor:start */
    bindingValidation: {
      type: 'object',
      tooltip: 'The initial flow configuration with nodes and edges',
    },
    propertyHelp: {
      tooltip: 'Define the default flow structure that will be loaded initially',
    },
    /* wwEditor:end */
  }
};
