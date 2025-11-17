// src/assets/icons/index.ts

// FOOTER - Iconos del footer
export { default as Pinia } from './footer/pinia.svg'
export { default as Python } from './footer/python.svg'
export { default as SqlServer } from './footer/sql_server.svg'
export { default as Vite } from './footer/vite.svg'
export { default as Vuejs } from './footer/vuejs.svg'
export { default as Websocket } from './footer/websocket.svg'
export { default as TypeScript } from './footer/typescript.svg'
export { default as Tailwindcss } from './footer/tailwindcss.svg'
export { default as Django } from './footer/django.svg'
export { default as Gmail } from './social/gmail.svg'

// COMMON - Iconos generales (si los tienes)
//export { default as ArrowLeft } from './common/arrow-left.svg'
//export { default as ArrowRight } from './common/arrow-right.svg'
//export { default as Search } from './common/search.svg'
//export { default as Close } from './common/close.svg'
//
//// NAVIGATION - Iconos de navegación (si los tienes)
//export { default as Home } from './navigation/home.svg'
//export { default as User } from './navigation/user.svg'
//export { default as Settings } from './navigation/settings.svg'

// TIPOS PARA AUTOCOMPLETADO - ESENCIAL
export type IconName = 
  // Footer
  | 'Pinia'
  | 'Python' 
  | 'SqlServer'
  | 'Vite'
  | 'Vuejs'
  | 'Websocket'
  // Common
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Search'
  | 'Close'
  // Navigation
  | 'Home'
  | 'User'
  | 'Settings'
  // Agrega aquí todos los nuevos iconos que añadas