# Metrics Slider Component

Premium metrics slider component for WeWeb with smooth animations, responsive design, and automatic data calculation from agendamentos and clientes collections.

## ✨ Features

- 🎠 **Carousel Slider** - Smooth animations with cubic-bezier easing
- 📊 **Auto-Calculated Metrics** - Bind collections and get instant metrics
- 📱 **Fully Responsive** - Works on all devices with CSS clamp()
- 🎨 **Customizable** - Colors, spacing, animations, and layout
- ⌨️ **Keyboard Navigation** - Arrow keys support
- 🎯 **Multiple Views** - Show 1-5 cards per view
- 🔄 **Smooth Transitions** - GPU-accelerated animations
- ♿ **Accessible** - ARIA labels and semantic HTML

## 📦 Installation

1. Copy the component to your WeWeb custom components folder
2. Or install from GitHub: `git clone https://github.com/xequelab/ww-metrics.git`

## 🚀 Quick Start

### 1. Bind Your Collections

In WeWeb editor:
- Bind **Agendamentos Collection** → your `agendamentos` collection
- Bind **Clientes Collection** → your `clientes` collection

The component automatically calculates:
- Total de Agendamentos
- Agendamentos Este Mês
- Agendamentos Próximos 30d
- Total de Clientes
- Clientes Novos Este Mês

### 2. Customize Layout

In properties:
- **Cards Per View**: 1 (carousel), 2, 3, or more
- **Colors**: Primary, accent, background, border
- **Spacing**: Container gap, card gap
- **Display**: Show/hide buttons, indicators, counter

## 📊 Data Expected

### Agendamentos Collection

```javascript
{
  id: number,
  data_inicio: ISO string,
  titulo: string,
  status: string,
  // ... other fields
}
```

### Clientes Collection

```javascript
{
  id: string,
  created_at: ISO string,
  nome: string,
  // ... other fields
}
```

## ⚙️ Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `agendamentosCollection` | Collection | - | Agendamentos data |
| `clientesCollection` | Collection | - | Clientes data |
| `cardsPerView` | Number | 1 | Cards visible at once (1-5) |
| `primaryColor` | Color | #081B4E | Main color |
| `accentColor` | Color | #081B4E | Accent line color |
| `cardBackgroundColor` | Color | #ffffff | Card background |
| `cardBorderColor` | Color | #e8eef7 | Card border |
| `showNavigationButtons` | Boolean | true | Show prev/next buttons |
| `showIndicators` | Boolean | true | Show page dots |
| `showCounter` | Boolean | true | Show "X of Y" counter |

## 🎬 Events

- `nextMetric` - User clicks next
- `previousMetric` - User clicks previous
- `goToMetric` - User clicks indicator

## 💾 Exposed Variables

Access in workflows:
- `currentMetricIndex` - Current position (0-based)
- `currentMetricData` - Current metric object
- `totalMetrics` - Total number of metrics

## 🎨 Responsive Design

- **Desktop**: Full features, all spacing
- **Tablet**: Adjusted sizing, optimized for touch
- **Mobile**: Compact, touch-friendly buttons

## 🛠️ Development

```bash
# Serve locally
npm run serve

# Build for production
npm run build
```

## 📝 License

MIT

## 👨‍💻 Author

Xeque Lab

## 🔗 Repository

https://github.com/xequelab/ww-metrics
