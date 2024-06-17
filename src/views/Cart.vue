<template>
    <div class="flex justify-center items-center flex-col">
        <section class="w-3/4 h-16">
          
        </section>
        <cart-item/>
    </div>
</template>

<script>
import CartItem from '../components/CartItem.vue'
export default {
  components: { CartItem },
}
</script>

<style scoped>
  section{
    background-color: aqua;
  }
</style>