<template>
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="shadow-lg p-8 max-w-7xl w-full">
        <div class="mb-6">
            <router-link to="/" class="hover-underline-animation flex w-40 ">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            <span>Back to Shopping</span>
          </router-link>
        </div>
  
        <h1 class="text-3xl font-bold mb-4">Your order #50233 is confirmed</h1>
        <p class="mb-6 text-gray-600">You're on your way to furniture bliss! We are preparing your order now and will send an email once it is on its way to you.</p>
  
        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex-1">
            <div class="bg-sage-200 p-4 mb-6">
              <div class="flex items-start">
                <img src="https://placehold.co/100x100" alt="Chair" class="w-24 h-24 object-cover rounded mr-4" />
                <div>
                  <h3 class="font-bold">Eames Aluminum Group Management Chair</h3>
                  <p class="text-xl font-bold mb-2">$3375 CAD</p>
                  <p class="text-sm text-gray-600">Qty: 1</p>
                  <p class="text-sm text-gray-600">Colour: Black</p>
                  <p class="text-sm text-gray-600">Cover: Leather</p>
                  <p class="text-sm text-gray-600">Frame: Aluminium</p>
                  <p class="text-sm text-gray-600">Caster: Hardwood</p>
                </div>
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 class="font-bold mb-2">Shipping Address</h3>
                <p>Andrea Martin</p>
                <p>54 Ambrosia Ln</p>
                <p>Toronto, ON</p>
              </div>
              <div>
                <h3 class="font-bold mb-2">Billing Address</h3>
                <p>Andrea Martin</p>
                <p>54 Ambrosia Ln</p>
                <p>Toronto, ON</p>
              </div>
            </div>
  
            <button class="bg-olive-700 text-white px-6 py-2 rounded hover:bg-olive-800 transition duration-300">
              TRACK ORDER STATUS
            </button>
  
            <p class="mt-4 text-sm text-gray-600">
              Pressed order too soon? <a href="#" class="underline">Contact us here</a> for help with ongoing orders
            </p>
          </div>
  
          <div class="flex-1">
            <div class="bg-white p-6 shadow">
              <h2 class="text-xl font-bold mb-4">Payment Summary</h2>
              <div class="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>CAD $340</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Taxes</span>
                <span>CAD 44.20</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>CAD 388.20</span>
              </div>
  
              <div class="mt-6">
                <h3 class="font-bold mb-2">Payment Method:</h3>
                <div class="flex items-center">
                  <img src="https://placehold.co/40x24" alt="Visa" class="mr-2" />
                  <span>4514 **** **** 1234</span>
                </div>
                <p class="text-sm text-gray-600">Liana Evans</p>
              </div>
  
              <div class="mt-6">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Transaction Date</span>
                  <span>28/12/23</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Transaction ID</span>
                  <span>xxxxxx</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrderConfirmation',
  }
  </script>
  
  <style>
  /* You might need to add these custom colors to your Tailwind config */
  .bg-olive-700 { background-color: #4D5645; }
  .bg-cream-100 { background-color: #F5F5F0; }
  .bg-sage-200 { background-color: #E0E5D9; }
  </style>