<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ config.title }}</h1>
          <p class="text-gray-600">{{ config.description }}</p>
        </div>
        <div class="flex gap-3">
          <slot name="header-actions"></slot>
          <button 
            @click="$emit('create')"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <i class="fas fa-plus"></i>
            Nuevo
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <CrudFilters 
      :filters="config.filters || []"
      @filter-change="$emit('filter-change', $event)"
    />

    <!-- Contenido principal -->
    <div class="bg-white rounded-lg shadow-sm">
      <CrudTable
        :config="config"
        :data="data"
        :loading="loading"
        @action="handleAction"
        @sort="handleSort"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps"></slot>
        </template>
      </CrudTable>
    </div>

    <!-- Modales -->
    <CrudForm
      :show="showFormModal"
      :item="selectedItem"
      :editing="isEditing"
      :fields="config.formFields || []"
      @close="closeForm"
      @submit="$emit('form-submit', $event)"
    />

    <!-- Modal de confirmación -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CrudFilters from './CrudFilters.vue'
import CrudTable from './CrudTable.vue'
import CrudForm from './CrudForm.vue'
import ConfirmModal from './ConfirmModal.vue'
import type { CrudConfig } from './crud.types'

interface Props {
  config: CrudConfig
  data: any[]
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['create', 'filter-change', 'form-submit', 'action', 'sort'])

// Estado del componente
const showFormModal = ref(false)
const showConfirmModal = ref(false)
const selectedItem = ref<any>(null)
const isEditing = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref<Function | null>(null)

const handleAction = (action: string, item: any) => {
  const actionConfig = props.config.actions?.find(a => a.name === action)
  if (actionConfig) {
    actionConfig.handler(item)
  }
}

const handleSort = (columnKey: string) => {
  emit('sort', columnKey)
}

const handleConfirm = () => {
  if (pendingAction.value) {
    pendingAction.value()
    closeConfirmModal()
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  pendingAction.value = null
  confirmTitle.value = ''
  confirmMessage.value = ''
}

const closeForm = () => {
  showFormModal.value = false
  selectedItem.value = null
  isEditing.value = false
}

// Exponer métodos para el padre
defineExpose({
  openForm: (item: any = null) => {
    selectedItem.value = item
    isEditing.value = !!item
    showFormModal.value = true
  },
  closeForm: () => {
    closeForm()
  },
  confirmAction: (title: string, message: string, action: Function) => {
    confirmTitle.value = title
    confirmMessage.value = message
    pendingAction.value = action
    showConfirmModal.value = true
  }
})
</script>