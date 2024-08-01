<template>
  <div class="max-w-4xl mx-auto my-5 p-4">
    <!-- Modal -->
    <div class="py-5">
      <span class="font-semibold" :style="{ color: stateColor }">{{
        checkState
      }}</span>
    </div>
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click.self="closeModal"
    >
      <div class="absolute inset-0 modal" @click="closeModal"></div>
      <div
        class="relative z-10 max-w-3xl max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <img
          :src="currentModalImage"
          :alt="watchStore.watch_data.name"
          class="max-w-full max-h-full object-contain"
        />

        <!-- Navigation arrows -->
        <button
          @click.stop="prevImage"
          class="bg-drop absolute left-2 top-1/2 transform -translate-y-1/2 text-secondary p-2"
        >
          &lt;
        </button>
        <button
          @click.stop="nextImage"
          class="bg-drop absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary p-2"
        >
          &gt;
        </button>

        <!-- Image counter -->
        <div
          class="bg-drop absolute bottom-4 left-1/2 transform -translate-x-1/2 text-primary px-2 py-1"
        >
          {{ currentImageIndex + 1 }} /
          {{ watchStore.watch_data.images.length }}
        </div>
      </div>
    </div>
    <!-- Product Display -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Image Gallery -->
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <!-- Main Image Display Container -->
        <div
          class="relative flex-grow w-full h-60 cursor-pointer"
          @click="openModal"
        >
          <img
            :src="currentImage"
            :alt="watchStore.watch_data.name"
            class="w-full h-full object-contain main-image"
          />
        </div>
        <!-- Thumbnails -->
        <div class="flex gap-2 overflow-x-auto mt-2">
          <img
            v-for="(imageUrl, index) in watchStore.watch_data.images"
            :key="index"
            :src="imageUrl"
            :alt="`Product Image ${index + 1}`"
            class="w-20 h-20 object-cover cursor-pointer thumbnail"
            @mouseenter="currentImage = imageUrl"
            :class="{ 'border-2 border-primary': currentImage === imageUrl }"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="w-full md:w-1/2">
        <div class="justify-between flex items-center">
          <h1 class="text-xl font-semibold mb-2">
            {{ watchStore.watch_data.name }}
          </h1>
          <i
            :class="[
              'fa-sharp cursor-pointer',
              isBookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark',
              'bookmark-icon',
              { active: isBookmarked },
            ]"
            @click="toggleBookmark"
            :style="{
              pointerEvents: isWatchAvailable ? 'auto' : 'none',
              opacity: isWatchAvailable ? 1 : 0.5,
            }"
          ></i>
        </div>
        <div class="mb-4">
          <span class="text-xl font-thin text-secondary">
            {{ formatPriceVND(watchStore.watch_data.price) }}</span
          >
        </div>

        <!-- Shipping, Quantity, etc. -->
        <div class="mb-4">
          <!-- Add shipping and quantity selectors here -->
        </div>
        <div class="flex gap-4">
          <button
            @click="addToCart"
            class="flex-1 th-p-btn py-2 px-4 relative"
            :disabled="!isWatchAvailable"
          >
            <span :class="{ 'opacity-0': isLoadingCart }">Thêm vào giỏ</span>
            <div v-if="isLoadingCart" class="loader-container">
              <div class="loader">
                <div class="loaderBar"></div>
              </div>
            </div>
          </button>
          <button
            
            @click="buyNow"
            class="flex-1 th-p-btn py-2 px-4 relative"
            :disabled="!isWatchAvailable"
          >
            <span :class="{ 'opacity-0': isLoading }">Mua Ngay</span>
            <div v-if="isLoading" class="loader-container">
              <div class="loader">
                <div class="loaderBar"></div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <PopUp
      :show="isPopupVisible"
      :product="currentProduct"
      :message="popupMessage"
      :showDetails="showProductDetails"
      @close="isPopupVisible = false"
    />

    <!-- Seller Info -->
    <div v-if="retailer" class="mt-8 border-t border-secondary pt-4">
      <div class="mb-5">
        <span class="font-semibold text-xl"> Thông tin người bán </span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img :src="retailer.image" alt="Seller" class="w-12 h-12 mr-4" />
          <div>
            <h2 class="font-semibold">{{ retailer.username }}</h2>
            <p class="text-gray-500 text-sm">{{ retailer.email }}</p>
            <p class="text-gray-500 text-sm">{{ retailer.phone }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <router-link
            :to="`/retailer/${retailer.user_id}`"
            class="th-p-btn py-2 px-4"
            >Chi tiết</router-link
          >
        </div>
      </div>
    </div>

    <div class="p-8 border-t border-secondary mt-6 max-w-4xl mx-auto">
      <section class="mb-8">
        <h1 class="text-2xl font-bold border-b border-secondary w-48 mb-4">
          Mô tả sản phẩm
        </h1>
        <div class="mb-5">
          <span>
            {{ watchStore.watch_data.description || "Không có thông tin" }}
          </span>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-xl font-bold border-b border-secondary w-40 mb-4">
            Chức năng
          </h2>
          <ul class="space-y-2">
            <li>
              <strong>Lịch:</strong>
              {{ watchStore.watch_data.calender || "Không có thông tin" }}
            </li>
            <li>
              <strong>Tính năng:</strong>
              {{ watchStore.watch_data.feature || "Không có thông tin" }}
            </li>
            <li>
              <strong>Bộ máy:</strong>
              {{ watchStore.watch_data.movement || "Không có thông tin" }}
            </li>
            <li>
              <strong>Chức năng:</strong>
              {{ watchStore.watch_data.function || "Không có thông tin" }}
            </li>
            <li>
              <strong>Động cơ:</strong>
              {{ watchStore.watch_data.engine || "Không có thông tin" }}
            </li>
            <li>
              <strong>Chống nước:</strong>
              {{ watchStore.watch_data.waterresistant || "Không có thông tin" }}
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl border-b border-secondary font-bold w-40 mb-4">
            Mặt số
          </h2>
          <ul class="space-y-2">
            <li>
              <strong>Loại mặt số:</strong>
              {{ watchStore.watch_data.dialtype || "Không có thông tin" }}
            </li>
            <li>
              <strong>Màu mặt số:</strong>
              {{ watchStore.watch_data.dialcolor || "Không có thông tin" }}
            </li>
            <li>
              <strong>Mặt kính:</strong>
              {{ watchStore.watch_data.crystal || "Không có thông tin" }}
            </li>
            <li>
              <strong>Vạch chỉ giây:</strong>
              {{ watchStore.watch_data.secondmaker || "Không có thông tin" }}
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl border-b border-secondary font-bold w-40 mb-4">
            Dây đeo
          </h2>
          <ul class="space-y-2">
            <li>
              <strong>Màu dây đeo:</strong>
              {{ watchStore.watch_data.bandcolor || "Không có thông tin" }}
            </li>
            <li>
              <strong>Loại dây đeo:</strong>
              {{ watchStore.watch_data.bandtype || "Không có thông tin" }}
            </li>
            <li>
              <strong>Khóa:</strong>
              {{ watchStore.watch_data.clasp || "Không có thông tin" }}
            </li>
            <li>
              <strong>Dây đeo kim loại:</strong>
              {{ watchStore.watch_data.bracelet || "Không có thông tin" }}
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-xl border-b border-secondary w-40 font-bold mb-4">
            Vỏ đồng hồ
          </h2>
          <ul class="space-y-2">
            <li>
              <strong>Vành đồng hồ:</strong>
              {{ watchStore.watch_data.bezel || "Không có thông tin" }}
            </li>
            <li>
              <strong>Chất liệu vành:</strong>
              {{ watchStore.watch_data.bezelmaterial || "Không có thông tin" }}
            </li>
            <li>
              <strong>Nắp lưng:</strong>
              {{ watchStore.watch_data.caseback || "Không có thông tin" }}
            </li>
            <li>
              <strong>Kích thước vỏ:</strong>
              {{ watchStore.watch_data.casedimension || "Không có thông tin" }}
            </li>
            <li>
              <strong>Hình dạng vỏ:</strong>
              {{ watchStore.watch_data.caseshape || "Không có thông tin" }}
            </li>
          </ul>
        </div>
      </section>

      <section class="mt-8">
        <h2 class="text-xl border-b border-secondary w-40 font-bold mb-4">
          Thông tin thêm
        </h2>
        <ul class="space-y-2">
          <li>
            <strong>Thương hiệu:</strong>
            {{ watchStore.watch_data.brand || "Không có thông tin" }}
          </li>
          <li>
            <strong>Dòng sản phẩm:</strong>
            {{ watchStore.watch_data.series || "Không có thông tin" }}
          </li>
          <li>
            <strong>Mẫu:</strong>
            {{ watchStore.watch_data.model || "Không có thông tin" }}
          </li>
          <li>
            <strong>Giới tính:</strong>
            {{ translate() || "Không có thông tin" }}
          </li>
          <li>
            <strong>Loại phong cách:</strong>
            {{ watchStore.watch_data.style || "Không có thông tin" }}
          </li>
          <li>
            <strong>Phân lớp:</strong>
            {{ watchStore.watch_data.subclass || "Không có thông tin" }}
          </li>
          <li>
            <strong>Nhãn sản xuất:</strong>
            {{ watchStore.watch_data.madelabel || "Không có thông tin" }}
          </li>
        </ul>
      </section>

      <section class="mt-10">
        <h2 class="text-xl border-b border-secondary font-bold w-56 mb-4">
          Chính sách và bảo hành
        </h2>
        <p>
          Chúng tôi là nền tảng phân phối đồng hồ cũ, kết nối những người có nhu
          cầu bán và mua đồng hồ. TimeHarmony cam kết cung cấp dịch vụ bảo hành
          cho mọi chiếc đồng hồ được bán trên trang web của chúng tôi, trong
          thời gian từ 1 đến 5 năm kể từ ngày mua hàng.
        </p>
        <br />
        <p>
          Chương trình bảo hành bao gồm sửa chữa các đồng hồ có các dấu hiệu bất
          thường như tăng/giảm thời gian quá mức hoặc không giữ thời gian chính
          xác. Tuy nhiên, không bảo hành cho các phần như vỏ đồng hồ, dây đeo,
          dây đeo kim loại, núm/cành gạt, mặt kính, lớp hoàn thiện và hư hỏng do
          sử dụng dưới điều kiện vượt quá giới hạn chống nước của nhà sản xuất.
        </p>
        <br />
        <p>
          Chúng tôi không chịu trách nhiệm với những thiệt hại gián tiếp hoặc
          ngẫu nhiên không được bảo hành trong chương trình này. Bảo hành sẽ bị
          vô hiệu nếu đồng hồ được bảo dưỡng bởi một bên thứ ba.
        </p>
        <br />
        <p>
          Xin lưu ý: Chúng tôi khuyến khích quý khách hàng liên hệ trực tiếp với
          chúng tôi để biết thêm chi tiết về chính sách bảo hành và các điều
          khoản liên quan trước khi mua sản phẩm.
        </p>
      </section>
      <section class="mt-10">
        <h2
          class="text-xl border-b border-secondary font-bold w-56 mb-4 cursor-pointer"
          @click="toggleSection('delivery')"
        >
          Giao Hàng & Hỗ trợ
          <i
            :class="{
              'fa-solid fa-chevron-up': activeSection === 'delivery',
              'fa-solid fa-chevron-down': activeSection !== 'delivery',
            }"
          ></i>
        </h2>
        <div v-show="activeSection === 'delivery'" class="mb-6">
          <h3 class="text-xl mb-2">
            Giao Hàng Tiêu Chuẩn (Dự kiến 1-3 Ngày) - Miễn Phí
          </h3>
          <p>
            Dịch vụ giao hàng bảo mật của chúng tôi hoạt động từ Thứ Hai đến Thứ
            Bảy, từ 8:00 sáng đến 6:00 tối. Vì lý do an ninh, mọi giao hàng đều
            yêu cầu chữ ký của người lớn; Time Harmony không giao hàng đến hộp
            thư P.O. hoặc dịch vụ chuyển tiếp của bên thứ ba. Để biết thêm thông
            tin về giao hàng, nhấp vào đây. Thông tin theo dõi có sẵn theo yêu
            cầu.
          </p>
          <div class="my-6">
            <h3 class="text-xl mb-2">Hỗ Trợ Khách Hàng</h3>
            <p>
              Nếu bạn có bất kỳ câu hỏi hoặc lo ngại nào liên quan đến đơn hàng
              của bạn, Đội Ngũ Time Harmony có thể được liên hệ qua số
              0782268826 (Sếp Thịnh):
            </p>
            <ul class="list-disc ml-5">
              <li>Thứ Hai - Thứ Bảy: 9:00 sáng – 7:00 tối</li>
              <li>Chủ Nhật: 9:00 sáng – 5:00 tối</li>
              <li>
                Đóng cửa vào Chủ Nhật Phục Sinh, Ngày Lễ Tạ Ơn và Ngày Giáng
                Sinh
              </li>
            </ul>
            <p>
              Ngoài ra, bạn có thể gửi email cho đội ngũ Time Harmony tại
              <a
                href="mailto:timeharmony.ecom@gmail.com"
                class="hover-underline-animation"
                >timeharmony.ecom@gmail.com</a
              >.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useWatchStore } from "../stores/watch";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import PopUp from "../components/PopUp.vue";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const watchStore = useWatchStore();
