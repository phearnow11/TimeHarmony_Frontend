<template>
    <div class="">
        <div class="flex justify-center items-center gap-6 text-center title">
            <span>4</span>
            <clock/>
            <span>4</span>
        </div>
        <div class="flex flex-col justify-center items-center gap-5">
            <span>Oops, sorry we can not find page you are looking for!</span>
            <router-link to="/">
                <button class="th-p-btn">
                    Back to home
                </button>
            </router-link>
        </div>
    </div>
</template>
<script setup>
import Clock from '../components/Clock.vue'
</script>

<style scoped>
.title{
    font-size: 15rem;
}
</style>