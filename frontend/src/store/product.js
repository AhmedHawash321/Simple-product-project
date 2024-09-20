import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: 'Please fill all the fields.' };
    }
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to create product.' };
      }
      
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: 'Product created successfully.' };
    } catch (error) {
      return { success: false, message: 'An error occurred. Please try again.' };
      
    }
  },
  
  fetchProducts: async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch products.');
      }
      
      set({ products: data.data });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
  
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to delete product.' };
      }
      
      set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
      return { success: true, message: 'Product deleted successfully.' };
    } catch (error) {
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  },
  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    
    set((state) => ({
      products: state.products.map((product) => (product._id === pid ? data.data : product)),
    }));
    return { success: true, message: data.message };
  },
}));
