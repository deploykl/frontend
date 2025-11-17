// --------------------------------------
// 📌 IMPORTS
// --------------------------------------
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import { api } from "@/components/services/Axios";
import { 
  webSocketTableroInstance, 
  type WebSocketMessage  // 
} from "@/components/services/WebSocketTablero";
import { useErrorStore } from "../errors/errorStore";

// --------------------------------------
// 📌 INTERFACES
// --------------------------------------
export interface IFuenteInfo {
  id: number;
  name: string;
  nombre: string;
  frecuencia: string;
}

export interface ITablero {
  id: number;
  name: string;
  nombre: string;
  descripcion?: string;
  is_active: boolean;
  fuentes_info?: IFuenteInfo[];
  fuentes_detalles?: IFuenteInfo[];
  fuentes_ids?: number[];
}

export interface ITableroWSData {
  tablero: ITablero;
  user?: string;
  id?: number; // en delete
}

export interface IFuenteOption {
  label: string;
  value: number;
  data: any;
}

// --------------------------------------
// 📌 STORE
// --------------------------------------
export const useTableroStore = defineStore("tableroStore", () => {
  const errorStore = useErrorStore();

  const tableros: Ref<ITablero[]> = ref([]);
  const fuentesOptions: Ref<IFuenteOption[]> = ref([]);
  const categoriasOptions = ref([]);

  const error = ref<unknown>(null);
  const loading = ref<boolean>(false);

  const webSocketListeners = ref<{ initialized?: boolean }>({});

  // --------------------------------------------------------------------
  // 🔷 Helper para mostrar toasts
  // --------------------------------------------------------------------
  const showToast = {
    success: (message: string) => {
      errorStore.showMessage(message, "success");
    },
    error: (message: string) => {
      errorStore.showMessage(message, "error");
    },
    delete: (message: string) => {
      errorStore.showMessage(message, "error"); // O "warning" si prefieres
    },
    info: (message: string) => {
      errorStore.showMessage(message, "info");
    }
  };

  // --------------------------------------------------------------------
  // 🔷 WebSocket Inicializador
  // --------------------------------------------------------------------
  const initWebSocket = () => {
    if (!webSocketTableroInstance.connected) {
      webSocketTableroInstance.connect();
    }

    if (!webSocketListeners.value.initialized) {
      webSocketTableroInstance.on("TABLERO_CREATED", handleTableroCreated);
      webSocketTableroInstance.on("TABLERO_UPDATED", handleTableroUpdated);
      webSocketTableroInstance.on("TABLERO_DELETED", handleTableroDeleted);
      webSocketTableroInstance.on(
        "TABLERO_STATUS_CHANGED",
        handleTableroStatusChanged
      );

      webSocketListeners.value.initialized = true;
      console.log("WebSocket listeners inicializados");
    }
  };

  const cleanupWebSocket = () => {
    if (webSocketListeners.value.initialized) {
      webSocketTableroInstance.off("TABLERO_CREATED", handleTableroCreated);
      webSocketTableroInstance.off("TABLERO_UPDATED", handleTableroUpdated);
      webSocketTableroInstance.off("TABLERO_DELETED", handleTableroDeleted);
      webSocketTableroInstance.off(
        "TABLERO_STATUS_CHANGED",
        handleTableroStatusChanged
      );

      webSocketListeners.value.initialized = false;
    }
  };

  // --------------------------------------------------------------------
  // 🔷 Handlers WebSocket
  // --------------------------------------------------------------------
const buildTableroWithFuentes = (tablero: ITablero): ITablero => ({
  ...tablero,
  fuentes_detalles: tablero.fuentes_info || [],
  fuentes_ids: tablero.fuentes_info?.map((f) => f.id) || [],
});
 const handleTableroCreated = (data: WebSocketMessage) => {
  // Validar que data.tablero existe
  if (!data.tablero) {
    console.error('WebSocket TABLERO_CREATED: falta propiedad tablero', data);
    return;
  }

  const exists = tableros.value.findIndex((t: ITablero) => t.id === data.tablero.id);
  const user = data.user ?? "Sistema";

  const tableroReady = buildTableroWithFuentes(data.tablero);

  if (exists !== -1) {
    tableros.value[exists] = tableroReady;
  } else {
    tableros.value.unshift(tableroReady);
  }

  showToast.success(`Nuevo tablero creado por el usuario: ${user}`);
};

const handleTableroUpdated = (data: WebSocketMessage) => {
  if (!data.tablero) {
    console.error('WebSocket TABLERO_UPDATED: falta propiedad tablero', data);
    return;
  }

  const index = tableros.value.findIndex((t: ITablero) => t.id === data.tablero.id);
  const user = data.user ?? "Sistema";

  const tableroReady = buildTableroWithFuentes(data.tablero);

  if (index !== -1) {
    tableros.value[index] = tableroReady;
  } else {
    tableros.value.unshift(tableroReady);
  }

  showToast.success(`Tablero actualizado por: ${user}`);
};

const handleTableroDeleted = (data: WebSocketMessage) => {
  // Para DELETE, usamos data.id en lugar de data.tablero.id
  if (data.id === undefined) {
    console.error('WebSocket TABLERO_DELETED: falta propiedad id', data);
    return;
  }

  const user = data.user ?? "Sistema";
  tableros.value = tableros.value.filter((t: ITablero) => t.id !== data.id);

  showToast.delete(`Tablero eliminado por el usuario: ${user}`);
};

const handleTableroStatusChanged = (data: WebSocketMessage) => {
  if (!data.tablero) {
    console.error('WebSocket TABLERO_STATUS_CHANGED: falta propiedad tablero', data);
    return;
  }

  const user = data.user ?? "Sistema";
  const index = tableros.value.findIndex((t: ITablero) => t.id === data.tablero.id);
  
  if (index !== -1) {
    tableros.value[index] = data.tablero;
    showToast.success(
      `Tablero ${
        data.tablero.is_active ? "activado" : "desactivado"
      } por el usuario: ${user}`
    );
  }
};

  // --------------------------------------------------------------------
  // 🔷 API: Listar Tableros
  // --------------------------------------------------------------------
  const ListTablero = async (): Promise<ITablero[]> => {
    error.value = null;
    loading.value = true;

    try {
      const response = await api.get<ITablero[]>("dimon/tablero/");

      tableros.value = response.data.map(buildTableroWithFuentes);

      initWebSocket();
      return tableros.value;
    } catch (err: any) {
      error.value = err;
      showToast.error(
        err.response?.data?.detail ??
          err.response?.data?.message ??
          "Error al obtener tableros"
      );
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // --------------------------------------------------------------------
  // 🔷 API: Crear Tablero
  // --------------------------------------------------------------------
  const CreateTablero = async (tableroData: Partial<ITablero>) => {
    loading.value = true;

    try {
      const dataToSend = {
        ...tableroData,
        fuentes: tableroData.fuentes_info?.map((f) => f.id),
      };

      const response = await api.post("dimon/tablero/", dataToSend);

      console.log("Tablero creado vía API, esperando WebSocket...");

      return response.data;
    } catch (err: any) {
      error.value = err;

      if (err.response?.data) {
        for (const [field, messages] of Object.entries(err.response.data)) {
          const msg = Array.isArray(messages) ? messages[0] : messages;
          showToast.error(`${field}: ${msg}`);
        }
      }

      throw err;
    } finally {
      loading.value = false;
    }
  };

  // --------------------------------------------------------------------
  // 🔷 API: Actualizar Tablero
  // --------------------------------------------------------------------
  const UpdateTablero = async (id: number, tableroData: Partial<ITablero>) => {
    loading.value = true;

    try {
      const dataToSend = {
        ...tableroData,
        fuentes: tableroData.fuentes_info?.map((f) => f.id),
      };

      const response = await api.patch(`dimon/tablero/${id}/`, dataToSend);
      console.log("Tablero actualizado vía API, esperando WebSocket...");

      return response.data;
    } catch (err: any) {
      error.value = err;
      showToast.error("Error al actualizar tablero");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // --------------------------------------------------------------------
  // 🔷 API: Eliminar Tablero
  // --------------------------------------------------------------------
  const DeleteTablero = async (id: number): Promise<boolean> => {
    loading.value = true;

    try {
      await api.delete(`dimon/tablero/${id}/`);
      tableros.value = tableros.value.filter((t: ITablero) => t.id !== id);
      return true;
    } catch (err: any) {
      error.value = err;
      showToast.error(
        err.response?.data?.detail ??
          err.response?.data?.message ??
          "Error al eliminar tablero"
      );
      return false;
    } finally {
      loading.value = false;
    }
  };

  // --------------------------------------------------------------------
  // 🔷 Activar / Desactivar
  // --------------------------------------------------------------------
  const toggleTableroStatus = async (
    id: number,
    newStatus: boolean
  ): Promise<boolean> => {
    try {
      const endpoint = newStatus ? "activate" : "deactivate";
      await api.post(`dimon/tablero/${id}/${endpoint}/`);

      const tablero = tableros.value.find((t: ITablero) => t.id === id);
      if (tablero) tablero.is_active = newStatus;

      return true;
    } catch (err: any) {
      error.value = err;
      showToast.error(
        err.response?.data?.detail ??
          err.response?.data?.message ??
          `Error al ${newStatus ? "activar" : "desactivar"} tablero`
      );

      const tablero = tableros.value.find((t: ITablero) => t.id === id);
      if (tablero) tablero.is_active = !newStatus;

      return false;
    }
  };

  // --------------------------------------------------------------------
  // 🔷 API: Fuentes
  // --------------------------------------------------------------------
  const loadFuentesOptions = async (): Promise<IFuenteOption[]> => {
    try {
      const response = await api.get<any[]>("dimon/fuentes/");

      fuentesOptions.value = response.data.map((fuente) => ({
        label: `${fuente.nombre} (${fuente.frecuencia})`,
        value: fuente.id,
        data: fuente,
      }));

      return fuentesOptions.value;
    } catch (error: any) {
      showToast.error("Error al cargar las fuentes");
      throw error;
    }
  };

  return {
    loading,
    tableros,
    fuentesOptions,
    categoriasOptions,
    error,

    ListTablero,
    CreateTablero,
    UpdateTablero,
    DeleteTablero,
    toggleTableroStatus,

    loadFuentesOptions,

    initWebSocket,
    cleanupWebSocket,
  };
});