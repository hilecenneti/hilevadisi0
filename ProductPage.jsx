import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, Star, ShieldCheck, Zap, CheckCircle2, Package as PackageIcon, ArrowRight } from "lucide-react";
import { Header, TopStrip, Footer } from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { PKG_DEFS } from "@/data/store";

function RelatedCard({ p }) {
  return (
    <Link to={`/urun/${p.id}`} className="glass-card group overflow-hidden block">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-tight truncate">{p.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">Başlayan ₺{Math.min(...Object.values(p.packages).map((x) => x.price))}</p>
      </div>
    </Link>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { products, addToCart, user } = useApp();
  const product = products.find((p) => p.id === id);
  const [pkgKey, setPkgKey] = useState("7g");
  const [added, setAdded] = useState(false);

  const related = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id) : []),
    [products, product]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <TopStrip /><Header />
        <main className="container mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground">Ürün bulunamadı.</p>
          <Link to="/" className="text-accent-cyan font-semibold mt-4 inline-block">Anasayfaya dön</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const pkgs = PKG_DEFS.map((d) => ({ ...d, ...product.packages[d.key] })).filter((p) => p.price != null);
  const selected = product.packages[pkgKey];
  const outOfStock = !selected || selected.stock <= 0;

  const onAdd = () => {
    if (outOfStock) return;
    addToCart(product, pkgKey);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopStrip />
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft size={16} /> Geri dön</button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Media */}
          <div className="space-y-4">
            <div className="glass-card overflow-hidden aspect-video bg-black">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.video && (
              <div className="glass-card overflow-hidden aspect-video bg-black">
                <video src={product.video} controls className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan">{product.category}</Link>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-3">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-400" /> {product.status || "Undetected"}</span>
              <span className="inline-flex items-center gap-1"><Star className="text-accent-gold fill-accent-gold" size={13} /> 4.9</span>
              <span>{product.seller || "Hilevadisi"}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

            {/* Packages */}
            <div className="mt-6">
              <p className="text-sm font-semibold flex items-center gap-1.5 mb-3"><PackageIcon size={15} className="text-accent-cyan" /> Paket Seçimi</p>
              <div className="grid grid-cols-3 gap-2.5">
                {pkgs.map((p) => {
                  const on = pkgKey === p.key;
                  const soldOut = p.stock <= 0;
                  return (
                    <button key={p.key} disabled={soldOut} onClick={() => setPkgKey(p.key)}
                      className={`relative rounded-xl border p-3 text-left transition-all ${on ? "border-accent-cyan bg-accent-cyan/10 ring-2 ring-accent-cyan/30" : "border-border bg-secondary hover:border-accent-cyan/40"} ${soldOut ? "opacity-50 cursor-not-allowed" : ""}`}>
                      {on && <Check className="absolute top-2 right-2 text-accent-cyan" size={14} />}
                      <p className="text-xs font-medium text-muted-foreground">{product.name.split(" ").slice(0, 2).join(" ")}</p>
                      <p className="text-sm font-bold mt-0.5">{p.label}</p>
                      <p className="text-lg font-mono font-bold mt-1">₺{p.price}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{soldOut ? "Tükendi" : `Stok: ${p.stock}`}</p>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Seçili: <span className="font-semibold text-foreground">{product.name} {PKG_DEFS.find((d) => d.key === pkgKey)?.label}</span></p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <div className="glass-card px-4 py-3">
                <span className="text-[10px] text-muted-foreground font-mono uppercase block">Tutar</span>
                <span className="text-2xl font-mono font-bold">₺{selected?.price ?? "—"}</span>
              </div>
              <button onClick={onAdd} disabled={outOfStock}
                className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {added ? <><CheckCircle2 size={18} /> Sepete Eklendi</> : outOfStock ? "Stokta Yok" : <><ShoppingCart size={18} /> Sepete Ekle</>}
              </button>
            </div>
            {!user && <p className="text-xs text-muted-foreground mt-3">Satın almak için <Link to="/giris" className="text-accent-cyan font-semibold">giriş yapın</Link> ve cüzdanınıza bakiye yükleyin.</p>}

            <div className="grid grid-cols-3 gap-2 mt-6">
              {[[ShieldCheck, "Güvenli"], [Zap, "Anında Teslim"], [CheckCircle2, "İade Garantili"]].map(([Ic, t]) => (
                <div key={t} className="glass-card p-3 text-center">
                  <Ic className="mx-auto text-accent-cyan mb-1.5" size={16} />
                  <p className="text-[11px] text-muted-foreground">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{product.category} kategorisindeki diğer ürünler</h2>
              <Link to="/" className="text-sm text-accent-cyan font-semibold inline-flex items-center gap-1">Tümü <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => <RelatedCard key={p.id} p={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
