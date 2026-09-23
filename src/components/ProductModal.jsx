import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductModal = ({ product, onClose }) => {
  const { addToCart, formatPrice } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, { color: selectedColor });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '860px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '2rem', padding: '2rem' }}>
          {/* Gallery View */}
          <div>
            <div
              style={{
                width: '100%',
                height: '360px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--bg-tertiary)',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <div className="product-rating">
                <Star size={15} fill="#f59e0b" color="#f59e0b" />
                <span>{product.rating}</span>
                <span style={{ color: 'var(--text-dim)' }}>({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.65rem', marginBottom: '0.4rem', lineHeight: '1.2' }}>{product.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>{product.tagline}</p>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="badge badge-rose">Save {discountPercent}%</span>
                </>
              )}
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Color variants if any */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Select Finishes:
                </span>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: selectedColor === c ? '3px solid var(--accent-primary)' : '2px solid var(--border-strong)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                      }}
                    >
                      {selectedColor === c && <Check size={14} color="#fff" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specs List */}
            {product.specs && (
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key}>
                      <span style={{ color: 'var(--text-muted)' }}>{key}: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: Quantity & Add to Cart */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="cart-qty-control" style={{ padding: '0.4rem 0.65rem' }}>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '700' }}>
                  {quantity}
                </span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} /> Add to Cart • {formatPrice(product.price * quantity)}
              </button>

              <button
                className="btn btn-secondary"
                style={{ width: '48px', height: '48px', padding: 0 }}
                onClick={() => toggleWishlist(product)}
                title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} fill={isFavorited ? '#f43f5e' : 'none'} color={isFavorited ? '#f43f5e' : 'currentColor'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
