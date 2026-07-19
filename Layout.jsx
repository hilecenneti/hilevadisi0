import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, Lock, Star, Search, ShoppingCart, User, Gift, Headphones, Award, Settings, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TRUST_FOOTER } from "@/data/store";

const ICONS = { ShieldCheck, Zap, Lock, Headphones, Award, Settings };

function Avatar({ user, size = 32 }) {
  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className="rounded-full object-cover border border-black/10" style={{ height: size, width: size }} />;
  }
  const letter = (user?.name || "?").charAt(0).toUpperCase();
  return (
    <span className="rounded-full grid place-items-center bg-accent-cyan/12 text-accent-cyan font-bold border border-accent-cyan/25" style={{ height: size, width: size, fontSize: size * 0.42 }}>{letter}</span>
  );
}

export function Header() {
  const { user, logout, cart } = useApp();
  const nav = useNavigate();
  return (
    <>
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
              <ShieldCheck className="text-accent-cyan" size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight"><span className="text-foreground">Hile</span><span className="text-accent-cyan">vadisi</span></span>
          </Link>
          <div className="flex-1 relative hidden md:block max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input placeholder="Ürün, oyun veya satıcı ara..." className="w-full h-10 rounded-xl bg-secondary border border-border pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" />
          </div>
          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <a href="#magaza" className="hidden lg:inline px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Mağaza</a>
            <a href="#yorumlar" className="hidden lg:inline px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Yorumlar</a>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-accent-gold"><Gift size={16} /> Çekiliş</span>
            <Link to="/sepet" aria-label="Sepet" className="relative h-10 w-10 grid place-items-center rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground">
              <ShoppingCart size={18} />
              {cart?.length > 0 && <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 grid place-items-center rounded-full bg-accent-cyan text-white text-[10px] font-bold">{cart.length}</span>}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "admin" && <Link to="/admin" className="hidden sm:inline px-3 py-2 rounded-xl bg-accent-cyan/10 text-accent-cyan text-sm font-semibold border border-accent-cyan/20">Admin</Link>}
                <Link to="/profil" className="inline-flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-xl bg-secondary border border-border text-sm font-medium hover:text-accent-cyan transition-colors">
                  <Avatar user={user} size={28} /> <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                </Link>
                <button onClick={() => { logout(); nav("/"); }} aria-label="Çıkış" className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-secondary border border-border text-sm hover:text-accent-red transition-colors"><LogOut size={16} /></button>
              </div>
            ) : (
              <Link to="/giris" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"><User size={16} /> Giriş Yap</Link>
            )}
          </nav>
        </div>
        <div className="border-t border-border bg-accent-cyan/[0.05]">
          <div className="container mx-auto h-9 flex items-center justify-center gap-2 px-4">
            <ShieldCheck className="text-accent-cyan" size={15} />
            <span className="text-xs sm:text-sm font-medium text-foreground/80 tracking-wide">%100 Güvenli Kullanım · 7/24 Destek · Anında Teslimat</span>
          </div>
        </div>
      </header>
    </>
  );
}

export function TopStrip() {
  const items = [["Resmi Bayi", ShieldCheck], ["Anında Teslimat", Zap], ["SSL Güvenli", Lock], ["4.9/5 (2.4K+ Yorum)", Star]];
  return (
    <div className="hidden sm:block bg-secondary/50 border-b border-border">
      <div className="container mx-auto h-7 px-4 flex items-center justify-center gap-4 md:gap-8">
        {items.map(([t, Ic]) => (
          <div key={t} className="flex items-center gap-1.5">
            <Ic className="text-accent-cyan" size={11} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-secondary/40">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="text-center mb-8"><span className="text-eyebrow"><span className="h-px w-6 bg-accent-cyan/40" /> Güven & İletişim</span></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRUST_FOOTER.map((t) => {
            const Ic = ICONS[t.icon] || ShieldCheck;
            return (
              <div key={t.title} className="glass-card p-5">
                <div className="h-10 w-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 grid place-items-center mb-3"><Ic className="text-accent-cyan" size={18} /></div>
                <h4 className="font-bold text-sm text-foreground">{t.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Hilevadisi — Türkiye'nin güvenilir hile mağazası</span>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Hilevadisi. Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  );
}
