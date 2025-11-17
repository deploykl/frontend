// services/Axios.ts
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { Router } from "vue-router";
import axios from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    _isRetry?: boolean;
  }
}

interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

interface ApiError extends Error {
  response?: AxiosResponse;
  config?: InternalAxiosRequestConfig;
}

class ApiService {
  private api: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL as string,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: ApiError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: ApiError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _isRetry?: boolean;
        };

        if (!error.response) {
          return this.handleConnectionError();
        }

        // Handle token blacklisted
        if (error.response?.status === 401) {
          const isBlacklisted = this.isTokenBlacklisted(error.response);
          if (isBlacklisted) {
            this.handleBlacklistedToken();
            return Promise.reject(error);
          }
        }

        // Handle token expiration
        if (
          error.response?.status === 401 &&
          !originalRequest._isRetry &&
          !originalRequest.url?.includes("token/refresh")
        ) {
          return await this.handleTokenRefresh(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  private handleConnectionError(): Promise<never> {
    return Promise.reject({
      ...new Error(
        "El servicio no está disponible en este momento. Por favor, inténtelo más tarde."
      ),
      isConnectionError: true,
    });
  }

  private isTokenBlacklisted(response: AxiosResponse): boolean {
    const errorMessage =
      response.data?.detail ||
      response.data?.message ||
      response.data?.code ||
      "";

    console.log("🔐 Error 401 detectado:", errorMessage);

    return (
      errorMessage.includes("blacklisted") ||
      errorMessage.includes("Token is blacklisted") ||
      errorMessage.includes("token_not_valid") ||
      errorMessage.includes("invalid_token")
    );
  }

  private handleBlacklistedToken(): void {
    const currentRoute = this.router.currentRoute.value;

    if (currentRoute.name === "login" || currentRoute.path === "/login") {
      return;
    }

    this.clearStorage();

    const originPage = localStorage.getItem("originPage") || "/";
    this.router.push({
      path: originPage,
      query: {
        message: "session_ended_all_devices",
        reason:
          "Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo.",
      },
    });
  }

  private async handleTokenRefresh(
    originalRequest: InternalAxiosRequestConfig
  ): Promise<AxiosResponse> {
    originalRequest._isRetry = true;

    if (!this.refreshPromise) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        this.logout();
        return Promise.reject(new Error("No refresh token available"));
      }

      this.refreshPromise = this.api
        .post<TokenRefreshResponse>("token/refresh/", { refresh: refreshToken })
        .then((response) => {
          const newAccessToken = response.data.access;
          localStorage.setItem("auth_token", newAccessToken);
          this.api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          return newAccessToken;
        })
        .catch((err: ApiError) => {
          if (err.response?.status === 401) {
            this.handleBlacklistedToken();
          } else {
            this.logout();
          }
          return Promise.reject(err);
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    return this.refreshPromise.then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return this.api(originalRequest);
    });
  }

  private clearStorage(): void {
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
    ];

    itemsToRemove.forEach((item) => localStorage.removeItem(item));
    sessionStorage.clear();
  }

  public logout(): void {
    this.clearStorage();
    this.router.push("/login");
  }

  public getInstance(): AxiosInstance {
    return this.api;
  }
}

// Singleton instance
let apiInstance: ApiService | null = null;

export const initializeApi = (router: Router): AxiosInstance => {
  if (!apiInstance) {
    apiInstance = new ApiService(router);
  }
  return apiInstance.getInstance();
};

// Export function to get api instance
export const getApiInstance = (): AxiosInstance => {
  if (!apiInstance) {
    throw new Error("ApiService not initialized. Call initializeApi first.");
  }
  return apiInstance.getInstance();
};

// Lazy export - only create when accessed
let _api: AxiosInstance | null = null;

export const api = new Proxy({} as AxiosInstance, {
  get(_, prop) {
    if (!_api) {
      if (!apiInstance) {
        throw new Error("ApiService not initialized. Call initializeApi first.");
      }
      _api = apiInstance.getInstance();
    }
    return (_api as any)[prop];
  },
});