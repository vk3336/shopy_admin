import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      try {
        const userInfo = Cookies.get("admin");
        if (userInfo) {
          const { accessToken } = JSON.parse(userInfo);
          if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
        }
      } catch {
        // ignore
      }
      return headers;
    },
  }),
  tagTypes: [
    "DashboardAmount",
    "DashboardSalesReport",
    "DashboardMostSellingCategory",
    "DashboardRecentOrders",
    "AllProducts",
    "StockOutProducts",
    "AllCategory",
    "AllBrands",
    "getCategory",
    "AllOrders",
    "getBrand",
    "ReviewProducts",
    "AllCoupons",
    "Coupon",
    "AllStaff",
    "Stuff",
    "AllFilters",
    "getFilter",
    "Product",   // ← ensure Product is declared here
  ],
  endpoints: () => ({}),
});
