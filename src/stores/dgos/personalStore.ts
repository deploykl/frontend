// stores/dimon/personalStore.ts
import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import { api } from "@/components/services/Axios";
import { useCustomToast } from "@/components/utils/toast";

// Interfaces
interface Anexo {
  id: number;
  nombre: string;
  numero: string;
}

interface Condicion {
  id: number;
  nombre: string;
}

interface Nivel {
  id: number;
  nombre: string;
}

interface Dependencia {
  id: number;
  nombre: string;
}

interface Area {
  id: number;
  nombre: string;
  dependencia?: number;
}

interface Profesion {
  id: number;
  nombre: string;
}

interface Cargo {
  id: number;
  nombre: string;
}

interface Regimen {
  id: number;
  nombre: string;
}

interface GrupoOcupacional {
  id: number;
  nombre: string;
}

interface Estado {
  id: number;
  nombre: string;
}

interface Generica {
  id: number;
  nombre: string;
}

interface Modulo {
  id: number;
  nombre: string;
  codigo: string;
}

interface Personal {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  dependencia_nombre?: string;
  area_nombre?: string;
  cargo_nombre?: string;
  regimen_nombre?: string;
  grupo_ocupacional_nombre?: string;
  estado_nombre?: string;
  condicion_nombre?: string;
  nivel_nombre?: string;
  profesion_nombre?: string;
  generica_nombre?: string;
  anexo_nombre?: string;
  modulos?: Modulo[];
  tiene_acceso?: boolean;
  usuario?: number;
}

interface PersonalCreateData {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  dependencia?: number;
  area?: number;
  cargo?: number;
  regimen?: number;
  grupo_ocupacional?: number;
  estado?: number;
  condicion?: number;
  nivel?: number;
  profesion?: number;
  generica?: number;
  anexo?: number;
}

interface GestionarModulosData {
  modulos: number[];
}

interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}

