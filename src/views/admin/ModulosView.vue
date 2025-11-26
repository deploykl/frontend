<template>
    <ModulosStatsModal :visible="showStatsModal" @update:visible="showStatsModal = $event"
        :moduleData="moduloStore.modulos" />


    <div class="container-fluid">
        <!-- Modal para crear/editar personal -->
        <ModalBase :visible="showModal" :mode="editing ? 'edit' : 'create'" entityName="Módulo"
            :confirm-text="isSubmitting ? 'Guardando...' : 'Guardar'" :loading="isSubmitting" @close="closeModal"
            @confirm="handleSubmit" width="25rem">
            <template #content>
                <form id="modulo-form" @submit.prevent="handleSubmit" class="needs-validation" novalidate>
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="basic" role="tabpanel" aria-labelledby="basic-tab">
                            <div class="row g-3 flex-column">
                                <div class="col-12">
                                    <FloatInput id="codename" label="Code Name" v-model="form.codename"
                                        icon="pi pi-user" :errors="errors" :invalid="!!errors.codename" size="small"
                                        required />
                                </div>

                                <div class="col-12">
                                    <FloatLabel>
                                        <Textarea id="description" v-model="form.description" autoResize rows="3"
                                            class="form-control w-100" :class="{ 'p-invalid': !!errors.description }" />
                                        <label for="description">Descripción</label>
                                    </FloatLabel>
                                    <small v-if="errors.description" class="p-error">
                                        {{ errors.description }}
                                    </small>
                                </div>
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
                ¿Estás seguro de eliminar permanentemente el módulo <strong>{{ modulosToDelete?.codename }}</strong>?
                <div class="alert alert-warning mt-3">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Esta acción no se puede deshacer y eliminará todos los datos asociados al modulos.
                </div>
            </template>
        </ModalBase>

        <!-- Listado de modulos -->
        <DataTableWrapper :data="moduloStore.modulos" :columns="columns" :loading="moduloStore.loading" :actions="true"
            :showCreateButton="true" title="GESTIÓN DE MÓDULOS" createButtonLabel="Nuevo Módulo"
            createButtonIcon="pi pi-th-large" @create="openCreateModal">
            <!-- Pasar el botón como slot personalizado -->
            <template #custom-header-buttons>
                <Button icon="pi pi-chart-pie" label="Resumen" @click="showStatsModal = true" class="p-button-info me-1"
                    size="small" />
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
                <div class="d-flex flex-column align-items-center">
                    <ToggleSwitch v-model="data.is_active"
                        @change="moduloStore.toggleModuloStatus(data.id, data.is_active)" class="mb-1" />
                    <span class="badge custom-badge" :class="data.is_active ? 'bg-success' : 'bg-danger'">
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
                <div class="d-flex flex-wrap align-items-center justify-content-center gap-1">
                    <!-- Botones para todos los usuarios -->
                    <Button icon="pi pi-pencil" class="p-button-sm p-button-outlined p-button-rounded p-button-warning"
                        v-tooltip.top="'Editar'" @click="openEditModal(data)" />
                    <Button icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-rounded p-button-danger"
                        v-tooltip.top="'Eliminar'" @click="confirmDelete(data)" />
                </div>
            </template>
        </DataTableWrapper>

        <!-- Toast para mensajes de estado -->
        <div class="toast-container position-fixed top-0 end-0 p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header"
                    :class="{ 'bg-success': messageType === 'success', 'bg-danger': messageType === 'error', 'bg-info': messageType === 'info' }">
                    <strong class="me-auto text-white">{{ messageType === 'success' ? 'Éxito' : messageType === 'error'
                        ? 'Error' : 'Información' }}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue';
import { usePersonalStore } from '@/stores/dgos/personalStore';
import { useModuloStore } from '@/stores/superuser/moduloStore';
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
        const success = await moduloStore.Deletemodulos(modulosToDelete.value.id);
        if (success) {
            closeDeleteModal();
            //toast.showSuccess('modulos eliminado correctamente'); en el store
        }
    } catch (error) {
        if (error.response?.status === 403) {
            toast.showError('No tienes permisos para eliminar este modulos');
        } else {
            toast.showError('Error al eliminar el modulos');
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

<style scoped></style>