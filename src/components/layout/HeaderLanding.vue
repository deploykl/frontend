<template>
    <header class="absolute inset-x-0 top-0 z-50 bg-transparent">
        <div class="mx-auto flex h-16 max-w-8xl items-center gap-8 px-4 sm:px-6 lg:px-8">
            <!-- Logo -->
            <router-link to="/" class="block">
                <span
                    class="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500 font-arkhip text-xl font-bold">
                    {{ projectName }}
                </span>
            </router-link>

            <div class="flex flex-1 items-center justify-end md:justify-between">
                <!-- Navegación desktop -->
                <nav aria-label="Global" class="hidden md:block">
                    <ul class="flex items-center gap-6 text-sm">
                        <li>
                            <router-link to="/general"
                                class="text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold">
                                GENERAL
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/dgos"
                                class="text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold">
                                DGOS
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/diem"
                                class="text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold">
                                DIEM
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/dimon"
                                class="text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold">
                                DIMON
                            </router-link>
                        </li>
                    </ul>
                </nav>

                <div class="flex items-center gap-4">
                    <!-- Controles desktop -->
                    <div class="hidden sm:flex sm:gap-4 items-center">
                        <DarkModeToggle />

                        <router-link v-if="!isAuthenticated" to="/login"
                            class="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse hover:animate-none border border-cyan-400 transform hover:scale-105">
                            <i class="pi pi-sign-in text-sm"></i>
                            Log in
                        </router-link>

                        <router-link v-else to="/noticias"
                            class="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse hover:animate-none border border-cyan-400">
                            <i class="pi pi-user text-sm"></i>
                            Panel Admin
                        </router-link>

                    </div>

                    <!-- Menú hamburguesa móvil -->
                    <button @click="toggleMenu"
                        class="block rounded-lg bg-white/10 p-2.5 text-gray-800 transition hover:bg-white/20 md:hidden dark:bg-gray-800/10 dark:text-white dark:hover:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-600/20">
                        <span class="sr-only">Toggle menu</span>
                        <i class="pi text-lg" :class="isMenuOpen ? 'pi-times' : 'pi-bars'"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Menú móvil -->
        <div v-if="isMenuOpen"
            class="border-t border-white/20 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
            <div class="px-4 py-6 space-y-4">
                <router-link to="/general" @click="closeMenu"
                    class="block text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold py-2">
                    GENERAL
                </router-link>
                <router-link to="/dgos" @click="closeMenu"
                    class="block text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold py-2">
                    DGOS
                </router-link>
                <router-link to="/diem" @click="closeMenu"
                    class="block text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold py-2">
                    DIEM
                </router-link>
                <router-link to="/dimon" @click="closeMenu"
                    class="block text-gray-800 dark:text-gray-300 transition hover:text-indigo-400 dark:hover:text-indigo-300 font-semibold py-2">
                    DIMON
                </router-link>

                <!-- Controles móvil -->
                <div class="flex items-center justify-between pt-4 border-t border-white/20">
                    <DarkModeToggle />

                    <!-- Botón dinámico móvil según autenticación -->
                    <router-link v-if="!isAuthenticated" to="/login" @click="closeMenu"
                        class="flex items-center gap-2 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-800/20 px-4 py-2 rounded-lg font-semibold text-sm">
                        <i class="pi pi-sign-in text-sm"></i>
                        Log in
                    </router-link>

                    <router-link v-else to="/noticias" @click="closeMenu"
                        class="flex items-center gap-2 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-800/20 px-4 py-2 rounded-lg font-semibold text-sm">
                        <i class="pi pi-user text-sm"></i>
                        Panel Admin
                    </router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const projectName = import.meta.env.VITE_PROJECT_NAME
const isMenuOpen = ref(false)

// Computed para verificar autenticación
const isAuthenticated = computed(() => {
    return !!localStorage.getItem('auth_token')
})

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('header') && isMenuOpen.value) {
        closeMenu()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>