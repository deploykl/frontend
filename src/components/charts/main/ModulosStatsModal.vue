<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)" 
    modal
    header="Estadísticas de Módulos y Usuarios" 
    :style="{ width: '80vw', maxWidth: '1200px' }"
    :contentStyle="{ height: '70vh' }"
  >
    <div v-if="loading" class="flex flex-col items-center justify-center p-5">
      <ProgressSpinner />
      <p class="mt-3">Cargando estadísticas...</p>
    </div>

    <div v-else-if="error" class="p-3 text-center text-red-500">
      <i class="pi pi-exclamation-triangle mr-2"></i>
      {{ error }}
    </div>

    <div v-else class="flex flex-col h-full">
      <!-- Filtros y resumen general -->
      <div class="mb-4 p-3 bg-gray-100 rounded-lg">
        <div class="flex justify-between items-center flex-wrap">
          <h5 class="m-0 font-semibold">Resumen General</h5>
          <div class="flex gap-2">
            <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Total Módulos: {{ totalModulos }}
            </span>
            <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Total Usuarios Activos: {{ totalUsuarios }}
            </span>
          </div>
        </div>
      </div>

      <!-- Gráficos principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="border border-gray-200 rounded-lg shadow-sm h-full">
          <div class="bg-transparent border-b border-gray-200 px-4 py-3">
            <h6 class="m-0 font-semibold">Usuarios por Módulo</h6>
          </div>
          <div class="p-4">
            <BarChart 
              :data="barChartData" 
              height="250px" 
              :index-axis="'y'" 
              :colors="barChartColors" 
            />
          </div>
        </div>

        <div class="border border-gray-200 rounded-lg shadow-sm h-full">
          <div class="bg-transparent border-b border-gray-200 px-4 py-3">
            <h6 class="m-0 font-semibold">Distribución de Usuarios</h6>
          </div>
          <div class="p-4">
            <DoughnutChart 
              :data="doughnutChartData" 
              height="250px" 
            />
          </div>
        </div>
      </div>

      <!-- Tabla detallada -->
      <div class="border border-gray-200 rounded-lg shadow-sm flex-1">
        <div class="bg-transparent border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h6 class="m-0 font-semibold">Detalle por Módulo</h6>
          <InputText 
            v-model="filterText" 
            placeholder="Buscar módulo..." 
            class="p-inputtext-sm w-64"
          />
        </div>
        <div class="p-0">
          <DataTable 
            :value="filteredModulos" 
            scrollable 
            scrollHeight="flex" 
            class="p-datatable-sm" 
            :rowHover="true" 
            sortField="total_usuarios" 
            :sortOrder="-1"
          >
            <Column field="modulo.codename" header="Módulo" :sortable="true">
              <template #body="{ data }">
                <strong class="block">{{ data.modulo.codename }}</strong>
                <small class="text-gray-500 text-sm">{{ data.modulo.description }}</small>
              </template>
            </Column>
            <Column field="total_usuarios" header="Usuarios" :sortable="true">
              <template #body="{ data }">
                <span 
                  class="px-3 py-1 rounded-full text-sm text-white" 
                  :class="data.total_usuarios > 0 ? 'bg-green-500' : 'bg-gray-500'"
                >
                  {{ data.total_usuarios }}
                </span>
              </template>
            </Column>
            <Column header="Acciones">
              <template #body="{ data }">
                <Button 
                  v-if="data.total_usuarios > 0" 
                  icon="pi pi-list" 
                  class="p-button-sm p-button-text p-button-info"
                  @click="toggleUserList(data)" 
                  v-tooltip.top="'Ver usuarios'" 
                />
              </template>
            </Column>

            <template #empty>
              <div class="p-3 text-center text-gray-500">
                No se encontraron módulos con usuarios
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- Dialog para mostrar usuarios de un módulo -->
      <Dialog 
        v-model:visible="showUserDialog"
        :header="selectedModule ? `Usuarios en ${selectedModule.modulo.codename}` : 'Usuarios'"
        :style="{ width: '60vw' }"
      >
        <DataTable 
          :value="selectedModule ? selectedModule.usuarios : []" 
          class="p-datatable-sm" 
          scrollable
          scrollHeight="300px"
        >
          <Column field="nombre" header="Nombre">
            <template #body="{ data }">
              {{ data.nombre }} {{ data.apellido }}
            </template>
          </Column>
          <Column field="dependencia" header="Dependencia"></Column>
          <Column field="area" header="Área"></Column>
          <Column field="fecha_acceso_habilitado" header="Fecha Habilitación">
            <template #body="{ data }">
              {{ formatDate(data.fecha_acceso_habilitado) }}
            </template>
          </Column>
        </DataTable>
      </Dialog>
    </div>

    <template #footer>
      <Button 
        label="Cerrar" 
        icon="pi pi-times" 
        @click="$emit('update:visible', false)" 
        class="p-button-text" 
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useModuloStore } from '@/stores/admin/moduloStore'
import DoughnutChart from '@/components/charts/layout/DoughnutChart.vue';
import BarChart from '@/components/charts/layout/BarChart.vue';
import { formatDate } from '@/components/utils/format'

