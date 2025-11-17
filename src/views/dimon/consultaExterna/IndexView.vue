<template>
    <main class="min-h-screen bg-gray-50 py-6">
        <div class="container mx-auto px-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-6">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-6">
                        <h1 class="text-2xl font-bold text-gray-800">Importar Consultas Externas</h1>
                    </div>

                    <!-- Sección de estructura del Excel -->
                    <div class="mb-6">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                            @click="toggleEstructura">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-2">
                                    <i class="pi pi-info-circle text-blue-600"></i>
                                    <span class="text-blue-800 font-medium">
                                        Estructura requerida del Excel (columnas en orden exacto)
                                    </span>
                                </div>
                                <i :class="mostrarEstructura ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
                                    class="text-blue-600 transition-transform duration-200"></i>
                            </div>

                            <transition enter-active-class="transition-all duration-300 ease-out"
                                leave-active-class="transition-all duration-200 ease-in"
                                enter-from-class="opacity-0 transform -translate-y-2"
                                leave-to-class="opacity-0 transform -translate-y-2">
                                <div v-if="mostrarEstructura" class="mt-4">
                                    <DataTable :value="columnasEstructura" class="p-datatable-sm" :scrollable="true"
                                        scrollHeight="flex">
                                        <Column field="numero" header="#" headerStyle="width: 5%"></Column>
                                        <Column field="nombre" header="Campo"></Column>
                                        <Column field="requerido" header="Requerido" headerStyle="width: 10%">
                                            <template #body="{ data }">
                                                <span v-if="data.requerido" class="text-red-500 font-bold">*</span>
                                            </template>
                                        </Column>
                                        <Column field="recomendacion" header="Recomendaciones"></Column>
                                    </DataTable>

                                    <div class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <h6 class="font-bold text-yellow-800 mb-2">📌 Recomendaciones importantes:</h6>
                                        <ul class="text-yellow-700 text-sm space-y-1">
                                            <li>• Las columnas deben estar exactamente en este orden (comenzando desde
                                                0)</li>
                                            <li>• Formatos de fecha: DD/MM/YYYY o YYYY-MM-DD</li>
                                            <li>• Sexo debe ser 'M' o 'F'</li>
                                            <li>• Campos marcados con * son obligatorios</li>
                                        </ul>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <!-- Formulario de importación -->
                    <div v-if="!esStaff" class="mb-6">
                        <label for="excelFile" class="block text-sm font-medium text-gray-700 mb-2">
                            Seleccionar archivo Excel
                        </label>
                        <input type="file"
                            class="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            id="excelFile" accept=".xlsx, .xls" @change="handleFileChange" :disabled="loading">
                        <p class="mt-1 text-sm text-gray-500">Formatos soportados: .xlsx, .xls (Máx. 10MB)</p>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex flex-wrap gap-3 mb-6 items-center">
                        <!-- Botón Importar Datos -->
                        <button v-if="!esStaff" @click="uploadFile" :disabled="!file || loading"
                            class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                            <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
                            <i v-else class="bi bi-upload mr-2"></i>
                            {{ loading ? 'Importando...' : 'Importar Datos' }}
                        </button>

                        <!-- Botón Limpiar -->
                        <button @click="resetForm" :disabled="loading"
                            class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                            <i class="bi bi-trash mr-2"></i>
                            Limpiar
                        </button>

                        <!-- Botón Exportar Excel
                        <button @click="exportToExcel" :disabled="registros.length === 0 || loading"
                            class="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                            <i class="bi bi-file-earmark-excel mr-2"></i>
                            Exportar Excel
                        </button> -->

                        <!-- Botón Descargar Plantilla -->
                        <button @click="descargarPlantilla"
                            class="inline-flex items-center px-4 py-2 bg-cyan-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-cyan-700 active:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200">
                            <i class="bi bi-download mr-2"></i>
                            Descargar Plantilla
                        </button>

                        <!-- Filtros -->
                        <div class="flex flex-wrap gap-3 items-center ml-auto">
                            <!-- Filtro de Usuario (solo para superusuarios) -->
                            <div class="relative" v-if="esSuperusuario">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="bi bi-person text-gray-400"></i>
                                </div>
                                <select v-model="filtroUsuario" @change="cargarRegistros"
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option :value="null">Todos los usuarios</option>
                                    <option v-for="user in usuariosImportadores" :key="user.id" :value="user.id">
                                        {{ user.username }}
                                    </option>
                                </select>
                            </div>

                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="bi bi-calendar text-gray-400"></i>
                                </div>
                                <select v-model="filtroAnio" @change="cargarRegistros"
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option :value="null">Todos los años</option>
                                    <option v-for="year in añosDisponibles" :key="year" :value="year">
                                        {{ year }}
                                    </option>
                                </select>
                            </div>

                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="bi bi-filter text-gray-400"></i>
                                </div>
                                <select v-model="filtroMes" @change="cargarRegistros" :disabled="!filtroAnio"
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                                    <option :value="null">Todos</option>
                                    <option v-for="month in mesesFiltrados" :key="`${month.year}-${month.month}`"
                                        :value="month.month">
                                        {{ getMonthName(month.month) }}
                                    </option>
                                </select>
                            </div>

                            <button @click="resetFiltros" :disabled="!filtroMes && !filtroAnio"
                                class="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                                <i class="bi bi-x-lg mr-1"></i>
                                Limpiar
                            </button>
                        </div>
                    </div>

                    <!-- Resultados de importación -->
                    <div v-if="importResult" class="mb-6">
                        <div :class="[
                            'rounded-lg p-4 border transition-all duration-300',
                            importResult.success
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        ]">
                            <h5 class="font-semibold mb-2">{{ importResult.message }}</h5>
                            <div :class="importResult.success ? 'border-green-200' : 'border-red-200'"
                                class="border-t my-3"></div>

                            <div v-if="importResult.success && importResult.omitidas && importResult.omitidas > 0"
                                class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                                <div class="flex items-center">
                                    <i class="bi bi-exclamation-triangle-fill text-yellow-600 mr-2"></i>
                                    <span class="text-yellow-800">
                                        Se omitieron {{ importResult.omitidas }} registros con fechas anteriores a marzo
                                        2025
                                    </span>
                                </div>
                            </div>

                            <template v-if="importResult.success">
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span class="font-semibold">Total filas procesadas:</span>
                                        {{ importResult.total_filas }}
                                    </div>
                                    <div>
                                        <span class="font-semibold">Registros creados:</span>
                                        {{ importResult.creados }}
                                    </div>
                                    <div>
                                        <span class="font-semibold">Registros actualizados:</span>
                                        {{ importResult.actualizados }}
                                    </div>
                                    <div v-if="importResult.omitidas && importResult.omitidas > 0">
                                        <span class="font-semibold">Registros omitidos:</span>
                                        {{ importResult.omitidas }}
                                    </div>
                                </div>
                            </template>

                            <div v-if="importResult.detalle_errores && importResult.detalle_errores.length"
                                class="mt-3">
                                <button @click="toggleErrores"
                                    class="inline-flex items-center px-3 py-1 bg-red-100 border border-red-300 text-red-700 rounded text-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200">
                                    {{ mostrarErrores ? 'Ocultar' : 'Mostrar' }} detalles de errores ({{
                                    importResult.errores }})
                                </button>

                                <transition enter-active-class="transition-all duration-300 ease-out"
                                    leave-active-class="transition-all duration-200 ease-in"
                                    enter-from-class="opacity-0 transform -translate-y-2"
                                    leave-to-class="opacity-0 transform -translate-y-2">
                                    <div v-if="mostrarErrores"
                                        class="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <h6 class="font-semibold mb-2 text-gray-800">Detalles completos:</h6>
                                        <ul class="space-y-1">
                                            <li v-for="(error, index) in importResult.detalle_errores" :key="index"
                                                class="flex items-start">
                                                <span
                                                    class="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded-full text-xs font-semibold mr-2 shrink-0">
                                                    {{ index + 1 }}
                                                </span>
                                                <span class="text-sm text-gray-700">{{ error }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>

                    <!-- Listado de registros -->
                    <div>
                        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                            <h2 class="text-lg font-semibold text-gray-800 mb-2 md:mb-0">
                                Registros Importados ({{ totalRegistros.toLocaleString() }})
                            </h2>
                        </div>

                        <DataTable :value="registros" :paginator="true" :rows="itemsPorPagina"
                            :totalRecords="totalRegistros" :loading="loading"
                            :rowsPerPageOptions="[10, 25, 50, 100, 200]"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                            responsiveLayout="stack" rowHover class="p-datatable-sm text-sm">

                            <!-- Columna enumeradora -->
                            <Column header="N°" headerStyle="width: 3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>


                            <Column field="fecha_nacimiento" header="Fecha Nacimiento">
                                <template #body="{ data }">
                                    <span class="text-gray-700">{{ formatFecha(data.fecha_nacimiento) }}</span>
                                </template>
                            </Column>

                            <Column field="sexo" header="Sexo">
                                <template #body="{ data }">
                                    <span :class="[
                                        'px-2 py-1 rounded-full text-xs font-semibold',
                                        data.sexo === 'M' ? 'bg-blue-100 text-blue-800' :
                                            data.sexo === 'F' ? 'bg-pink-100 text-pink-800' :
                                                'bg-gray-100 text-gray-800'
                                    ]">
                                        {{ data.sexo || 'N/A' }}
                                    </span>
                                </template>
                            </Column>



                            <Column field="fecha_hora_cita_otorgada" header="Cita Otorgada">
                                <template #body="{ data }">
                                    <span class="text-gray-700">{{ formatDateTime(data.fecha_hora_cita_otorgada)
                                        }}</span>
                                </template>
                            </Column>

                            <Column field="fecha_hora_atencion" header="Fecha Atención">
                                <template #body="{ data }">
                                    <span class="text-gray-700">{{ formatDateTime(data.fecha_hora_atencion) }}</span>
                                </template>
                            </Column>

                            <Column field="diagnostico_medico" header="Diagnóstico">
                                <template #body="{ data }">
                                    <span class="max-w-xs truncate block text-gray-700"
                                        :title="data.diagnostico_medico">
                                        {{ data.diagnostico_medico || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="dx_CIE_10_1" header="dx CIE-10 1">
                                <template #body="{ data }">
                                    <span class="font-mono text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {{ data.dx_CIE_10_1 || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="dx_CIE_10_2" header="dx CIE-10 2">
                                <template #body="{ data }">
                                    <span class="font-mono text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        {{ data.dx_CIE_10_2 || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="dx_CIE_10_3" header="dx CIE-10 3">
                                <template #body="{ data }">
                                    <span class="font-mono text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                        {{ data.dx_CIE_10_3 || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="especialidad" header="Especialidad">
                                <template #body="{ data }">
                                    <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                        {{ data.especialidad || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <template #empty>
                                <div class="text-center py-8">
                                    <div class="flex flex-col items-center justify-center text-gray-500 space-y-2">
                                        <i class="bi bi-inbox text-4xl"></i>
                                        <p class="text-lg font-medium">No se encontraron registros</p>
                                        <p class="text-sm">Importe un archivo Excel para comenzar</p>
                                    </div>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { api } from '@/components/services/Axios'
import { debounce } from 'lodash'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Interfaces TypeScript
interface ColumnaEstructura {
    numero: number
    nombre: string
    requerido: boolean
    recomendacion: string
}

interface ImportResult {
    success: boolean
    message: string
    total_filas?: number
    creados?: number
    actualizados?: number
    omitidas?: number
    errores?: number
    detalle_errores?: string[]
}

interface Registro {
    fecha_nacimiento: string
    sexo: string
    fecha_hora_cita_otorgada: string
    fecha_hora_atencion: string
    diagnostico_medico: string
    dx_CIE_10_1: string
    dx_CIE_10_2: string
    dx_CIE_10_3: string
    especialidad: string
    creado_por__username?: string
    fecha_creacion?: string
}

interface Usuario {
    id: number
    username: string
}

interface MesDisponible {
    year: number
    month: number
}

interface Pagination {
    current_page: number
    total_pages: number
}

interface ApiResponse {
    results: Registro[]
    count: number
    current_page: number
}

// Refs con tipos
const columnasEstructura = ref<ColumnaEstructura[]>([
    { numero: 0, nombre: 'Tipo de seguro', requerido: true, recomendacion: 'Ej: SIS, ESSALUD, Privado' },
    { numero: 1, nombre: 'Fecha Nacimiento', requerido: false, recomendacion: 'Formato DD/MM/YYYY' },
    { numero: 2, nombre: 'Sexo (M/F)', requerido: false, recomendacion: 'Solo "M" o "F"' },
    { numero: 3, nombre: 'Lugar de procedencia', requerido: false, recomendacion: 'Ej: Lima, Arequipa' },
    { numero: 4, nombre: 'N° HCL', requerido: false, recomendacion: 'Número de historia clínica' },
    { numero: 5, nombre: 'Fecha y Hora de Cita Otorgada', requerido: true, recomendacion: 'Formato DD/MM/YYYY HH:MM' },
    { numero: 6, nombre: 'Fecha y Hora de atención efectiva', requerido: true, recomendacion: 'Formato DD/MM/YYYY HH:MM' },
    { numero: 7, nombre: 'Diagnóstico Médico', requerido: false, recomendacion: 'Descripción textual' },
    { numero: 8, nombre: 'Dx CIE-10 Principal', requerido: false, recomendacion: 'Código CIE-10' },
    { numero: 9, nombre: 'Dx CIE-10 Secundario', requerido: false, recomendacion: 'Opcional' },
    { numero: 10, nombre: 'Dx CIE-10 Terciario', requerido: false, recomendacion: 'Opcional' },
    { numero: 11, nombre: 'Especialidad', requerido: false, recomendacion: 'Ej: Cardiología, Pediatría' }
])

// Variables reactivas con tipos
const mostrarEstructura = ref<boolean>(false)
const mostrarErrores = ref<boolean>(false)
const file = ref<File | null>(null)
const loading = ref<boolean>(false)
const importResult = ref<ImportResult | null>(null)
const registros = ref<Registro[]>([])
const busqueda = ref<string>('')
const itemsPorPagina = ref<number>(25)
const totalRegistros = ref<number>(0)
const esSuperusuario = ref<boolean>(false)
const esStaff = ref<boolean>(false)
const usuariosImportadores = ref<Usuario[]>([])
const filtroUsuario = ref<number | null>(null)
const mesesDisponibles = ref<MesDisponible[]>([])
const filtroMes = ref<number | null>(null)
const filtroAnio = ref<number | null>(null)
const paginacion = ref<Pagination>({
    current_page: 1,
    total_pages: 1
})

// Computed properties
const añosDisponibles = computed(() => {
    return [...new Set(mesesDisponibles.value.map(item => item.year))].sort((a, b) => b - a)
})

const mesesFiltrados = computed(() => {
    if (!filtroAnio.value) return mesesDisponibles.value
    return mesesDisponibles.value.filter(item => item.year === filtroAnio.value)
})

// Métodos
const toggleEstructura = (): void => {
    mostrarEstructura.value = !mostrarEstructura.value
}

const toggleErrores = (): void => {
    mostrarErrores.value = !mostrarErrores.value
}

const getMonthName = (month: number): string => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return months[month - 1] || ''
}

const resetFiltros = (): void => {
    filtroMes.value = null
    filtroAnio.value = null
    cargarRegistros()
}

const cargarMesesDisponibles = async (): Promise<void> => {
    try {
        const response = await api.get<MesDisponible[]>('/dimon/consultas-externas/meses-disponibles/')
        mesesDisponibles.value = response.data
        filtroAnio.value = null
        filtroMes.value = null
    } catch (error) {
        console.error('Error cargando meses disponibles:', error)
    }
}

const exportToExcel = async (): Promise<void> => {
    try {
        loading.value = true

        const response = await api.get<Registro[]>('/dimon/consultas-externas/exportar-todos/', {
            params: {
                search: busqueda.value
            }
        })

        const data = response.data

        if (data.length === 0) {
            importResult.value = {
                success: false,
                message: 'No hay datos para exportar'
            }
            return
        }

        const formatDateForExcel = (dateStr: string): string => {
            if (!dateStr) return 'N/A'
            const date = new Date(dateStr)
            return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString('es-ES')
        }

        const excelData = data.map(item => ({
            'Fecha Nacimiento': formatDateForExcel(item.fecha_nacimiento),
            'Sexo': item.sexo,
            'Fecha Cita Otorgada': formatDateForExcel(item.fecha_hora_cita_otorgada),
            'Fecha Atención': formatDateForExcel(item.fecha_hora_atencion),
            'Diagnóstico Médico': item.diagnostico_medico,
            'Dx CIE-10 Principal': item.dx_CIE_10_1,
            'Dx CIE-10 Secundario': item.dx_CIE_10_2,
            'Dx CIE-10 Terciario': item.dx_CIE_10_3,
            'Especialidad': item.especialidad,
            'Creado Por': item.creado_por__username || 'N/A',
            'Fecha Creación': formatDateForExcel(item.fecha_creacion || '')
        }))

        const worksheet = XLSX.utils.json_to_sheet(excelData, {
            cellDates: true,
            dateNF: 'dd/mm/yyyy hh:mm:ss'
        })

        const wscols = [
            { wch: 15 }, { wch: 15 }, { wch: 5 },
            { wch: 20 }, { wch: 15 }, { wch: 15 },
            { wch: 15 }, { wch: 20 }, { wch: 20 },
            { wch: 30 }, { wch: 15 }, { wch: 15 },
            { wch: 15 }, { wch: 20 }, { wch: 15 },
            { wch: 20 }
        ]
        worksheet['!cols'] = wscols

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ConsultasExternas')

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
            compression: true
        })

        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const dateStr = new Date().toISOString().replace(/[:.]/g, '-')
        saveAs(blob, `consultas_externas_${dateStr}.xlsx`)

    } catch (error: any) {
        console.error('Error al exportar a Excel:', error)
        importResult.value = {
            success: false,
            message: 'Error al exportar los datos a Excel: ' +
                (error.response?.data?.detail || error.message)
        }
    } finally {
        loading.value = false
    }
}

const handleFileChange = (event: Event): void => {
    const target = event.target as HTMLInputElement
    file.value = target.files?.[0] || null
    importResult.value = null
    console.log('📁 Archivo seleccionado:', file.value?.name)
}

const resetForm = (): void => {
    file.value = null
    importResult.value = null
    const fileInput = document.getElementById('excelFile') as HTMLInputElement
    if (fileInput) fileInput.value = ''
    console.log('🧹 Formulario limpiado')
}

// 🔧 CORRECCIÓN DEL BOTÓN IMPORTAR - Agrega más logs para debug
const uploadFile = async (): Promise<void> => {
    console.log('🔄 Iniciando uploadFile...')
    console.log('📁 Archivo actual:', file.value)

    if (!file.value) {
        console.log('❌ No hay archivo seleccionado')
        importResult.value = {
            success: false,
            message: 'Por favor selecciona un archivo Excel'
        }
        return
    }

    if (file.value.size > 10 * 1024 * 1024) {
        console.log('❌ Archivo demasiado grande:', file.value.size)
        importResult.value = {
            success: false,
            message: 'El archivo es demasiado grande (máximo 10MB permitidos)'
        }
        return
    }

    loading.value = true
    importResult.value = null
    mostrarErrores.value = false

    try {
        const formData = new FormData()
        formData.append('file', file.value)

        console.log('📤 Enviando archivo:', file.value.name)
        console.log('📊 Tamaño:', file.value.size)
        console.log('🔗 Endpoint:', '/dimon/consultas-externas/importar-excel/')

        const response = await api.post<ImportResult>('/dimon/consultas-externas/importar-excel/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 60000 // 60 segundos timeout
        })

        console.log('✅ Respuesta del servidor:', response.data)

        importResult.value = {
            ...response.data,
            success: true
        }

        // Recargar los registros después de importar
        await cargarRegistros()

    } catch (error: any) {
        console.error('❌ Error en la importación:', error)
        console.error('📋 Detalles del error:', error.response?.data)
        console.error('🔧 Error completo:', error)

        let errorMessage = 'Error al importar el archivo'

        if (error.response?.data?.error) {
            errorMessage = error.response.data.error
        } else if (error.response?.data?.detail) {
            errorMessage = error.response.data.detail
        } else if (error.message) {
            errorMessage = error.message
        }

        importResult.value = {
            success: false,
            message: errorMessage,
            detalle_errores: error.response?.data?.detalle_errores || [],
            total_filas: error.response?.data?.total_filas || 0,
            errores: error.response?.data?.errores || 0,
            omitidas: error.response?.data?.omitidas || 0
        }
    } finally {
        loading.value = false
        console.log('🏁 Importación finalizada')
    }
}

