import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const STORAGE_ORDERS_KEY = "aura_customer_orders";

const getLocalOrders = () => {
  const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

const saveLocalOrders = (orders) => {
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
};

export const orderService = {
  // Place a new order
  async createOrder(orderPayload) {
    const orderNumber = "AUR-" + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      ...orderPayload,
      orderNumber,
      status: "Processing",
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "orders"), {
          ...orderData,
          serverDate: serverTimestamp()
        });
        const created = { id: docRef.id, ...orderData };
        // also keep local copy for fast hydration
        const local = getLocalOrders();
        saveLocalOrders([created, ...local]);
        return created;
      } catch (err) {
        console.warn("[Firestore] Error creating order, saving locally:", err);
      }
    }

    const local = getLocalOrders();
    const created = {
      id: "ord-" + Date.now(),
      ...orderData
    };
    saveLocalOrders([created, ...local]);
    return created;
  },

  // Get orders by specific user
  async getUserOrders(userId) {
    if (isFirebaseConfigured && db && userId) {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        if (orders.length > 0) return orders;
      } catch (err) {
        console.warn("[Firestore] Error fetching user orders:", err);
      }
    }

    const local = getLocalOrders();
    if (!userId) return local;
    return local.filter((o) => o.userId === userId || o.userEmail === userId);
  },

  // Get all orders (for Admin Dashboard)
  async getAllOrders() {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        if (orders.length > 0) return orders;
      } catch (err) {
        console.warn("[Firestore] Error fetching all orders:", err);
      }
    }

    return getLocalOrders();
  },

  // Update order status (Admin)
  async updateOrderStatus(orderId, newStatus) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, "orders", orderId);
        await updateDoc(docRef, { status: newStatus });
      } catch (err) {
        console.warn("[Firestore] Error updating order status:", err);
      }
    }

    const local = getLocalOrders();
    const updated = local.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveLocalOrders(updated);
    return true;
  }
};
