<template>
    <ModulosStatsModal :visible="showStatsModal" @update:visible="showStatsModal = $event"
        :moduleData="moduloStore.modulos" />

    <div class="w-full px-4 mx-auto">
        <!-- Modal para crear/editar personal -->
        <ModalBase :visible="showModal" :mode="editing ? 'edit' : 'create'" entityName="Módulo"
            :confirm-text="isSubmitting ? 'Guardando...' : 'Guardar'" :loading="isSubmitting" @close="closeModal"
            @confirm="handleSubmit" width="25rem">
            <template #content>
                <form id="modulo-form" @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="space-y-4">
                        <div class="flex flex-col space-y-4">
                            <div class="w-full">
                                <FloatInput id="codename" label="Code Name" v-model="form.codename" icon="pi pi-user"
                                    :errors="errors" :invalid="!!errors.codename" size="small" required />
                            </div>

                            <div class="w-full">
                                <FloatLabel>
                                    <Textarea id="description" v-model="form.description" autoResize rows="3"
                                        class="w-full" :class="{ 'border-red-500': !!errors.description }" />
                                    <label for="description">Descripción</label>
                                </FloatLabel>
                                <small v-if="errors.description" class="text-red-500 text-sm">
                                    {{ errors.description }}
                                </small>
                            </div>
                        </div>
                    </div>
                </form>
            </template>
        </ModalBase>

        <!-- Modal de confirmación para eliminar -->
        <ModalBase :visible="showDeleteModal" mode="delete" entityName="Módulos" confirm-text="Eliminar Permanentemente"
            confirm-class="p-button-danger" :loading="isDeleting" @close="closeDeleteModal" @confirm="proceedDelete">
            <template #content>
                <p>¿Estás seguro de eliminar permanentemente el módulo <strong>{{ modulosToDelete?.codename }}</strong>?
                </p>
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mt-3">
                    <div class="flex items-center">
                        <i class="pi pi-exclamation-triangle mr-2"></i>
                        <span>Esta acción no se puede deshacer y eliminará todos los datos asociados al módulo.</span>
                    </div>
                </div>
            </template>
        </ModalBase>

        <!-- Listado de modulos -->
        <DataTableWrapper :data="moduloStore.modulos" :columns="columns" :loading="moduloStore.loading" :actions="true"
            :showCreateButton="true" title="GESTIÓN DE MÓDULOS" createButtonLabel="Nuevo Módulo"
            createButtonIcon="pi pi-th-large" @create="openCreateModal">
            <!-- Pasar el botón como slot personalizado -->
            <template #custom-header-buttons>
                <button @click="showStatsModal = true"
                    class="cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md">
                    <i class="pi pi-chart-pie"></i>
                    <span>Resumen</span>
                </button>
            </template>
            <template #body-codename="{ data }">
                {{ data.codename || '-' }}
            </template>

            <template #body-description="{ data }">
                {{ data.description || '-' }}
            </template>

            <template #body-created_at="{ data }">
                {{ formatDateTime(data.created_at) }}
            </template>

            <!-- Template para is_active -->
            <template #body-is_active="{ data }">
                <div class="flex flex-col items-center">
                    <ToggleSwitch v-model="data.is_active"
                        @change="moduloStore.toggleModuloStatus(data.id, data.is_active)" class="mb-1" />
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="data.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ data.is_active ? 'Activo' : 'Inactivo' }}
                    </span>
                </div>
            </template>

            <template #body-acceso="{ data }">
                <!-- Habilitado -->
                <Badge v-if="data.acceso === true" severity="success" class="p-2">
                    <i class="pi pi-check-circle"></i>
                </Badge>

                <!-- Deshabilitado -->
                <Badge v-else-if="data.acceso === false" severity="danger" class="p-2">
                    <i class="pi pi-times-circle"></i>
                </Badge>

                <!-- Vacío / nulo -->
                <Badge v-else severity="secondary" class="p-2">
                    <i class="pi pi-minus-circle"></i>
                </Badge>
            </template>

            <template #actions="{ data }">
                <div class="flex flex-wrap items-center justify-center gap-2">
                    <!-- Botones para todos los usuarios -->
                    <Button icon="pi pi-pencil" class="p-button-sm p-button-outlined p-button-rounded p-button-warning"
                        v-tooltip.top="'Editar'" @click="openEditModal(data)" />
                    <Button icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-rounded p-button-danger"
                        v-tooltip.top="'Eliminar'" @click="confirmDelete(data)" />
                </div>
            </template>
        </DataTableWrapper>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue';
