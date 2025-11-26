<template>
  <div class="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full mx-auto box-border overflow-hidden">
    <div class="flex flex-col gap-3">
      <h2 v-if="title" class="m-0 text-xl sm:text-2xl font-semibold text-gray-800">{{ title }}</h2>

      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <!-- Botón crear a la izquierda -->
        <div class="flex justify-start">
          <Button v-if="showCreateButton && !hideCreateButton" :icon="createButtonIcon" :label="createButtonLabel"
            @click="$emit('create')" class="p-button-sm create-button w-full sm:w-auto" />
        </div>

        <!-- Botones de filtro y buscador a la derecha -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <!-- Slot para botones personalizados -->
          <slot name="custom-header-buttons"></slot>

          <div class="flex flex-col sm:flex-row gap-2 w-full">
            <!-- Botones de filtro existentes -->
            <Button type="button" icon="pi pi-filter-slash" label="Limpiar"
              class="p-button-sm clear-button w-full sm:w-auto" @click="clearFilter()" text />

            <div class="w-full sm:min-w-[250px]">
              <div class="relative w-full">
                <InputText v-model="searchTerm" placeholder="Buscar..."
                  class="p-inputtext-sm pl-10 w-full h-9 text-base" @input="onSearch" />
                <i
                  class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DataTable :value="filteredData" v-model:filters="filters" :paginator="true" size="small" :rows="rows"
      :loading="loading" :totalRecords="totalRecords" :sortField="sortField" :sortOrder="sortOrder" removableSort
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25, 50, 100]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros" responsiveLayout="scroll"
      :sortable="sortable" class="elegant-table w-full" filterDisplay="menu" :globalFilterFields="globalFilterFields"
      :expandedRows="expandedRows" dataKey="id" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" ref="dt"
      :rowClass="rowClass" :rowStyle="rowStyle" scrollable scrollHeight="flex">

      <template #header>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Botón(es) que vengan desde PersonalView -->
          <slot name="header"></slot>

          <!-- Botones propios del DataTableWrapper -->
          <template v-if="expandable">
            <Button icon="pi pi-plus" label="Mostrar Todo" @click="expandAll"
              class="p-button-text p-button-sm w-full sm:w-auto mb-2 sm:mb-0" />
            <Button icon="pi pi-minus" label="Ocultar Todo" @click="collapseAll"
              class="p-button-text p-button-sm w-full sm:w-auto" />
          </template>
        </div>
      </template>

      <!-- Columna expander (condicional) -->
      <Column v-if="expandable" expander style="width: 2rem"
        headerClass="text-gray-700 font-semibold uppercase text-xs tracking-wider border-t-2 border-b-2 border-gray-700">
        <template #header>
          <span class="hidden sm:inline">+/-</span>
          <span class="sm:hidden">±</span>
        </template>
      </Column>

      <!-- Slot para contenido expandido (condicional) -->
      <template v-if="expandable" #expansion="slotProps">
        <div class="p-3 bg-gray-50 border-l-4 border-indigo-500 my-2 rounded">
          <slot name="expansion" :data="slotProps.data"></slot>
        </div>
      </template>

      <Column v-if="showIndex" header="N°"
        headerClass="text-gray-700 font-semibold uppercase text-xs tracking-wider border-t-2 border-b-2 border-gray-700"
        bodyClass="body-cell" :style="{ width: '5%', minWidth: '50px' }">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>

      <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"
        :style="{ ...col.style, minWidth: '120px' }"
        headerClass="text-gray-700 font-semibold uppercase text-xs tracking-wider border-t-2 border-b-2 border-gray-700"
        bodyClass="body-cell" :showFilterMenu="col.filter !== false" :filterField="col.filterField || col.field"
        :dataType="col.dataType || 'text'" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }">
        <template #body="slotProps">
          <slot v-if="col.bodyTemplate" :name="`body-${col.field}`" :data="slotProps.data"></slot>
          <template v-else>
            <span class="truncate block" :title="formatValue(slotProps.data[col.field], col)">
              {{ formatValue(slotProps.data[col.field], col) }}
            </span>
          </template>
        </template>

        <template #filter="{ filterModel, filterCallback }" v-if="col.filter !== false">
          <template v-if="col.dataType === 'boolean'">
            <Dropdown v-model="filterModel.value" :options="booleanOptions" optionLabel="label" optionValue="value"
              placeholder="Seleccionar"
              @change="() => { filterCallback(); handleFilterChange(col.field, filterModel.value); }" class="w-full" />
          </template>
          <template v-else-if="col.filterOptions">
            <Dropdown v-model="filterModel.value" :options="col.filterOptions" :placeholder="`Seleccionar`"
              @change="() => { filterCallback(); handleFilterChange(col.field, filterModel.value); }" class="w-full" />
          </template>
          <template v-else>
            <InputText v-model="filterModel.value" type="text" @input="filterCallback" class="w-full"
              placeholder="Buscar..." @change="handleFilterChange(col.field, filterModel.value)" />
          </template>
        </template>
      </Column>

      <Column v-if="actions" header="Acciones" :exportable="false" :style="{ minWidth: '8rem', width: '150px' }"
        headerClass="text-gray-700 font-semibold uppercase text-xs tracking-wider border-t-2 border-b-2 border-gray-700"
        bodyClass="body-cell">
        <template #body="slotProps">
          <div class="flex flex-wrap gap-1">
            <slot name="actions" :data="slotProps.data"></slot>
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="flex flex-col items-center justify-center p-8 text-gray-500">
          <i class="pi pi-exclamation-circle text-2xl mb-4 text-gray-400"></i>
          <p class="text-center">No se encontraron registros</p>
        </div>
      </template>

      <template #loading>
        <div class="flex flex-col items-center justify-center p-8 text-gray-500">
          <ProgressSpinner />
          <p class="text-center mt-2">Cargando datos...</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const FilterMatchMode = {
  CONTAINS: 'contains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  IN: 'in',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUAL_TO: 'lte',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUAL_TO: 'gte',
  BETWEEN: 'between',
  DATE_IS: 'dateIs',
  DATE_IS_NOT: 'dateIsNot',
  DATE_BEFORE: 'dateBefore',
  DATE_AFTER: 'dateAfter'
};

