import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from 'primevue/toast';

export interface CustomToastOptions extends Partial<ToastMessageOptions> {
  class?: string;
}

export const useCustomToast = () => {
  const toast = useToast();

  // Mostrar toast genérico
  const showToast = (options: CustomToastOptions) => {
    return toast.add({
      life: 3000,
      closable: false,
      ...options,
    });
  };

  // Toast de éxito
  const showSuccess = (message: string, summary: string = "Éxito") => {
    return showToast({
      severity: "success",
      summary,
      detail: message,
      class: "custom-toast success-toast",
    });
  };

  // Toast de eliminación (usando severity "error" con clase personalizada)
  const showDelete = (message: string, summary: string = "Eliminado") => {
    return showToast({
      severity: "error", // Usa el severity error que ya tiene estilo rojo
      summary,
      detail: message,
      life: 4000,
      class: "delete-toast", // Clase adicional para personalización
    });
  };

  // Toast de error
  const showError = (message: string, summary: string = "Error") => {
    return showToast({
      severity: "error",
      summary,
      detail: message,
      life: 5000,
      class: "custom-toast error-toast",
    });
  };

  // Toast de advertencia
  const showWarning = (message: string, summary: string = "Advertencia") => {
    return showToast({
      severity: "warn",
      summary,
      detail: message,
      class: "custom-toast warning-toast",
    });
  };

  // Toast informativo
  const showInfo = (message: string, summary: string = "Información") => {
    return showToast({
      severity: "info",
      summary,
      detail: message,
      class: "custom-toast info-toast",
    });
  };

  // Toast de carga (loading)
  const showLoading = (message: string, summary: string = "Cargando") => {
    return showToast({
      severity: "info",
      summary,
      detail: message,
      life: 0, // Persistente hasta que se cierre manualmente
    });
  };

  // Cerrar toast específico
  const dismissToast = (toastRef: any) => {
    if (toastRef) {
      toast.remove(toastRef);
    }
  };

  return {
    showSuccess,
    showError,
    showDelete,
    showWarning,
    showInfo,
    showLoading,
    dismissToast,
  };
};