<template>
  <div class="h-screen">
    
    <div v-if="isLoading" class="overlay">
      <div class="loader-container">
        <div class="loader">
          <div class="loaderBar"></div>
        </div>
      </div>
    </div>
    
    <div class="flex h-screen w-screen overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-80 bg-black-99 text-white p-4 overflow-y-auto border-r border-gray-99">
        <nav>
        <div class="flex text-xl justify-center p-5 w-full">
          <div class="text-primary text-center text-2xl">Quản trị viên Time Harmony</div>
        </div>
        <h1 class="text-xl flex justify-center text-primary font-bold mb-4">Bảng Điều Khiển Quản Trị</h1>
        <ul class="p-6">
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'profit-overview'" 
               :class="{'text-primary': currentSection === 'profit-overview'}">
              Tổng quan lợi nhuận
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'member-list'"
               :class="{'text-primary': currentSection === 'member-list'}">
              Danh Sách Người Dùng
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'seller-list'"
               :class="{'text-primary': currentSection === 'seller-list'}">
              Danh Sách Người Đăng Bán
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'staff-list'"
               :class="{'text-primary': currentSection === 'staff-list'}">
              Danh Sách Nhân Viên
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'products'"
               :class="{'text-primary': currentSection === 'products'}">
              Danh Sách Sản Phẩm
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'pending-products'"
               :class="{'text-primary': currentSection === 'pending-products'}">
              Danh Sách Chờ Duyệt
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'orders'"
               :class="{'text-primary': currentSection === 'orders'}">
              Đơn Hàng
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'shipping'"
               :class="{'text-primary': currentSection === 'shipping'}">
              Danh sách đơn giao
            </a>
          </li>
          <li class="mb-4">
            <a href="#" @click.prevent="currentSection = 'refund-transactions'"
               :class="{'text-primary': currentSection === 'refund-transactions'}">
              Giao dịch cần hoàn tiền
            </a>
          </li>
        </ul>
      </nav>
      <span class="ml-24  hover-underline-animation  cursor-pointer">
            <i @click="logout" class="fa fa-sign-out"></i> Đăng xuất
      </span>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto">
      <!-- Tổng quan lợi nhuận -->
      <section v-if="currentSection === 'profit-overview'" class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Tổng Quan Lợi Nhuận</h2>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="back p-4 rounded-lg shadow">
            <p class="text-xl font-medium">Doanh Thu Tổng: {{ currency(totalRevenue) }}</p>
          </div>
          <div class="back p-4 rounded-lg shadow">
            <p class="text-xl font-medium">Chi Phí Tổng: {{ currency(totalCost) }}</p>
          </div>
          <div class="back p-4 rounded-lg shadow">
            <p class="text-xl font-medium">Lợi Nhuận Tổng: {{ currency(totalProfit) }}</p>
          </div>
        </div>
        <div v-if="showCharts" class="grid  grid-cols-2 gap-6 mb-6">
          <div class="back-4 rounded-lg back shadow">
            <canvas ref="revenueChart"></canvas>
          </div>
          <div class="back p-4 rounded-lg shadow">
            <canvas ref="costChart"></canvas>
          </div>
        </div>
        <div class="back p-4 rounded-lg shadow">
          <canvas ref="overviewChart"></canvas>
        </div>
      </section>
      
      <!-- Quản trị người dùng -->
      <section v-if="currentSection === 'member-list'" class="mb-6">
        <h2 class="text-3xl text-center font-semibold mb-5">Danh Sách Người Dùng</h2>
        <h2 class="text-xl font-semibold mb-4">Thêm làm nhân viên</h2>
        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1">
            <input
              type="text"
              placeholder="Nhập ID người dùng"
              class="ui-input w-full px-4 py-2 border rounded-lg"
              v-model="userId"
              required
            />
          </div>
          <button 
            @click="promoteToStaff" 
            :disabled="!userId" 
            :class="['th-p-btn py-2 px-4 rounded-lg', { 'opacity-50 cursor-not-allowed': !userId }]"
          >
            Thêm làm nhân viên
          </button>
        </div>
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Tìm kiếm người dùng</h2>
          <div class="ui-input-container mb-4">
            <input
              required
              placeholder="Tìm kiếm id, tên hoặc email.."
              class="ui-input w-full px-4 py-2 border rounded-lg"
              type="text"
              v-model="qMembers"
              @keyup="searchMembers"
            />
          </div>
          <!-- User -->
          <h3 class="text-3xl py-10 text-center">Danh sách thành viên</h3>
          <div class="overflow-x-auto back p-4 rounded-lg shadow">
            <table class="table w-full">
              <thead class="bg-gray-200">
                <tr class="text-left text-gray-700">
                  <th class="p-2">ID</th>
                  <th class="p-2">Hình Ảnh</th>
                  <th class="p-2">Tên</th>
                  <th class="p-2">Email</th>
                  <th class="p-2">Username</th>
                  <th class="p-2">Vai trò</th>
                  <th class="p-2">Trạng Thái</th>
                  <th class="p-2">Cấm người dùng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in filteredMembers" :key="member.member_id" class="border-t">
                  <td class="p-2">{{ member.member_id }}</td>
                  <td class="p-2">
                    <img
                      :src="member.member_image"
                      alt="Member Image"
                      class="w-12 h-12"
                    />
                  </td>
                  <td class="p-2">
                    {{ member?.first_name }} {{ member?.last_name }}
                  </td>
                  <td class="p-2">{{ member.email }}</td>
                  <td class="p-2">{{ member.user_log_info.username }}</td>
                  <td class="p-2 text-center">
                    <div v-if="member.user_log_info.authorities.authority == 'ROLE_STAFF' && member.staff_role == null" class="cursor-pointer hover-underline-animation"
                      @click="openPromoteModal(member)"
                    >
                      {{ member.staff_role ? roleLabels[member.staff_role] : roleLabels[member.user_log_info.authorities.authority] }}
                    </div>
                    <div v-else>
                      {{ member.staff_role ? roleLabels[member.staff_role] : roleLabels[member.user_log_info.authorities.authority] }}
                    </div>
                  </td>
                  <td class="p-2 text-center">
                    {{ member.user_log_info.enabled === 1 ? "Hoạt động" : "Bị cấm" }}
                  </td>
                  <td class="p-2 text-center">
                    <div
                      v-if="member.user_log_info.enabled === 1"
                      class="hover-underline-animation-r cursor-pointer text-red-600"
                      @click="openBanModal(member)"
                    >
                      Cấm khỏi hệ thống
                    </div>
                    <div
                      v-else
                      class="hover-underline-animation-r cursor-pointer text-green-600"
                      @click="unbanUser(member)"
                    >
                      Bỏ cấm người dùng
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- DS Thành viên -->
        </div>
      </section>

      <!-- Danh sách seller -->
      <section v-if="currentSection === 'seller-list'" class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Tìm kiếm người dùng</h2>
          <div class="ui-input-container mb-4">
            <input
              required
              placeholder="Tìm kiếm id, tên hoặc email.."
              class="ui-input w-full px-4 py-2 border rounded-lg"
              type="text"
              v-model="qMembers"
              @keyup="searchMembers"
            />
          </div>
        <h3 class="text-3xl py-10 text-center">Danh sách người đăng bán</h3>
          <div class="overflow-x-auto back p-4 rounded-lg shadow">
            <table class="table w-full">
              <thead class="bg-gray-200">
                <tr class="text-left text-gray-700">
                  <th class="p-2">ID</th>
                  <th class="p-2">Hình Ảnh</th>
                  <th class="p-2">Tên</th>
                  <th class="p-2">Email</th>
                  <th class="p-2">Username</th>
                  <th class="p-2">Vai trò</th>
                  <th class="p-2">Trạng Thái</th>
                  <th class="p-2">Cấm người dùng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in filteredSeller" :key="member.member_id" class="border-t">
                  <td class="p-2">{{ member.member_id }}</td>
                  <td class="p-2">
                    <img
                      :src="member.member_image"
                      alt="Member Image"
                      class="w-12 h-12"
                    />
                  </td>
                  <td class="p-2">
                    {{ member?.first_name }} {{ member?.last_name }}
                  </td>
                  <td class="p-2">{{ member.email }}</td>
                  <td class="p-2">{{ member.user_log_info.username }}</td>
                  <td class="p-2 text-center">
                    <div v-if="member.user_log_info.authorities.authority == 'ROLE_STAFF' && member.staff_role == null" class="cursor-pointer hover-underline-animation"
                      @click="openPromoteModal(member)"
                    >
                      {{ member.staff_role ? roleLabels[member.staff_role] : roleLabels[member.user_log_info.authorities.authority] }}
                    </div>
                    <div v-else>
                      {{ member.staff_role ? roleLabels[member.staff_role] : roleLabels[member.user_log_info.authorities.authority] }}
                    </div>
                  </td>
                  <td class="p-2 text-center">
                    {{ member.user_log_info.enabled === 1 ? "Hoạt động" : "Bị cấm" }}
                  </td>
                  <td class="p-2 text-center">
                    <div
                      v-if="member.user_log_info.enabled === 1"
                      class="hover-underline-animation-r cursor-pointer text-red-600"
                      @click="openBanModal(member)"
                    >
                      Cấm khỏi hệ thống
                    </div>
                    <div
                      v-else
                      class="hover-underline-animation-r cursor-pointer text-green-600"
                      @click="unbanUser(member)"
                    >
                      Bỏ cấm người dùng
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>


      <!-- Danh sách staff -->
      <section v-if="currentSection === 'staff-list'" class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Tìm kiếm người dùng</h2>
          <div class="ui-input-container mb-4">
            <input
              required
              placeholder="Tìm kiếm id, tên hoặc email.."
              class="ui-input w-full px-4 py-2 border rounded-lg"
              type="text"
              v-model="qStaff"
              @keyup="searchMembers"
            />
          </div>
          <div class="w-full flex justify-start">
            <label class="container flex justify-start items-center text-center gap-2">
              <input type="checkbox" :checked="selectedRole === 'staff'" @change="toggleRole('staff')" />
              <svg viewBox="0 0 64 64" height="1em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
              </svg>
              <label>Nhân viên</label>
            </label>
            <label class="container flex justify-start items-center text-center gap-2">
              <input type="checkbox" :checked="selectedRole === 'appraiser'" @change="toggleRole('appraiser')" />
              <svg viewBox="0 0 64 64" height="1em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
              </svg>
              <label>Chuyên viên kiểm định</label>
            </label>
            <label class="container flex justify-start items-center text-center gap-2">
              <input type="checkbox" :checked="selectedRole === 'shipper'" @change="toggleRole('shipper')" />
              <svg viewBox="0 0 64 64" height="1em">
                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
              </svg>
              <label>Nhân viên vận chuyển</label>
            </label>
          </div>
        <h3 class="text-3xl text-center py-10">Danh sách nhân viên</h3>
          <div class="overflow-x-auto back p-4 rounded-lg shadow">
            <table class="table w-full">
              <thead class="bg-gray-200">
                <tr class="text-left text-gray-700">
                  <th class="p-2">ID</th>
                  <th class="p-2">Hình Ảnh</th>
                  <th class="p-2">Tên</th>
                  <th class="p-2">Email</th>
                  <th class="p-2">Username</th>
                  <th class="p-2">Vai trò</th>
                  <th class="p-2">Trạng Thái</th>
                  <th class="p-2">Cấm người dùng</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in filteredStaff" :key="member.member_id" class="border-t">
                  <td class="p-2">{{ member.member_id }}</td>
                  <td class="p-2">
                    <img
                      :src="member.member_image"
                      alt="Member Image"
                      class="w-12 h-12"
                    />
                  </td>
                  <td class="p-2">
                    {{ member?.first_name }} {{ member?.last_name }}
                  </td>
                  <td class="p-2">{{ member.email }}</td>
                  <td class="p-2">{{ member.user_log_info.username }}</td>
                  <td class="p-2 text-center">
                    <div v-if="member.user_log_info.authorities.authority == 'ROLE_STAFF' && member.staff_role == null" class="cursor-pointer hover-underline-animation"
                      @click="openPromoteModal(member)"
                    >
                      {{ member.staff_role ? roleLabels[member.staff_role] : roleLabels[member.user_log_info.authorities.authority] }}
                    </div>
                    <div v-else>
                      {{ member.staff_role ? roleLabels[member.staff_role] : roleLabels[member.user_log_info.authorities.authority] }}
                    </div>
                  </td>
                  <td class="p-2 text-center">
                    {{ member.user_log_info.enabled === 1 ? "Hoạt động" : "Bị cấm" }}
                  </td>
                  <td class="p-2 text-center">
                    <div
                      v-if="member.user_log_info.enabled === 1"
                      class="hover-underline-animation-r cursor-pointer text-red-600"
                      @click="openBanModal(member)"
                    >
                      Cấm khỏi hệ thống
                    </div>
                    <div
                      v-else
                      class="hover-underline-animation-r cursor-pointer text-green-600"
                      @click="unbanUser(member)"
                    >
                      Bỏ cấm người dùng
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>

      <!-- Quản trị Danh Sách sản phẩm -->
      <section v-if="currentSection === 'products'" class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Danh Sách Sản Phẩm</h2>
        <div class="ui-input-container mb-4">
          <input
            required
            placeholder="Tìm kiếm id, tên Danh Sách sản phẩm hoặc người bán.."
            class="ui-input w-full px-4 py-2 border rounded-lg"
            type="text"
            v-model="qWatches"
            @keyup.enter="searchWatches"
          />
        </div>
        <div class="overflow-x-auto back p-4 rounded-lg shadow">
          <table class="table w-full">
            <thead class="bg-gray-200">
              <tr class="text-left text-gray-700">
                <th class="p-2">ID</th>
                <th class="p-2">Tên</th>
                <th class="p-2">Người bán</th>
                <th class="p-2">Giá</th>
                <th class="p-2">Trạng thái</th>
                
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredWatches" :key="product.watch_id">
              <td class="p-2 border-b">
              <router-link class="hover-underline-animation " :to="`/detail/${product.watch_id}`">{{ product.watch_id }}</router-link>
              </td>
              <td class="p-2 border-b">{{ product.watch_name }}</td>
              <td class="p-2 border-b">
                <div class="flex items-center">
                  <img
                    :src="product.seller.member_image"
                    alt="Seller Image"
                    class="w-8 h-8 mr-2"
                  />
                  <span>{{ product.seller.user_log_info.username }}</span>
                </div>
              </td>
              <td class="p-2 border-b">{{ currency(product.price) }}</td>
              <td class="p-2 border-b">
                {{ stateLabels[product.state] }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <!-- Danh sách chờ duyệt -->
      <section v-if="currentSection === 'pending-products'" class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Danh Sách Đồng Hồ Chờ Duyệt</h2>
        <div class="ui-input-container mb-4">
          <input
            required
            placeholder="Tìm kiếm id, tên Danh Sách sản phẩm hoặc người bán.."
            class="ui-input w-full px-4 py-2 border rounded-lg"
            type="text"
            v-model="qPendingWatches"
            @keyup.enter="searchPendingWatches"
          />
        </div>
         <div class="overflow-x-auto back  p-4 rounded-lg shadow">
          <table class="table w-full">
            <thead class="bg-gray-200">
              <tr class="text-left text-gray-700">
                <th class="p-2">ID</th>
                <th class="p-2">Tên</th>
                <th class="p-2">Người bán</th>
                <th class="p-2">Được kiểm định bởi</th>
                <th class="p-2">Thời gian được kiểm định</th>
                <th class="p-2">Hành động</th>
                
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredPendingWatches" :key="product.watch_id">
              <td class="p-2 border-b">
              <router-link class="hover-underline-animation " :to="`/detail/${product.watch_id}`">{{ product.watch_id }}</router-link>
              </td>
              <td class="p-2 border-b">{{ product.watch_name }}</td>
              <td class="p-2 border-b">
                <div class="flex items-center">
                  <img
                    :src="product.seller.member_image"
                    alt="Seller Image"
                    class="w-8 h-8 mr-2"
                  />
                  <span>{{ product.seller.user_log_info.username }}</span>
                </div>
              </td>
              <td class="p-2 border-b">N/a</td>
              <td class="p-2 border-b">N/a</td>
              <td class="p-2 border-b">
                <button @click="openAssignModal(product)" class="hover-underline-animation">
                  Giao cho Kiểm định viên
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Quản trị đơn hàng -->
      <section v-if="currentSection === 'orders'" class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Đơn Hàng</h2>
        <div class="ui-input-container mb-4">
          <input
            required
            placeholder="Tìm kiếm đơn hàng id, trạng thái, Danh Sách sản phẩm hoặc tên khách hàng.."
            class="ui-input w-full px-4 py-2 border rounded-lg"
            type="text"
            v-model="qOrders"
            @keyup.enter="searchOrders"
          />
        </div>
        <!-- Các đơn bình thường -->
        <h1 class="text-center text-2xl py-5">Danh sách các đơn hàng</h1>
        <div class="overflow-x-auto back p-4 rounded-lg shadow">
          <table class="table">
          <thead class="table-header">
            <tr class="text-primary">
              <th class="p-2 border-b">ID Đơn Hàng</th>
              <th class="p-2 border-b">Ngày Tạo</th>
              <th class="p-2 border-b">Địa Chỉ</th>
              <th class="p-2 border-b">Tên Nhận Hàng</th>
              <th class="p-2 border-b">Số Điện Thoại</th>
              <th class="p-2 border-b">Ngày giao hàng</th>
              <th class="p-2 border-b">Trạng thái</th>
              <th class="p-2 border-b">Ghi Chú</th>
              <th class="p-2 border-b">Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.order_id">
              <td class="p-2 border-b">{{ order.order_id }}</td>
              <td class="p-2 border-b">
                {{ new Date(order.create_time).toLocaleDateString() }}
              </td>
              <td class="p-2 border-b">{{ order.address }}</td>
              <td class="p-2 border-b">{{ order.receive_name }}</td>
              <td class="p-2 border-b">{{ order.phone }}</td>
              <td class="p-2 border-b">{{ order.shipping_date ?? "Không có thông tin"}}</td>
              <td class="p-2 border-b">{{ stateOrders[order.state] }}</td>
              <td class="p-2 border-b">{{ order.notice || "Không có thông tin" }}</td>
              <td class="p-2 border-b">{{ currency(order.total_price) }}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <!-- Đơn thành công -->
        <h1 class="text-center text-2xl py-5">Danh sách các đơn hàng giao thành công</h1>
        <div class="overflow-x-auto back p-4 rounded-lg shadow">
          <table class="table">
          <thead class="table-header">
            <tr class="text-primary">
              <th class="p-2 border-b">ID Đơn Hàng</th>
              <th class="p-2 border-b">Ngày Tạo</th>
              <th class="p-2 border-b">Địa Chỉ</th>
              <th class="p-2 border-b">Tên Nhận Hàng</th>
              <th class="p-2 border-b">Số Điện Thoại</th>
              <th class="p-2 border-b">Ngày giao hàng</th>
              <th class="p-2 border-b">Trạng thái</th>
              <th class="p-2 border-b">Ghi Chú</th>
              <th class="p-2 border-b">Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredSuccessOrders" :key="order.order_id">
              <td class="p-2 border-b">{{ order.order_id }}</td>
              <td class="p-2 border-b">
                {{ new Date(order.create_time).toLocaleDateString() }}
              </td>
              <td class="p-2 border-b">{{ order.address }}</td>
              <td class="p-2 border-b">{{ order.receive_name }}</td>
              <td class="p-2 border-b">{{ order.phone }}</td>
              <td class="p-2 border-b">{{ order.shipping_date ?? "Không có thông tin"}}</td>
              <td class="p-2 border-b">{{ stateOrders[order.state] }}</td>
              <td class="p-2 border-b">{{ order.notice || "Không có thông tin" }}</td>
              <td class="p-2 border-b">{{ currency(order.total_price) }}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <!-- Các đơn hàng bị huỷ -->
        <h1 class="text-center text-2xl py-5">Danh sách các đơn hàng bị huỷ</h1>
        <div class="overflow-x-auto back p-4 rounded-lg shadow">
          <table class="table">
          <thead class="table-header">
            <tr class="text-primary">
              <th class="p-2 border-b">ID Đơn Hàng</th>
              <th class="p-2 border-b">Ngày Tạo</th>
              <th class="p-2 border-b">Địa Chỉ</th>
              <th class="p-2 border-b">Tên Nhận Hàng</th>
              <th class="p-2 border-b">Số Điện Thoại</th>
              <th class="p-2 border-b">Ngày giao hàng</th>
              <th class="p-2 border-b">Trạng thái</th>
              <th class="p-2 border-b">Ghi Chú</th>
              <th class="p-2 border-b">Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredFailOrders" :key="order.order_id">
              <td class="p-2 border-b">{{ order.order_id }}</td>
              <td class="p-2 border-b">
                {{ new Date(order.create_time).toLocaleDateString() }}
              </td>
              <td class="p-2 border-b">{{ order.address }}</td>
              <td class="p-2 border-b">{{ order.receive_name }}</td>
              <td class="p-2 border-b">{{ order.phone }}</td>
              <td class="p-2 border-b">{{ order.shipping_date ?? "Không có thông tin"}}</td>
              <td class="p-2 border-b">{{ stateOrders[order.state] }}</td>
              <td class="p-2 border-b">{{ order.notice || "Không có thông tin" }}</td>
              <td class="p-2 border-b">{{ currency(order.total_price) }}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </section>

      <!-- Quản trị shipping -->
      <section v-if="currentSection === 'shipping'" class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Giao đơn cho shipper</h2>
        <div class="overflow-x-auto back p-4 rounded-lg shadow">
            <table class="table w-full">
              <thead class="bg-gray-200">
                <tr class="text-left text-gray-700">
                  <th class="p-2">ID</th>
                  <th class="p-2">Hình Ảnh</th>
                  <th class="p-2">Tên</th>
                  <th class="p-2">Email</th>
                  <th class="p-2">Username</th>
                  <th class="p-2">Vai trò</th>
                  <th class="p-2">Trạng Thái</th>
                  <th class="p-2">Hoạt động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in filteredShipper" :key="member.member_id" class="border-t">
                  <td class="p-2">{{ member.member_id }}</td>
                  <td class="p-2">
                    <img
                      :src="member.member_image"
                      alt="Member Image"
                      class="w-12 h-12"
                    />
                  </td>
                  <td class="p-2">
                    {{ member?.first_name }} {{ member?.last_name }}
                  </td>
                  <td class="p-2">{{ member.email }}</td>
                  <td class="p-2">{{ member.user_log_info.username }}</td>
                  <td class="p-2 text-center"> {{ roleLabels[member.staff_role] }} </td>
                  <td class="p-2 text-center">
                    {{ member.user_log_info.enabled === 1 ? "Hoạt động" : "Bị cấm" }}
                  </td>
                  <td class="p-2 text-center justify-between">
                    <button @click="openAssign(member)" class="hover-underline-animation">Giao đơn</button>
                    <button @click="openDetail(member)" class="hover-underline-animation">Xem chi tiết</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>
      <!--  -->
      <!-- Quản trị giao dịch cần hoàn tiền -->
      <section v-if="currentSection === 'refund-transactions'" class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Giao Dịch Cần Hoàn Tiền</h2>
        <div class="ui-input-container mb-4">
          <input
            required
            placeholder="Tìm kiếm mã giao dịch, Danh Sách sản phẩm, hoặc tên khách hàng.."
            class="ui-input w-full px-4 py-2 border rounded-lg"
            type="text"
            v-model="qRefunds"
            @keyup.enter="searchRefunds"
          />
        </div>
        <div class="overflow-x-auto back p-4 rounded-lg shadow">
          <table class="table">
        <thead class="table-header">
            <tr class="text-primary">
              <th class="p-2 border-b">Mã giao dịch</th>
              <th class="p-2 border-b">Số tiền</th>
              <th class="p-2 border-b">ID Người Dùng</th>
              <th class="p-2 border-b">Tên Người Dùng</th>
              <th class="p-2 border-b">Phương thức thanh toán</th>
              <th class="p-2 border-b">Ngân hàng</th>
              <th class="p-2 border-b">Thời gian tạo</th>
              <th class="p-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in filteredNullOrders" :key="transaction.transaction_no">
              <td class="p-2 border-b">{{ transaction.transaction_no }}</td>
              <td class="p-2 border-b">{{ currency(transaction.payment_amount) }}</td>
              <td class="p-2 border-b">{{ transaction.member_id }}</td>
              <td class="p-2 border-b">{{ getMemberName(transaction.member_id) }}</td>
              <td class="p-2 border-b">{{ transaction.payment_method }}</td>
              <td class="p-2 border-b">{{ transaction.bank_code }}</td>
              <td class="p-2 border-b">{{ formatDate(transaction.create_at) }}</td>
              <td>
                <button class="hover-underline-animation" @click="sendEmail(transaction.transaction_no, transaction.member_id)">
                  Phản hồi
                </button>
              </td>
            </tr>
        </tbody>
      </table>
        </div>
      </section>
    </main>



    <!-- Ban User Modal -->
    <div v-if="isBanModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeBanModal">&times;</span>
        <h2>Xác nhận Cấm người dùng</h2>
        <textarea
          v-model="banMessage"
          placeholder="Lý do cấm người dùng"
          rows="4"
          class="textarea"
        ></textarea>
        <button @click="confirmBanUser" class="confirm-btn">Xác nhận</button>
      </div>
    </div>

    <!-- Promote Modal -->
    <div class="promoteBox" v-if="openPromote">
      <div class="promote">
        <h2 class="mb-5">Chọn vị trí bổ nhiệm</h2>
        <select class="py-3" name="promote" id="promote">
          <option value="0">Trở thành chuyên viên kiểm định</option>
          <option value="1">Trở thành nhân viên vận chuyển</option>
        </select>
        <div class="gap-1 flex justify-end mt-5">
          <button class="th-s-btn" @click="closePromoteModal">Hủy</button>
          <button class="th-p-btn" @click="promote">Xác nhận</button>
        </div>
      </div>
    </div>

    <!-- Modal để giao việc -->
    <div v-if="showAssignModal" class="modal">
      <div class="modal-content">
        <h2 class="text-2xl font-semibold mb-4">Giao đồng hồ cho kiểm định viên</h2>
    
          <!-- Thông tin đồng hồ -->
          <div class="watch-info mb-4">
            <h3 class="text-xl font-medium mb-2">Đồng hồ được chọn:</h3>
            <p><strong>ID:</strong> {{ selectedWatch.watch_id }}</p>
            <p><strong>Tên:</strong> {{ selectedWatch.watch_name }}</p>
          </div>

          <!-- Dropdown để chọn Appraiser -->
          <div class="appraiser-select mb-4">
            <h3 class="text-xl font-medium mb-2">Chọn kiểm định viên:</h3>
            <select v-model="selectedAppraiser" class="w-full p-2 border rounded bg-black-99">
              <option value="" disabled>Chọn một kiểm định viên</option>
              <option v-for="appraiser in getAppraisers" :key="appraiser.member_id" :value="appraiser">
                {{ appraiser.first_name }} {{ appraiser.last_name }}
              </option>
            </select>
          </div>
        <div class="flex w-full justify-start ">
          <VueDatePicker v-model="date" placeholder="Chọn ngày giao kiểm định" :format="formatDate"></VueDatePicker>
        </div>
          <p v-if="dateWarning" class="text-red-500 pt-2">{{ dateWarning }}</p>
        <br />
        <div class="modal-actions">
          <button @click="showAssignModal = false" class="border-2 border-secondary p-2">
            Hủy
          </button>
          <button @click="assignWatch" :disabled="!selectedAppraiser || !selectedDate" class="th-p-btn">
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Modal để giao đơn -->
    <div v-if="assignShipModal" class="modal">
      <div class="modal-content">
        <h2 class="text-2xl font-semibold mb-4">Giao đơn cho Shipper</h2>
        
        <!-- Shipper Information -->
        <div class="shipper-info mb-4">
          <h3 class="text-xl font-medium mb-2">Thông tin Shipper:</h3>
          <p><strong>ID:</strong> {{ selectedShipper.member_id }}</p>
          <p><strong>Tên:</strong> {{ selectedShipper.first_name }} {{ selectedShipper.last_name }}</p>
        </div>

        <!-- Pending Orders Dropdown -->
        <div class="order-select mb-4">
          <h3 class="text-xl font-medium mb-2">Chọn đơn hàng cần giao:</h3>
          <select v-model="selectedOrder" class="w-full p-2 border rounded bg-black-99">
            <option value="" disabled>Chọn một đơn hàng</option>
            <option v-for="order in getShipOrder" :key="order.order_id" :value="order">
              Đơn hàng #{{ order.order_id }} - {{ order.receive_name }}
            </option>
          </select>
        </div>
        
        <div class="modal-actions">
          <button @click="assignShipModal = false" class="border-2 border-secondary p-2">
            Hủy
          </button>
          <button @click="assignOrderToShipper" :disabled="!selectedOrder" class="th-p-btn">
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Modal để xem các đơn giao -->
    <div v-if="showShipperOrdersModal" class="modal">
  <div class="modal-content">
    <h2 class="text-2xl font-semibold mb-4">Các đơn được giao bởi {{ selectedShipper.first_name }}</h2>
    
    <!-- Shipper Information -->
    <div class="shipper-info mb-4">
      <h3 class="text-xl font-medium mb-2">Thông tin Shipper:</h3>
      <p><strong>ID:</strong> {{ selectedShipper.member_id }}</p>
      <p><strong>Tên:</strong> {{ selectedShipper.first_name }} {{ selectedShipper.last_name }}</p>
    </div>

    <!-- Assigned Orders Table -->
    <div class="assigned-orders mb-4">
      <h3 class="text-xl font-medium mb-2">Đơn hàng đã giao:</h3>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2">Mã đơn hàng</th>
            <th class="border p-2">Tên khách hàng</th>
            <th class="border p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in assignedOrders" :key="order.order_id">
            <td class="border p-2">{{ order.order_id }}</td>
            <td class="border p-2">{{ order.customer_name }}</td>
            <td class="border p-2">{{ stateOrders[order.state] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="modal-actions">
      <button @click="showShipperOrdersModal = false" class="border-2 border-secondary p-2">
        Đóng
      </button>
    </div>
  </div>
</div>

  </div>

</div>

</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useAdminStore } from "../stores/admin";
import Chart from 'chart.js/auto';
import { useChatStore } from "../stores/chat";
import { useAuthStore } from "../stores/auth";
import { useUserStore } from "../stores/user";
import router from "../router";
import { useMailStore } from "../stores/mail";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const currentSection = ref('profit-overview');

const date = ref(new Date());
const dateWarning = ref('');

const validateDate = (selectedDate) => {
  const today = new Date();
  // Set time to midnight to avoid issues with time comparison
  today.setHours(0, 0, 0, 0);

  // Add one day to today's date
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (!selectedDate) return null;

  // Compare selectedDate with tomorrow
  if (selectedDate < tomorrow) {
    dateWarning.value = "Bạn phải chọn ngày sau hôm nay ít nhất 1 ngày.";
    date.value = null;
  } else {
    dateWarning.value = "";
  }
};

const selectedRole = ref(null);

const toggleRole = (role) => {
  if (selectedRole.value === role) {
    selectedRole.value = null;
  } else {
    selectedRole.value = role;
  }
};


watch(date, (newDate) => {
  validateDate(newDate);
});

const formatBoxDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth()+1
  const year = date.getFullYear()
  const hour = date.getHours()
  const minute = date.getMinutes()
  
  return `${day}/${month}/${year} vào lúc ${hour}:${minute}`
}

const logout = () => {
   useAuthStore().logout().then(
    window.location.replace('/')
  )
};

const stateLabels = {
  0: "Vừa đăng",
  1: "Được duyệt",
  2: "Bị xóa",
  3: "Chờ giao",
  4: "Đang giao",
  5: "Đang thanh toán",
  6: "Hoàn tất",
  7: "Đã giao",
};

const stateOrders = {
  NEW: "Vừa tạo",
  PENDING: "Đang chờ",
  SHIPPING: "Đang giao",
  SUCCESS: "Giao thành công",
  FAILED: "Hủy",
  DELETED: "Xóa",
  SHIPPED: "Đã giao",
};

const roleLabels = {
  ROLE_USER: "Người dùng",
  ROLE_SELLER: "Người bán",
  ROLE_STAFF: "Nhân viên",
  SHIPPER: "Nhân viên vận chuyển",
  APPRAISER: "Chuyên viên kiểm định",
  ROLE_ADMIN: "Quản trị viên",
};



// Initialize the store
const adminStore = useAdminStore();

// State variables
const userId = ref("");
const isBanModalOpen = ref(false);
const banMessage = ref("");
const selectedMember = ref(null);
const showCharts = ref(false);

const qMembers = ref('');
const qStaff = ref('');
const qWatches = ref('');
const qPendingWatches = ref('')
const qOrders = ref('');
const nOrders = ref('');

// Chart
const overviewChart = ref(null);
const revenueChart = ref(null);
const costChart = ref(null);
const profitChart = ref(null);
// Chart variable

const selectedTransaction = ref(null);
const greeting = ref("");

const openPromote = ref(false)

let overviewChartInstance = null;
let revenueChartInstance = null;
let costChartInstance = null;
let profitChartInstance = null;

// Error state
const error = ref(null);

const openPromoteModal = (member) => {
  selectedMember.value = member;
  openPromote.value = true
};

const closePromoteModal = () => {
  openPromote.value = false
};

const showAssignModal = ref('')
const selectedWatch = ref(null);

const assignShipModal = ref(false);
const showShipperOrdersModal = ref(false);
const selectedShipper = ref(null);
const selectedOrder = ref(null);
const pendingOrders = ref([]);
const assignedOrders = ref([]);

const openAssign = async (shipper) => {
  assignShipModal.value = true;
  selectedShipper.value = shipper;
  pendingOrders.value = []; // Replace with actual API call
};

const openDetail = async (shipper) => {
  showShipperOrdersModal.value = true;
  selectedShipper.value = shipper;
  assignedOrders.value = []; // Replace with actual API call
};

const openAssignModal = async (watch) => {
  selectedWatch.value = watch;
  showAssignModal.value = true;  
};

function setGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 0 && hour < 5) {
    greeting.value = "Chào buổi tối";
  } else if (hour >= 5 && hour < 12) {
    greeting.value = "Chào buổi sáng";
  } else if (hour >= 12 && hour < 18) {
    greeting.value = "Chào buổi chiều";
  } else{
    greeting.value = "Chào buổi tối";
  }
}


