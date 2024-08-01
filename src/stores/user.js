import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import { useChatStore } from "./chat";
var api = import.meta.env.VITE_API_PORT;
export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    address: [],
    phone: "",
    image: "https://files.catbox.moe/n1w3b0.png",
    active: "",
    user_id: null, // Add this to your state
    selectedItems: [],
    totalPrice: 0,
    shipFee: 0,
    shippingAddress: null,
    note: "",
    mostRecentOrderId: null,
    pendingOrder: null,
    transaction_no: null,
    payment_method: null,
    cart_num: 0,
    role: null,
    staff_role: null,
    pendingWids: [],
    profitByMonth: [],
    totalProfit: 0,
    postedWatches: 0,
    soldWatches: 0,
    isVerify: false,
  }),

  actions: {
    setPendingWids(wids) {
      this.pendingWids = wids;
    },
    setCurrentOrder(order) {
      this.currentOrder = order;
    },
    clearCurrentOrder() {
      this.currentOrder = null;
    },
    setOrderDetails(items, price, address, note) {
      this.selectedItems = items;
      this.totalPrice = price;
      this.shippingAddress = address;
      this.note = note;
    },
    clearOrderDetails() {
      this.selectedItems = [];
      this.totalPrice = 0;
      this.shippingAddress = null;
      this.note = "";
    },
    getFavorites() {
      this.wait_fav.add;
      return [...this.state.cur_fav, ...this.state.wait_fav];
    },
    setUsername(username) {
      this.username = username;
    },
    setCartNum(num) {
      this.cart_num = num;
    },
    updateCartCount(count) {
      this.cart_num = count;
    },

    async getFavoritesFromServer(user_id) {
      try {
        console.log("Prepare");
        const response = await axios.get(
          `${api}/member/get/favorites/${user_id}`
        );
        console.log("Get OK");
        return response.data; // Assuming this returns an array of favorite watch objects
      } catch (error) {
        console.error("Error fetching favorites:", error);
        throw error;
      }
    },

    async saveFavoritesToServer(user_id, watch_id) {
      if (!user_id) {
        console.error("No user ID provided");
        return;
      }
      try {
        console.log("Preparing to save favorites:", watch_id);
        const response = await axios.post(
          `${api}/member/add/favorites/${user_id}-${watch_id}`
        );
        console.log("aaaaaaaa: " + response.data);

        if (response.data && response.status === 200) {
          console.log("Favorites saved successfully:", response.data);
        } else {
          console.error("Unexpected response from server:", response);
        }
      } catch (error) {
        console.error(
          "Error saving favorites:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    },

    async deleteFavorite(user_id, watch_id) {
      try {
        const response = await axios.delete(
          `${api}/member/delete/favorites/${user_id}?wid=${watch_id}`
        );
        console.log("Favorite deleted successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error deleting favorite:", error);
        throw error;
      }
    },

    addToWaitFav(watch_id) {
      if (
        !this.wait_fav.includes(watch_id) &&
        !this.cur_fav.includes(watch_id)
      ) {
        this.wait_fav.push(watch_id);
      }
    },

    removeFromWaitFav(watch_id) {
      const indexWait = this.wait_fav.indexOf(watch_id);
      if (indexWait > -1) {
        this.wait_fav.splice(indexWait, 1);
      }
      const indexCur = this.cur_fav.indexOf(watch_id);
      if (indexCur > -1) {
        this.cur_fav.splice(indexCur, 1);
      }
    },

    isWatchFavorite(watch_id) {
      return (
        this.cur_fav.includes(watch_id) || this.wait_fav.includes(watch_id)
      );
    },

    async signUp(userData) {
      try {
        const response = await axios.post(
          `${api}/guest/register/member`,
          userData
        );
        console.log("Signup successful", response);
        return response;
      } catch (error) {
        console.error("Signup error", error);
        throw error;
      }
    },

    async addToCart(member_id, watch_id) {
      try {
        const response = await axios.post(
          `${api}/member/add/to-cart/${member_id}?watch_id=${watch_id}`
        );

        return response.data;
      } catch (error) {
        console.error("Cart addition error", error);
        throw error;
      }
    },

    async deleteWatchCart(member_id, watch_ids) {
      try {
        const url = `${api}/member/delete/carts/${member_id}`;
        const data = { wids: watch_ids };
        console.log("Deleting cart items with URL:", url);
        console.log("Data being sent:", data);
        const response = await axios.delete(url, { data });
        console.log("Watch cart deleted successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error deleting watch cart:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        throw error;
      }
    },

    async loadUser(user_id) {
      try {
        const res = await axios.get(`${api}/member/get/${user_id}`);
        const fav = await axios.get(`${api}/member/get/favorites/${user_id}`);
        console.log("Member data:", res.data);

        // Update the state with user data
        this.username = res.data.user_log_info.username;
        this.email = res.data.email;
        this.first_name = res.data.first_name;
        this.last_name = res.data.last_name;
        this.address = res.data.address;
        this.phone = res.data.phone;
        this.image = res.data.member_image;
        this.active = res.data.active;
        this.user_id = res.data.member_id;
        this.cur_fav = fav.data;
        this.role = res.data.user_log_info.authorities.authority;
        this.staff_role = res.data.staff_role;
        
        return {
          username: this.username,
          email: this.email,
          first_name: this.first_name,
          last_name: this.last_name,
          address: this.address,
          phone: this.phone,
          image: this.image,
          active: this.active,
          user_id: this.user_id,
          role: this.role,
          staff_role: this.staff_role,
        };
      } catch (err) {
        console.error("Error fetching member data:", err);
      }
    },

    async getUserInfo(user_id) {
      try {
        const res = await axios.get(`${api}/member/get/${user_id}`);
        console.log("Member data:", res.data);

        // Construct and return the user JSON
        const userInfo = {
          username: res.data.user_log_info.username,
          email: res.data.email,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          address: res.data.address,
          phone: res.data.phone,
          image: res.data.member_image,
          active: res.data.active,
          user_id: res.data.member_id,
          watches: res.data.watches,
        };

        return userInfo;
      } catch (err) {
        console.error("Error fetching member data:", err);
        throw err;
      }
    },

    // Add this to the actions in useUserStore
    async addAddress(user_id, addressData) {
      try {
        const response = await axios.post(
          `${api}/member/save/address/${user_id}`,
          {
            name: addressData.name,
            phone: addressData.phone,
            detail: addressData.detail,
            default: addressData.default,
          }
        );
        console.log("Address saved successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error saving address:", error);
        throw error;
      }
    },
    async getAddressDetails(user_id) {
      try {
        const response = await axios.get(
          `${api}/member/get/address/${user_id}`
        );
        return response.data.map((address) => ({
          id: address.address_id,
          name: address.name,
          phone: address.phone,
          address: address.address_detail,
          isDefault: address._default,
        }));
      } catch (error) {
        console.error("Error fetching address details:", error);
        throw error;
      }
    },
    async deleteAddress(id, addressid) {
      try {
        const response = await axios.delete(
          `${api}/member/delete/address/${id}?a_id=${addressid}`
        );
        console.log("Full list response:", response.data);
        return response.data; // This will return the entire response object
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
    setPendingOrder(orderData) {
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
    },

    getPendingOrder() {
      const pendingOrder = localStorage.getItem("pendingOrder");
      return pendingOrder ? JSON.parse(pendingOrder) : null;
    },

    clearPendingOrder() {
      localStorage.removeItem("pendingOrder");
    },

    async addOrder(user_id, orderData) {
      try {
        const dataToUse = orderData || this.getPendingOrder();
        if (!dataToUse) {
          throw new Error("No order data available");
        }

        console.log('Sending order data to API:', orderData);
        const response = await axios.post(
          `${api}/member/add/order/${user_id}`,
          dataToUse
        );
        this.mostRecentOrderId = response.data.order_id;
        this.clearPendingOrder(); // Clear pending order after successful creation
        return response.data;
      } catch (error) {
        console.error("Error adding order:", error);
        throw error;
      }
    },

    async getAllOrders(user_id) {
      try {
        const response = await axios.get(`${api}/member/get/order/${user_id}`);
        console.log("Full getAllOrders response:", response.data);

        // Return all orders, sorted by create_time in descending order
        return response.data.orders.sort(
          (a, b) => new Date(b.create_time) - new Date(a.create_time)
        );
      } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
      }
    },
    async getNewestOrder(user_id) {
      try {
        const response = await axios.get(`${api}/member/get/order/${user_id}`);
        console.log("Full getOrder response:", response.data);

        // Sort orders by create_time in descending order (most recent first)
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.create_time) - new Date(a.create_time)
        );
        console.log(sortedOrders[0].order_id);
        // Return the most recent order (first in the sorted array)
        return sortedOrders[0].order_id;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    },
    async getOrderState(order_id) {
      try {
        const response = await axios.get(
          `${api}/member/get/order/state/${order_id}`
        );
        console.log("Full state response:", response.data);
        return response.data; // This will return the entire response object
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
    async getOrderWaiting(seller_id) {
      try {
        const response = await axios.get(
          `${api}/seller/get/waiting/${seller_id}`
        );
        console.log("Full list response:", response.data);
        return response.data; // This will return the entire response object
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
    async getOrderOfWatch(watch_id) {
      try {
        const response = await axios.get(`${api}/seller/get/order/${watch_id}`);
        console.log("Full list response:", response.data);
        return response.data; // This will return the entire response object
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
    async getOrderDetail(order_id) {
      try {
        const response = await axios.get(
          `${api}/member/get/order/detail/${order_id}`
        );
        console.log("Full getOrderDetail response:", response.data);
        return response.data; // This will return the entire response object
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
    async getOrderTransactionNo(order_id) {
      try {
        const response = await axios.get(
          `${api}/member/get/tno/${order_id}`
        );
        console.log("Full getOrderDetail transaction response:", response.data);
        return response.data; // This will return the entire response object
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
    async cancelOrder(order_id) {
      try {
        const response = await axios.put(
          `${api}/member/cancel/order/${order_id}`
        );
        console.log(' Order ID:' + order_id  + "Full Cancel Order response:", response.data);
        return response.data; // This will return the entire response object
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },

    async uploadAvatar(imageFile) {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const data = await response.json();
        const imageUrl = data.secure_url;

        await this.updateImage(imageUrl);
        this.image = imageUrl; // Update the store state with the new image URL
        console.log("Avatar updated successfully");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
      }
    },

    async updateImage(imageUrl) {
      try {
        const response = await axios.patch(
          `${api}/member/update/user/image/${this.user_id}?url=${imageUrl}`
        );
        console.log("Image updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating image:", error);
        throw error;
      }
    },

    async getUserByEmail(email) {
      const response = await axios.get(`${api}/member/getbyemail/${email}`);
      if (response.data === "") {
        console.log("No user found for email:", email);
      } else {
        console.log(response.data);
        this.setUsername(response.data.user_log_info.username);
        return response.data;
      }
    },
    async setShipping(watch_id, order_id) {
      try {
        const response = await axios.put(
          `${api}/seller/ship/${watch_id}?order_id=${order_id}`
        );
        console.log("Full shipping response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error confirming shipping:", error);
        throw error;
      }
    },

    async confirmShip(order_id) {
      try {
        const response = await axios.post(
          `${api}/member/confirm-success/order/${order_id}`
        );
        console.log("Full shipping response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error confirming shipping:", error);
        throw error;
      }
    },
    async getProfitOfSeller(seller_id) {
      try {
        const response = await axios.get(
          `${api}/seller/get/seller-total-profit/${seller_id}`
        );
        console.log("Total profit response:", response.data);
        this.totalProfit = response.data.total_profit;
        return response.data;
      } catch (error) {
        console.error("Error fetching total profit:", error);
        throw error;
      }
    },

    async getProfitOfSellerByMonth(seller_id, month) {
      try {
        const response = await axios.get(
          `${api}/seller/get/seller-profit-by-month/${seller_id}/month=${month}`
        );
        console.log("Monthly profit response:", response.data);
        this.profitByMonth = response.data.monthly_profit;
        return response.data;
      } catch (error) {
        console.error("Error fetching monthly profit:", error);
        throw error;
      }
    },
    async getProfitOfSellerByDate(seller_id, date) {
      try {
        const response = await axios.get(
          `${api}/seller/get/seller-profit-by-day/${seller_id}/day=${date}`
        );
        console.log("Daily profit response:", response.data);
        this.profitByMonth = response.data.monthly_profit;
        return response.data;
      } catch (error) {
        console.error("Error fetching monthly profit:", error);
        throw error;
      }
    },
    async countPostWatch(seller_id) {
      try {
        const response = await axios.get(
          `${api}/seller/count/post-watches/${seller_id}`
        );
        console.log("Posted watches response:", response.data);
        this.postedWatches = response.data.posted_watches;
        return response.data;
      } catch (error) {
        console.error("Error fetching posted watches count:", error);
        throw error;
      }
    },

    async countSoldWatch(seller_id) {
      try {
        const response = await axios.get(
          `${api}/seller/count/sold-watches/${seller_id}`
        );
        console.log("Sold watches response:", response.data);
        this.soldWatches = response.data.sold_watches;
        return response.data;
      } catch (error) {
        console.error("Error fetching sold watches count:", error);
        throw error;
      }
    },

    async deleteUser(user_id) {
      try {
        const response = await axios.delete(
          `${api}/member/delete/user/${user_id}`
        );
        console.log("Sold watches response:", response.data);
        this.soldWatches = response.data.sold_watches;
        return response.data;
      } catch (error) {
        console.error("Error fetching sold watches count:", error);
        throw error;
      }
    },

    updateUserInfo(id, updateData) {
      return axios
        .put(`${api}/member/update/member/${id}`, updateData)
        .then((res) => {
          console.log(res.data);
          // Update the local user state with the changes
          this.$patch(updateData);
        })
        .catch((err) => {
          console.log(err);
          throw err; // Re-throw the error to handle it in the submit function
        });
    },    
  },
});
