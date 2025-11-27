import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/components/services/Axios";
import { useCustomToast } from "@/components/utils/toast";

// Interfaces para tipado
export interface Modulo {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Agrega otras propiedades según la respuesta de tu API
}

export interface ModuloCreateData {
  name: string;
  description?: string;
  is_active?: boolean;
  // Agrega otras propiedades necesarias para crear un módulo
}

export interface ModuloUpdateData {
  name?: string;
  description?: string;
  is_active?: boolean;
  // Agrega otras propiedades necesarias para actualizar un módulo
}

export interface ModulesWithUsersResponse {
  success: boolean;
  total_modulos: number;
  modulos: Modulo[];
  message?: string;
}

export const useModuloStore = defineStore("moduloStore", () => {
  const toast = useCustomToast();
  const loading = ref<boolean>(false);
  const modulos = ref<Modulo[]>([]);
  const error = ref<any>(null);

  // Obtener módulos disponibles
  const ListModulos = async (): Promise<Modulo[]> => {
    try {
      const response = await api.get<Modulo[]>("/user/modulo/");
      modulos.value = response.data;
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al cargar los módulos";
      toast.showError(message);
      throw err;
    }
  };

  // Crear un nuevo módulo
  const CreateModulo = async (modulosData: ModuloCreateData): Promise<Modulo> => {
    loading.value = true;
    
    try {
      const response = await api.post<Modulo>("user/modulo/", modulosData);
      modulos.value.unshift(response.data);
      toast.showSuccess("Módulo creado correctamente");
      return response.data;
    } catch (err: any) {
      error.value = err;

      if (err.response?.data) {
        for (const [field, messages] of Object.entries(err.response.data)) {
          const errorMsg = Array.isArray(messages) ? messages[0] : messages;
          toast.showError(`${field}: ${errorMsg}`);
        }
      } else {
        toast.showError(err.message || "Error al registrar módulo");
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar un módulo existente
  const UpdateModulo = async (id: number, modulosData: ModuloUpdateData): Promise<Modulo> => {
    loading.value = true;

    try {
      const response = await api.patch<Modulo>(`user/modulo/${id}/`, modulosData);

      const index = modulos.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        modulos.value[index] = response.data;
      }
      toast.showSuccess("Módulo actualizado correctamente");
      return response.data;
    } catch (err: any) {
      error.value = err;

      if (err.response?.data) {
        for (const [messages] of Object.entries(err.response.data)) {
          let errorMsg = Array.isArray(messages) ? messages[0] : messages;

          if (typeof errorMsg === "object" && "string" in errorMsg) {
            errorMsg = errorMsg.string;
          }

          toast.showError(errorMsg);
        }
      } else {
        toast.showError(err.message || "Error al actualizar módulo");
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar un módulo
  const DeleteModulo = async (id: number): Promise<boolean> => {
    loading.value = true;

    try {
      await api.delete(`user/modulo/${id}/`);
      modulos.value = modulos.value.filter((t) => t.id !== id);
      toast.showSuccess("Módulo eliminado correctamente");
      return true;
    } catch (err: any) {
      error.value = err;
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Error al eliminar módulo";
      toast.showError(message);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Activar o desactivar módulo
  const toggleModuloStatus = async (id: number, newStatus: boolean): Promise<boolean> => {
    try {
      const endpoint = newStatus ? "activate" : "deactivate";
      await api.post(`user/modulo/${id}/${endpoint}/`);

      // Actualizar el estado localmente
      const modulo = modulos.value.find((m) => m.id === id);
      if (modulo) {
        modulo.is_active = newStatus;
      }

      toast.showSuccess(
        `Módulo ${newStatus ? "activado" : "desactivado"} correctamente`
      );
      return true;
    } catch (err: any) {
      error.value = err;
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        `Error al ${newStatus ? "activar" : "desactivar"} módulo`;
      toast.showError(message);
      throw err;
    }
  };

  // Obtener todos los módulos con usuarios
  const getAllModulesWithUsers = async (): Promise<ModulesWithUsersResponse> => {
    loading.value = true;
    try {
      const { data } = await api.get<ModulesWithUsersResponse>("user/modulo/usuarios-todos/");
      return {
        success: true,
        total_modulos: data.total_modulos,
        modulos: data.modulos,
      };
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Error al obtener usuarios de los módulos";
      toast.showError(message);
      return { 
        success: false, 
        message,
        total_modulos: 0,
        modulos: []
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    // Estado
    loading,
    modulos,
    error,

    // Métodos
    ListModulos,
    CreateModulo,
    UpdateModulo,
    DeleteModulo,
    getAllModulesWithUsers,
    toggleModuloStatus,
  };
});