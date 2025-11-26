<template>
  <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal
    header="Estadísticas de Marcas de Token" :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- CONTENEDOR PRINCIPAL -->
    <div class="grid">
      <!-- Gráfico de dona -->
      <div class="col-6 flex flex-column align-items-center">
        <DoughnutChart :data="chartData" :colors="['#42A5F5', '#FFA726']" height="220px" />
      </div>

      <!-- Gráfico de barras - AHORA CON MÚLTIPLES COLORES -->
      <div class="col-6 flex align-items-center justify-content-center">
        <BarChart :data="brandChartData" index-axis="y" :colors="brandChartColors" height="220px" />
      </div>
      <!-- Tabla de distribución por marcas -->
      <div class="col-12 md:col-6 mt-4">
        <h4>Distribución por Marcas</h4>
        <DataTable :value="brandStats" class="p-datatable-sm" scrollable scrollHeight="200px">
          <Column field="marca" header="Marca de Token" />
          <Column field="count" header="Cantidad">
            <template #body="slotProps">
              <span class="font-bold">{{ slotProps.data.count }}</span>
            </template>
          </Column>
          <Column field="percentage" header="Porcentaje">
            <template #body="slotProps">
              <span>{{ slotProps.data.percentage }}%</span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Tabla de distribución por condición -->
      <div class="col-12 md:col-6 mt-4">
        <h4>Distribución por Condición</h4>
        <DataTable :value="condicionStats" class="p-datatable-sm" scrollable scrollHeight="200px">
          <Column field="condicion" header="Condición">
            <template #body="slotProps">
              <span class="cursor-pointer text-primary font-semibold hover:underline"
                @click="openConditionDetail(slotProps.data.condicion)">
                {{ slotProps.data.condicion }}
              </span>
            </template>
          </Column>
          <Column field="count" header="Cantidad">
            <template #body="slotProps">
              <span class="font-bold">{{ slotProps.data.count }}</span>
            </template>
          </Column>
          <Column field="percentage" header="Porcentaje">
            <template #body="slotProps">
              <span>{{ slotProps.data.percentage }}%</span>
            </template>
          </Column>
          <Column field="withTokenCount" header="Con Token">
            <template #body="slotProps">
              <span class="font-bold text-primary">{{ slotProps.data.withTokenCount }}</span>
            </template>
          </Column>
          <Column field="withoutTokenCount" header="Sin Token">
            <template #body="slotProps">
              <span class="font-bold text-secondary">{{ slotProps.data.withoutTokenCount }}</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </Dialog>

  <!-- Modal de detalles de condición -->
  <Dialog v-model:visible="showConditionModal" modal :header="`Detalles: ${selectedCondition}`"
    :style="{ width: '65rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="grid">
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-3">
          <p class="text-lg font-semibold">Total: {{ conditionDetails.length }} personas</p>
          <div>
            <small class="text-primary font-bold mr-3">
              Con Token:
              {{conditionDetails.filter(p => p.marca_token && p.marca_token !== '-').length}}
            </small>
            <br />
            <small class="text-secondary font-bold">
              Sin Token:
              {{conditionDetails.filter(p => !p.marca_token || p.marca_token === '-').length}}
            </small>
          </div>
        </div>

        <DataTable :value="conditionDetails" :paginator="true" :rows="50" :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros" scrollHeight="400px"
          scrollable sortField="tiempo_para_expiracion_dias" :sortOrder="1">
          <Column field="full_name" header="Nombre Completo" sortable />
          <Column field="dependencia_nombre" header="Dependencia" sortable />
          <Column field="area_nombre" header="Área" sortable />
          <Column field="marca_token" header="Token" sortable>
            <template #body="slotProps">
              <span :class="{
                'text-primary font-bold': slotProps.data.marca_token && slotProps.data.marca_token !== '-',
                'text-secondary': !slotProps.data.marca_token || slotProps.data.marca_token === '-'
              }">
                {{ slotProps.data.marca_token && slotProps.data.marca_token !== '-' ? slotProps.data.marca_token : 'Sin token' }}
              </span>
            </template>
          </Column>
          <Column field="fecha_expiracion_token" header="Expiración" sortable />
          <Column field="tiempo_para_expiracion_dias" header="Expira en:" sortable>
            <template #body="{ data }">
              <div>
                <Badge v-if="data.tiempo_para_expiracion_dias !== 9999" :value="data.tiempo_para_expiracion_dias"
                  :severity="getBadgeSeverity(data.tiempo_para_expiracion_dias)" class="p-mr-2" />
                <span v-else class="text-secondary">—</span>
                <!-- ↑ puedes poner “Sin registro” en lugar de “—” si lo prefieres -->
              </div>
            </template>
          </Column>

        </DataTable>
      </div>
    </div>
    <template #footer>
      <Button label="Cerrar" icon="pi pi-times" @click="showConditionModal = false" text />
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import DoughnutChart from '@/components/charts/layout/DoughnutChart.vue';
import BarChart from '@/components/charts/layout/BarChart.vue';

