export interface IProductFormData {
  name: string;
  gsm: string;
  oz: string;
  cm: string;
  inch: string;
  quantity: string;
  um: string;
  amount: string;
  currency: string;
  image: File | null;
  image1: File | null;
  image2: File | null;
  video: File | null;
  categoryId: string;
  colorId: string;
  structureId: string;
  designId: string;
  finishId: string;
}

export interface IFabricProduct {
  _id: string;
  name: string;
  sku?: string;
  gsm: string;
  oz: string;
  cm: string;
  inch: string;
  quantity: string;
  um: string;
  salesPrice?: number;
  currency: string;
  locationCode?: string;
  groupcodeId?: string;
  newCategoryId?: string;
  structureId?: string;
  subStructureId?: string;
  contentId?: string;
  finishId?: string;
  subFinishId?: string;
  designId?: string;
  colorId?: string;
  motifsizeId?: string;
  suitableforId?: string;
  subSuitableId?: string;
  vendorId?: string;
  uniqueCode?: string;
  image?: string;
  image1?: string;
  image2?: string;
  video?: string;
  category?: string;
  color?: string;
  structure?: string;
  design?: string;
  finish?: string;
}

export interface IFilter {
  name: keyof IProductFormData;
  label: string;
  options: Array<{ _id: string; name: string }>;
}
