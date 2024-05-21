<template>
  <div v-if="user">
    {{ user.username }}
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
const user = useUserStore()
</script>

<style></style>
