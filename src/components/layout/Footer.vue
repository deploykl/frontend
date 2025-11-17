<template>
    <footer class="w-full border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-4 shadow-sm transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">

                <!-- Texto -->
                <div class="text-center md:text-left text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    <p>
                        &copy; {{ currentYear }} - Desarrollado por el
                        <span class="text-gray-500 dark:text-gray-400">área de TI de la DGOS</span> |
                        <span class="font-semibold text-primary-600 dark:text-primary-400 transition-colors duration-300">
                            ({{ projectName }} {{ version }})
                        </span>
                    </p>
                </div>

                <!-- Tecnologías -->
                <div v-if="props.showTechnologies"
                    class="flex flex-wrap items-center justify-center md:justify-end gap-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    <span class="text-gray-500 dark:text-gray-400 mr-1">Tecnologías:</span>
                    <div v-for="(tech, index) in displayedTechnologies" :key="index"
                        class="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                        <img 
                            :src="tech.icon" 
                            :alt="tech.name" 
                            class="w-4 h-4 object-contain dark:brightness-90 dark:contrast-125 transition-all duration-300" 
                        />
                        <span class="font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">{{ tech.name }}</span>
                    </div>
                </div>

            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Importar todos los íconos del barrel
import * as icons from '@/assets/icons'

// Interfaces TypeScript
interface Technology {
    name: string
    icon: any
    description: string
    category?: 'frontend' | 'backend' | 'database' | 'tool'
}

// Props con tipos
interface Props {
    showTechnologies?: boolean
    variant?: 'default' | 'minimal'
}

// ⭐ Captura de props
const props = withDefaults(defineProps<Props>(), {
    showTechnologies: true,
    variant: 'default',
})

// Reactive data
const projectName = import.meta.env.VITE_PROJECT_NAME || 'SGI-DGOS'
const version = import.meta.env.VITE_VERSION || '1.0.0'
const currentYear = ref(new Date().getFullYear())

// Technologies array
const technologies = ref<Technology[]>([
    {
        name: 'Python',
        icon: icons.Python,
        description: 'Backend API con FastAPI',
        category: 'backend',
    },
    {
        name: 'Vue.js 3',
        icon: icons.Vuejs,
        description: 'Frontend con Composition API',
        category: 'frontend',
    },
    {
        name: 'SQL Server',
        icon: icons.SqlServer,
        description: 'Base de datos principal',
        category: 'database',
    },
    {
        name: 'Vite',
        icon: icons.Vite,
        description: 'Build tool y dev server',
        category: 'tool',
    },
    {
        name: 'Pinia',
        icon: icons.Pinia,
        description: 'Gestión de estado',
        category: 'frontend',
    },
    {
        name: 'WebSocket',
        icon: icons.Websocket,
        description: 'Comunicación en tiempo real',
        category: 'backend',
    },
])

// Computed
const displayedTechnologies = computed(() => {
    if (!props.showTechnologies) return []
    return technologies.value.filter(
        (tech) => import.meta.env.DEV || !tech.name.includes('WebSocket'),
    )
})
</script>