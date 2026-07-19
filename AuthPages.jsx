import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

function Shell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-background grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 grid place-items-center"><ShieldCheck className="text-accent-cyan" size={22} /></div>
          <span className="text-xl font-bold"><span className="text-foreground">Hile</span><span className="text-accent-cyan">vadisi</span></span>
        </Link>
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-center">{title}</h1>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Ic, ...props }) {
  return (
    <div className="relative">
      <Ic className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
      <input {...props} className="w-full h-11 rounded-xl bg-background border border-input pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" />
    </div>
  );
}

export function LoginPage() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    try { const u = login(email, password); nav(u.role === "admin" ? "/admin" : "/"); }
    catch (e2) { setErr(e2.message); }
  };
  return (
    <Shell title="Giriş Yap" subtitle="Hesabınıza erişmek için giriş yapın">
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2">{err}</p>}
        <label className="text-xs font-medium text-muted-foreground">E-posta</label>
        <Field icon={Mail} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com" />
        <label className="text-xs font-medium text-muted-foreground">Şifre</label>
        <Field icon={Lock} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 mt-2">Giriş Yap <ArrowRight size={16} /></button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">Hesabınız yok mu? <Link to="/kayit" className="text-accent-cyan font-semibold">Kayıt Ol</Link></p>
    </Shell>
  );
}

export function RegisterPage() {
  const { register } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    try { register(form.name, form.email, form.password); nav("/"); }
    catch (e2) { setErr(e2.message); }
  };
  return (
    <Shell title="Kayıt Ol" subtitle="Yeni bir hesap oluşturun">
      <form onSubmit={submit} className="space-y-3">
        {err && <p className="text-sm text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2">{err}</p>}
        <label className="text-xs font-medium text-muted-foreground">Kullanıcı Adı</label>
        <Field icon={User} required value={form.name} onChange={set("name")} placeholder="Kullanıcı adınız" />
        <label className="text-xs font-medium text-muted-foreground">E-posta</label>
        <Field icon={Mail} type="email" required value={form.email} onChange={set("email")} placeholder="ornek@mail.com" />
        <label className="text-xs font-medium text-muted-foreground">Şifre</label>
        <Field icon={Lock} type="password" required minLength={4} value={form.password} onChange={set("password")} placeholder="••••••••" />
        <button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 mt-2">Kayıt Ol <ArrowRight size={16} /></button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">Zaten hesabınız var mı? <Link to="/giris" className="text-accent-cyan font-semibold">Giriş Yap</Link></p>
    </Shell>
  );
}
