import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Package,
  Layers,
  Database,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { isFirebaseConfigured, firebaseConfig } from '../services/firebase';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/mockProducts';

export const AdminPanel = ({ isOpen, onClose, onRefreshProducts }) => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'firebase'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);

  const { formatPrice } = useCart();
  const { showToast } = useToast();

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    tagline: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: 25,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    description: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        productService.getProducts(),
        orderService.getAllOrders()
      ]);
      setProducts(prods || []);
      setOrders(ords || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productService.addProduct({
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
        stock: Number(newProduct.stock)
      });
      showToast('Product successfully added to inventory!', 'success');
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        tagline: '',
        category: 'Electronics',
        price: '',
        originalPrice: '',
        stock: 25,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
        description: ''
      });
      loadData();
      onRefreshProducts();
    } catch (err) {
      showToast('Error adding product: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productService.deleteProduct(id);
        showToast('Product removed', 'info');
        loadData();
        onRefreshProducts();
      } catch (err) {
        showToast('Error deleting product', 'error');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      showToast(`Order status updated to "${status}"`, 'success');
      loadData();
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const handleSeedDatabase = async () => {
    if (!isFirebaseConfigured) {
      showToast('Please add your Firebase keys to .env before syncing', 'error');
      return;
    }
    setSeedingLoading(true);
    try {
      const count = await productService.seedFirestore();
      showToast(`Successfully seeded ${count} products to Firestore!`, 'success');
      loadData();
      onRefreshProducts();
    } catch (err) {
      showToast('Seeding error: ' + err.message, 'error');
    } finally {
      setSeedingLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '960px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Admin Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-primary">Admin Control Center</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Store Management</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Manage catalog inventory, update fulfillment orders, and sync Firebase Firestore.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={16} /> Inventory ({products.length})
            </button>
            <button
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setActiveTab('orders')}
            >
              <Layers size={16} /> Orders ({orders.length})
            </button>
            <button
              className={`btn ${activeTab === 'firebase' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setActiveTab('firebase')}
            >
              <Database size={16} /> Firebase Cloud
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '2rem', maxHeight: '68vh', overflowY: 'auto' }}>
          {/* TAB 1: INVENTORY */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Product Catalog</h3>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.15rem' }}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center'
                    }}
                  >
                    <img src={p.image} alt={p.name} style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>
                        {p.category} • Stock: {p.stock}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--accent-primary)' }}>
                        {formatPrice(p.price)}
                      </strong>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem', color: 'var(--badge-rose)', border: 'none' }}
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem' }}>
                Fulfillment & Customer Orders
              </h3>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No customer orders received yet. Place a test order through the storefront!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
                            {ord.orderNumber}
                          </strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block' }}>
                            Customer: {ord.customerName} ({ord.userEmail})
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>
                            {formatPrice(ord.pricing?.total || 0)}
                          </span>

                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-strong)',
                              color: 'var(--text-main)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Shipping Address: {ord.shippingAddress?.address}, {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FIREBASE CLOUD */}
          {activeTab === 'firebase' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  background: isFirebaseConfigured ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                  border: `1px solid ${isFirebaseConfigured ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                  {isFirebaseConfigured ? (
                    <CheckCircle size={22} color="#10b981" />
                  ) : (
                    <Database size={22} color="#6366f1" />
                  )}
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                    {isFirebaseConfigured
                      ? `Connected to Firebase Project: ${firebaseConfig.projectId}`
                      : 'Running in Local Demo / Persisted Mode'}
                  </h4>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {isFirebaseConfigured
                    ? 'Your application is reading and writing in real-time to Google Cloud Firestore and Firebase Authentication.'
                    : 'To link your custom Firebase project, edit the .env file in your project directory and set your VITE_FIREBASE_* keys.'}
                </p>
              </div>

              {/* One-click Seeder */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  One-Click Cloud Firestore Seeder
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Push all 8+ flagship catalog products directly into your Firestore `products` collection.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleSeedDatabase}
                  disabled={seedingLoading || !isFirebaseConfigured}
                >
                  <RefreshCw size={16} className={seedingLoading ? 'spin' : ''} />
                  {seedingLoading ? 'Seeding Database...' : 'Seed Initial Catalog to Firestore'}
                </button>
                {!isFirebaseConfigured && (
                  <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    * Active Firebase connection in .env required to seed Firestore.
                  </span>
                )}
              </div>

              {/* Instructions */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                  How to Connect Your Firebase Project
                </h4>
                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                  <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Firebase Console</a> and create a project.</li>
                  <li>Enable <strong>Authentication</strong> (Email/Password & Google).</li>
                  <li>Enable <strong>Cloud Firestore</strong> database (in test mode or production rules).</li>
                  <li>Under Project Settings &gt; General &gt; Your apps &gt; Web, copy the configuration credentials.</li>
                  <li>Paste the values into your <code>.env</code> file.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Add Product Form */}
        {isAddModalOpen && (
          <div className="modal-backdrop" style={{ zIndex: 130 }} onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>

              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.25rem' }}>
                  Add Product to Catalog
                </h3>

                <form onSubmit={handleAddProduct}>
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Apex HyperFold Drone"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tagline</label>
                    <input
                      type="text"
                      value={newProduct.tagline}
                      onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 4K HDR Autonomous Tracking"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="form-input"
                      >
                        {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Badge</label>
                      <input
                        type="text"
                        value={newProduct.badge}
                        onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                        className="form-input"
                        placeholder="e.g. New / Sale"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Original Price</label>
                      <input
                        type="number"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Initial Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={3}
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="form-input"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
                  >
                    Save & Publish to Store
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
