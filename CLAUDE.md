---
name: Metrics Slider
description: Premium metrics slider component with smooth animations, keyboard navigation, and responsive design. Display multiple metrics in an elegant carousel format with customizable styling.
keywords: metrics, slider, carousel, dashboard, statistics, responsive, animations, accessibility
---

# Metrics Slider

## 🎯 Purpose

A premium, fully-animated metrics slider component that displays business metrics in an elegant carousel format. Perfect for dashboards, overview pages, and data visualization. Features smooth transitions, keyboard navigation, and responsive design with best UX practices.

## ✨ Features

- **Smooth Carousel** - Fluid animations between metrics with cubic-bezier easing
- **Animated Numbers** - Counting animation when metric becomes active
- **Keyboard Navigation** - Arrow keys for accessibility (← →)
- **Responsive Design** - Adapts to all screen sizes
- **Flexible Data** - Supports unlimited metrics with custom icons
- **Visual Feedback** - Hover effects, active states, and transitions
- **Accessibility** - Proper ARIA labels and keyboard support
- **Customizable Styling** - Full color control with design tokens
- **Component Variables** - Exposed state for workflows and bindings
- **Events & Actions** - Trigger events on navigation, support external control

## 📊 Data Structure

### metricsData (Array)

Each metric object requires:

```javascript
{
  id: 'unique-id',              // Unique identifier
  label: 'Metric Title',        // Display label
  value: 11,                    // Number or string
  description: 'Subtitle',      // Optional description
  icon: 'calendar'              // Optional icon name
}
```

**Example:**

```javascript
metricsData = [
  {
    id: 'total',
    label: 'Total de Agendamentos',
    value: 11,
    description: 'Todos os tempos',
    icon: '📅'
  },
  {
    id: 'month',
    label: 'Este Mês',
    value: 11,
    description: 'Agendamentos',
    icon: '📆'
  },
  {
    id: 'future',
    label: 'Próximos 30d',
    value: 11,
    description: 'Futuros',
    icon: '⏰'
  }
]
```

## ⚙️ Properties

### Data Properties

| Property | Type | Default | Bindable | Description |
|----------|------|---------|----------|-------------|
| `metricsData` | Array | Example data | ✓ | Array of metric objects |

### Display Properties

| Property | Type | Default | Bindable | Description |
|----------|------|---------|----------|-------------|
| `showNavigationButtons` | Boolean | true | ✓ | Show Previous/Next buttons |
| `showIndicators` | Boolean | true | ✓ | Show indicator dots |
| `showCounter` | Boolean | true | ✓ | Show "X of Y" counter |

### Style Properties

| Property | Type | Default | Bindable | Description |
|----------|------|---------|----------|-------------|
| `primaryColor` | Color | #081B4E | ✓ | Main color for buttons and active states |
| `accentColor` | Color | #081B4E | ✓ | Accent line color at card bottom |
| `cardBackgroundColor` | Color | #ffffff | ✓ | Card background color |
| `cardBorderColor` | Color | #e8eef7 | ✓ | Card border color |
| `containerGap` | Length | 16px | ✓ | Spacing between main sections |
| `cardGap` | Length | 20px | ✓ | Spacing between cards |
| `cardHeight` | Length | 220px | ✓ | Height of each card |
| `cardWidth` | Text | 100% | ✓ | Width of each card |

## 🎬 Events

### nextMetric
Triggered when user clicks next button or uses keyboard arrow.

**Payload:**
```javascript
{
  currentIndex: 2,
  currentMetric: { id: 'future', label: 'Próximos 30d', ... }
}
```

### previousMetric
Triggered when user clicks previous button or uses keyboard arrow.

**Payload:**
```javascript
{
  currentIndex: 0,
  currentMetric: { id: 'total', label: 'Total...', ... }
}
```

### goToMetric
Triggered when user clicks an indicator dot.

**Payload:**
```javascript
{
  currentIndex: 1,
  currentMetric: { id: 'month', ... },
  index: 1
}
```

## ⚡ Actions

### nextMetricAction()
Navigate to the next metric programmatically.

```javascript
// Workflow action: Call "nextMetricAction" on component
```

### previousMetricAction()
Navigate to the previous metric programmatically.

```javascript
// Workflow action: Call "previousMetricAction" on component
```

### goToMetricAction(index)
Jump to a specific metric by index (0-based).

**Arguments:**
- `index` (number): The metric index to navigate to

```javascript
// Workflow action: Call "goToMetricAction" with index: 2
```

## 📊 Exposed Variables

Access these variables in workflows and conditional logic:

### currentMetricIndex
The zero-based index of the currently displayed metric.

```
variables['uid-currentMetricIndex']  // Returns: 0, 1, 2, etc
```

### currentMetricData
The full object of the currently displayed metric.

```
variables['uid-currentMetricData']
// Returns: { id: 'metric-1', label: '...', value: 11, ... }
```

### totalMetrics
Total number of metrics in the slider.

```
variables['uid-totalMetrics']  // Returns: 3
```

## 🎨 Design System

### Color Scheme (Default)
- **Primary**: #081B4E (Navy blue)
- **Background**: #ffffff (White)
- **Border**: #e8eef7 (Light blue-grey)
- **Text**: #081B4E (Primary text)
- **Secondary Text**: #6b7280 (Grey)

