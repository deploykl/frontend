<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 p-5 font-sans transition-colors duration-300">
    <!-- Loading state -->
    <div v-if="tableroStore.loading" class="flex flex-col items-center justify-center h-96 text-gray-600 dark:text-gray-400">
      <div class="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p>Cargando tableros...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="tableroStore.error" class="text-center p-10 text-red-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-lg mx-auto my-10">
      <i class="fas fa-exclamation-triangle text-5xl mb-4"></i>
      <h3 class="text-xl font-semibold mb-2">Error al cargar los tableros</h3>
      <p class="mb-4 dark:text-gray-300">{{ (tableroStore.error as any).message || JSON.stringify(tableroStore.error) || 'Error desconocido' }}</p>
      <button @click="loadTableros" class="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
        Reintentar
      </button>
    </div>

    <!-- Content -->
    <div v-else class="tableros-container">
      <!-- Header with filters -->
      <div class="bg-white dark:bg-gray-800 backdrop-blur-sm p-5 rounded-xl shadow-sm mb-8 flex justify-between items-center flex-wrap gap-5 transition-colors duration-300">
        <h1 class="text-gray-800 dark:text-white flex items-center gap-3 m-0 font-bold text-2xl">
          <i class="fas fa-chart-line text-indigo-500"></i> TABLEROS DIMON
        </h1>

        <div class="flex gap-4 items-center flex-wrap">
          <!-- Search box -->
          <div class="relative flex items-center">
            <i class="fas fa-search text-gray-400 absolute left-3 z-10"></i>
            <input 
              v-model="searchQuery" 
              placeholder="Buscar tablero..." 
              type="text"
              class="pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm w-64 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 dark:focus:ring-indigo-900 placeholder-gray-500 dark:placeholder-gray-400"
            >
          </div>

          <!-- Active/inactive filter -->
          <div class="flex items-center gap-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="showOnlyActive" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Solo activos</span>
            </label>
          </div>

          <!-- Type filter -->
          <div class="relative flex items-center">
            <i class="fas fa-chart-bar text-gray-400 absolute left-3 z-10"></i>
            <select v-model="selectedType" class="pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm w-48 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 dark:focus:ring-indigo-900 appearance-none cursor-pointer">
              <option value="">Todos los tipos</option>
              <option value="powerbi">Power BI</option>
              <option value="tableau">Tableau</option>
            </select>
          </div>

          <!-- Category filter -->
          <div class="relative flex items-center">
            <i class="fas fa-filter text-gray-400 absolute left-3 z-10"></i>
            <select v-model="selectedCategory" class="pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm w-48 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 dark:focus:ring-indigo-900 appearance-none cursor-pointer">
              <option value="">Todas las categorías</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Source filter -->
          <div class="relative flex items-center">
            <i class="fas fa-database text-gray-400 absolute left-3 z-10"></i>
            <select v-model="selectedFuente" class="pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm w-48 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 dark:focus:ring-indigo-900 appearance-none cursor-pointer">
              <option value="">Todas las fuentes</option>
              <option v-for="fuente in fuentes" :key="fuente.id" :value="fuente.id">
                {{ fuente.nombre }} - {{ fuente.frecuencia || 'N/A' }}
              </option>
            </select>
          </div>

          <!-- Clear filters -->
          <button @click="clearFilters" class="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-1.5 text-sm transition-all duration-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-500 hover:-translate-y-0.5">
            <i class="fas fa-times"></i> Limpiar
          </button>
        </div>
      </div>

      <!-- Tableros Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-5">
        <div 
          v-for="tablero in filteredTableros" 
          :key="tablero.id" 
          @click="openTablero(tablero)"
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-all duration-300 flex cursor-pointer relative min-h-[220px] border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 dark:hover:border-gray-600 group"
          :class="{ 'opacity-70 cursor-not-allowed': !tablero.is_active }"
        >
          <!-- Disabled overlay -->
          <div v-if="!tablero.is_active" class="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-80 rounded-2xl flex items-center justify-center z-10">
            <div class="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 text-xs shadow-sm">
              <i class="fas fa-ban"></i> Desactivado
            </div>
          </div>

          <!-- Icon -->
          <div class="mr-4 flex items-start">
            <i :class="getTableroIcon(tablero)" class="text-2xl mt-1 bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"></i>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-gray-800 dark:text-white text-lg font-semibold mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
              {{ tablero.name }}
            </h3>
            
            <!-- Status badge -->
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3"
                 :class="tablero.is_active ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'">
              <i class="fas fa-circle text-[8px]"></i> {{ tablero.is_active ? 'Activo' : 'Inactivo' }}
            </div>

            <!-- Sources -->
            <div v-if="tablero.fuentes_detalles && tablero.fuentes_detalles.length" class="mt-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-l-4 border-indigo-500">
              <div class="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-2 flex items-center gap-1.5">
                <i class="fas fa-database"></i> Fuentes:
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span 
                  v-for="fuente in tablero.fuentes_detalles.slice(0, 2)" 
                  :key="fuente.id" 
                  class="px-2.5 py-1 rounded-lg text-xs font-medium text-white"
                  :class="getFuenteCategoryClass(fuente)"
                >
                  {{ fuente.nombre }} - {{ fuente.frecuencia || 'N/A' }}
                </span>
                <span v-if="tablero.fuentes_detalles.length > 2" class="text-gray-500 dark:text-gray-400 text-xs italic self-center">
                  +{{ tablero.fuentes_detalles.length - 2 }} más
                </span>
              </div>
            </div>
            <div v-else class="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1.5 my-3">
              <i class="fas fa-info-circle"></i> Sin fuentes asignadas
            </div>

            <!-- Metadata -->
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-400 dark:text-gray-500">
              <span class="flex items-center gap-1">
                <i class="fas fa-sync-alt"></i> {{ tablero.update_frequency || 'N/A' }}
              </span>
              <span class="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-xl font-medium text-xs">
                {{ getTableroType(tablero) }}
              </span>
            </div>
          </div>

          <!-- Action arrow -->
          <div class="flex items-start">
            <i class="fas fa-external-link-alt text-gray-400 dark:text-gray-500 text-base mt-1 transition-all duration-300 group-hover:text-indigo-500 group-hover:translate-x-0.5"></i>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredTableros.length === 0" class="text-center p-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm my-5">
        <i class="pi pi-search text-5xl mb-4 opacity-50"></i>
        <h3 class="text-xl font-semibold mb-2 dark:text-white">No se encontraron tableros</h3>
        <p class="dark:text-gray-300">Intenta con otros términos de búsqueda o cambia los filtros</p>
      </div>

      <!-- Modal -->
      <div v-if="showModal && selectedTablero" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-5" @click="closeModal">
        <div class="bg-white dark:bg-gray-800 rounded-2xl w-full h-full flex flex-col overflow-hidden shadow-2xl transition-all duration-300 modal-content"
             :class="{ 'tableau-modal': isTableau(selectedTablero) }"
             @click.stop>
          
          <!-- Modal header -->
          <div class="modal-header" :class="{ 'tableau-header': isTableau(selectedTablero) }">
            <div class="flex-1">
              <h2 class="text-gray-800 dark:text-gray text-2xl font-semibold m-0" :class="{ 'text-xl': isTableau(selectedTablero) }">
                {{ selectedTablero.name }}
              </h2>
              <div class="modal-subtitle">
                <span v-if="selectedTablero.fuentes_detalles?.length" class="modal-fuentes text-gray-600 dark:text-gray-400">
                  Fuentes: {{ selectedTablero.fuentes_detalles.map(f => f.nombre).join(', ') }}
                </span>
              </div>
            </div>
            <button @click="closeModal" class="close-btn text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-cyan">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <!-- Power BI -->
            <div v-if="isPowerBI(selectedTablero)" class="iframe-container">
              <iframe 
                :src="selectedTablero.url" 
                frameborder="0" 
                allowFullScreen="true" 
                @load="iframeLoaded"
                @error="iframeError"
                class="w-full h-full rounded-b-2xl"
              ></iframe>
            </div>

            <!-- Tableau -->
            <div v-else-if="isTableau(selectedTablero)" class="tableau-container bg-gray-50 dark:bg-gray-900">
              <div v-html="selectedTablero.codigo_embed"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import { useTableroStore } from '@/stores/dimon/tableroStore';