const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  totalRecords: { type: Number, default: 0 },
  rows: { type: Number, default: 10 },
  striped: { type: Boolean, default: true },
  sortable: { type: Boolean, default: true },
  actions: { type: Boolean, default: false },
  title: { type: String, default: '' },
  showCreateButton: { type: Boolean, default: false },
  createButtonLabel: { type: String, default: 'Nuevo' },
  showIndex: { type: Boolean, default: true },
  createButtonIcon: { type: String, default: 'pi pi-plus' },
  sortField: { type: String, default: '' },
  sortOrder: { type: Number, default: 1 },
  filterOptions: { type: Array, default: () => [] },
  globalFilterFields: { type: Array, default: () => [] },
  dataKey: { type: String, default: 'id' },
  expandable: { type: Boolean, default: false },
  hideCreateButton: { type: Boolean, default: false }
});

const emit = defineEmits([
  'page-change',
  'sort-change',
  'search',
  'create',
  'filter-change',
  'column-filter',
  'row-expand',
  'row-collapse',
  'column-filter-change',
  'filter-change',
]);

const STORAGE_KEY = 'tableFilters';

// Filtros
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  ...props.columns.reduce((acc, col) => {
    if (col.filter !== false) {
      acc[col.field] = {
        value: null,
        matchMode: col.dataType === 'boolean' ? FilterMatchMode.EQUALS : (col.filterMatchMode || FilterMatchMode.CONTAINS)
      };
    }
    return acc;
  }, {})
});

const handleFilterChange = (field, value) => {
  emit('column-filter-change', { field, value });

  if (field === 'dependencia_nombre') {
    emit('filter-change', { field: 'dependencia', value });
  }
};

const expandedRows = ref([]);
const searchTerm = ref('');
const dt = ref();

const booleanOptions = ref([
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
]);

const onRowExpand = (event) => {
  emit('row-expand', event.data);
};

const onRowCollapse = (event) => {
  emit('row-collapse', event.data);
};

const saveFiltersToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      searchTerm: searchTerm.value,
      filters: filters.value,
      timestamp: new Date().getTime()
    }));
  } catch (e) {
    console.error('Error al guardar filtros:', e);
  }
};

const loadFiltersFromStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { searchTerm: savedSearchTerm, filters: savedFilters } = JSON.parse(savedData);

      const validFilters = { ...filters.value };
      Object.keys(savedFilters).forEach(key => {
        if (key in validFilters) {
          validFilters[key] = savedFilters[key];
        }
      });

      searchTerm.value = savedSearchTerm || '';
      filters.value = validFilters;
    }
  } catch (e) {
    console.error('Error al cargar filtros:', e);
    localStorage.removeItem(STORAGE_KEY);
  }
};

