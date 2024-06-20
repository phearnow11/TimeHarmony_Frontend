<template>
  <div>
    {{ useWatchStore().watch_data.name }}
  </div>
</template>

<script setup>
import { useWatchStore } from '../stores/watch';

useWatchStore().getDetailWatch("W04226883133")

</script>

<style>

</style>