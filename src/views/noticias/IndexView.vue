<template>
  <div class="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    <!-- Header con título y descripción -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-3">
        Últimas Noticias
      </h2>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Sigue las últimas actualizaciones y comunicados oficiales del Ministerio de Salud del Perú
      </p>
    </div>

    <!-- Contenedor horizontal con scroll -->
    <div class="relative">
      <!-- Flechas de navegación (opcionales) -->

      <!-- Contenedor de tweets -->
      <div 
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto py-4 px-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 snap-x snap-mandatory"
      >
        <!-- Tweet 1 -->
        <div class="shrink-0 min-w-[300px] max-w-[550px] snap-start">
          <div 
            ref="tweetContainer1" 
            class="w-full min-w-[300px] max-w-[550px] bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
           
          </div>
        </div>

        <!-- Tweet 2 -->
        <div class="shrink-0 min-w-[300px] max-w-[550px] snap-start">
          <div 
            ref="tweetContainer2" 
            class="w-full min-w-[300px] max-w-[550px] bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
           
          </div>
        </div>

        <!-- Tweet 3 -->
        <div class="flex-shrink-0 min-w-[300px] max-w-[550px] snap-start">
          <div 
            ref="tweetContainer3" 
            class="w-full min-w-[300px] max-w-[550px] bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
           
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Declaración para TypeScript
declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (tweetId: string, container: HTMLElement, options?: any) => Promise<any>
      }
    }
  }
}

const tweetContainer1 = ref<HTMLElement>()
const tweetContainer2 = ref<HTMLElement>()
const tweetContainer3 = ref<HTMLElement>()
const scrollContainer = ref<HTMLElement>()

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -400, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 400, behavior: 'smooth' })
  }
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://platform.twitter.com/widgets.js'
  script.async = true
  document.head.appendChild(script)

  script.onload = () => {
    if (window.twttr) {
      // Tweet 1
      if (tweetContainer1.value) {
        window.twttr.widgets.createTweet(
          '1988759081885045127',
          tweetContainer1.value,
          {
            align: 'center',
            lang: 'es',
            width: 550
          }
        )
      }

      // Tweet 2
      if (tweetContainer2.value) {
        window.twttr.widgets.createTweet(
          '1984088720887128284',
          tweetContainer2.value,
          {
            align: 'center',
            lang: 'es',
            width: 550
          }
        )
      }

      // Tweet 3
      if (tweetContainer3.value) {
        window.twttr.widgets.createTweet(
          '1958540152399139154',
          tweetContainer3.value,
          {
            align: 'center',
            lang: 'es',
            width: 550
          }
        )
      }
    }
  }
})
</script>

<style scoped>
/* Forzar el tamaño del iframe de Twitter */
::v-deep .twitter-tweet {
  width: 100% !important;
  max-width: 550px !important;
  min-width: 300px !important;
}

::v-deep iframe[data-tweet-id] {
  width: 100% !important;
  max-width: 550px !important;
  min-width: 300px !important;
}
</style>