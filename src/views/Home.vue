<template>
  <div>
    <p>Hello user: {{user.username}}</p>
  </div>
</template>

<script setup>
  import {useUserStore} from '../stores/user'
  import router from '../router'
  const user = useUserStore()
  if (user.user_id==null) {
    router.push('/login')
  }
</script>

<style></style>
