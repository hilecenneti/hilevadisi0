import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Zap, ShoppingBag, Flame, TrendingUp, Play, Search, SlidersHorizontal, Star, Users, Award, Crown, RotateCcw, Headphones, Gamepad2, Crosshair, Target, Swords, CheckCircle2, XCircle } from "lucide-react";
import { Header, TopStrip, Footer } from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { IMG, STATS, COMPARISON, SALES, REVIEWS } from "@/data/store";
const ICONS = {
  Users,
  ShoppingBag,
  Star,
  Award,
  Crown,
  Gamepad2,
  Crosshair,
  Target,
  Swords
};
function CategoryPromo({
  name,
  title,
  desc,
  color,
  img,
  reverse
}) {
  return <section className="container mx-auto px-4 lg:px-8 pt-4">
      <button type="button" className="group relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-background to-background shadow-sm transition-all hover:border-accent-cyan/30 min-h-[300px] sm:min-h-[180px]" style={{
      background: `linear-gradient(135deg, ${color}1a, transparent)`
    }}>
        <div className={`flex flex-col ${reverse ? "sm:flex-row-reverse" : "sm:flex-row"} items-stretch min-h-[300px] sm:min-h-[180px]`}>
          <div className="relative w-full sm:w-[340px] aspect-video sm:aspect-auto sm:h-[180px] shrink-0 overflow-hidden bg-black">
            <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg" style={{
              background: color
            }}><Play className="text-white fill-white ml-0.5" size={20} /></div>
            </div>
          </div>
          <div className="flex-1 p-5 sm:p-6 text-left flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 self-start mb-2 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-wider" style={{
            color,
            background: `${color}1a`,
            border: `1px solid ${color}4d`
          }}><span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{
              background: color
            }} />Öne Çıkan</span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all" style={{
            color
          }}>{name} kategorisine git <ArrowRight size={16} /></span>
          </div>
        </div>
      </button>
    </section>;
}
function ProductCard({
  p
}) {
  const prices = Object.values(p.packages || {}).map(x => x.price);
  const from = prices.length ? Math.min(...prices) : 0;
  return <Link to={`/urun/${p.id}`} className="glass-card neon-glow-hover group relative cursor-pointer overflow-hidden block">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="badge-status bg-green-500/10 border border-green-500/20"><span className="h-1.5 w-1.5 rounded-full bg-green-400" /><span className="text-green-600">{p.status}</span></span>
          <span className="badge-status border bg-accent-cyan/10 border-accent-cyan/25 text-accent-cyan">{p.category}</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h2 className="font-semibold text-base leading-tight tracking-tight">{p.name}</h2>
          <p className="text-foreground/70 text-sm mt-1">{p.seller} • <span className="font-mono">1 / 7 / 30</span> günlük</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-[10px] text-foreground/60 font-mono uppercase block">Başlayan</span>
            <span className="text-2xl font-mono font-bold tabular-nums">₺{from}</span>
          </div>
          <span className="p-3 rounded-xl bg-secondary group-hover:bg-accent-cyan/20 text-foreground group-hover:text-accent-cyan transition-all"><ArrowRight size={18} /></span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity bg-accent-cyan" />
    </Link>;
}
export default function HomePage() {
  const {
    products
  } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())), [products, q]);
  const topSellers = products.slice(0, 3);
  return <div className="min-h-screen bg-background">
      <TopStrip />
      <Header />

      <main>
        {/* Hero banner */}
        <section className="container mx-auto px-4 lg:px-8 pt-6">
          <div className="premium-border relative w-full aspect-[16/9] sm:aspect-[2.5/1] lg:aspect-[3/1] rounded-2xl overflow-hidden cursor-pointer group shadow-2xl">
            <img src={IMG.banner} alt="ÇEKİLİŞ" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-3 right-3 sm:top-5 sm:right-5 sm:bottom-auto flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-xl border border-border px-3 py-1.5">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" /></span>
              <span className="text-[10px] sm:text-xs font-mono font-semibold text-white">Aktif & Güvenli</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-10">
              <span className="mb-2 inline-block rounded-full border border-accent-cyan/30 bg-accent-cyan/20 px-3 py-1 text-[10px] sm:text-xs font-mono text-accent-cyan">Türkiye'nin Güvenilir Hile Mağazası</span>
              <h2 className="mb-2 text-lg font-bold text-white drop-shadow-lg sm:text-2xl lg:text-3xl tracking-tight">PROFESYONEL HİLELER HIZLI TESLİMAT&nbsp;</h2>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-cyan group-hover:text-white transition-colors"><ArrowRight size={16} /></span>
            </div>
          </div>
        </section>

        {/* Mini stats */}
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="grid grid-cols-3 lg:flex lg:justify-center gap-2 sm:gap-12">
            {[["7/24", "Canlı Destek", Clock], ["42sn", "Ort. Teslimat", Zap], ["10.000+", "Teslim Sipariş", ShoppingBag]].map(([v, l, Ic]) => <div key={l} className="flex items-center gap-2 sm:gap-2.5 justify-center min-w-0">
                <div className="h-8 w-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 grid place-items-center shrink-0"><Ic className="text-accent-cyan" size={14} /></div>
                <div className="min-w-0"><p className="text-sm sm:text-lg font-mono font-bold leading-none">{v}</p><p className="mt-1 text-[8px] sm:text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">{l}</p></div>
              </div>)}
          </div>
        </div>

        {/* Store status banner */}
        <div className="container mx-auto px-4 lg:px-8 mb-2">
          <div className="glass-card flex items-center justify-center gap-3 py-3 px-5 text-sm">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" /></span>
            <Flame className="text-accent-orange" size={14} />
            <span className="text-muted-foreground">Binlerce mutlu müşteri — <span className="text-foreground font-bold">güvenle alışverişe başla!</span></span>
            <TrendingUp className="text-green-400" size={14} />
          </div>
        </div>

        <CategoryPromo name="Rust" title="Rust Hile — Aimbot, ESP & No Recoil" desc="Güvenli Rust hilelerini canlı izle, anında satın al." color="#cd412b" img={IMG.rust} reverse />

        {/* Store */}
        <section id="magaza" className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <div>
              <span className="text-eyebrow mb-3"><span className="h-px w-6 bg-accent-cyan/40" /> Mağaza</span>
              <h1 className="h-section mt-2">Hile Satın Al - PUBG, ARC Ralders, Apex</h1>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-mono text-accent-cyan"><span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />{filtered.length} ürün mevcut</span>
          </div>
          <div className="mb-6 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ürün ara..." className="w-full rounded-md border border-input bg-background pl-9 pr-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" />
            </div>
            <button className="h-10 px-3 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><SlidersHorizontal size={14} /><span className="hidden sm:inline">Filtreler</span></button>
          </div>
          {filtered.length === 0 ? <div className="glass-card p-12 text-center text-muted-foreground">
              {products.length === 0 ? "Ürünler yakında eklenecek. Mağazamızı takipte kalın." : "Aradığınız kriterde ürün bulunamadı."}
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => <ProductCard key={p.id} p={p} />)}
            </div>}
        </section>

        {/* Why us */}
        <section className="container mx-auto px-4 lg:px-8 py-12">
          <div className="text-center mb-10">
            <span className="text-eyebrow justify-center">— Neden Biz?</span>
            <h2 className="h-section mt-3">Memnuniyetle Satın Alın</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Alışveriş deneyiminizi en üst seviyeye taşıyoruz. Para iadesi, teknik destek ve geniş oyun veritabanı ile güvenle alışveriş yapın.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[[RotateCcw, "Para İadesi", "Alışverişlerinizde sorun yaşarsanız koşulsuz para iadesi garantisi sunuyoruz.", "Profile Git", "accent-cyan"], [Headphones, "Teknik Destek", "Profesyonel ekibimiz 7/24 hizmetinizdedir. Kurulum ve teknik sorunlarınızda anında yardım.", "İletişime Geçin", "accent-cyan"], [Gamepad2, "Oyun Çeşitliliği", "Valorant, CS2, PUBG, Apex ve daha fazlası. Veritabanımız sürekli güncellenir.", "Oyunları Görüntüle", "accent-gold"]].map(([Ic, t, d, cta, c]) => <div key={t} className="glass-card p-6">
                <div className={`h-11 w-11 rounded-xl bg-${c}/10 border border-${c}/20 grid place-items-center mb-4`}><Ic className={`text-${c}`} size={20} /></div>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{d}</p>
                <span className={`inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-${c}`}>{cta} →</span>
              </div>)}
          </div>
        </section>

        {/* Stats numbers */}
        <section className="container mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(s => {
            const Ic = ICONS[s.icon] || Star;
            return <div key={s.label} className="glass-card p-6 text-center">
                <Ic className={`mx-auto mb-3 text-${s.color}`} size={22} />
                <p className="text-2xl sm:text-3xl font-mono font-bold">{s.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-2">{s.label}</p>
              </div>;
          })}
          </div>
        </section>

        {/* Comparison */}
        <section className="container mx-auto px-4 lg:px-8 py-12">
          <div className="text-center mb-8">
            <span className="text-eyebrow justify-center">— Karşılaştırma</span>
            <h2 className="h-section mt-3">Neden Hile Satın Almak için Hilevadisi?</h2>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-3 px-6 py-4 border-b border-border text-sm font-semibold">
              <span>Özellik</span><span className="text-center text-accent-cyan">Hilevadisi</span><span className="text-right">Diğer Hile Siteleri</span>
            </div>
            {COMPARISON.map(c => <div key={c.feature} className="grid grid-cols-3 px-6 py-4 border-b border-border last:border-0 text-sm items-center">
                <span className="text-foreground/90">{c.feature}</span>
                <span className="flex items-center justify-center gap-2 text-foreground"><CheckCircle2 className="text-accent-cyan" size={16} /> {c.us}</span>
                <span className="flex items-center justify-end gap-2 text-muted-foreground"><XCircle className="text-accent-red" size={16} /> {c.them}</span>
              </div>)}
          </div>
        </section>

        {/* Sales stats */}
        {SALES.length > 0 && <section className="container mx-auto px-4 lg:px-8 py-12">
            <div className="text-center mb-8">
              <span className="text-eyebrow justify-center">— İstatistik</span>
              <h2 className="h-section mt-3">Satışlar</h2>
              <p className="text-muted-foreground mt-2">Kategori bazlı satış sayılarımız · <span className="text-accent-cyan">karta tıkla, kategoriye git</span></p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SALES.map(s => {
            const Ic = ICONS[s.icon] || Target;
            return <div key={s.name} className="glass-card p-5 relative overflow-hidden hover:border-accent-cyan/30 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <Ic className="text-foreground/80" size={20} />
                    <ArrowRight className="text-muted-foreground -rotate-45 group-hover:text-accent-cyan transition-colors" size={16} />
                  </div>
                  <h3 className="mt-6 font-bold">{s.name}</h3>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{s.count} adet satıldı</p>
                </div>;
          })}
            </div>
          </section>}

        {/* Reviews */}
        <section id="yorumlar" className="container mx-auto px-4 lg:px-8 py-12">
          {REVIEWS.length > 0 ? <div className="glass-card p-6 sm:p-8 mb-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-end gap-2"><span className="text-5xl font-mono font-bold">4.9</span><span className="text-muted-foreground mb-1">/ 5</span></div>
                <div className="flex gap-0.5 mt-2">{[...Array(5)].map((_, i) => <Star key={i} className="text-accent-gold fill-accent-gold" size={18} />)}</div>
                <p className="text-sm text-muted-foreground mt-2">{REVIEWS.length} doğrulanmış yorum</p>
              </div>
              <div className="space-y-2">
                {[["5", 94], ["4", 6], ["3", 0], ["2", 0], ["1", 0]].map(([n, pct]) => <div key={n} className="flex items-center gap-3 text-xs">
                    <span className="w-6 font-mono flex items-center gap-0.5">{n}<Star className="text-accent-gold fill-accent-gold" size={10} /></span>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-accent-gold" style={{
                  width: `${pct}%`
                }} /></div>
                    <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                  </div>)}
              </div>
            </div> : <div className="glass-card p-8 mb-10 text-center">
              <div className="flex gap-0.5 justify-center mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="text-muted-foreground/40" size={18} />)}</div>
              <p className="text-muted-foreground text-sm">Henüz yorum yok. Yeni açılan mağazamız için ilk yorumu siz bırakın.</p>
            </div>}
          <div className="text-center mb-8">
            <h2 className="h-section">Müşteri Yorumları</h2>
            <p className="text-muted-foreground mt-2">Ürünlerimizi kullanan müşterilerin görüşleri</p>
          </div>
          {REVIEWS.length === 0 ? <div className="glass-card p-12 text-center text-muted-foreground">Henüz yorum bulunmuyor.</div> : <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {REVIEWS.map((r, i) => <div key={i} className="glass-card p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary grid place-items-center"><Users className="text-muted-foreground" size={16} /></div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">{r.product}</p>
                        <div className="flex items-center gap-2"><span className="text-sm font-mono font-semibold">{r.user}</span><span className="inline-flex items-center gap-1 text-[10px] text-green-400 border border-green-500/30 rounded px-1.5 py-0.5"><CheckCircle2 size={10} /> Doğrulanmış Alıcı</span></div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mt-3">{[...Array(5)].map((_, k) => <Star key={k} className="text-accent-gold fill-accent-gold" size={12} />)}</div>
                    <p className="text-sm mt-3">{r.text}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border">Ürüne git</button>
                      <span className="text-xs font-mono text-muted-foreground">{r.date}</span>
                    </div>
                  </div>)}
              </div>
              <div className="text-center mt-8"><button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary border border-border text-sm font-semibold hover:text-accent-cyan">Daha Fazla Yükle</button></div>
            </>}
        </section>
      </main>
      <Footer />
    </div>;
}