<template>
  <span
    @click="useAuthStore().logout()"
    class="ml-24 hover-underline-animation cursor-pointer"
  >
    <i class="fa fa-sign-out"></i> Đăng xuất
  </span>
  <div class="mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-primary">
        Kiểm duyệt và thẩm định đồng hồ
      </h1>
    </div>
    <div>
      <div class="ui-input-container col-span-3 mb-5">
        <input
          required
          placeholder="Tìm kiếm id sản phẩm"
          class="ui-input"
          type="text"
          v-model="id"
          @keyup="search"
        />
        <div class="ui-input-underline"></div>
        <div class="ui-input-highlight"></div>
        <div class="ui-input-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-width="2"
              stroke="currentColor"
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div
      :class="{
        'flex align-middle justify-center space-x-4': viewMode === 'kanban',
      }"
    >
      <div
        v-for="column in filteredColumns"
        :key="column.name"
        :class="[
          viewMode === 'kanban' ? 'w-1/3' : 'mb-4',
          'frame flex flex-col',
        ]"
      >
        <h2 class="font-bold text-lg mb-4">
          <i :class="['material-icons', column.iconColor]">{{ column.icon }}</i>
          {{ column.name }}
        </h2>
                <draggable
          v-model="column.tasks"
          :group="'tasks'"
          item-key="request_id"
          @end="onDragEnd"
          :class="[
            'flex-grow min-h-[200px] p-2 bg-[#343432]',
            { 'list-none': viewMode === 'kanban' },
          ]"
        >

            <template #item="{ element }">
            <div class="bg-[#1b1b1b] p-4 shadow-md cursor-move mb-2 box">
              <h3 class="text-primary font-bold text-md">
                Mã yêu cầu: {{ element.request_id }}
              </h3>
              <p class="text-sm text-[whitesmoke]">ID Đồng hồ: {{ element.watch_id }}</p>
              
              <p class="text-sm text-[whitesmoke]">
                Ghi chú: {{ element.note }}
              </p>
              <p class="text-xs text-[whitesmoke] mt-2 mb-2">
                Thời gian hẹn: {{ element.dueDate }}
              </p>
              <p class="text-xs text-[whitesmoke] mt-2 mb-2">
                Ngày tạo: {{ element.createdAt }}
              </p>
              <p class="text-xs text-[whitesmoke] mt-2 mb-2">
                Trạng thái: {{ element.status }}
              </p>
              <router-link
                :to="`/detail/${element.watch_id}`"
                class="mt-2 hover-underline-animation"
              >Xem chi tiết</router-link>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Approval Confirmation Modal -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 z-50 flex items-center justify-center back bg-opacity-50"
    >
      <div
        class="bg-[#1b1b1b] p-6 shadow-lg w-full max-w-3xl my-8 max-h-[80vh] overflow-y-auto"
      >
        <h2 class="text-lg font-semibold mb-4">
          Xác nhận Duyệt <br />{{ draggedItem.watch_id }}
        </h2>
        <span>ID: {{ draggedItem.request_id }}</span>
        <div class="form-content mb-6">
          <div class="form__group field w-full">
            <input
              v-model="watchData.price"
              type="number"
              class="form__field text-2xl"
              placeholder="Price"
              @input="validatePrice"
            />
            <label for="price" class="form__label text-xl">Giá</label>
          </div>
          <p v-if="priceWarning" class="text-red-500 mt-2">
            {{ priceWarning }}
          </p>
        </div>
        <div class="form-content mb-6">
          <div class="form__group field w-full">
            <textarea
              v-model="watchData.description"
              class="form__field form__field-description"
              placeholder="Description"
              id="description"
              rows="4"
              @input="adjustHeight"
              ref="textarea"
              :style="{ height: textareaHeight + 'px' }"
              @focus="isFocused = true"
              @blur="isFocused = false"
            ></textarea>
            <label
              for="description"
              class="desclabel"
              :class="{ active: isFocused }"
              >Mô tả</label
            >
          </div>
          <div class="mydict">
            <div class="form">
              <label class="mb-3 text-[#9b9b9b]">Giới tính</label>
              <div class="select pb-4 gender-select">
                <label>
                  <input
                    type="radio"
                    name="radio"
                    checked
                    @click="unisexGender"
                    id="defaut-gender"
                    value="Unisex"
                  />
                  <span class="select-op">Phi giới</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    @click="maleGender"
                    value="Male"
                  />
                  <span class="select-op">Nam</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="radio"
                    @click="femaleGender"
                    value="Female"
                  />
                  <span class="select-op">Nữ</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-6 overflow-y-auto">
          <!-- Left Column -->
          <div class="w-full">
            <h3 class="text-xl mb-4">Tính năng</h3>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input type="text" class="form__field" placeholder="Lịch" 
                v-model="watchData.calender"/>
                <label class="form__label">Lịch</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.feature"
                />
                <label class="form__label">Tính năng</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.movement"
                />
                <label class="form__label">Hoạt động</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.function"
                />
                <label class="form__label">Chức năng</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.engine"
                />
                <label class="form__label">Động cơ</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.water_resistant"
                />
                <label class="form__label">Kháng nước</label>
              </div>
            </div>
            <!-- Add more fields for the left column -->

            <!-- Right Column -->
            <h3 class="text-xl mb-4">Quay số</h3>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Thương hiệu"
                  v-model="watchData.dial_type"
                />
                <label class="form__label">Loại quay số</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input type="text" class="form__field" placeholder="Series" 
                v-model="watchData.dial_color"/>
                <label class="form__label">Màu sắc</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.crystal"
                />
                <label class="form__label">Pha lê</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.second_makers"
                />
                <label class="form__label">Nhà sản xuất thứ hai</label>
              </div>
            </div>
            <!-- Add more fields for the right column -->
            <h3 class="text-xl mb-4">Dây đeo</h3>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.band_color"
                />
                <label class="form__label">Màu sắc</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.band_type"
                />
                <label class="form__label">Loại dây</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.clasp"
                />
                <label class="form__label">Móc cài</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.bracelet"
                />
                <label class="form__label">Vòng đeo</label>
              </div>
            </div>
            <h3 class="text-xl mb-4">Vỏ</h3>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.bezel"
                />
                <label class="form__label">Khung viền</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.bezel_material"
                />
                <label class="form__label">Chất liệu khung viền</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.case_back"
                />
                <label class="form__label">Mặt sau</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.casedimension"
                />
                <label class="form__label">Kích thước</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.case_shape"
                />
                <label class="form__label">Hình dạng vỏ</label>
              </div>
            </div>
            <h3 class="text-xl mb-4">Thuộc tính</h3>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.brand"
                />
                <label class="form__label">Thương hiệu</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.series"
                />
                <label class="form__label">Dòng sản phẩm</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.model"
                />
                <label class="form__label">Mẫu</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.style_type"
                />
                <label class="form__label">Phong cách</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.sub_class"
                />
                <label class="form__label">Lớp phụ</label>
              </div>
            </div>
            <div class="form-content mb-4">
              <div class="form__group field">
                <input
                  type="text"
                  class="form__field"
                  placeholder="Tính năng"
                  v-model="watchData.made_label"
                />
                <label class="form__label">Nhãn thực hiện</label>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="handleCancel('approve')"
            class="border-2 px-2 py-2 border-secondary"
          >
            Huỷ
          </button>
          <button
            @click="handleConfirm('approve')"
            class="btn"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Unapprove Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center back bg-opacity-50"
    >
      <div class="bg-[#1b1b1b] p-6 shadow-lg max-w-md w-full">
        <h2 class="text-lg font-semibold mb-4">Xác nhận Từ chối</h2>
        <p class="mb-4">Bạn có muốn từ chối duyệt đồng hồ này không?</p>

        <form @submit.prevent="handleConfirm('unapprove')">
          <div class="mb-4">
            <label
              for="reportContent"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Lý do từ chối:</label
            >
            <textarea
              id="reportContent"
              v-model="reportContent"
              rows="4"
              class="w-full px-3 py-2 text-gray-200 bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            ></textarea>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="handleCancel('unapprove')"
              class="border-2 px-4 py-2 border-secondary"
            >
              Huỷ
            </button>
            <button type="submit" class="btn">Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from "vue";
