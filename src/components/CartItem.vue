<template>
    <div class="container flex items-center justify-center">
        <div class="box">
            <img class="watch-img" src="https://alowatch.vn/wp-content/uploads/2021/04/moa10054.jpg" />
            <div class="info">
                <strong class="product-name">Đồng hồ Rolex siêhjgewhjghegjgjhjhgdsjagjshgda</strong>
                <div class="retailer">
                    <img class="avatar" src="https://files.catbox.moe/n1w3b0.png" /><span class="username">ThinhPhoenix</span>
                </div>
                <span class="price-tag">PRICE</span> <span class="price">12.000.000.000 VND</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
*{
    color: white;
}
.container {
    color: white;
    width: 100;
    margin: 0;
    padding: 0;
    position: relative;
    font-family: sans-serif;
    display: flex;
    justify-content: center;
    gap: 1em;
    flex-wrap: wrap;
}

.container .box:hover {
    color: white;
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}

.container .box {
    width: 80%;
    margin: 1em auto;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.074);
    border: 1px solid rgba(255, 255, 255, 0.222);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    transition: all ease 0.3s;
    display: flex;
    box-sizing: border-box;
}

.container .box .watch-img {
    width: 30%; /* Adjust the width of the image to make it smaller */
    height: auto;
    object-fit: cover;
    filter: grayscale(100%);
    transition: transform 0.3s ease, filter 0.3s ease;
    transform-origin: center;
}

.container .box .info {
    width: 70%; /* Adjust the width of the info section accordingly */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 0 1em; /* Added padding for spacing */
}


.container .box .watch-img {
    width: 12rem;
    height: auto;
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
    font-size: 1.2vw; /* Responsive font size */
}

.container .box div p {
    margin: 0;
    font-size: 1.2vw; /* Responsive font size */
    font-weight: 300;
    letter-spacing: 0.1em;
}

.container .box div span.price-tag {
    color: var(--secondary);
    font-size: 1vw; /* Responsive font size */
    font-weight: 500;
    margin-right: 0.2rem;
}

.container .box div span.price {
    color: whitesmoke;
    font-size: 1vw; /* Responsive font size */
    font-weight: 300;
}

.container .box .avatar {
    width: 2vw; /* Responsive size */
    height: 2vw; /* Responsive size */
    vertical-align: middle;
}

.container .box .username {
    vertical-align: middle;
    margin-left: 0.5vw; /* Responsive margin */
    font-size: 1vw; /* Responsive font size */
}

.retailer {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 2vw; /* Responsive margin */
}
.product-name{
    color: white;
}

@media screen and (max-width: 768px) {
    .container .box {
        width: calc(100% - 1em);
    }
    .container .box div strong.product-name {
        font-size: 3vw; /* Adjust font size for smaller screens */
    }
    .container .box div p {
        font-size: 3vw; /* Adjust font size for smaller screens */
    }
    .container .box div span.price-tag,
    .container .box div span.price {
        font-size: 2.5vw; /* Adjust font size for smaller screens */
    }
    .container .box .avatar {
        width: 5vw; /* Adjust size for smaller screens */
        height: 5vw; /* Adjust size for smaller screens */
    }
    .container .box .username {
        font-size: 2.5vw; /* Adjust font size for smaller screens */
        margin-left: 1vw; /* Adjust margin for smaller screens */
    }
    .retailer {
        margin-bottom: 5vw; /* Adjust margin for smaller screens */
    }
}
</style>