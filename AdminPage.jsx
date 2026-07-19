import React, { useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  ShieldCheck, ArrowLeft, LayoutDashboard, Package, Image as ImageIcon, Ticket, FileText,
  ShoppingBag, Wallet, Wrench, Gift, LifeBuoy, Star, Users, Mail, FolderTree, Percent,
  Files, Plus, Trash2, Pencil, Search, TrendingUp, DollarSign, UserCheck, Menu, X,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { REVIEWS, CATEGORIES as PRODUCT_CATEGORIES, PKG_DEFS } from "@/data/store";
import {
  REVENUE_TREND, CATEGORY_SALES, TRAFFIC, BANNERS, COUPONS, BLOG_POSTS,
  SETUP_TICKETS, RAFFLES, SUPPORT_TICKETS, MAIL_HISTORY, CATEGORIES,
  DISCOUNTS, PAGES,
} from "@/data/adminData";

const NAV = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "products", label: "Ürünler", icon: Package },
  { id: "banners", label: "Bannerlar", icon: ImageIcon },
  { id: "coupons", label: "Kuponlar", icon: Ticket },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "orders", label: "Siparişler", icon: ShoppingBag },
  { id: "balance", label: "Bakiye Talepleri", icon: Wallet },
  { id: "setup", label: "Kurulum Destek", icon: Wrench },
  { id: "raffle", label: "Çekiliş Yönetimi", icon: Gift },
  { id: "support", label: "Destek", icon: LifeBuoy },
  { id: "reviews", label: "Yorumlar", icon: Star },
  { id: "users", label: "Kullanıcılar", icon: Users },
  { id: "mail", label: "Mail Geçmişi", icon: Mail },
  { id: "categories", label: "Kategoriler", icon: FolderTree },
  { id: "discounts", label: "İndirimler", icon: Percent },
  { id: "pages", label: "Sayfalar", icon: Files },
];

const CHART_COLORS = ["#4f46e5", "#f97316", "#e11d48", "#d99a0a", "#0ea5e9", "#16a34a"];

const STATUS_TONE = {
  "Tamamlandı": "green", "Onaylandı": "green", "Aktif": "green", "Yayında": "green",
  "Gönderildi": "green", "Yanıtlandı": "green", "Kapalı": "gray",
  "Beklemede": "amber", "Taslak": "amber", "İşlemde": "amber", "Açık": "amber",
  "İptal": "red", "Reddedildi": "red", "Başarısız": "red", "Yasaklı": "red",
};
const PRIORITY_TONE = { "Yüksek": "red", "Orta": "amber", "Düşük": "gray" };

