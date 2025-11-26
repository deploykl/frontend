<template>
  <Dialog v-model:visible="internalVisible" :modal="true" :style="{ width: width, maxHeight: maxHeight }"
    :header="dynamicTitle" :breakpoints="{ '960px': '85vw', '640px': '95vw' }"
    :contentStyle="{ padding: contentPadding }" @hide="handleClose">
    <div class="dialog-content">
      <slot name="content"></slot>
    </div>

    <template #footer v-if="!hideFooter">
      <slot name="footer">
        <!-- Botones por defecto - solo se muestran si no se provee slot personalizado -->
        <Button label="Cancelar" icon="pi pi-times" @click="handleClose" class="p-button-text p-button-sm"
          :disabled="loading" />
        <Button :label="confirmText" icon="pi pi-check" @click="handleConfirm" :loading="loading"
          :class="['p-button-sm', confirmClass]" />
      </slot>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  visible: Boolean,
  title: String,
  mode: {
    type: String,
    default: 'create',
    validator: value => ['create', 'edit', 'delete', 'view', 'custom'].includes(value)
  },
  entityName: {
    type: String,
    default: 'registro'
  },
  width: {
    type: String,
    default: '45vw'
  },
  maxHeight: {
    type: String,
    default: '80vh'
  },
  contentPadding: {
    type: String,
    default: '1rem'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  confirmClass: {
    type: String,
    default: ''
  },
  loading: Boolean,
  hideFooter: Boolean
});

const emit = defineEmits(['update:visible', 'close', 'confirm']);

const internalVisible = ref(props.visible);

const dynamicTitle = computed(() => {
  const titles = {
    create: `Crear ${props.entityName}`,
    edit: `Editar ${props.entityName}`,
    delete: `Eliminar ${props.entityName}`,
    view: `Detalles de ${props.entityName}`
  };

  return props.title || titles[props.mode] || props.entityName;
});

watch(() => props.visible, (newVal) => {
  internalVisible.value = newVal;
});

const handleConfirm = () => {
  emit('confirm');
};

const handleClose = () => {
  internalVisible.value = false;
  emit('update:visible', false);
  emit('close');
};
</script>

<style scoped>
.dialog-content {
  padding: 0.5rem 0;
}

:deep(.p-dialog-header) {
  padding: 1rem 1.5rem 0.5rem 1.5rem;
}

:deep(.p-dialog-content) {
  padding: v-bind('props.contentPadding') !important;
}

:deep(.p-dialog-footer) {
  padding: 0.75rem 1.5rem;
}
</style>