const cargarRegistros = async (): Promise<void> => {
    try {
        const params: any = {
            page: paginacion.value.current_page,
            page_size: itemsPorPagina.value,
            search: busqueda.value.trim()
        }

        if (filtroAnio.value) params.year = filtroAnio.value
        if (filtroMes.value) params.month = filtroMes.value
        if (esSuperusuario.value && filtroUsuario.value) params.user_id = filtroUsuario.value

        console.log('📡 Cargando registros con params:', params)

        const response = await api.get<ApiResponse>('/dimon/consultas-externas/', { params })
        registros.value = response.data.results
        totalRegistros.value = response.data.count
        paginacion.value = {
            current_page: response.data.current_page,
            total_pages: Math.ceil(response.data.count / itemsPorPagina.value)
        }

        console.log('✅ Registros cargados:', registros.value.length)
    } catch (error) {
        console.error('❌ Error cargando registros:', error)
    }
}

const formatFecha = (fecha: string): string => {
    if (!fecha) return 'N/A'

    // Crear la fecha en UTC para evitar problemas de zona horaria
    const date = new Date(fecha + 'T00:00:00Z') // Forzar UTC
    return date.toLocaleDateString('es-ES', {
        timeZone: 'UTC', // Especificar UTC
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })
}
const formatDateTime = (fecha: string): string => {
    if (!fecha) return 'N/A'

    try {
        const date = new Date(fecha)

        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) return 'N/A'

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit', // ← AÑADIR ESTO
            timeZone: 'America/Lima' // Ajusta según tu zona horaria
        }
        return date.toLocaleString('es-ES', options)
    } catch (error) {
        console.error('Error formateando fecha/hora:', fecha, error)
        return 'N/A'
    }
}

