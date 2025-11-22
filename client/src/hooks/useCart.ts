import { useState, useEffect } from 'react';
import type { Product, CartItem } from '@shared/types';
import { toast } from './useToast';

const CART_STORAGE_KEY = 'cart-items';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        toast({
          title: 'Error',
          description: 'Not enough stock available',
          variant: 'destructive',
        });
        return;
      }
      setItems(
        items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      if (quantity > product.stock) {
        toast({
          title: 'Error',
          description: 'Not enough stock available',
          variant: 'destructive',
        });
        return;
      }
      setItems([...items, { product, quantity }]);
    }

    toast({
      title: 'Success',
      description: 'Item added to cart',
    });
  };

  const removeItem = (productId: number) => {
    setItems(items.filter((item) => item.product.id !== productId));
    toast({
      title: 'Success',
      description: 'Item removed from cart',
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    const item = items.find((item) => item.product.id === productId);
    if (item && quantity > item.product.stock) {
      toast({
        title: 'Error',
        description: 'Not enough stock available',
        variant: 'destructive',
      });
      return;
    }

    setItems(
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
  };
}