export const usePersonalStore = defineStore("personalStore", () => {
  const toast = useCustomToast();
  
  // Refs con tipos
  const loading = ref<boolean>(false);
  const anexos = ref<Anexo[]>([]);
  const condicion = ref<Condicion[]>([]);
  const nivel = ref<Nivel[]>([]);
  const personal = ref<Personal[]>([]);
  const modulos = ref<Modulo[]>([]);
  const dependencias = ref<Dependencia[]>([]);
  const areas = ref<Area[]>([]);
  const profesion = ref<Profesion[]>([]);
  const cargo = ref<Cargo[]>([]);
  const regimen = ref<Regimen[]>([]);
  const grupo_ocupacional = ref<GrupoOcupacional[]>([]);
  const estado = ref<Estado[]>([]);
  const generica = ref<Generica[]>([]);
  const error = ref<unknown>(null);
  const selectedDependencia = ref<string | null>(null);

  // Computed para las opciones de filtro de áreas
  const areaFilterOptions = computed(() => {
    if (!selectedDependencia.value) {
      return [...new Set(personal.value.map((u) => u.area_nombre))].filter(
        (v): v is string => v !== null && v !== undefined
      );
    }

    return personal.value
      .filter((u) => u.dependencia_nombre === selectedDependencia.value)
      .map((u) => u.area_nombre)
      .filter((v, i, a): v is string => 
        a.indexOf(v) === i && v !== null && v !== undefined
      );
  });

  // Métodos
  const setSelectedDependencia = (dependencia: string | null): void => {
    selectedDependencia.value = dependencia;
  };

  const ListPersonal = async (): Promise<Personal[]> => {
    error.value = null;
    try {
      const response = await api.get<Personal[]>("dgos/administracion/personal/");
      personal.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err;
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Error al obtener personal";
      toast.showError(message);
      throw err;
    }
  };

  const ListPersonalToken = async (): Promise<Personal[]> => {
    error.value = null;
    try {
      const response = await api.get<Personal[]>("dgos/administracion/personal-token/");
      personal.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err;
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Error al obtener personal";
      toast.showError(message);
      throw err;
    }
  };

  const ListDependencias = async (): Promise<Dependencia[]> => {
    try {
      const response = await api.get<Dependencia[]>("dgos/administracion/dependencia/");
      dependencias.value = response.data;
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al cargar dependencias";
      toast.showError(message);
      throw err;
    }
  };

  const ListAreas = async (): Promise<Area[]> => {
    try {
      const response = await api.get<Area[]>("dgos/administracion/area/");
      areas.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar areas";
      toast.showError(message);
      throw err;
    }
  };

  const ListAnexos = async (): Promise<Anexo[]> => {
    try {
      const response = await api.get<Anexo[]>("dgos/administracion/anexo/");
      anexos.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar anexos";
      toast.showError(message);
      throw err;
    }
  };

  const ListCondicion = async (): Promise<Condicion[]> => {
    try {
      const response = await api.get<Condicion[]>("dgos/administracion/condicion/");
      condicion.value = response.data;
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al cargar condicion";
      toast.showError(message);
      throw err;
    }
  };

  const ListNivel = async (): Promise<Nivel[]> => {
    try {
      const response = await api.get<Nivel[]>("dgos/administracion/nivel/");
      nivel.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar nivel";
      toast.showError(message);
      throw err;
    }
  };

  const ListAreasByDependencia = async (dependenciaId: number): Promise<Area[]> => {
    try {
      const response = await api.get<Area[]>(
        `dgos/administracion/area/?dependencia=${dependenciaId}`
      );
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar áreas";
      toast.showError(message);
      throw err;
    }
  };

  const ListProfesion = async (): Promise<Profesion[]> => {
    try {
      const response = await api.get<Profesion[]>("dgos/administracion/profesion/");
      profesion.value = response.data;
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al cargar profesion";
      toast.showError(message);
      throw err;
    }
  };

  const ListCargo = async (): Promise<Cargo[]> => {
    try {
      const response = await api.get<Cargo[]>("dgos/administracion/cargo/");
      cargo.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar cargo";
      toast.showError(message);
      throw err;
    }
  };

  const ListRegimen = async (): Promise<Regimen[]> => {
    try {
      const response = await api.get<Regimen[]>("dgos/administracion/regimen/");
      regimen.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar regimen";
      toast.showError(message);
      throw err;
    }
  };

  const ListGrupoOcupacional = async (): Promise<GrupoOcupacional[]> => {
    try {
      const response = await api.get<GrupoOcupacional[]>("dgos/administracion/grupo_ocupacional/");
      grupo_ocupacional.value = response.data;
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al cargar grupo_ocupacional";
      toast.showError(message);
      throw err;
    }
  };

  const ListEstado = async (): Promise<Estado[]> => {
    try {
      const response = await api.get<Estado[]>("dgos/administracion/estado/");
      estado.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar estado";
      toast.showError(message);
      throw err;
    }
  };

  const ListGenerica = async (): Promise<Generica[]> => {
    try {
      const response = await api.get<Generica[]>("dgos/administracion/generica/");
      generica.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar generica";
      toast.showError(message);
      throw err;
    }
  };

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

  const CreatePersonal = async (personalData: PersonalCreateData): Promise<Personal> => {
    loading.value = true;
    try {
      const response = await api.post<Personal>(
        "dgos/administracion/personal/",
        personalData
      );
      personal.value.unshift(response.data);
      toast.showSuccess("Personal creado correctamente");
      return response.data;
    } catch (err: any) {
      error.value = err;

      if (err.response?.data) {
        for (const [field, messages] of Object.entries(err.response.data)) {
          const errorMsg = Array.isArray(messages) ? messages[0] : messages;
          toast.showError(`${field}: ${errorMsg}`);
        }
      } else {
        toast.showError(err.message || "Error al registrar personal");
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const UpdatePersonal = async (id: number, personalData: Partial<PersonalCreateData>): Promise<Personal> => {
    loading.value = true;

    try {
      const response = await api.patch<Personal>(
        `dgos/administracion/personal/${id}/`,
        personalData
      );

      const index = personal.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        personal.value[index] = response.data;
      }
      toast.showSuccess("Personal actualizado correctamente");
      return response.data;
    } catch (err: any) {
      error.value = err;

      if (err.response?.data) {
        for (const [field, messages] of Object.entries(err.response.data)) {
          let errorMsg = Array.isArray(messages) ? messages[0] : messages;

          if (typeof errorMsg === "object" && "string" in errorMsg) {
            errorMsg = (errorMsg as any).string;
          }

          toast.showError(errorMsg);
        }
      } else {
        toast.showError(err.message || "Error al actualizar personal");
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const DeletePersonal = async (id: number): Promise<boolean> => {
    loading.value = true;

    try {
      await api.delete(`dgos/administracion/personal/${id}/`);
      personal.value = personal.value.filter((t) => t.id !== id);
      toast.showSuccess("Personal eliminado correctamente");
      return true;
    } catch (err: any) {
      error.value = err;
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Error al eliminar personal";
      toast.showError(message);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const gestionarModulos = async (
    personId: number, 
    modulosIds: number[], 
    mode: "habilitar" | "editar" = "habilitar"
  ): Promise<any> => {
    loading.value = true;
    try {
      let response;

      if (mode === "habilitar") {
        response = await api.post<ApiResponse<any>>(
          `/dgos/administracion/personal/${personId}/habilitar_acceso/`,
          { modulos: modulosIds }
        );
      } else {
        response = await api.put<ApiResponse<any>>(
          `/dgos/administracion/personal/${personId}/modulos/`,
          { modulos: modulosIds }
        );
      }

    // Verificar que message existe y es string
    const message = response.data.message || "Operación completada";
    
    if (response.data.success) {
      toast.showSuccess(message);
      await ListPersonal();
      return response.data;
    } else {
      toast.showError(message);
      throw new Error(message);
    }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        `Error al ${mode === "habilitar" ? "habilitar" : "editar"} módulos`;
      toast.showError(message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

const deshabilitarAcceso = async (person: Personal): Promise<void> => {
  if (
    !confirm(`¿Deshabilitar acceso a ${person.nombre} ${person.apellido}?`)
  ) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.post<ApiResponse<any>>(
      `/dgos/administracion/personal/${person.id}/deshabilitar_acceso/`
    );

    // Verificar que message existe y es string
    const message = response.data.message || "Acceso deshabilitado correctamente";
    
    if (response.data.success) {
      toast.showSuccess(message);
      await ListPersonal();
    } else {
      toast.showError(message);
    }
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Error al deshabilitar acceso";
    toast.showError(message);
  } finally {
    loading.value = false;
  }
};

const resetearPassword = async (person: Personal): Promise<void> => {
  if (
    !confirm(`¿Resetear contraseña de ${person.nombre} ${person.apellido}?`)
  ) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.post<ApiResponse<any>>(
      `/dgos/administracion/personal/${person.id}/resetear_password/`
    );

    // Verificar que message existe y es string
    const message = response.data.message || "Contraseña reseteada correctamente";
    
    if (response.data.success) {
      toast.showSuccess(message);
    } else {
      toast.showError(message);
    }
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Error al resetear contraseña";
    toast.showError(message);
  } finally {
    loading.value = false;
  }
};

  return {
    // Estado
    loading,
    anexos,
    condicion,
    nivel,
    personal,
    modulos,
    dependencias,
    areas,
    profesion,
    cargo,
    regimen,
    grupo_ocupacional,
    estado,
    generica,
    error,
    selectedDependencia,
    areaFilterOptions,

    // Métodos
    ListAnexos,
    ListCondicion,
    ListNivel,
    ListPersonal,
    ListPersonalToken,
    ListModulos,
    ListDependencias,
    ListAreas,
    ListProfesion,
    ListCargo,
    ListRegimen,
    ListGrupoOcupacional,
    ListEstado,
    ListGenerica,
    ListAreasByDependencia,
    CreatePersonal,
    UpdatePersonal,
    DeletePersonal,
    gestionarModulos,
    deshabilitarAcceso,
    resetearPassword,
    setSelectedDependencia,
  };
});