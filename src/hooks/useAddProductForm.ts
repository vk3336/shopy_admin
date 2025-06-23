// File: src/hooks/useAddProductForm.tsx
"use client";                                 // ← add this!
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { filterConfig } from "@/utils/filterconfig";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000";

export const useAddProductForm = () => {
  const router = useRouter();                   // ← now valid
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState<any[]>([]);
  const [previewMedia, setPreviewMedia] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewMedia((prev) => ({ ...prev, [field]: url }));
    } else {
      setPreviewMedia((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const body = new FormData();
      for (const [k, v] of Object.entries(formData)) {
        if (v != null) body.append(k, v as any);
      }

      const res = await fetch(`/api/newproduct/add`, {
        method: "POST",
        body,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to add product");
      }

      // success!
      alert("Product added 🎉");
      setFormData({});
      setPreviewMedia({});

      // redirect to your view page
      router.push("/fabric-products/view");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        filterConfig.map((f) =>
          fetch(f.api)
            .then((r) => r.json())
            .catch(() => ({ data: [] }))
        )
      );
      setFilters(
        filterConfig.map((f, i) => ({
          ...f,
          options: results[i].data || [],
        }))
      );
    })();
  }, []);

  return {
    formData,
    filters,
    previewMedia,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  };
};
