<template>
    <div class="bg-gray-50 dark:bg-gray-900 py-2">
        <!-- Header de la sección -->
        <div class="container mx-auto px-4 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Noticias
                    </h1>
                    <p class="text-gray-600 dark:text-gray-300">
                        Mantente informado con las últimas actualizaciones
                    </p>
                </div>
                <div class="flex items-center gap-4">
                    <!-- Filtros -->
                    <select
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                        <option>Todas las categorías</option>
                        <option>Actualizaciones</option>
                        <option>Anuncios</option>
                        <option>Eventos</option>
                    </select>

                    <!-- Botón nueva noticia (solo admin) -->
                    <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <i class="pi pi-plus mr-2"></i>
                        Nueva Noticia
                    </button>
                </div>
            </div>
        </div>

        <!-- Grid de noticias -->
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <!-- Tarjeta de noticia 1 -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div class="h-48 bg-linear-to-br from-blue-500 to-purple-600 relative">
                        <!-- Badge de categoría -->
                        <span
                            class="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            Actualización
                        </span>
                        <!-- Fecha -->
                        <span
                            class="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                            15 Nov 2024
                        </span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                            Nueva actualización del sistema disponible
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            Hemos lanzado una nueva actualización que incluye mejoras en el rendimiento y nuevas
                            funcionalidades...
                        </p>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                Por: Admin
                            </span>
                            <button
                                class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                Leer más →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tarjeta de noticia 2 -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div class="h-48 bg-linear-to-br from-green-500 to-teal-600 relative">
                        <span
                            class="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            Evento
                        </span>
                        <span
                            class="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                            20 Nov 2024
                        </span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                            Webinar: Mejores prácticas de seguridad
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            Únete a nuestro webinar gratuito sobre las mejores prácticas de seguridad en aplicaciones
                            web modernas...
                        </p>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                Por: Seguridad Team
                            </span>
                            <button
                                class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                Leer más →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tarjeta de noticia 3 -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div class="h-48 bg-linear-to-br from-orange-500 to-red-600 relative">
                        <span
                            class="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            Anuncio
                        </span>
                        <span
                            class="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                            25 Nov 2024
                        </span>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                            Mantenimiento programado este fin de semana
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            Informamos que este fin de semana realizaremos mantenimiento programado del sistema. El
                            servicio podría...
                        </p>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                Por: Soporte
                            </span>
                            <button
                                class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                Leer más →
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Paginación -->
            <div class="flex justify-center items-center gap-2 mt-12">
                <button
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Anterior
                </button>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">2</button>
                <button
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">3</button>
                <button
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Siguiente
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Aquí irá la lógica para cargar noticias, filtros, etc.
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>