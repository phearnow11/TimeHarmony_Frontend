<template>
    <div class="">
        <div class="flex justify-center items-center gap-6 text-center title">
            <span class="text-border">4</span>
            <clock/>
            <span class="text-border">4</span>
        </div>
        <div class="flex flex-col justify-center items-center gap-5">
            <span>Oops, không có gì ở đây hết quay về <router-link to="/" class="hover-underline-animation">Trang chủ</router-link> đi !</span>
        </div>
    </div>
</template>

<script setup>
import Clock from '../components/Clock.vue'
</script>

<style scoped>
.title {
    font-size: 15rem;
}

.text-border {
    font-family: "Fira Sans", sans-serif;
    /* Apply border effect */
    color: transparent; /* Make the text transparent */
    -webkit-text-stroke: 1px var(--primary); /* WebKit/Blink browsers */
    text-stroke: 1px var(--primary); /* Standard syntax */
}
</style>
