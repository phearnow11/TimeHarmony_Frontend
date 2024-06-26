<template>
  <div class="flex justify-center items-center flex-col">
    <section class="w-3/4 p-4">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold">Watch Cart</span>
      </div>
    </section>
    <section class="w-3/4 mb-4 p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button @click="toggleAllProducts" class="flex items-center cursor-pointer">
            <input type="checkbox" :checked="allProductsSelected" class="mr-2">
            <span>Select All ({{ cartItems.length }})</span>
          </button>
          <button @click="deleteSelected" class="hover-underline-animation-r">Delete all</button>
          <button class="hover-underline-animation">Move to My Likes</button>
        </div>
        <div class="flex items-center space-x-4">
          <span class="font-semibold">
            Total ({{ selectedItems.length }} item{{ selectedItems.length !== 1 ? 's' : '' }}): 
            <span class="text-secondary font-thin">₫{{ totalPrice.toLocaleString('vi-VN') }}</span>
          </span>
          <router-link to="/order" class="th-p-btn">
            Check Out
          </router-link>
        </div>
      </div>
    </section>
    <cart-item
      v-for="item in cartItems"
      :key="item.id"
      :item="item"
      :selected="allProductsSelected"
      @selection-changed="updateItemSelection(item.id, $event)"
      @remove-from-cart="removeFromCart"
    />
  </div>
</template>

<script>
import CartItem from '../components/CartItem.vue'

export default {
  components: { CartItem },
  data() {
    return {
      allProductsSelected: false,
      cartItems: [
        { id: 1, name: 'Đồng hồ Rolex', price: 12000000000, quantity: 1, image: 'https://alowatch.vn/wp-content/uploads/2021/04/moa10054.jpg', retailerAvatar: 'https://files.catbox.moe/n1w3b0.png', retailerName: 'ThinhPhoenix' },
        // Add more items as needed
      ]
    }
  },
  computed: {
    selectedItems() {
      return this.cartItems.filter(item => item.selected);
    },
    totalPrice() {
      return this.selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    cartCount() {
      return this.cartItems.length;
    }
  },
  methods: {
    toggleAllProducts() {
      this.allProductsSelected = !this.allProductsSelected;
      this.cartItems.forEach(item => item.selected = this.allProductsSelected);
    },
    updateItemSelection(itemId, isSelected) {
      const item = this.cartItems.find(item => item.id === itemId);
      if (item) {
        item.selected = isSelected;
      }
      this.updateAllProductsSelected();
    },
    updateAllProductsSelected() {
      this.allProductsSelected = this.cartItems.every(item => item.selected);
    },
    deleteSelected() {
      this.cartItems = this.cartItems.filter(item => !item.selected);
      this.allProductsSelected = false;
    },
    removeFromCart(itemId) {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.updateAllProductsSelected();
    },
    checkOut() {
      // Implement check out functionality here
      console.log('Proceeding to checkout with selected items:', this.selectedItems);
    }
  }
}
</script>

<style scoped>

</style>
