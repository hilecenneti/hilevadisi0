import React, { createContext, useContext, useEffect, useState } from "react";
import { INITIAL_PRODUCTS, PKG_DEFS } from "@/data/store";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const load = (k, fb) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; }
};

const ADMIN_EMAIL = "burakkubrademirci@gmail.com";
const ADMIN_PASSWORD = "qweasd44";

const pkgLabel = (key) => PKG_DEFS.find((p) => p.key === key)?.label || key;

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load("hv_user", null));
  const [products, setProducts] = useState(() => load("hv_products_v2", INITIAL_PRODUCTS));
  const [cart, setCart] = useState(() => load("hv_cart", []));
  const [orders, setOrders] = useState(() => load("hv_orders", []));
  const [balanceRequests, setBalanceRequests] = useState(() => load("hv_balance_requests", []));
  const [allUsers, setAllUsers] = useState(() => load("hv_users", []));

  useEffect(() => { localStorage.setItem("hv_products_v2", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("hv_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("hv_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("hv_balance_requests", JSON.stringify(balanceRequests)); }, [balanceRequests]);
  useEffect(() => { localStorage.setItem("hv_users", JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => {
    if (user) localStorage.setItem("hv_user", JSON.stringify(user));
    else localStorage.removeItem("hv_user");
  }, [user]);

  // Sync a patch to the persisted users list for the given email.
  const patchUserRecord = (email, patch) => {
    setAllUsers((prev) => prev.map((u) => (u.email === email ? { ...u, ...patch } : u)));
  };

  const register = (name, email, password) => {
    if (email === ADMIN_EMAIL) throw new Error("Bu e-posta zaten kayıtlı.");
    if (allUsers.some((u) => u.email === email)) throw new Error("Bu e-posta zaten kayıtlı.");
    const nu = { name, email, password, role: "user", avatar: "", bio: "", balance: 0, joined: new Date().toISOString().slice(0, 10), status: "Aktif" };
    setAllUsers((prev) => [...prev, nu]);
    const { password: _pw, ...pub } = nu;
    setUser(pub);
    return pub;
  };

  const login = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const u = { name: "Yönetici", email, role: "admin", avatar: "", bio: "", balance: 0 }; setUser(u); return u;
    }
    const found = allUsers.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("E-posta veya şifre hatalı.");
    const { password: _pw, ...pub } = found;
    const u = { ...pub, balance: found.balance || 0 };
    setUser(u); return u;
  };

  const logout = () => setUser(null);

  const updateProfile = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      patchUserRecord(prev.email, patch);
      return next;
    });
  };

  // ---- Wallet ----
  const addBalance = (amount) => {
    const amt = Number(amount);
    if (!amt || amt <= 0) throw new Error("Geçerli bir tutar girin.");
    setUser((prev) => {
      if (!prev) return prev;
      const nextBal = (prev.balance || 0) + amt;
      patchUserRecord(prev.email, { balance: nextBal });
      return { ...prev, balance: nextBal };
    });
    setBalanceRequests((prev) => [
      { id: "br" + Date.now(), user: user?.email, name: user?.name, amount: amt, type: "Yükleme", method: "Kredi Kartı", date: new Date().toISOString().slice(0, 10), status: "Onaylandı" },
      ...prev,
    ]);
  };

  const requestWithdrawal = (amount, method) => {
    const amt = Number(amount);
    if (!amt || amt <= 0) throw new Error("Geçerli bir tutar girin.");
    if (!user || (user.balance || 0) < amt) throw new Error("Yetersiz bakiye.");
    // Reserve the funds immediately.
    setUser((prev) => {
      const nextBal = (prev.balance || 0) - amt;
      patchUserRecord(prev.email, { balance: nextBal });
      return { ...prev, balance: nextBal };
    });
    setBalanceRequests((prev) => [
      { id: "br" + Date.now(), user: user.email, name: user.name, amount: amt, type: "Çekim", method: method || "Banka Havalesi", date: new Date().toISOString().slice(0, 10), status: "Beklemede" },
      ...prev,
    ]);
  };

  const resolveBalanceRequest = (id, approve) => {
    setBalanceRequests((prev) => prev.map((r) => {
      if (r.id !== id || r.status !== "Beklemede") return r;
      if (!approve && r.type === "Çekim") {
        // Refund reserved funds.
        setAllUsers((us) => us.map((u) => (u.email === r.user ? { ...u, balance: (u.balance || 0) + r.amount } : u)));
        setUser((cu) => (cu && cu.email === r.user ? { ...cu, balance: (cu.balance || 0) + r.amount } : cu));
      }
      return { ...r, status: approve ? "Onaylandı" : "Reddedildi" };
    }));
  };

  // ---- Cart ----
  const addToCart = (product, pkgKey) => {
    const pkg = product.packages?.[pkgKey];
    if (!pkg) return;
    setCart((prev) => [
      ...prev,
      { cid: "c" + Date.now() + Math.random().toString(36).slice(2, 6), productId: product.id, name: product.name, image: product.image, category: product.category, pkgKey, pkgLabel: pkgLabel(pkgKey), price: pkg.price },
    ]);
  };
  const removeFromCart = (cid) => setCart((prev) => prev.filter((c) => c.cid !== cid));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((s, c) => s + c.price, 0);

  const checkout = () => {
    if (!user) throw new Error("Ödeme için giriş yapmalısınız.");
    if (cart.length === 0) throw new Error("Sepetiniz boş.");
    if ((user.balance || 0) < cartTotal) throw new Error("Bakiyeniz yetersiz. Lütfen cüzdanınıza bakiye yükleyin.");
    const nextBal = (user.balance || 0) - cartTotal;
    // Decrement stock.
    setProducts((prev) => prev.map((p) => {
      const items = cart.filter((c) => c.productId === p.id);
      if (items.length === 0) return p;
      const packages = { ...p.packages };
      items.forEach((it) => {
        if (packages[it.pkgKey]) packages[it.pkgKey] = { ...packages[it.pkgKey], stock: Math.max(0, (packages[it.pkgKey].stock || 0) - 1) };
      });
      return { ...p, packages };
    }));
    // Create orders.
    const now = new Date().toISOString().slice(0, 10);
    const newOrders = cart.map((c) => ({
      id: "SIP" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10),
      user: user.email, userName: user.name, product: `${c.name} ${c.pkgLabel}`, amount: c.price, method: "Cüzdan", date: now, status: "Tamamlandı",
    }));
    setOrders((prev) => [...newOrders, ...prev]);
    // Deduct balance.
    patchUserRecord(user.email, { balance: nextBal });
    setUser((prev) => ({ ...prev, balance: nextBal }));
    clearCart();
    return newOrders;
  };

  // ---- Products (admin) ----
  const addProduct = (p) => setProducts((prev) => [{ ...p, id: "p" + Date.now() }, ...prev]);
  const updateProduct = (id, patch) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const myOrders = user ? orders.filter((o) => o.user === user.email) : [];

  return (
    <AppContext.Provider value={{
      user, products, cart, cartTotal, orders, myOrders, balanceRequests, allUsers,
      register, login, logout, updateProfile,
      addBalance, requestWithdrawal, resolveBalanceRequest,
      addToCart, removeFromCart, clearCart, checkout,
      addProduct, updateProduct, deleteProduct,
    }}>
      {children}
    </AppContext.Provider>
  );
}
