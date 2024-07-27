<template>
    <button @click="useLocationStore().getLocation()">get location</button>
    <div v-if="useLocationStore().translatedName">{{ useLocationStore()?.translatedName }}</div>
</template>

<script setup>
import { useLocationStore } from '../stores/location';
</script>