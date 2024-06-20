<template>
  <div>
    {{ useWatchStore().watch_data.name }}
  </div>
</template>

<script setup>
import { useWatchStore } from '../stores/watch';

useWatchStore().getDetailWatch()

</script>

<style>

</style>