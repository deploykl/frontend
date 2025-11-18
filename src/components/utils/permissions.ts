// Tipos para los módulos
export type ModuleName = string;
export type ModuleList = ModuleName[];

// Función centralizada para verificar permisos
export const hasModuleAccess = (
  moduleNames: string | string[] | undefined,
  userModulos: ModuleList,
  isSuperuser: boolean = false
): boolean => {
  if (isSuperuser) return true;
  if (!moduleNames) return true;

  // Si es string, convertirlo a array
  const modulesToCheck: string[] = typeof moduleNames === 'string'
    ? moduleNames.split(',').map(m => m.trim().toLowerCase())
    : Array.isArray(moduleNames)
      ? moduleNames.map(m => m.toLowerCase())
      : [];

  if (modulesToCheck.length === 0) return true;

  const userModules = userModulos.map(m => m.toLowerCase());

  // Verifica si al menos uno de los módulos existe en los módulos del usuario
  return modulesToCheck.some(module => userModules.includes(module));
}

// Obtener módulos del usuario desde localStorage
export const getUserModules = (): ModuleList => {
  const modulos = localStorage.getItem('user_modulos');
  return modulos ? JSON.parse(modulos) : [];
}

// Verificar si es superuser
export const isSuperUser = (): boolean => {
  return localStorage.getItem('is_superuser') === 'true';
}

// Constantes de permisos para evitar strings mágicos
export const PERMISSIONS = {
  SUPER_USER: 'SuperUser',
  GENERAL: 'General',
  PERSONAL: 'Personal',
  PERSONAL_LECTURA: 'Personal_Lectura',
  PATRIMONIO: 'Patrimonio',
  INFORMATICA: 'Informática',
  ADMINISTRACION: 'Administración',
  PLANEAMIENTO_ADMIN: 'Planeamiento_admin',
  SGD_GENERAL: 'SGD-GENERAL',
  SISTEMAS: 'Sistemas',
  MONITOR: 'Monitor',
  ADMIN_DIMON: 'Admin_dimon',
  ATENCIONES: 'Atenciones',
  CONSULTA_EXTERNA: 'Consulta Externa',
  CONSULTA_EXTERNA_ADMIN: 'Consulta Externa Admin',
  UFM: 'UFM',
  ADMIN_DIEM: 'Admin_diem'
} as const;