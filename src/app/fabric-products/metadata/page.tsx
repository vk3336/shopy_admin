// File: app/fabric-products/metadata/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MetadataForm from "@/app/components/fabric-products/metadataform";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/redux/newproduct/NewProductApi";
import Wrapper from "@/layout/wrapper";

export default function MetadataPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("editId");

  const [baseData, setBaseData] = useState<Record<string, any> | null>(null);
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    const raw = localStorage.getItem("NEW_PRODUCT_BASE");
    if (!raw) {
      router.replace("/fabric-products/add");
      return;
    }
    setBaseData(JSON.parse(raw));
  }, [router]);

  const handleMetadataSubmit = async (meta: Record<string, any>) => {
    if (!baseData) return;

    // 1) merge the two halves of your form
    const full = { ...baseData, ...meta };
    const fd = new FormData();
    Object.entries(full).forEach(([k, v]) => {
      if (v != null) {
        fd.append(k, v as any);
      }
    });

    try {
      if (editId) {
        // 2) use the `body` key to match your builder signature
        await updateProduct({ id: editId, body: fd }).unwrap();
      } else {
        await addProduct(fd).unwrap();
      }

      localStorage.removeItem("NEW_PRODUCT_BASE");
      router.push("/fabric-products/view");
    } catch (err: any) {
      // 3) extract validation errors if present
      console.error("Product mutation failed:", err);

      let message = "Failed to save product";
      if (err.data) {
        // if your backend returns an array of { path, message }
        if (Array.isArray(err.data.errorMessages)) {
          message = err.data.errorMessages
            .map((e: any) => `${e.path}: ${e.message}`)
            .join("\n");
        }
        // otherwise if there's a top-level message
        else if (typeof err.data.message === "string") {
          message = err.data.message;
        }
      }

      alert(message);
    }
  };

  const goBack = () => {
    if (editId) {
      router.push(`/fabric-products/edit/${editId}`);
    } else {
      router.push("/fabric-products/add");
    }
  };

  if (!baseData) return null; // or a loader

  return (
    <Wrapper>
      <div className="py-12">
        <h1 className="text-2xl font-bold text-center mb-6">Product Metadata</h1>
        <MetadataForm
          initial={{}}
          onSubmit={handleMetadataSubmit}
          onBack={goBack}
        />
      </div>
    </Wrapper>
  );
}
