import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, Wallet, CheckCircle2, ArrowRight, Plus } from "lucide-react";
import { Header, TopStrip, Footer } from "@/components/Layout";
import { useApp } from "@/context/AppContext";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, checkout, user } = useApp();
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const balance = user?.balance || 0;

  const onCheckout = () => {
    setErr("");
    try { checkout(); setDone(true); }
    catch (e) { setErr(e.message); }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopStrip />
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl">
        <div className="mb-8">
          <span className="text-eyebrow"><span className="h-px w-6 bg-accent-cyan/40" /> Sepet</span>
          <h1 className="h-section mt-3">Alışveriş Sepeti</h1>
        </div>

        {done ? (
          <div className="glass-card p-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-green-500/10 grid place-items-center mx-auto mb-4"><CheckCircle2 className="text-green-500" size={28} /></div>
            <h2 className="text-xl font-bold">Siparişiniz tamamlandı!</h2>
            <p className="text-muted-foreground mt-2">Ödeme cüzdanınızdan tahsil edildi. Siparişleriniz hesabınıza tanımlandı.</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Link to="/profil" className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2">Siparişlerim <ArrowRight size={16} /></Link>
              <Link to="/" className="h-11 px-5 rounded-xl bg-secondary border border-border font-semibold inline-flex items-center">Mağazaya dön</Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <ShoppingCart className="mx-auto text-muted-foreground mb-3" size={32} />
            <p className="text-muted-foreground">Sepetiniz boş.</p>
            <Link to="/" className="text-accent-cyan font-semibold mt-4 inline-flex items-center gap-1.5">Ürünleri keşfet <ArrowRight size={15} /></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {cart.map((c) => (
                <div key={c.cid} className="glass-card p-4 flex items-center gap-4">
                  <img src={c.image} alt="" className="h-16 w-24 object-cover rounded-lg shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.pkgLabel} · <span className="text-accent-cyan">{c.category}</span></p>
                  </div>
                  <span className="font-mono font-bold text-lg shrink-0">₺{c.price}</span>
                  <button onClick={() => removeFromCart(c.cid)} className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <div className="glass-card p-5 h-fit space-y-4">
              <h3 className="font-bold">Özet</h3>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Ürün ({cart.length})</span><span className="font-medium">₺{cartTotal}</span></div>
              <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground inline-flex items-center gap-1.5"><Wallet size={14} /> Cüzdan</span>
                <span className="font-medium">₺{balance}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-3"><span>Toplam</span><span className="font-mono">₺{cartTotal}</span></div>

              {err && <p className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2">{err}</p>}

              {!user ? (
                <Link to="/giris" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2">Ödemek için giriş yap</Link>
              ) : balance < cartTotal ? (
                <>
                  <p className="text-xs text-muted-foreground">Bakiyeniz yetersiz. Cüzdanınıza ₺{cartTotal - balance} daha yükleyin.</p>
                  <button onClick={() => nav("/profil")} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2"><Plus size={16} /> Bakiye Yükle</button>
                </>
              ) : (
                <button onClick={onCheckout} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 inline-flex items-center justify-center gap-2"><Wallet size={16} /> Cüzdanla Öde</button>
              )}
              <p className="text-[11px] text-muted-foreground text-center">Ödemeler güvenli cüzdan bakiyenizden yapılır.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
