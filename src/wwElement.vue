<template>
  <div class="metrics-slider-container" :style="containerStyle">
    <!-- Slider Track -->
    <div class="slider-wrapper">
      <div class="slider-track" :style="sliderTrackStyle">
        <MetricCard
          v-for="(metric, index) in metricsData"
          :key="metric.id"
          :metric="metric"
          :is-active="currentIndex === index"
          :primary-color="primaryColor"
          :accent-color="accentColor"
          :background-color="cardBackgroundColor"
          :border-color="cardBorderColor"
          class="metric-card-slot"
        />
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div v-if="showNavigationButtons && metricsData.length > 1" class="navigation-controls">
      <button
        class="nav-button prev-button"
        :disabled="currentIndex === 0"
        :style="navButtonStyle"
        @click="previousMetric"
        aria-label="Métrica anterior"
      >
        <span class="button-text">←</span>
      </button>

      <!-- Indicators -->
      <div v-if="showIndicators" class="indicators">
        <button
          v-for="(metric, index) in metricsData"
          :key="`indicator-${metric.id}`"
          class="indicator"
          :class="{ active: currentIndex === index }"
          :style="getIndicatorStyle(index)"
          @click="goToMetric(index)"
          :aria-label="`Ir para métrica ${index + 1}`"
        ></button>
      </div>

      <button
        class="nav-button next-button"
        :disabled="currentIndex === metricsData.length - 1"
        :style="navButtonStyle"
        @click="nextMetric"
        aria-label="Próxima métrica"
      >
        <span class="button-text">→</span>
      </button>
    </div>

    <!-- Counter info -->
    <div v-if="showCounter && metricsData.length > 1" class="counter-info">
      {{ currentIndex + 1 }} de {{ metricsData.length }}
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import MetricCard from './components/MetricCard.vue';