const promote = () => {
  const promoteSelect = document.getElementById('promote');
  const selectedValue = promoteSelect.options[promoteSelect.selectedIndex].value;
  
  console.log('Member ID:', selectedMember.value.member_id);
  console.log('Selected Promotion Value:', selectedValue);

  adminStore.updateStaffRole(selectedMember.value.member_id, selectedValue==0?'APPRAISER':'SHIPPER')
  closePromoteModal()
};



const createCharts = () => {
  if (currentSection.value !== 'profit-overview') return;

  // Destroy existing chart instances
  if (overviewChartInstance) overviewChartInstance.destroy();
  if (revenueChartInstance) revenueChartInstance.destroy();
  if (costChartInstance) costChartInstance.destroy();
  if (profitChartInstance) profitChartInstance.destroy();

  nextTick(() => {
    showCharts.value = true;
    nextTick(() => {
      createOverviewChart();
      createRevenueChart();
      createCostChart();
      createProfitChart();
    });
  });
};

watch(currentSection, (newSection, oldSection) => {
  if (newSection === 'profit-overview') {
    if (oldSection !== 'profit-overview') {
      showCharts.value = false;
      nextTick(() => {
        createCharts();
      });
    }
  } else {
    showCharts.value = false;
  }
});
// Fetch data from the store on component mount
onMounted(async () => {
  try {
    date.value = null
    await adminStore.getMembers();
    await adminStore.getWatches();
    await adminStore.getOrders();
    await adminStore.getOrdersNull();
  setGreeting();

  if (currentSection.value === 'profit-overview') {
    createCharts();
  }
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = "Failed to fetch initial data. Please try refreshing the page.";
  }
});
// Check user role
const userStore = useUserStore();
const authStore = useAuthStore();
if (
  userStore.role !== "ROLE_ADMIN" &&
  authStore.user_id !== import.meta.env.VITE_ADMIN_USERID
) {
  console.log("Not ADMIN");
  router.push("/");
}

