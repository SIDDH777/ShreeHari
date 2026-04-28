/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, type FormEvent, type MouseEvent } from "react";
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
  Twitter, 
  Home,
  Grid,
  Settings,
  Trash2,
  Plus,
  BarChart2,
  Package,
  TrendingUp,
  FileText,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Women Cotton Indigo Printed Dress", price: 1499, origPrice: 1999, discount: 25, img: "https://byshree.com/cdn/shop/files/1_2010f26f-fde3-4cac-8f23-2ffb50328a27.jpg?v=1776761818&width=600", stock: 45, buyPrice: 900, sold: 12 },
  { id: 2, name: "Women Cotton Blue Floral Print Dress", price: 1499, origPrice: 1999, discount: 25, img: "https://byshree.com/cdn/shop/files/1_8d27ce51-a370-4bd3-952a-db28be5130aa.jpg?v=1776761572&width=600", stock: 32, buyPrice: 850, sold: 8 },
  { id: 3, name: "Women Liva Multicolor Printed Co Ord Set", price: 2519, origPrice: 3599, discount: 30, img: "https://byshree.com/cdn/shop/files/1_97810ddc-66f2-4aa6-a213-1825b11e07f3.jpg?v=1776761396&width=600", stock: 20, buyPrice: 1600, sold: 15 },
  { id: 4, name: "Women Liva Green Printed Co Ord Set", price: 2519, origPrice: 3599, discount: 30, img: "https://byshree.com/cdn/shop/files/1_c2c44c4c-6519-42d6-a6fc-a5f8afe65da4.jpg?v=1776761001&width=600", stock: 15, buyPrice: 1600, sold: 22 },
  { id: 5, name: "Women Liva Yellow Floral Print Co Ord Set", price: 1999, origPrice: 2499, discount: 20, img: "https://byshree.com/cdn/shop/files/1_a2642d4d-4955-477f-9ca8-daa7e5071448.jpg?v=1776760636&width=600", stock: 28, buyPrice: 1200, sold: 30 },
  { id: 6, name: "Women Liva Multicolor Printed Kurta Set", price: 2299, origPrice: 2799, discount: 18, img: "https://byshree.com/cdn/shop/files/3_d691b124-ae06-4d9d-a4f5-96d597b438c6.jpg?v=1776760526&width=600", stock: 10, buyPrice: 1500, sold: 18 },
];

