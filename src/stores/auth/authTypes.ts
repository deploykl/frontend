// types/auth.ts
export type TwoFAMode = 'setup' | 'verify'

export interface User {
  id: string
  username: string
  email: string
  is_superuser: boolean
  is_staff: boolean
  is_2fa_enabled: boolean
  requires_password_change: boolean
  first_name?: string
  last_name?: string
}

export interface LoginResponse {
  access: string
  refresh?: string
  user_id: string
  is_superuser: boolean
  is_staff: boolean
  modulos: string[]
  requires_password_change: boolean
  is_2fa_enabled: boolean
  requires_2fa_setup?: boolean
  requires_2fa?: boolean
  user?: User
}

export interface TwoFAProps {
  mode: TwoFAMode
  userId: string | null
}

export interface TwoFASetupResponse {
  secret: string
  qr_code: string
  backup_codes: string[]
}

export interface TwoFAVerifyRequest {
  user_id: string
  token: string
}

export interface TwoFAActivateRequest {
  token: string
}

export interface TwoFAVerifyResponse {
  success: boolean
  access?: string
  refresh?: string
  requires_password_change?: boolean
}

export interface LogoutResponse {
  message: string
}

export interface PasswordChangeRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  new_password: string
  confirm_password: string
}

// Interfaces para el bloqueo de cuenta
export interface BlockStatus {
  is_blocked: boolean;
  remaining_minutes: number;
}

export interface LoginData {
  username: string;
  password: string;
}