const getMemberName = (memberId) => {
  const member = adminStore.members.find(m => m.member_id === memberId);
  return member ? `${member.first_name} ${member.last_name}` : 'Unknown';
};

const getMember = (memberId) => {
  return adminStore.members.find(m => m.member_id === memberId);
};

const getAppraisers = computed(() => {
  return adminStore.members.filter(member => 
    member.staff_role === 'APPRAISER'
  );
});

const getShipOrder = computed(() => {
  return adminStore.orders.filter(order => 
    order.state === 'PENDING'
  );
});

// Define computed properties with error handling
const filteredMembers = computed(() => {
  try {
    return adminStore.filteredMembers(qMembers.value).filter(member => member.user_log_info.authorities.authority === 'ROLE_USER');
  } catch (err) {
    console.error("Error in filteredMembers:", err);
    error.value = "Error filtering members. Please try again.";
    return [];
  }
});

const filteredSeller = computed(() => {
  try {
    return adminStore.filteredMembers(qMembers.value).filter(member => member.user_log_info.authorities.authority === 'ROLE_SELLER');
  } catch (err) {
    console.error("Error in filteredMembers:", err);
    error.value = "Error filtering members. Please try again.";
    return [];
  }
});

const filteredStaff = computed(() => {
  try {
    let filter = adminStore.filteredMembers(qStaff.value).filter(member => 
      member.user_log_info.authorities.authority === 'ROLE_STAFF'
    );

    if (selectedRole.value) {
      filter = filter.filter(member => {
        switch (selectedRole.value) {
          case 'staff':
            return member.staff_role === null;
          case 'appraiser':
            return member.staff_role === 'APPRAISER';
          case 'shipper':
            return member.staff_role === 'SHIPPER';
          default:
            return true;
        }
      });
    }

    return filter;
  } catch (err) {
    console.error("Error in filteredMembers:", err);
    error.value = "Error filtering members. Please try again.";
    return [];
  }
});