const userStore = useUserStore();
const router = useRouter();
const cartStore = useCartStore();
const watchId = route.params.watch_id;
const currentImage = ref("");
const isModalOpen = ref(false);
const isPopupVisible = ref(false);
const retailer = ref(null);
const isLoading = ref(false);
const isLoadingCart = ref(false);
const currentProduct = ref({});
const popupMessage = ref("");
const showProductDetails = ref(true);

const activeSection = ref(""); // Biến điều khiển phần nội dung hiển thị

const toggleSection = (section) => {
  activeSection.value = activeSection.value === section ? "" : section;
};

function translate() {
  if (watchStore.watch_data.gender === "Male") return "Nam";
  else if (watchStore.watch_data.gender === "Female") return "Nữ";
}

const formatPriceVND = (price) => {
  const formattedPrice = (price / 1).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formattedPrice;
};

const isBookmarked = ref(false);

const updateBookmarkStatus = async () => {
  try {
    const favorites = await userStore.getFavoritesFromServer(userStore.user_id);
    isBookmarked.value = favorites.some((fav) => fav.watch_id === watchId);
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
};

const toggleBookmark = (event) => {
  event.stopPropagation();
  event.preventDefault();

  if (!isWatchAvailable.value) return;

  if (!isBookmarked.value) {
    userStore.saveFavoritesToServer(useAuthStore().user_id, watchId);
  } else {
    userStore.deleteFavorite(useAuthStore().user_id, watchId);
  }

  isBookmarked.value = !isBookmarked.value;
};

async function addToCart() {
  if (!isWatchAvailable.value) return;

  console.log("WatchID: " + watchId);
  console.log("UserID: " + userStore.user_id);
  isLoadingCart.value = true;
  try {
    const response = await userStore.addToCart(userStore.user_id, watchId);
    console.log("Already in cart ", response);
    if (response === "Watch state changed!") {
      popupMessage.value = "Sản phẩm này đã tồn tại trong giỏ hàng";
      showProductDetails.value = false;
    } else if (response === "Cannot buy your own watch!") {
      popupMessage.value = "Không được mua đồng hồ của bản thân mình";
      showProductDetails.value = false;
    } else {
      currentProduct.value = {
        image: currentImage.value,
        name: watchStore.watch_data.name,
        price: watchStore.watch_data.price,
      };
      useUserStore().setCartNum(cartStore.cart_info.length);
      popupMessage.value = "Thêm vào giỏ thành công";
      showProductDetails.value = true;
    }
    isPopupVisible.value = true;
  } catch (error) {
    console.error("Error adding item to cart", error);
  } finally {
    isLoadingCart.value = false;
  }
}

async function buyNow() {
  if (!isWatchAvailable.value) return;

  isLoading.value = true;
  try {
    await userStore.addToCart(userStore.user_id, watchId);
    await cartStore.getCart(userStore.user_id);

    const addedItem = cartStore.cart_info.find(
      (item) => item.watch_id === watchId
    );

    if (addedItem) {
      cartStore.cart_info.forEach((item) => {
        cartStore.setItemSelected(item.watch_id, item.watch_id === watchId);
      });

      cartStore.setSelectedItems([addedItem]);
      cartStore.setTotalPrice(addedItem.price);

      console.log(addedItem.watch_id);

      cartStore.buyNowItem = addedItem.watch_id;
      cartStore.selected_wids.push(cartStore.buyNowItem);

      router.push("/cart");
    } else {
      throw new Error("Item not found in cart after adding");
    }
  } catch (error) {
    console.error("Error during buy now process", error);
    popupMessage.value = "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng";
    showProductDetails.value = false;
    isPopupVisible.value = true;
  } finally {
    isLoading.value = false;
  }
}

const isWatchAvailable = computed(() => {
  return watchStore.watch_data.state === 1 && useUserStore().role !=='ROLE_ADMIN' && useUserStore().role !=='ROLE_STAFF';
});

const checkState = computed(() => {
  if (watchStore.watch_data.state === 0) return "Đồng hồ chưa được duyệt";
  else if (watchStore.watch_data.state > 1 && watchStore.watch_data.state <= 6)
    return "Đồng hồ đã bị xoá";
  return "";
});

const stateColor = computed(() => {
  if (watchStore.watch_data.state === 0) return "gray";
  else if (watchStore.watch_data.state > 1 && watchStore.watch_data.state <= 6)
    return "red";
  return "";
});

onMounted(async () => {
  await updateBookmarkStatus();
  await watchStore.getDetailWatch(watchId);
  console.log("This is state: " + watchStore.watch_data.state);
  updateCurrentImage();
  if (watchStore.watch_data.seller && watchStore.watch_data.seller.member_id) {
    retailer.value = await userStore.getUserInfo(
      watchStore.watch_data.seller.member_id
    );
  }
});

watch(() => watchStore.watch_data.images, updateCurrentImage);

function updateCurrentImage() {
  if (watchStore.watch_data.images && watchStore.watch_data.images.length > 0) {
    currentImage.value = watchStore.watch_data.images[0];
  }
}

// Existing modal functions
const currentImageIndex = ref(0);
const currentModalImage = computed(
  () => watchStore.watch_data.images[currentImageIndex.value]
);

function openModal() {
  isModalOpen.value = true;
  currentImageIndex.value = watchStore.watch_data.images.indexOf(
    currentImage.value
  );
}

function closeModal() {
  isModalOpen.value = false;
}

function nextImage() {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % watchStore.watch_data.images.length;
}

function prevImage() {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + watchStore.watch_data.images.length) %
    watchStore.watch_data.images.length;
}
</script>