const MOCK_ORDERS = [
  { id: "ORD001", date: new Date().toISOString(), total: 4518, items: 2, status: "Delivered" },
  { id: "ORD002", date: new Date(Date.now() - 86400000).toISOString(), total: 1499, items: 1, status: "Shipped" },
  { id: "ORD003", date: new Date(Date.now() - 172800000).toISOString(), total: 2519, items: 1, status: "Processing" },
  { id: "ORD004", date: new Date(Date.now() - 604800000).toISOString(), total: 7557, items: 3, status: "Delivered" },
  { id: "ORD005", date: new Date(Date.now() - 2592000000).toISOString(), total: 1999, items: 1, status: "Delivered" },
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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
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
            <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6 text-dark" />
            </button>
            <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab("home")}>
              <span className="font-serif text-xl md:text-2xl font-bold text-brand tracking-tight">શ્રી હરિ</span>
              <span className="text-[8px] md:text-[9px] text-mid tracking-[0.2em] uppercase -mt-1 font-medium">She Is Special</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink id="nav-home" onClick={() => setActiveTab("home")} className={activeTab === 'home' ? 'text-brand border-brand' : ''}>Home</NavLink>
            <NavLink id="nav-categories" onClick={() => setActiveTab("categories")} className={activeTab === 'categories' ? 'text-brand border-brand' : ''}>Categories</NavLink>
            <NavLink id="nav-sets" onClick={() => setActiveTab("categories")}>Ethnic Sets</NavLink>
            <NavLink id="nav-admin" onClick={() => setActiveTab("admin")} className={activeTab === 'admin' ? 'text-brand border-brand' : ''}>Admin</NavLink>
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
                <span className="font-serif text-xl font-bold text-brand">શ્રી હરિ</span>
                <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <ul className="space-y-6">
                <li><button onClick={() => { setActiveTab("home"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">Home</button></li>
                <li><button onClick={() => { setActiveTab("categories"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">Categories</button></li>
                <li><button onClick={() => { setActiveTab("wishlist"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">My Wishlist</button></li>
                <li><button onClick={() => { setActiveTab("cart"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2">Shopping Bag</button></li>
                <li><button onClick={() => { setActiveTab("admin"); setIsMenuOpen(false); }} className="text-lg font-medium block w-full text-left border-b border-border pb-2 text-brand">Admin Portal</button></li>
              </ul>
            </motion.div>
          </>
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
              {/* Hero Section */}
              <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-[#f0e0d0] to-[#e8d0be] py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 text-center md:text-left"
                  >
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-brand uppercase mb-4 block">New Collection - Spring 2026</span>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold text-dark leading-[1.1] mb-6">
                      Celebrate Your <br />
                      <span className="text-brand">Ethnic</span> Grace
                    </h1>
                    <p className="text-mid text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0">
                      Handcrafted ethnic wear that honours tradition with a modern touch. For every Indian woman, every occasion.
                    </p>
                    <button onClick={() => setActiveTab("categories")} className="bg-brand text-white px-8 py-4 rounded-sm text-sm font-bold tracking-widest uppercase hover:bg-brand-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-brand/20">
                      Shop Spring Collection
                    </button>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 grid grid-cols-2 gap-3 md:gap-4 h-[300px] md:h-[450px]"
                  >
                    <div className="col-span-2 h-[180px] md:h-[250px]">
                      <img src={products[0]?.img} className="w-full h-full object-cover rounded-sm shadow-xl" alt="Model" />
                    </div>
                    <div className="h-[100px] md:h-[180px]">
                      <img src={products[1]?.img} className="w-full h-full object-cover rounded-sm" alt="Model" />
                    </div>
                    <div className="h-[100px] md:h-[180px]">
                      <img src={products[2]?.img} className="w-full h-full object-cover rounded-sm" alt="Model" />
                    </div>
                  </motion.div>
                </div>
              </section>

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

              {/* Category Banners */}
              <section className="py-16 bg-light">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                   <h2 className="font-serif text-2xl md:text-3xl font-bold mb-10 text-center">Shop By Occasion</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <CategoryCard onClick={() => setActiveTab("categories")} title="Festive Radiance" img="https://byshree.com/cdn/shop/files/FESTIVE_RADIANCE_banner_800_x_640_jpg.jpg?v=1773601929&width=600" />
                      <CategoryCard onClick={() => setActiveTab("categories")} title="Daily Rhythm" img="https://byshree.com/cdn/shop/files/DAILY_RHYTHM_banner_800_x_640_jpg.jpg?v=1773601929&width=600" />
                      <CategoryCard onClick={() => setActiveTab("categories")} title="Glam Soul" img="https://byshree.com/cdn/shop/files/glam_soul_banner_800_x_640_jpg.jpg?v=1773601929&width=600" />
                      <CategoryCard onClick={() => setActiveTab("categories")} title="Free Spirit" img="https://byshree.com/cdn/shop/files/FREE_SPIRIT_banner_W800-x-H640_jpg.jpg?v=1773601930&width=600" />
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
                    <button className="w-full bg-brand text-white py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-all">
                      Proceed To Checkout
                    </button>
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
                    <img src={products[i % products.length]?.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat} />
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
                    <span className="text-sm font-bold">My Orders</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-light rounded hover:bg-brand-light transition-colors">
                    <span className="text-sm font-bold">Settings</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveTab("admin")} className="w-full flex items-center justify-between p-4 bg-brand-light/50 border border-brand/20 rounded hover:bg-brand-light transition-colors">
                    <span className="text-sm font-bold text-brand">Admin Portal</span>
                    <Settings className="w-4 h-4 text-brand" />
                  </button>
               </div>
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 md:py-24 max-w-7xl mx-auto px-4 md:px-8"
            >
              {!isAdminLoggedIn ? (
                <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
              ) : (
                <AdminDashboard 
                  products={products} 
                  setProducts={setProducts} 
                  orders={MOCK_ORDERS}
                  onLogout={() => setIsAdminLoggedIn(false)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-[#a09080] pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl font-bold text-white mb-4 block">શ્રી હરિ</span>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Shri Hari — She Is Special. Celebrating Indian women through exquisite ethnic wear since our founding. Present in 5 countries.
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
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === "ShreeHari" && password === "Pranshi@171") {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-sm border border-border shadow-sm">
      <div className="text-center mb-8">
        <span className="font-serif text-3xl font-bold text-brand block mb-2">Admin Portal</span>
        <p className="text-xs text-mid uppercase tracking-widest">Employee Login Only</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Username</label>
          <input 
            type="text" 
            className="w-full p-3 bg-light border border-border outline-none focus:border-brand transition-colors text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Password</label>
          <input 
            type="password" 
            className="w-full p-3 bg-light border border-border outline-none focus:border-brand transition-colors text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sale text-xs font-medium">{error}</p>}
        <button className="w-full bg-brand text-white py-4 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-brand-dark transition-all mt-4">
          Authenticate
        </button>
      </form>
    </div>
  );
}

function AdminDashboard({ products, setProducts, orders, onLogout }: { products: any[]; setProducts: any; orders: any[]; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("products");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [orderRange, setOrderRange] = useState("Daily");

  // Reporting Calculations
  const inventoryReport = {
    remaining: products.reduce((sum, p) => sum + (p.stock || 0), 0),
    sold: products.reduce((sum, p) => sum + (p.sold || 0), 0),
    buyValue: products.reduce((sum, p) => sum + ((p.buyPrice || 0) * ((p.stock || 0) + (p.sold || 0))), 0),
    sellValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.sold || 0)), 0),
    totalCostOfGoodsSold: products.reduce((sum, p) => sum + ((p.buyPrice || 0) * (p.sold || 0)), 0),
  };
  const profitLoss = inventoryReport.sellValue - inventoryReport.totalCostOfGoodsSold;

  const handleUpdate = (id: number) => {
    setProducts((prev: any[]) => prev.map(p => 
      p.id === id ? { ...p, price: parseInt(editPrice) || p.price, stock: parseInt(editStock) || p.stock } : p
    ));
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev: any[]) => prev.filter(p => p.id !== id));
    }
  };

  const filteredOrders = orders.filter(o => {
    const orderDate = new Date(o.date);
    const now = new Date();
    if (orderRange === "Daily") return orderDate > new Date(now.setDate(now.getDate() - 1));
    if (orderRange === "Weekly") return orderDate > new Date(now.setDate(now.getDate() - 7));
    if (orderRange === "Monthly") return orderDate > new Date(now.setMonth(now.getMonth() - 1));
    return true;
  });

  return (
    <div className="text-left">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand" /> Admin Dashboard
          </h2>
          <p className="text-mid text-sm mt-1">Manage your store operations, inventory, and reports.</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-sale font-bold text-xs uppercase tracking-widest bg-sale/5 px-4 py-2 hover:bg-sale/10 transition-all rounded-sm border border-sale/10">
          <LogOut className="w-4 h-4" /> End Session
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-12 border-b border-border pb-6">
        <button 
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'products' ? 'bg-brand text-white shadow-lg' : 'bg-light text-mid hover:bg-brand-light'}`}
        >
          <Package className="w-4 h-4" /> Products
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'orders' ? 'bg-brand text-white shadow-lg' : 'bg-light text-mid hover:bg-brand-light'}`}
        >
          <FileText className="w-4 h-4" /> Order Details
        </button>
        <button 
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'inventory' ? 'bg-brand text-white shadow-lg' : 'bg-light text-mid hover:bg-brand-light'}`}
        >
          <TrendingUp className="w-4 h-4" /> Stock & Revenue
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" && (
          <motion.div 
            key="p-mgmt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-light p-4 rounded-sm border border-border">
              <span className="text-sm font-bold">{products.length} Products listed</span>
              <button className="bg-brand text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-light border-y border-border">
                  <tr>
                    <th className="p-4 text-left text-[10px] uppercase font-bold text-mid tracking-widest">Product</th>
                    <th className="p-4 text-left text-[10px] uppercase font-bold text-mid tracking-widest">Price (₹)</th>
                    <th className="p-4 text-left text-[10px] uppercase font-bold text-mid tracking-widest">Stock</th>
                    <th className="p-4 text-center text-[10px] uppercase font-bold text-mid tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-brand-light/20">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={p.img} className="w-12 h-16 object-cover rounded-sm border border-border shadow-sm" />
                          <span className="text-sm font-medium line-clamp-1 max-w-[200px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {editingId === p.id ? (
                          <input 
                            type="number" 
                            className="w-24 p-1 border border-brand outline-none text-sm" 
                            value={editPrice}
                            placeholder={p.price.toString()}
                            onChange={(e) => setEditPrice(e.target.value)}
                          />
                        ) : (
                          <span className="text-sm font-bold">₹{p.price}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === p.id ? (
                          <input 
                            type="number" 
                            className="w-20 p-1 border border-brand outline-none text-sm" 
                            value={editStock}
                            placeholder={p.stock.toString()}
                            onChange={(e) => setEditStock(e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${p.stock < 15 ? 'text-sale' : ''}`}>{p.stock}</span>
                            {p.stock < 15 && <span className="bg-sale/10 text-sale text-[8px] font-bold px-1 rounded uppercase tracking-tighter">Low</span>}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          {editingId === p.id ? (
                            <button onClick={() => handleUpdate(p.id)} className="text-brand font-bold text-[10px] uppercase underline">Save</button>
                          ) : (
                            <button onClick={() => { setEditingId(p.id); setEditPrice(p.price.toString()); setEditStock(p.stock.toString()); }} className="text-mid hover:text-brand transition-colors"><BarChart2 className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => handleDelete(p.id)} className="text-mid hover:text-sale transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div 
            key="o-mgmt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center bg-light p-6 rounded-sm border border-border gap-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-brand" />
                <h3 className="font-bold">Order Details & Tracking</h3>
              </div>
              <div className="flex bg-white rounded-full p-1 border border-border shadow-sm">
                {["Daily", "Weekly", "Monthly"].map(range => (
                  <button 
                    key={range}
                    onClick={() => setOrderRange(range)}
                    className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${orderRange === range ? 'bg-brand text-white' : 'text-mid hover:bg-brand-light'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.length > 0 ? filteredOrders.map(o => (
                <div key={o.id} className="bg-white border border-border p-4 rounded-sm flex items-center justify-between hover:border-brand transition-all shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-light rounded-full flex items-center justify-center font-bold text-brand text-[10px]">#ORD</div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-mid block uppercase tracking-tighter">{o.id}</span>
                      <span className="text-xs text-mid">{new Date(o.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-12 items-center">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-mid block uppercase tracking-tighter">Amount</span>
                      <span className="text-sm font-bold">₹{o.total}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-brand-light text-brand'}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-border rounded-sm text-mid italic">No orders found for this period.</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "inventory" && (
          <motion.div 
            key="i-mgmt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ReportStat label="Stock Remaining" value={inventoryReport.remaining} icon={<Package className="w-5 h-5" />} />
              <ReportStat label="Units Sold" value={inventoryReport.sold} icon={<TrendingUp className="w-5 h-5" />} />
              <ReportStat label="Total Buy Value" value={`₹${inventoryReport.buyValue.toLocaleString()}`} icon={<ShoppingBag className="w-5 h-5" />} />
              <ReportStat label="Gross Sell Value" value={`₹${inventoryReport.sellValue.toLocaleString()}`} icon={<BarChart2 className="w-5 h-5" />} />
              <ReportStat 
                label={profitLoss >= 0 ? "Potential Profit" : "Current Loss"} 
                value={`₹${Math.abs(profitLoss).toLocaleString()}`} 
                color={profitLoss >= 0 ? "text-green-600" : "text-sale"}
                icon={<TrendingUp className={`w-5 h-5 ${profitLoss >= 0 ? 'text-green-600' : 'text-sale'}`} />}
              />
            </div>

            <div className="bg-dark p-8 rounded-sm text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><TrendingUp className="w-40 h-40" /></div>
               <div className="relative z-10">
                 <h3 className="text-xs font-bold uppercase tracking-[.3em] text-gold mb-8">Performance Summary</h3>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                      <span className="text-[10px] text-[#a09080] block mb-2 font-bold uppercase">ROI Estimated</span>
                      <span className="text-2xl font-serif font-bold text-white">{((profitLoss / inventoryReport.buyValue) * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#a09080] block mb-2 font-bold uppercase">Inventory Turnover</span>
                      <span className="text-2xl font-serif font-bold text-white">{(inventoryReport.sold / products.length).toFixed(1)}x</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#a09080] block mb-2 font-bold uppercase">Average Order Value</span>
                      <span className="text-2xl font-serif font-bold text-white">₹{(inventoryReport.sellValue / inventoryReport.sold).toFixed(0)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#a09080] block mb-2 font-bold uppercase">Total Revenue</span>
                      <span className="text-2xl font-serif font-bold text-gold">₹{inventoryReport.sellValue.toLocaleString()}</span>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportStat({ label, value, icon, color = "text-dark" }: { label: string; value: any; icon: React.ReactNode; color?: string }) {
  return (
    <div className="bg-white border border-border p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-light rounded text-mid">{icon}</div>
        <span className="text-[10px] font-bold text-mid uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-2xl font-serif font-bold ${color}`}>{value}</span>
    </div>
  );
}

function NavLink({ children, className = "", id, onClick }: { children: React.ReactNode; className?: string; id?: string; onClick?: (e: MouseEvent) => void }) {
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

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart }: { key?: any; product: any; isWishlisted: boolean; onToggleWishlist: (id: number) => void; onAddToCart: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-light mb-4">
        <img 
          src={product.img} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          alt={product.name} 
        />
        <div className="absolute top-2 left-2 bg-sale text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
          -{product.discount}%
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }} 
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-dark font-bold text-[10px] uppercase py-3 rounded-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          Add To Bag
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-brand text-white shadow-lg' : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/30'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
      <h3 className="text-[11px] md:text-sm font-medium text-dark line-clamp-1 mb-1">{product.name}</h3>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-sm">₹{product.price}</span>
        <span className="text-mid/50 text-[10px] line-through">₹{product.origPrice}</span>
      </div>
    </motion.div>
  );
}

function CategoryCard({ title, img, onClick }: { title: string; img: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="relative h-48 md:h-64 group overflow-hidden rounded-sm cursor-pointer shadow-lg">
      <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-6">
        <h3 className="text-white font-serif text-lg font-bold mb-2">{title}</h3>
        <div className="flex items-center text-white/80 text-[10px] font-bold uppercase tracking-widest gap-2 group-hover:text-white transition-colors">
          Shop Now <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