const filteredShipper = computed(() => {
  try {
    return adminStore.filteredMembers(qMembers.value).filter(member => member.staff_role === 'SHIPPER');
  } catch (err) {
    console.error("Error in filteredMembers:", err);
    error.value = "Error filtering members. Please try again.";
    return [];
  }
});

const filteredWatches = computed(() => {
  try {
    return adminStore.filteredWatches(qWatches.value).filter(product => product.state !== 0);
  } catch (err) {
    console.error("Error in filteredWatches:", err);
    error.value = "Error filtering watches. Please try again.";
    return [];
  }
});

const filteredPendingWatches = computed(() => {
  try {
    return adminStore.filteredWatches(qPendingWatches.value).filter(product => product.state === 0);
  } catch (err) {
    console.error("Error in filteredPendingWatches:", err);
    error.value = "Error filtering newly posted watches. Please try again.";
    return [];
  }
});

const filteredSuccessOrders = computed(() => {
  try {
    return adminStore.filteredOrders(qOrders.value).filter(order => order.state === 'SUCCESS');
  } catch (err) {
    console.error("Error in filteredOrders:", err);
    error.value = "Error filtering orders. Please try again.";
    return [];
  }
});

const filteredFailOrders = computed(() => {
  try {
    return adminStore.filteredOrders(qOrders.value).filter(order => order.state === 'FAIL');
  } catch (err) {
    console.error("Error in filteredOrders:", err);
    error.value = "Error filtering orders. Please try again.";
    return [];
  }
});