import draggable from "vuedraggable";
import { useStaffStore } from "../stores/staff";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import router from "../router";
import { useChatStore } from "../stores/chat";
import axios from "axios";
import { useMailStore } from "../stores/mail";

if (useUserStore().role != "ROLE_STAFF") {
  console.log("Not STAFF");
  router.push("/");
}



const id = ref("");
const authStore = useAuthStore();
const viewMode = ref("kanban");
const columns = ref([
  {
    name: "Chưa duyệt",
    tasks: [],
    columnName: "Chưa duyệt",
  },
  {
    name: "Đã được duyệt",
    tasks: [],
    columnName: "Đã được duyệt",
  },
  {
    name: "Không chấp thuận",
    tasks: [],
    columnName: "Không chấp thuận",
  },
]);
const priceWarning = ref("");
const staffStore = useStaffStore();
const showApproveModal = ref(false);
const showDeleteModal = ref(false);
const targetColumnName = ref("");
const draggedItemId = ref(null);
const reportContent = ref("");
const draggedItem = ref(null);
const watchSellerMap = ref(new Map());

const textareaHeight = ref("80"); // Initial height of textarea
const isFocused = ref(false); // Flag to track textarea focus state

const allWatches = computed(() => [
  ...columns.value[0].tasks,
  ...columns.value[1].tasks,
  ...columns.value[2].tasks,
]);

