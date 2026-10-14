import { api } from "./api";


export type Product = {
  id: number;
  name: string;
  category: string;
  price: string | number;
  stock: number;
};

export async function listProducts(token: string, search = ""): Promise<Product[]> {
  const response = await api.get<Product[]>("/products", {
  
    headers: { Authorization: `Bearer ${token}` },
   
    params: { search: search || undefined },
  });
  return response.data;
}