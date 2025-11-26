<template>
  <Chart
    type="doughnut"
    :data="chartData"
    :options="chartOptions"
    :plugins="plugins"
    class="w-full"
    :style="{ height: height }"
  />
</template>

<script setup>
import { computed } from 'vue';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    validator: value => value.every(item => 
      item.hasOwnProperty('label') && item.hasOwnProperty('value')
    )
  },
  height: {
    type: String,
    default: '250px'
  },
  colors: {
    type: Array,
    default: () => ['#42A5F5', '#FFA726', '#66BB6A', '#FF7043', '#AB47BC']
  },
  showLabels: {
    type: Boolean,
    default: true
  }
});

const plugins = [ChartDataLabels];

const chartData = computed(() => {
  return {
    labels: props.data.map(item => item.label),
    datasets: [
      {
        data: props.data.map(item => item.value),
        backgroundColor: props.colors,
        hoverBackgroundColor: props.colors.map(color => 
          color.length === 7 ? color + 'CC' : color.slice(0, -2) + 'CC'
        )
      }
    ]
  };
});

const chartOptions = computed(() => {
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    maintainAspectRatio: false
  };
  
  if (props.showLabels) {
    options.plugins.datalabels = {
      color: '#fff',
      font: {
        weight: 'bold',
        size: 12
      },
      formatter: (value, context) => {
        const total = context.dataset.data.reduce((a, b) => a + b, 0);
        const percentage = Math.round((value / total) * 100);
        return `${value}\n(${percentage}%)`;
      }
    };
  }
  
  return options;
});
</script>