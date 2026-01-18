# Guia Completo: Criação de Componentes WeWeb

## Índice

1. [Introdução](#introdução)
2. [Estrutura Fundamental](#estrutura-fundamental)
3. [Arquivo Vue (wwElement.vue)](#arquivo-vue-wwelementvue)
4. [Arquivo de Configuração (ww-config.js)](#arquivo-de-configuração-ww-configjs)
5. [Dropzones](#dropzones)
6. [Propriedades Especiais](#propriedades-especiais)
7. [Tipos de Propriedades](#tipos-de-propriedades)
8. [State Management](#state-management)
9. [Events e Actions](#events-e-actions)
10. [Boas Práticas](#boas-práticas)
11. [Exemplo Completo](#exemplo-completo)

---

## Introdução

WeWeb utiliza **Vue 3** para criar componentes personalizados. Cada componente consiste em dois arquivos principais que trabalham juntos para criar uma experiência editável no editor WeWeb.

### Pré-requisitos

- Familiaridade com Vue 3
- Conhecimento de Composition API
- Compreensão de reatividade Vue

---

## Estrutura Fundamental

### Arquivos Obrigatórios

Todo componente WeWeb precisa de:

```
component/
├── src/
│   └── wwElement.vue  (ou wwSection.vue)
└── ww-config.js
```

### Estrutura Completa Recomendada

```
component/
├── src/
│   ├── wwElement.vue
│   └── components/
│       ├── SubComponent1.vue
│       └── SubComponent2.vue
├── ww-config.js
├── package.json
├── CLAUDE.md (documentação detalhada)
└── README.md
```

---

## Arquivo Vue (wwElement.vue)

### Template Básico

```vue
<template>
  <div class="my-component" :style="containerStyle">
    <h1>{{ content.title }}</h1>
    <p :style="textStyle">{{ content.description }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'MyComponent',
  props: {
    content: {
      type: Object,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    /* wwEditor:start */
    wwEditorState: {
      type: Object,
      required: true
    }
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Detectar se está no modo editor
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      return false;
    });

    // Computed properties para estilos
    const textStyle = computed(() => ({
      color: props.content.textColor,
      fontSize: props.content.fontSize
    }));

    const containerStyle = computed(() => ({
      padding: props.content.padding,
      gap: props.content.gap
    }));

    return {
      isEditing,
      textStyle,
      containerStyle
    };
  }
};
</script>

<style scoped lang="scss">
.my-component {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
```

### Props Obrigatórias

#### 1. content (Object, required)
- Contém todos os dados editáveis do componente
- WeWeb gerencia automaticamente: tradução, responsividade, binding
- Sempre recebe um objeto simples e direto

```js
props: {
  content: { type: Object, required: true }
}
```

#### 2. uid (String, required)
- ID único do componente
- Usado para variáveis de componente e referências

```js
props: {
  uid: { type: String, required: true }
}
```

#### 3. wwEditorState (Object, required - apenas em modo editor)
- Contém informações sobre o estado do editor
- Envolto em comentários especiais do editor

```js
/* wwEditor:start */
wwEditorState: {
  type: Object,
  required: true
}
/* wwEditor:end */
```

### Emits

```js
emits: ['trigger-event']
```

Para disparar eventos:

```js
emit('trigger-event', {
  name: 'myEvent',
  event: {
    value: 'some data',
    timestamp: Date.now()
  }
});
```

### Componentes WeWeb Especiais

#### wwElement
Renderiza um elemento WeWeb:

```vue
<wwElement v-bind="elementData" />
```

#### wwLayout
Cria uma dropzone (área onde usuários podem arrastar elementos):

```vue
<wwLayout path="items" direction="row" class="items-container" />
```

#### wwLayoutItem e wwObject
Customiza como items de uma dropzone são renderizados:

```vue
<wwLayout path="cards" direction="row">
  <template v-slot="{ item }">
    <wwLayoutItem class="card-wrapper">
      <wwObject v-bind="item" />
    </wwLayoutItem>
  </template>
</wwLayout>
```

### Detecção de Modo Editor

Sempre verifique se está no editor antes de executar ações:

```js
const isEditing = computed(() => {
  /* wwEditor:start */
  return props.wwEditorState.isEditing;
  /* wwEditor:end */
  return false;
});

const handleClick = () => {
  if (isEditing.value) return; // Não executar no editor
  // Lógica da ação
};
```

---

## Arquivo de Configuração (ww-config.js)

### Estrutura Completa

```js
export default {
  // Opções de display
  options: {
    displayAllowedValues: ['flex', 'inline-flex']
  },

  // Herança de outro componente
  inherit: {
    type: 'ww-layout'
  },

  // Configurações do editor
  editor: {
    label: {
      en: 'My Component',
      pt: 'Meu Componente'
    },
    icon: 'view-list'
  },

  // Eventos que o componente pode disparar
  triggerEvents: [
    {
      name: 'onChange',
      label: { en: 'On value change' },
      event: {
        value: '',
        oldValue: ''
      },
      default: true
    }
  ],

  // Ações que podem ser chamadas externamente
  actions: [
    {
      label: { en: 'Reset value' },
      action: 'reset'
    },
    {
      label: { en: 'Set value' },
      action: 'setValue',
      args: [
        {
          name: 'newValue',
          type: 'string'
        }
      ]
    }
  ],

  // Propriedades editáveis
  properties: {
    // Propriedades vão aqui
  }
};
```

### Seção: editor

```js
editor: {
  label: {
    en: 'Component Name',
    pt: 'Nome do Componente'
  },
  icon: 'icon-name'  // Nome do ícone
}
```

### Seção: triggerEvents

Define eventos que o componente pode disparar:

```js
triggerEvents: [
  {
    name: 'stepChange',
    label: { en: 'On step change' },
    event: {
      previousStep: 0,
      currentStep: 1,
      direction: 'next'
    },
    default: true  // Evento padrão quando componente é adicionado
  }
]
```

### Seção: actions

Define ações que workflows podem executar:

```js
actions: [
  {
    label: { en: 'Go to next step' },
    action: 'nextStep'  // Nome da função no setup()
  },
  {
    label: { en: 'Go to specific step' },
    action: 'goToStep',
    args: [
      {
        name: 'stepIndex',
        type: 'number'
      }
    ]
  }
]
```

No componente Vue, implemente e retorne as funções:

```js
setup(props, { emit }) {
  const nextStep = () => {
    // Lógica
  };

  const goToStep = (stepIndex) => {
    // Lógica
  };

  return {
    nextStep,
    goToStep
  };
}
```

### Seção: properties

Define todas as propriedades editáveis:

```js
properties: {
  title: {
    label: { en: 'Title' },
    type: 'Text',
    section: 'settings',
    bindable: true,
    defaultValue: 'My Title',
    options: {
      placeholder: 'Enter title'
    },
    /* wwEditor:start */
    bindingValidation: {
      type: 'string',
      tooltip: 'The title text'
    },
    propertyHelp: {
      tooltip: 'Main title displayed at the top'
    }
    /* wwEditor:end */
  }
}
```

---

## Dropzones

Dropzones permitem que usuários arrastem e soltem elementos dentro do seu componente.

### Dropzone Simples

**1. Configuração (ww-config.js):**

```js
properties: {
  header: {
    hidden: true,  // Não aparece no painel
    defaultValue: []  // Array vazio
  }
}
```

**2. Template (wwElement.vue):**

```vue
<wwLayout path="header" direction="column" class="header" />
```

**3. Estilos (obrigatório):**

```scss
.header {
  min-height: 20px;  // Mínimo para área clicável
  display: flex;
  flex-direction: column;
}
```

### Dropzone com Customização

```vue
<wwLayout path="cards" direction="row" class="cards">
  <template v-slot="{ item }">
    <wwLayoutItem class="card">
      <div class="card-header">
        <!-- Conteúdo customizado -->
      </div>
      <wwObject v-bind="item" />
    </wwLayoutItem>
  </template>
</wwLayout>
```

```scss
.cards {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.card {
  border: 1px dashed #ccc;
  padding: 16px;
  border-radius: 8px;
  min-width: 100px;
}
```

### Dropzone com Binding Repetível

Permite binding de uma collection que repete o primeiro elemento:

```js
properties: {
  cards: {
    hidden: true,
    bindable: 'repeatable',
    defaultValue: []
  }
}
```

Quando usuário fizer bind de um array, `wwLayout` automaticamente repete o primeiro filho para cada item.

---

## Propriedades Especiais

### 1. Propriedades Responsivas

Valores diferentes por breakpoint:

```js
fontSize: {
  label: { en: 'Font Size' },
  type: 'Length',
  responsive: true,  // Ativa modo responsivo
  defaultValue: '16px',
  options: {
    unitChoices: [
      { value: 'px', label: 'px', min: 1, max: 100 }
    ]
  }
}
```

No componente, WeWeb resolve automaticamente baseado no breakpoint atual:

```js
const style = computed(() => ({
  fontSize: props.content.fontSize  // Já vem com valor correto
}));
```

### 2. Propriedades com Binding

Permite que usuários façam binding de dados dinâmicos:

```js
title: {
  label: { en: 'Title' },
  type: 'Text',
  bindable: true,
  defaultValue: 'Default Title',
  /* wwEditor:start */
  bindingValidation: {
    type: 'string',
    tooltip: 'A string value for the title'
  }
  /* wwEditor:end */
}
```

**IMPORTANTE:** Código deve ser defensivo pois usuário pode enviar qualquer tipo:

```js
const safeTitle = computed(() => {
  const title = props.content.title;
  return typeof title === 'string' ? title : String(title || '');
});
```

### 3. Propriedades Multi-idioma

Suporte a múltiplos idiomas:

```js
welcomeMessage: {
  label: { en: 'Welcome Message' },
  type: 'Text',
  multiLang: true,  // Ativa multi-idioma
  defaultValue: 'Welcome'
}
```

No template:

```vue
<h1>{{ wwLib.wwLang.getText(content.welcomeMessage) }}</h1>
```

### 4. Propriedades Condicionais

Mostra/oculta propriedades baseado em outras:

```js
step2Label: {
  label: { en: 'Step 2 - Label' },
  type: 'Text',
  defaultValue: 'Step 2',
  hidden: content => (content.numberOfSteps || 3) < 2
}
```

A função `hidden` recebe o objeto `content` atual e retorna boolean.

---

## Tipos de Propriedades

### Text

Campo de texto simples:

```js
title: {
  label: { en: 'Title' },
  type: 'Text',
  defaultValue: 'My Title',
  bindable: true,
  options: {
    placeholder: 'Enter title here'
  }
}
```

### Number

Campo numérico:

```js
numberOfSteps: {
  label: { en: 'Number of Steps' },
  type: 'Number',
  defaultValue: 3,
  bindable: true,
  options: {
    min: 1,
    max: 10
  }
}
```

### Color

Seletor de cor:

```js
backgroundColor: {
  label: { en: 'Background Color' },
  type: 'Color',
  defaultValue: '#ffffff',
  bindable: true,
  options: {
    nullable: true  // Permite valor nulo
  }
}
```

### OnOff

Toggle booleano:

```js
showHeader: {
  label: { en: 'Show Header' },
  type: 'OnOff',
  defaultValue: true,
  bindable: true
}
```

### Length

Valores com unidade (px, %, em, etc):

```js
padding: {
  label: { en: 'Padding' },
  type: 'Length',
  defaultValue: '16px',
  bindable: true,
  options: {
    unitChoices: [
      { value: 'px', label: 'px', min: 0, max: 100 },
      { value: '%', label: '%', min: 0, max: 100 },
      { value: 'em', label: 'em', min: 0, max: 10 }
    ]
  }
}
```

Para valores compostos (tipo padding com múltiplos valores):

```js
buttonPadding: {
  label: { en: 'Button Padding' },
  type: 'Length',
  defaultValue: '12px 24px',
  bindable: true
}
```

### Element

Dropzone para um único elemento:

```js
headerElement: {
  label: { en: 'Header Content' },
  type: 'Element',
  defaultValue: {
    isWwObject: true,
    type: 'ww-text',
    name: 'Header Text'
  },
  options: {
    placeholder: 'Add header content'
  }
}
```

No template:

```vue
<wwElement v-bind="content.headerElement" />
```

### TextSelect

Dropdown de seleção:

```js
alignment: {
  label: { en: 'Alignment' },
  type: 'TextSelect',
  defaultValue: 'left',
  bindable: true,
  options: {
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' }
    ]
  }
}
```

### TextRadioGroup

Radio buttons com ícones:

```js
orientation: {
  label: { en: 'Orientation' },
  type: 'TextRadioGroup',
  defaultValue: 'horizontal',
  bindable: true,
  options: {
    choices: [
      {
        value: 'horizontal',
        title: 'Horizontal',
        icon: 'align-horizontal-distribute-center'
      },
      {
        value: 'vertical',
        title: 'Vertical',
        icon: 'align-vertical-distribute-center'
      }
    ]
  }
}
```

---

## State Management

### Variáveis de Componente

WeWeb fornece um sistema de variáveis que são expostas ao editor:

```js
import { computed } from 'vue';

setup(props) {
  // Criar variável de componente
  const { value: currentStep, setValue: setCurrentStep } = wwLib.wwVariable.useComponentVariable({
    uid: props.uid,
    name: 'currentStep',
    type: 'number',
    defaultValue: 0
  });

  // Usar como ref reativa
  const nextStep = () => {
    setCurrentStep(currentStep.value + 1);
  };

  // Usar em computed
  const isLastStep = computed(() => {
    return currentStep.value === props.content.numberOfSteps - 1;
  });

  return {
    currentStep,
    nextStep,
    isLastStep
  };
}
```

### Tipos de Variáveis

- `'string'` - Texto
- `'number'` - Número
- `'boolean'` - Booleano
- `'array'` - Array
- `'object'` - Objeto

### Variáveis Múltiplas

```js
const { value: isCompleted, setValue: setIsCompleted } = wwLib.wwVariable.useComponentVariable({
  uid: props.uid,
  name: 'isCompleted',
  type: 'boolean',
  defaultValue: false
});

const { value: validationStates, setValue: setValidationStates } = wwLib.wwVariable.useComponentVariable({
  uid: props.uid,
  name: 'validationStates',
  type: 'array',
  defaultValue: []
});
```

Essas variáveis ficam acessíveis no editor via:
```
variables['uid-currentStep']
variables['uid-isCompleted']
variables['uid-validationStates']
```

### IMPORTANTE: Variáveis Precisam Ser Atualizadas em TODOS os Handlers

**Problema comum:** A variável é definida, mas permanece `null` porque só é atualizada em um handler específico.

**Exemplo:** Se você tem uma variável `selectedClientId` que deve armazenar o ID do item clicado:

```js
// ❌ ERRADO: Só atualiza no handleClientClick
const handleClientClick = (client) => {
  setSelectedClientId(client.id);
  // ...
};

const handleEditClient = (client) => {
  // selectedClientId NÃO é atualizado aqui!
  emit('trigger-event', { name: 'editClient', event: { client } });
};
```

```js
// ✅ CORRETO: Atualiza em TODOS os handlers que precisam do ID
const handleClientClick = (client) => {
  const clientId = client?.id ? String(client.id) : null;
  setSelectedClientId(clientId);
  // ...
};

const handleEditClient = (client) => {
  // TAMBÉM atualiza selectedClientId aqui!
  const clientId = client?.id ? String(client.id) : null;
  setSelectedClientId(clientId);

  if (isEditing.value) return;
  emit('trigger-event', { name: 'editClient', event: { client } });
};

const handleDeleteClient = (client) => {
  // E aqui também!
  const clientId = client?.id ? String(client.id) : null;
  setSelectedClientId(clientId);

  if (isEditing.value) return;
  emit('trigger-event', { name: 'deleteClient', event: { client } });
};
```

**Dica:** Atualize a variável de componente **ANTES** da verificação `isEditing.value` para que o valor seja armazenado mesmo no modo editor.

### Não é Necessário Declarar Variáveis no ww-config.js

As variáveis criadas com `wwLib.wwVariable.useComponentVariable` são automaticamente expostas ao WeWeb. **Não é necessário** adicionar uma seção `variables` no `ww-config.js`.

```js
// Isso é suficiente - a variável fica disponível automaticamente
const { value: selectedClientId, setValue: setSelectedClientId } = wwLib.wwVariable.useComponentVariable({
  uid: props.uid,
  name: 'selectedClientId',
  type: 'string',
  defaultValue: null
});
```

---

## Events e Actions

### Events (Eventos que o componente dispara)

#### 1. Definir no ww-config.js

```js
triggerEvents: [
  {
    name: 'stepChange',
    label: { en: 'On step change' },
    event: {
      previousStep: 0,
      currentStep: 1,
      direction: 'next'
    },
    default: true
  },
  {
    name: 'submit',
    label: { en: 'On form submit' },
    event: {
      formData: {},
      isValid: true
    }
  }
]
```

#### 2. Disparar no componente

```js
setup(props, { emit }) {
  const goToStep = (newStep) => {
    const oldStep = currentStep.value;
    setCurrentStep(newStep);

    emit('trigger-event', {
      name: 'stepChange',
      event: {
        previousStep: oldStep,
        currentStep: newStep,
        direction: newStep > oldStep ? 'next' : 'previous'
      }
    });
  };

  return { goToStep };
}
```

### Actions (Ações que workflows podem executar)

#### 1. Definir no ww-config.js

```js
actions: [
  {
    label: { en: 'Reset form' },
    action: 'resetForm'
  },
  {
    label: { en: 'Set step validation' },
    action: 'setStepValidation',
    args: [
      {
        name: 'stepIndex',
        type: 'number'
      },
      {
        name: 'isValid',
        type: 'boolean'
      }
    ]
  }
]
```

#### 2. Implementar no componente

```js
setup(props, { emit }) {
  const { value: currentStep, setValue: setCurrentStep } = wwLib.wwVariable.useComponentVariable({
    uid: props.uid,
    name: 'currentStep',
    type: 'number',
    defaultValue: 0
  });

  const { value: validationStates, setValue: setValidationStates } = wwLib.wwVariable.useComponentVariable({
    uid: props.uid,
    name: 'validationStates',
    type: 'array',
    defaultValue: []
  });

  // Action sem argumentos
  const resetForm = () => {
    if (isEditing.value) return;
    setCurrentStep(0);
    setValidationStates([]);

    emit('trigger-event', {
      name: 'reset',
      event: {}
    });
  };

  // Action com argumentos
  const setStepValidation = (stepIndex, isValid) => {
    if (stepIndex >= 0 && stepIndex < validationStates.value.length) {
      const newStates = [...validationStates.value];
      newStates[stepIndex] = isValid;
      setValidationStates(newStates);
      return true;
    }
    return false;
  };

  // IMPORTANTE: Retornar as funções
  return {
    resetForm,
    setStepValidation
  };
}
```

---

## Boas Práticas

### 1. Organização de Código

#### Separar Lógica Complexa

```js
setup(props, { emit }) {
  // 1. Variáveis de componente
  const { value: currentStep, setValue: setCurrentStep } = wwLib.wwVariable.useComponentVariable({...});

  // 2. Refs locais
  const showError = ref(false);

  // 3. Computed properties
  const visibleSteps = computed(() => {
    return steps.value.filter(step => !step.hidden);
  });

  const progressPercentage = computed(() => {
    const total = visibleSteps.value?.length || 1;
    return ((currentStep.value + 1) / total) * 100;
  });

  // 4. Watchers
  watch(() => props.content.numberOfSteps, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      // Lógica de ajuste
    }
  });

  // 5. Métodos
  const nextStep = () => {
    // Lógica
  };

  // 6. Return
  return {
    currentStep,
    visibleSteps,
    progressPercentage,
    nextStep
  };
}
```

#### Sub-componentes para Reutilização

```js
// src/components/ProgressBar.vue
export default {
  name: 'ProgressBar',
  props: {
    progress: { type: Number, required: true },
    height: { type: String, default: '8px' },
    backgroundColor: { type: String, default: '#e0e0e0' },
    fillColor: { type: String, default: '#007bff' }
  }
};
```

```js
// src/wwElement.vue
import ProgressBar from './components/ProgressBar.vue';

export default {
  components: {
    ProgressBar
  }
};
```

### 2. Performance

#### v-show vs v-if

Use `v-show` quando elementos alternam frequentemente (preserva estado):

```vue
<div v-show="isActive" class="content">
  <input v-model="userInput" />
</div>
```

Use `v-if` quando elementos raramente aparecem:

```vue
<div v-if="showAdvancedOptions" class="advanced">
  <!-- Conteúdo pesado -->
</div>
```

#### Computed Properties

Sempre prefira computed para valores derivados:

```js
// BOM
const isValid = computed(() => {
  return props.content.email && props.content.email.includes('@');
});

// RUIM
const isValid = ref(false);
watch(() => props.content.email, (email) => {
  isValid.value = email && email.includes('@');
});
```

### 3. Responsividade

WeWeb gerencia automaticamente quando `responsive: true`:

```js
// ww-config.js
fontSize: {
  type: 'Length',
  responsive: true,
  defaultValue: '16px'
}

// Componente - não precisa de lógica manual
const style = computed(() => ({
  fontSize: props.content.fontSize  // WeWeb resolve breakpoint
}));
```

### 4. Validação e Segurança

Sempre validar dados quando `bindable: true`:

```js
const safeValue = computed(() => {
  const val = props.content.value;

  // Tipo esperado
  if (typeof val !== 'string') {
    return String(val || '');
  }

  // Limites
  if (val.length > 1000) {
    return val.substring(0, 1000);
  }

  return val;
});
```

### 5. Acessibilidade

```vue
<button
  class="nav-button"
  :aria-label="previousButtonLabel"
  :disabled="isFirstStep"
  @click="previousStep"
>
  {{ previousButtonLabel }}
</button>
```

### 6. Editor vs Preview

Sempre verificar modo editor antes de ações:

```js
const handleClick = () => {
  if (isEditing.value) return;  // Não executar no editor

  // Lógica da ação
  emit('trigger-event', {
    name: 'click',
    event: { timestamp: Date.now() }
  });
};
```

### 7. Estilos

#### Evitar Conflitos

Use classes específicas e scoped styles:

```vue
<style scoped lang="scss">
.my-component {
  // Estilos isolados

  .header {
    // Nested
  }
}
</style>
```

#### Evitar Propriedades Gerenciadas pelo WeWeb

Não defina no componente (WeWeb gerencia):
- `padding` (a menos que seja interno)
- `margin`
- `width` / `height` (do root element)

#### CSS Variables para Valores Dinâmicos

```js
const containerStyle = computed(() => ({
  '--gap': props.content.gap || '16px',
  '--color': props.content.color || '#000'
}));
```

```scss
.container {
  gap: var(--gap);
  color: var(--color);
}
```

---

## Exemplo Completo

### Componente: Simple Card List

#### ww-config.js

```js
export default {
  editor: {
    label: {
      en: 'Card List'
    },
    icon: 'view-grid'
  },

  triggerEvents: [
    {
      name: 'cardClick',
      label: { en: 'On card click' },
      event: {
        cardIndex: 0,
        cardData: {}
      }
    }
  ],

  actions: [
    {
      label: { en: 'Add card' },
      action: 'addCard'
    },
    {
      label: { en: 'Remove card' },
      action: 'removeCard',
      args: [
        {
          name: 'cardIndex',
          type: 'number'
        }
      ]
    }
  ],

  properties: {
    // Layout
    columns: {
      label: { en: 'Columns' },
      type: 'Number',
      section: 'settings',
      defaultValue: 3,
      responsive: true,
      options: {
        min: 1,
        max: 6
      }
    },

    gap: {
      label: { en: 'Gap between cards' },
      type: 'Length',
      section: 'style',
      defaultValue: '16px',
      responsive: true,
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 0, max: 100 }
        ]
      }
    },

    // Cards
    cards: {
      hidden: true,
      bindable: 'repeatable',
      defaultValue: []
    },

    // Card Style
    cardPadding: {
      label: { en: 'Card Padding' },
      type: 'Length',
      section: 'style',
      defaultValue: '16px'
    },

    cardBackgroundColor: {
      label: { en: 'Card Background' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      options: {
        nullable: true
      }
    },

    cardBorderRadius: {
      label: { en: 'Card Border Radius' },
      type: 'Length',
      section: 'style',
      defaultValue: '8px',
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 0, max: 50 }
        ]
      }
    },

    // Interactivity
    enableCardClick: {
      label: { en: 'Enable card click' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false
    }
  }
};
```

#### src/wwElement.vue

```vue
<template>
  <div class="card-list" :style="containerStyle">
    <wwLayout path="cards" :style="layoutStyle" class="cards-grid">
      <template v-slot="{ item, index }">
        <wwLayoutItem
          class="card"
          :class="{ clickable: enableCardClick }"
          :style="cardStyle"
          @click="handleCardClick(index, item)"
        >
          <wwObject v-bind="item" />
        </wwLayoutItem>
      </template>
    </wwLayout>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'CardList',
  props: {
    content: {
      type: Object,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    /* wwEditor:start */
    wwEditorState: {
      type: Object,
      required: true
    }
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Detectar modo editor
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      return false;
    });

    // Computed styles
    const containerStyle = computed(() => ({
      '--gap': props.content.gap || '16px',
      '--columns': props.content.columns || 3
    }));

    const layoutStyle = computed(() => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${props.content.columns || 3}, 1fr)`,
      gap: props.content.gap || '16px'
    }));

    const cardStyle = computed(() => ({
      padding: props.content.cardPadding || '16px',
      backgroundColor: props.content.cardBackgroundColor || '#ffffff',
      borderRadius: props.content.cardBorderRadius || '8px'
    }));

    const enableCardClick = computed(() => props.content.enableCardClick);

    // Methods
    const handleCardClick = (index, item) => {
      if (isEditing.value) return;
      if (!props.content.enableCardClick) return;

      emit('trigger-event', {
        name: 'cardClick',
        event: {
          cardIndex: index,
          cardData: item
        }
      });
    };

    const addCard = () => {
      if (isEditing.value) return;

      // Lógica para adicionar card
      // Normalmente isso seria feito através de workflow
      // que manipula a collection ligada a 'cards'
    };

    const removeCard = (cardIndex) => {
      if (isEditing.value) return;

      // Lógica para remover card
      // Normalmente isso seria feito através de workflow
    };

    return {
      isEditing,
      containerStyle,
      layoutStyle,
      cardStyle,
      enableCardClick,
      handleCardClick,
      addCard,
      removeCard
    };
  }
};
</script>

<style scoped lang="scss">
.card-list {
  width: 100%;

  .cards-grid {
    width: 100%;
  }

  .card {
    border: 1px solid #e0e0e0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &.clickable {
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
```

---

## Build e Desenvolvimento

### package.json

```json
{
  "name": "my-component",
  "version": "1.0.0",
  "scripts": {
    "build": "weweb build",
    "serve": "weweb serve"
  }
}
```

### Comandos

```bash
# Desenvolvimento (hot reload)
npm run serve

# Build para produção
npm run build
```

---

## Recursos Adicionais

### Comentários Especiais do Editor

Código que só executa no editor:

```js
/* wwEditor:start */
// Este código só roda no editor WeWeb
console.log('Editor mode');
/* wwEditor:end */
```

### Biblioteca wwLib

Funções utilitárias disponíveis:

```js
// Variáveis de componente
wwLib.wwVariable.useComponentVariable({...})

// Tradução
wwLib.wwLang.getText(translatedContent)

// E outras utilidades...
```

### Dicas de Debugging

```js
// Sempre verificar conteúdo no console durante desenvolvimento
watch(() => props.content, (newContent) => {
  console.log('Content changed:', newContent);
}, { deep: true });

// Verificar modo editor
console.log('Is editing:', isEditing.value);

// Verificar variáveis expostas
console.log('Component variables:', {
  currentStep: currentStep.value,
  isCompleted: isCompleted.value
});
```

---

## Trabalhando com Collections Paginadas (Server-Side)

### Estrutura de uma Collection WeWeb

Quando você vincula uma collection paginada do WeWeb, ela tem esta estrutura:

```js
{
  id: "uuid",
  name: "Minha Collection",
  type: "collection",
  isFetching: false,
  isFetched: true,
  limit: 10,        // Itens por página
  total: 100,       // Total de itens
  offset: 0,        // Posição inicial da página atual
  data: [           // Array com os dados (sparse array)
    { id: "1", nome: "Item 1" },  // Posição 0
    { id: "2", nome: "Item 2" },  // Posição 1
    null,                          // Posições não carregadas
    null,
    // ...
  ]
}
```

### IMPORTANTE: O Problema do Proxy no `limit`

O `limit` pode vir como um **Proxy** (objeto de fórmula WeWeb) ao invés de número:

```js
// ❌ ERRADO: limit pode ser Proxy
const limit = collection.limit || 10;  // Proxy é "truthy", então usa o Proxy

// ✅ CORRETO: Usar propriedade separada para o limit
// No ww-config.js, adicionar:
itemsPerPage: {
  label: { en: 'Items Per Page' },
  type: 'Number',
  bindable: true,
  defaultValue: 10
}

// No componente, usar a propriedade:
const limit = props.content?.itemsPerPage || 10;
```

### Extraindo Dados da Página Atual

```js
const clients = computed(() => {
  const collection = props.content?.clients;

  if (!collection) return [];

  // Support WeWeb collection object with data property
  if (collection.data && Array.isArray(collection.data)) {
    const offset = typeof collection.offset === 'number' ? collection.offset : 0;

    // Get limit from component property - reliable source
    const limit = props.content?.itemsPerPage || 10;

    // Get items for current page: from offset, limited by limit
    const pageItems = [];
    const endIndex = Math.min(offset + limit, collection.data.length);

    for (let i = offset; i < endIndex; i++) {
      const item = collection.data[i];
      if (item != null) {
        pageItems.push(item);
      }
    }

    return pageItems;
  }

  // Fallback: support direct array binding
  if (Array.isArray(collection)) {
    return collection.filter(item => item != null);
  }

  return [];
});
```

### Paginação Controlada Externamente

Quando a paginação é controlada por outro componente (como um paginator), seu componente apenas:

1. Recebe a collection inteira
2. Lê `offset` da collection para saber a página atual
3. Usa `itemsPerPage` (propriedade do componente) para saber o limite
4. Extrai apenas os itens da janela atual do array `data`

```js
// ww-config.js
properties: {
  clients: {
    label: { en: 'Clients Collection' },
    type: 'Object',  // Object, não Array!
    bindable: true,
    defaultValue: null
  },
  itemsPerPage: {
    label: { en: 'Items Per Page' },
    type: 'Number',
    bindable: true,
    defaultValue: 10
  }
}
```

### APIs do wwLib.wwCollection

Algumas funções podem não existir em todas versões:

```js
// ✅ CORRETO: Verificar antes de usar
if (typeof wwLib.wwCollection.setLimit === 'function') {
  wwLib.wwCollection.setLimit(collectionId, newLimit);
}

if (typeof wwLib.wwCollection.setOffset === 'function') {
  wwLib.wwCollection.setOffset(collectionId, newOffset);
}

// Função que geralmente existe:
const paginationOptions = wwLib.wwCollection.getPaginationOptions(collectionId);
```

---

## Conclusão

A criação de componentes WeWeb combina:

1. **Vue 3 Composition API** para lógica e reatividade
2. **ww-config.js** para definir interface editável
3. **Componentes especiais WeWeb** (wwLayout, wwElement, wwObject)
4. **Sistema de variáveis** para estado exposto
5. **Events e Actions** para integração com workflows

Seguindo os padrões e boas práticas deste guia, você conseguirá criar componentes robustos, reutilizáveis e bem integrados ao ecossistema WeWeb.
