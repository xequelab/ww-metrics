export default {
  editor: {
    label: {
      en: 'Metrics Slider',
      pt: 'Slider de Métricas'
    },
    icon: 'trending-up'
  },

  triggerEvents: [
    {
      name: 'nextMetric',
      label: { en: 'On next metric', pt: 'Ao ir para próxima métrica' },
      event: {
        currentIndex: 0,
        currentMetric: {}
      }
    },
    {
      name: 'previousMetric',
      label: { en: 'On previous metric', pt: 'Ao voltar para métrica anterior' },
      event: {
        currentIndex: 0,
        currentMetric: {}
      }
    },
    {
      name: 'goToMetric',
      label: { en: 'On go to metric', pt: 'Ao ir para uma métrica específica' },
      event: {
        currentIndex: 0,
        currentMetric: {},
        index: 0
      }
    }
  ],

  actions: [
    {
      label: { en: 'Next metric', pt: 'Próxima métrica' },
      action: 'nextMetricAction'
    },
    {
      label: { en: 'Previous metric', pt: 'Métrica anterior' },
      action: 'previousMetricAction'
    },
    {
      label: { en: 'Go to metric', pt: 'Ir para métrica' },
      action: 'goToMetricAction',
      args: [
        {
          name: 'index',
          type: 'number'
        }
      ]
    }
  ],

  properties: {
    agendamentosCollection: {
      label: { en: 'Agendamentos Collection', pt: 'Coleção de Agendamentos' },
      type: 'Object',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind sua coleção de agendamentos'
      },
      propertyHelp: {
        tooltip: 'Conecte a coleção agendamentos. O componente calcula automaticamente as métricas.'
      }
      /* wwEditor:end */
    },

    clientesCollection: {
      label: { en: 'Clientes Collection', pt: 'Coleção de Clientes' },
      type: 'Object',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind sua coleção de clientes'
      },
      propertyHelp: {
        tooltip: 'Conecte a coleção clientes. O componente calcula automaticamente as métricas.'
      }
      /* wwEditor:end */
    },

    primaryColor: {
      label: { en: 'Primary Color', pt: 'Cor Primária' },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#081B4E',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Hex color para elementos principais'
      },
      propertyHelp: {
        tooltip: 'Usado em botões, indicadores ativos e acentos'
      }
      /* wwEditor:end */
    },

    accentColor: {
      label: { en: 'Accent Color', pt: 'Cor de Destaque' },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#081B4E',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Hex color para linha de acentuação'
      },
      propertyHelp: {
        tooltip: 'Linha de acentuação na base dos cards'
      }
      /* wwEditor:end */
    },

    cardBackgroundColor: {
      label: { en: 'Card Background', pt: 'Fundo dos Cards' },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#ffffff',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor de fundo dos cards de métrica'
      },
      propertyHelp: {
        tooltip: 'Normalmente branco ou muito claro'
      }
      /* wwEditor:end */
    },

    cardBorderColor: {
      label: { en: 'Card Border', pt: 'Borda dos Cards' },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#e8eef7',
      options: {
        nullable: true
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor da borda dos cards'
      },
      propertyHelp: {
        tooltip: 'Cor sutil para separação dos cards'
      }
      /* wwEditor:end */
    },

    showNavigationButtons: {
      label: { en: 'Show Navigation Buttons', pt: 'Mostrar Botões de Navegação' },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Mostrar ou ocultar botões anterior/próximo'
      },
      propertyHelp: {
        tooltip: 'Display Previous/Next buttons'
      }
      /* wwEditor:end */
    },

    showIndicators: {
      label: { en: 'Show Indicators', pt: 'Mostrar Indicadores' },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Mostrar dots de indicação de página'
      },
      propertyHelp: {
        tooltip: 'Display page indicator dots'
      }
      /* wwEditor:end */
    },

    showCounter: {
      label: { en: 'Show Counter', pt: 'Mostrar Contador' },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Mostrar contador "X de Y" abaixo dos controles'
      },
      propertyHelp: {
        tooltip: 'Display "current of total" counter'
      }
      /* wwEditor:end */
    },

    containerGap: {
      label: { en: 'Container Gap', pt: 'Espaço do Container' },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '16px',
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 0, max: 100 }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Espaço entre elementos principais'
      },
      propertyHelp: {
        tooltip: 'Gap entre slider, controles e contador'
      }
      /* wwEditor:end */
    },

    cardGap: {
      label: { en: 'Card Gap', pt: 'Espaço entre Cards' },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '20px',
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 0, max: 100 }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Espaço horizontal entre cards no slider'
      },
      propertyHelp: {
        tooltip: 'Afeta o espaço visível entre métricas'
      }
      /* wwEditor:end */
    },

    cardHeight: {
      label: { en: 'Card Height', pt: 'Altura dos Cards' },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '220px',
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 150, max: 500 }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Altura total de cada card de métrica'
      },
      propertyHelp: {
        tooltip: 'Controla o tamanho vertical dos cards'
      }
      /* wwEditor:end */
    },

    cardWidth: {
      label: { en: 'Card Width', pt: 'Largura dos Cards' },
      type: 'Text',
      section: 'style',
      bindable: true,
      defaultValue: '100%',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Largura de cada card (ex: 100%, 300px, 80%)'
      },
      propertyHelp: {
        tooltip: 'Use 100% para full width ou um valor fixo em px'
      }
      /* wwEditor:end */
    }
  }
};
