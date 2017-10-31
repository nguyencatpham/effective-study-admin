
export interface BasicProduct {
  id: number;
}

export interface ProductInfo {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice: number;
  categoryId: number;
  isShowHomePage: boolean;
  isPublished: boolean;
  imageUrl: string;
}

export interface ProductListResp {
  data: ProductInfo[];
  totalRecord: number;
}

export interface ImageInfo {
  id: number;
  name: string;
  type: string;
  url: string;
}

export interface ProductImageInfo {
  id: number;
  productId: number;
  productName: string;
  imageId: number;
  imageUrl: string;
  type: number;
  typeName: string;
  displayOrder: number;
  alt: string;
  title: string;
}

export interface ProductNutritionInfo {
  id: number;
  productId: number;
  nutritionId: number;
  nutritionName: string;
  value: string;
  parentId: number;
  leftNode: number;
  rightNode: number;
}

export interface ProductComponentInfo {
  id: number;
  productId: number;
  componentId: number;
  componentName: string;
}