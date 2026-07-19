export const IMG = {
  banner: "https://images.hostinger.com/b30871b9-5b7a-441a-be44-4b2c629131dd.png",
  pubg: "https://images.hostinger.com/685f6361-8f41-41a7-b5b0-355da1867702.png",
  apex: "https://images.hostinger.com/ac9150a8-6cf4-4960-b753-de6d2d7f0ef5.png",
  battlefield: "https://images.hostinger.com/dec496ec-1a87-40d5-bde5-46b4204df39a.png",
  rust: "https://horizons-cdn.hostinger.com/3e8d33b0-eea8-4c04-bbd8-fce83bba9f18/b3caa8cc6080fdd6564379ba4aa154b5.jpg",
  valorant: "https://images.hostinger.com/d849ef3f-e939-4008-a9de-2e7f54898f51.png",
  squad: "https://images.hostinger.com/6ec16f57-3f9c-404a-9b66-b02dc362da39.png",
};

// Product categories and package definitions.
export const CATEGORIES = ["PUBG", "Apex", "Rust", "Arc Raiders"];

export const PKG_DEFS = [
  { key: "1g", label: "1 Günlük" },
  { key: "7g", label: "7 Günlük" },
  { key: "30g", label: "30 Günlük" },
];

const mkPkg = (p1, p7, p30, s = 50) => ({
  "1g": { price: p1, stock: s },
  "7g": { price: p7, stock: s },
  "30g": { price: p30, stock: s },
});

// Seed catalog. Admin can add/edit/remove products from the panel.
export const INITIAL_PRODUCTS = [
  { id: "pubg-esp", name: "PUBG Steam ESP & Radar Hilesi", category: "PUBG", seller: "Hilevadisi", status: "Undetected", image: IMG.pubg, video: "", description: "Gelişmiş ESP, radar ve oyuncu takibi. Stream-proof ve kernel-level güvenli mimari.", packages: mkPkg(90, 320, 850) },
  { id: "pubg-aim", name: "PUBG Aimbot Pro Hilesi", category: "PUBG", seller: "Hilevadisi", status: "Undetected", image: IMG.pubg, video: "", description: "Akıllı aimbot, no recoil ve otomatik hedefleme. HWID spoofer dahil.", packages: mkPkg(110, 380, 990) },
  { id: "apex-aim", name: "Apex Legends Aimbot Hilesi", category: "Apex", seller: "Hilevadisi", status: "Undetected", image: IMG.apex, video: "", description: "Silky aimbot, triggerbot ve no recoil. Sezon güncellemelerine anında uyum.", packages: mkPkg(100, 340, 900) },
  { id: "apex-esp", name: "Apex ESP & Wallhack Hilesi", category: "Apex", seller: "Hilevadisi", status: "Undetected", image: IMG.apex, video: "", description: "Duvar arkası görüş, item ESP ve loot filtresi. Güvenli ve gizli.", packages: mkPkg(85, 300, 800) },
  { id: "rust-full", name: "Rust Full Hile Paketi", category: "Rust", seller: "Hilevadisi", status: "Undetected", image: IMG.rust, video: "", description: "Aimbot, ESP, no recoil ve gathering bot. Tam kontrol tek pakette.", packages: mkPkg(120, 400, 1050) },
  { id: "rust-esp", name: "Rust ESP & No Recoil Hilesi", category: "Rust", seller: "Hilevadisi", status: "Undetected", image: IMG.rust, video: "", description: "Oyuncu ve item ESP, no recoil script. Hafif ve stabil.", packages: mkPkg(80, 280, 740) },
  { id: "arc-aim", name: "Arc Raiders Aimbot Hilesi", category: "Arc Raiders", seller: "Hilevadisi", status: "Undetected", image: IMG.battlefield, video: "", description: "Yeni nesil aimbot ve hedef kilitleme. Erken erişim desteği.", packages: mkPkg(95, 330, 870) },
  { id: "arc-esp", name: "Arc Raiders ESP & Radar Hilesi", category: "Arc Raiders", seller: "Hilevadisi", status: "Undetected", image: IMG.battlefield, video: "", description: "Düşman ve ganimet ESP, minimap radar. Güvenli mimari.", packages: mkPkg(90, 310, 820) },
];