const props = defineProps({
  visible: Boolean,
  personalData: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['update:visible']);

const showConditionModal = ref(false);
const selectedCondition = ref('');
const conditionDetails = ref([]);

// Estadísticas principales
const tokensWithBrand = computed(
  () => props.personalData.filter(p => p.marca_token && p.marca_token !== '-').length
);
const tokensWithoutBrand = computed(
  () => props.personalData.filter(p => !p.marca_token || p.marca_token === '-').length
);

// Tabla de marcas
const brandStats = computed(() => {
  const counts = {};
  props.personalData.forEach(p => {
    if (p.marca_token && p.marca_token !== '-') {
      counts[p.marca_token] = (counts[p.marca_token] || 0) + 1;
    }
  });
  const total = tokensWithBrand.value;
  return Object.entries(counts)
    .map(([marca, count]) => ({
      marca,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.count - a.count);
});

// Tabla de condición
const condicionStats = computed(() => {
  const counts = {};
  props.personalData.forEach(p => {
    const c = p.condicion_nombre || 'Sin condición';
    counts[c] = counts[c] || { total: 0, withToken: 0, withoutToken: 0 };
    counts[c].total++;
    if (p.marca_token && p.marca_token !== '-') counts[c].withToken++;
    else counts[c].withoutToken++;
  });
  const total = props.personalData.length;
  return Object.entries(counts)
    .map(([condicion, d]) => ({
      condicion,
      count: d.total,
      percentage: total > 0 ? ((d.total / total) * 100).toFixed(1) : '0.0',
      withTokenCount: d.withToken,
      withoutTokenCount: d.withoutToken
    }))
    .sort((a, b) => b.count - a.count);
});

// Abrir detalle
function openConditionDetail(cond) {
  selectedCondition.value = cond;
  conditionDetails.value = props.personalData.filter(p => p.condicion_nombre === cond);
  showConditionModal.value = true;
}

// Datos para gráficos
const chartData = computed(() => [
  { label: 'Con Marca', value: tokensWithBrand.value },
  { label: 'Sin Marca', value: tokensWithoutBrand.value }
]);
const brandChartData = computed(() =>
  brandStats.value.map(item => ({ label: item.marca, value: item.count }))
);
// Array de colores para el gráfico de barras
const brandChartColors = computed(() => {
  const colors = [
    '#42A5F5', '#FFA726', '#66BB6A', '#EF5350', '#AB47BC',
    '#26A69A', '#FF7043', '#78909C', '#7E57C2', '#D4E157',
    '#5C6BC0', '#FFEE58', '#EC407A', '#26C6DA', '#9CCC65'
  ];

  return brandStats.value.map((_, index) => colors[index % colors.length]);
});
// Función para determinar el color del badge según los días restantes
const getBadgeSeverity = (diasRestantes) => {
  if (diasRestantes === 9999) return 'secondary';
  if (diasRestantes < 0) return 'danger';
  if (diasRestantes === 0) return 'danger';
  if (diasRestantes <= 10) return 'warn';
  if (diasRestantes <= 20) return 'info';
  return 'success';
};
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:underline:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .grid>[class*='col-'] {
    margin-bottom: 1.5rem;
  }
}

h4 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
</style>
