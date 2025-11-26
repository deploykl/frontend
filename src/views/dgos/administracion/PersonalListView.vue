<template>
    <div class="container-fluid">
        <!-- Listado de personal -->
        <DataTableWrapper :data="personalStore.personal" :columns="columns" :loading="personalStore.loading"
            :actions="false" :showCreateButton="false" title="GESTIÓN DE PERSONAL" :expandable="true"
            @create="openCreateModal" @column-filter-change="handleFilterChange">

            <template #header>
                <div class="flex justify-left items-center">
                    <Button class="p-button-sm mr-1" @click="handleExportExcel" :loading="exporting"
                        icon="pi pi-file-excel" label="Excel" severity="success" />
                    <Button class="p-button-sm mr-1" @click="handleExportCSV" :loading="exporting" icon="pi pi-file"
                        label="CSV" severity="info" />
                    <Button class="p-button-sm" @click="handleExportPDF" :loading="exporting" icon="pi pi-file-pdf"
                        label="PDF" severity="danger" />
                </div>
            </template>

            <!-- Los templates del cuerpo de la tabla se mantienen igual -->
            <template #body-dni="{ data }">
                {{ data.dni || '-' }}
            </template>
            <template #body-ruc="{ data }">
                {{ data.ruc || '-' }}
            </template>
            <template #body-full_name="{ data }">
                {{ data.full_name || '-' }}
            </template>
            <template #body-sexo="{ data }">
                <div class="flex items-center">
                    <span v-if="!data.sexo">-</span>
                    <div v-else class="flex items-center">
                        <i v-if="data.sexo === 'M'" class="pi pi-mars text-blue-600 text-xs mr-1" title="Masculino"></i>
                        <i v-else-if="data.sexo === 'F'" class="pi pi-venus text-pink-500 text-xs mr-1"
                            title="Femenino"></i>
                        <span>{{ data.sexo }}</span>
                    </div>
                </div>
            </template>
            <template #body-fecha_nac="{ data }">
                <div class="flex items-center">
                    {{ data.fecha_nac || '-' }}
                    <span v-if="data.edad" class="text-xs text-gray-600 ml-1">
                        ({{ data.edad }} años)
                    </span>
                </div>
            </template>
            <template #body-celular="{ data }">
                <div class="flex items-center">
                    <a v-if="data.celular" :href="`https://wa.me/51${data.celular}`" target="_blank" class="mr-1"
                        title="Enviar mensaje por WhatsApp">
                        <i class="pi pi-whatsapp text-green-500"></i>
                    </a>
                    <span>{{ data.celular || '-' }}</span>
                </div>
            </template>
            <template #body-email="{ data }">
                {{ data.email }}
            </template>
            <template #body-dependencia_nombre="{ data }">
                {{ data.dependencia_nombre || '-' }}
            </template>
            <template #body-area_nombre="{ data }">
                {{ data.area_nombre || '-' }}
            </template>
            <template #body-condicion_nombre="{ data }">
                {{ data.condicion_nombre || '-' }}
            </template>

            <template #expansion="{ data }">
                <div class="p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <!-- Columna 1: Información Laboral -->
                        <div class="md:col-span-5">
                            <div class="expansion-card">
                                <div class="flex items-center mb-3">
                                    <i class="pi pi-user text-blue-500 mr-2 text-xl"></i>
                                    <h6 class="m-0 text-gray-900 font-semibold">Información Laboral</h6>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">N° Contrato</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.n_contrato || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Fecha Inicio</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.fecha_inicio || '-' }}</p>
                                            <small class="time-with-underline">
                                                ({{ calculateTimeWorked(data.fecha_inicio) }})
                                            </small>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Fecha Fin</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.fecha_fin || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Salario</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ formatCurrency(data.salario ||
                                                '-') }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Anexo</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.anexo_number || '-' }}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Cargo</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.cargo_nombre || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Condición</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.condicion_nombre || '-' }}
                                            </p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Estado</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.estado_nombre || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Régimen</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.regimen_nombre || '-' }}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Nivel</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.nivel_name || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Grupo Ocupacional</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.grupoo_cupacional_nombre ||
                                                '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Genérica</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.generica_nombre || '-' }}
                                            </p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Profesión</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.profesion_nombre || '-' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Columna 2: Información del sistema -->
                        <div class="md:col-span-5">
                            <div class="expansion-card">
                                <div class="flex items-center mb-3">
                                    <i class="pi pi-cog text-blue-500 mr-2 text-xl"></i>
                                    <h6 class="m-0 text-gray-900 font-semibold">Información adicional</h6>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="md:col-span-2">
                                        <div class="field mb-3">
                                            <label class="text-gray-600 text-sm font-medium">Dirección</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.direccion || '-' }}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Distrito</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.distrito || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Telefono</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.telefono || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Es Padre / Madre</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.padre_madre || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">N° Hijos</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.n_hijos || '-' }}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Email Personal</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.email_per || '-' }}</p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">Contacto Emergencia</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.cont_emergencia || '-' }}
                                            </p>
                                        </div>
                                        <div class="field">
                                            <label class="text-gray-600 text-sm font-medium">N° Celular</label>
                                            <p class="m-0 text-gray-900 font-medium">{{ data.cel_emergencia || '-' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Columna 3: Grupos -->
                        <div class="md:col-span-2">
                            <div class="expansion-card">
                                <div class="flex items-center mb-3">
                                    <i class="pi pi-users text-blue-500 mr-2 text-xl"></i>
                                    <h6 class="m-0 text-gray-900 font-semibold">Otros</h6>
                                </div>
                                <div class="field">
                                    <label class="text-gray-600 text-sm font-medium">Creado por</label>
                                    <p class="m-0 text-gray-900 font-medium">{{ data.created_by_username || '-' }}</p>
                                </div>
                                <template v-if="isSuperuser">
                                    <div class="field">
                                        <label class="text-gray-600 text-sm font-medium">Habilitado por</label>
                                        <p class="m-0 text-gray-900 font-medium">{{ data.habilitado_por || '-' }}</p>
                                    </div>
                                    <div class="field">
                                        <label class="text-gray-600 text-sm font-medium">actualizado por</label>
                                        <p class="m-0 text-gray-900 font-medium">{{ data.updated_by || '-' }}</p>
                                    </div>
                                    <div class="field">
                                        <label class="text-gray-600 text-sm font-medium">Ultima actualización</label>
                                        <p class="m-0 text-gray-900 font-medium">{{ data.updated_at_lima || '-' }}</p>
                                    </div>
                                    <div class="field">
                                        <label class="text-gray-600 text-sm font-medium">Acceso</label>
                                        <p class="m-0 text-gray-900 font-medium">{{ data.fecha_habilitacion_acceso ||
                                            '-' }}</p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataTableWrapper>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue';
import { usePersonalStore } from '@/stores/dgos/personalStore';
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import { calculateTimeWorked, formatCurrency, onlyNumbersDNI, onlyNumbersRUC, onlyNumbersCelular, onlyNumbersTelefono, formatDateToISO, parseDateFromISO } from "@/components/utils/format";
import { distritosLima } from "@/components/utils/distritos";
import { usePersonalExports } from '@/components/utils/exportData'; // Ajusta la ruta


const { exporting, exportExcel, exportCSV, exportPDF } = usePersonalExports();


// Función para exportar a Excel
const handleExportExcel = async () => {
    const result = await exportExcel();
    if (result.toast) {
        toast.add(result.toast);
    }
};

// Función para exportar a CSV
const handleExportCSV = async () => {
    const result = await exportCSV();
    if (result.toast) {
        toast.add(result.toast);
    }
};

// Función para exportar a PDF
const handleExportPDF = async () => {
    const result = await exportPDF();
    if (result.toast) {
        toast.add(result.toast);
    }
};


const personalStore = usePersonalStore();
const toast = useToast();
const router = useRouter();

const errors = ref({});
const showModal = ref(false);
const showDeleteModal = ref(false);
const showModulosModal = ref(false);
const editing = ref(false);
const isSubmitting = ref(false);
const personalToDelete = ref(null);
const personalToEdit = ref(null);
const isDeleting = ref(false);
const selectedDependencia = ref(null);
const selectedPerson = ref(null);
const selectedModulos = ref([]);
const modalMode = ref('habilitar');
const message = ref('');
const messageType = ref('info');

const anexoOptions = ref([]); // Array vacío inicial
const condicionOptions = ref([]); // Array vacío inicial
const nivelOptions = ref([]); // Array vacío inicial
const dependenciasOptions = ref([]);
const areasOptions = ref([]);
const profesionOptions = ref([]);
const cargoOptions = ref([]);
const regimenOptions = ref([]);
const grupoOcupacionalOptions = ref([]);
const estadoOptions = ref([]);
const genericaOptions = ref([]);


const dependenciaOptions = computed(() => {
    return [...new Set(personalStore.personal.map(p => p.dependencia_nombre))].filter(Boolean);
});

const isSuperuser = computed(() => {
    return localStorage.getItem('is_superuser') === 'true'
})

const areaOptions = computed(() => {
    if (!selectedDependencia.value) {
        return [...new Set(personalStore.personal.map(p => p.area_nombre))].filter(Boolean);
    }

    return personalStore.personal
        .filter(p => p.dependencia_nombre === selectedDependencia.value)
        .map(p => p.area_nombre)
        .filter((v, i, a) => a.indexOf(v) === i && v !== null);
});

// Definimos la estructura del formulario como constante
const FORM_STATE = {
    dni: '',
    ruc: '',
    nombre: '',
    apellido: '',
    email: '',
    dependencia: '',
    area: '',
    profesion: '',
    cargo: '',
    regimen: '',
    grupo_ocupacional: '',
    estado: '',
    generica: '',
    fecha_nac: '',
    fecha_inicio: '',
    salario: '',
    sexo: '',
    is_active: true,
    padre_madre: '', // Añadido
    n_hijos: ''      // Añadido
};

// Usamos la estructura para el formulario reactivo
const form = ref({ ...FORM_STATE });

// Columnas con filtros dependientes
const columns = ref([
    { field: 'dni', header: 'DNI', bodyTemplate: true, filter: false, sortable: true, },
    { field: 'ruc', header: 'RUC', bodyTemplate: true, filter: false },
    { field: 'full_name', header: 'NOMBRE COMPLETO', sortable: true, bodyTemplate: true, filter: false },
    { field: 'sexo', header: 'GÉNERO', sortable: true, bodyTemplate: true, filter: false },
    { field: 'fecha_nac', header: 'F.NACIMIENTO', sortable: true, bodyTemplate: true, filter: false },
    { field: 'celular', header: 'CELULAR', sortable: false, bodyTemplate: true, filter: false },
    { field: 'email', header: 'EMAIL', sortable: false, bodyTemplate: true, filter: false },
    {
        field: 'dependencia_nombre',
        header: 'DEPENDENCIA',
        sortable: true,
        bodyTemplate: true,
        filter: true,
        filterOptions: dependenciaOptions
    },
    {
        field: 'area_nombre',
        header: 'AREA',
        sortable: true,
        bodyTemplate: true,
        filter: true,
        filterOptions: areaOptions
    },
    {
        field: 'condicion_nombre', header: 'CONDICIÓN', sortable: false, bodyTemplate: true, filter: true, filterOptions: computed(() =>
            personalStore.personal.map(u => u.condicion_nombre).filter((v, i, a) => a.indexOf(v) === i)
        ),
    },
]);

// Manejar cambios de filtro
const handleFilterChange = (event) => {
    if (event.field === 'dependencia_nombre') {
        selectedDependencia.value = event.value;
        personalStore.setSelectedDependencia(event.value);
    }
};
// Función para formatear el salario
const formatSalario = (event) => {
    let input = event.target.value;

    // Eliminar todos los caracteres no numéricos excepto el punto decimal
    let numericValue = input.replace(/[^\d.]/g, '');

    // Eliminar puntos decimales adicionales
    const decimalParts = numericValue.split('.');
    if (decimalParts.length > 2) {
        numericValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
    }

    // Limitar a dos decimales
    if (decimalParts.length === 2) {
        numericValue = decimalParts[0] + '.' + decimalParts[1].slice(0, 2);
    }

    // Formatear con separadores de miles
    if (numericValue) {
        const parts = numericValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        numericValue = parts.join('.');
    }

    // Actualizar el valor en el formulario (sin el símbolo de moneda)
    form.value.salario = numericValue;
};

// También necesitamos una función para convertir el valor formateado a número antes de enviarlo
const getUnformattedSalario = () => {
    if (!form.value.salario) return null;
    return parseFloat(form.value.salario.replace(/,/g, ''));
};




onMounted(async () => {
    try {
        await personalStore.ListPersonal();
        await personalStore.ListModulos();

        // Cargar anexos
        const anexosData = await personalStore.ListAnexos();
        anexoOptions.value = anexosData;

        // Cargar condicion
        const condicionData = await personalStore.ListCondicion();
        condicionOptions.value = condicionData;

        // Cargar nivel
        const nivelData = await personalStore.ListNivel();
        nivelOptions.value = nivelData;

        // Cargar dependencias
        const dependenciasData = await personalStore.ListDependencias();
        dependenciasOptions.value = dependenciasData;

        // Cargar profesion
        const profesionData = await personalStore.ListProfesion();
        profesionOptions.value = profesionData;

        // Cargar cargo
        const cargoData = await personalStore.ListCargo();
        cargoOptions.value = cargoData;

        // Cargar regimen
        const regimenData = await personalStore.ListRegimen();
        regimenOptions.value = regimenData;

        // Cargar regimen
        const grupoOcupacionalData = await personalStore.ListGrupoOcupacional();
        grupoOcupacionalOptions.value = grupoOcupacionalData;

        // Cargar regimen
        const estadoData = await personalStore.ListEstado();
        estadoOptions.value = estadoData;

        // Cargar regimen
        const genericaData = await personalStore.ListGenerica();
        genericaOptions.value = genericaData;
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

watch(() => form.value.dependencia, async (newDependencia) => {
    // Obtener el ID (puede ser un objeto o un ID directo)
    const dependenciaId = newDependencia?.id || newDependencia;

    console.log('Dependencia cambiada:', dependenciaId);

    if (dependenciaId) {
        try {
            // Cargar áreas filtradas por dependencia
            const areasData = await personalStore.ListAreasByDependencia(dependenciaId);
            console.log('Áreas cargadas para dependencia:', areasData);
            areasOptions.value = areasData;

            // Si estamos editando y el área actual pertenece a esta dependencia, mantenerla
            if (editing.value && form.value.area) {
                const areaExists = areasData.some(area =>
                    area.id == form.value.area || area.id.toString() === form.value.area.toString()
                );

                if (!areaExists) {
                    console.log('El área actual no pertenece a la nueva dependencia, limpiando...');
                    form.value.area = '';
                }
            }
        } catch (error) {
            console.error('Error loading areas:', error);
            areasOptions.value = [];
            form.value.area = '';
        }
    } else {
        console.log('No hay dependencia seleccionada, limpiando áreas');
        areasOptions.value = [];
        form.value.area = '';
    }
}, { immediate: false });

</script>

<style scoped>
/* Solo mantenemos los estilos que realmente necesitan CSS puro */
.expansion-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    height: 100%;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    padding: 12px;
}

.expansion-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3B82F6, #6366F1);
}

.expansion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.field {
    margin-bottom: 12px;
    padding: 8px 0;
}

.field:last-child {
    margin-bottom: 0;
}

.time-with-underline {
    font-size: 0.7rem;
    border-bottom: 1.5px solid #3B82F6;
    padding-bottom: 1px;
    display: inline-block;
    transition: all 0.2s ease;
    color: #6b7280;
    font-weight: 500;
}

.time-with-underline:hover {
    border-bottom: 2px solid #2563EB;
    color: #2563EB;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .expansion-card {
        margin-bottom: 1rem;
    }

    .expansion-card:last-child {
        margin-bottom: 0;
    }
}
</style>