import type { ITablero, IFuenteInfo } from '@/stores/dimon/tableroStore';

type Tablero = ITablero & {
  url?: string;
  codigo_embed?: string;
  source?: string;
  update_frequency?: string;
};

const tableroStore = useTableroStore();
const searchQuery = ref<string>('');
const selectedCategory = ref<string>('');
const selectedFuente = ref<string>('');
const selectedTablero = ref<Tablero | null>(null);
const showModal = ref<boolean>(false);
const showOnlyActive = ref<boolean | null>(true);
const selectedType = ref<string>('');

// Computed: Obtener todas las categorías únicas de las fuentes
const categories = computed(() => {
  const allCategories = new Set<string>();

  tableroStore.tableros.forEach((tablero: ITablero) => {
    if (tablero.fuentes_detalles) {
      tablero.fuentes_detalles.forEach((fuente: IFuenteInfo) => {
        if ((fuente as any).categoria_nombre) {
          allCategories.add((fuente as any).categoria_nombre);
        }
      });
    }
  });

  return Array.from(allCategories).sort();
});

// Computed: Obtener todas las fuentes únicas de los tableros
const fuentes = computed(() => {
  const allFuentes = new Map<number, IFuenteInfo>();

  tableroStore.tableros.forEach((tablero: ITablero) => {
    if (tablero.fuentes_detalles) {
      tablero.fuentes_detalles.forEach((fuente: IFuenteInfo) => {
        if (!allFuentes.has(fuente.id)) {
          allFuentes.set(fuente.id, fuente);
        }
      });
    }
  });

  return Array.from(allFuentes.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );
});

