import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Welcome! Your ₹500 off coupon is AURA500 (applicable above ₹2,499)', 'success');
      setEmail('');
    }
  };

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', padding: '4.5rem 0 2.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '3rem', marginBottom: '3.5rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div className="brand-icon">
                <Sparkles size={20} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
                AURA<span className="gradient-text">.STORE INDIA</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '320px', marginBottom: '1.5rem' }}>
              India’s flagship destination for precision audio, titanium wearables, and luxury workspace craft. Real-time Firebase cloud sync and pan-India dispatch.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>100% GST Compliant & 256-Bit SSL Encrypted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#6366f1" />
                <span>Accepted: UPI (GPay, PhonePe, Paytm), RuPay, Netbanking</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Flagship Audio & ANC</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Titanium Smart Watches</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Cinematic 4K Cameras</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Mechanical Keyboards</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Leather Sleeves & Tech Folios</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Support (India)
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Live Order Tracking</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pan-India Pin Code Coverage</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Easy 7-Day Replacement</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>GST Invoicing Support</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>WhatsApp Concierge Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Festive Offers & Updates
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Subscribe to unlock secret Indian festive promo drops, flash sales, and new hardware arrivals.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="form-input"
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          <p>© {new Date().getFullYear()} AURA STORE India. All prices in INR (₹) inclusive of applicable taxes.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>GST & Invoicing</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
