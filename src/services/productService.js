import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { INITIAL_PRODUCTS } from "../data/mockProducts";

const STORAGE_PRODUCTS_KEY = "aura_custom_products";

const getLocalProducts = () => {
  const custom = localStorage.getItem(STORAGE_PRODUCTS_KEY);
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }
  return INITIAL_PRODUCTS;
};

const saveLocalProducts = (products) => {
  localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
};

export const productService = {
  // Fetch all products
  async getProducts() {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (!querySnapshot.empty) {
          const products = [];
          querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
          });
          return products;
        } else {
          // Firestore is empty; return default initial catalog
          return INITIAL_PRODUCTS;
        }
      } catch (err) {
        console.warn("[Firestore] Could not fetch products, falling back to local dataset:", err);
        return getLocalProducts();
      }
    }
    return getLocalProducts();
  },

  // Get product by ID
  async getProductById(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
      } catch (err) {
        console.warn("[Firestore] Error getting product:", err);
      }
    }
    const products = getLocalProducts();
    return products.find((p) => p.id === id) || null;
  },

  // Add new product (Admin)
  async addProduct(productData) {
    const newProduct = {
      ...productData,
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 1,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "products"), {
          ...newProduct,
          timestamp: serverTimestamp()
        });
        return { id: docRef.id, ...newProduct };
      } catch (err) {
        console.warn("[Firestore] Error adding product, saving locally:", err);
      }
    }

    const local = getLocalProducts();
    const id = "prod-" + Date.now();
    const created = { id, ...newProduct };
    saveLocalProducts([created, ...local]);
    return created;
  },

  // Update existing product
  async updateProduct(id, updates) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, updates);
      } catch (err) {
        console.warn("[Firestore] Error updating product:", err);
      }
    }

    const local = getLocalProducts();
    const updated = local.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveLocalProducts(updated);
    return true;
  },

  // Delete product
  async deleteProduct(id) {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        console.warn("[Firestore] Error deleting product:", err);
      }
    }

    const local = getLocalProducts();
    const filtered = local.filter((p) => p.id !== id);
    saveLocalProducts(filtered);
    return true;
  },

  // Seed Firestore with initial catalog (One-click sync button in Admin panel)
  async seedFirestore() {
    if (!isFirebaseConfigured || !db) {
      throw new Error("Firebase is not configured in .env yet.");
    }

    let seededCount = 0;
    for (const item of INITIAL_PRODUCTS) {
      const docRef = doc(db, "products", item.id);
      await setDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp()
      });
      seededCount++;
    }
    return seededCount;
  }
};