const filteredOrders = computed(() => {
  try {
    return adminStore.filteredOrders(qOrders.value).filter(order => order.state !== 'FAIL' && order.state !== 'SUCCESS');
  } catch (err) {
    console.error("Error in filteredOrders:", err);
    error.value = "Error filtering orders. Please try again.";
    return [];
  }
});


const filteredNullOrders = computed(() => {
  try {
    return adminStore.filteredNullOrders(nOrders.value);
  } catch (err) {
    console.error("Error in filteredOrders:", err);
    error.value = "Error filtering orders. Please try again.";
    return [];
  }
});



// Updated searchMembers function with more robust error handling
const searchMembers = () => {
  adminStore.getMembers()
    .then(() => {
      adminStore.members = adminStore.members.filter(member => {
        if (!member) return false;

        // Ensure member properties are defined
        const id = member.member_id ? member.member_id.toString() : ''; // Convert ID to string
        const firstName = member.first_name ? member.first_name.toLowerCase() : '';
        const lastName = member.last_name ? member.last_name.toLowerCase() : '';
        const email = member.email ? member.email.toLowerCase() : '';
        const username = member.user_log_info.username ? member.user_log_info.username.toLowerCase() : '';

        // Convert query to lower case
        const query = qMembers.value.toLowerCase();

        // Check if any field includes the search query
        return (
          id.includes(query) || 
          firstName.includes(query) || 
          lastName.includes(query) || 
          email.includes(query) ||
          username.includes(query)
        );
      });
    })
    .catch(error => {
      console.error("Error searching members:", error);
    });
};

