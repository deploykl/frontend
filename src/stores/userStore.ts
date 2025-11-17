import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/components/services/Axios";
import defaultAvatar from "@/assets/img/header/default-avatar.png";

interface UserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  dni: string;
  celular: string;
  image: string;
}

interface ApiError {
  response?: {
    data?: any;
    status?: number;
  };
  config?: {
    url?: string;
  };
}

export const useUserStore = defineStore("user", () => {
  const userData = ref<UserData>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    dni: "",
    celular: "",
    image: "",
  });

  const imageError = ref(false);
  const loading = ref(false);

  const effectiveUserImage = computed(() => {
    if (imageError.value || !userData.value.image) return defaultAvatar;
    if (userData.value.image.startsWith("data:")) return userData.value.image;

    const cacheBuster = `?t=${Date.now()}`;

    if (userData.value.image.startsWith("http")) {
      return `${userData.value.image}${cacheBuster}`;
    }

    if (!userData.value.image.startsWith("/media/")) {
      return `${import.meta.env.VITE_IMG_SERVER}media/${userData.value.image}${cacheBuster}`;
    }

    return `${import.meta.env.VITE_IMG_SERVER}${userData.value.image.replace(
      /^\/+/,
      ""
    )}${cacheBuster}`;
  });

  const fullName = computed(() =>
    `${userData.value.first_name} ${userData.value.last_name}`.trim()
  );

  async function fetchUserProfile(): Promise<any> {
    loading.value = true;
    try {
      const response = await api.get("user/profile/");
      updateUserData(response.data);
      imageError.value = false;
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError.response?.status === 401) {
        if (apiError.config?.url?.includes("token/refresh")) {
          // lógica para logout si deseas
        }
      }

      console.error("Error al obtener perfil:", error);
      imageError.value = true;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function updateUserData(newData: Partial<UserData>): void {
    userData.value = {
      ...userData.value,
      ...newData,
      image: newData.image
        ? newData.image.startsWith("data:")
          ? newData.image
          : `${newData.image}?${Date.now()}`
        : "",
    };
  }

  function setImageError(value: boolean): void {
    imageError.value = value;
  }

  async function updateUserProfile(selectedImage: File | null): Promise<boolean> {
    loading.value = true;

    try {
      const formData = new FormData();
      formData.append("username", userData.value.username);
      formData.append("email", userData.value.email);
      formData.append("first_name", userData.value.first_name);
      formData.append("last_name", userData.value.last_name);
      formData.append("dni", userData.value.dni);
      formData.append("celular", userData.value.celular);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await api.put("user/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUserData({
        ...response.data,
        image: response.data.image
          ? `${response.data.image}?t=${Date.now()}`
          : "",
      });

      return true;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorData = apiError.response?.data || {};
      let errorMessage = "Error al actualizar el perfil";

      if (typeof errorData === "string") {
        errorMessage = errorData;

      } else if (Array.isArray(errorData)) {
        errorMessage = errorData.join(" ");

      } else if (typeof errorData === "object" && errorData !== null) {

        // Mensajes específicos de Django
        if (errorData.dni) {
          errorMessage = Array.isArray(errorData.dni)
            ? errorData.dni.join(" ")
            : errorData.dni;

        } else if (errorData.celular) {
          errorMessage = Array.isArray(errorData.celular)
            ? errorData.celular.join(" ")
            : errorData.celular;

        } else if (errorData.username) {
          errorMessage = Array.isArray(errorData.username)
            ? errorData.username.join(" ")
            : errorData.username;

        } else if (errorData.email) {
          errorMessage = Array.isArray(errorData.email)
            ? errorData.email.join(" ")
            : errorData.email;

        } else if (errorData.detail) {
          errorMessage = errorData.detail;

        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors.join(" ")
            : errorData.non_field_errors;

        } else {
          // Fallback seguro (ya sin error TS2538)
          const errorKeys = Object.keys(errorData);
          const firstErrorKey = errorKeys[0] as keyof typeof errorData | undefined;

          if (firstErrorKey) {
            const firstErrorValue = errorData[firstErrorKey];
            errorMessage = Array.isArray(firstErrorValue)
              ? firstErrorValue.join(" ")
              : String(firstErrorValue);
          }
        }
      }

      console.error("Error en updateProfile:", errorMessage, error);
      return false;

    } finally {
      loading.value = false;
    }
  }

  return {
    userData,
    imageError,
    loading,
    effectiveUserImage,
    fullName,
    fetchUserProfile,
    updateUserData,
    setImageError,
    updateUserProfile,
  };
});
