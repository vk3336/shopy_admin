"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import EditSuitableFor from "@/app/components/suitablefor/edit-suitable";

export default function EditSuitableForPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  if (!id) return <Wrapper><p className="p-8 text-red-500">No item selected.</p></Wrapper>;

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Edit SuitableFor" subtitle="" />
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-md shadow p-8">
            <EditSuitableFor id={id} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
