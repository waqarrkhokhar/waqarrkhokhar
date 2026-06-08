import type { ProductStatus } from "@/lib/types/database";

export type CatalogCollection = {
  id: string;
  name: string;
  slug: string;
  parent_id: string;
  parent_name: string;
  status: string;
};

export type Catalog = {
  parents: { id: string; name: string; slug: string }[];
  collections: CatalogCollection[];
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number | null;
  sale_price: number | null;
  status: ProductStatus;
  is_featured: boolean;
  category: { id: string; name: string; slug: string } | null;
  primary_image: string | null;
  images_count: number;
};

export type ProductHealth = {
  total: number;
  published: number;
  draft: number;
  archived: number;
  scheduled: number;
  missing_images: number;
  missing_description: number;
  no_price: number;
  no_reviews: number;
};

export const PKR = (n: number | null | undefined) =>
  n == null ? "—" : `Rs ${n.toLocaleString("en-PK")}`;
