<template>
    <main class="min-h-screen bg-gray-50 py-6">
        <div class="container mx-auto px-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-6">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Reporte de Establecimientos</h1>
                            <p class="text-gray-600 mt-1">Seguimiento de carga de datos por mes</p>
                        </div>
                        <button @click="generarReporte" :disabled="loading"
                            class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                            <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
                            <i v-else class="bi bi-arrow-clockwise mr-2"></i>
                            {{ loading ? 'Generando...' : 'Actualizar Reporte' }}
                        </button>
                    </div>

                    <!-- Filtros principales -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div class="flex flex-wrap gap-4 items-center">
                            <div>
                                <label class="block text-sm font-medium text-blue-800 mb-1">Año</label>
                                <select v-model="filtroAnio" @change="cambiarAnio"
                                    class="px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option v-for="anio in anosDisponibles" :key="anio" :value="anio">
                                        {{ anio }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-blue-800 mb-1">Mes Inicio</label>
                                <select v-model="filtroMesInicio" @change="filtrarReporte"
                                    class="px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-blue-800 mb-1">Mes Fin</label>
                                <select v-model="filtroMesFin" @change="filtrarReporte"
                                    class="px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Resumen general -->
                    <div v-if="reporteData" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <div class="p-2 bg-blue-100 rounded-lg mr-3">
                                    <i class="bi bi-building text-blue-600 text-lg"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-blue-800">Total Establecimientos</p>
                                    <p class="text-2xl font-bold text-blue-900">{{ reporteData.total_establecimientos }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <div class="p-2 bg-yellow-100 rounded-lg mr-3">
                                    <i class="bi bi-exclamation-triangle text-yellow-600 text-lg"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-yellow-800">Con Pendientes</p>
                                    <p class="text-2xl font-bold text-yellow-900">{{
                                        reporteData.establecimientos_con_pendientes }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <div class="p-2 bg-green-100 rounded-lg mr-3">
                                    <i class="bi bi-check-circle text-green-600 text-lg"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-green-800">Al Día</p>
                                    <p class="text-2xl font-bold text-green-900">
                                        {{ reporteData.total_establecimientos -
                                        reporteData.establecimientos_con_pendientes }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center">
                                <div class="p-2 bg-gray-100 rounded-lg mr-3">
                                    <i class="bi bi-calendar-range text-gray-600 text-lg"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-800">Período Verificado</p>
                                    <p class="text-sm font-bold text-gray-900">{{ reporteData.periodo_verificado }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Filtros secundarios -->
                    <div class="flex flex-wrap gap-3 mb-6 items-center">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="bi bi-search text-gray-400"></i>
                            </div>
                            <input type="text" v-model="filtroBusqueda" placeholder="Buscar establecimiento..."
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64">
                        </div>

                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="bi bi-filter text-gray-400"></i>
                            </div>
                            <select v-model="filtroEstado" @change="filtrarReporte"
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                <option value="todos">Todos los estados</option>
                                <option value="pendientes">Solo pendientes</option>
                                <option value="al-dia">Al día</option>
                            </select>
                        </div>

                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="bi bi-sort-down text-gray-400"></i>
                            </div>
                            <select v-model="filtroOrden" @change="filtrarReporte"
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                <option value="pendientes-desc">Más pendientes primero</option>
                                <option value="pendientes-asc">Menos pendientes primero</option>
                                <option value="nombre-asc">Nombre A-Z</option>
                                <option value="nombre-desc">Nombre Z-A</option>
                                <option value="registros-desc">Más registros primero</option>
                                <option value="registros-asc">Menos registros primero</option>
                            </select>
                        </div>

                        <button @click="exportarExcel" :disabled="!reporteFiltrado.length || loading"
                            class="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                            <i class="bi bi-file-earmark-excel mr-2"></i>
                            Exportar Excel
                        </button>
                    </div>

                    <!-- Tabla de reporte -->
                    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <DataTable :value="reporteFiltrado" :paginator="true" :rows="itemsPorPagina"
                            :totalRecords="totalRegistrosFiltrados" :loading="loading"
                            :rowsPerPageOptions="[10, 25, 50, 100]" scrollable scrollHeight="flex"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} establecimientos"
                            responsiveLayout="scroll" rowHover class="p-datatable-sm text-sm">

                            <!-- Columna enumeradora -->
                            <Column field="index" header="N°" headerStyle="width: 3rem" :sortable="false">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>

                            <!-- Establecimiento -->
                            <Column field="establecimiento" header="Establecimiento" :sortable="true"
                                headerStyle="min-width: 200px" frozen>
                                <template #body="{ data }">
                                    <div>
                                        <div class="font-semibold text-gray-800">{{ data.establecimiento }}</div>
                                        <div class="text-xs text-blue-600 mt-1">{{ data.username }}</div>
                                    </div>
                                </template>
                            </Column>

                            <!-- Departamento -->
                            <Column field="departamento" header="Departamento" :sortable="true"
                                headerStyle="min-width: 120px">
                                <template #body="{ data }">
                                    <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                        {{ data.departamento || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <!-- Total Pendientes -->
                            <Column field="total_pendientes" header="Meses Pendientes" :sortable="true"
                                headerStyle="min-width: 100px">
                                <template #body="{ data }">
                                    <div class="flex items-center space-x-2">
                                        <span :class="[
                                            'px-2 py-1 rounded-full text-xs font-bold',
                                            data.total_pendientes === 0
                                                ? 'bg-green-100 text-green-800'
                                                : data.total_pendientes <= 2
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                        ]">
                                            {{ data.total_pendientes }}
                                        </span>
                                        <span class="text-xs text-gray-500">
                                            de {{ mesesCabeceras.length }}
                                        </span>
                                    </div>
                                </template>
                            </Column>

                            <!-- Total Registros -->
                            <Column field="total_registros" header="Total Registros" :sortable="true"
                                headerStyle="min-width: 100px">
                                <template #body="{ data }">
                                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                                        {{ calcularTotalRegistros(data) }}
                                    </span>
                                </template>
                            </Column>

                            <!-- Columnas dinámicas para cada mes -->
                            <Column v-for="mes in mesesCabeceras" :key="mes" :field="mes" :header="mes"
                                headerStyle="min-width: 80px" :sortable="true">
                                <template #body="{ data }">
                                    <div class="text-center">
                                        <span :class="[
                                            'px-2 py-1 rounded text-xs font-medium inline-block min-w-10 cursor-help',
                                            obtenerCantidadRegistros(data, mes) > 0
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                        ]" :title="`${mes}: ${obtenerCantidadRegistros(data, mes)} registros`">
                                            {{ obtenerCantidadRegistros(data, mes) }}
                                        </span>
                                    </div>
                                </template>
                            </Column>

                            <!-- Acciones -->
                            <Column header="Acciones" headerStyle="width: 100px" :sortable="false">
                                <template #body="{ data }">
                                    <button @click="verDetalle(data)"
                                        class="inline-flex items-center px-3 py-1 bg-blue-100 border border-blue-300 text-blue-700 rounded text-xs hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                                        <i class="bi bi-eye mr-1"></i>
                                        Detalle
                                    </button>
                                </template>
                            </Column>

                            <template #empty>
                                <div class="text-center py-8">
                                    <div class="flex flex-col items-center justify-center text-gray-500 space-y-2">
                                        <i class="bi bi-inbox text-4xl"></i>
                                        <p class="text-lg font-medium">No se encontraron establecimientos</p>
                                        <p v-if="loading" class="text-sm">Cargando reporte...</p>
                                        <p v-else class="text-sm">No hay datos para mostrar</p>
                                    </div>
                                </div>
                            </template>
                        </DataTable>
                    </div>

                    <!-- Modal de detalle -->
                    <Dialog v-model:visible="mostrarModal" modal header="Detalle de Registros por Mes"
                        :style="{ width: '800px' }">
                        <div v-if="establecimientoSeleccionado" class="space-y-4">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-semibold text-gray-800 text-lg">{{
                                    establecimientoSeleccionado.establecimiento }}</h4>
                                <div class="grid grid-cols-2 gap-2 mt-2">
                                    <p class="text-sm text-gray-600"><span class="font-medium">Código:</span> {{
                                        establecimientoSeleccionado.codigo_establecimiento }}</p>
                                    <p class="text-sm text-gray-600"><span class="font-medium">Departamento:</span> {{
                                        establecimientoSeleccionado.departamento }}</p>
                                    <p class="text-sm text-gray-600"><span class="font-medium">Usuario:</span> {{
                                        establecimientoSeleccionado.username }}</p>
                                    <p class="text-sm text-gray-600"><span class="font-medium">Total Registros:</span>
                                        <span class="font-bold text-blue-600">{{
                                            calcularTotalRegistros(establecimientoSeleccionado) }}</span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h5 class="font-semibold text-gray-800 mb-3">Registros por Mes ({{ filtroAnio }}):</h5>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div v-for="mes in mesesCabeceras" :key="mes" :class="[
                                        'border rounded p-3 text-center transition-all duration-200 hover:shadow-md',
                                        obtenerCantidadRegistros(establecimientoSeleccionado, mes) > 0
                                            ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                            : 'bg-red-50 border-red-200 hover:bg-red-100'
                                    ]">
                                        <div class="font-semibold text-sm"
                                            :class="obtenerCantidadRegistros(establecimientoSeleccionado, mes) > 0 ? 'text-green-800' : 'text-red-800'">
                                            {{ mes }}
                                        </div>
                                        <div class="text-2xl font-bold mt-2"
                                            :class="obtenerCantidadRegistros(establecimientoSeleccionado, mes) > 0 ? 'text-green-600' : 'text-red-600'">
                                            {{ obtenerCantidadRegistros(establecimientoSeleccionado, mes) }}
                                        </div>
                                        <div class="text-xs mt-1"
                                            :class="obtenerCantidadRegistros(establecimientoSeleccionado, mes) > 0 ? 'text-green-600' : 'text-red-600'">
                                            {{ obtenerCantidadRegistros(establecimientoSeleccionado, mes) > 0 ?
                                            'registros' : 'pendiente' }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end pt-4 border-t border-gray-200">
                                <button @click="mostrarModal = false"
                                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '@/components/services/Axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Interfaces TypeScript
interface EstablecimientoReporte {
    usuario_id: number
    username: string
    establecimiento: string
    codigo_establecimiento: string
    departamento: string
    meses_pendientes: string[]
    total_pendientes: number
    registros_por_mes: { [mes: string]: number }
}

interface ReporteData {
    periodo_verificado: string
    total_establecimientos: number
    establecimientos_con_pendientes: number
    meses_verificados?: string[]
    reporte_pendientes: EstablecimientoReporte[]
}

// Variables reactivas
const loading = ref<boolean>(false)
const reporteData = ref<ReporteData | null>(null)
const mostrarModal = ref<boolean>(false)
const establecimientoSeleccionado = ref<EstablecimientoReporte | null>(null)
const itemsPorPagina = ref<number>(50)

// Filtros
const filtroAnio = ref<number>(new Date().getFullYear())
const filtroMesInicio = ref<number>(1) // Enero por defecto
const filtroMesFin = ref<number>(new Date().getMonth() + 1) // Mes actual
const filtroBusqueda = ref<string>('')
const filtroEstado = ref<string>('todos')
const filtroOrden = ref<string>('pendientes-desc')

// Años disponibles (desde 2023 hasta el año actual + 1)
const anosDisponibles = computed(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 2025; year <= currentYear + 1; year++) {
        years.push(year)
    }
    return years
})

