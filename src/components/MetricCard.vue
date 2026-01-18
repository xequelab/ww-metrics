<template>
  <div class="metric-card" :style="cardStyle">
    <!-- Main Content -->
    <div class="metric-content">
      <div class="metric-header">
        <div v-if="metric.icon" class="metric-icon" :style="{ color: iconColor }">
          <!-- Icon placeholder - users can bind icon components -->
          <span class="icon-placeholder">📊</span>
        </div>
        <div class="metric-texts">
          <h3 class="metric-label">{{ metric.label }}</h3>
          <p v-if="metric.description" class="metric-description">{{ metric.description }}</p>
        </div>
      </div>

      <!-- Value with animation -->
      <div class="metric-value-section">
        <span class="metric-value">{{ animatedValue }}</span>
      </div>
    </div>

    <!-- Bottom accent line -->
    <div class="metric-accent" :style="{ backgroundColor: accentColor }"></div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
  name: 'MetricCard',
  props: {
    metric: {
      type: Object,
      required: true,
      validator: (obj) => {
        return obj.id && obj.label && typeof obj.value !== 'undefined';
      }
    },
    isActive: {
      type: Boolean,
      default: false
    },
    primaryColor: {
      type: String,
      default: '#081B4E'
    },
    accentColor: {
      type: String,
      default: '#081B4E'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    borderColor: {
      type: String,
      default: '#e8eef7'
    }
  },
  setup(props) {
    const displayValue = ref(0);

    // Animar número quando ativo
    watch(
      () => props.isActive,
      (newIsActive) => {
        if (newIsActive) {
          animateValue();
        }
      },
      { immediate: true }
    );

    const animateValue = () => {
      const targetValue = parseInt(props.metric.value) || 0;
      const duration = 600; // ms
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        displayValue.value = Math.floor(startValue + (targetValue - startValue) * progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          displayValue.value = targetValue;
        }
      };

      displayValue.value = 0;
      animate();
    };

    const animatedValue = computed(() => {
      const val = props.metric.value;
      if (typeof val === 'number') {
        return displayValue.value.toLocaleString('pt-BR');
      }
      return val;
    });

    const cardStyle = computed(() => ({
      backgroundColor: props.backgroundColor,
      borderColor: props.borderColor,
      transition: props.isActive ? 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'all 0.3s ease'
    }));

    const iconColor = computed(() => props.primaryColor);

    return {
      animatedValue,
      cardStyle,
      iconColor
    };
  }
};
</script>

<style scoped lang="scss">
.metric-card {
  display: flex;
  flex-direction: column;
  background-color: inherit;
  border: 1px solid inherit;
  border-radius: 8px;
  padding: 24px;
  height: 100%;
  min-height: 200px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;

  // Efeito de hover sutil
  &:hover {
    box-shadow: 0 8px 24px rgba(8, 27, 78, 0.12);
    transform: translateY(-2px);
  }

  .metric-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .metric-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;

    .metric-icon {
      font-size: 28px;
      flex-shrink: 0;
      transition: all 0.3s ease;
      animation: slideInLeft 0.5s ease;

      .icon-placeholder {
        display: inline-block;
      }
    }

    .metric-texts {
      flex: 1;
      min-width: 0;

      .metric-label {
        font-size: 16px;
        font-weight: 600;
        color: #081B4E;
        margin: 0;
        padding: 0;
        line-height: 1.4;
        letter-spacing: -0.3px;
      }

      .metric-description {
        font-size: 14px;
        color: #6b7280;
        margin: 4px 0 0 0;
        padding: 0;
        line-height: 1.3;
      }
    }
  }

  .metric-value-section {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: auto;
    animation: slideUp 0.6s ease;

    .metric-value {
      font-size: 36px;
      font-weight: 700;
      color: #081B4E;
      line-height: 1;
      letter-spacing: -1px;
    }
  }

  .metric-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: inherit;
    transform: scaleX(0);
    transform-origin: left;
    animation: expandWidth 0.6s ease forwards;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes expandWidth {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>
