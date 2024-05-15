<template>
  <div>
    <p>Hello user: {{user.username}}</p>
  </div>

</template>

<script setup>
  import {useUserStore} from '../stores/user'
  const user = useUserStore()


</script>

<style></style>
