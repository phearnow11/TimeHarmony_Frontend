<script setup>
    var a = 0
    function menu() {
        if(a==0){
            a=1
            console.log("open");
        }
        else{
            a=0
            console.log("close");
        }
    }
</script>
<template>
    <div @click="menu" class="menu-container">
    <div class="menu-button">
        <div class="line"></div>
        <div class="line middle"></div>
        <div class="line"></div>
    </div>
    <span class="menu-label">Menu</span>
</div>
</template>
<style scoped>
.menu-container {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.menu-button {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 25px;
    height: 24px;
}

.line {
    width: 100%;
    height: 2px;
    background-color: #FFBD59;
    transition: all 0.3s ease;
}

.menu-container:hover .middle {
    width: 150%;
}

.menu-label {
    font-size: 16px;
    margin-left: 5px; /* Adjust the spacing as needed */
    transition: margin-left 0.3s ease;
}
.menu-container:hover .menu-label {
    margin-left: 20px; /* Adjust to the desired space */
}
</style>