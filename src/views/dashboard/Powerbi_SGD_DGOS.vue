<template>
  <div class="w-full h-[85vh] max-w-[98%] mx-auto border border-gray-300 rounded-lg overflow-hidden relative">
    <iframe
      :src="powerBIUrl"
      frameborder="0"
      allowfullscreen
      title="Power BI Dashboard"
      class="w-full h-full block"
      @load="onIframeLoad"
    />
    
    <!-- Loading indicator -->
    <div 
      v-if="loading" 
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 text-lg font-medium"
    >
      Cargando dashboard...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const powerBIUrl: string = "https://app.powerbi.com/view?r=eyJrIjoiZTU0ZmRjZGQtNGJkNC00M2JmLTg1MjktMzE4ZjU1YjFkNDc2IiwidCI6Ijc5MDVjMWZjLTkzM2MtNDUyYS04YjgzLWIyZTU2NDU1ZDE2YSIsImMiOjR9";

const loading = ref<boolean>(true);

const onIframeLoad = (): void => {
  loading.value = false;
  console.log('Power BI dashboard cargado correctamente');
};
</script>