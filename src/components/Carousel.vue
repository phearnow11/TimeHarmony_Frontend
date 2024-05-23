<template>
  <!-- Slider -->
<div data-hs-carousel='{
    "loadingClasses": "opacity-0",
    "isAutoPlay": true
  }' class="relative">
  <div class="hs-carousel relative overflow-hidden w-full min-h-96 bg-white">
    <div class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
      <div class="hs-carousel-slide">
        <div class="flex justify-center h-full bg-gray-100 p-6 dark:bg-neutral-900">
          <span class="self-center text-4xl text-yellow-   transition duration-700 dark:text-white">Time Harmony</span>
        </div>
      </div>
      <div class="hs-carousel-slide">
        <div class="flex justify-center h-full bg-gray-200 p-6 dark:bg-neutral-800">
          <span class="self-center text-4xl text-gray-800 transition duration-700 dark:text-white">Best Viet Nam Shop</span>
        </div>
      </div>
      <div class="hs-carousel-slide">
        <div class="flex justify-center h-full bg-gray-300 p-6 dark:bg-neutral-700">
          <span class="self-center text-4xl text-gray-800 transition duration-700 dark:text-white">Your best place for buying and selling watch</span>
        </div>
      </div>
    </div>
  </div>

  <button type="button" class="hs-carousel-prev hs-carousel:disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 start-0 inline-flex justify-center items-center w-[46px] h-full text-gray-800 hover:bg-gray-800/10 rounded-s-lg dark:text-white dark:hover:bg-white/10">
    <span class="text-2xl" aria-hidden="true">
      <svg class="flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m15 18-6-6 6-6"></path>
      </svg>
    </span>
    <span class="sr-only">Previous</span>
  </button>
  <button type="button" class="hs-carousel-next hs-carousel:disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 end-0 inline-flex justify-center items-center w-[46px] h-full text-gray-800 hover:bg-gray-800/10 rounded-e-lg dark:text-white dark:hover:bg-white/10">
    <span class="sr-only">Next</span>
    <span class="text-2xl" aria-hidden="true">
      <svg class="flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </span>
  </button>

  <div class="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 space-x-2">
  <span class="hs-carousel-active:bg-yellow-400  hs-carousel-active:border-yellow-400 rectangle-pagination border border-yellow-400 cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-yellow-400 dark:hs-carousel-active:border-yellow-400"></span>
  <span class="hs-carousel-active:bg-yellow-400  hs-carousel-active:border-yellow-400 rectangle-pagination border border-yellow-400 cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-yellow-400 dark:hs-carousel-active:border-yellow-400"></span>
  <span class="hs-carousel-active:bg-yellow-400  hs-carousel-active:border-yellow-400 rectangle-pagination border border-yellow-400 cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-yellow-400 dark:hs-carousel-active:border-yellow-400"></span>
</div>
</div>
<!-- End Slider -->
</template>

<script>
export default {

}
</script>

<style>

</style>