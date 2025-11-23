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
                        <p class="mt-1 text-sm text-gray-500">Formatos soportados: .xlsx, .xls (Máx. 30MB)</p>
                    </div>

                    <!-- 🔥 NUEVO: Barra de progreso WebSocket en tiempo real -->
                    <div v-if="progresoImportacion.mostrar" class="mb-6">
                        <div
                            class="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                            <!-- Header del progreso -->
                            <div class="flex justify-between items-center mb-3">
                                <div class="flex items-center space-x-2">
                                    <i class="pi pi-cloud-upload text-blue-600 text-lg"></i>
                                    <span class="text-blue-800 font-semibold">Procesando archivo en tiempo real</span>
                                </div>
                                <span class="text-blue-700 font-bold text-lg">{{ progresoImportacion.porcentaje
                                    }}%</span>
                            </div>

                            <!-- Barra de progreso principal -->
                            <div class="w-full bg-blue-200 rounded-full h-4 mb-3 shadow-inner">
                                <div class="bg-linear-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-300 ease-out shadow-sm"
                                    :style="{ width: progresoImportacion.porcentaje + '%' }">
                                    <div
                                        class="h-full w-full rounded-full bg-linear-to-r from-blue-400 to-indigo-500 animate-pulse">
                                    </div>
                                </div>
                            </div>

                            <!-- Información detallada -->
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mb-3">
                                <div class="bg-white rounded p-2 shadow-sm border">
                                    <div class="text-gray-600 text-xs">Procesados</div>
                                    <div class="font-bold text-blue-700">
                                        {{ progresoImportacion.procesados.toLocaleString() }} / {{
                                            progresoImportacion.total.toLocaleString() }}
                                    </div>
                                </div>
                                <div class="bg-white rounded p-2 shadow-sm border">
                                    <div class="text-gray-600 text-xs">Creados</div>
                                    <div class="font-bold text-green-600">{{
                                        progresoImportacion.creados.toLocaleString() }}</div>
                                </div>
                                <div class="bg-white rounded p-2 shadow-sm border">
                                    <div class="text-gray-600 text-xs">Actualizados</div>
                                    <div class="font-bold text-yellow-600">{{
                                        progresoImportacion.actualizados.toLocaleString() }}</div>
                                </div>
                                <div class="bg-white rounded p-2 shadow-sm border">
                                    <div class="text-gray-600 text-xs">Lote</div>
                                    <div class="font-bold text-purple-600">
                                        {{ progresoImportacion.lote_actual }} / {{ progresoImportacion.total_lotes }}
                                    </div>
                                </div>
                            </div>

                            <!-- Mensaje de estado y errores -->
                            <div class="flex justify-between items-center">
                                <div class="text-sm text-blue-700 flex items-center">
                                    <i class="pi pi-info-circle mr-1"></i>
                                    {{ progresoImportacion.mensaje }}
                                </div>
                                <div v-if="progresoImportacion.errores > 0"
                                    class="text-red-600 text-sm font-semibold bg-red-50 px-2 py-1 rounded">
                                    <i class="pi pi-exclamation-triangle mr-1"></i>
                                    {{ progresoImportacion.errores }} errores
                                </div>
                            </div>

                            <!-- Progreso de lotes (barra secundaria) -->
                            <div v-if="progresoImportacion.total_lotes > 1" class="mt-3">
                                <div class="text-xs text-gray-600 mb-1">
                                    Progreso por lotes: {{ progresoImportacion.lote_actual }} de {{
                                        progresoImportacion.total_lotes }}
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        :style="{ width: (progresoImportacion.lote_actual / progresoImportacion.total_lotes) * 100 + '%' }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex flex-wrap gap-3 mb-6 items-center">
                        <!-- Botón Importar Datos -->
                        <!-- Botón Importar Datos - CORREGIDO -->
                        <button v-if="!esStaff" @click="uploadFile" :disabled="!file || loading"
                            class="group inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                            <!-- Icono PrimeVue CORREGIDO -->
                            <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
                            <i v-else
                                class="pi pi-upload mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"></i>
                            <span class="transition-all duration-300 group-hover:tracking-wider">
                                {{ loading ? 'Importando...' : 'Importar Datos' }}
                            </span>
                        </button>

                        <!-- Botón Limpiar - CORREGIDO -->
                        <button @click="resetForm" :disabled="loading"
                            class="group inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                            <!-- Icono PrimeVue CORREGIDO -->
                            <i
                                class="pi pi-trash mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"></i>
                            <span class="transition-all duration-300 group-hover:tracking-wider">
                                Limpiar
                            </span>
                        </button>

                        <!-- Filtros -->
                        <div class="flex flex-wrap gap-4 items-center ml-auto">
                            <!-- Filtro de Usuario (solo para superusuarios) -->
                            <div class="relative" v-if="esSuperusuario">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <i class="pi pi-users text-gray-500 text-sm"></i>
                                </div>
                                <select v-model="filtroUsuario" @change="onFiltroChange"
                                    class="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400 min-w-[180px] appearance-none">
                                    <option :value="null">Todos los usuarios</option>
                                    <option v-for="user in usuariosImportadores" :key="user.id" :value="user.id">
                                        {{ user.username }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                    <i class="pi pi-chevron-down text-gray-400 text-xs"></i>
                                </div>
                            </div>

                            <!-- Filtro de Año -->
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <i class="pi pi-calendar text-gray-500 text-sm"></i>
                                </div>
                                <select v-model="filtroAnio" @change="onFiltroChange"
                                    class="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400 min-w-[140px] appearance-none">
                                    <option :value="null">Todos los años</option>
                                    <option v-for="year in añosDisponibles" :key="year" :value="year">
                                        {{ year }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                    <i class="pi pi-chevron-down text-gray-400 text-xs"></i>
                                </div>
                            </div>

                            <!-- Filtro de Mes -->
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <i class="pi pi-filter text-gray-500 text-sm"></i>
                                </div>
                                <select v-model="filtroMes" @change="onFiltroChange" :disabled="!filtroAnio"
                                    class="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] appearance-none">
                                    <option :value="null">Todos los meses</option>
                                    <option v-for="month in mesesFiltrados" :key="`${month.year}-${month.month}`"
                                        :value="month.month">
                                        {{ getMonthName(month.month) }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                    <i class="pi pi-chevron-down text-gray-400 text-xs"></i>
                                </div>
                            </div>

                            <!-- Botón Limpiar Filtros -->
                            <button @click="resetFiltros" :disabled="!filtroMes && !filtroAnio"
                                class="inline-flex items-center px-4 py-2.5 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm font-medium">
                                <i class="pi pi-times mr-2 text-sm"></i>
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

                            <div v-if="importResult.detalle_errores && importResult.detalle_errores.length > 0"
                                class="mt-3">
                                <button @click="toggleErrores"
                                    class="inline-flex items-center px-3 py-1 bg-red-100 border border-red-300 text-red-700 rounded text-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200">
                                    {{ mostrarErrores ? 'Ocultar' : 'Mostrar' }} detalles de errores ({{
                                        importResult.errores || 0 }})
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

                                <!-- 🔥 SECCIÓN ELEGANTE: Descarga de Excel con errores -->
                                <div v-if="importResult.archivo_errores && (importResult.errores || 0) > 0"
                                    class="mt-6 p-6 bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">

                                    <!-- Header con icono elegante -->
                                    <div class="flex items-center mb-4">
                                        <div
                                            class="flex items-center justify-center w-12 h-12 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl shadow-sm">
                                            <i class="pi pi-file-excel text-white text-lg"></i>
                                        </div>
                                        <div class="ml-4">
                                            <h3 class="text-lg font-semibold text-amber-900">Reporte de Errores
                                                Disponible</h3>
                                            <p class="text-amber-700 text-sm mt-1">Descarga el detalle completo de los
                                                errores encontrados
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Contador de errores -->
                                    <div
                                        class="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-amber-100 shadow-xs">
                                        <div class="flex items-center">
                                            <div
                                                class="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg border border-red-200">
                                                <i class="pi pi-exclamation-triangle text-red-500 text-sm"></i>
                                            </div>
                                            <div class="ml-3">
                                                <p class="text-sm font-medium text-gray-600">Total de errores</p>
                                                <p class="text-2xl font-bold text-red-600">{{ importResult.errores }}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="text-right">
                                            <p class="text-sm font-medium text-gray-600">Archivo generado</p>
                                            <p class="text-sm text-gray-500">Ahora mismo</p>
                                        </div>
                                    </div>

                                    <!-- Botón de descarga elegante -->
                                    <div
                                        class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <div class="flex-1">
                                            <button @click="descargarErrores(importResult.archivo_errores!)"
                                                :disabled="descargandoErrores"
                                                class="group relative inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border border-amber-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]">

                                                <!-- Efecto de fondo animado -->
                                                <div
                                                    class="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                                                </div>

                                                <!-- Icono y texto -->
                                                <div class="flex items-center space-x-3">
                                                    <div class="relative">
                                                        <i v-if="descargandoErrores"
                                                            class="pi pi-spin pi-spinner text-lg"></i>
                                                        <i v-else
                                                            class="pi pi-download text-lg transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"></i>
                                                    </div>
                                                    <span
                                                        class="text-sm tracking-wide transition-all duration-300 group-hover:tracking-wider">
                                                        {{ descargandoErrores ? 'Preparando descarga...' : 'Descargar Reporte' }}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>

                                        <!-- Información adicional -->
                                        <div
                                            class="flex-1 text-sm text-amber-700 bg-amber-100/50 rounded-lg p-3 border border-amber-200">
                                            <div class="flex items-start space-x-2">
                                                <i class="pi pi-info-circle text-amber-600 mt-0.5 shrink-0"></i>
                                                <div>
                                                    <p class="font-medium mb-1">¿Qué incluye este reporte?</p>
                                                    <ul class="space-y-1 text-amber-800">
                                                        <li class="flex items-center">
                                                            <span
                                                                class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                                            Número de fila exacto en el Excel
                                                        </li>
                                                        <li class="flex items-center">
                                                            <span
                                                                class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                                            Descripción detallada del error
                                                        </li>
                                                        <li class="flex items-center">
                                                            <span
                                                                class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                                                            Campo específico con problemas
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Progreso de descarga (opcional) -->
                                    <div v-if="descargandoErrores" class="mt-4">
                                        <div class="flex items-center justify-between text-xs text-amber-700 mb-2">
                                            <span>Preparando archivo...</span>
                                            <span class="font-medium">Por favor espere</span>
                                        </div>
                                        <div class="w-full bg-amber-200 rounded-full h-1.5">
                                            <div
                                                class="bg-linear-to-r from-amber-500 to-orange-500 h-1.5 rounded-full animate-pulse">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 🔥 NUEVO: Mensaje cuando no hay errores -->
                            <div v-else-if="importResult.success && importResult.errores === 0"
                                class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div class="flex items-center">
                                    <i class="pi pi-check-circle text-green-600 mr-2"></i>
                                    <span class="text-green-800 font-semibold">
                                        ¡Excelente! No se encontraron errores en la importación.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Listado de registros -->
                    <div>
                        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                            <h2 class="text-lg font-semibold text-gray-800 mb-2 md:mb-0">
                                Registros Importados ({{ totalRegistros.toLocaleString() }})
                            </h2>
                            <div class="text-sm text-gray-600">
                                Página {{ paginacion.current_page }} de {{ paginacion.total_pages }}
                            </div>
                        </div>

                        <DataTable :value="registros" :paginator="true" :rows="itemsPorPagina"
                            :totalRecords="totalRegistros" :loading="loading" :rowsPerPageOptions="[50, 100, 200, 500]"
                            @page="onPageChange" @sort="onSort"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                            responsiveLayout="scroll" rowHover class="p-datatable-sm text-sm" lazy scrollable
                            scrollHeight="flex">

                            <!-- Columna enumeradora -->
                            <Column header="N°" headerStyle="width: 3rem">
                                <template #body="slotProps">
                                    {{ (paginacion.current_page - 1) * itemsPorPagina + slotProps.index + 1 }}
                                </template>
                            </Column>

                            <Column field="fecha_nacimiento" header="Fecha Nacimiento" :sortable="true">
                                <template #body="{ data }">
                                    <span class="text-gray-700">{{ formatFecha(data.fecha_nacimiento) }}</span>
                                </template>
                            </Column>

                            <Column field="sexo" header="Sexo" :sortable="true">
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

                            <Column field="fecha_hora_cita_otorgada" header="Cita Otorgada" :sortable="true">
                                <template #body="{ data }">
                                    <span class="text-gray-700">{{ formatDateTime(data.fecha_hora_cita_otorgada)
                                    }}</span>
                                </template>
                            </Column>

                            <Column field="fecha_hora_atencion" header="Fecha Atención" :sortable="true">
                                <template #body="{ data }">
                                    <span class="text-gray-700">{{ formatDateTime(data.fecha_hora_atencion) }}</span>
                                </template>
                            </Column>

                            <Column field="diagnostico_medico" header="Diagnóstico" :sortable="true">
                                <template #body="{ data }">
                                    <span class="max-w-xs truncate block text-gray-700"
                                        :title="data.diagnostico_medico">
                                        {{ data.diagnostico_medico || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="dx_CIE_10_1" header="dx CIE-10 1" :sortable="true">
                                <template #body="{ data }">
                                    <span class="font-mono text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {{ data.dx_CIE_10_1 || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="dx_CIE_10_2" header="dx CIE-10 2" :sortable="true">
                                <template #body="{ data }">
                                    <span class="font-mono text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        {{ data.dx_CIE_10_2 || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="dx_CIE_10_3" header="dx CIE-10 3" :sortable="true">
                                <template #body="{ data }">
                                    <span class="font-mono text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                        {{ data.dx_CIE_10_3 || 'N/A' }}
                                    </span>
                                </template>
                            </Column>

                            <Column field="especialidad" header="Especialidad" :sortable="true">
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
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { api } from '@/components/services/Axios'
import { debounce } from 'lodash'

// Interfaces TypeScript
interface ColumnaEstructura {
    numero: number
    nombre: string
    requerido: boolean
    recomendacion: string
}

interface ProgresoWebSocket {
    mostrar: boolean
    porcentaje: number
    procesados: number
    total: number
    creados: number
    actualizados: number
    errores: number
    mensaje: string
    lote_actual: number
    total_lotes: number
}
const descargandoErrores = ref<boolean>(false)

interface ImportResult {
    success: boolean
    message: string
    total_filas?: number
    creados?: number
    actualizados?: number
    omitidas?: number
    errores?: number
    detalle_errores?: string[]
    archivo_errores?: string
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
    total_pages: number
    next: string | null
    previous: string | null
}

// Variables reactivas
const mostrarEstructura = ref<boolean>(false)
const mostrarErrores = ref<boolean>(false)
const file = ref<File | null>(null)
const loading = ref<boolean>(false)
const importResult = ref<ImportResult | null>(null)
const registros = ref<Registro[]>([])
const busqueda = ref<string>('')
const itemsPorPagina = ref<number>(200)
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

const progresoImportacion = ref<ProgresoWebSocket>({
    mostrar: false,
    porcentaje: 0,
    procesados: 0,
    total: 0,
    creados: 0,
    actualizados: 0,
    errores: 0,
    mensaje: 'Conectando...',
    lote_actual: 0,
    total_lotes: 0
})

const websocket = ref<WebSocket | null>(null)
type WebSocketState = 0 | 1 | 2 | 3

// Estructura de columnas
const columnasEstructura = ref<ColumnaEstructura[]>([
    { numero: 0, nombre: 'RENIPRESS', requerido: true, recomendacion: '00000000' },
    { numero: 1, nombre: 'Hospital/Instituto', requerido: true, recomendacion: 'Establecimiento' },
    { numero: 2, nombre: 'Tipo de seguro', requerido: true, recomendacion: 'Ej: SIS, ESSALUD, Privado' },
    { numero: 3, nombre: 'Fecha Nacimiento', requerido: false, recomendacion: 'Formato DD/MM/YYYY' },
    { numero: 4, nombre: 'Sexo (M/F)', requerido: false, recomendacion: 'Solo "M" o "F"' },
    { numero: 5, nombre: 'Lugar Procedencia', requerido: false, recomendacion: 'Lima' },
    { numero: 6, nombre: 'Tipo Documento', requerido: false, recomendacion: 'etc' },
    { numero: 7, nombre: 'N° Doc', requerido: false, recomendacion: 'xxxxxxxx' },
    { numero: 8, nombre: 'N° HCL', requerido: false, recomendacion: 'Número de historia clínica' },
    { numero: 9, nombre: 'Fecha y Hora de Cita Otorgada', requerido: true, recomendacion: 'Formato dd-mm-yyyy hh:mm:ss ó dd/mm/yyyy HH:MM:SS ó yyyy-mm-dd hh:mm:ss' },
    { numero: 10, nombre: 'Fecha y Hora de atención efectiva', requerido: true, recomendacion: 'Formato dd-mm-yyyy hh:mm:ss ó dd/mm/yyyy HH:MM:SS ó yyyy-mm-dd hh:mm:ss' },
    { numero: 11, nombre: 'Diagnóstico Médico', requerido: false, recomendacion: 'Descripción textual' },
    { numero: 12, nombre: 'Dx CIE-10 Principal', requerido: false, recomendacion: 'Código CIE-10' },
    { numero: 13, nombre: 'Dx CIE-10 Secundario', requerido: false, recomendacion: 'Opcional' },
    { numero: 14, nombre: 'Dx CIE-10 Terciario', requerido: false, recomendacion: 'Opcional' },
    { numero: 15, nombre: 'Especialidad', requerido: false, recomendacion: 'Ej: Cardiología, Pediatría' }
])

// Computed properties
const añosDisponibles = computed(() => {
    return [...new Set(mesesDisponibles.value.map(item => item.year))].sort((a, b) => b - a)
})

const mesesFiltrados = computed(() => {
    if (!filtroAnio.value) return mesesDisponibles.value
    return mesesDisponibles.value.filter(item => item.year === filtroAnio.value)
})



// 🔥 CORRECCIÓN: Usar el token correcto
const obtenerToken = (): string | null => {
    const token = localStorage.getItem('auth_token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('auth_token')
    
    return token
}

// 🔥 NUEVO: Método para descargar errores - SIN LOGS
const descargarErrores = async (archivoUrl: string): Promise<void> => {
    if (descargandoErrores.value) return

    descargandoErrores.value = true
    try {
        const filename = archivoUrl.split('/').pop()
        if (!filename) {
            throw new Error('No se pudo obtener el nombre del archivo')
        }

        const response = await api.get(`/dimon/consultas-externas/descargar-errores/?archivo=${filename}`, {
            responseType: 'blob'
        })

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

    } catch (error: any) {
        let errorMessage = 'Error al descargar el archivo de errores'
        if (error.response?.data?.error) {
            errorMessage = error.response.data.error
        }

        importResult.value = {
            ...importResult.value!,
            success: false,
            message: errorMessage
        }
    } finally {
        descargandoErrores.value = false
    }
}

// Métodos WebSocket - SIN LOGS
const conectarWebSocket = (): void => {
    try {
        const token = obtenerToken()

        if (!token) {
            progresoImportacion.value.mensaje = 'Error: No estás autenticado. Recarga la página.'
            return
        }

        let wsUrl: string

        if (import.meta.env.VITE_API_URL_WS_PROGRESS) {
            wsUrl = `${import.meta.env.VITE_API_URL_WS_PROGRESS}?token=${encodeURIComponent(token)}`
        } else {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            const host = window.location.host
            wsUrl = `${protocol}//${host}/ws/import-progress/?token=${encodeURIComponent(token)}`
        }

        websocket.value = new WebSocket(wsUrl)

        websocket.value.onopen = () => {
            progresoImportacion.value.mensaje = 'Conexión establecida - Listo para importar'
        }

        websocket.value.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                manejarMensajeWebSocket(data)
            } catch (error) {
                // Silenciar error de parsing
            }
        }

        websocket.value.onclose = (event) => {
            if (event.code === 4001) {
                progresoImportacion.value.mensaje = 'Error de autenticación - Recarga la página'
            } else if (event.code === 4002) {
                progresoImportacion.value.mensaje = 'Error del servidor'
            } else if (event.code === 1006) {
                progresoImportacion.value.mensaje = 'Error de conexión - Intentando reconectar...'
                setTimeout(conectarWebSocket, 2000)
            } else if (event.code !== 1000) {
                progresoImportacion.value.mensaje = 'Conexión perdida - Reconectando...'
                setTimeout(conectarWebSocket, 3000)
            }
        }

        websocket.value.onerror = () => {
            progresoImportacion.value.mensaje = 'Error de conexión WebSocket'
        }

    } catch (error) {
        progresoImportacion.value.mensaje = 'Error al conectar WebSocket'
    }
}

const manejarMensajeWebSocket = (data: any): void => {
    switch (data.type) {
        case 'progress':
            progresoImportacion.value = {
                mostrar: true,
                porcentaje: data.porcentaje,
                procesados: data.procesados,
                total: data.total,
                creados: data.creados,
                actualizados: data.actualizados,
                errores: data.errores,
                mensaje: data.mensaje,
                lote_actual: data.lote_actual,
                total_lotes: data.total_lotes
            }
            break

        case 'complete':
            progresoImportacion.value.mostrar = false
            loading.value = false

            if (data.resultado.success) {
                importResult.value = {
                    ...data.resultado,
                    success: true
                }
                cargarRegistros(1)
            } else {
                importResult.value = {
                    success: false,
                    message: data.resultado.error || 'Error en la importación'
                }
            }
            break
    }
}

// Métodos de UI
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
    cargarRegistros(1)
}

const onFiltroChange = (): void => {
    cargarRegistros(1)
}

// Manejar cambio de página
const onPageChange = (event: any) => {
    const newPage = event.page + 1
    itemsPorPagina.value = event.rows
    cargarRegistros(newPage)
}

// Manejar ordenamiento
const onSort = () => {
    cargarRegistros(paginacion.value.current_page)
}


const cargarMesesDisponibles = async (): Promise<void> => {
    try {
        const response = await api.get<MesDisponible[]>('/dimon/consultas-externas/meses-disponibles/')
        mesesDisponibles.value = response.data
        filtroAnio.value = null
        filtroMes.value = null
    } catch (error) {
        // Silenciar error en producción
    }
}

const handleFileChange = (event: Event): void => {
    const target = event.target as HTMLInputElement
    file.value = target.files?.[0] || null
    importResult.value = null
}

const resetForm = (): void => {
    file.value = null
    importResult.value = null
    const fileInput = document.getElementById('excelFile') as HTMLInputElement
    if (fileInput) fileInput.value = ''
}

const uploadFile = async (): Promise<void> => {
    if (!file.value) {
        importResult.value = {
            success: false,
            message: 'Por favor selecciona un archivo Excel'
        }
        return
    }

    const maxSize = 30 * 1024 * 1024
    if (file.value.size > maxSize) {
        importResult.value = {
            success: false,
            message: `El archivo es demasiado grande (máximo ${maxSize / (1024 * 1024)}MB permitidos)`
        }
        return
    }

    if (!websocket.value || websocket.value.readyState !== WebSocket.OPEN) {
        importResult.value = {
            success: false,
            message: 'WebSocket no conectado. Recarga la página e intenta nuevamente.'
        }
        return
    }

    loading.value = true
    importResult.value = null

    progresoImportacion.value = {
        mostrar: true,
        porcentaje: 0,
        procesados: 0,
        total: 0,
        creados: 0,
        actualizados: 0,
        errores: 0,
        mensaje: 'Iniciando importación...',
        lote_actual: 0,
        total_lotes: 0
    }

    try {
        const formData = new FormData()
        formData.append('file', file.value)

        const response = await api.post('/dimon/consultas-externas/importar-excel/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 120000
        })

        if (response.data.websocket) {
            progresoImportacion.value.mensaje = 'Importación iniciada - Procesando...'
        } else {
            loading.value = false
            progresoImportacion.value.mostrar = false
            importResult.value = response.data
        }

    } catch (error: any) {
        loading.value = false
        progresoImportacion.value.mostrar = false

        let errorMessage = 'Error al iniciar la importación'
        if (error.response?.data?.error) {
            errorMessage = error.response.data.error
        }

        importResult.value = {
            success: false,
            message: errorMessage
        }
    }
}

const cargarRegistros = async (page = 1): Promise<void> => {
    try {
        loading.value = true

        const params: any = {
            page: page,
            page_size: itemsPorPagina.value,
            search: busqueda.value.trim()
        }

        if (filtroAnio.value) params.year = filtroAnio.value
        if (filtroMes.value) params.month = filtroMes.value
        if (esSuperusuario.value && filtroUsuario.value) params.user_id = filtroUsuario.value

        const response = await api.get<ApiResponse>('/dimon/consultas-externas/', { params })

        registros.value = response.data.results
        totalRegistros.value = response.data.count
        paginacion.value = {
            current_page: response.data.current_page || page,
            total_pages: response.data.total_pages || Math.ceil(response.data.count / itemsPorPagina.value)
        }

    } catch (error) {
        // Silenciar error en producción
    } finally {
        loading.value = false
    }
}

const formatFecha = (fecha: string): string => {
    if (!fecha) return 'N/A'

    const date = new Date(fecha + 'T00:00:00Z')
    return date.toLocaleDateString('es-ES', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })
}

const formatDateTime = (fecha: string): string => {
    if (!fecha) return 'N/A'

    try {
        const date = new Date(fecha)

        if (isNaN(date.getTime())) return 'N/A'

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Lima'
        }
        return date.toLocaleString('es-ES', options)
    } catch (error) {
        console.error('Error formateando fecha/hora:', fecha, error)
        return 'N/A'
    }
}

const verificarPermisos = (): void => {
    try {
        esSuperusuario.value = localStorage.getItem('is_superuser') === 'true'
        esStaff.value = localStorage.getItem('is_staff') === 'true'
    } catch (error) {
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
    } catch (error) {
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
    cargarRegistros(1)
}, 500)

watch(busqueda, (newValue: string) => {
    if (newValue.trim().length === 0 || newValue.trim().length >= 3) {
        debouncedSearch()
    }
})

// Lifecycle
onMounted(() => {
    const user_id = localStorage.getItem('user_id')
    const token = obtenerToken()

    if (user_id && token) {
        conectarWebSocket()
    } else {
        progresoImportacion.value.mensaje = 'No autenticado - Inicia sesión primero'
    }

    verificarPermisos()
    cargarMesesDisponibles()
    if (esSuperusuario.value) {
        cargarUsuariosImportadores()
    }
    cargarRegistros(1)
})

onUnmounted(() => {
    if (websocket.value) {
        websocket.value.close()
    }
})
</script>
<style scoped>
/* Asegurar que la animación funcione */
.pi-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Para Bootstrap Icons */
.bi-arrow-clockwise {
    animation: spin 1s linear infinite;
}
</style>