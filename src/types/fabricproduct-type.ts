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

export interface IFilter {
  name: keyof IProductFormData;
  label: string;
  options: Array<{ _id: string; name: string }>;
}
