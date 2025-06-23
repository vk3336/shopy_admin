import { apiSlice } from "../api/apiSlice";
import { IStructure } from "@/types/structure-type";

export const structureApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  tagTypes: ["AllStructures"],
  endpoints: (builder) => ({
    getAllStructures: builder.query<{ data: IStructure[] }, void>({
      query: () => "/api/structure/view",
      providesTags: ["AllStructures"],
      keepUnusedDataFor: 600,
    }),

    // Fetch one by ID
    getStructure: builder.query<{ data: IStructure }, string>({
      query: (id) => `/api/structure/view/${id}`,     // ← include the id here
      providesTags: (result, error, id) => [{ type: "AllStructures", id }],
      keepUnusedDataFor: 300,
    }),

    addStructure: builder.mutation<{ data: IStructure }, Partial<IStructure>>({
      query: (data) => ({
        url: "/api/structure/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AllStructures"],
    }),

    updateStructure: builder.mutation<
      { data: IStructure },
      { id: string; changes: Partial<IStructure> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/structure/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: ["AllStructures"],
    }),

    deleteStructure: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/structure/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllStructures"],
    }),
  }),
});

export const {
  useGetAllStructuresQuery,
  useGetStructureQuery,      // now correctly calls /api/structure/view/:id
  useAddStructureMutation,
  useUpdateStructureMutation,
  useDeleteStructureMutation,
} = structureApi;
