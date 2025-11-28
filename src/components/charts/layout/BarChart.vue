<template>
  <Chart
    type="bar"
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
    type: [String, Array],
    default: '#42A5F5'
  },
  indexAxis: {
    type: String,
    default: 'y',
    validator: value => ['x', 'y'].includes(value)
  }
});

const plugins = [ChartDataLabels];

const chartData = computed(() => {
  // Si colors es un array, usar uno por cada barra, si es string, usar el mismo para todos
  const backgroundColors = Array.isArray(props.colors) 
    ? props.colors 
    : Array(props.data.length).fill(props.colors);
  
  const borderColors = backgroundColors.map(color => 
    color.length === 7 ? color.slice(0, -2) + 'E5' : color
  );

  return {
    labels: props.data.map(item => item.label),
    datasets: [
      {
        label: 'Cantidad',
        data: props.data.map(item => item.value),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }
    ]
  };
});

const chartOptions = computed(() => {
  return {
    indexAxis: props.indexAxis,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#343a40',
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'bold',
          size: 11
        },
        formatter: (value) => value
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      y: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0
        }
      }
    },
    layout: {
      padding: {
        right: 20
      }
    },
    maintainAspectRatio: false
  };
});
</script>