import { defineStore } from "pinia";
import axios from "axios";
var api = import.meta.env.VITE_API_PORT
export const useVoucherStore = defineStore("voucher", {
  state: () => ({
    vouchers: [],
    loading: false,
    error: null,
  }),
  actions: {
    async uploadVoucher(voucherInfo) {
      this.loading = true;
      this.error = null;

      const voucheri4 = {
        name: voucherInfo.name,
        description: voucherInfo.description,
        value_percentage: voucherInfo.value_percentage,
        value: voucherInfo.value,
        limit: voucherInfo.limit,
        condition: voucherInfo.condition,
        expired_date: voucherInfo.expired_date * 24,
        quantity: voucherInfo.quantity
      };

      try {
        const response = await axios.post(`${api}/staff/create/voucher`, voucheri4);
        console.log(response.data);
      } catch (error) {
        this.error = error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async getAllVoucher() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${api}/staff/get/voucher/all`);
        this.vouchers = response.data;
        console.log(response.data);
      } catch (error) {
        this.error = error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  },
});