const searchWatches = () => {
  adminStore.getWatches()
    .then(() => {
      adminStore.products = adminStore.products.filter(watch => {
        if (!watch) return false;

        // Ensure member properties are defined
        const id = watch.watch_id ? watch.watch_id.toString().toLowerCase() : '' ;
        const name = watch.watch_name ? watch.watch_name.toLowerCase() : '' 
        const seller = watch.seller.user_log_info.username ? watch.seller.user_log_info.username.toLowerCase() : ''

        // Convert query to lower case
        const query = qWatches.value.toLowerCase();

        // Check if any field includes the search query
        return (
          id.includes(query) || 
          name.includes(query) ||
          seller.includes(query)
        );
      });
    })
    .catch(error => {
      console.error("Error searching watches:", error);
    });
};

const searchPendingWatches = () => {
  adminStore.getWatches()
    .then(() => {
      adminStore.products = adminStore.products.filter(watch => {
        if (!watch) return false;
        else if(watch.state === 0){
          // Ensure member properties are defined
          const id = watch.watch_id ? watch.watch_id.toString().toLowerCase() : '' ;
          const name = watch.watch_name ? watch.watch_name.toLowerCase() : '' 
          const seller = watch.seller.user_log_info.username ? watch.seller.user_log_info.username.toLowerCase() : ''
  
          // Convert query to lower case
          const query = qWatches.value.toLowerCase();
  
          // Check if any field includes the search query
          return (
            id.includes(query) || 
            name.includes(query) ||
            seller.includes(query)
          );
        }
      });
    })
    .catch(error => {
      console.error("Error searching watches:", error);
    });
};