const formatValue = (value, column) => {
  if (value === null || value === undefined || value === '') return '-';

  if (column.dataType === 'date') {
    return new Date(value).toLocaleDateString();
  }

  if (column.dataType === 'numeric') {
    return new Intl.NumberFormat('es-ES').format(value);
  }

  if (column.dataType === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  return value;
};

const onSearch = () => {
  emit('search', searchTerm.value);
};

const normalizeText = (text) => {
  if (!text) return '';

  return text.toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const filteredData = computed(() => {
  if (!props.data) return [];

  let result = [...props.data];

  const normalizedSearchTerm = normalizeText(searchTerm.value);

  if (normalizedSearchTerm) {
    result = result.filter(item =>
      props.columns.some(col => {
        const itemValue = item[col.field];
        if (itemValue === null || itemValue === undefined) return false;

        const normalizedItemValue = normalizeText(itemValue.toString());
        return normalizedItemValue.includes(normalizedSearchTerm);
      })
    );
  }

  for (const [field, filter] of Object.entries(filters.value)) {
    if (field === 'global' || filter?.value === null || filter?.value === '') continue;

    const column = props.columns.find(col => col.field === field);
    const filterValue = filter.value;

    result = result.filter(item => {
      const itemValue = item[field];

      if (column?.dataType === 'boolean') {
        return itemValue === filterValue;
      }

      const normalizedItemValue = normalizeText(itemValue || '');
      const normalizedFilterValue = normalizeText(filterValue);

      switch (filter.matchMode) {
        case 'startsWith': return normalizedItemValue.startsWith(normalizedFilterValue);
        case 'contains': return normalizedItemValue.includes(normalizedFilterValue);
        case 'equals': return normalizedItemValue === normalizedFilterValue;
        default: return normalizedItemValue.includes(normalizedFilterValue);
      }
    });
  }

  return result;
});

const clearFilter = () => {
  searchTerm.value = '';
  filters.value.global.value = null;

  Object.keys(filters.value).forEach(key => {
    if (key !== 'global') {
      filters.value[key].value = null;
    }
  });

  localStorage.removeItem(STORAGE_KEY);

  emit('search', '');
  emit('filter-change', { cleared: true });
};

const expandAll = () => {
  if (!props.data || props.data.length === 0) return;

  expandedRows.value = props.data.reduce((acc, item) => {
    acc[item[props.dataKey]] = true;
    return acc;
  }, {});
};

const rowClass = (data) => {
  return [
    {
      'inactive-row': data.is_active === false,
      'active-row': data.is_active === true,
      'cesado-row': data.estado_nombre === 'Cesado(a)'
    }
  ];
};

const rowStyle = (data) => {
  if (data.estado_nombre === 'Cesado(a)') {
    return {
      backgroundColor: '#fff5f5',
      'box-shadow': 'inset 5px 0 0 #dc3545'
    };
  } else if (data.is_active === false) {
    return {
      backgroundColor: '#f8f9fa',
      color: '#868e96',
      'box-shadow': 'inset 5px 0 0 #f04343'
    };
  } else if (data.is_active === true) {
    return {
      'box-shadow': 'inset 5px 0 0 #11ba82'
    };
  }
  return {};
};

const collapseAll = () => {
  expandedRows.value = [];
  emit('row-collapse');
};

onMounted(() => {
  loadFiltersFromStorage();
});

watch([searchTerm, filters], () => {
  saveFiltersToStorage();

  if (filters.value.global?.value !== null) {
    emit('search', filters.value.global.value);
  }

  for (const [field, filter] of Object.entries(filters.value)) {
    if (field !== 'global' && filter?.value !== null) {
      emit('column-filter', { field, value: filter.value });
    }
  }
}, { deep: true });
</script>

<style scoped>
/* Estilos mínimos necesarios que no se pueden reemplazar con Tailwind */
.p-inputtext {
  border-radius: 6px;
  border: 1px solid #ced4da;
  transition: all 0.3s;
}

.p-inputtext:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
}

:deep(.p-column-filter-matchmode-dropdown),
:deep(.p-column-filter-operator) {
  display: none !important;
}

:deep(.p-column-filter-constraint) {
  padding: 0 !important;
}

:deep(.p-datatable .p-row-toggler) {
  color: var(--primary-color);
}

:deep(.p-datatable .p-row-expanded) {
  background-color: #f8f9fa;
}

:deep(.p-datatable) {
  font-size: 0.8rem;
}

/* Mejoras para móvil */
@media screen and (max-width: 768px) {

  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.25rem !important;
    font-size: 0.75rem;
  }

  :deep(.p-datatable .p-column-title) {
    font-size: 0.7rem;
  }

  :deep(.p-button) {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
}

/* Estilos para estados de filas */
:deep(.cesado-row) {
  background-color: #fff5f5 !important;
  border-left: 4px solid #dc3545 !important;
}

:deep(.cesado-row:hover) {
  background-color: #ffe6e6 !important;
}

:deep(.cesado-row + tr .expansion-content) {
  background-color: #fff5f5 !important;
}

:deep(.cesado-row + tr .expansion-card) {
  border-left: 4px solid #dc3545 !important;
  background-color: #fffafa !important;
}

.badge-cesado {
  background-color: #dc3545 !important;
  color: white !important;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

:deep(.bg-cesado) {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%) !important;
}

:deep(.bg-cesado .expansion-card) {
  background-color: #fffafa !important;
  border-left: 4px solid #dc3545 !important;
}

/* Efectos hover para las filas */
:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: all 0.3s ease;
  cursor: pointer;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #e9e9e9 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(167, 34, 34, 0.1);
}

:deep(.p-datatable .p-datatable-tbody > tr.active-row:hover) {
  background-color: #f0fff0 !important;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

:deep(.p-datatable .p-datatable-tbody > tr.inactive-row:hover) {
  background-color: #f8f9fa !important;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);
}

:deep(.p-datatable .p-datatable-tbody > tr.cesado-row:hover) {
  background-color: #ffe6e6 !important;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  border-left: 4px solid #6366f1 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr.active-row:hover) {
  border-left: 4px solid #11ba82 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr.inactive-row:hover) {
  border-left: 4px solid #f04343 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr.cesado-row:hover) {
  border-left: 4px solid #dc3545 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  :deep(.p-datatable .p-datatable-tbody > tr:hover) {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>