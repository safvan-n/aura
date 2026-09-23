import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  ShieldCheck,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../services/firebase';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  onOpenWishlist,
  onOpenOrders,
  onOpenAdmin,
  activeView,
  setActiveView
}) => {
  const { itemCount, openCart, currency, setCurrency, currencyRates } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container navbar">
        {/* Brand Logo */}
        <a
          href="#"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('shop');
          }}
        >
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>AURA<span className="gradient-text">.STORE</span></span>
        </a>

        {/* Global Search */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search flagship tech, wearables, sound..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'shop') setActiveView('shop');
              }}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="nav-actions">
          {/* Firebase Connection Indicator */}
          <div
            className={`badge ${isFirebaseConfigured ? 'badge-emerald' : 'badge-primary'}`}
            title={isFirebaseConfigured ? 'Connected to live Firebase Cloud Firestore' : 'Running in Local Demo Mode. Add Firebase keys in .env to sync.'}
            style={{ cursor: 'help' }}
          >
            {isFirebaseConfigured ? 'Firebase Live' : 'Demo Mode'}
          </div>

          {/* Currency Select */}
          <select
            className="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            title="Switch Currency"
          >
            {Object.keys(currencyRates).map((cur) => (
              <option key={cur} value={cur}>
                {currencyRates[cur].label}
              </option>
            ))}
          </select>

          {/* Theme Switcher */}
          <button
            className="nav-pill-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Wishlist Button */}
          <button
            className="nav-pill-btn"
            onClick={onOpenWishlist}
            aria-label="Wishlist"
            title="View Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="nav-badge-count">{wishlistCount}</span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            className="nav-pill-btn"
            onClick={openCart}
            aria-label="Shopping Cart"
            title="Open Shopping Cart"
          >
            <ShoppingBag size={19} />
            {itemCount > 0 && (
              <span className="nav-badge-count">{itemCount}</span>
            )}
          </button>

          {/* Auth / Account Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.95rem', gap: '0.45rem', borderRadius: 'var(--radius-full)' }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={16} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || 'Account'}
                </span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '210px',
                    padding: '0.5rem',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Signed in as <br />
                    <strong style={{ color: 'var(--text-main)' }}>{user.email}</strong>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem 0.75rem' }}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenOrders();
                    }}
                  >
                    <Package size={16} /> My Orders
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem 0.75rem' }}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAdmin();
                    }}
                  >
                    <ShieldCheck size={16} /> Admin Portal
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem 0.75rem', color: 'var(--badge-rose)' }}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={openAuthModal}>
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