const descargarPlantilla = (): void => {
    try {
        const url = '/docs/data_masiva1.xlsx'
        const link = document.createElement('a')
        link.href = url
        link.download = 'plantilla_consultas_externas.xlsx'
        link.target = '_blank'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        importResult.value = {
            success: true,
            message: 'Plantilla descargada correctamente'
        }
    } catch (error) {
        console.error('Error al descargar plantilla:', error)
        importResult.value = {
            success: false,
            message: 'Error al descargar la plantilla'
        }
    }
}

const verificarPermisos = (): void => {
    try {
        esSuperusuario.value = localStorage.getItem('is_superuser') === 'true'
        esStaff.value = localStorage.getItem('is_staff') === 'true'

        console.log('🔐 Permisos:', {
            superuser: esSuperusuario.value,
            staff: esStaff.value,
            localStorage_is_staff: localStorage.getItem('is_staff'),
            localStorage_is_superuser: localStorage.getItem('is_superuser')
        })

        // Debug específico para el botón
        console.log('🔘 Botón visible?:', !esStaff.value)
    } catch (error) {
        console.error('Error leyendo localStorage:', error)
        esSuperusuario.value = false
        esStaff.value = false
    }
}

const cargarUsuariosImportadores = async (): Promise<void> => {
    if (!esSuperusuario.value) return

    try {
        loading.value = true
        const response = await api.get<Usuario[]>('/dimon/consultas-externas/usuarios-importadores/')
        usuariosImportadores.value = response.data
        console.log('👥 Usuarios importadores cargados:', response.data)
    } catch (error) {
        console.error('Error cargando usuarios importadores:', error)
        importResult.value = {
            success: false,
            message: 'Error al cargar la lista de usuarios importadores'
        }
    } finally {
        loading.value = false
    }
}

// Watcher con debounce
const debouncedSearch = debounce(() => {
    paginacion.value.current_page = 1
    cargarRegistros()
}, 500)

watch(busqueda, (newValue: string) => {
    if (newValue.trim().length === 0 || newValue.trim().length >= 3) {
        debouncedSearch()
    }
})

// Lifecycle
onMounted(() => {
    console.log('🚀 Componente montado')
    verificarPermisos()
    cargarMesesDisponibles()
    if (esSuperusuario.value) {
        cargarUsuariosImportadores()
    }
    cargarRegistros()
})
</script>