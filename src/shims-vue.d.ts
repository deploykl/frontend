declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare module '@/router' {
  import type { Router } from 'vue-router'
  const router: Router
  export default router
}

// --- 3. Soporte genérico para tu barrel "@/assets/icons" ---
declare module '@/assets/icons' {
  import type { DefineComponent } from 'vue'
  const icons: Record<string, string | DefineComponent<{}, {}, any>>
  export = icons
}

// Soporte para el alias @
declare module '@/composables/*' {
  // Esto permite que TypeScript resuelva los imports con @
  const value: any
  export = value
}