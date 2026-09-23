import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';
import { PROMO_CODES } from '../data/mockProducts';

const CartContext = createContext(null);

const STORAGE_CART_KEY = 'aura_shopping_cart';
const STORAGE_CURRENCY_KEY = 'aura_currency_pref';

const CURRENCY_RATES = {
  INR: { symbol: '₹', rate: 1.0, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0095, label: 'GBP (£)' }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(STORAGE_CURRENCY_KEY) || 'INR';
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CURRENCY_KEY, currency);
  }, [currency]);

  // Add product to cart
  const addToCart = (product, quantity = 1, options = {}) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === options.color &&
          item.selectedSize === options.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            category: product.category,
            quantity,
            selectedColor: options.color || product.colors?.[0] || null,
            selectedSize: options.size || null,
            maxStock: product.stock || 50
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to bag`, 'success');
  };

  // Remove product from cart
  const removeFromCart = (itemId, color, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === itemId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    showToast('Item removed from cart', 'info');
  };

  // Update quantity
  const updateQuantity = (itemId, color, size, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (
            item.id === itemId &&
            item.selectedColor === color &&
            item.selectedSize === size
          ) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Apply Coupon code
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      const promo = PROMO_CODES[cleanCode];
      setAppliedCoupon({ code: cleanCode, ...promo });
      showToast(`Coupon "${cleanCode}" applied: ${promo.description}`, 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try SAVE20 or WELCOME10', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return (subtotal * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.discountAmount) {
      if (appliedCoupon.minSpend && subtotal < appliedCoupon.minSpend) {
        return 0;
      }
      return appliedCoupon.discountAmount;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const freeShippingThreshold = 1499;
  const shipping = subtotal > 0 && subtotal >= freeShippingThreshold ? 0 : subtotal > 0 ? 99 : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount > 0 ? Math.round(taxableAmount * 0.18 * 100) / 100 : 0; // 18% GST
  const total = Math.max(0, taxableAmount + shipping + tax);

  // Currency Formatter
  const formatPrice = (inrAmount) => {
    const num = Number(inrAmount) || 0;
    const conf = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = num * conf.rate;

    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${conf.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        discountAmount,
        shipping,
        tax,
        total,
        freeShippingThreshold,
        appliedCoupon,
        currency,
        currencyRates: CURRENCY_RATES,
        setCurrency,
        formatPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isCheckoutOpen,
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