const watchData = reactive({
  name: "",
  price: "",
  description: "",
  brand: "",
  series: "",
  model: "",
  gender: "Unisex",
  style_type: "",
  sub_class: "",
  made_label: "",
  calender: "",
  feature: "",
  movement: "",
  function: "",
  engine: "",
  water_resistant: "",
  band_color: "",
  band_type: "",
  clasp: "",
  bracelet: "",
  dial_type: "",
  dial_color: "",
  crystal: "",
  second_makers: "",
  bezel: "",
  bezel_material: "",
  case_back: "",
  casedimension: "",
  case_shape: "",
});

const clear = () => {
  (watchData.name = ""),
    (watchData.price = ""),
    (watchData.description = ""),
    (watchData.brand = ""),
    (watchData.series = ""),
    (watchData.model = ""),
    (watchData.gender = ""),
    (watchData.style_type = ""),
    (watchData.sub_class = ""),
    (watchData.made_label = ""),
    (watchData.calender = ""),
    (watchData.feature = ""),
    (watchData.movement = ""),
    (watchData.function = ""),
    (watchData.engine = ""),
    (watchData.water_resistant = ""),
    (watchData.band_color = ""),
    (watchData.band_type = ""),
    (watchData.clasp = ""),
    (watchData.bracelet = ""),
    (watchData.dial_type = ""),
    (watchData.dial_color = ""),
    (watchData.crystal = ""),
    (watchData.second_makers = ""),
    (watchData.bezel = ""),
    (watchData.bezel_material = ""),
    (watchData.case_back = ""),
    (watchData.casedimension = ""),
    (watchData.case_shape = "");
};

const unisexGender = () => {
  watchData.gender = "Unisex";
};

const maleGender = () => {
  watchData.gender = "Male";
};

const femaleGender = () => {
  watchData.gender = "Female";
};

const validatePrice = () => {
  const price = Number(watchData.price);
  if (price < 100000) {
    priceWarning.value = "Giá phải lớn hơn hoặc bằng 100.000 VND";
  } else if (price > 1000000000) {
    priceWarning.value = "Giá phải nhỏ hơn hoặc bằng 1 tỷ VND";
  } else {
    priceWarning.value = "";
  }
};

const isFormValid = computed(() => {
  return (
    watchData.price.trim() !== "" &&
    watchData.description.trim() !== "" &&
    isPriceValid.value
  );
});