export default {
  name: 'MetricsSlider',
  components: {
    MetricCard
  },
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
    const currentIndex = ref(0);

    // Detectar modo editor
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      return false;
    });

    // Dados de métricas - calculados automaticamente
    const metricsData = computed(() => {
      // Obter dados com fallback para arrays vazios
      let agendamentos = props.content?.agendamentosCollection;
      let clientes = props.content?.clientesCollection;

      // Converter para arrays se necessário
      agendamentos = Array.isArray(agendamentos) ? agendamentos : [];
      clientes = Array.isArray(clientes) ? clientes : [];

      // Dados de teste quando coleções estão vazias (para visualização no editor)
      if (agendamentos.length === 0 && clientes.length === 0) {
        agendamentos = [
          { id: 1, data_inicio: new Date().toISOString(), titulo: 'Test' },
          { id: 2, data_inicio: new Date().toISOString(), titulo: 'Test' },
          { id: 3, data_inicio: new Date().toISOString(), titulo: 'Test' }
        ];
        clientes = [
          { id: 1, created_at: new Date().toISOString(), nome: 'Client' },
          { id: 2, created_at: new Date().toISOString(), nome: 'Client' }
        ];
      }

      const hoje = new Date();
      const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      // Filtro para agendamentos deste mês
      const agendamentosEstesMes = agendamentos.filter(a => {
        try {
          const data = new Date(a.data_inicio);
          return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
        } catch {
          return false;
        }
      }).length;

      // Filtro para agendamentos próximos 30 dias
      const agendamentosFuturos = agendamentos.filter(a => {
        try {
          const data = new Date(a.data_inicio);
          return data >= hoje && data <= em30Dias;
        } catch {
          return false;
        }
      }).length;

      // Filtro para clientes novos este mês
      const clientesNovosEstesMes = clientes.filter(c => {
        try {
          const data = new Date(c.created_at);
          return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
        } catch {
          return false;
        }
      }).length;

      // Retornar as 5 métricas
      return [
        {
          id: 'total-agendamentos',
          label: 'Total de Agendamentos',
          value: agendamentos.length,
          description: 'Todos os tempos',
          icon: '📅'
        },
        {
          id: 'agendamentos-mes',
          label: 'Este Mês',
          value: agendamentosEstesMes,
          description: 'Agendamentos',
          icon: '📆'
        },
        {
          id: 'agendamentos-futuros',
          label: 'Próximos 30 dias',
          value: agendamentosFuturos,
          description: 'Futuros',
          icon: '⏰'
        },
        {
          id: 'total-clientes',
          label: 'Total de Clientes',
          value: clientes.length,
          description: 'Todos os tempos',
          icon: '👥'
        },
        {
          id: 'clientes-novos',
          label: 'Clientes Novos',
          value: clientesNovosEstesMes,
          description: 'Este mês',
          icon: '⭐'
        }
      ];
    });

    // Cores
    const primaryColor = computed(() => props.content?.primaryColor || '#081B4E');
    const accentColor = computed(() => props.content?.accentColor || '#081B4E');
    const cardBackgroundColor = computed(() => props.content?.cardBackgroundColor || '#ffffff');
    const cardBorderColor = computed(() => props.content?.cardBorderColor || '#e8eef7');

    // Opções de exibição
    const showNavigationButtons = computed(() => props.content?.showNavigationButtons !== false);
    const showIndicators = computed(() => props.content?.showIndicators !== false);
    const showCounter = computed(() => props.content?.showCounter !== false);

    // Espaçamento
    const containerGap = computed(() => props.content?.containerGap || '16px');
    const cardGap = computed(() => props.content?.cardGap || '20px');
    const cardHeight = computed(() => props.content?.cardHeight || '220px');
    const cardWidth = computed(() => props.content?.cardWidth || '100%');

    // Computeds de estilo
    const containerStyle = computed(() => ({
      display: 'flex',
      flexDirection: 'column',
      gap: containerGap.value,
      width: '100%'
    }));

    const sliderTrackStyle = computed(() => ({
      display: 'flex',
      gap: cardGap.value,
      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: `translateX(calc(-${currentIndex.value} * (${cardWidth.value} + ${cardGap.value})))`,
      width: `${metricsData.value.length * 100}%`
    }));

    const navButtonStyle = computed(() => ({
      backgroundColor: primaryColor.value,
      color: '#ffffff',
      borderRadius: '8px',
      border: 'none',
      padding: '10px 12px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '40px',
      minHeight: '40px'
    }));

    const getIndicatorStyle = (index) => ({
      backgroundColor: index === currentIndex.value ? primaryColor.value : '#d1d5db',
      transition: 'all 0.3s ease',
      transform: index === currentIndex.value ? 'scale(1.2)' : 'scale(1)'
    });

    // Métodos
    const nextMetric = () => {
      if (currentIndex.value < metricsData.value.length - 1) {
        currentIndex.value++;
        emitEvent('nextMetric');
      }
    };

    const previousMetric = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
        emitEvent('previousMetric');
      }
    };

    const goToMetric = (index) => {
      if (!isEditing.value) {
        currentIndex.value = index;
        emitEvent('goToMetric', { index });
      }
    };

    const emitEvent = (eventName, payload = {}) => {
      if (isEditing.value) return;

      emit('trigger-event', {
        name: eventName,
        event: {
          currentIndex: currentIndex.value,
          currentMetric: metricsData.value[currentIndex.value],
          ...payload
        }
      });
    };

    // Exposar funções para actions no WeWeb
    const nextMetricAction = () => {
      if (!isEditing.value) nextMetric();
    };

    const previousMetricAction = () => {
      if (!isEditing.value) previousMetric();
    };

    const goToMetricAction = (index) => {
      if (!isEditing.value && index >= 0 && index < metricsData.value.length) {
        goToMetric(index);
      }
    };

    // Keyboard navigation
    const handleKeydown = (event) => {
      if (isEditing.value) return;

      if (event.key === 'ArrowLeft') {
        previousMetric();
      } else if (event.key === 'ArrowRight') {
        nextMetric();
      }
    };

    // Expor variáveis de componente
    const { value: currentMetricIndex, setValue: setCurrentMetricIndex } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'currentMetricIndex',
      type: 'number',
      defaultValue: 0
    });

    const { value: currentMetricData, setValue: setCurrentMetricData } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'currentMetricData',
      type: 'object',
      defaultValue: null
    });

    const { value: totalMetrics, setValue: setTotalMetrics } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'totalMetrics',
      type: 'number',
      defaultValue: 0
    });

    // Atualizar variáveis quando índice muda
    watch(currentIndex, (newIndex) => {
      setCurrentMetricIndex(newIndex);
      setCurrentMetricData(metricsData.value[newIndex] || null);
      setTotalMetrics(metricsData.value.length);
    });

    watch(metricsData, (newData) => {
      setTotalMetrics(newData.length);
    });

    // Inicializar
    setTotalMetrics(metricsData.value.length);
    setCurrentMetricData(metricsData.value[0] || null);

    // Keyboard listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
    }

    return {
      currentIndex,
      metricsData,
      primaryColor,
      accentColor,
      cardBackgroundColor,
      cardBorderColor,
      showNavigationButtons,
      showIndicators,
      showCounter,
      containerStyle,
      sliderTrackStyle,
      navButtonStyle,
      getIndicatorStyle,
      nextMetric,
      previousMetric,
      goToMetric,
      nextMetricAction,
      previousMetricAction,
      goToMetricAction
    };
  }
};
</script>