const isPowerBI = (tablero: Tablero): boolean => {
  return !!(
    tablero.source?.toLowerCase().includes('powerbi') ||
    tablero.url?.toLowerCase().includes('powerbi')
  );
};

const isTableau = (tablero: Tablero): boolean => {
  return !!(
    tablero.source?.toLowerCase().includes('tableau') ||
    tablero.url?.toLowerCase().includes('tableau') ||
    tablero.codigo_embed?.includes('tableau')
  );
};


const getTableroIcon = (tablero: Tablero): string => {
  if (isTableau(tablero)) return 'fas fa-chart-pie';
  if (isPowerBI(tablero)) return 'fas fa-chart-bar';
  return 'fas fa-chart-line';
};

const getTableroType = (tablero: Tablero): string => {
  if (isTableau(tablero)) return 'Tableau';
  if (isPowerBI(tablero)) return 'Power BI';
  return 'BI';
};

// Obtener clase CSS para la categoría de la fuente
const getFuenteCategoryClass = (fuente: IFuenteInfo): string => {
  const categoria = (fuente as any).categoria_nombre;
  if (!categoria) return 'bg-gray-500';

  const categoryClasses: { [key: string]: string } = {
    'ventas': 'bg-gradient-to-r from-blue-500 to-blue-600',
    'marketing': 'bg-gradient-to-r from-green-500 to-green-600',
    'finanzas': 'bg-gradient-to-r from-purple-500 to-purple-600',
    'operaciones': 'bg-gradient-to-r from-orange-500 to-orange-600',
    'recursos humanos': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'tecnología': 'bg-gradient-to-r from-red-500 to-red-600',
    'tecnologia': 'bg-gradient-to-r from-red-500 to-red-600'
  };

  const normalizedCategory = categoria.toLowerCase();
  return categoryClasses[normalizedCategory] || 'bg-gray-500';
};

// Limpiar todos los filtros
const clearFilters = (): void => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedFuente.value = '';
  selectedType.value = '';
  showOnlyActive.value = true;
};

// Filtrar y ordenar tableros
const filteredTableros = computed(() => {
  let filtered = tableroStore.tableros as Tablero[];

  filtered = filtered.filter((tablero: Tablero) => {
    // 1. Filtro por estado activo
    if (showOnlyActive.value && !tablero.is_active) {
      return false;
    }

    // 2. Filtro por búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const nameMatch = tablero.name && tablero.name.toLowerCase().includes(query);
      const descMatch = tablero.descripcion && tablero.descripcion.toLowerCase().includes(query);
      const sourceMatch = tablero.source && tablero.source.toLowerCase().includes(query);
      const fuentesMatch = tablero.fuentes_detalles &&
        tablero.fuentes_detalles.some((fuente: IFuenteInfo) =>
          fuente.name && fuente.name.toLowerCase().includes(query)
        );

      if (!nameMatch && !descMatch && !sourceMatch && !fuentesMatch) {
        return false;
      }
    }

    // 3. Filtro por categoría
    if (selectedCategory.value) {
      if (!tablero.fuentes_detalles ||
        !tablero.fuentes_detalles.some((fuente: IFuenteInfo) =>
          (fuente as any).categoria_nombre === selectedCategory.value
        )) {
        return false;
      }
    }

    // 4. Filtro por fuente específica
    if (selectedFuente.value) {
      const fuenteId = parseInt(selectedFuente.value);
      if (!tablero.fuentes_detalles ||
        !tablero.fuentes_detalles.some((fuente: IFuenteInfo) =>
          fuente.id === fuenteId
        )) {
        return false;
      }
    }

    // 5. Filtro por tipo de tablero
    if (selectedType.value) {
      if (selectedType.value === 'powerbi' && !isPowerBI(tablero)) {
        return false;
      }
      if (selectedType.value === 'tableau' && !isTableau(tablero)) {
        return false;
      }
    }

    return true;
  });

  // Ordenar por frecuencia de actualización
  const frecuenciaOrden: { [key: string]: number } = {
    'Diario': 1,
    'Semanal': 2,
    'Mensual': 3,
    'Anual': 4,
    'Diaria': 1,
    'Quincenal': 2,
    'Trimestral': 3,
    'Semestral': 4,
    'N/A': 5
  };

  return filtered.sort((a: Tablero, b: Tablero) => {
    const prioridadA = frecuenciaOrden[a.update_frequency || 'N/A'] || 5;
    const prioridadB = frecuenciaOrden[b.update_frequency || 'N/A'] || 5;
    return prioridadA - prioridadB;
  });
});