### Typography
- **Label**: 16px, 600 weight (semi-bold)
- **Value**: 36px, 700 weight (bold)
- **Description**: 14px, regular
- **Counter**: 14px, 500 weight (medium)

### Border Radius
- All elements: **8px** (card radius)
- Indicators: **50%** (circular)

### Spacing (Recommendations)
- Card padding: 24px
- Icon size: 28px
- Gap between sections: 16px
- Gap between cards: 20px

### Animations
- Slide transition: **500ms** with cubic-bezier(0.34, 1.56, 0.64, 1)
- Number count: **600ms**
- Indicator scale: **300ms**
- Hover effects: **300ms** ease

## 🎯 Usage Examples

### Basic Setup

```javascript
// Bind metrics from a collection or API call
metricsData = [
  {
    id: 'total',
    label: 'Total de Agendamentos',
    value: 11,
    description: 'Todos os tempos'
  },
  {
    id: 'month',
    label: 'Este Mês',
    value: 11,
    description: 'Agendamentos'
  },
  {
    id: 'future',
    label: 'Próximos 30d',
    value: 11,
    description: 'Futuros'
  }
]
```

### With Dynamic Data

```javascript
// Bind to query results
metricsData = qrGetMetrics.data.map(metric => ({
  id: metric.id,
  label: metric.name,
  value: metric.count,
  description: metric.period,
  icon: metric.icon
}))
```

### With Conditional Navigation

```javascript
// Workflow trigger on metric change
ON: Slider > goToMetric
DO: 
  - Show: DetailPanel
  - Set: DetailPanel.metricId = slider.variables['uid-currentMetricData'].id
```

### Keyboard Navigation

Users can navigate with arrow keys:
- **← Left Arrow**: Previous metric
- **→ Right Arrow**: Next metric

## 🎨 Customization Guide

### Theme Variation - Dark Mode

```javascript
primaryColor: '#ffffff'
cardBackgroundColor: '#1e293b'
cardBorderColor: '#334155'
// Text will inherit dark-friendly colors
```

### Full Width Cards

```javascript
cardWidth: '100%'
cardGap: '0px'  // No gap for seamless transition
```

### Vertical Spacing

```javascript
containerGap: '24px'  // More space between sections
cardHeight: '280px'   // Taller cards for more content
```

### Compact Mode

```javascript
cardHeight: '160px'
cardGap: '12px'
containerGap: '12px'
```

## 📱 Responsive Behavior

The component automatically adapts:
- **Desktop**: Full width cards with smooth transitions
- **Tablet**: Cards maintain 100% width, touch-friendly controls
- **Mobile**: Full height cards, optimized button sizes

## ♿ Accessibility Features

- **Keyboard Navigation**: Full arrow key support
- **ARIA Labels**: Proper semantic markup on buttons
- **Focus States**: Visual feedback on interactive elements
- **Color Contrast**: All text meets WCAG AA standards
- **Semantic HTML**: Proper heading and button hierarchy

## 🐛 Common Issues & Solutions

### Metrics not showing?
- Verify `metricsData` is properly bound
- Ensure each metric has required: `id`, `label`, `value`
- Check browser console for binding errors

### Animations look choppy?
- Reduce number of metrics if on mobile
- Check browser performance settings
- Ensure GPU acceleration is enabled

### Numbers not animating?
- Numbers only animate when metric becomes active
- Make sure values are numbers, not strings
- Check console for binding errors

### Navigation buttons disabled?
- This is correct behavior at first/last metric
- Use `showNavigationButtons: false` to hide them
- Or use indicators and keyboard navigation instead

## 📝 Technical Details

### File Structure
```
ww-metrics/
├── src/
│   ├── wwElement.vue           (Main slider component)
│   └── components/
│       └── MetricCard.vue      (Individual metric card)
├── ww-config.js                (Configuration)
├── package.json
└── CLAUDE.md                   (This documentation)
```

### Browser Support
- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support (iOS 13+)

### Performance
- Optimized re-renders with Vue 3 composition API
- CSS transforms for smooth animations (GPU accelerated)
- Efficient variable updates using wwLib
- No external dependencies besides Vue 3

### Key Technologies
- Vue 3 Composition API
- CSS3 Animations & Transitions
- requestAnimationFrame for smooth counting
- WeWeb wwLib.wwVariable API
- Semantic HTML5

## 🚀 Best Practices

1. **Data Binding**
   - Use computed properties or query results
   - Ensure data updates trigger re-renders
   - Validate data before binding

2. **Styling**
   - Maintain consistent color scheme
   - Test on multiple device sizes
   - Ensure text contrast (WCAG)

3. **Performance**
   - Limit metrics to reasonable number (3-8)
   - Use efficient data queries
   - Cache metric calculations if possible

4. **UX**
   - Show counter for user orientation
   - Use descriptive labels
   - Provide context with descriptions
   - Consider auto-navigation for onboarding

## 📞 Support

For issues or feature requests, refer to the component's GitHub repository or contact support.

---

**Version:** 1.0.0  
**Last Updated:** January 18, 2026  
**Compatibility:** WeWeb, Vue 3  
**License:** MIT
