<template>
  <div class="w-full h-[85vh] max-w-[98%] mx-auto border border-gray-300 rounded-lg overflow-hidden">
    <iframe
      :src="powerBIUrl"
      frameborder="0"
      allowfullscreen
      class="w-full h-full block"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
const powerBIUrl: string = "https://app.powerbi.com/view?r=eyJrIjoiZTU0ZmRjZGQtNGJkNC00M2JmLTg1MjktMzE4ZjU1YjFkNDc2IiwidCI6Ijc5MDVjMWZjLTkzM2MtNDUyYS04YjgzLWIyZTU2NDU1ZDE2YSIsImMiOjR9";
</script>


