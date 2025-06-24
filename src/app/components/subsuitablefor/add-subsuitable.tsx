// src/app/components/subsuitablefor/add-subsuitablefor.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ISubSuitableFor } from "@/types/subsuitable-type";
import { useAddSubSuitableForMutation } from "@/redux/subsuitablefor/suitableForApi";
// ← correct import for parent dropdown:
import { useGetAllSuitableForQuery } from "@/redux/suitableFor/suitableForApi";
import ErrorMsg from "@/app/components/common/error-msg";

type FormVals = { name: string; suitableForId: string };

export default function AddSubSuitableFor() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormVals>({ mode: "onSubmit" });

  const [addSF] = useAddSubSuitableForMutation();
  const { data: parents, isLoading, isError } = useGetAllSuitableForQuery();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (vals: FormVals) => {
    setApiError(null);
    try {
      await addSF({ name: vals.name, suitableForId: vals.suitableForId }).unwrap();
      reset();
    } catch (err: any) {
      console.error("Add Sub-SuitableFor failed:", err);
      setApiError(err?.data?.message || "Server error – please try again");
    }
  };

  if (isLoading) return <p>Loading finishes…</p>;
  if (isError) return <ErrorMsg msg="Couldn't load finish options" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 py-8 rounded-md">
      {/* API error banner */}
      {apiError && (
        <p className="mb-4 text-red-600 font-medium">{apiError}</p>
      )}

      {/* SuitableFor dropdown */}
      <div className="mb-6">
        <label className="block mb-1 text-base font-medium">Parent SuitableFor</label>
        <select
          {...register("suitableForId", { required: "Select a parent suitablefor" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        >
          <option value="">Select…</option>
          {parents?.data.map((p: { _id: string; name: string }) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.suitableForId && (
          <p className="text-red-500 text-sm mt-1">{errors.suitableForId.message}</p>
        )}
      </div>

      {/* Sub-SuitableFor Name */}
      <div className="mb-6">
        <label className="block mb-1 text-base font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter sub-suitablefor name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="tp-btn px-7 py-2"
      >
        {isSubmitting ? "Adding…" : "Add Sub-SuitableFor"}
      </button>
    </form>
  );
}
