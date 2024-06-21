<template>
  <router-link :to="link" class="container mt-12">
    <div class="box" :class="{ bookmarked: isBookmarked }">
      <div class="image-container">
        <img class="watch-img" :src="productImage" />
        <i
          :class="['fa-sharp', isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark', 'bookmark-icon', { 'active': isBookmarked }]"
          @click="toggleBookmark"
        ></i>
        <div class="gradient-overlay"></div>
      </div>
      <div>
        <strong class="product-name">{{ productName }}</strong>
        <div class="retailer">
          <img class="avatar" :src="retailerAvatar" />
          <router-link :to="seller_id">
            <span class="username hover-underline-animation">{{ retailerName }}</span>
          </router-link>
        </div>
        <span class="price-tag">PRICE</span> <span class="price">{{ price }} VND</span>
      </div>
    </div>
  </router-link>
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
    price: {
      type: Number,
      required: true
    },
    link:{
      type: String,
      required: true
    }
    ,seller_id:{
      type: String,
      required: true
    }

  },
  data() {
    return {
      isBookmarked: false
    };
  },
  methods: {
    toggleBookmark(event) {
      event.stopPropagation();
      event.preventDefault();
      this.isBookmarked = !this.isBookmarked;
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
}

.container .box {
  max-width: 22em;
  width: 100%;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.074);
  border: 1px solid rgba(255, 255, 255, 0.222);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  transition: ease-in-out 0.1s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
}

.container .box.bookmarked {
  border: 3px solid var(--primary);
}

.container .box:hover {
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}

.image-container {
  position: relative;
}

.container .box .watch-img {
  width: 100%;
  height: auto;
  min-width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  filter: grayscale(100%);
  transition: transform 0.3s ease, filter 0.3s ease;
  transform-origin: center;
}

.container .box:hover img {
  filter: none;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.512) 15%, transparent);
  pointer-events: none;
  z-index: 1;
}

.bookmark-icon {
  position: absolute;
  top: -40px;
  right: 10px;
  font-size: 1.5em;
  color: var(--primary);
  transition: top 0.3s ease, color 0.3s ease;
  z-index: 2;
}

.bookmark-icon.active {
  top: 10px;
  color: var(--primary);
}

.container .box:hover .bookmark-icon {
  top: 10px;
}

.container .box div strong.product-name {
  margin-top: 4px;
  color: white;
  display: block;
  margin-bottom: 0.5rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-break: break-word;
  hyphens: auto;
  font-size: 1.2vw;
}

.container .box div p {
  margin: 0;
  font-size: 1.2vw;
  font-weight: 300;
  letter-spacing: 0.1em;
}

.container .box div span.price-tag {
  color: var(--secondary);
  font-size: 1vw;
  font-weight: 500;
  margin-right: 0.2rem;
}

.container .box div span.price {
  color: whitesmoke;
  font-size: 1vw;
  font-weight: bold;
}

.container .box .avatar {
  width: 2vw;
  height: 2vw;
  vertical-align: middle;
  border: 1px solid var(--primary);
}

.container .box .username {
  vertical-align: middle;
  margin-left: 0.5vw;
  font-size: 1vw;
}

.retailer {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 2vw;
}

@media screen and (max-width: 768px) {
  .container .box div strong.product-name {
    font-size: 4vw;
  }

  .container .box div p {
    font-size: 4vw;
  }

  .container .box div span.price-tag,
  .container .box div span.price {
    font-size: 3.5vw;
  }

  .container .box .avatar {
    width: 6vw;
    height: 6vw;
  }

  .container .box .username {
    font-size: 3.5vw;
    margin-left: 1vw;
  }

  .retailer {
    margin-bottom: 3vw;
  }
}
</style>