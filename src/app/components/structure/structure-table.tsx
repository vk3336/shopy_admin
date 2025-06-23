// src/app/components/structure/structure-table.tsx
"use client";

import React from "react";
import Link from "next/link";
import { IStructure } from "@/types/structure-type";
import {
  useGetAllStructuresQuery,
  useDeleteStructureMutation,
} from "@/redux/structure/structureApi";

const StructureTable: React.FC = () => {
  const { data, isLoading, isError } = useGetAllStructuresQuery();
  const [deleteStructure] = useDeleteStructureMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading structures</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Structure List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No structures found.
              </td>
            </tr>
          ) : (
            data.data.map((item: IStructure) => (
              <tr key={item._id}>
                <td className="py-2">
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2">{item.name}</td>
                <td className="py-2 flex space-x-2">
                  {/* Edit navigates to the dynamic edit page */}
                  <Link href={`/structure/${item._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>

                  {/* Delete calls the mutation directly */}
                  <button
                    onClick={() => deleteStructure(item._id!)}
                    className="tp-btn px-3 py-1 bg-red-500 text-white rounded"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StructureTable;
