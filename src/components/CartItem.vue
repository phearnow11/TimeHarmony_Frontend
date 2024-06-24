<template>
    <div class="container flex items-center justify-center">
      <div class="box" :class="{ 'checked': isSelected }" @click="toggleSelection">
        <label class="checkbox-container">
          <input type="checkbox" v-model="isSelected" @click.stop />
          <svg viewBox="0 0 64 64" height="1em">
            <path
              d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
              class="path"
            ></path>
          </svg>
        </label>
        <img class="watch-img" :src="item.image" />
        <div class="info">
          <strong class="product-name">{{ item.name }}</strong>
          <div class="retailer">
            <img class="avatar" :src="item.retailerAvatar" />
            <span class="username">{{ item.retailerName }}</span>
          </div>
          <div class="action-buttons">
            <div class="hover-underline-animation" @click.stop="removeFromCart">Remove this watch from cart</div>
          </div>
          <div class="price-details">
            <span class="price">{{ formatPrice(item.price) }} VND</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isSelected: this.selected
      };
    },
    watch: {
      selected(newValue) {
        this.isSelected = newValue;
      }
    },
    methods: {
      toggleSelection() {
        this.isSelected = !this.isSelected;
        this.$emit('selection-changed', this.isSelected);
      },
      removeFromCart() {
        this.$emit('remove-from-cart', this.item.id);
      },
      formatPrice(price) {
        return price.toLocaleString('vi-VN');
      }
    }
  };
  </script>

<style scoped>
.hover-underline-animation::after {
    color: var(--secondary);
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    display: block;
    margin: 0 auto;
    background: #ff402b;
    transition: width 0.4s ease-in-out;
    left: 50%;
    transform: translateX(-50%);
    bottom: -2px;
}

.hover-underline-animation:hover::after {
    color: red;
    width: 100%;
}

.hover-underline-animation:hover {
    color: red;
}

.container {
    color: white;
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    display: flex;
    justify-content: center;
    gap: 1em;
    flex-wrap: wrap;
}

.container .box {
    width: 80%;
    margin: 1em auto;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.074);
    border: 1px solid rgba(255, 255, 255, 0.222);
    backdrop-filter: blur(20px);
    transition: all ease 0.3s;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer; /* Add cursor pointer for clickable effect */
    overflow: hidden; /* Ensure overflow hidden to hide expanded border */
    box-sizing: border-box; /* Ensure padding doesn't increase width */
    border-left: 4px solid transparent; /* Initial transparent border */
}

.container .box.checked {
    border-left-color: var(--primary); /* Border color when checked */
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
    width: 10rem; /* Set a fixed width for the image */
    height: 10rem; /* Set a fixed height to make it square */
    object-fit: cover; /* Maintain aspect ratio and cover container */
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