function Badge({ children, tone = "gray" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${map[tone] || map.gray}`}>{children}</span>;
}

function SectionHead({ title, desc, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {desc && <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function ActionBtn({ children }) {
  return (
    <button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
      {children}
    </button>
  );
}

function RowActions() {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"><Pencil size={15} /></button>
      <button className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 size={15} /></button>
    </div>
  );
}

function Table({ columns, rows, render, filterKeys }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => (filterKeys || Object.keys(r)).some((k) => String(r[k] ?? "").toLowerCase().includes(t)));
  }, [q, rows, filterKeys]);
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Search size={16} className="text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara..." className="w-full bg-transparent text-sm focus:outline-none" />
        <span className="text-xs text-muted-foreground shrink-0">{filtered.length} kayıt</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50/70">
              {columns.map((c) => (
                <th key={c} className="text-left font-semibold text-xs uppercase tracking-wide text-muted-foreground px-4 py-3 whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r, i) => (
              <tr key={r.id || i} className="hover:bg-slate-50/60 transition-colors">{render(r)}</tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const Td = ({ children, className = "" }) => <td className={`px-4 py-3 align-middle whitespace-nowrap ${className}`}>{children}</td>;

/* ---------------- Overview ---------------- */
function Overview({ products }) {
  const { orders, allUsers } = useApp();
  const totalRevenue = orders.reduce((a, b) => a + (b.amount || 0), 0);
  const totalOrders = orders.length;
  const activeUsers = allUsers.filter((u) => (u.status || "Aktif") === "Aktif").length;
  const kpis = [
    { label: "Toplam Gelir", value: "₺" + totalRevenue.toLocaleString("tr-TR"), sub: totalOrders > 0 ? "Cüzdan satışları" : "Henüz satış yok", icon: DollarSign, tone: "indigo" },
    { label: "Toplam Sipariş", value: totalOrders.toLocaleString("tr-TR"), sub: totalOrders > 0 ? "Tamamlandı" : "Henüz sipariş yok", icon: ShoppingBag, tone: "green" },
    { label: "Aktif Kullanıcı", value: activeUsers.toLocaleString("tr-TR") + " / " + allUsers.length, sub: "Kayıtlı üyeler", icon: UserCheck, tone: "amber" },
    { label: "Aktif Ürün", value: products.length, sub: PRODUCT_CATEGORIES.length + " kategori", icon: Package, tone: "red" },
  ];
  const toneBg = { indigo: "bg-indigo-50 text-indigo-600", green: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", red: "bg-rose-50 text-rose-600" };
  return (
    <div className="space-y-6">
      <SectionHead title="Genel Bakış" desc="Mağazanızın canlı performans özeti" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="glass-card p-5">
            <div className={`h-10 w-10 rounded-xl grid place-items-center mb-3 ${toneBg[k.tone]}`}><k.icon size={20} /></div>
            <p className="text-2xl font-bold tracking-tight">{k.value}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{k.label}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1"><TrendingUp size={12} /> {k.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Gelir & Sipariş Trendi</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={REVENUE_TREND} margin={{ left: -12, right: 8 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v, n) => [n === "gelir" ? "₺" + v.toLocaleString("tr-TR") : v, n === "gelir" ? "Gelir" : "Sipariş"]} />
              <Area type="monotone" dataKey="gelir" stroke="#4f46e5" strokeWidth={2.5} fill="url(#gRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Kategori Satışları</h3>
          {CATEGORY_SALES.length === 0 ? (
            <div className="h-[260px] grid place-items-center text-sm text-muted-foreground text-center px-4">Henüz kategori bazlı satış verisi yok.</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={CATEGORY_SALES} dataKey="value" nameKey="name" innerRadius={52} outerRadius={90} paddingAngle={3}>
                    {CATEGORY_SALES.map((e, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v) => v.toLocaleString("tr-TR")} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {CATEGORY_SALES.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />{c.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Haftalık Ziyaretçi Trafiği</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TRAFFIC} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v) => [v.toLocaleString("tr-TR"), "Ziyaret"]} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="ziyaret" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <RecentOrders />
      </div>
    </div>
  );
}

function RecentOrders() {
  const { orders } = useApp();
  return (
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4">Son Siparişler</h3>
          {orders.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Henüz sipariş alınmadı.</div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center gap-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{o.product}</p>
                    <p className="text-xs text-muted-foreground truncate">{o.userName || o.user}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">₺{o.amount}</p>
                    <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  );
}

/* ---------------- Products ---------------- */
const EMPTY_PKG = { "1g": { price: "", stock: "" }, "7g": { price: "", stock: "" }, "30g": { price: "", stock: "" } };
const EMPTY = { name: "", category: "PUBG", description: "", image: "", video: "", packages: EMPTY_PKG };
function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState("");
  const { toast } = useToast();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPkg = (key, field) => (e) => setForm((f) => ({ ...f, packages: { ...f.packages, [key]: { ...f.packages[key], [field]: e.target.value } } }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, video: reader.result }));
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm(EMPTY);
    setPreview("");
    setErrors({});
    setEditId(null);
  };

  const openAdd = () => { resetForm(); setOpen(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name, category: p.category, description: p.description || "", image: p.image || "", video: p.video || "",
      packages: {
        "1g": { price: p.packages?.["1g"]?.price ?? "", stock: p.packages?.["1g"]?.stock ?? "" },
        "7g": { price: p.packages?.["7g"]?.price ?? "", stock: p.packages?.["7g"]?.stock ?? "" },
        "30g": { price: p.packages?.["30g"]?.price ?? "", stock: p.packages?.["30g"]?.stock ?? "" },
      },
    });
    setPreview(p.image || "");
    setOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Ürün adı zorunlu.";
    if (!form.category.trim()) e.category = "Kategori zorunlu.";
    const anyPrice = PKG_DEFS.some((d) => Number(form.packages[d.key].price) > 0);
    if (!anyPrice) e.packages = "En az bir paket için geçerli fiyat girin.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const packages = {};
    PKG_DEFS.forEach((d) => {
      packages[d.key] = { price: Number(form.packages[d.key].price) || 0, stock: Number(form.packages[d.key].stock) || 0 };
    });
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      image: form.image || "https://images.hostinger.com/685f6361-8f41-41a7-b5b0-355da1867702.png",
      video: form.video || "",
      seller: "Hilevadisi",
      status: "Undetected",
      packages,
    };
    if (editId) {
      updateProduct(editId, payload);
      toast({ title: "Ürün güncellendi", description: `"${payload.name}" güncellendi.` });
    } else {
      addProduct(payload);
      toast({ title: "Ürün eklendi", description: `"${payload.name}" katalogda oluşturuldu.` });
    }
    resetForm();
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <SectionHead
        title="Ürünler"
        desc="Fotoğraf, video, stok ve paket fiyatlarını yönetin"
        action={
          <button type="button" onClick={openAdd} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus size={16} /> Ürün Ekle
          </button>
        }
      />

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4 pt-1">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Ürün adı</label>
              <input value={form.name} onChange={set("name")} placeholder="Örn. PUBG Steam ESP Hilesi" className="h-10 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Kategori</label>
              <select value={form.category} onChange={set("category")} className="h-10 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Paketler (fiyat & stok)</label>
              {errors.packages && <p className="text-xs text-destructive">{errors.packages}</p>}
              <div className="space-y-2">
                {PKG_DEFS.map((d) => (
                  <div key={d.key} className="grid grid-cols-[80px_1fr_1fr] items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{d.label}</span>
                    <input type="number" min="0" value={form.packages[d.key].price} onChange={setPkg(d.key, "price")} placeholder="Fiyat ₺" className="h-9 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    <input type="number" min="0" value={form.packages[d.key].stock} onChange={setPkg(d.key, "stock")} placeholder="Stok" className="h-9 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Açıklama</label>
              <Textarea value={form.description} onChange={set("description")} placeholder="Ürün açıklaması..." rows={3} />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Ürün görseli</label>
              <div className="flex items-center gap-3">
                {(preview || form.image) && <img src={preview || form.image} alt="Önizleme" className="h-14 w-20 object-cover rounded-md border border-border" />}
                <input type="file" accept="image/*" onChange={onFile} className="text-sm flex-1 file:mr-3 file:h-9 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:text-sm file:font-medium file:text-secondary-foreground" />
              </div>
              <input value={form.image.startsWith("data:") ? "" : form.image} onChange={set("image")} placeholder="veya görsel URL'si yapıştırın" className="h-10 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Tanıtım videosu</label>
              <input type="file" accept="video/*" onChange={onVideo} className="text-sm file:mr-3 file:h-9 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:text-sm file:font-medium file:text-secondary-foreground" />
              <input value={form.video.startsWith("data:") ? "" : form.video} onChange={set("video")} placeholder="veya video URL'si yapıştırın" className="h-10 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              {form.video && <p className="text-xs text-emerald-600">Video eklendi.</p>}
            </div>

            <DialogFooter className="pt-2">
              <button type="button" onClick={() => { setOpen(false); resetForm(); }} className="h-10 px-4 rounded-lg border border-input text-sm font-semibold hover:bg-secondary transition-colors">Vazgeç</button>
              <button type="submit" className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Kaydet</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Table
        columns={["Ürün", "Kategori", "1G", "7G", "30G", "Toplam Stok", ""]}
        rows={products}
        filterKeys={["name", "category"]}
        render={(p) => {
          const totalStock = PKG_DEFS.reduce((s, d) => s + (p.packages?.[d.key]?.stock || 0), 0);
          return (
            <>
              <Td><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-9 w-14 object-cover rounded-md" /><span className="font-medium max-w-[220px] truncate">{p.name}</span></div></Td>
              <Td><Badge tone="indigo">{p.category}</Badge></Td>
              <Td className="font-semibold">₺{p.packages?.["1g"]?.price ?? "—"}</Td>
              <Td className="font-semibold">₺{p.packages?.["7g"]?.price ?? "—"}</Td>
              <Td className="font-semibold">₺{p.packages?.["30g"]?.price ?? "—"}</Td>
              <Td className="text-muted-foreground">{totalStock}</Td>
              <Td>
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 size={15} /></button>
                </div>
              </Td>
            </>
          );
        }}
      />
    </div>
  );
}

/* ---------------- Generic table sections ---------------- */
function Banners() {
  return (
    <div className="space-y-5">
      <SectionHead title="Bannerlar" desc="Ana sayfa ve kampanya görselleri" action={<ActionBtn><Plus size={16} /> Banner Ekle</ActionBtn>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BANNERS.map((b) => (
          <div key={b.id} className="glass-card overflow-hidden">
            <img src={b.image} alt={b.title} className="h-32 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold truncate">{b.title}</p>
                <Badge tone={b.active ? "green" : "gray"}>{b.active ? "Aktif" : "Pasif"}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{b.position} · {b.link}</p>
              <div className="mt-3 border-t border-border pt-2 flex justify-end"><RowActions /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Coupons() {
  return (
    <div className="space-y-5">
      <SectionHead title="Kuponlar" desc="İndirim kuponlarını yönetin" action={<ActionBtn><Plus size={16} /> Kupon Oluştur</ActionBtn>} />
      <Table columns={["Kod", "İndirim", "Tür", "Kullanım", "Bitiş", "Durum", ""]} rows={COUPONS} filterKeys={["code"]}
        render={(c) => (
          <>
            <Td><span className="font-mono font-semibold">{c.code}</span></Td>
            <Td className="font-semibold text-indigo-600">{c.discount}</Td>
            <Td>{c.type}</Td>
            <Td className="text-muted-foreground">{c.uses}/{c.limit}</Td>
            <Td className="text-muted-foreground">{c.expires}</Td>
            <Td><Badge tone={c.active ? "green" : "gray"}>{c.active ? "Aktif" : "Pasif"}</Badge></Td>
            <Td><RowActions /></Td>
          </>
        )} />
    </div>
  );
}

function Blog() {
  return (
    <div className="space-y-5">
      <SectionHead title="Blog" desc="Yazıları oluşturun ve düzenleyin" action={<ActionBtn><Plus size={16} /> Yeni Yazı</ActionBtn>} />
      <Table columns={["Başlık", "Yazar", "Görüntüleme", "Tarih", "Durum", ""]} rows={BLOG_POSTS} filterKeys={["title", "author"]}
        render={(b) => (
          <>
            <Td className="font-medium max-w-[260px] truncate">{b.title}</Td>
            <Td className="text-muted-foreground">{b.author}</Td>
            <Td className="text-muted-foreground">{b.views.toLocaleString("tr-TR")}</Td>
            <Td className="text-muted-foreground">{b.date}</Td>
            <Td><Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge></Td>
            <Td><RowActions /></Td>
          </>
        )} />
    </div>
  );
}

function Orders() {
  const { orders } = useApp();
  const total = orders.reduce((a, b) => a + (b.amount || 0), 0);
  return (
    <div className="space-y-5">
      <SectionHead title="Siparişler" desc={`Toplam ${orders.length} sipariş · ₺${total.toLocaleString("tr-TR")} ciro`} />
      <Table columns={["Sipariş", "Müşteri", "Ürün", "Tutar", "Ödeme", "Tarih", "Durum"]} rows={orders} filterKeys={["id", "user", "product"]}
        render={(o) => (
          <>
            <Td className="font-mono font-semibold">{o.id}</Td>
            <Td>{o.userName || o.user}</Td>
            <Td className="max-w-[200px] truncate">{o.product}</Td>
            <Td className="font-semibold">₺{o.amount}</Td>
            <Td className="text-muted-foreground">{o.method}</Td>
            <Td className="text-muted-foreground">{o.date}</Td>
            <Td><Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge></Td>
          </>
        )} />
    </div>
  );
}

function BalanceRequests() {
  const { balanceRequests, resolveBalanceRequest } = useApp();
  return (
    <div className="space-y-5">
      <SectionHead title="Bakiye Talepleri" desc="Bakiye yükleme ve para çekme talepleri" />
      <Table columns={["Kullanıcı", "Tür", "Tutar", "Yöntem", "Tarih", "Durum", "İşlem"]} rows={balanceRequests} filterKeys={["user", "name"]}
        render={(r) => (
          <>
            <Td className="font-medium">{r.name || r.user}</Td>
            <Td><Badge tone={r.type === "Çekim" ? "amber" : "indigo"}>{r.type}</Badge></Td>
            <Td className="font-semibold">₺{r.amount}</Td>
            <Td className="text-muted-foreground">{r.method}</Td>
            <Td className="text-muted-foreground">{r.date}</Td>
            <Td><Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge></Td>
            <Td>
              {r.status === "Beklemede" ? (
                <div className="flex gap-1.5">
                  <button onClick={() => resolveBalanceRequest(r.id, true)} className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Onayla</button>
                  <button onClick={() => resolveBalanceRequest(r.id, false)} className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100">Reddet</button>
                </div>
              ) : <span className="text-xs text-muted-foreground">İşlendi</span>}
            </Td>
          </>
        )} />
    </div>
  );
}

function SetupSupport() {
  return (
    <div className="space-y-5">
      <SectionHead title="Kurulum Destek" desc="Ürün kurulum destek talepleri" />
      <Table columns={["Kullanıcı", "Ürün", "Konu", "Öncelik", "Tarih", "Durum"]} rows={SETUP_TICKETS} filterKeys={["user", "product", "topic"]}
        render={(t) => (
          <>
            <Td className="font-medium">{t.user}</Td>
            <Td className="text-muted-foreground max-w-[180px] truncate">{t.product}</Td>
            <Td>{t.topic}</Td>
            <Td><Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge></Td>
            <Td className="text-muted-foreground">{t.date}</Td>
            <Td><Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge></Td>
          </>
        )} />
    </div>
  );
}

function Raffle() {
  return (
    <div className="space-y-5">
      <SectionHead title="Çekiliş Yönetimi" desc="Çekilişleri oluşturun ve kazananları belirleyin" action={<ActionBtn><Plus size={16} /> Çekiliş Oluştur</ActionBtn>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RAFFLES.map((r) => (
          <div key={r.id} className="glass-card p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center"><Gift size={20} /></div>
              <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
            </div>
            <p className="font-semibold">{r.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">Ödül: {r.prize}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{r.participants.toLocaleString("tr-TR")} katılımcı</span>
              <span className="text-muted-foreground">Bitiş: {r.endDate}</span>
            </div>
            <button className="mt-4 w-full h-9 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15 transition-colors">Kazanan Çek</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Support() {
  return (
    <div className="space-y-5">
      <SectionHead title="Destek" desc="Genel destek talepleri" />
      <Table columns={["Kullanıcı", "Konu", "Öncelik", "Tarih", "Durum"]} rows={SUPPORT_TICKETS} filterKeys={["user", "subject"]}
        render={(t) => (
          <>
            <Td className="font-medium">{t.user}</Td>
            <Td>{t.subject}</Td>
            <Td><Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge></Td>
            <Td className="text-muted-foreground">{t.date}</Td>
            <Td><Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge></Td>
          </>
        )} />
    </div>
  );
}

function Reviews() {
  const [rows, setRows] = useState(
  REVIEWS.map((r, i) => ({ ...r, id: "rv" + i }))
);

const [editing, setEditing] = useState(null);
  return (
      {editing && (
  <Dialog open={true} onOpenChange={() => setEditing(null)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Yorumu Düzenle</DialogTitle>
      </DialogHeader>

      <input
        className="w-full border rounded-lg p-2 mb-3"
        value={editing.user}
        onChange={(e) =>
          setEditing({ ...editing, user: e.target.value })
        }
        placeholder="Kullanıcı"
      />

      <input
        className="w-full border rounded-lg p-2 mb-3"
        value={editing.product}
        onChange={(e) =>
          setEditing({ ...editing, product: e.target.value })
        }
        placeholder="Ürün"
      />

      <Textarea
        value={editing.text}
        onChange={(e) =>
          setEditing({ ...editing, text: e.target.value })
        }
      />

      <DialogFooter>
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() => setEditing(null)}
        >
          İptal
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => {
            setRows(
              rows.map((x) =>
                x.id === editing.id ? editing : x
              )
            );
            setEditing(null);
          }}
        >
          Kaydet
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
    <div className="space-y-5">
      <SectionHead title="Yorumlar" desc={rows.length > 0 ? "Müşteri değerlendirmeleri" : "Henüz müşteri değerlendirmesi yok"} />
      <Table columns={["Ürün", "Kullanıcı", "Yorum", "Tarih", ""]} rows={rows} filterKeys={["product", "user", "text"]}
        render={(r) => (
          <>
            <Td className="text-muted-foreground max-w-[220px] truncate">{r.product}</Td>
            <Td className="font-medium">{r.user}</Td>
            <Td className="max-w-[240px] truncate">{r.text}</Td>
            <Td className="text-muted-foreground">{r.date}</Td>
            <Td>
  <div className="flex items-center justify-end gap-2">
    <button
      onClick={() => setEditing({ ...r })}
      className="p-2 rounded-lg hover:bg-blue-100"
    >
      <Pencil size={16} />
    </button>

    <button
      onClick={() =>
        setRows(rows.filter((x) => x.id !== r.id))
      }
      className="p-2 rounded-lg hover:bg-red-100"
    >
      <Trash2 size={16} />
    </button>
  </div>
</Td>
          </>
        )} />
    </div>
  );
}

function UsersSection() {
  const { allUsers, orders } = useApp();
  const rows = allUsers.map((u) => ({ ...u, orderCount: orders.filter((o) => o.user === u.email).length }));
  return (
    <div className="space-y-5">
      <SectionHead title="Kullanıcılar" desc={`${rows.length} kayıtlı kullanıcı`} />
      <Table columns={["Kullanıcı", "E-posta", "Rol", "Bakiye", "Sipariş", "Kayıt", "Durum"]} rows={rows} filterKeys={["name", "email"]}
        render={(u) => (
          <>
            <Td className="font-medium">{u.name}</Td>
            <Td className="text-muted-foreground">{u.email}</Td>
            <Td><Badge tone={u.role === "admin" ? "indigo" : "gray"}>{u.role === "admin" ? "Yönetici" : "Üye"}</Badge></Td>
            <Td className="font-semibold">₺{u.balance || 0}</Td>
            <Td className="text-muted-foreground">{u.orderCount}</Td>
            <Td className="text-muted-foreground">{u.joined || "—"}</Td>
            <Td><Badge tone={STATUS_TONE[u.status || "Aktif"]}>{u.status || "Aktif"}</Badge></Td>
          </>
        )} />
    </div>
  );
}

function MailHistory() {
  return (
    <div className="space-y-5">
      <SectionHead title="Mail Geçmişi" desc="Gönderilen e-postaların kaydı" />
      <Table columns={["Alıcı", "Konu", "Tür", "Tarih", "Durum"]} rows={MAIL_HISTORY} filterKeys={["to", "subject"]}
        render={(m) => (
          <>
            <Td className="font-medium">{m.to}</Td>
            <Td>{m.subject}</Td>
            <Td><Badge tone="indigo">{m.type}</Badge></Td>
            <Td className="text-muted-foreground">{m.date}</Td>
            <Td><Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge></Td>
          </>
        )} />
    </div>
  );
}

function Categories() {
  return (
    <div className="space-y-5">
      <SectionHead title="Kategoriler" desc="Ürün kategorilerini düzenleyin" action={<ActionBtn><Plus size={16} /> Kategori Ekle</ActionBtn>} />
      <Table columns={["Kategori", "Slug", "Ürün", "Durum", ""]} rows={CATEGORIES} filterKeys={["name", "slug"]}
        render={(c) => (
          <>
            <Td className="font-medium">{c.name}</Td>
            <Td className="font-mono text-muted-foreground">{c.slug}</Td>
            <Td className="text-muted-foreground">{c.products}</Td>
            <Td><Badge tone={c.active ? "green" : "gray"}>{c.active ? "Aktif" : "Pasif"}</Badge></Td>
            <Td><RowActions /></Td>
          </>
        )} />
    </div>
  );
}

function Discounts() {
  return (
    <div className="space-y-5">
      <SectionHead title="İndirimler" desc="Aktif ve planlı indirimler" action={<ActionBtn><Plus size={16} /> İndirim Ekle</ActionBtn>} />
      <Table columns={["Ürün", "Eski Fiyat", "Yeni Fiyat", "İndirim", "Bitiş", "Durum", ""]} rows={DISCOUNTS} filterKeys={["product"]}
        render={(d) => (
          <>
            <Td className="font-medium max-w-[220px] truncate">{d.product}</Td>
            <Td className="text-muted-foreground line-through">₺{d.oldPrice}</Td>
            <Td className="font-semibold">₺{d.newPrice}</Td>
            <Td><Badge tone="red">%{d.percent}</Badge></Td>
            <Td className="text-muted-foreground">{d.ends}</Td>
            <Td><Badge tone={d.active ? "green" : "gray"}>{d.active ? "Aktif" : "Pasif"}</Badge></Td>
            <Td><RowActions /></Td>
          </>
        )} />
    </div>
  );
}

function PagesSection() {
  return (
    <div className="space-y-5">
      <SectionHead title="Sayfalar" desc="Statik içerik sayfaları" action={<ActionBtn><Plus size={16} /> Sayfa Ekle</ActionBtn>} />
      <Table columns={["Başlık", "URL", "Güncelleme", "Durum", ""]} rows={PAGES} filterKeys={["title", "slug"]}
        render={(p) => (
          <>
            <Td className="font-medium">{p.title}</Td>
            <Td className="font-mono text-muted-foreground">{p.slug}</Td>
            <Td className="text-muted-foreground">{p.updated}</Td>
            <Td><Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge></Td>
            <Td><RowActions /></Td>
          </>
        )} />
    </div>
  );
}

/* ---------------- Shell ---------------- */
export default function AdminPage() {
  const { user, products } = useApp();
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!user) return <Navigate to="/giris" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const sections = {
    overview: <Overview products={products} />,
    products: <Products />,
    banners: <Banners />,
    coupons: <Coupons />,
    blog: <Blog />,
    orders: <Orders />,
    balance: <BalanceRequests />,
    setup: <SetupSupport />,
    raffle: <Raffle />,
    support: <Support />,
    reviews: <Reviews />,
    users: <UsersSection />,
    mail: <MailHistory />,
    categories: <Categories />,
    discounts: <Discounts />,
    pages: <PagesSection />,
  };

  const NavList = () => (
    <nav className="space-y-0.5">
      {NAV.map((n) => {
        const on = active === n.id;
        return (
          <button key={n.id} onClick={() => { setActive(n.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${on ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
            <n.icon size={17} className="shrink-0" />
            <span className="truncate">{n.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="px-4 lg:px-6 h-16 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100"><Menu size={20} /></button>
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center"><ShieldCheck className="text-primary" size={20} /></div>
          <div className="leading-tight">
            <span className="font-bold block">Hilevadisi Admin</span>
            <span className="text-[11px] text-muted-foreground hidden sm:block">Yönetim Paneli</span>
          </div>
          <Link to="/" className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> <span className="hidden sm:inline">Siteye dön</span></Link>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-60 shrink-0 border-r border-border bg-card/50 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto scrollbar-none p-3">
          <NavList />
        </aside>

        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-card p-4 overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Menü</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
              </div>
              <NavList />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 lg:p-8">{sections[active]}</main>
      </div>
      <Toaster />
    </div>
  );
}