<style scoped lang="scss">
.metrics-slider-container {
  display: flex;
  flex-direction: column;
  gap: inherit;
  width: 100%;
  font-family: inherit;
  max-width: 100%;

  .slider-wrapper {
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    position: relative;
    background: #f9fafb;

    .slider-track {
      display: flex;
      width: 100%;
      gap: inherit;
      transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform;

      .metric-card-slot {
        flex: 0 0 100%;
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
      }
    }
  }

  .navigation-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 2%, 16px);
    flex-wrap: wrap;
    padding: 0 8px;

    .nav-button {
      background-color: inherit;
      color: inherit;
      border: none;
      border-radius: 8px;
      padding: clamp(8px, 1.5%, 12px);
      cursor: pointer;
      font-size: clamp(14px, 2.5vw, 16px);
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: clamp(36px, 8vw, 44px);
      min-height: clamp(36px, 8vw, 44px);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(8, 27, 78, 0.15);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .button-text {
        display: inline-block;
        line-height: 1;
      }

      @media (max-width: 480px) {
        padding: 8px 10px;
        min-width: 36px;
        min-height: 36px;
      }
    }

    .indicators {
      display: flex;
      gap: clamp(6px, 1%, 10px);
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;

      .indicator {
        width: clamp(6px, 1.5vw, 10px);
        height: clamp(6px, 1.5vw, 10px);
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: inherit;

        &:hover {
          transform: scale(1.3);
        }

        &.active {
          transform: scale(1.2);
        }

        @media (max-width: 480px) {
          width: 6px;
          height: 6px;
        }
      }
    }
  }

  .counter-info {
    text-align: center;
    font-size: clamp(12px, 2vw, 14px);
    color: #6b7280;
    font-weight: 500;
    letter-spacing: -0.2px;
    padding: 0 8px;
  }

  @media (max-width: 768px) {
    gap: max(12px, calc(var(--containerGap, 16px) * 0.75));

    .slider-wrapper {
      border-radius: 6px;
    }

    .navigation-controls {
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    gap: 12px;

    .slider-wrapper {
      border-radius: 6px;
    }

    .navigation-controls {
      gap: 10px;
      padding: 0 4px;

      .indicators {
        gap: 6px;
      }
    }
  }
}
</style>