watch(
  () => showApproveModal.value,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

const search = () => {
  const searchTerm = id.value.toLowerCase().trim();
  columns.value.forEach((column) => {
    if (searchTerm === "") {
      // If search is empty, restore original tasks
      if (column.name === "Chưa duyệt" && staffStore.unapprovedWatches)
        column.tasks = staffStore.unapprovedWatches.map(mapWatchToTask);
      if (column.name === "Đã được duyệt" && staffStore.approvedWatches)
        column.tasks = staffStore.approvedWatches.map(mapWatchToTask);
      if (column.name === "Không chấp thuận" && staffStore.deleteWatches)
        column.tasks = staffStore.deleteWatches.map(mapWatchToTask);
    } else {
      // Filter tasks based on search term
      column.tasks = column.tasks.filter(
        (task) =>
          task.watch_id.toString().toLowerCase().includes(searchTerm) ||
          task.request_id.toString().toLowerCase().includes(searchTerm) ||
          task.status.toLowerCase().includes(searchTerm)
      );
    }
  });
};

// Helper function to map watch data to task object
const mapWatchToTask = (watch) => ({
  watch_id: watch.watch_id,
  request_id: watch.request_id,
  note: watch.note,
  dueDate: new Date(watch.appointment_date).toLocaleDateString(),
  createdAt: new Date(watch.created_at).toLocaleDateString(),
  status: watch.status
});

watch(id, () => {
  search();
});

const filteredColumns = computed(() => {
  if (!id.value.trim()) return columns.value;

  return columns.value.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) =>
      task.id.toString().toLowerCase().includes(id.value.toLowerCase())
    ),
  }));
});

onMounted(async () => {
  const aid = authStore.user_id
  await staffStore.getRequestFromAdmin(aid);
  
  if (staffStore.unapprovedWatches) {
    staffStore.unapprovedWatches.forEach((watch) => {
      if (watch.seller && watch.seller.member_id) {
        watchSellerMap.value.set(watch.watch_id, watch.seller.member_id);
        console.log(
          "Seller Member ID of Unapprove Watch: " + watch.seller.member_id
        );
      } else {
        console.log(
          "Seller Member ID not available for watch: " + watch.watch_id
        );
      }
    });
  }

  refreshColumns();
  search();

  console.log("Pending Watches:", JSON.stringify(pendingWatches, null, 2));
  columns.value[0].tasks = staffStore.unapprovedWatches.map((watch) => ({
    watch_id: watch.watch_id,
    request_id: watch.request_id,
    note: watch.note,
    dueDate: new Date(watch.appointment_date).toLocaleDateString(),
    createdAt: new Date(watch.created_at).toLocaleDateString(),
    status: watch.status
  }));
  columns.value[1].tasks = staffStore.approvedWatches.map((watch) => ({
    watch_id: watch.watch_id,
    request_id: watch.request_id,
    note: watch.note,
    dueDate: new Date(watch.appointment_date).toLocaleDateString(),
    createdAt: new Date(watch.created_at).toLocaleDateString(),
    status: watch.status
  }));
  columns.value[2].tasks = staffStore.deleteWatches.map((watch) => ({
    watch_id: watch.watch_id,
    request_id: watch.request_id,
    note: watch.note,
    dueDate: new Date(watch.appointment_date).toLocaleDateString(),
    createdAt: new Date(watch.created_at).toLocaleDateString(),
    status: watch.status
  }));
});

const onDragEnd = (event) => {
  if (event.to) {
    targetColumnName.value = event.to.parentElement
      .querySelector("h2")
      .textContent.trim();
    draggedItemId.value = event.item.__draggable_context.element.request_id; // Get the watch_id from the dragged element

    draggedItem.value = columns.value
      .flatMap((col) => col.tasks)
      .find((task) => task.request_id === draggedItemId.value);

    if (draggedItem.value) {
      if (targetColumnName.value === "Đã được duyệt") {
        showApproveModal.value = true;
      } else if (targetColumnName.value === "Không chấp thuận") {
        showDeleteModal.value = true;
        reportContent.value = "";
      } else if (targetColumnName.value === "Chưa duyệt") {
        staffStore.getRequestFromAdmin(authStore.user_id);
        refreshColumns();
      }
    } else {
      console.error("Không tìm thấy item được kéo");
    }
  }
};

