import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.displayName || 'shopper'}!`, 'success');
      setIsAuthModalOpen(false);
      return loggedUser;
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (email, password, displayName) => {
    try {
      const newUser = await authService.register(email, password, displayName);
      setUser(newUser);
      showToast(`Welcome to AURA, ${newUser.displayName}!`, 'success');
      setIsAuthModalOpen(false);
      return newUser;
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleUser = await authService.loginWithGoogle();
      setUser(googleUser);
      showToast(`Signed in with Google as ${googleUser.displayName}`, 'success');
      setIsAuthModalOpen(false);
      return googleUser;
    } catch (err) {
      showToast(err.message || 'Google sign in failed', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      showToast('Logged out successfully', 'info');
    } catch (err) {
      showToast('Logout failed', 'error');
    }
  };

  const quickLoginDemo = async (role = 'customer') => {
    const email = role === 'admin' ? 'admin@aura.store' : 'shopper@aura.store';
    const password = 'demoPassword123!';
    const displayName = role === 'admin' ? 'Aura Store Manager' : 'Sophia Clark';

    try {
      const logged = await authService.login(email, password);
      logged.displayName = displayName;
      logged.role = role;
      setUser(logged);
      showToast(`Logged in as Demo ${role.toUpperCase()}`, 'success');
      setIsAuthModalOpen(false);
    } catch {
      // fallback
      const u = {
        uid: 'demo-' + role,
        email,
        displayName,
        role
      };
      setUser(u);
      localStorage.setItem('aura_current_user', JSON.stringify(u));
      showToast(`Logged in as Demo ${role.toUpperCase()}`, 'success');
      setIsAuthModalOpen(false);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.email?.includes('admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        loginWithGoogle,
        logout,
        quickLoginDemo,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
