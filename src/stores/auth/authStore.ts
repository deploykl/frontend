// stores/authStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/components/services/Axios";
import type { 
  LoginResponse, 
  TwoFAMode, 
  TwoFASetupResponse, 
  TwoFAVerifyResponse,
  BlockStatus,
  LoginData 
} from "@/stores/auth/authTypes";

export const useAuthStore = defineStore("auth", () => {
  // State - Autenticación básica
  const username = ref("");
  const password = ref("");
  const isLoading = ref(false);
  const showPassword = ref(false);
  const blockedTimeRemaining = ref(0);
  const blockedTimeTotal = ref(0);
  const remainingAttempts = ref<number | null>(null);
  const countdownInterval = ref<number | null>(null);

  // State - 2FA
  const show2FA = ref(false);
  const twoFAMode = ref<TwoFAMode>("verify");
  const pendingUserId = ref<string | null>(null);
  const qrCode = ref<string>("");
  const secret = ref<string>("");
  const twoFAToken = ref<string>("");
  const twoFASetupToken = ref<string>("");
  const twoFALoading = ref<boolean>(false);

  // Computed - Autenticación básica
  const isBlocked = computed(() => blockedTimeRemaining.value > 0);

  const buttonText = computed(() => {
    if (isBlocked.value) return "Cuenta Bloqueada";
    return "Ingresar";
  });

  const progressPercentage = computed(() => {
    if (blockedTimeTotal.value <= 0) return 0;
    return 100 - (blockedTimeRemaining.value / blockedTimeTotal.value) * 100;
  });

  // Computed - 2FA
  const isTokenValid = computed(() => /^\d{6}$/.test(twoFAToken.value));
  const isSetupTokenValid = computed(() => /^\d{6}$/.test(twoFASetupToken.value));

  // Actions - Autenticación básica
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLowerCase = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.id === "username") {
      username.value = target.value.toLowerCase();
    }
  };

  const useAnotherAccount = () => {
    resetLoginState();
  };

  const backToLogin = () => {
    show2FA.value = false;
    twoFAMode.value = "verify";
    pendingUserId.value = null;
    resetTwoFAState();
  };

  const resetLoginState = () => {
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value);
      countdownInterval.value = null;
    }

    blockedTimeRemaining.value = 0;
    blockedTimeTotal.value = 0;
    show2FA.value = false;
    username.value = "";
    password.value = "";
    pendingUserId.value = null;
    remainingAttempts.value = null;

    localStorage.removeItem("accountBlockExpiry");
    localStorage.removeItem("lastAttemptUsername");
    
    resetTwoFAState();
  };

  const startCountdown = (minutes: number) => {
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value);
    }

    blockedTimeTotal.value = minutes * 60;
    blockedTimeRemaining.value = minutes * 60;

    countdownInterval.value = setInterval(() => {
      if (blockedTimeRemaining.value > 0) {
        blockedTimeRemaining.value--;
      } else {
        if (countdownInterval.value) {
          clearInterval(countdownInterval.value);
          countdownInterval.value = null;
        }
        blockedTimeRemaining.value = 0;
        blockedTimeTotal.value = 0;
      }
    }, 1000);
  };

  const checkExistingBlock = async (): Promise<void> => {
    try {
      const lastUsername = localStorage.getItem("lastAttemptUsername");
      if (!lastUsername) return;

      const response = await api.post<BlockStatus>("user/check-block-status/", {
        username: lastUsername,
      });

      if (response.data.is_blocked) {
        const remainingMinutes = response.data.remaining_minutes;
        startCountdown(remainingMinutes);
      }
    } catch (error) {
      console.error("Error al verificar estado de bloqueo:", error);
      const blockExpiry = localStorage.getItem("accountBlockExpiry");
      if (blockExpiry) {
        const expiryTime = new Date(parseInt(blockExpiry));
        const now = new Date();
        const remainingSeconds = Math.max(
          0,
          Math.floor((expiryTime.getTime() - now.getTime()) / 1000)
        );

        if (remainingSeconds > 0) {
          const minutes = Math.ceil(remainingSeconds / 60);
          startCountdown(minutes);
        } else {
          localStorage.removeItem("accountBlockExpiry");
        }
      }
    }
  };

  // Actions - 2FA
  const validateToken = (): void => {
    twoFAToken.value = twoFAToken.value.replace(/\D/g, '').slice(0, 6);
  };

  const validateSetupToken = (): void => {
    twoFASetupToken.value = twoFASetupToken.value.replace(/\D/g, '').slice(0, 6);
  };

  const setupTwoFA = async (userId: string): Promise<void> => {
    try {
      console.log("🔄 Iniciando configuración 2FA para user:", userId);
      const response = await api.get<TwoFASetupResponse>(`user/2fa/setup/${userId}/`);
      qrCode.value = response.data.qr_code;
      secret.value = response.data.secret;
    } catch (error: any) {
      console.error("Error configurando 2FA:", error);
      throw new Error('Error al configurar autenticación de dos factores');
    }
  };

  const verifyAndActivate2FA = async (userId: string): Promise<TwoFAVerifyResponse> => {
    if (!isSetupTokenValid.value) {
      throw new Error('Ingresa un código válido de 6 dígitos');
    }

    twoFALoading.value = true;

    try {
      const response = await api.post<TwoFAVerifyResponse>(`user/2fa/activate/${userId}/`, {
        token: twoFASetupToken.value
      });

      return response.data;
    } catch (error: any) {
      console.error("Error activando 2FA:", error);
      const message = error.response?.data?.detail || 'Error al activar autenticación de dos factores';
      throw new Error(message);
    } finally {
      twoFALoading.value = false;
    }
  };

  const verifyToken = async (userId: string): Promise<TwoFAVerifyResponse> => {
    if (!isTokenValid.value || !userId) {
      throw new Error('Ingresa un código válido de 6 dígitos');
    }

    twoFALoading.value = true;

    try {
      const response = await api.post<TwoFAVerifyResponse>('user/2fa/verify/', {
        user_id: userId,
        token: twoFAToken.value
      });

      console.log("✅ Token verificado correctamente");
      return response.data;
    } catch (error: any) {
      console.error("❌ Error verificando token 2FA:", error);
      const message = error.response?.data?.detail || 'Error al verificar el código de autenticación';
      throw new Error(message);
    } finally {
      twoFALoading.value = false;
    }
  };

  const resetTwoFAState = (): void => {
    qrCode.value = "";
    secret.value = "";
    twoFAToken.value = "";
    twoFASetupToken.value = "";
    twoFALoading.value = false;
  };

  const setTwoFAMode = (newMode: TwoFAMode): void => {
    twoFAMode.value = newMode;
  };

  // Actions - Login principal
  const login = async (router?: any): Promise<void> => {
    if (isBlocked.value) {
      throw new Error("La cuenta está bloqueada temporalmente");
    }

    isLoading.value = true;
    remainingAttempts.value = null;

    try {
      const loginData: LoginData = {
        username: username.value,
        password: password.value,
      };

      // Guardar el username para verificar bloqueos después
      localStorage.setItem("lastAttemptUsername", username.value);

      const response = await api.post<LoginResponse>("user/login/", loginData);

      if (response.data.requires_2fa_setup) {
        show2FA.value = true;
        twoFAMode.value = "setup";
        pendingUserId.value = response.data.user_id;
        await setupTwoFA(response.data.user_id);
      } else if (response.data.requires_2fa) {
        show2FA.value = true;
        twoFAMode.value = "verify";
        pendingUserId.value = response.data.user_id;
      } else {
        handleSuccessfulLogin(response.data, router);
      }
    } catch (error: any) {
      handleLoginError(error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const handle2FASuccess = (data: LoginResponse) => {
    if (twoFAMode.value === "setup") {
      backToLogin();
    } else {
      handleSuccessfulLogin(data);
    }
  };

  const handleSuccessfulLogin = (data: LoginResponse, router?: any) => {
    const {
      access,
      refresh,
      user_id,
      is_superuser,
      is_staff,
      modulos,
      requires_password_change,
      is_2fa_enabled,
    } = data;

    if (requires_password_change) {
      localStorage.setItem("auth_token", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("is_superuser", is_superuser ? "true" : "false");
      localStorage.setItem("is_staff", is_staff ? "true" : "false");
      localStorage.setItem("user_modulos", JSON.stringify(modulos));
      localStorage.setItem("requires_password_change", "true");

      if (router) {
        router.push("/change-password");
      } else {
        window.location.href = "/change-password";
      }
      return;
    }

    if (!access) {
      console.error("Error: No se recibió token de acceso");
      return;
    }

    resetLoginState();

    localStorage.setItem("auth_token", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("is_superuser", is_superuser ? "true" : "false");
    localStorage.setItem("is_staff", is_staff ? "true" : "false");
    localStorage.setItem("user_modulos", JSON.stringify(modulos));
    localStorage.setItem("is_2fa_enabled", is_2fa_enabled ? "true" : "false");
    localStorage.removeItem("requires_password_change");

    const redirectPath = localStorage.getItem("redirectAfterLogin");
    
    if (router) {
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/noticias");
      }
    } else {
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectPath;
      } else {
        window.location.href = "/noticias";
      }
    }
  };

  const handleLoginError = (error: any) => {
    console.error("Error en login:", error);

    // Manejar bloqueo de cuenta
    if (error.response?.status === 403 && error.response.data.detail?.includes("bloqueada")) {
      const match = error.response.data.detail.match(/(\d+)\s*minutos/);
      if (match && match[1]) {
        const minutes = parseInt(match[1]);
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + minutes);
        localStorage.setItem("accountBlockExpiry", expiryTime.getTime().toString());
        startCountdown(minutes);
      }
    }

    // Manejar intentos restantes
    if (error.response?.data) {
      if (error.response.data.remaining_attempts !== undefined) {
        remainingAttempts.value = error.response.data.remaining_attempts;
      }

      if (error.response.data.detail) {
        console.error("Error del servidor:", error.response.data.detail);
      }
    }
  };

  // Actions - Logout
  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await api.post("user/logout/", { refresh: refreshToken })
          .catch((error) => {
            console.log("Logout en servidor falló, pero continuamos:", error);
          });
      }
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    } finally {
      await clearLocalSession();
    }
  };

  const logoutAll = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 3000)
        );

        const logoutPromise = api.post("user/logout/all/", {
          refresh: refreshToken,
        });

        await Promise.race([logoutPromise, timeoutPromise]);
      }
    } catch (error) {
      console.log("Error al cerrar sesión en todos los dispositivos:", error);
    } finally {
      await clearLocalSession();
    }
  };

  const clearLocalSession = async (): Promise<void> => {
    const itemsToRemove = [
      "auth_token",
      "refreshToken",
      "user_id",
      "is_superuser",
      "is_staff",
      "user_modulos",
      "requires_password_change",
      "user_profile",
      "last_login",
      "redirectAfterLogin",
    ];

    itemsToRemove.forEach((item) => localStorage.removeItem(item));
    sessionStorage.clear();

    resetLoginState();
  };

  return {
    // State - Autenticación básica
    username,
    password,
    isLoading,
    showPassword,
    blockedTimeRemaining,
    blockedTimeTotal,
    remainingAttempts,
    countdownInterval,

    // State - 2FA
    show2FA,
    twoFAMode,
    pendingUserId,
    qrCode,
    secret,
    twoFAToken,
    twoFASetupToken,
    twoFALoading,

    // Computed - Autenticación básica
    isBlocked,
    buttonText,
    progressPercentage,

    // Computed - 2FA
    isTokenValid,
    isSetupTokenValid,

    // Actions - Autenticación básica
    formatTime,
    handleLowerCase,
    useAnotherAccount,
    backToLogin,
    resetLoginState,
    startCountdown,
    checkExistingBlock,
    login,
    handleSuccessfulLogin,
    handleLoginError,
    logout,
    logoutAll,
    clearLocalSession,

    // Actions - 2FA
    validateToken,
    validateSetupToken,
    setupTwoFA,
    verifyAndActivate2FA,
    verifyToken,
    resetTwoFAState,
    setTwoFAMode,
    handle2FASuccess,
  };
});