const handleConfirm = async (type) => {
  if (type === "approve") {
    console.log(`ready to update ${draggedItemId.value}`);
    submit()
    await staffStore.approveWatch(draggedItem.value.watch_id);
    showApproveModal.value = false;
  } else if (type === "unapprove") {
    if (!reportContent.value.trim()) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }
    let sellerId = watchSellerMap.value.get(draggedItemId.value);
    if (!sellerId) {
      const watch =
        staffStore.unapprovedWatches.find(
          (w) => w.watch_id === draggedItemId.value
        ) ||
        staffStore.approvedWatches.find(
          (w) => w.watch_id === draggedItemId.value
        ) ||
        staffStore.deleteWatches.find(
          (w) => w.watch_id === draggedItemId.value
        );
      if (watch && watch.seller && watch.seller.member_id) {
        sellerId = watch.seller.member_id;
        watchSellerMap.value.set(draggedItemId.value, sellerId);
      }
    }
    const data = {
      watch_id: draggedItemId.value,
      type: 1, // For APPRAISER_REPORT
      content: reportContent.value,
      from: authStore.user_id,
      to: sellerId,
    };

    if (sellerId) {
      console.log(data);
      await useStaffStore().notapproveWatch(data);
      var seller = await useUserStore().getUserInfo(sellerId);
      console.log("BBBBBB", seller);
      axios.post(
        `${
          import.meta.env.VITE_API_PORT
        }/chat/addtochat?user_id=${sellerId}&user_id2=${useUserStore().user_id}`
      );
      useChatStore().sendMessage(
        sellerId,
        `Đây là tin nhắn tự động gửi bởi nhân viên Time Harmony\nBài đăng đồng hồ: ${draggedItem.value.title} của bạn đã bị từ chối, vui lòng tạo bài đăng khác theo đề xuất của người kiểm duyệt(Lý do từ chối)\nLý do từ chối: ${reportContent.value}`
      );
      useMailStore().send(
        seller?.email,
        `Rất tiếc bài đăng của bạn không được chúng tôi chấp thuận`,
        `Đây là tin nhắn tự động gửi bởi nhân viên Time Harmony\nBài đăng đồng hồ: ${draggedItem.value.title} của bạn đã bị từ chối, vui lòng tạo bài đăng khác theo đề xuất của người kiểm duyệt(Lý do từ chối)\nLý do từ chối: ${reportContent.value}`
      );
    } else {
      console.error("Seller ID not found for watch:", draggedItemId.value);
    }
    showDeleteModal.value = false;
  }
  refreshColumns();
};

const handleCancel = (type) => {
  if (type === "approve") {
    showApproveModal.value = false;
    clear()
  } else if (type === "unapprove") {
    showDeleteModal.value = false;
  }
  refreshColumns();
};

const refreshColumns = () => {
  columns.value[0].tasks = staffStore.unapprovedWatches.map(mapWatchToTask);
  columns.value[1].tasks = staffStore.approvedWatches.map(mapWatchToTask);
  columns.value[2].tasks = staffStore.deleteWatches.map(mapWatchToTask);
  search();
};

const formatPriceVND = (price) => {
  const formattedPrice = (price / 1).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formattedPrice;
};

