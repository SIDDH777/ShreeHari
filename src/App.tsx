/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, FormEvent, MouseEvent } from "react";
import { 
  Search, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  Heart, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Download,
  Home,
  Grid,
  Settings,
  BarChart3,
  Package,
  TrendingUp,
  LogOut,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const INITIAL_PRODUCTS = [
  { id: 1, name: "Women Cotton Indigo Printed Dress", price: 1499, origPrice: 1999, discount: 25, img: "https://byshree.com/cdn/shop/files/1_2010f26f-fde3-4cac-8f23-2ffb50328a27.jpg?v=1776761818&width=600", stock: 154 },
  { id: 2, name: "Women Cotton Blue Floral Print Dress", price: 1499, origPrice: 1999, discount: 25, img: "https://byshree.com/cdn/shop/files/1_8d27ce51-a370-4bd3-952a-db28be5130aa.jpg?v=1776761572&width=600", stock: 89 },
  { id: 3, name: "Women Liva Multicolor Printed Co Ord Set", price: 2519, origPrice: 3599, discount: 30, img: "https://byshree.com/cdn/shop/files/1_97810ddc-66f2-4aa6-a213-1825b11e07f3.jpg?v=1776761396&width=600", stock: 45 },
  { id: 4, name: "Women Liva Green Printed Co Ord Set", price: 2519, origPrice: 3599, discount: 30, img: "https://byshree.com/cdn/shop/files/1_c2c44c4c-6519-42d6-a6fc-a5f8afe65da4.jpg?v=1776761001&width=600", stock: 67 },
  { id: 5, name: "Women Liva Yellow Floral Print Co Ord Set", price: 1999, origPrice: 2499, discount: 20, img: "https://byshree.com/cdn/shop/files/1_a2642d4d-4955-477f-9ca8-daa7e5071448.jpg?v=1776760636&width=600", stock: 121 },
  { id: 6, name: "Women Liva Multicolor Printed Kurta Set", price: 2299, origPrice: 2799, discount: 18, img: "https://byshree.com/cdn/shop/files/3_d691b124-ae06-4d9d-a4f5-96d597b438c6.jpg?v=1776760526&width=600", stock: 32 },
];

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminStatsTab, setAdminStatsTab] = useState("overview"); // overview, inventory, orders, settings
  const [loginCreds, setLoginCreds] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Payment Config
  const [paymentConfig, setPaymentConfig] = useState({
    whatsappNumber: "919016171717",
    gpayUpiId: "shrihari.wear@ybl"
  });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    origPrice: "",
    stock: "",
    img: "https://byshree.com/cdn/shop/files/1_2010f26f-fde3-4cac-8f23-2ffb50328a27.jpg?v=1776761818&width=600"
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginCreds.username === "ShreeHari" && loginCreds.password === "Pranshi@171") {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setActiveTab("admin");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Access Denied.");
    }
  };

  const updateProductStock = (id: number, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  const updateProductPrice = (id: number, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: Math.max(0, newPrice) } : p));
  };

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    const id = products.length + 1;
    const price = parseInt(newProduct.price);
    const origPrice = parseInt(newProduct.origPrice) || price;
    const discount = origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
    
    const productToAdd = {
      id,
      name: newProduct.name,
      price: price,
      origPrice: origPrice,
      discount: discount,
      img: newProduct.img,
      stock: parseInt(newProduct.stock) || 0
    };

    setProducts(prev => [...prev, productToAdd]);
    setNewProduct({ name: "", price: "", origPrice: "", stock: "", img: "https://byshree.com/cdn/shop/files/1_2010f26f-fde3-4cac-8f23-2ffb50328a27.jpg?v=1776761818&width=600" });
    setShowAddForm(false);
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const [stockWarning, setStockWarning] = useState<string | null>(null);

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
    setWishlist(prev => prev.filter(item => item !== id));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty >= product.stock) {
        setStockWarning(`Only ${product.stock} units of ${product.name} are currently in stock.`);
        setTimeout(() => setStockWarning(null), 3000);
        return prev;
      }

      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: number, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        if (nextQty > product.stock) {
          setStockWarning(`Maximum available stock reached for ${product.name}.`);
          setTimeout(() => setStockWarning(null), 3000);
          return item;
        }
        return { ...item, quantity: Math.max(1, nextQty) };
      }
      return item;
    }));
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  const cartProducts = cart.map(item => ({
    ...products.find(p => p.id === item.id)!,
    quantity: item.quantity
  }));
  const cartTotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Top Discount Bar */}
      <div className="bg-dark text-[#d4c4b0] text-[10px] md:text-xs text-center py-2 px-4 tracking-wider">
        Free Delivery on All Orders | <span className="text-gold font-bold">Online Exclusive Sale — Upto 60% OFF</span>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-md py-2' : 'border-b border-border py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-brand/5 rounded-full transition-colors" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6 text-dark" />
            </button>
            <div className="flex flex-col cursor-pointer group" onClick={() => setActiveTab("home")}>
              <span className="font-artistic text-xl md:text-3xl font-black text-brand tracking-tight drop-shadow-sm transition-transform group-hover:scale-105">શ્રી હરિ</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="h-px bg-brand/20 flex-1"></span>
                <span className="text-[7px] md:text-[9px] text-brand/60 tracking-[0.3em] uppercase font-bold whitespace-nowrap">Miracle Within</span>
                <span className="h-px bg-brand/20 flex-1"></span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink id="nav-home" onClick={() => setActiveTab("home")} className={activeTab === 'home' ? 'text-brand border-brand' : ''}>Home</NavLink>
            <NavLink id="nav-categories" onClick={() => setActiveTab("categories")} className={activeTab === 'categories' ? 'text-brand border-brand' : ''}>Categories</NavLink>
            <NavLink id="nav-sets" onClick={() => setActiveTab("categories")}>Ethnic Sets</NavLink>
            <NavLink id="nav-sale" className="text-sale font-bold">EOSS</NavLink>
          </nav>

          <div className="flex items-center gap-4 md:gap-6 text-mid">
            <button className="hover:text-brand transition-colors" onClick={() => setIsSearchOpen(true)}><Search className="w-5 h-5" /></button>
            <button className="hidden sm:block hover:text-brand transition-colors" onClick={() => setActiveTab("profile")}><User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-brand' : ''}`} /></button>
            <button className="relative hover:text-brand transition-colors" onClick={() => setActiveTab("wishlist")}>
              <Heart className={`w-5 h-5 ${wishlist.length > 0 || activeTab === 'wishlist' ? 'fill-brand text-brand' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{wishlist.length}</span>
              )}
            </button>
            <button className="relative hover:text-brand transition-colors" onClick={() => setActiveTab("cart")}>
              <ShoppingBag className={`w-5 h-5 ${activeTab === 'cart' ? 'text-brand' : ''}`} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold transition-all">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col p-6"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mid" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search for Kurtas, Dresses..." 
                  className="w-full bg-light border-none rounded-full py-4 pl-12 pr-4 text-dark outline-none ring-2 ring-transparent focus:ring-brand/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                className="p-2 font-bold text-dark text-sm uppercase"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <h3 className="text-xs font-bold uppercase tracking-widest text-mid mb-6">Search Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    isWishlisted={wishlist.includes(p.id)} 
                    onToggleWishlist={toggleWishlist} 
                    onAddToCart={() => { addToCart(p.id); setIsSearchOpen(false); setActiveTab("cart"); }}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-mid">No products found for "{searchQuery}"</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-[70] shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-artistic text-2xl font-black text-brand">શ્રી હરિ</span>
                <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <ul className="space-y-6">
                <li><button onClick={() => { setActiveTab("home"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">Home</button></li>
                <li><button onClick={() => { setActiveTab("categories"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">Categories</button></li>
                <li><button onClick={() => { setActiveTab("wishlist"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">My Wishlist</button></li>
                <li><button onClick={() => { setActiveTab("cart"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">Shopping Bag</button></li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-sm p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-4 right-4 p-2 text-mid hover:text-dark"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-brand-light rounded-full mb-4">
                  <Settings className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Admin Access</h3>
                <p className="text-mid text-xs tracking-widest uppercase mt-2">Shri Hari Portal</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#706050] mb-1.5 block">Username</label>
                  <input 
                    type="text" 
                    required
                    value={loginCreds.username}
                    onChange={(e) => setLoginCreds(prev => ({...prev, username: e.target.value}))}
                    className="w-full bg-light border-none rounded py-3 px-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all outline-none"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#706050] mb-1.5 block">Password</label>
                  <input 
                    type="password" 
                    required
                    value={loginCreds.password}
                    onChange={(e) => setLoginCreds(prev => ({...prev, password: e.target.value}))}
                    className="w-full bg-light border-none rounded py-3 px-4 text-sm focus:ring-2 focus:ring-brand/20 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {loginError && (
                  <p className="text-sale text-[10px] font-bold italic">{loginError}</p>
                )}
                <button type="submit" className="w-full bg-brand text-white py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-all mt-6">
                  Verify & Enter
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative overflow-hidden bg-[#faf7f2] py-16 md:py-32"
              >
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 text-center md:text-left z-10"
                  >
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-[10px] md:text-xs font-black tracking-[0.4em] text-brand uppercase mb-6 block border-l-2 border-brand pl-4"
                    >
                      Premium Ethnic Selection — 2026
                    </motion.span>
                    <h1 className="font-serif text-5xl md:text-8xl font-bold text-dark leading-[0.9] mb-8 tracking-tighter">
                      The Art Of <br />
                      <span className="text-brand italic font-medium">Bespoke</span> Grace
                    </h1>
                    <p className="text-mid text-base md:text-xl mb-12 max-w-sm mx-auto md:mx-0 leading-relaxed font-light">
                      Meticulously handcrafted ensembles that bridge heritage and modernity.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button onClick={() => setActiveTab("categories")} className="w-full sm:w-auto bg-brand text-white px-10 py-5 rounded-sm text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-dark transition-all transform hover:-translate-y-1 shadow-2xl shadow-brand/20 active:scale-95">
                        Shop Collection
                      </button>
                      <button onClick={() => setActiveTab("categories")} className="w-full sm:w-auto px-10 py-5 rounded-sm text-xs font-bold tracking-[0.2em] uppercase border border-border hover:bg-white transition-all">
                        Lookbook '26
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex-1 relative"
                  >
                    <div className="grid grid-cols-12 gap-4 h-[400px] md:h-[600px]">
                      <div className="col-span-8 h-full rounded-sm overflow-hidden shadow-2xl">
                         <img src={products[0].img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]" alt="Model" />
                      </div>
                      <div className="col-span-4 flex flex-col gap-4">
                         <div className="flex-1 rounded-sm overflow-hidden shadow-xl">
                            <img src={products[1].img} className="w-full h-full object-cover" alt="Detail" />
                         </div>
                         <div className="flex-1 rounded-sm overflow-hidden shadow-xl">
                            <img src={products[2].img} className="w-full h-full object-cover" alt="Detail" />
                         </div>
                      </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand/5 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand/5 rounded-full blur-3xl -z-10"></div>
                  </motion.div>
                </div>
              </motion.section>

              {/* Featured Products */}
              <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between mb-10 border-b-2 border-brand-light pb-4">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold">Trending Now</h2>
                  <button onClick={() => setActiveTab("categories")} className="text-brand font-bold text-xs uppercase tracking-widest border-b border-brand pb-1">View All</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={() => addToCart(product.id)}
                    />
                  ))}
                </div>
              </section>

      {/* Category Section */}
              <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="flex flex-col items-center mb-16">
                     <span className="text-brand font-black text-[10px] tracking-[0.5em] uppercase mb-4">Curated Style</span>
                     <h2 className="font-serif text-3xl md:text-5xl font-bold italic">Signature Collections</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <CategoryCard 
                      onClick={() => setActiveTab("categories")} 
                      title="Ethereal Festive" 
                      subtitle="Shine in Heritage"
                      img="https://byshree.com/cdn/shop/files/FESTIVE_RADIANCE_banner_800_x_640_jpg.jpg?v=1773601929&width=600" 
                    />
                     <CategoryCard 
                      onClick={() => setActiveTab("categories")} 
                      title="Daily Serenity" 
                      subtitle="Cloud-Soft Cotton"
                      img="https://byshree.com/cdn/shop/files/DAILY_RHYTHM_banner_800_x_640_jpg.jpg?v=1773601929&width=600" 
                    />
                     <CategoryCard 
                      onClick={() => setActiveTab("categories")} 
                      title="The Glam Room" 
                      subtitle="Midnight Allure"
                      img="https://byshree.com/cdn/shop/files/glam_soul_banner_800_x_640_jpg.jpg?v=1773601929&width=600" 
                    />
                     <CategoryCard 
                      onClick={() => setActiveTab("categories")} 
                      title="Modern Muse" 
                      subtitle="Breezy Elegance"
                      img="https://byshree.com/cdn/shop/files/FREE_SPIRIT_banner_W800-x-H640_jpg.jpg?v=1773601930&width=600" 
                    />
                  </div>
                </div>
              </section>

              {/* Brand Stats */}
              <section className="bg-dark py-12 text-center">
                  <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-gold font-serif text-2xl md:text-4xl font-bold">2.5M+</div>
                      <div className="text-[#a09080] text-[10px] uppercase font-bold tracking-widest mt-1">Households</div>
                    </div>
                    <div>
                      <div className="text-gold font-serif text-2xl md:text-4xl font-bold">7.5M+</div>
                      <div className="text-[#a09080] text-[10px] uppercase font-bold tracking-widest mt-1">Units Sold</div>
                    </div>
                    <div>
                      <div className="text-gold font-serif text-2xl md:text-4xl font-bold">150+</div>
                      <div className="text-[#a09080] text-[10px] uppercase font-bold tracking-widest mt-1">Stores</div>
                    </div>
                  </div>
              </section>
              
              {/* Footer */}
              <footer className="bg-light border-t border-border pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="font-artistic text-3xl font-black text-brand tracking-tight">શ્રી હરિ</span>
                        <span className="text-[10px] text-mid tracking-[0.2em] uppercase font-bold">Miracle Within</span>
                      </div>
                      <p className="text-xs text-mid leading-relaxed">
                        Redefining ethnic grace for the modern Indian woman. Quality, comfort, and tradition in every stitch.
                      </p>
                      <div className="flex items-center gap-4 text-mid">
                        <Instagram className="w-5 h-5 hover:text-brand cursor-pointer" />
                        <Facebook className="w-5 h-5 hover:text-brand cursor-pointer" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6">Quick Links</h4>
                      <ul className="space-y-3 text-xs text-mid">
                        <li className="hover:text-brand cursor-pointer">About Us</li>
                        <li className="hover:text-brand cursor-pointer">Contact Support</li>
                        <li className="hover:text-brand cursor-pointer">Store Locator</li>
                        <li className="hover:text-brand cursor-pointer">Bulk Inquiries</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6">Policies</h4>
                      <ul className="space-y-3 text-xs text-mid">
                        <li className="hover:text-brand cursor-pointer">Return & Exchange</li>
                        <li className="hover:text-brand cursor-pointer">Shipping Policy</li>
                        <li className="hover:text-brand cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-brand cursor-pointer">Terms of Service</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6">Newsletter</h4>
                      <p className="text-xs text-mid mb-4">Stay updated with our latest ethnic releases.</p>
                      <div className="flex overflow-hidden rounded-sm border border-border">
                        <input type="email" placeholder="Email" className="flex-1 px-3 py-2 text-xs outline-none bg-white" />
                        <button className="bg-brand text-white px-4 py-2 text-[10px] font-bold uppercase">Join</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-mid tracking-wide">© 2026 Shri Hari Ethnic Wear. All Rights Reserved.</p>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] text-mid font-bold uppercase tracking-widest">Handmade In India</span>
                      <div className="h-4 w-px bg-border"></div>
                      <span className="text-[9px] text-mid font-bold uppercase tracking-widest cursor-pointer hover:text-brand" onClick={() => setShowAdminLogin(true)}>Admin Login</span>
                    </div>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}

          {activeTab === "wishlist" && (
            <motion.div 
              key="wishlist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-12 md:py-24 max-w-7xl mx-auto px-4 md:px-8 min-h-[60vh]"
            >
              <div className="flex flex-col items-center justify-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">My Wishlist</h2>
                <div className="w-12 h-1 bg-brand rounded-full mb-4"></div>
                <p className="text-mid text-sm">{wishlistProducts.length} items in your collection</p>
              </div>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {wishlistProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isWishlisted={true}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={() => addToCart(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-brand/30" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                  <p className="text-mid text-sm max-w-xs mb-8">
                    Looks like you haven't added any ethnic treasures yet. Explore our latest collection!
                  </p>
                  <button 
                    onClick={() => setActiveTab("home")}
                    className="bg-brand text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-all"
                  >
                    Go To Shop
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "cart" && (
            <motion.div 
              key="cart"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 md:py-24 max-w-4xl mx-auto px-4 md:px-8 min-h-[60vh]"
            >
              <h2 className="font-serif text-3xl font-bold mb-8">Shopping Bag</h2>
              
              {cartProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-6">
                    {cartProducts.map(item => (
                      <div key={item.id} className="flex gap-4 border-b border-border pb-6">
                        <img src={item.img} className="w-24 h-32 object-cover rounded-sm" alt={item.name} />
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-sm font-bold text-dark">{item.name}</h4>
                            <p className="text-xs text-mid">Standard Size</p>
                            <p className="text-sm font-bold mt-2">₹{item.price}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-light rounded px-3 py-1">
                              <button onClick={() => updateCartQuantity(item.id, -1)} className="font-bold text-lg">-</button>
                              <span className="text-xs font-medium">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(item.id, 1)} className="font-bold text-lg">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase font-bold text-sale tracking-widest">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-light p-6 rounded-sm h-fit sticky top-32">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">Order Summary</h3>
                    
                    <AnimatePresence>
                      {stockWarning && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-sale/10 border border-sale/20 p-3 rounded mb-6"
                        >
                          <p className="text-[10px] text-sale font-bold leading-tight">{stockWarning}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-mid">Subtotal</span>
                        <span className="font-bold">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-mid">Shipping</span>
                        <span className="text-brand font-bold uppercase text-[10px] tracking-widest">Free</span>
                      </div>
                      <div className="border-t border-border mt-4 pt-4 flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-xl text-brand">₹{cartTotal}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          const message = `Halo Shri Hari! I want to order:\n${cartProducts.map(p => `- ${p.name} (Qty: ${p.quantity})`).join('\n')}\nTotal: ₹${cartTotal}`;
                          window.open(`https://wa.me/${paymentConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full bg-[#25D366] text-white py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Pay Via WhatsApp
                      </button>
                      
                      <button 
                        onClick={() => {
                          // Standard UPI Intent URL
                          const upiUrl = `upi://pay?pa=${paymentConfig.gpayUpiId}&pn=Shri%20Hari%20Ethnic&am=${cartTotal}&cu=INR`;
                          window.open(upiUrl, '_blank');
                        }}
                        className="w-full bg-dark text-white py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        GPay / PhonePe / UPI
                      </button>
                    </div>

                    <p className="text-[10px] text-mid text-center mt-4">Secure payment powered by Shri Hari Enterprise</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                   <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-brand/30" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your Bag is empty</h3>
                  <button onClick={() => setActiveTab("home")} className="bg-brand text-white px-8 py-3 mt-6 rounded-sm text-xs font-bold uppercase tracking-widest">Start Shopping</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "categories" && (
            <motion.div 
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 md:py-24 max-w-7xl mx-auto px-4 md:px-8"
            >
              <h2 className="font-serif text-3xl font-bold mb-12 text-center">Explore Collections</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {['Kurtas', 'Dresses', 'Ethnic Sets', 'Co-ords', 'Tunics', 'Bottom Wear', 'Lehengas', 'Jewellery'].map((cat, i) => (
                  <div key={cat} onClick={() => setActiveTab("home")} className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer border border-border">
                    <img src={products[i % products.length].img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-brand/20 transition-all flex items-center justify-center">
                      <h4 className="text-white font-serif text-xl font-bold">{cat}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 md:py-24 max-w-md mx-auto px-4 text-center"
            >
               <div className="w-24 h-24 bg-brand-light rounded-full mx-auto flex items-center justify-center mb-6">
                 <User className="w-10 h-10 text-brand" />
               </div>
               <h2 className="font-serif text-2xl font-bold mb-2">Welcome to Shri Hari</h2>
               <div className="space-y-4 text-left mt-12">
                  <button className="w-full flex items-center justify-between p-4 bg-light rounded hover:bg-brand-light transition-colors">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-brand" />
                      <span className="text-sm font-bold">My Orders</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setShowAdminLogin(true)} className="w-full flex items-center justify-between p-4 bg-brand-light/50 border border-brand/20 rounded hover:bg-brand-light transition-colors">
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-brand" />
                      <span className="text-sm font-bold">Admin Portal</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-light rounded hover:bg-brand-light transition-colors">
                    <span className="text-sm font-bold">Profile Settings</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
               </div>

               <DownloadAppSection deferredPrompt={deferredPrompt} onInstall={handleInstallClick} />
            </motion.div>
          )}

          {activeTab === "admin" && isAdminLoggedIn && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen bg-[#f8f9fa] pt-12 pb-24 md:pt-20 px-4 md:px-8"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                  <div>
                    <h1 className="font-serif text-4xl font-bold text-dark mb-2">Admin Dashboard</h1>
                    <p className="text-mid text-sm">Enterprise Resource Planning & BI Analysis</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-1 rounded-full shadow-sm border border-border">
                    {["overview", "inventory", "orders", "settings"].map((t) => (
                      <button 
                        key={t}
                        onClick={() => setAdminStatsTab(t)}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${adminStatsTab === t ? 'bg-brand text-white shadow-md' : 'text-mid hover:text-brand'}`}
                      >
                        {t}
                      </button>
                    ))}
                    <button onClick={() => setIsAdminLoggedIn(false)} className="p-2 text-sale hover:bg-sale/10 rounded-full transition-colors ml-2">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {adminStatsTab === "overview" && (
                  <div className="space-y-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <MetricCard label="Total Revenue" value="₹24,82,190" change="+12.5%" isPositive icon={<TrendingUp className="w-5 h-5" />} />
                      <MetricCard label="Total Orders" value="1,280" change="+8.2%" isPositive icon={<ShoppingBag className="w-5 h-5" />} />
                      <MetricCard label="ROI Index" value="28.4%" change="-1.2%" isPositive={false} icon={<BarChart3 className="w-5 h-5" />} />
                      <MetricCard label="Stock Turnover" value="4.2x" change="+0.4x" isPositive icon={<Package className="w-5 h-5" />} />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-sm shadow-sm border border-border">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-border pb-4 flex justify-between items-center">
                          Revenue Trend (Weekly)
                          <span className="text-[10px] text-mid font-normal">Last 7 Days</span>
                        </h3>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8d2737" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#8d2737" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                              <Tooltip />
                              <Area type="monotone" dataKey="revenue" stroke="#8d2737" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-sm shadow-sm border border-border">
                         <h3 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-border pb-4 flex justify-between items-center">
                          Sales Distribution
                          <span className="text-[10px] text-mid font-normal">By Category</span>
                        </h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={CATEGORY_SALES}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {CATEGORY_SALES.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="hidden md:block space-y-2">
                             {CATEGORY_SALES.map((c, i) => (
                               <div key={c.name} className="flex items-center gap-2 text-[10px] font-bold uppercase">
                                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                                 <span className="text-dark">{c.name}</span>
                                 <span className="text-mid">{c.value}%</span>
                               </div>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {adminStatsTab === "inventory" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-sm border border-border shadow-sm">
                       <div>
                         <h3 className="text-sm font-bold uppercase tracking-widest">Inventory Assets</h3>
                         <p className="text-[10px] text-mid">Showing {products.length} active SKUs</p>
                       </div>
                       <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-brand text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm hover:shadow-lg transition-all"
                       >
                         {showAddForm ? 'Cancel Entry' : 'Add New SKU'}
                       </button>
                    </div>

                    <AnimatePresence>
                      {showAddForm && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-[#fffefe] p-6 rounded-sm border-2 border-brand/10 shadow-inner mb-8"
                        >
                          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-bold uppercase text-mid mb-1 block">Product Name</label>
                              <input 
                                type="text" 
                                required
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                className="w-full bg-light border-none rounded py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-brand"
                                placeholder="e.g. Silk Kurta Collection"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold uppercase text-mid mb-1 block">Selling Price (₹)</label>
                              <input 
                                type="number" 
                                required
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                className="w-full bg-light border-none rounded py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-brand"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold uppercase text-mid mb-1 block">Original Price (₹)</label>
                              <input 
                                type="number" 
                                value={newProduct.origPrice}
                                onChange={(e) => setNewProduct({...newProduct, origPrice: e.target.value})}
                                className="w-full bg-light border-none rounded py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-brand"
                              />
                            </div>
                            <div className="md:col-span-2">
                               <label className="text-[9px] font-bold uppercase text-mid mb-1 block">Image URL (Optional)</label>
                               <input 
                                type="text" 
                                value={newProduct.img}
                                onChange={(e) => setNewProduct({...newProduct, img: e.target.value})}
                                className="w-full bg-light border-none rounded py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-brand"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold uppercase text-mid mb-1 block">Stock Quantity</label>
                              <input 
                                type="number" 
                                required
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                className="w-full bg-light border-none rounded py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-brand"
                              />
                            </div>
                            <div className="flex items-end">
                              <button type="submit" className="w-full bg-dark text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-sm hover:bg-brand transition-colors">
                                Add To Inventory
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="bg-white rounded-sm border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[#fcfaf8] border-b border-border">
                          <tr>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Product</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Pricing</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Stock Level</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Status</th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {products.map(p => (
                            <tr key={p.id} className="hover:bg-light transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img src={p.img} className="w-10 h-10 object-cover rounded" alt="" />
                                  <span className="text-xs font-bold text-dark max-w-[200px] truncate">{p.name}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-mid">₹</span>
                                    <input 
                                      type="number"
                                      value={p.price}
                                      onChange={(e) => updateProductPrice(p.id, parseInt(e.target.value) || 0)}
                                      className="w-20 bg-light border-none rounded py-1 pl-4 pr-1 text-[10px] font-bold outline-none focus:ring-1 focus:ring-brand"
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-1">
                                  <input 
                                    type="number"
                                    value={p.stock}
                                    onChange={(e) => updateProductStock(p.id, parseInt(e.target.value) || 0)}
                                    className="w-16 bg-light border-none rounded py-1 px-2 text-[10px] font-bold outline-none focus:ring-1 focus:ring-brand"
                                  />
                                  <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                                     <div 
                                      className={`h-full ${p.stock < 10 ? 'bg-sale' : 'bg-brand'}`} 
                                      style={{width: `${Math.min(100, (p.stock / 200) * 100)}%`}}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-sale/10 text-sale'}`}>
                                  {p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                </span>
                              </td>
                              <td className="p-4">
                                <button 
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-2 text-mid hover:text-sale hover:bg-sale/10 rounded transition-all"
                                  title="Delete Product"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

                {adminStatsTab === "orders" && (
                   <div className="bg-white p-6 rounded-sm shadow-sm border border-border">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest">Order Reports</h3>
                        <div className="flex gap-2">
                           <button className="text-[10px] font-bold px-3 py-1 bg-brand text-white rounded">Daily</button>
                           <button className="text-[10px] font-bold px-3 py-1 bg-light text-mid rounded">Weekly</button>
                        </div>
                      </div>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ORDER_REPORTS}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#8d2737" radius={[4, 4, 0, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                )}

                {adminStatsTab === "settings" && (
                   <div className="max-w-2xl bg-white p-8 rounded-sm shadow-sm border border-border">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-brand" />
                        Application Settings
                      </h3>
                      
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-[11px] font-bold uppercase mb-4 text-brand">Payment Gateway Config</h4>
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="text-[9px] font-bold uppercase text-mid mb-1.5 block">WhatsApp Business Number (with country code)</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mid">+</span>
                                <input 
                                  type="text" 
                                  value={paymentConfig.whatsappNumber}
                                  onChange={(e) => setPaymentConfig({...paymentConfig, whatsappNumber: e.target.value.replace(/\D/g, '')})}
                                  className="w-full bg-light border-none rounded py-3 pl-8 pr-4 text-xs font-mono outline-none focus:ring-1 focus:ring-brand"
                                  placeholder="919016171717"
                                />
                              </div>
                              <p className="text-[9px] text-mid mt-2 italic">Standard messages will be sent to this number upon order.</p>
                            </div>

                            <div>
                              <label className="text-[9px] font-bold uppercase text-mid mb-1.5 block">Google Pay / Merchant UPI ID</label>
                              <input 
                                type="text" 
                                value={paymentConfig.gpayUpiId}
                                onChange={(e) => setPaymentConfig({...paymentConfig, gpayUpiId: e.target.value})}
                                className="w-full bg-light border-none rounded py-3 px-4 text-xs font-mono outline-none focus:ring-1 focus:ring-brand"
                                placeholder="merchant@upi"
                              />
                              <p className="text-[9px] text-mid mt-2 italic">Direct UPI intent will be triggered on mobile checkout.</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-border">
                          <h4 className="text-[11px] font-bold uppercase mb-4 text-brand">Branding</h4>
                          <div className="p-4 bg-light rounded text-[11px] text-mid">
                             <div className="flex justify-between items-center mb-2">
                               <span>Tagline:</span>
                               <span className="font-bold text-dark">Miracle Within</span>
                             </div>
                             <div className="flex justify-between items-center">
                               <span>Logo Font:</span>
                               <span className="font-bold text-dark">Cinzel Decorative</span>
                             </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                           <button className="bg-brand text-white px-8 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-lg hover:shadow-brand/20 transition-all">
                             Save Configuration
                           </button>
                        </div>
                      </div>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-[#a09080] pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="font-artistic text-3xl font-black text-white mb-4 block underline decoration-brand decoration-4 underline-offset-8">શ્રી હરિ</span>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Shri Hari — Miracle Within. Celebrating Indian women through exquisite ethnic wear since our founding. Present in 5 countries.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand transition-colors"><Instagram className="w-5 h-5 text-white" /></a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-brand transition-colors"><Facebook className="w-5 h-5 text-white" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setActiveTab("categories")} className="hover:text-white transition-colors text-left">Collections</button></li>
              <li><button onClick={() => setActiveTab("wishlist")} className="hover:text-white transition-colors text-left">Wishlist</button></li>
              <li><button onClick={() => setActiveTab("cart")} className="hover:text-white transition-colors text-left">Shopping Bag</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Contact Us</h4>
            <p className="text-sm mb-4">support@shrihari.com</p>
            <div className="flex flex-wrap gap-2">
               {['VISA', 'MASTERCARD', 'UPI', 'COD'].map(item => (
                 <span key={item} className="bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-bold rounded">{item}</span>
               ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-white/5 text-[10px] flex justify-between text-[#706050]">
          <span>© 2026 Shri Hari. All rights reserved.</span>
          <span>Made with ❤️ in India</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (App feel) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-brand' : 'text-mid'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab("categories")}
          className={`flex flex-col items-center gap-1 ${activeTab === 'categories' ? 'text-brand' : 'text-mid'}`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">Category</span>
        </button>
        <button 
          onClick={() => setActiveTab("wishlist")}
          className={`flex flex-col items-center gap-1 relative ${activeTab === 'wishlist' ? 'text-brand' : 'text-mid'}`}
        >
          <Heart className={`w-5 h-5 ${(activeTab === 'wishlist' || wishlist.length > 0) ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-1 right-[22%] bg-brand text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab("cart")}
          className={`flex flex-col items-center gap-1 relative ${activeTab === 'cart' ? 'text-brand' : 'text-mid'}`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'cart' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">Bag</span>
          {cart.length > 0 && (
            <span className="absolute top-1 right-[22%] bg-brand text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-brand' : 'text-mid'}`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">Account</span>
        </button>
      </div>
    </div>
  );
}

function DownloadAppSection({ deferredPrompt, onInstall }: { deferredPrompt: any; onInstall: () => void }) {
  const sharedUrl = "https://ais-pre-hfz72gamt4enk5rhgcc5im-112470361785.asia-east1.run.app";

  return (
    <div className="bg-brand/5 border border-brand/10 p-6 rounded-sm mt-8 text-left">
      <h3 className="text-sm font-bold uppercase tracking-widest text-brand mb-2">Install Mobile App</h3>
      
      {deferredPrompt ? (
        <div className="mb-6">
          <p className="text-xs text-mid mb-4 leading-relaxed">
            Click below to install Shri Hari directly on your home screen for the best experience.
          </p>
          <button 
            onClick={onInstall}
            className="w-full bg-brand text-white py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
          >
            Install Shri Hari App
          </button>
        </div>
      ) : (
        <>
          <p className="text-[10px] text-brand font-bold mb-4 break-all bg-white p-2 border border-brand/10 rounded">
            {sharedUrl}
          </p>
          <p className="text-xs text-mid mb-6 leading-relaxed">
            To use as a mobile app, copy the link above and open it in your mobile browser.
          </p>
        </>
      )}
      
      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] font-bold uppercase mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-brand rounded-full"></div>
            Portable Standalone Version
          </h4>
          <a 
            href="/ShreeHari.html" 
            download="ShreeHari.html"
            className="inline-flex items-center gap-2 bg-dark text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-all"
          >
            <Download className="w-3 h-3" />
            Download ShreeHari.html
          </a>
          <p className="text-[9px] text-mid mt-2 leading-relaxed">
            Download a single file containing the entire shop. Works offline and can be shared via WhatsApp.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-brand rounded-full"></div>
            For Android
          </h4>
          <ol className="text-[10px] text-mid list-decimal list-inside space-y-1">
            <li>Open this site in Chrome</li>
            <li>Tap the three dots (⋮) in the top right</li>
            <li>Select "Install app" or "Add to home screen"</li>
          </ol>
        </div>
        
        <div>
          <h4 className="text-[10px] font-bold uppercase mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-brand rounded-full"></div>
            For iOS / iPhone
          </h4>
          <ol className="text-[10px] text-mid list-decimal list-inside space-y-1">
            <li>Open this site in Safari</li>
            <li>Tap the "Share" button (box with up arrow)</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
          </ol>
        </div>

        <div className="pt-4 border-t border-brand/10">
           <p className="text-[9px] text-mid italic">
             Note: Progressive Web Apps (PWA) provide a native app experience without a large download.
           </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, isPositive, icon }: { label: string; value: string; change: string; isPositive: boolean; icon: ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="bg-white p-6 rounded-sm border border-border transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-brand/5 rounded-lg text-brand border border-brand/10">{icon}</div>
        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-mid mb-2">{label}</h4>
      <div className="text-3xl font-bold text-dark tracking-tight">{value}</div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="w-full bg-light h-1 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "70%" }}
            className={`h-full ${isPositive ? 'bg-brand' : 'bg-mid'}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ onClick, title, subtitle, img }: { onClick: () => void; title: string; subtitle: string; img: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group relative cursor-pointer aspect-[3/4] overflow-hidden rounded-sm shadow-sm"
    >
      <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent p-6 flex flex-col justify-end transition-all group-hover:from-brand/80">
        <span className="text-[9px] font-black text-brand-light uppercase tracking-[0.3em] mb-2">{subtitle}</span>
        <h3 className="text-white font-serif text-2xl font-bold">{title}</h3>
        <div className="w-0 group-hover:w-16 h-1 bg-white mt-4 transition-all duration-500 rounded-full"></div>
      </div>
    </motion.div>
  );
}

// Analytics Mock Data
const REVENUE_DATA = [
  { name: 'Mon', revenue: 145000 },
  { name: 'Tue', revenue: 168000 },
  { name: 'Wed', revenue: 152000 },
  { name: 'Thu', revenue: 190000 },
  { name: 'Fri', revenue: 210000 },
  { name: 'Sat', revenue: 280000 },
  { name: 'Sun', revenue: 245000 },
];

const CATEGORY_SALES = [
  { name: 'Kurtas', value: 45 },
  { name: 'Dresses', value: 30 },
  { name: 'Co-ords', value: 15 },
  { name: 'Sets', value: 10 },
];

const ORDER_REPORTS = [
  { name: 'Festive', orders: 450 },
  { name: 'Daily', orders: 320 },
  { name: 'Glam', orders: 120 },
  { name: 'Spirit', orders: 390 },
];

const COLORS = ['#8d2737', '#2d3436', '#d4c4b0', '#a29bfe'];

function NavLink({ children, className = "", id, onClick }: { children: ReactNode; className?: string; id?: string; onClick?: (e: MouseEvent) => void }) {
  return (
    <button 
      id={id}
      onClick={onClick}
      className={`text-xs font-bold uppercase tracking-widest text-dark hover:text-brand transition-colors pb-1 border-b-2 border-transparent hover:border-brand cursor-pointer outline-none ${className}`}
    >
      {children}
    </button>
  );
}

interface ProductCardProps {
  key?: any;
  product: any;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: () => void;
}

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-light mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <motion.img 
          src={product.img} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={product.name} 
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-sale text-white text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow-lg">
            -{product.discount}%
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${isWishlisted ? 'bg-brand text-white' : 'bg-white/80 text-mid hover:bg-white hover:text-brand'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(); }} 
            className="w-full bg-brand text-white font-bold text-[10px] uppercase tracking-[0.2em] py-4 rounded-sm shadow-2xl flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3 h-3" />
            Add To Bag
          </button>
        </div>
      </div>

      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <h4 className="text-[11px] font-bold text-dark truncate flex-1 uppercase tracking-wider">{product.name}</h4>
          <span className="text-[10px] font-black text-brand">₹{product.price}</span>
        </div>
        <div className="flex items-center gap-2">
          {product.origPrice > product.price && (
            <span className="text-[10px] text-mid line-through opacity-60">₹{product.origPrice}</span>
          )}
          <span className="text-[9px] text-[#22c55e] font-bold uppercase tracking-tight">Free Delivery</span>
        </div>
      </div>
    </motion.div>
  );
}