const searchOrders = () => {
  adminStore.getOrders()
    .then(() => {
      adminStore.orders = adminStore.orders.filter(order => {
        if (!order) return false;

        // Ensure member properties are defined
        const id = order.order_id ? order.order_id.toString().toLowerCase() : '';
        const receiveName = order.receive_name ? order.receive_name.toLowerCase() : '';
        const date = order.create_time ? new Date(order.create_time).toLocaleDateString().toLowerCase() : '';

        // Convert query to lower case
        const query = qOrders.value.toLowerCase();

        // Check if any field includes the search query
        return (
          id.includes(query) || 
          receiveName.includes(query) ||
          date.includes(query)
        );
      });
    })
    .catch(error => {
      console.error("Error searching orders:", error);
    });
};

// Define a method to promote a user to staff
const promoteToStaff = async () => {
  if (!userId.value) return; // Không cần thiết vì nút đã bị disabled, nhưng thêm để chắc chắn

  try {
    const memberExists = await checkMemberExists(userId.value);
    if (!memberExists) {
      alert("ID người dùng không đúng hoặc không tồn tại");
      return;
    }

    await adminStore.promoteToStaff(userId.value);
    await adminStore.getMembers();
    alert("Thêm làm nhân viên thành công");
  } catch (error) {
    console.error("Failed to promote user:", error);
    alert("Có lỗi xảy ra khi thêm làm nhân viên");
  }
};

const checkMemberExists = async (id) => {
  try {
    const member = getMember(id);
    return !!member;
  } catch (error) {
    console.error("Error checking member existence:", error);
    return false;
  }
};

// Open the ban modal
const openBanModal = (member) => {
  selectedMember.value = member;
  isBanModalOpen.value = true;
};

// Close the ban modal
const closeBanModal = () => {
  isBanModalOpen.value = false;
  banMessage.value = "";
  selectedMember.value = null;
};
const isLoading = ref(false)
// Confirm ban user

const confirmBanUser = async () => {
  isLoading.value = true;
  if (selectedMember.value) {
    try {
      await useChatStore().registerUser2(selectedMember.value.member_id);
      await useChatStore().sendMessage(
        selectedMember.value.member_id,
        `Tài khoản mang tên ${selectedMember.value.user_log_info.username} đã bị cấm khỏi nền tảng! Lý do: ${banMessage.value}.`
      );
      await useMailStore().send(
        selectedMember.value.email,
        "THÔNG BÁO BẠN ĐÃ BỊ BAN KHỎI TIME HARMONY.",
        `Tài khoản mang tên ${selectedMember.value.user_log_info.username} đã bị cấm khỏi nền tảng! Lý do: ${banMessage.value}.`
      );
      await useAdminStore().ban(selectedMember.value.user_log_info.username);
      
      // Refresh the members list to update the UI
      await adminStore.getMembers();
      
      // Update the specific member in the filteredMembers list
      const index = filteredMembers.value.findIndex(m => m.member_id === selectedMember.value.member_id);
      if (index !== -1) {
        filteredMembers.value[index].user_log_info.enabled = 0;
      }
    } catch (error) {
      console.error("Error banning user:", error);
    } finally {
      closeBanModal();
      isLoading.value = false;
    }
  }
};

const unbanUser = async (member) => {
  try {
    isLoading.value = true;
    await useChatStore().removeChat(useAuthStore().user_id, member.member_id);
    await useAdminStore().unBan(member.user_log_info.username);
    
    // Refresh the members list to update the UI
    await adminStore.getMembers();
    
    // Update the specific member in the filteredMembers list
    const index = filteredMembers.value.findIndex(m => m.member_id === member.member_id);
    if (index !== -1) {
      filteredMembers.value[index].user_log_info.enabled = 1;
    }
  } catch (error) {
    console.error("Error unbanning user:", error);
  } finally {
    isLoading.value = false;
  }
};

