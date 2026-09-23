import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const HeroBanner = ({ onShopNow, onQuickView }) => {
  const { formatPrice } = useCart();

  return (
    <section className="hero-section">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="container hero-grid">
        <div className="hero-content">
          <div className="badge badge-primary" style={{ marginBottom: '1.25rem' }}>
            <Sparkles size={14} /> 2026 Flagship Tech & Audio Collection
          </div>

          <h1 className="hero-title">
            The New Standard in <br />
            <span className="gradient-text">Precision & Craft</span>
          </h1>

          <p className="hero-subtitle">
            Immerse yourself in precision-engineered audio, ultra-responsive smart devices,
            and luxury ergonomic accessories delivered across India with authentic warranty.
          </p>

          <div className="hero-cta-group">
            <button className="btn btn-primary" onClick={onShopNow} style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
              Explore Catalog <ArrowRight size={18} />
            </button>
            <a
              href="#deals"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                onShopNow();
              }}
              style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}
            >
              Festive Offers
            </a>
          </div>

          <div className="hero-trust-badges">
            <div className="trust-item">
              <Truck size={20} className="trust-icon" />
              <span>Complimentary Pan-India Delivery over ₹1,499</span>
            </div>
            <div className="trust-item">
              <ShieldCheck size={20} className="trust-icon" />
              <span>2-Year Pan-India Warranty</span>
            </div>
            <div className="trust-item">
              <RefreshCw size={20} className="trust-icon" />
              <span>7-Day Replacement Guarantee</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Spotlight */}
        <div className="hero-visual-card">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
            alt="Flagship Aura Studio Headphones"
          />
          <div className="hero-visual-overlay">
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                Featured Arrival
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.2rem' }}>
                Aura Pulse Studio Wireless
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Spatial Sound & Active Hybrid ANC
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
                {formatPrice(24999)}
              </div>
              <button
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem', marginTop: '0.4rem' }}
                onClick={() => onQuickView('prod-1')}
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
