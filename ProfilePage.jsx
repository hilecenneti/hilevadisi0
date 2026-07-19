import React, { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Camera, Save, User, Mail, FileText, CheckCircle2, Trash2, ShieldCheck, Wallet, Plus, ArrowDownToLine, ShoppingBag } from "lucide-react";
import { Header, TopStrip, Footer } from "@/components/Layout";
import { useApp } from "@/context/AppContext";

function WalletSection() {
  const { user, addBalance, requestWithdrawal, myOrders, balanceRequests } = useApp();
  const [dep, setDep] = useState("");
  const [wd, setWd] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const myReqs = balanceRequests.filter((r) => r.user === user.email);

  const doDeposit = (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    try { addBalance(dep); setDep(""); setMsg(`₺${dep} cüzdanınıza yüklendi.`); }
    catch (e2) { setErr(e2.message); }
  };
  const doWithdraw = (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    try { requestWithdrawal(wd); setWd(""); setMsg("Çekim talebiniz alındı, onay bekliyor."); }
    catch (e2) { setErr(e2.message); }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 grid place-items-center"><Wallet className="text-accent-cyan" size={22} /></div>
            <div>
              <p className="text-sm text-muted-foreground">Cüzdan Bakiyesi</p>
              <p className="text-3xl font-mono font-bold">₺{user.balance || 0}</p>
            </div>
          </div>
        </div>

        {msg && <p className="text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mt-4">{msg}</p>}
        {err && <p className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2 mt-4">{err}</p>}

        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <form onSubmit={doDeposit} className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold flex items-center gap-1.5 mb-3"><Plus size={15} className="text-accent-cyan" /> Bakiye Yükle</p>
            <div className="flex gap-2">
              <input type="number" min="1" value={dep} onChange={(e) => setDep(e.target.value)} placeholder="Tutar (₺)" className="flex-1 h-10 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" />
              <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Yükle</button>
            </div>
            <div className="flex gap-1.5 mt-2">{[50, 100, 250, 500].map((a) => <button key={a} type="button" onClick={() => setDep(String(a))} className="px-2.5 py-1 rounded-md bg-secondary border border-border text-xs hover:text-accent-cyan">₺{a}</button>)}</div>
          </form>

          <form onSubmit={doWithdraw} className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold flex items-center gap-1.5 mb-3"><ArrowDownToLine size={15} className="text-accent-orange" /> Para Çekme Talebi</p>
            <div className="flex gap-2">
              <input type="number" min="1" value={wd} onChange={(e) => setWd(e.target.value)} placeholder="Tutar (₺)" className="flex-1 h-10 rounded-lg bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" />
              <button className="h-10 px-4 rounded-lg bg-secondary border border-border text-sm font-semibold hover:text-accent-orange">Talep Et</button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Çekim talepleri yönetici onayından sonra işlenir.</p>
          </form>
        </div>
      </div>

      {myReqs.length > 0 && (
        <div className="glass-card p-6">
          <p className="font-semibold mb-3">Bakiye İşlemleri</p>
          <div className="space-y-2">
            {myReqs.slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                <span className="text-muted-foreground">{r.type} · {r.date}</span>
                <span className="flex items-center gap-3">
                  <span className="font-mono font-semibold">₺{r.amount}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${r.status === "Onaylandı" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : r.status === "Reddedildi" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{r.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <p className="font-semibold flex items-center gap-1.5 mb-3"><ShoppingBag size={16} className="text-accent-cyan" /> Siparişlerim</p>
        {myOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Henüz siparişiniz yok.</p>
        ) : (
          <div className="space-y-2">
            {myOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                <div className="min-w-0"><p className="font-medium truncate">{o.product}</p><p className="text-xs text-muted-foreground">{o.id} · {o.date}</p></div>
                <span className="flex items-center gap-3 shrink-0"><span className="font-mono font-semibold">₺{o.amount}</span><span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{o.status}</span></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useApp();
  const fileRef = useRef(null);
  const [form, setForm] = useState(() => ({ name: user?.name || "", bio: user?.bio || "", avatar: user?.avatar || "" }));
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  if (!user) return <Navigate to="/giris" replace />;

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setSaved(false); };

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setErr("Fotoğraf 2 MB'den küçük olmalıdır."); return; }
    const reader = new FileReader();
    reader.onload = () => { setForm((f) => ({ ...f, avatar: reader.result })); setErr(""); setSaved(false); };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    updateProfile({ name: form.name.trim() || user.name, bio: form.bio, avatar: form.avatar });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopStrip />
      <Header />
      <main className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
        <div className="mb-8">
          <span className="text-eyebrow"><span className="h-px w-6 bg-accent-cyan/40" /> Hesabım</span>
          <h1 className="h-section mt-3">Profil Ayarları</h1>
          <p className="text-muted-foreground mt-2">Fotoğrafınızı ve bilgilerinizi dilediğiniz zaman güncelleyin.</p>
        </div>

        <form onSubmit={submit} className="glass-card p-6 sm:p-8 space-y-8">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {form.avatar ? (
                <img src={form.avatar} alt="Profil" className="h-28 w-28 rounded-2xl object-cover border border-black/10" />
              ) : (
                <div className="h-28 w-28 rounded-2xl grid place-items-center bg-accent-cyan/12 text-accent-cyan border border-accent-cyan/25">
                  <span className="text-4xl font-bold">{(form.name || "?").charAt(0).toUpperCase()}</span>
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-md hover:opacity-90 transition-opacity" aria-label="Fotoğraf yükle">
                <Camera size={16} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-bold text-lg">{form.name || user.name}</p>
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mt-1"><Mail size={14} /> {user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                <button type="button" onClick={() => fileRef.current?.click()} className="text-sm px-3 py-1.5 rounded-lg bg-secondary border border-border font-medium hover:text-accent-cyan transition-colors">Fotoğraf Yükle</button>
                {form.avatar && <button type="button" onClick={() => { setForm((f) => ({ ...f, avatar: "" })); setSaved(false); }} className="text-sm px-3 py-1.5 rounded-lg bg-accent-red/10 text-accent-red border border-accent-red/20 font-medium inline-flex items-center gap-1.5"><Trash2 size={13} /> Kaldır</button>}
              </div>
            </div>
          </div>

          {err && <p className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2">{err}</p>}

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2"><User size={13} /> Kullanıcı Adı</label>
              <input value={form.name} onChange={set("name")} placeholder="Kullanıcı adınız" className="w-full h-11 rounded-xl bg-background border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2"><Mail size={13} /> E-posta</label>
              <input value={user.email} disabled className="w-full h-11 rounded-xl bg-secondary border border-border px-3 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2"><FileText size={13} /> Hakkımda</label>
              <textarea value={form.bio} onChange={set("bio")} rows={3} placeholder="Kendinizden kısaca bahsedin..." className="w-full rounded-xl bg-background border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/40 resize-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"><Save size={16} /> Değişiklikleri Kaydet</button>
            {saved && <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle2 size={16} /> Kaydedildi</span>}
          </div>
        </form>

        {user.role !== "admin" && <WalletSection />}

        {user.role === "admin" && (
          <div className="glass-card p-5 mt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 grid place-items-center"><ShieldCheck className="text-accent-cyan" size={18} /></div>
            <div>
              <p className="font-semibold text-sm">Yönetici Hesabı</p>
              <p className="text-xs text-muted-foreground">Bu hesap admin paneline erişebilir.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