// Computed properties
const mesesCabeceras = computed(() => {
    if (!reporteData.value?.meses_verificados) return []

    // Filtrar meses según los filtros seleccionados
    return reporteData.value.meses_verificados.filter(mes => {
        const partes = mes.split('/')
        if (partes.length < 2) return false

        const mesStr: string = partes[0] as string
        const anioStr: string = partes[1] as string
        const mesNum = parseInt(mesStr)
        const anioNum = parseInt(anioStr)

        // Validar que los números sean válidos
        if (isNaN(mesNum) || isNaN(anioNum)) return false

        return anioNum === filtroAnio.value &&
            mesNum >= filtroMesInicio.value &&
            mesNum <= filtroMesFin.value
    })
})
const reporteFiltrado = computed(() => {
    if (!reporteData.value?.reporte_pendientes) return []

    let filtered = [...reporteData.value.reporte_pendientes]

    // Filtro por búsqueda
    if (filtroBusqueda.value) {
        const search = filtroBusqueda.value.toLowerCase()
        filtered = filtered.filter(est =>
            est.establecimiento.toLowerCase().includes(search) ||
            est.codigo_establecimiento.toLowerCase().includes(search) ||
            est.departamento.toLowerCase().includes(search) ||
            est.username.toLowerCase().includes(search)
        )
    }

    // Filtro por estado
    if (filtroEstado.value === 'pendientes') {
        filtered = filtered.filter(est => est.total_pendientes > 0)
    } else if (filtroEstado.value === 'al-dia') {
        filtered = filtered.filter(est => est.total_pendientes === 0)
    }

    // Ordenamiento
    filtered.sort((a, b) => {
        switch (filtroOrden.value) {
            case 'pendientes-desc':
                return b.total_pendientes - a.total_pendientes
            case 'pendientes-asc':
                return a.total_pendientes - b.total_pendientes
            case 'nombre-asc':
                return a.establecimiento.localeCompare(b.establecimiento)
            case 'nombre-desc':
                return b.establecimiento.localeCompare(a.establecimiento)
            case 'registros-desc':
                return calcularTotalRegistros(b) - calcularTotalRegistros(a)
            case 'registros-asc':
                return calcularTotalRegistros(a) - calcularTotalRegistros(b)
            default:
                return 0
        }
    })

    return filtered
})

