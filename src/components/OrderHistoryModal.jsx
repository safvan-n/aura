import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

export const OrderHistoryModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { formatPrice } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      orderService.getUserOrders(user?.uid).then((res) => {
        setOrders(res || []);
        setLoading(false);
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <Package size={22} className="gradient-text" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800' }}>Your Orders History</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Clock size={32} className="gradient-text" style={{ animation: 'spin 2s linear infinite' }} />
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving your order records...</p>
            </div>
          ) : orders.length === 0 ? (
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
                <Package size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No orders placed yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Your completed purchases and real-time shipping tracking will appear here.
              </p>
              <button className="btn btn-primary" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '55vh', overflowY: 'auto' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                        {order.orderNumber}
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${order.status === 'Delivered' ? 'badge-emerald' : 'badge-amber'}`}>
                        {order.status}
                      </span>
                      <strong style={{ display: 'block', fontSize: '1.1rem', marginTop: '4px', color: 'var(--accent-primary)' }}>
                        {formatPrice(order.pricing?.total || 0)}
                      </strong>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', minWidth: 'max-content' }}>
                        <img src={item.image} alt={item.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.82rem' }}>
                          {item.name} × {item.quantity}
                        </span>
                      </div>
                    ))}
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
