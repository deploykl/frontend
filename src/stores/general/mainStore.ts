import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/components/services/Axios";
import { useCustomToast } from "@/components/utils/toast";

interface PersonaCumpleanos {
  mes_nacimiento: number;
  dia_nacimiento: number;
  [key: string]: any;
}

interface Anexo {
  [key: string]: any;
}

export const useMainStore = defineStore("mainStore", () => {
  const toast = useCustomToast();
  const loading = ref<boolean>(false);
  const anexos = ref<Anexo[]>([]);
  const cumpleanos = ref<PersonaCumpleanos[]>([]);
  const error = ref<string | null>(null);
  const currentMonth = ref<number>(new Date().getMonth() + 1); // Mes actual (1-12)

  // Listar anexos
  const ListAnexo = async (): Promise<Anexo[]> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get("/componentes/anexo/");
      anexos.value = response.data;
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar los anexos";
      error.value = message;
      toast.showError(message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Listar cumpleaños
  const ListCumpleanos = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get("/componentes/birthday/");
      cumpleanos.value = response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al cargar los cumpleaños";
      error.value = message;
      toast.showError(message);
    } finally {
      loading.value = false;
    }
  };

  // Cambiar mes actual
  const setCurrentMonth = (month: number): void => {
    currentMonth.value = month;
  };

  // Computed: Cumpleaños del mes actual
  const cumpleanosDelMesActual = computed<PersonaCumpleanos[]>(() => {
    return cumpleanos.value
      .filter((persona: PersonaCumpleanos) => persona.mes_nacimiento === currentMonth.value)
      .sort((a: PersonaCumpleanos, b: PersonaCumpleanos) => a.dia_nacimiento - b.dia_nacimiento);
  });

  // Computed: Cumpleaños agrupados por mes
  const cumpleanosPorMes = computed<Record<number, PersonaCumpleanos[]>>(() => {
    const grouped: Record<number, PersonaCumpleanos[]> = {};
    
    for (let month = 1; month <= 12; month++) {
      grouped[month] = cumpleanos.value
        .filter((persona: PersonaCumpleanos) => persona.mes_nacimiento === month)
        .sort((a: PersonaCumpleanos, b: PersonaCumpleanos) => a.dia_nacimiento - b.dia_nacimiento);
    }
    
    return grouped;
  });

  // Computed: Meses que tienen cumpleaños
  const mesesConCumpleanos = computed<number[]>(() => {
    const meses = [...new Set(cumpleanos.value.map((p: PersonaCumpleanos) => p.mes_nacimiento))];
    return meses.sort((a: number, b: number) => a - b).filter((mes: number) => mes !== 0);
  });

  return {
    loading,
    anexos,
    cumpleanos,
    error,
    currentMonth,
    cumpleanosDelMesActual,
    cumpleanosPorMes,
    mesesConCumpleanos,
    ListAnexo,
    ListCumpleanos,
    setCurrentMonth
  };
});