const totalRegistrosFiltrados = computed(() => {
    return reporteFiltrado.value.length
})

// Métodos
const obtenerCantidadRegistros = (establecimiento: EstablecimientoReporte, mes: string): number => {
    return establecimiento.registros_por_mes?.[mes] || 0
}

const calcularTotalRegistros = (establecimiento: EstablecimientoReporte): number => {
    if (!establecimiento.registros_por_mes) return 0

    // Sumar solo los registros de los meses filtrados
    return mesesCabeceras.value.reduce((sum, mes) => {
        return sum + (establecimiento.registros_por_mes?.[mes] || 0)
    }, 0)
}

const cambiarAnio = (): void => {
    // Resetear meses al cambiar de año
    filtroMesInicio.value = 1 // Enero por defecto
    const mesActual = new Date().getMonth() + 1
    filtroMesFin.value = filtroAnio.value === new Date().getFullYear() ? mesActual : 12
}


const generarReporte = async (): Promise<void> => {
    try {
        loading.value = true
        const params = {
            year: filtroAnio.value,
            mes_inicio: filtroMesInicio.value,
            mes_fin: filtroMesFin.value
        }

        const response = await api.get<ReporteData>('/dimon/consultas-externas/reporte-establecimientos/', { params })
        reporteData.value = response.data
    } catch (error: any) {
        // Aquí podrías agregar notificaciones de error
    } finally {
        loading.value = false
    }
}

