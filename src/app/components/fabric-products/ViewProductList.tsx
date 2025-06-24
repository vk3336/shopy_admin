// File: app/components/fabric-products/ViewProductTable.tsx
"use client";

import React, { useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { useRouter } from "next/navigation";
import { Edit3, Trash2 } from "lucide-react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/redux/newproduct/NewProductApi";
import { IFabricProduct } from "@/types/fabricproduct-type";

export default function ViewProductTable() {
  const router = useRouter();
  const { data: resp, isLoading, isFetching } = useGetProductsQuery({
    page: 1,
    limit: 1000,
  });
  const [deleteProduct] = useDeleteProductMutation();

  const products: IFabricProduct[] = resp?.data || [];
  const [filterText, setFilterText] = useState("");

  // Filter logic
  const filtered = useMemo(() => {
    const lower = filterText.toLowerCase();
    return products.filter(
      (p) =>
        (typeof p.name === 'string' ? p.name : '').toLowerCase().includes(lower) ||
        (typeof p.sku === 'string' ? p.sku : '').toLowerCase().includes(lower) ||
        (typeof p.newCategoryId === 'string' ? p.newCategoryId : '').toLowerCase().includes(lower)
    );
  }, [products, filterText]);

  // PDF export
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Fabric Products", 14, 20);
    (doc as any).autoTable({
      startY: 26,
      head: [["Name","SKU","GSM","OZ","CM","Inch","Qty","Unit","Price","Currency"]],
      body: filtered.map((p) => [
        p.name,
        p.sku || "—",
        p.gsm,
        p.oz,
        p.cm,
        p.inch,
        p.quantity,
        p.um,
        p.salesPrice || 0,
        p.currency,
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("fabric-products.pdf");
  };

  // Columns
  const columns: TableColumn<IFabricProduct>[] = useMemo(
    () => [
      { name: "Name", selector: r => r.name, sortable: true, minWidth: "150px" },
      { name: "SKU", selector: r => r.sku||"—", maxWidth: "80px" },
      { name: "GSM", selector: r => r.gsm, maxWidth: "60px" },
      { name: "OZ", selector: r => r.oz, maxWidth: "60px" },
      { name: "CM", selector: r => r.cm, maxWidth: "60px" },
      { name: "Inch", selector: r => r.inch, maxWidth: "70px" },
      { name: "Qty", selector: r => r.quantity, maxWidth: "60px" },
      { name: "Unit", selector: r => r.um, maxWidth: "80px" },
      { name: "Price", selector: r => r.salesPrice || 0, maxWidth: "80px" },
      { name: "Currency", selector: r => r.currency, maxWidth: "80px" },
      // …you can keep adding more columns as you need…
      {
        name: "Actions",
        right: true,
        minWidth: "100px",
        cell: row => (
          <div className="flex items-center space-x-2">
            <Edit3
              className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => router.push(`/fabric-products/edit/${row._id}`)}
            />
            <Trash2
              className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
              onClick={async () => {
                if (confirm(`Delete "${row.name}"?`)) {
                  await deleteProduct(row._id).unwrap();
                }
              }}
            />
          </div>
        )
      }
    ],
    [deleteProduct, router]
  );

  // Sub-header
  const subHeaderComponent = useMemo(() => (
    <div className="flex flex-wrap items-center space-x-2">
      <input
        type="text"
        placeholder="Search by name, SKU…"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        className="border rounded px-3 py-1 w-64"
      />
      <button
        onClick={() => setFilterText("")}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
      >Clear</button>
      <CSVLink
        data={filtered}
        filename="fabric-products.csv"
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >Export CSV</CSVLink>
      <button
        onClick={exportPDF}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >Export PDF</button>
    </div>
  ), [filterText, filtered]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-4">All Fabric Products</h2>

      {/* wrap in overflow-x-auto */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filtered}
          progressPending={isLoading||isFetching}
          pagination
          highlightOnHover
          pointerOnHover
          subHeader
          subHeaderComponent={subHeaderComponent}
          persistTableHead
          responsive={false}             // disable built-in responsive to keep horizontal scroll
          customStyles={{
            table: { style: { minWidth: "1200px" } }, // force the table wider than its container
            headRow: { style: { background: "#2563EB", color: "white" } },
            headCells: { style: { fontSize: "14px", fontWeight: 600 } },
          }}
        />
      </div>
    </div>
  );
}
