<template>
    <svg-icon class="text-primary" type="mdi" :path="path"></svg-icon>
  </template>
  
  <script>
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiClose } from '@mdi/js';
  
  export default {
    name: "my-component",
    components: {
      SvgIcon
    },
    data() {
      return {
         path: mdiClose,
      }
    }
  }
  </script>