import { usePersonalStore } from '@/stores/dgos/personalStore';
import { useModuloStore } from '@/stores/admin/moduloStore';
import FloatInput from '@/components/widgets/FloatInput.vue';
import ModalBase from '@/components/ui/ModalBase.vue';
import { useToast } from 'primevue/usetoast';
import { formatDateTime } from '@/components/utils/format';
import ModulosStatsModal from '@/components/charts/main/ModulosStatsModal.vue';

const personalStore = usePersonalStore();
const moduloStore = useModuloStore();
const toast = useToast();

const errors = ref({});
const showModal = ref(false);

const editing = ref(false);
const isSubmitting = ref(false);
const moduloToEdit = ref(null);
const modulosToDelete = ref(null);
const isDeleting = ref(false);
const showDeleteModal = ref(false);
const message = ref('');
const messageType = ref('info');

const showStatsModal = ref(false)

// Definimos la estructura del formulario como constante
const FORM_STATE = {
    codename: '',
    description: '',
    created_at: '',
    is_active: true,
};

// Usamos la estructura para el formulario reactivo
const form = ref({ ...FORM_STATE });

// Columnas con filtros dependientes
const columns = ref([
    { field: 'codename', header: 'NAME', bodyTemplate: true, filter: false, sortable: true, },
    { field: 'description', header: 'DESCRIPCIÓN', sortable: true, bodyTemplate: true, filter: false },
    { field: 'created_at', header: 'CREADO', sortable: false, bodyTemplate: true, filter: false },
    { field: 'is_active', header: 'ESTADO', sortable: true, bodyTemplate: true, filter: false },
]);

// Métodos
const resetForm = () => {
    form.value = { ...FORM_STATE };
    errors.value = {};
};

const openCreateModal = () => {
    resetForm();
    editing.value = false;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    resetForm();
};

const openEditModal = async (modulos) => {
    try {
        editing.value = true;
        moduloToEdit.value = modulos;

        // Resetear formulario primero
        resetForm();
        form.value = {
            ...modulos,

        };
        console.log('Datos del formulario:', form.value);

        showModal.value = true;

    } catch (error) {
        console.error('Error al abrir modal de edición:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información para editar', life: 3000 });
    }
};

const confirmDelete = (modulos) => {
    modulosToDelete.value = modulos;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    setTimeout(() => {
        modulosToDelete.value = null;
    }, 300);
};

const proceedDelete = async () => {
    isDeleting.value = true;
    try {
        const success = await moduloStore.DeleteModulo(modulosToDelete.value.id);
        if (success) {
            closeDeleteModal();
            // Si el store ya muestra el mensaje de éxito, no es necesario agregarlo aquí
        }
    } catch (error) {
        if (error.response?.status === 403) {
            // CORREGIDO: usar toast.add() en lugar de toast.showError()
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No tienes permisos para eliminar este módulo',
                life: 3000
            });
        } else {
            // CORREGIDO: usar toast.add() en lugar de toast.showError()
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el módulo',
                life: 3000
            });
        }
    } finally {
        isDeleting.value = false;
    }
};

const handleSubmit = async () => {
    isSubmitting.value = true;
    errors.value = {};

    try {
        // ================= VALIDACIONES PREVIAS =================
        const validationErrors = {};
        // Si hay errores de validación, NO enviar
        if (Object.keys(validationErrors).length > 0) {
            errors.value = validationErrors;
            // ... (código de mostrar errores)
            return;
        }

        // ================= PREPARAR DATOS PARA ENVIAR =================
        const submitData = {
            ...form.value,
        };

        console.log('Datos a enviar:', submitData);

        if (editing.value) {
            await moduloStore.UpdateModulo(moduloToEdit.value.id, submitData);
        } else {
            await moduloStore.CreateModulo(submitData);
        }

        closeModal();

    } catch (error) {
        if (error.response?.data) {
            errors.value = error.response.data;

            // Mostrar error general del backend
            toast.add({
                severity: 'error',
                summary: 'Error del servidor',
                detail: 'Verifique los datos ingresados',
                life: 5000
            });
        } else {
            console.error('Error al guardar:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error inesperado al guardar',
                life: 3000
            });
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    try {
        await personalStore.ListPersonalToken();
        await moduloStore.ListModulos();
    } catch (error) {
        console.error('Error loading data:', error);
    }
});
</script>