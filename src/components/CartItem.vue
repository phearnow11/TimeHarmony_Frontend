<template>
  <div :id="`cart-item-${watch_id}`" class="container">
    <div class="box" :class="{ 'checked': isSelected }" @click="toggleSelection">
      <label class="checkbox-container">
        <input type="checkbox" :checked="isSelected" @click.stop />
        <svg viewBox="0 0 64 64" height="1em">
          <path
            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
            class="path"
          ></path>
        </svg>
      </label>
      <img class="watch-img" :src="productImage" />
      <div class="info">
        <strong class="product-name">{{ productName }}</strong>
        <div class="retailer">
          <img class="avatar" :src="retailerAvatar" />
          <span class="username">{{ retailerName }}</span>
        </div>
        <div class="action-buttons">
          <div class="hover-underline-animation-r" @click.stop="removeFromCart">Xoá khỏi giỏ hàng</div>
        </div>
        <div class="price-details">
          <span class="price">{{ formatPrice(price) }} ₫</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    productName: {
      type: String,
      required: true
    },
    productImage: {
      type: String,
      required: true
    },
    retailerName: {
      type: String,
      required: true
    },
    retailerAvatar: {
      type: String,
      required: true
    },
    watch_id: { // Add this line
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle-select', 'delete-item'],
  methods: {
    toggleSelection() {
      this.$emit('toggle-select');
    },
    removeFromCart() {
      this.$emit('delete-item');
    },
    formatPrice(price) {
      return price.toLocaleString('vi-VN');
    }
  }
};
</script>

<style scoped>
.container {
    color: white;
    width: 100%;
    margin: 0;
    padding: 10;
    font-family: sans-serif;
    display: flex;
    justify-content: flex-start; /* Aligns the container to the left */
    margin-right: 7%;
    z-index: 10;
}

.container .box {
    width: 70%;
    margin: 1em 0;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.074);
    border: 1px solid rgba(255, 255, 255, 0.222);
    backdrop-filter: blur(20px);
    transition: all ease 0.3s;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
    border-left: 4px solid transparent;
}

.container .box.checked {
    border-left-color: var(--primary);
}

.container .box:hover {
    box-shadow: 0px 0px 20px 1px #ffbb763f;
    border: 1px solid rgba(255, 255, 255, 0.454);
}

.container .box .checkbox-container {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
}

.container .box .checkbox-container input {
    margin-right: 0.5rem;
}

.container .box .watch-img {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
}

.container .box:hover .watch-img {
    filter: none;
}

.container .box .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 1rem;
    flex-grow: 1;
}

.container .box .product-name {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    white-space: normal;
    word-break: break-word;
    hyphens: auto;
}

.container .box .retailer {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.container .box .retailer .avatar {
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--primary);
    margin-right: 0.5rem;
}

.container .box .retailer .username {
    font-size: 1rem;
}

.container .box .price-details {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    text-align: right;
}

.container .box .price-tag {
    font-size: 1rem;
    color: var(--secondary);
    margin-right: 0.5rem;
}

.container .box .price {
    font-size: 1rem;
    font-weight: bold;
    color: whitesmoke;
}

.container .box .action-buttons {
    display: flex;
    align-items: center;
}

@media screen and (max-width: 768px) {
    .container .box {
        width: calc(100% - 2em);
    }
    .container .box .product-name {
        font-size: 1rem;
    }
    .container .box .retailer .username,
    .container .box .price-tag,
    .container .box .price {
        font-size: 0.9rem;
    }
    .container .box .hover-underline-animation {
        font-size: 0.9rem;
    }
    .container .box .watch-img {
        width: 6rem;
        height: 6rem;
    }
    .container .box .price-details {
        bottom: 0.25rem;
        right: 0.25rem;
    }
}
</style>
