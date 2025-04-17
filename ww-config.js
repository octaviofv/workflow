export default {
  editor: {
    label: {
      en: 'Flow Chart Builder',
    },
    icon: 'workflow',
  },
  properties: {
    nodes: {
      label: { en: 'Nodes' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        {
          type: 'custom',
          label: 'Entrada',
          description: 'Información de entrada',
          backgroundColor: '#E3F2FD',
          borderColor: '#1E88E5',
          textColor: '#000000'
        },
        {
          type: 'custom',
          label: 'Proceso',
          description: 'Procesamiento de información',
          backgroundColor: '#F3E5F5',
          borderColor: '#9C27B0',
          textColor: '#000000'
        },
        {
          type: 'custom',
          label: 'Salida',
          description: 'Información de salida',
          backgroundColor: '#E8F5E9',
          borderColor: '#43A047',
          textColor: '#000000'
        }
      ],
      options: {
        expandable: true,
        getItemLabel(item, index) {
          return item?.label || `Node ${index + 1}`;
        },
        item: {
          type: 'Object',
          options: {
            item: {
              type: {
                label: { en: 'Type' },
                type: 'TextSelect',
                options: {
                  options: [
                    { value: 'custom', label: 'Custom Node' }
                  ]
                }
              },
              label: {
                label: { en: 'Label' },
                type: 'Text',
              },
              description: {
                label: { en: 'Description' },
                type: 'Text',
              },
              backgroundColor: {
                label: { en: 'Background Color' },
                type: 'Color',
              },
              borderColor: {
                label: { en: 'Border Color' },
                type: 'Color',
              },
              textColor: {
                label: { en: 'Text Color' },
                type: 'Color',
              }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind an array of node objects with properties: type, label, description, backgroundColor, borderColor, textColor',
      },
      propertyHelp: {
        tooltip: 'Define the nodes to display in the flow diagram',
      },
      /* wwEditor:end */
    },
    connections: {
      label: { en: 'Connections' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        { from: 0, to: 1, color: '#666666' },
        { from: 1, to: 2, color: '#666666' }
      ],
      options: {
        expandable: true,
        getItemLabel(item, index) {
          return `Connection ${index + 1}`;
        },
        item: {
          type: 'Object',
          options: {
            item: {
              from: {
                label: { en: 'From Node Index' },
                type: 'Number',
                options: { min: 0 }
              },
              to: {
                label: { en: 'To Node Index' },
                type: 'Number',
                options: { min: 0 }
              },
              color: {
                label: { en: 'Line Color' },
                type: 'Color',
              }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind an array of connection objects with properties: from (number), to (number), color',
      },
      propertyHelp: {
        tooltip: 'Define the connections between nodes using node indices',
      },
      /* wwEditor:end */
    }
  }
};
