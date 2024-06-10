<template>
  <div class="container mx-auto p-4 text-white">
    <!-- Main Section -->
    <div class="text-center py-12">
      <h1 class="text-4xl font-bold mb-4">We love creators</h1>
      <p class="text-xl mb-6">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <p class="mb-4">Welcome to our website, the premier destination for buying and selling luxury watches. Our platform is designed to offer a seamless and secure experience for both buyers and sellers.</p>
        <p class="mb-4">Every watch listed on our site is appraised by professional appraisers, ensuring that each piece is 100% reliable and authentic. Our team of experts has years of experience in the watch industry, and they meticulously evaluate each watch to provide accurate and detailed appraisals.</p>
        <p class="mb-4">We understand that purchasing a luxury watch is an investment, which is why we are committed to providing you with the most trustworthy and transparent service. Whether you are looking to buy a new timepiece or sell a cherished watch, we are here to help.</p>
        <p class="mb-4">Thank you for choosing our platform. We look forward to serving you and ensuring your complete satisfaction with every transaction.</p>
        <p class="mb-4">If you have any questions or need assistance, please feel free to <router-link to="/contact" class="text-blue-500 hover:underline">contact us</router-link>.</p>
      </div>
    </div>
    
    <!-- Statistics Section -->
    <div class="flex flex-wrap justify-around py-12">
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">2012</h2>
        <p class="text-xl">Business was founded</p>
      </div>
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">120+</h2>
        <p class="text-xl">People on the team</p>
      </div>
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">250k</h2>
        <p class="text-xl">Users on the platform</p>
      </div>
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">$70M</h2>
        <p class="text-xl">Paid out to creators</p>
      </div>
    </div>
    
    <!-- Values Section -->
    <div class="py-12 text-center">
      <h2 class="text-4xl font-bold mb-6">Our values</h2>
      <p class="text-xl mb-8">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Be world-class</h3>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Be supportive</h3>
          <p>A tincidunt sapien vehicula erat auctor pellentesque rhoncus volutpat blandit sit.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Share everything you know</h3>
          <p>Laudantium tempora sint ut consectetur ratione. Ut illum ut rem numquam fuga deserunt.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Take responsibility</h3>
          <p>Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Always learning</h3>
          <p>Iure sed ea obcaecati. Aperiam optio placeat dolore facere. Officiis pariatur eveniet atque et.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Enjoy downtime</h3>
          <p>Culpa dolorem voluptatem velit autem rerum qui et corrupti. Quibusdam quo placeat.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs"
}
</script>

<style scoped>
.container {
  font-family: sans-serif;
  color: #fff;
}

.bg-dark-blue {
  background-color: #0A2540;
}

.bg-dark-blue-light {
  background-color: #14263D;
}

.text-blue-500:hover {
  text-decoration: underline;
}
</style>
