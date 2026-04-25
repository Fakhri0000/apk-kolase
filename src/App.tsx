import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Trash2, 
  Image as ImageIcon, 
  LayoutGrid, 
  Settings2, 
  Store, 
  Pin,
  Star,
  ChevronRight,
  Monitor,
  Smartphone,
  Check,
  Maximize,
  Layout,
  Search,
  ChevronLeft,
  User,
  Type,
  Bold,
  Italic,
  Instagram,
  Users,
  MessageSquare,
  BookOpen,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { cn } from './lib/utils';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: string;
  image: string | null;
  linkNo: string;
}

interface ShopInfo {
  name: string;
  handle: string;
  notes: string;
  logo: string | null;
  stars: number;
  accountTag: string;
  ratingValue: string;
}

type LayoutMode = 2 | 4 | 8 | 9;
type Template = 'classic' | 'minimal' | 'shopee' | 'tiktok_classic' | 'tiktok_badge' | 'instagram' | 'dark' | 'luxe' | 'playful' | 'fazion_modern' | 'fazion_grid' | 'fazion_bold';
type AspectRatio = '1:1' | '4:5';
type ProductBoxStyle = 'none' | 'card' | 'badge' | 'glass' | 'outline' | 'shadow_only' | 'gradient_bottom' | 'neon' | 'modern_label' | 'mini_label' | 'gender_label';