const submit = () => {
  console.log('submit update data.');

  const data = {
    price: watchData.price.toString(),
    brand: watchData.brand,
    series: watchData.series,
    model: watchData.model,
    gender: watchData.gender,
    style: watchData.style_type,
    subclass: watchData.sub_class,
    madelabel: watchData.made_label,
    calender: watchData.calender,
    feature: watchData.feature,
    movement: watchData.movement,
    function: watchData.function,
    engine: watchData.engine,
    waterresistant: watchData.water_resistant,
    bandcolor: watchData.band_color,
    bandtype: watchData.band_type,
    clasp: watchData.clasp,
    bracelet: watchData.bracelet,
    dialtype: watchData.dial_type,
    dialcolor: watchData.dial_color,
    crystal: watchData.crystal,
    secondmaker: watchData.second_makers,
    bezel: watchData.bezel,
    bezelmaterial: watchData.bezel_material,
    caseback: watchData.case_back,
    casedimension: watchData.casedimension,
    caseshape: watchData.case_shape,
  };

  console.log(data);
  

  useStaffStore().updateWatch(draggedItem.value.watch_id, data);
  clear()
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
.back {
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px);
}

.btn {
  @apply bg-primary hover:bg-primary text-black font-semibold py-2 px-4 inline-flex items-center;
}

.btn-active {
  @apply bg-primary;
}

.box:hover {
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}

.desclabel.active {
  color: var(--secondary); /* Change label color when textarea is focused */
}

.form__field-description:focus {
  border: 1px solid #ffbd59;
}

.form__field-description {
  border: 0.5px solid #9b9b9b; /* Border for description textarea */
  min-height: 80px; /* Adjust minimum height for textarea */
  margin-top: 1rem; /* Ensure space between top border and label */
  position: relative; /* Ensure relative positioning for containing the textarea */
  z-index: 1; /* Ensure textarea is behind the label */
}
.desclabel {
  color: #9b9b9b;
  font-size: 17px;
  position: absolute;
  top: -0rem; /* Adjust top positioning to overlap with textarea border */
  left: 0rem; /* Align with textarea */
  z-index: 2; /* Ensure label is above the textarea border */
  transition: color 0.2s ease-out; /* Smooth transition for label color change */
}
.ui-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.ui-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  font-size: 1em;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  transition: border-color 0.3s, background-color 0.3s, padding 0.3s;
}

.ui-input:focus {
  border-color: var(--secondary);

  padding: 10px 10px 10px 40px; /* Ensuring the padding remains the same on focus */
}

.ui-input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: var(--primary);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.ui-input:focus + .ui-input-underline {
  transform: scaleX(1);
}

.ui-input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: var(--back);
  transition: width 0.3s;
}

.ui-input:focus ~ .ui-input-highlight {
  width: 100%;
}

.ui-input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: color 0.3s;
}

.ui-input:focus ~ .ui-input-icon {
  color: #e6c591;
}

.ui-input-icon svg {
  width: 20px;
  height: 20px;
}

.select {
  display: flex;
  flex-direction: row;
}

.mydict:hover label {
  color: var(--secondary);
}

.mydict .form {
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  justify-content: center;
  flex-direction: column;
}

.mydict input[type="radio"] {
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
  height: 1px;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.mydict input[type="radio"]:checked + span {
  box-shadow: 0 0 0 0.0625em #ffbd59;
  background-color: #5232003a;
  z-index: 1;
  color: #ffbd59;
}

label .select-op {
  display: block;
  cursor: pointer;
  padding: 0.375em 0.75em;
  position: relative;
  margin-left: 0.0625em;
  box-shadow: 0 0 0 0.0625em #b5bfd9;
  letter-spacing: 0.05em;
  color: #fff;
  text-align: center;
  transition: background-color 0.5s ease;
}

@media (max-width: 768px) {
  .radio-inputs {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .radio-inputs {
    width: 100%;
    font-size: 12px;
  }

  .radio-inputs .radio .name {
    padding: 0.15rem;
  }
}

@media (max-width: 360px) {
  .radio-inputs {
    width: 100%;
    font-size: 10px;
  }

  .radio-inputs .radio .name {
    padding: 0.1rem;
  }
}

.radio-inputs .radio {
  flex: 1 1 auto;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  color: var(--secondary);
  transition: all 0.15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
  background-color: var(--primary);
  color: black;
}

.radio-inputs:focus {
  display: flex;
  border: 1px solid var(--secondary);
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  width: 300px;
  font-size: 14px;
}
</style>
