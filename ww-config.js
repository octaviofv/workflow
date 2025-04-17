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
    type: 'Object',           // Declara un objeto anidado :contentReference[oaicite:5]{index=5}
    section: 'settings',      // Pestaña "Settings" :contentReference[oaicite:6]{index=6}
    bindable: 'list',         // Permite binding de un array de objetos :contentReference[oaicite:7]{index=7}
    options: {
      item: {
        nodes: {
          label: { en: 'Nodes Array' },
          type: 'Array',      // Cada elemento es un array :contentReference[oaicite:8]{index=8}
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Text' },
              type: { label: { en: 'Type' }, type: 'Text' },
              position: {
                label: { en: 'Position' },
                type: 'Object',
                options: {
                  item: {
                    x: { label: { en: 'X' }, type: 'Number' },
                    y: { label: { en: 'Y' }, type: 'Number' },
                  },
                },
              },
              data: {
                label: { en: 'Data' },
                type: 'Object',
                options: {
                  item: {
                    label: { label: { en: 'Label' }, type: 'Text' },
                    content: { label: { en: 'Content' }, type: 'Text' },
                    number: { label: { en: 'Number' }, type: 'Text' },
                    backgroundColor: { label: { en: 'BG Color' }, type: 'Color' },
                  },
                },
              },
            },
            fixed: false,
          },
        },
        edges: {
          label: { en: 'Edges Array' },
          type: 'Array',
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Text' },
              source: { label: { en: 'Source' }, type: 'Text' },
              target: { label: { en: 'Target' }, type: 'Text' },
              type: { label: { en: 'Edge Type' }, type: 'Text' },
              animated: { label: { en: 'Animated' }, type: 'OnOff' },
            },
            fixed: false,
          },
        },
      },
    },
    defaultValue: {          // Carga tu flujo inicial :contentReference[oaicite:9]{index=9}
      nodes: [
        {
          id: 'input',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Entrada',
            content: 'Información de entrada',
            number: '1',
            backgroundColor: '#E3F2FD',
          },
        },
        // … tus otros nodos …
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'input',
          target: 'process',
          type: 'smoothstep',
          animated: true,
        },
        // … tus otras aristas …
      ],
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
  },
};
