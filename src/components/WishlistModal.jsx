import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistModal = ({ isOpen, onClose, onSelectProduct }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, formatPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <Heart size={22} className="gradient-text" fill="currentColor" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800' }}>
              Your Wishlist ({wishlist.length})
            </h2>
          </div>

          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
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
                <Heart size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Tap the heart icon on any product to save it here for later.
              </p>
              <button className="btn btn-primary" onClick={onClose}>
                Explore Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '55vh', overflowY: 'auto' }}>
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--bg-tertiary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => {
                      onClose();
                      onSelectProduct(item);
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4
                      style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                      onClick={() => {
                        onClose();
                        onSelectProduct(item);
                      }}
                    >
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block' }}>
                      {item.category}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
                      {formatPrice(item.price)}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                      onClick={() => {
                        addToCart(item, 1);
                        toggleWishlist(item);
                      }}
                    >
                      <ShoppingBag size={14} /> Move to Cart
                    </button>

                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem', color: 'var(--badge-rose)' }}
                      onClick={() => toggleWishlist(item)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