// --- Utils ---
const formatPrice = (val: string) => {
  if (!val) return '0';
  const number = val.replace(/[^0-9]/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};


// --- Components ---

interface ProductInputProps {
  product: Product;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
  key?: React.Key;
}

const ProductInput = ({ 
  product, 
  onUpdate, 
  onDelete 
}: ProductInputProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(product.id, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(product.id, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 group relative">
      <button 
        onClick={() => onDelete(product.id)}
        className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 z-10"
      >
        <Trash2 size={14} />
      </button>
      
      <div className="flex gap-4">
        <label 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative w-24 h-24 flex-shrink-0 bg-slate-50 border-2 border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center overflow-hidden",
            isDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-slate-200 hover:border-blue-400"
          )}
        >
          {product.image ? (
            <img src={product.image} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="text-slate-300" size={24} />
              <span className="text-[8px] font-bold text-slate-400 uppercase">Drop / Click</span>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
        
        <div className="flex-1 flex flex-col gap-2">
          <input 
            type="text" 
            placeholder="Nama Barang"
            value={product.name}
            onChange={(e) => onUpdate(product.id, { name: e.target.value })}
            className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
              <input 
                type="text" 
                placeholder="99.000"
                value={product.price}
                onChange={(e) => onUpdate(product.id, { price: formatPrice(e.target.value) })}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <input 
              type="text" 
              placeholder="No"
              label="Link No"
              value={product.linkNo}
              onChange={(e) => onUpdate(product.id, { linkNo: e.target.value })}
              className="w-16 px-2 py-1.5 text-sm text-center bg-blue-50 border border-blue-200 text-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [appMode, setAppMode] = useState<'catalog' | 'cover' | 'tutorial'>('catalog');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(8);
  const [template, setTemplate] = useState<Template>('classic');
  const [bgColor, setBgColor] = useState('#ffffff');

  const [bannerText, setBannerText] = useState('Link Produk Di Bio No. 1');
  const [shopInfo, setShopInfo] = useState<ShopInfo>({
    name: '3SECOND',
    handle: '@RacunShop.id',
    notes: 'Note : Harga Saat di Upload',
    logo: null,
    stars: 5,
    accountTag: '@RacunShop.id',
    ratingValue: '4.9'
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [productBoxStyle, setProductBoxStyle] = useState<ProductBoxStyle>('none');
  const [logoDragging, setLogoDragging] = useState(false);
  const [productImageScale, setProductImageScale] = useState(90);
  
  // Cover Mode State
  const [coverData, setCoverData] = useState({
    background: null as string | null,
    caption: '<b>Rekomendasi</b> sepatu kece<br/>yang wajib lo punya',
    source: '@jackable',
    shopName: 'RACUNSHOP.ID',
    boxY: 18,
    boxWidth: 80,
    boxAlign: 'center' as 'left' | 'center' | 'right',
    isAutoWidth: false,
    boxPaddingV: 12,
    fontSize: 1.8
  });
  const [isCoverBgDragging, setIsCoverBgDragging] = useState(false);

  // Tutorial Mode State
  const [tutorialData, setTutorialData] = useState({
    title: 'Tutorial Pembelian Produk',
    steps: [
      { id: 1, text: 'Lihat <b>NO</b> produk', image: null as string | null },
      { id: 2, text: 'Klik <b>Link di bio</b>', image: null as string | null },
      { id: 3, text: 'Ketik <b>No produk</b> di kolom pencarian', image: null as string | null }
    ]
  });

  const handleTutorialStepImage = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTutorialData(prev => ({
          ...prev,
          steps: prev.steps.map(s => s.id === id ? { ...s, image: reader.result as string } : s)
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCoverBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverData(prev => ({ ...prev, background: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const execCommand = (command: string) => {
    document.execCommand(command, false);
  };

  const loadSampleData = () => {
    const samples = Array.from({ length: layoutMode }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: `Produk Pilihan ${i + 1}`,
      price: formatPrice(`${(i + 1) * 35000}`),
      image: `https://picsum.photos/seed/${i + 50}/600/600`,
      linkNo: (100 + i).toString()
    }));
    setProducts(samples);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setLogoDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopInfo(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize products based on layout mode
  useEffect(() => {
    const defaultProducts = Array.from({ length: layoutMode }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: `Barang ${i + 1}`,
      price: '0',
      image: null,
      linkNo: (100 + i).toString()
    }));
    setProducts(defaultProducts);
  }, [layoutMode]);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopInfo(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportAsImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(canvasRef.current, { quality: 1, pixelRatio: 2 });
      download(dataUrl, `katalog-${shopInfo.name.toLowerCase()}.png`);
    } catch (err) {
      console.error('Failed to export', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to determine grid columns and layout
  const getGridConfig = () => {
    switch (layoutMode) {
      case 2: return 'grid-cols-2';
      case 4: return 'grid-cols-2';
      case 8: return 'grid-cols-2';
      case 9: return 'grid-cols-3';
      default: return 'grid-cols-3';
    }
  };

  const getTemplateStyles = () => {
    switch (template) {
      case 'minimal':
        return {
          header: "bg-transparent border-0 shadow-none p-0 flex-col text-center mt-4",
          logo: "w-20 h-20 mb-3 grayscale",
          name: "font-display text-2xl font-light tracking-[0.1em] mb-1 uppercase text-slate-800",
          handle: "font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 font-medium",
          banner: "bg-slate-100 rounded-full px-6 py-2 mt-4 text-slate-800 font-mono text-[9px] tracking-tight"
        };
      case 'shopee':
        return {
          header: "bg-white border-b border-orange-100 rounded-none p-6 shadow-sm",
          logo: "w-16 h-16 ring-1 ring-orange-500 ring-offset-2",
          name: "font-sans text-2xl font-bold text-orange-600",
          handle: "font-sans text-slate-500 font-medium",
          banner: "font-sans bg-orange-600 text-white rounded-md py-3 shadow-sm mx-4 font-bold"
        };
      case 'tiktok_classic':
        return {
          header: "bg-white border-2 border-slate-900 rounded-xl m-4 p-4 flex items-center gap-4 shadow-[4px_4px_0_#1a1a1a]",
          logo: "w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-center",
          name: "font-display text-base font-black text-slate-900 italic uppercase tracking-tighter",
          handle: "font-mono text-[9px] text-slate-500 font-bold uppercase",
          banner: "bg-slate-50 border-y border-slate-100 py-3 text-center font-display uppercase tracking-widest text-[10px] font-bold"
        };
      case 'tiktok_badge':
        return {
          header: "bg-transparent p-4 flex flex-col items-center",
          logo: "w-20 h-20 rounded-full border-4 border-white shadow-lg mb-2",
          name: "font-display text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter",
          handle: "font-sans text-xs text-slate-500 font-semibold",
          banner: "bg-white/80 backdrop-blur-md rounded-full px-8 py-3 my-4 shadow-sm border border-slate-100 font-bold"
        };
      case 'instagram':
        return {
          header: "bg-white border-b border-slate-100 p-4 flex items-center gap-3",
          logo: "w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600",
          name: "font-sans font-bold text-lg lowercase tracking-tight",
          handle: "font-sans text-blue-500 text-xs font-bold",
          banner: "bg-slate-50 py-2 border-y border-slate-100 italic font-sans text-sm"
        };
      case 'dark':
        return {
          header: "bg-[#0f172a] border-b border-indigo-500/30 p-6 flex items-center gap-4",
          logo: "w-14 h-14 border-2 border-indigo-400/50 rounded-xl",
          name: "font-display text-xl font-black text-white uppercase tracking-tighter",
          handle: "font-mono text-indigo-400 text-[9px] tracking-[0.3em] uppercase font-bold",
          banner: "bg-indigo-600 text-white py-3 font-display font-black uppercase tracking-[0.1em] text-[11px]"
        };
      case 'luxe':
        return {
          header: "bg-white flex flex-col items-center gap-1 border-b-[3px] border-amber-400/20 pb-6 pt-8",
          logo: "w-16 h-16 border-2 border-amber-400 p-1.5 rounded-full ring-4 ring-amber-50",
          name: "font-display text-xl font-black text-slate-900 uppercase tracking-widest",
          handle: "font-mono text-[9px] uppercase tracking-[0.4em] text-amber-600 font-bold",
          banner: "bg-slate-900 text-amber-100 py-3 font-display uppercase tracking-[0.2em] text-[10px] font-black"
        };
      case 'playful':
        return {
          header: "bg-yellow-300 p-6 rounded-3xl m-4 -rotate-1 flex items-center gap-4 border-4 border-slate-900 shadow-[6px_6px_0_#000]",
          logo: "w-14 h-14 border-4 border-white rotate-3",
          name: "font-impact text-3xl font-normal text-purple-900 uppercase tracking-wide",
          handle: "font-bold text-xs text-purple-700 underline underline-offset-4",
          banner: "bg-purple-600 text-white py-2 rounded-full mx-4 font-impact text-lg uppercase tracking-widest"
        };
      case 'fazion_modern':
        return {
          header: "hidden",
          logo: "hidden",
          name: "hidden",
          handle: "hidden",
          banner: "relative z-10 mx-auto mt-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full py-3 px-8 text-white font-display font-black uppercase text-xs tracking-[0.2em] shadow-2xl"
        };
      case 'fazion_grid':
        return {
          header: "hidden",
          logo: "hidden",
          name: "hidden",
          handle: "hidden",
          banner: "relative z-10 mx-auto mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-2 px-6 text-white font-display font-bold uppercase text-[10px] tracking-widest"
        };
      case 'fazion_bold':
        return {
          header: "bg-white p-6 pb-0 flex flex-col items-center",
          logo: "w-16 h-16 rounded-2xl bg-black flex items-center justify-center p-3 mb-2 shadow-xl",
          name: "font-display font-black text-2xl uppercase tracking-tighter",
          handle: "font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold",
          banner: "bg-black text-white rounded-full px-8 py-3 my-4 font-display font-black uppercase text-xs tracking-widest"
        };
      default: // 'classic'
        return {
          header: "w-full border-2 border-slate-800 rounded-2xl p-4 flex items-center gap-5 bg-white shadow-[4px_4px_0px_#0000001a]",
          logo: "w-14 h-14 rounded-full border-2 border-white shadow-sm",
          name: "font-display text-xl font-bold uppercase tracking-tight",
          handle: "font-sans text-xs text-slate-500 font-semibold",
          banner: "px-6 flex justify-center py-2 font-impact tracking-widest text-lg"
        };
    }
  };

  const tStyles = getTemplateStyles();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[400px] bg-white border-r border-slate-200 overflow-y-auto h-screen p-6 space-y-8 no-scrollbar scroll-smooth">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-2 rounded-lg text-white">
                <LayoutGrid size={20} />
              </div>
              <h1 className="font-bold text-lg tracking-tight">Katalog Generator</h1>
            </div>
            <button 
              onClick={exportAsImage}
              disabled={isExporting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 text-sm shadow-md"
            >
              {isExporting ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Download size={16} />}
              Download
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
               onClick={() => setAppMode('catalog')}
               className={cn(
                 "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                 appMode === 'catalog' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               <LayoutGrid size={14} />
               Catalog
             </button>
             <button 
               onClick={() => setAppMode('cover')}
               className={cn(
                 "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                 appMode === 'cover' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               <ImageIcon size={14} />
               Cover
             </button>
             <button 
               onClick={() => setAppMode('tutorial')}
               className={cn(
                 "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                 appMode === 'tutorial' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
               )}
             >
               <BookOpen size={14} />
               Tutorial
             </button>
          </div>
        </header>

        {appMode === 'catalog' ? (
          <>
            {/* Template Options */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500">
            <ImageIcon size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider">Template</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['classic', 'minimal', 'shopee', 'tiktok_classic', 'tiktok_badge', 'instagram', 'dark', 'luxe', 'playful', 'fazion_modern', 'fazion_grid', 'fazion_bold'] as Template[]).map((t) => (
              <button 
                key={t}
                onClick={() => setTemplate(t)}
                className={cn(
                  "px-2 py-2 rounded-lg border transition-all text-[10px] font-bold uppercase",
                  template === t 
                    ? "border-slate-900 bg-slate-900 text-white" 
                    : "border-slate-100 hover:border-slate-200 text-slate-500"
                )}
              >
                {t.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* Layout Options */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Settings2 size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider">Layout (Jumlah Foto)</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[2, 4, 8, 9].map((m) => (
              <button 
                key={m}
                onClick={() => setLayoutMode(m as LayoutMode)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                  layoutMode === m 
                    ? "border-slate-900 bg-slate-50 text-slate-900" 
                    : "border-slate-100 hover:border-slate-200 text-slate-400"
                )}
              >
                <div className="text-lg font-bold">{m}</div>
                <div className="text-[10px] uppercase font-bold opacity-80 text-center">Foto</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-500 pt-2 border-t border-slate-50">
            <Layout size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider">Style Kotak Produk</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['none', 'card', 'badge', 'glass', 'outline', 'shadow_only', 'gradient_bottom', 'neon', 'modern_label', 'mini_label', 'gender_label'] as ProductBoxStyle[]).map((s) => (
              <button 
                key={s}
                onClick={() => setProductBoxStyle(s)}
                className={cn(
                  "px-3 py-2 rounded-lg border transition-all text-[8px] font-bold uppercase tracking-tight text-center",
                  productBoxStyle === s 
                    ? "border-slate-900 bg-slate-900 text-white" 
                    : "border-slate-100 hover:border-slate-200 text-slate-500"
                )}
              >
                {s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-500 pt-2 border-t border-slate-50">
            <Maximize size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider">Ukuran / Ratio</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['1:1', '4:5'] as AspectRatio[]).map((r) => (
              <button 
                key={r}
                onClick={() => setAspectRatio(r)}
                className={cn(
                  "px-3 py-2 rounded-lg border transition-all text-xs font-bold",
                  aspectRatio === r 
                    ? "border-slate-900 bg-slate-900 text-white" 
                    : "border-slate-100 hover:border-slate-200 text-slate-500"
                )}
              >
                {r === '1:1' ? '1080 x 1080 (Square)' : '1080 x 1350 (Portrait)'}
              </button>
            ))}
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zoom Produk</label>
              <span className="text-[10px] font-mono font-bold text-slate-900">{productImageScale}%</span>
            </div>
            <input 
              type="range" min="50" max="100" step="1" value={productImageScale}
              onChange={(e) => setProductImageScale(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Warna Latar</label>
            <div className="flex flex-wrap gap-2">
              {['#ffffff', '#f8fafc', '#f1f5f9', '#fee2e2', '#f0f9ff', '#f0fdf4', '#1a1a1a', '#0f172a'].map(color => (
                <button 
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border border-slate-200 shadow-sm transition-transform active:scale-95",
                    bgColor === color && "ring-2 ring-blue-500 ring-offset-2"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Shop Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Store size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider">Informasi Toko</h2>
          </div>
          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              <label 
                onDragOver={(e) => { e.preventDefault(); setLogoDragging(true); }}
                onDragLeave={() => setLogoDragging(false)}
                onDrop={handleLogoDrop}
                className={cn(
                  "relative w-16 h-16 shrink-0 bg-slate-50 border-2 border-dashed rounded-full cursor-pointer transition-all flex items-center justify-center overflow-hidden",
                  logoDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-slate-200 hover:border-blue-400"
                )}
              >
                {shopInfo.logo ? (
                  <img src={shopInfo.logo} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center group">
                    <Store className="text-slate-300" size={20} />
                    <span className="text-[6px] font-black text-slate-400 group-hover:text-blue-500 uppercase mt-1">Drop</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
              </label>
              <div className="flex-1 space-y-2">
                <input 
                  type="text" 
                  placeholder="Nama Toko"
                  value={shopInfo.name}
                  onChange={(e) => setShopInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-1.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input 
                  type="text" 
                  placeholder="@username"
                  value={shopInfo.handle}
                  onChange={(e) => setShopInfo(prev => ({ ...prev, handle: e.target.value }))}
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Account Tag (Pill Bottom)</label>
              <input 
                type="text" 
                placeholder="@Fazion.shop"
                value={shopInfo.accountTag}
                onChange={(e) => setShopInfo(prev => ({ ...prev, accountTag: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <textarea 
              placeholder="Catatan kecil (misal: Harga saat upload)"
              value={shopInfo.notes}
              onChange={(e) => setShopInfo(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating Toko</span>
                <input 
                  type="text" 
                  value={shopInfo.ratingValue}
                  onChange={(e) => setShopInfo(prev => ({ ...prev, ratingValue: e.target.value }))}
                  className="w-12 px-2 py-1 mt-1 text-xs bg-slate-50 border border-slate-200 rounded font-bold text-blue-600 focus:outline-none"
                  placeholder="4.9"
                />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <button 
                    key={i} 
                    onClick={() => setShopInfo(prev => ({ ...prev, stars: i }))}
                  >
                    <Star 
                      size={16} 
                      className={cn(
                        "transition-colors",
                        i <= shopInfo.stars ? "fill-orange-400 text-orange-400" : "text-slate-200"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Banner Text */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Pin size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider">Teks Banner</h2>
          </div>
          <input 
            type="text" 
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </section>

        {/* Product Items */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
              <Plus size={16} />
              <h2 className="text-xs font-bold uppercase tracking-wider">Daftar Barang</h2>
            </div>
            <button 
              onClick={loadSampleData}
              className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors uppercase cursor-pointer"
            >
              Isi Contoh
            </button>
          </div>
          <div className="space-y-4 pb-12">
            {products.map((p) => (
              <ProductInput 
                key={p.id} 
                product={p} 
                onUpdate={updateProduct} 
                onDelete={deleteProduct} 
              />
            ))}
            {products.length < layoutMode && (
              <button 
                onClick={() => setProducts(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: 'Barang Baru', price: '0', image: null }])}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
              >
                <Plus size={18} />
                Tambah Barang
              </button>
            )}
          </div>
        </section>
          </>
        ) : appMode === 'cover' ? (
          <div className="space-y-8 pb-12">
            {/* Cover Mode Controls */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-500">
                <ImageIcon size={16} />
                <h2 className="text-xs font-bold uppercase tracking-wider">Background Cover</h2>
              </div>
              <label 
                onDragOver={(e) => { e.preventDefault(); setIsCoverBgDragging(true); }}
                onDragLeave={() => setIsCoverBgDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsCoverBgDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setCoverData(d => ({ ...d, background: reader.result as string }));
                    reader.readAsDataURL(file);
                  }
                }}
                className={cn(
                  "w-full aspect-video bg-slate-50 border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 transition-all overflow-hidden relative group",
                  isCoverBgDragging ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-slate-200 hover:border-blue-400"
                )}
              >
                {coverData.background ? (
                  <>
                    <img src={coverData.background} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <span className="text-white text-xs font-bold">Ganti Background</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Frame Utama</span>
                  </>
                )}
                <input type="file" className="hidden" onChange={handleCoverBgChange} />
              </label>
            </section>

            <section className="space-y-4">
               <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-2">
                    <Type size={16} />
                    <h2 className="text-xs font-bold uppercase tracking-wider">Caption Box</h2>
                  </div>
                  <div className="flex gap-1">
                     <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"><Bold size={14} /></button>
                     <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"><Italic size={14} /></button>
                  </div>
               </div>
               <div 
                 contentEditable 
                 onBlur={(e) => setCoverData(d => ({ ...d, caption: e.currentTarget.innerHTML }))}
                 dangerouslySetInnerHTML={{ __html: coverData.caption }}
                 className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
               />
               <p className="text-[10px] text-slate-400 italic">Tips: Seleksi teks lalu gunakan tombol bold/italic di atas.</p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Layout size={16} />
                <h2 className="text-xs font-bold uppercase tracking-wider">Tata Letak Box</h2>
              </div>
              <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Posisi Vertikal</span>
                       <span className="text-[10px] font-mono text-slate-900">{coverData.boxY}%</span>
                    </div>
                    <input 
                      type="range" min="5" max="80" value={coverData.boxY}
                      onChange={(e) => setCoverData(d => ({ ...d, boxY: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                 </div>
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Tinggi Box (Padding)</span>
                       <span className="text-[10px] font-mono text-slate-900">{coverData.boxPaddingV}px</span>
                    </div>
                    <input 
                      type="range" min="20" max="100" value={coverData.boxPaddingV}
                      onChange={(e) => setCoverData(d => ({ ...d, boxPaddingV: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                 </div>
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Ukuran Teks</span>
                       <span className="text-[10px] font-mono text-slate-900">{coverData.fontSize}rem</span>
                    </div>
                    <input 
                      type="range" min="0.8" max="4" step="0.1" value={coverData.fontSize}
                      onChange={(e) => setCoverData(d => ({ ...d, fontSize: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                 </div>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Auto Width</span>
                    <button 
                      onClick={() => setCoverData(d => ({ ...d, isAutoWidth: !d.isAutoWidth }))}
                      className={cn(
                        "w-10 h-5 rounded-full transition-colors relative",
                        coverData.isAutoWidth ? "bg-blue-600" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        coverData.isAutoWidth ? "left-6" : "left-1"
                      )} />
                    </button>
                 </div>
                 <div className={cn(coverData.isAutoWidth && "opacity-50 pointer-events-none")}>
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Lebar Box</span>
                       <span className="text-[10px] font-mono text-slate-900">{coverData.boxWidth}%</span>
                    </div>
                    <input 
                      type="range" min="30" max="95" value={coverData.boxWidth}
                      onChange={(e) => setCoverData(d => ({ ...d, boxWidth: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                 </div>
                 <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Align Box</span>
                    <div className="flex gap-1">
                       {(['left', 'center', 'right'] as const).map(align => (
                         <button 
                           key={align}
                           onClick={() => setCoverData(d => ({ ...d, boxAlign: align }))}
                           className={cn(
                             "flex-1 py-1 px-2 text-[10px] font-bold uppercase rounded-md border transition-all",
                             coverData.boxAlign === align ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                           )}
                         >
                           {align}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Instagram size={16} />
                <h2 className="text-xs font-bold uppercase tracking-wider">Info Tambahan</h2>
              </div>
              <div className="space-y-3">
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Sumber (Instagram)</label>
                   <div className="relative">
                      <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={coverData.source}
                        onChange={(e) => setCoverData(d => ({ ...d, source: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="@username"
                      />
                   </div>
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nama Toko (Bottom Right)</label>
                   <div className="relative">
                      <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={coverData.shopName}
                        onChange={(e) => setCoverData(d => ({ ...d, shopName: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 outline-none uppercase font-black italic tracking-tighter"
                        placeholder="NAMA TOKO"
                      />
                   </div>
                 </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            {/* Tutorial Mode Controls */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Type size={16} />
                <h2 className="text-xs font-bold uppercase tracking-wider">Judul Tutorial</h2>
              </div>
              <input 
                type="text" 
                value={tutorialData.title}
                onChange={(e) => setTutorialData(d => ({ ...d, title: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                placeholder="Masukkan Judul..."
              />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-slate-500">
                <LayoutGrid size={16} />
                <h2 className="text-xs font-bold uppercase tracking-wider">Langkah-Langkah</h2>
              </div>
              
              <div className="space-y-6">
                {tutorialData.steps.map((step) => (
                  <div key={step.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                         {step.id}
                       </div>
                       <input 
                         type="text"
                         value={step.text}
                         onChange={(e) => setTutorialData(d => ({
                           ...d,
                           steps: d.steps.map(s => {
                             if (s.id === step.id) {
                               return { ...s, text: e.target.value };
                             }
                             return s;
                           })
                         }))}
                         className="flex-1 bg-transparent border-none focus:outline-none font-medium text-sm text-slate-700"
                       />
                    </div>
                    
                    <label className={cn(
                      "w-full aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer bg-white transition-all",
                      step.image ? "border-blue-200" : "border-slate-200 hover:border-blue-400"
                    )}>
                      {step.image ? (
                        <img src={step.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <>
                          <ImageIcon size={24} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Upload Screenshot</span>
                        </>
                      )}
                      <input type="file" className="hidden" onChange={(e) => handleTutorialStepImage(step.id, e)} />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Main Preview */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 gap-8 overflow-y-auto">
        {/* Device Switcher (aesthetic only) */}
        <div className="hidden lg:flex items-center gap-4 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-200">
           <button className="p-2 rounded-full bg-white shadow-sm text-blue-600"><Smartphone size={20} /></button>
           <button className="p-2 rounded-full text-slate-400"><Monitor size={20} /></button>
        </div>

        <div className="flex flex-col items-center space-y-6 w-full max-w-[600px]">
          {/* THE CANVAS */}
          <div 
            ref={canvasRef}
            className={cn(
              "collage-canvas flex flex-col transition-all duration-300 overflow-hidden relative",
              aspectRatio === '4:5' ? "aspect-[4/5]" : "aspect-square",
              appMode === 'catalog' && (template === 'fazion_modern' || template === 'fazion_grid') && "bg-gradient-to-b from-slate-400 to-slate-100"
            )}
            style={{ 
              backgroundColor: appMode === 'cover' ? '#000' : ((template === 'fazion_modern' || template === 'fazion_grid') ? undefined : bgColor),
              paddingTop: appMode === 'cover' ? '0' : (layoutMode >= 8 ? '10px' : '20px'),
              paddingBottom: appMode === 'cover' ? '0' : (layoutMode >= 8 ? '10px' : '20px')
            }}
          >
            {appMode === 'catalog' ? (
              <>
                {/* Special Fazion Overlay */}
                {(template === 'fazion_modern' || template === 'fazion_grid') && (
                  <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent" />
                  </div>
                )}
                
                {/* Shop Header */}
                <header className={cn(
                  "px-6 shrink-0 pb-2", 
                  template === 'minimal' && "flex flex-col items-center"
                )}>
                  <div className={tStyles.header}>
                    <div className={cn("rounded-full overflow-hidden flex-shrink-0 shadow-sm transition-transform hover:scale-105 duration-300", tStyles.logo)}>
                      {shopInfo.logo ? (
                        <img src={shopInfo.logo} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-rose-500 flex items-center justify-center text-white font-bold text-lg">
                          {shopInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={cn("flex flex-col", template === 'minimal' && "items-center")}>
                      <div className="flex items-center gap-2">
                        <h3 className={cn("tracking-tighter transition-colors uppercase", tStyles.name)}>
                          {shopInfo.name || "NAMA TOKO"}
                        </h3>
                        <div className="flex items-center gap-1.5 bg-slate-50/50 px-1.5 py-0.5 rounded-full border border-slate-100">
                          <span className="text-[11px] font-black text-slate-900 tabular-nums">{shopInfo.ratingValue}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const rating = parseFloat(shopInfo.ratingValue) || 0;
                              const isFilled = i < Math.floor(rating);
                              const isHalf = !isFilled && i < rating;
                              
                              return (
                                <Star 
                                  key={i} 
                                  size={10} 
                                  className={cn(
                                    "transition-all",
                                    isFilled ? (template === 'luxe' ? "fill-amber-400 text-amber-400" : "fill-orange-400 text-orange-400") : isHalf ? (template === 'luxe' ? "fill-amber-400/50 text-amber-400" : "fill-orange-400/50 text-orange-400") : (template === 'dark' ? "text-white/20" : "text-slate-200")
                                  )} 
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <p className={cn("font-medium tracking-tight", tStyles.handle)}>
                        {shopInfo.handle || "@username"} | <span className="opacity-60">{shopInfo.notes || "Note : Harga saat upload"}</span>
                      </p>
                    </div>
                  </div>
                </header>

                {/* Banner Segment */}
                <div className={cn(
                  "w-full transition-all duration-300 shrink-0", 
                  template === 'classic' ? tStyles.banner : "py-1 flex justify-center text-center"
                )}>
                  <div className={cn(
                    "flex items-center gap-2 font-bold text-lg",
                    template === 'classic' ? "text-slate-800" : tStyles.banner
                  )}>
                    <Pin size={18} className="text-rose-500 rotate-12" />
                    <span>{bannerText}</span>
                  </div>
                </div>

                {/* Grid Content */}
                <div className={cn(
                  "flex-1 px-6 grid overflow-hidden content-start",
                  getGridConfig(),
                  layoutMode === 9 ? "gap-x-2 gap-y-2 px-3 pb-4" : layoutMode === 8 ? "gap-x-2 gap-y-2 px-4 pb-4" : "gap-x-4 gap-y-8 p-6"
                )}>
                  <AnimatePresence mode="popLayout">
                    {products.map((product, i) => (
                      <motion.div 
                        layout
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "flex flex-col items-center text-center group h-full",
                          template === 'tiktok_badge' && "items-stretch"
                        )}
                      >
                          <div className={cn(
                            "w-full mx-auto bg-slate-50/20 rounded-lg flex items-center justify-center mb-1 overflow-hidden",
                            layoutMode >= 8 ? "aspect-video" : "aspect-square",
                          )}>
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className={cn(
                                  "object-contain transition-all duration-300",
                                  template === 'tiktok_badge' && "drop-shadow-xl"
                                )}
                                style={{ 
                                  maxWidth: `${productImageScale}%`, 
                                  maxHeight: `${productImageScale}%` 
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                 <ImageIcon size={layoutMode >= 8 ? 12 : 24} className="text-slate-200" />
                              </div>
                            )}
                          </div>
                        
                        {template === 'tiktok_badge' ? (
                          <div className={cn(
                            "bg-black text-white rounded-lg p-2 flex items-center gap-2 border-2 border-slate-700 shadow-xl",
                            layoutMode === 8 ? "p-1.5 gap-1.5" : layoutMode === 9 ? "p-1 gap-1" : "p-2 gap-3"
                          )}>
                            <div className={cn("rounded-full bg-white flex items-center justify-center text-black flex-shrink-0", layoutMode === 8 ? "w-5 h-5" : layoutMode === 9 ? "w-4 h-4" : "w-10 h-10")}>
                              <ImageIcon size={layoutMode === 8 ? 10 : layoutMode === 9 ? 8 : 20} />
                            </div>
                            <div className="text-left overflow-hidden">
                              <h4 className={cn("font-display font-extrabold uppercase truncate", layoutMode === 8 ? "text-[8px]" : layoutMode === 9 ? "text-[7px]" : "text-[14px]")}>
                                {product.name || `ITEM ${i+1}`}
                              </h4>
                              <p className={cn("font-mono font-bold text-white/90", layoutMode === 8 ? "text-[9px]" : layoutMode === 9 ? "text-[8px]" : "text-[15px]")}>
                                Rp {product.price || '0'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className={cn(
                            "flex-1 flex flex-col justify-center min-h-0 w-full transition-all duration-300",
                            productBoxStyle === 'card' && "bg-white p-1 rounded-lg shadow-sm border border-slate-100",
                            productBoxStyle === 'badge' && "bg-slate-900 text-white p-1 rounded-lg shadow-md",
                            productBoxStyle === 'glass' && "bg-white/40 backdrop-blur-md p-1 rounded-lg border border-white/20",
                            productBoxStyle === 'outline' && "border border-slate-400 p-1 rounded-lg",
                            productBoxStyle === 'shadow_only' && "shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-1 rounded-lg",
                            productBoxStyle === 'gradient_bottom' && "bg-gradient-to-t from-slate-100/50 to-transparent p-1 rounded-lg",
                            productBoxStyle === 'neon' && "border-2 border-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)] p-1 rounded-lg",
                            productBoxStyle === 'modern_label' && "flex flex-col items-start",
                            productBoxStyle === 'mini_label' && "flex items-center justify-center"
                          )}>
                            {productBoxStyle === 'modern_label' && (
                              <div className={cn(
                                "bg-black text-white p-3 rounded-[20px] border-2 border-slate-700 shadow-xl flex items-center gap-3 w-full",
                                layoutMode >= 8 && "p-2 rounded-xl gap-2"
                              )}>
                                 <div className={cn(
                                   "rounded-full bg-white flex items-center justify-center text-black flex-shrink-0",
                                   layoutMode >= 8 ? "w-7 h-7" : "w-10 h-10"
                                 )}>
                                   <img src={shopInfo.logo || ''} className="w-full h-full object-cover rounded-full" alt="" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className={cn("font-display font-black uppercase truncate", layoutMode >= 8 ? "text-[10px]" : "text-[16px]")}>{product.name || 'NAMA'}</h4>
                                    <p className={cn("font-mono font-bold text-white/70", layoutMode >= 8 ? "text-[10px]" : "text-[14px]")}>Rp {product.price || '0'}</p>
                                 </div>
                              </div>
                            )}
                            
                            {productBoxStyle === 'mini_label' && (
                               <div className="flex flex-col items-center bg-white border-2 border-black p-0 shadow-[2px_2px_0_#000]">
                                  <div className="border-b-2 border-black px-2 py-0.5 w-full text-center">
                                     <span className={cn("font-display font-black whitespace-nowrap", layoutMode >= 8 ? "text-[8px]" : "text-[11px]")}>NO. {product.linkNo || (1000 + i)}</span>
                                  </div>
                                  <div className="bg-black text-white px-2 py-0.5 w-full text-center">
                                     <span className={cn("font-mono font-bold whitespace-nowrap", layoutMode >= 8 ? "text-[8px]" : "text-[11px]")}>Rp {product.price || '0'}</span>
                                  </div>
                               </div>
                            )}

                            {productBoxStyle === 'gender_label' && (
                               <div className={cn(
                                 "bg-black text-white p-2 rounded-2xl border-4 border-slate-300 shadow-2xl flex items-center gap-3 w-full max-w-[200px]",
                                 layoutMode >= 8 && "p-1 rounded-xl border-2 gap-1"
                               )}>
                                  <div className={cn(
                                    "aspect-square rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0",
                                    layoutMode >= 8 ? "w-8 h-8" : "w-14 h-14"
                                  )}>
                                     <User size={layoutMode >= 8 ? 16 : 32} className="text-black" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <div className={cn("font-display font-black uppercase leading-tight truncate", layoutMode >= 8 ? "text-[8px]" : "text-[18px]")}>
                                       {product.name.toLowerCase().includes('cewek') ? 'CEWEK' : 'COWOK'}
                                     </div>
                                     <div className={cn("font-mono font-bold text-white/80", layoutMode >= 8 ? "text-[7px]" : "text-[14px]")}>
                                       Rp {product.price || '0'}
                                     </div>
                                  </div>
                               </div>
                            )}

                            {productBoxStyle !== 'modern_label' && productBoxStyle !== 'mini_label' && productBoxStyle !== 'gender_label' && (
                              <>
                                <h4 className={cn(
                                  "font-display font-bold tracking-tight uppercase leading-none line-clamp-1",
                                  productBoxStyle === 'badge' ? "text-white" : template === 'dark' ? "text-white" : "text-slate-800",
                                  layoutMode === 9 ? "text-[9px]" : layoutMode === 8 ? "text-[10px]" : "text-base"
                                )}>
                                  {product.name || `Barang ${i+1}`}
                                </h4>
                                <p className={cn(
                                  "font-mono font-bold mt-0.5",
                                  layoutMode === 9 ? "text-[9px]" : layoutMode === 8 ? "text-[10px]" : "text-sm",
                                  productBoxStyle === 'badge' ? "text-white/90" : 
                                  template === 'shopee' ? "text-orange-600" : template === 'instagram' ? "text-slate-900" : template === 'dark' ? "text-indigo-400" : "text-blue-600"
                                )}>
                                  Rp {product.price || '0'}
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Account Pill Footer */}
                {shopInfo.accountTag && template !== 'fazion_modern' && template !== 'fazion_grid' && (
                  <div className="flex justify-center pb-4">
                    <div className="bg-black/90 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-black">
                        <Store size={10} />
                      </div>
                      {shopInfo.accountTag}
                    </div>
                  </div>
                )}

                {/* Fazion Specific Footer Controls */}
                {(template === 'fazion_modern' || template === 'fazion_grid') && (
                  <div className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-4 z-20">
                    {/* Pagination Dots */}
                    <div className="flex gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                       {[1,2,3,4,5].map(i => (
                         <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i === 1 ? "bg-white" : "bg-white/30")} />
                       ))}
                    </div>
                    {/* Account Pill with arrows */}
                    <div className="flex items-center gap-6 w-full justify-center">
                       <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"><ChevronLeft size={16} /></div>
                       <div className="bg-white/10 backdrop-blur-md text-white text-[9px] font-display font-black px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest flex items-center gap-2">
                         <div className="p-1 bg-white rounded-md text-black"><Store size={10} /></div>
                         {shopInfo.accountTag || "@fazion.shop"}
                       </div>
                       <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"><ChevronRight size={16} /></div>
                    </div>
                  </div>
                )}
                <footer className="h-2" />
              </>
            ) : appMode === 'cover' ? (
              <div className="relative w-full h-full flex flex-col group">
                {coverData.background ? (
                  <img src={coverData.background} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-display font-black uppercase tracking-widest italic opacity-50">Frame Utama</div>
                )}
                
                {/* Overlay Elements */}
                <div 
                  className={cn(
                    "absolute z-10 flex",
                    coverData.boxAlign === 'left' ? "justify-start pl-10" : coverData.boxAlign === 'right' ? "justify-end pr-10" : "justify-center inset-x-0"
                  )}
                  style={{ bottom: `${coverData.boxY}%` }}
                >
                  <div 
                    className="bg-white rounded-[40px] px-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col items-center text-center relative overflow-hidden ring-1 ring-black/5"
                    style={{ 
                      width: coverData.isAutoWidth ? 'fit-content' : `${coverData.boxWidth}%`,
                      maxWidth: '92%',
                      paddingTop: `${coverData.boxPaddingV}px`,
                      paddingBottom: `${coverData.boxPaddingV}px`
                    }}
                  >
                    {/* Subtle decorative dot */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                       <div className="w-1 h-1 rounded-full bg-slate-200" />
                       <div className="w-4 h-1 rounded-full bg-slate-100" />
                       <div className="w-1 h-1 rounded-full bg-slate-200" />
                    </div>

                    <div className="relative z-10 w-full">
                       <h2 
                         className="font-display font-medium text-slate-900 leading-[1.1] tracking-tight"
                         style={{ fontSize: `${coverData.fontSize}rem` }}
                         dangerouslySetInnerHTML={{ __html: coverData.caption }}
                       />
                    </div>
                    
                    <div className="absolute bottom-4 right-8 font-display font-black text-slate-900 text-sm italic uppercase tracking-tighter">
                      {coverData.shopName}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-12 z-10">
                   <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <Instagram size={12} className="text-white/80" />
                      <span className="font-sans font-bold text-white/80 text-[13px] tracking-tight">{coverData.source}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-white p-10 flex flex-col items-center overflow-hidden">
                {/* Tutorial Header */}
                <div className="relative mt-2 mb-10 scale-[0.85]">
                  <div className="absolute -inset-2 bg-slate-900 rounded-[32px] translate-x-3 translate-y-3" />
                  <div className="relative bg-white border-[6px] border-slate-900 rounded-[32px] px-10 py-5 min-w-[300px] flex items-center justify-center">
                    <h1 className="text-3xl font-black text-center leading-[1.1] tracking-tight text-slate-900 flex flex-col">
                      <span>{tutorialData.title.split(' ').slice(0, 2).join(' ')}</span>
                      <span>{tutorialData.title.split(' ').slice(2).join(' ')}</span>
                    </h1>
                  </div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 w-full flex-1 items-start mt-4 px-8 overflow-hidden">
                   {tutorialData.steps.map((step) => (
                     <div key={step.id} className={cn(
                       "flex flex-col items-center gap-3",
                       step.id === 3 && "col-span-2 mx-auto max-w-[280px]"
                     )}>
                        <h3 className="text-lg font-bold text-slate-900 text-center leading-tight tracking-tight">
                          <span className="font-extrabold">{step.id}.</span>
                          <span dangerouslySetInnerHTML={{ __html: step.text }} />
                        </h3>
                        
                        <div className="relative w-full aspect-square max-w-[150px]">
                           <div className="absolute -inset-1 bg-slate-900 rounded-3xl translate-x-1.5 translate-y-1.5" />
                           <div className="relative h-full w-full bg-slate-50 border-[4px] border-slate-900 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner">
                              {step.image ? (
                                <img src={step.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <ImageIcon size={32} className="text-slate-200" />
                              )}
                              
                              {/* Aesthetic Pointer Overlay */}
                              <div className={cn(
                                "absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center border-[3px] border-slate-900 shadow-xl",
                                !step.image && "hidden"
                              )}>
                                 <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex justify-between items-center text-slate-400 px-4">
             <div className="text-xs font-medium">Ready to post on Instagram/Shopee Feed</div>
             <div className="flex gap-4">
                <div className="flex items-center gap-1"><Check size={14} /> HQ Export</div>
                <div className="flex items-center gap-1"><Check size={14} /> Custom Layout</div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
