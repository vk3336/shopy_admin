import { apiSlice } from "../api/apiSlice";
import { IProduct } from "@/types/fabricproduct-type";

export const newProductApi = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // List products
    getProducts: builder.query<{ data: IProduct[] }, { page: number; limit: number }>({
      query: ({ page, limit }) => `/api/newproduct/view?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Product" as const, id: "LIST" },
              ...result.data.map((p) => ({ type: "Product" as const, id: p._id })),
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Single product
    getProductById: builder.query<IProduct, string>({
      query: (id) => `/api/newproduct/view/${id}`,
      transformResponse: (raw: { data: IProduct }) => raw.data,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Create product (multipart/form-data)
    addProduct: builder.mutation<IProduct, FormData>({
      query: (formData) => ({
        url: "/api/newproduct/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Update product (multipart/form-data)
    updateProduct: builder.mutation<
      IProduct,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/api/newproduct/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<{ status: number; data: IProduct }, string>({
      query: (id) => ({ url: `/api/newproduct/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = newProductApi;
