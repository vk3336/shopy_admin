// src/redux/vendor/vendorApi.ts
import { apiSlice } from "../api/apiSlice";
import { IVendor } from "@/types/vendor-type";

export const vendorApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  tagTypes: ["Vendor"],
  endpoints: (builder) => ({
    getAllVendors: builder.query<{ data: IVendor[] }, void>({
      query: () => "/api/vendor/view",
      providesTags: (res) =>
        res
          ? [
              { type: "Vendor" as const, id: "LIST" },
              ...res.data.map((v) => ({ type: "Vendor" as const, id: v._id })),
            ]
          : [{ type: "Vendor", id: "LIST" }],
    }),
    getVendor: builder.query<{ data: IVendor }, string>({
      query: (id) => `/api/vendor/view/${id}`,   // ← include the ID here
      providesTags: (res, err, id) => [{ type: "Vendor", id }],
      keepUnusedDataFor: 300,
    }),
    addVendor: builder.mutation<{ data: IVendor }, Partial<IVendor>>({
      query: (body) => ({ url: "/api/vendor/add", method: "POST", body }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
    }),
    updateVendor: builder.mutation<
      { data: IVendor },
      { id: string; changes: Partial<IVendor> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/vendor/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Vendor", id },
        { type: "Vendor", id: "LIST" },
      ],
    }),
    deleteVendor: builder.mutation<{ status: number }, string>({
      query: (id) => ({ url: `/api/vendor/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [
        { type: "Vendor", id },
        { type: "Vendor", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllVendorsQuery,
  useGetVendorQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;
