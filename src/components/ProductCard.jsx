import React from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product, onSelect }) => {
  const { addToCart, formatPrice } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  const getBadgeClass = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'best seller':
      case 'trending':
        return 'badge-primary';
      case 'sale':
        return 'badge-rose';
      case 'new':
      case 'flagship':
        return 'badge-emerald';
      default:
        return 'badge-amber';
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-img-wrap" onClick={() => onSelect(product)}>
        <img src={product.image} alt={product.name} loading="lazy" />

        {product.badge && (
          <div className="product-card-badge">
            <span className={`badge ${getBadgeClass(product.badge)}`}>
              {product.badge}
            </span>
          </div>
        )}

        <button
          className={`product-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isFavorited ? 'In wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <div className="product-rating">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating}</span>
            <span style={{ color: 'var(--text-dim)', fontWeight: 'normal' }}>
              ({product.reviewCount})
            </span>
          </div>
        </div>

        <h3 className="product-card-title" onClick={() => onSelect(product)}>
          {product.name}
        </h3>

        <p className="product-card-tagline">{product.tagline}</p>

        <div className="product-card-footer">
          <div className="price-group">
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="price-original">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.65rem' }}
              onClick={() => onSelect(product)}
              title="Quick view product specs"
            >
              <Eye size={16} />
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              onClick={() => addToCart(product, 1)}
            >
              <ShoppingBag size={15} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
