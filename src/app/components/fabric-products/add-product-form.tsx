// File: app/components/fabric-products/AddProductForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductByIdQuery } from "@/redux/newproduct/NewProductApi";
import { filterConfig } from "@/utils/filterconfig";
import { useDispatch } from 'react-redux';
import { setProductMedia } from '@/redux/features/productImageSlice';

// Grab your base API URL from NEXT_PUBLIC_ env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId") ?? undefined;
  const isEdit = Boolean(editId);

  // if editing, fetch the product
  const { data: productDetail } = useGetProductByIdQuery(editId!, {
    skip: !isEdit,
  });

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState<
    { name: string; label: string; options: any[] }[]
  >([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const dispatch = useDispatch();

  // load all filter dropdowns from your backend
  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        filterConfig.map((f) => {
          const url = `${BASE_URL}${f.api}`;
          return fetch(url)
            .then((res) =>
              res.ok ? res.json() : Promise.reject(res.status)
            )
            .catch(() => ({ data: [] }));
        })
      );

      setFilters(
        filterConfig.map((f, i) => ({
          name: f.name,
          label: f.label,
          options: results[i].data || [],
        }))
      );
    })();
  }, []);

  // when productDetail arrives, seed form + previews
  useEffect(() => {
    if (!productDetail) return;
    setFormData(productDetail);

    ["image", "image1", "image2", "video"].forEach((key) => {
      const filename = (productDetail as any)[key];
      if (filename) {
        setPreviews((p) => ({
          ...p,
          [key]: `${BASE_URL}/uploads/${filename}`,
        }));
      }
    });
  }, [productDetail]);

  // generic handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((p) => ({ ...p, [field]: file }));
    if (file) {
      setPreviews((p) => ({
        ...p,
        [field]: URL.createObjectURL(file),
      }));
    }
    // Dispatch to Redux global state
    dispatch(setProductMedia({
      image: field === 'image' ? file : formData.image,
      image1: field === 'image1' ? file : formData.image1,
      image2: field === 'image2' ? file : formData.image2,
      video: field === 'video' ? file : formData.video,
    }));
  };

  // Next → Metadata
  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Do NOT store images in localStorage
    // Only store non-file fields if needed
    const cleanedFormData = { ...formData };
    ["image", "image1", "image2", "video"].forEach((key) => {
      delete cleanedFormData[key];
    });
    localStorage.setItem("NEW_PRODUCT_BASE", JSON.stringify(cleanedFormData));
    router.push(
      isEdit
        ? `/fabric-products/metadata?editId=${editId}`
        : `/fabric-products/metadata`
    );
  };

  return (
    <form
      onSubmit={goNext}
      className="bg-white p-6 my-8 border border-gray-200 rounded-xl max-w-4xl mx-auto space-y-8"
    >
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4 tracking-tight">
        {isEdit ? "Edit" : "Add New"} Fabric Product
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-medium mb-1 text-gray-600">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="um" className="block text-xs font-medium mb-1 text-gray-600">
            Unit (UM)
          </label>
          <select
            id="um"
            name="um"
            value={formData.um || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          >
            <option value="">Select Unit</option>
            <option value="meter">Meter</option>
            <option value="yard">Yard</option>
          </select>
        </div>

        {/* Sales Price */}
        <div>
          <label
            htmlFor="salesPrice"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Sales Price
          </label>
          <input
            id="salesPrice"
            name="salesPrice"
            type="number"
            value={formData.salesPrice || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-xs font-medium mb-1 text-gray-600">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          >
            <option value="">Select Currency</option>
            <option>INR</option>
            <option>USD</option>
          </select>
        </div>

        {/* GSM → OZ */}
        <div>
          <label htmlFor="gsm" className="block text-xs font-medium mb-1 text-gray-600">
            GSM
          </label>
          <input
            id="gsm"
            name="gsm"
            type="number"
            value={formData.gsm || ""}
            onChange={(e) => {
              handleInputChange(e);
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) {
                setFormData((p) => ({ ...p, oz: (v * 0.0295).toFixed(2) }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label htmlFor="oz" className="block text-xs font-medium mb-1 text-gray-600">
            OZ
          </label>
          <input
            id="oz"
            name="oz"
            readOnly
            value={formData.oz || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Width CM → Inch */}
        <div>
          <label htmlFor="cm" className="block text-xs font-medium mb-1 text-gray-600">
            Width (CM)
          </label>
          <input
            id="cm"
            name="cm"
            type="number"
            value={formData.cm || ""}
            onChange={(e) => {
              handleInputChange(e);
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) {
                setFormData((p) => ({
                  ...p,
                  inch: (v * 0.393701).toFixed(2),
                }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label htmlFor="inch" className="block text-xs font-medium mb-1 text-gray-600">
            Width (Inch)
          </label>
          <input
            id="inch"
            name="inch"
            readOnly
            value={formData.inch || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Dynamic filters */}
        {filters.map((f) => (
          <div key={f.name}>
            <label
              htmlFor={f.name}
              className="block text-xs font-medium mb-1 text-gray-600"
            >
              {f.label}
            </label>
            <select
              id={f.name}
              name={f.name}
              value={formData[f.name] || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
            >
              <option value="">Select {f.label}</option>
              {f.options.map((o: any) => (
                <option key={o._id} value={o._id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Uploads & previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["image", "image1", "image2", "video"].map((key) => (
          <div key={key}>
            <label className="block text-xs font-medium mb-1 text-gray-600">
              {key === "video" ? "Upload Video" : `Upload ${key}`}
            </label>
            <input
              type="file"
              name={key}
              accept={key === "video" ? "video/*" : "image/*"}
              onChange={(e) => handleFileChange(e, key)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
            />
            {previews[key] &&
              (key === "video" ? (
                <video
                  src={previews[key]}
                  controls
                  className="mt-2 w-full h-32 rounded border border-gray-200 bg-gray-50"
                />
              ) : (
                <img
                  src={previews[key]}
                  alt={key}
                  className="mt-2 w-full h-32 object-cover rounded border border-gray-200 bg-gray-50"
                />
              ))}
          </div>
        ))}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition"
        >
          Next → Metadata
        </button>
      </div>
    </form>
  );
}