const verDetalle = (establecimiento: EstablecimientoReporte): void => {
    establecimientoSeleccionado.value = establecimiento
    mostrarModal.value = true
}

const filtrarReporte = (): void => {
    // El computed property se actualiza automáticamente
}

const exportarExcel = async (): Promise<void> => {
    try {
        if (!reporteData.value) return

        // Preparar datos para Excel
        const excelData = reporteFiltrado.value.map(est => {
            const rowData: any = {
                'Código': est.codigo_establecimiento,
                'Establecimiento': est.establecimiento,
                'Departamento': est.departamento,
                'Usuario': est.username,
                'Total Pendientes': est.total_pendientes,
                'Total Registros': calcularTotalRegistros(est)
            }

            // Agregar columnas para cada mes filtrado
            mesesCabeceras.value.forEach(mes => {
                rowData[mes] = obtenerCantidadRegistros(est, mes)
            })

            rowData['Estado'] = est.total_pendientes === 0 ? 'AL DÍA' : 'PENDIENTE'

            return rowData
        })

        const worksheet = XLSX.utils.json_to_sheet(excelData)

        // Ajustar anchos de columnas
        const wscols = [
            { wch: 15 }, // Código
            { wch: 40 }, // Establecimiento
            { wch: 20 }, // Departamento
            { wch: 20 }, // Usuario
            { wch: 15 }, // Total Pendientes
            { wch: 15 }, // Total Registros
            ...mesesCabeceras.value.map(() => ({ wch: 10 })), // Columnas de meses
            { wch: 15 }  // Estado
        ]
        worksheet['!cols'] = wscols

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteEstablecimientos')

        // Agregar información del período
        const infoData = [
            ['REPORTE DE ESTABLECIMIENTOS - REGISTROS POR MES'],
            ['Año:', filtroAnio.value],
            ['Período:', `Meses ${filtroMesInicio.value} a ${filtroMesFin.value}`],
            ['Total establecimientos:', reporteData.value.total_establecimientos],
            ['Establecimientos con pendientes:', reporteData.value.establecimientos_con_pendientes],
            ['Fecha de generación:', new Date().toLocaleString('es-ES')],
            [''],
            ['LEYENDA:'],
            ['Número en celda = Cantidad real de registros subidos'],
            ['Verde = Tiene registros, Rojo = Pendiente (0 registros)'],
            ['']
        ]
        const infoSheet = XLSX.utils.aoa_to_sheet(infoData)
        XLSX.utils.book_append_sheet(workbook, infoSheet, 'Información')

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
            compression: true
        })

        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const dateStr = new Date().toISOString().split('T')[0]
        saveAs(blob, `reporte_establecimientos_${filtroAnio.value}_${dateStr}.xlsx`)

    } catch (error) {
        console.error('Error al exportar a Excel:', error)
    }
}

// Lifecycle
onMounted(() => {
    // Inicializar con el año actual
    filtroAnio.value = new Date().getFullYear()
    filtroMesFin.value = new Date().getMonth() + 1
    generarReporte()
})
</script>

<style scoped>
/* Estilos para mejorar la visualización de la tabla con scroll horizontal */
:deep(.p-datatable-wrapper) {
    max-height: 70vh;
}

:deep(.p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
    text-align: center;
}

:deep(.p-datatable-tbody > tr > td) {
    text-align: center;
}

:deep(.p-column-header-content) {
    justify-content: center;
}
*{
    font-size: 0.80rem;
}
</style>