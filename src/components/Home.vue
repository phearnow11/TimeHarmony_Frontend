<template></template>

<script setup>
import { onMounted, ref } from "vue";
import emitter from "../eventBus";

const res = ref("");

onMounted(() => {
  emitter.on("log-user", (response) => {
    console.log(response);
    res.value = response
  });
});
</script>

<style></style>
