import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    itemCount,
    subtotal,
    discountAmount,
    shipping,
    tax,
    total,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    formatPrice,
    openCheckout
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="drawer-backdrop" onClick={closeCart}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingBag size={20} className="gradient-text" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              Your Bag ({itemCount})
            </h3>
          </div>
          <button className="modal-close-btn" style={{ position: 'static' }} onClick={closeCart}>
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ padding: '1rem 1.5rem 0' }}>
          <div className="shipping-progress-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>
                {remainingForFreeShipping === 0 ? (
                  <strong style={{ color: 'var(--badge-emerald)' }}>
                    🎉 You have unlocked FREE Express Shipping!
                  </strong>
                ) : (
                  <>
                    Add <strong>{formatPrice(remainingForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>
                  </>
                )}
              </span>
              <span style={{ fontWeight: '700' }}>{shippingProgressPercent}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${shippingProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--text-dim)'
                }}
              >
                <ShoppingBag size={30} />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your shopping bag is empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Discover our curated high-performance collection and elevate your everyday lifestyle.
              </p>
              <button className="btn btn-primary" onClick={closeCart}>
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div className="cart-item-info">
                  <div>
                    <h4 className="cart-item-title">{item.name}</h4>
                    {item.selectedColor && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '2px' }}>
                        Finish: {item.selectedColor}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div className="cart-qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, -1)}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                  title="Remove from cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Totals */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="coupon-row">
              <input
                type="text"
                placeholder="Enter Promo Code (e.g. SAVE20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="coupon-input"
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399' }}>
                  <Tag size={14} /> Coupon {appliedCoupon.code} applied ({appliedCoupon.description})
                </span>
                <button
                  onClick={removeCoupon}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row" style={{ color: 'var(--badge-emerald)' }}>
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong style={{ color: 'var(--badge-emerald)' }}>FREE</strong> : formatPrice(shipping)}</span>
              </div>
              <div className="summary-row">
                <span>Sales Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Due</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
              onClick={openCheckout}
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