// Abrir tablero
const openTablero = (tablero: Tablero): void => {
  if (!tablero.is_active) return;

  selectedTablero.value = { ...tablero };
  showModal.value = true;
  document.body.style.overflow = 'hidden';

  // Si es Tableau, procesar el embed después de que el modal se renderice
  if (isTableau(selectedTablero.value) && selectedTablero.value.codigo_embed) {
    nextTick(() => {
      setTimeout(() => {
        procesarTableauEmbed(selectedTablero.value!.codigo_embed!);
      }, 300);
    });
  }
};

// Procesar embed de Tableau
const procesarTableauEmbed = (codigoEmbed: string): void => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = codigoEmbed;

    const vizElement = tempDiv.querySelector('.tableauViz') as HTMLElement;
    const placeholder = tempDiv.querySelector('.tableauPlaceholder') as HTMLElement;
    const scriptElements = tempDiv.querySelectorAll('script');

    if (vizElement && placeholder) {
      vizElement.style.width = '100%';
      vizElement.style.height = '100%';
      vizElement.style.display = 'block';

      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.position = 'relative';

      scriptElements.forEach(script => {
        if (script.textContent?.includes('vizElement.style.width')) {
          script.textContent = `
            var divElement = document.getElementById('${placeholder.id}');
            var vizElement = divElement.getElementsByTagName('object')[0];
            vizElement.style.width = '100%';
            vizElement.style.height = '100%';
            vizElement.style.minWidth = '100px';
            vizElement.style.maxWidth = '100%';
            vizElement.style.minHeight = '100px';
            vizElement.style.maxHeight = '100%';
            
            var scriptElement = document.createElement('script');
            scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
            vizElement.parentNode.insertBefore(scriptElement, vizElement);
          `;
        }
      });

      const tableauContainer = document.querySelector('.tableau-container');
      if (tableauContainer) {
        tableauContainer.innerHTML = tempDiv.innerHTML;

        setTimeout(() => {
          const newScripts = tableauContainer.querySelectorAll('script');
          newScripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
          });
        }, 100);
      }
    }
  } catch (error) {
    console.error('Error procesando embed de Tableau:', error);
  }
};

// Cerrar modal
const closeModal = (): void => {
  showModal.value = false;
  selectedTablero.value = null;
  document.body.style.overflow = 'auto';
};

// Manejar eventos del iframe
const iframeLoaded = (): void => {
  console.log('Iframe cargado correctamente');
};


const iframeError = (event: Event): void => {
  console.error('Error al cargar el iframe:', event);
};

// Cargar tableros
const loadTableros = async (): Promise<void> => {
  try {
    await tableroStore.ListTablero();
  } catch (error) {
    console.error('Error loading tableros:', error);
  }
};

// Inicialización
onMounted(async () => {
  await loadTableros();
});

// Limpiar al desmontar
onUnmounted(() => {
  if (showModal.value) {
    document.body.style.overflow = 'auto';
  }
});
</script>
<style scoped>
/* Estilos específicos para el modal que necesitan CSS tradicional */
.modal-content {
  width: 95%;
  height: 90%;
}

.modal-content.tableau-modal {
  width: 99% !important;
  height: 99% !important;
  border-radius: 12px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.modal-header.tableau-header {
  padding: 1rem 1.5rem;
  min-height: auto;
}

.modal-body {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.iframe-container,
.tableau-container {
  flex: 1;
  width: 100%;
  height: 100%;
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0 0 1rem 1rem;
}

.tableau-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

/* Dark mode transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    height: 85%;
    margin: 0;
  }
  
  .modal-header {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-subtitle {
    margin-left: 0;
  }
}
</style>