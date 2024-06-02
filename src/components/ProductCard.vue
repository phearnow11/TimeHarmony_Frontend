<template>
  <div class="container">
    <div class="box">
        <img class="watch-img" src="https://alowatch.vn/wp-content/uploads/2021/04/moa10054.jpg"/>
        <div>
        <strong class="product-name">Đồng hồ Rolex siêu đẹp còn mới new 98%</strong>
        <div class="retailer">
            <img class="avatar" src="https://files.catbox.moe/n1w3b0.png"/><span class="username">ThinhPhoenix</span>
        </div>
        <span class="price-tag">PRICE</span> <span>12.000.000.000 VND</span>
        </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 5em;
  position: relative;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em; /* Add spacing between cards */
  flex-wrap: wrap; /* Allow cards to wrap */
}
.container::before,
.container::after {
  background-color: #fab5704c;
  position: absolute;
}
.container::before {
  width: 6rem;
  top: 30%;
  right: 7%;
}

.container .box {
  width: calc((90% - 0.5em) - 0.5em); /* Half of the container width minus the gap */
  max-width: 12.5em; /* Maximum width for the card */
  height: 20em; /* Fixed height to ensure uniform size */
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.074);
  border: 1px solid rgba(255, 255, 255, 0.222);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  transition: all ease 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
}
.container .box:hover {
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
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
.container .box div strong.product-name {
  display: block;
  margin-bottom: 0.5rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  white-space: normal;
  word-break: break-word;
  hyphens: auto;
}
.container .box div p {
  margin: 0;
  font-size: 0.9em;
  font-weight: 300;
  letter-spacing: 0.1em;
}
.container .box div span {
  color: whitesmoke;
  font-size: 0.7rem;
  font-weight: 300;
}
.container .box div span:nth-child(3) {
  color: var(--secondary);
  font-weight: 500;
  margin-right: 0.2rem;
}
.container .box .avatar {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.container .box .username {
  vertical-align: middle;
  margin-left: 5px;
}
.retailer {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 20px;
}

/* Media query for smaller screens */
@media screen and (max-width: 768px) {
  .container .box {
    width: calc(100% - 1em); /* Full width with spacing */
  }
}
</style>
