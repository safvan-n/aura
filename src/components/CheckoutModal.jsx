import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Truck, ArrowLeft, ArrowRight, Sparkles, Smartphone, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    closeCheckout,
    cartItems,
    subtotal,
    discountAmount,
    shipping,
    tax,
    total,
    formatPrice,
    clearCart
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Indian Address & Payment Defaults
  const [formData, setFormData] = useState({
    fullName: user?.displayName || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Prestige Cyber Towers, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560103',
    country: 'India',
    paymentMethod: 'upi',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
    upiId: 'rahulsharma@okhdfcbank'
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.address || !formData.zipCode) {
        showToast('Please fill out all required shipping fields', 'error');
        return;
      }
      setStep(2);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.uid || 'guest-user',
        userEmail: formData.email,
        customerName: formData.fullName,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          image: item.image
        })),
        pricing: {
          subtotal,
          discount: discountAmount,
          shipping,
          tax,
          total
        }
      };

      const order = await orderService.createOrder(orderPayload);
      setCreatedOrder(order);
      setStep(3);
      clearCart();

      // Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('Order successfully confirmed!', 'success');
    } catch (err) {
      showToast('Failed to place order: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCreatedOrder(null);
    closeCheckout();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        <div style={{ padding: '2rem' }}>
          {step !== 3 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                  {step === 1 ? 'Delivery Address (India)' : 'Select Payment Method'}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Step {step} of 2
                </span>
              </div>
              {/* Stepper Bar */}
              <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: step === 1 ? '50%' : '100%',
                    background: 'var(--accent-gradient)',
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Step 1: Shipping Address Form */}
          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="rahul@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Flat / House No., Building, Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Flat 402, Outer Ring Road, Marathahalli"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Bengaluru"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Karnataka"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code (6 Digits) *</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    maxLength={6}
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="560103"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    readOnly
                    value="India"
                    className="form-input"
                    style={{ opacity: 0.8, cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number (+91) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '1rem', fontSize: '1rem' }}
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Step 2: Payment & Final Review */}
          {step === 2 && (
            <form onSubmit={handlePlaceOrder}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                  Choose Payment Option:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { id: 'upi', label: 'UPI / QR', sub: 'GPay, PhonePe, Paytm' },
                    { id: 'card', label: 'Card', sub: 'RuPay, Visa, MC' },
                    { id: 'cod', label: 'Pay on Delivery', sub: 'Cash / Scan on Delivery' }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                      style={{
                        padding: '0.85rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: formData.paymentMethod === m.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: formData.paymentMethod === m.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-tertiary)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: formData.paymentMethod === m.id ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {m.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'upi' && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <Smartphone size={18} className="gradient-text" />
                    <strong style={{ fontSize: '0.95rem' }}>Unified Payments Interface (UPI)</strong>
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      type="text"
                      name="upiId"
                      required
                      value={formData.upiId}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="mobile@upi / rahul@okhdfcbank"
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>
                    Supported: Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay
                  </span>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Card Number (RuPay, Visa, Mastercard)</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'cod' && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    💵 You can pay with Cash or scan the delivery executive’s UPI QR code upon doorstep delivery.
                  </p>
                </div>
              )}

              {/* Order Summary Recap */}
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: '700' }}>Order Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <div className="summary-row">
                    <span>Items ({cartItems.length})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="summary-row" style={{ color: 'var(--badge-emerald)' }}>
                      <span>Festive / Promotional Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Express Shipping</span>
                    <span>{shipping === 0 ? <strong style={{ color: 'var(--badge-emerald)' }}>FREE</strong> : formatPrice(shipping)}</span>
                  </div>
                  <div className="summary-row">
                    <span>GST (18% Goods & Services Tax)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="summary-row total" style={{ marginTop: '0.5rem' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                  style={{ padding: '0.85rem 1.25rem' }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem', fontSize: '1rem' }}
                >
                  {isSubmitting ? 'Confirming with Store...' : `Pay ${formatPrice(total)}`}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Confirmation */}
          {step === 3 && createdOrder && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--badge-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CheckCircle size={40} />
              </div>

              <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Order Placed Successfully!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Your order will be dispatched from our nearest fulfillment hub in India.
              </p>

              <div
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                  <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
                    {createdOrder.orderNumber}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recipient:</span>
                  <strong>{createdOrder.customerName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery PIN:</span>
                  <strong>{createdOrder.shippingAddress?.pinCode || '560103'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Timeline:</span>
                  <strong>2 - 4 Days (Pan-India Express)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span className="badge badge-amber">{createdOrder.status}</span>
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleClose} style={{ padding: '0.85rem 2rem' }}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