export const STATS = [
  { value: "5000+", label: "Mutlu Müşteri", icon: "Users", color: "accent-cyan" },
  { value: "10000+", label: "Tamamlanan Satış", icon: "ShoppingBag", color: "accent-orange" },
  { value: "4.9/5", label: "Ortalama Puan", icon: "Star", color: "accent-gold" },
  { value: "Profesyonel", label: "Güvenilir Hizmet", icon: "Award", color: "accent-red" },
];

export const COMPARISON = [
  { feature: "Güvenli Mimari (Kernel-Level)", us: "Kernel-Level Driver", them: "Memory Hile" },
  { feature: "Anında Otomatik Teslimat", us: "Ortalama 42 saniye", them: "5-30 dakika manuel" },
  { feature: "Türkçe 7/24 Canlı Destek", us: "Anlık yanıt", them: "E-posta / yavaş" },
  { feature: "HWID Spoofer Dahil", us: "Ücretsiz", them: "Ek ücretli" },
  { feature: "Stream-Proof (OBS Bypass)", us: "Standart", them: "Premium ek paket" },
  { feature: "İade Garantisi", us: "%100 garanti", them: "Çoğunlukla yok" },
];

export const SALES = [];

export const REVIEWS = [
  { user: "Emre K.", product: "PUBG Steam ESP & Radar Hilesi", text: "PUBG hilesi çok iyi çalışıyor, aylardır kullanıyorum hiç sorun yaşamadım. Ban falan yemedim, tamamen güvenli.", date: "12.06.2024" },
  { user: "Burak D.", product: "Apex Legends Aimbot Hilesi", text: "Ödemeyi yaptıktan sonra saniyeler içinde teslim edildi. Bu kadar hızlı teslimat beklemiyordum, gerçekten memnun kaldım.", date: "03.07.2024" },
  { user: "Mert A.", product: "Rust Full Hile Paketi", text: "Rust paketini aldım, kurulumda takıldığım yerde canlı destek anında yardımcı oldu. Güvenilir bir ekip.", date: "21.07.2024" },
  { user: "Serkan Y.", product: "PUBG Aimbot Pro Hilesi", text: "Aimbot ayarları çok detaylı, kendine göre ayarlayabiliyorsun. Fiyat performans olarak en iyisi bence.", date: "05.08.2024" },
  { user: "Onur T.", product: "Apex ESP & Wallhack Hilesi", text: "ESP özelliği kusursuz çalışıyor, düşmanları rahatça görüyorum. Aylık yeniledim, kesinlikle tavsiye ederim.", date: "18.08.2024" },
  { user: "Kaan S.", product: "Rust ESP & No Recoil Hilesi", text: "İlk defa hile aldım biraz tereddütlüydüm ama her şey söylendiği gibi. Teslimat hızlı, destek ilgili. Teşekkürler.", date: "29.08.2024" },
];

export const TRUST_FOOTER = [
  { title: "Resmi Bayi", desc: "Üreticilerin yetkili Türkiye satıcısı", icon: "ShieldCheck" },
  { title: "Anında Teslimat", desc: "Ortalama 42 saniye otomatik teslim", icon: "Zap" },
  { title: "SSL & 256-bit Güvenlik", desc: "PCI-DSS uyumlu ödeme altyapısı", icon: "Lock" },
  { title: "7/24 Canlı Destek", desc: "Türkçe destek ekibi her zaman yanınızda", icon: "Headphones" },
  { title: "5000+ Mutlu Müşteri", desc: "Binlerce doğrulanmış siparişle kanıtlanmış güven", icon: "Award" },
  { title: "HWID Spoofer Dahil", desc: "Tüm paketlerde ücretsiz", icon: "Settings" },
];