const props = defineProps({
  visible: Boolean,
  moduleData: Array
})

const emit = defineEmits(['update:visible'])

const moduloStore = useModuloStore()
const loading = ref(false)
const error = ref(null)
const modulosStats = ref([])
const filterText = ref('')
const showUserDialog = ref(false)
const selectedModule = ref(null)

// Cargar datos cuando el modal se hace visible
watch(() => props.visible, async (newVal) => {
  if (newVal) {
    await loadStatsData()
  }
})

// Cargar estadísticas
const loadStatsData = async () => {
  loading.value = true
  error.value = null
  try {
    const result = await moduloStore.getAllModulesWithUsers()
    if (result.success) {
      modulosStats.value = result.modulos
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'Error al cargar las estadísticas'
    console.error('Error loading module stats:', err)
  } finally {
    loading.value = false
  }
}

// Totales
const totalModulos = computed(() => modulosStats.value.length)
const totalUsuarios = computed(() => {
  return modulosStats.value.reduce((total, modulo) => total + modulo.total_usuarios, 0)
})

// Datos para gráfico de barras (módulos con más usuarios)
const barChartData = computed(() => {
  // Filtrar módulos con usuarios y ordenar por cantidad
  const modulosConUsuarios = [...modulosStats.value]
    .filter(m => m.total_usuarios > 0)
    .sort((a, b) => b.total_usuarios - a.total_usuarios)
    .slice(0, 10) // Top 10

  return modulosConUsuarios.map(modulo => ({
    label: modulo.modulo.codename,
    value: modulo.total_usuarios
  }))
})

// Colores para el gráfico de barras
const barChartColors = computed(() => {
  return barChartData.value.map((_, index) => {
    const colors = [
      '#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#AB47BC',
      '#EC407A', '#7E57C2', '#5C6BC0', '#26C6DA', '#26A69A'
    ]
    return colors[index % colors.length]
  })
})

// Datos para gráfico de doughnut (distribución por módulo)
const doughnutChartData = computed(() => {
  return barChartData.value.slice(0, 5) // Top 5 para el doughnut
})

// Filtrar módulos según texto de búsqueda
const filteredModulos = computed(() => {
  if (!filterText.value) return modulosStats.value

  return modulosStats.value.filter(modulo =>
    modulo.modulo.codename.toLowerCase().includes(filterText.value.toLowerCase()) ||
    modulo.modulo.description.toLowerCase().includes(filterText.value.toLowerCase())
  )
})

// Mostrar/ocultar lista de usuarios de un módulo
const toggleUserList = (modulo) => {
  selectedModule.value = modulo
  showUserDialog.value = true
}
</script>

<style scoped>
.modulos-stats-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.p-dialog-content) {
  display: flex;
  flex-direction: column;
}
</style>