const sendEmail = async (transactionNo, member_id) => {
  if (transactionNo && member_id) {
    const transaction = filteredNullOrders.value.find(t => t.transaction_no === transactionNo);
    if (!transaction) {
        throw new Error("Transaction not found");
      }
    const u = userStore.loadUser(member_id)
      try {
        useMailStore().send(
          (await u).email,
          "THÔNG BÁO HOÀN TIỀN",
          `Time Harmony xin thông báo: Đơn đặt hàng của người dùng ${(await u).first_name} ${(await u).last_name} được tạo vào thời điểm ${formatDate(transaction.create_at)} với mã giao dịch ${transactionNo} có số tiền: ${currency(transaction.payment_amount)} đã xảy ra lỗi ngoài ý muốn. Chúng tôi xin lỗi về sự cố xảy ra trong quá trình xác nhận đơn hàng. Đơn hàng sẽ được hoàn tiền ngay khi có thể. Xin cảm ơn bạn đã thông cảm và kiên nhẫn đợi.`
          );

        useAdminStore().deleteOrdersNull(transactionNo)
        // Thông báo gửi email thành công
        alert("Email đã được gửi thành công!");
        await adminStore.getOrdersNull();
        // Có thể thêm logic để cập nhật trạng thái giao dịch nếu cần
      } catch (error) {
        console.error("Error sending email:", error);
        alert("Có lỗi xảy ra khi gửi email. Vui lòng thử lại.");
      }
    } else {
      alert("Không tìm thấy thông tin Người Dùng.");
    }
  
};
// Compute financial metrics with error handling
const totalCost = computed(() => {
  try {
    return filteredWatches.value.reduce((sum, product) => sum + (product?.price || 0), 0);
  } catch (err) {
    console.error("Error calculating totalCost:", err);
    error.value = "Error calculating total cost. Please try again.";
    return 0;
  }
});

const totalRevenue = computed(() => {
  try {
    return filteredOrders.value.reduce((sum, order) => sum + (order?.total_price || 0), 0);
  } catch (err) {
    console.error("Error calculating totalRevenue:", err);
    error.value = "Error calculating total revenue. Please try again.";
    return 0;
  }
});

const totalProfit = computed(() => totalRevenue.value * 0.02);

const monthlyData = computed(() => {
  const currentMonth = new Date().getMonth();
  const data = Array(12).fill(0).map((_, index) => ({
    revenue: index === currentMonth ? totalRevenue.value : 0,
    cost: index === currentMonth ? totalCost.value : 0,
    profit: index === currentMonth ? totalProfit.value : 0,
  }));
  return data;
});

const createOverviewChart = () => {
  const ctx = overviewChart.value.getContext('2d');
  overviewChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', '2024', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          label: 'Doanh Thu Tổng',
          data: monthlyData.value.map(month => month.revenue),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Chi Phí Tổng',
          data: monthlyData.value.map(month => month.cost),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Lợi Nhuận Tổng',
          data: monthlyData.value.map(month => month.profit),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    },
    options: chartOptions
  });
};

const createRevenueChart = () => {
  const ctx = revenueChart.value.getContext('2d');
  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [{
        label: 'Doanh Thu Tổng',
        data: monthlyData.value.map(month => month.revenue),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }]
    },
    options: chartOptions
  });
};

const createCostChart = () => {
  const ctx = costChart.value.getContext('2d');
  costChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [{
        label: 'Chi Phí Tổng',
        data: monthlyData.value.map(month => month.cost),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1
      }]
    },
    options: chartOptions
  });
};

const createProfitChart = () => {
  const ctx = profitChart.value.getContext('2d');
  profitChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [{
        label: 'Lợi Nhuận Tổng',
        data: monthlyData.value.map(month => month.profit),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }]
    },
    options: chartOptions
  });
};

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return value.toLocaleString('vi-VN') + ' ₫';
        }
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString('vi-VN') + ' ₫';
          }
          return label;
        }
      }
    }
  }
};

watch([totalRevenue, totalCost, totalProfit], () => {
  if (overviewChartInstance) {
    overviewChartInstance.data.datasets[0].data = monthlyData.value.map(month => month.revenue);
    overviewChartInstance.data.datasets[1].data = monthlyData.value.map(month => month.cost);
    overviewChartInstance.data.datasets[2].data = monthlyData.value.map(month => month.profit);
    overviewChartInstance.update();
  }
  if (revenueChartInstance) {
    revenueChartInstance.data.datasets[0].data = monthlyData.value.map(month => month.revenue);
    revenueChartInstance.update();
  }
  if (costChartInstance) {
    costChartInstance.data.datasets[0].data = monthlyData.value.map(month => month.cost);
    costChartInstance.update();
  }
  if (profitChartInstance) {
    profitChartInstance.data.datasets[0].data = monthlyData.value.map(month => month.profit);
    profitChartInstance.update();
  }
}, { deep: true });
// Format currency
const currency = (value) => `${value.toLocaleString("vi-VN")} ₫`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN')
};

</script>

<style scoped>

.back{
  background: linear-gradient(to bottom, #3b3638, #40413a);
}

.appraiser-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.appraiser-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}

.appraiser-item:hover {
  background-color: #f0f0f0;
}

.appraiser-item.selected {
  background-color: var(--primary);
  color: white;
}

.date-picker {
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-btn {
  background-color: var(--primary);
  color: white;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #ccc;
}


.disabled-btn {
  border: 1px solid #888;
  background-color: #888;
  cursor: not-allowed;
}

.admin-page {
  background-color: #212121;
  color: var(--secondary);
}

.chart-grid {
  display: flex;
  justify-content: space-between;
}

.chart-container, .chart-container-large {
  flex: 1;
  height: 300px; /* hoặc kích thước phù hợp khác */
}

.chart-container-large {
  height: 500px;
  width: 100%;
  margin-top: 20px;
}

.table-container {
  overflow-x: auto;
  max-height: 400px; /* Adjust this value as needed */
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: var(--primary);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10; /* Ensure the table header is above the table rows */
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid var(--secondary);
}

.table-header th {
  background-color: #494949; /* Matches your background color */
}

.table tbody tr:nth-child(even) {
  background-color: #333;
}

.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #ffbd59;
}

.profit-container {
  color: var(--secondary);
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px);
  background: rgba(
    23,
    23,
    23,
    0.5
  );  z-index: 1000; /* Ensure the modal is above all other content */
}

.modal-content {
  background-color: #181818;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: #181818;
}

.confirm-btn {
  margin-top: 10px;
  background-color: var(--primary);
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
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


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 9999;
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
  background: rgba(
    23,
    23,
    23,
    0.5
  ); /* Adjust the alpha value for transparency */
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

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.promoteBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background: rgba(
    23,
    23,
    23,
    0.5
  );
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  gap: 3px;
}

.promote {
  background-color: #1b1b1b;
  padding: 30px; /* Tăng padding từ 20px lên 30px */
  gap: 10px; /* Tăng gap nếu cần */
  min-width: 300px; /* Tăng chiều rộng tối thiểu nếu cần */
}

.promote select {
  background-color: rgba(63, 55, 55 ,0.1);
  color: var(--secondary);
  border: 1px solid var(--secondary);
  gap: 5px;
}

.promote select option {
  background-color: rgba(63, 55, 55);
  color: var(--primary);
  border: 0px solid var(--secondary);
}
</style>