<style scoped>
.thumbnail {
  transition: border-color 0.2s;
}

.main-image {
  transition: transform 0.2s;
}

.modal {
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px); /* Apply a blur effect to the background */
}

.bg-drop {
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(50px); /* Apply a blur effect to the background */
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.state-gray {
  color: gray;
}
.state-red {
  color: red;
}

@media (min-width: 768px) {
  .thumbnail {
    width: 60px;
    height: 60px;
  }
}

.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background: rgba(23, 23, 23, 0.5);
}

.loader {
  width: 80px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 1px;
}

.loader .loaderBar {
  position: absolute;
  top: 0;
  right: 100%;
  bottom: 0;
  left: 0;
  background: var(--secondary);
  width: 0;
  animation: borealisBar 2s linear infinite;
}

.loader::after {
  content: "";
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 2px solid var(--secondary);
  left: 0;
  top: 0;
  animation: rotation 2s ease-in-out infinite alternate;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #333; /* Adjust color as needed */
  transition: transform 0.3s ease;
}

.arrow-up {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #333; /* Adjust color as needed */
  transition: transform 0.3s ease;
}

.arrow-down {
  transform: rotate(0deg);
}

.arrow-up {
  transform: rotate(180deg);
}

.bookmark-icon {
  font-size: 1.5em;
  color: var(--primary);
  transition: top 0.3s ease, color 0.3s ease;
}

.bookmark-icon.active {
  top: 10px;
  color: var(--primary);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
