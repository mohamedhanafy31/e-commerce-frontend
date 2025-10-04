"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, Menu, X, User, Globe, LogOut, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import { Category, Product } from "@/types";
import Image from "next/image";
import { ImageService } from "@/services/imageService";
import { formatPrice } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("ar"); // Default to Arabic
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isAuthenticated, admin, logout } = useAuthStore();
  const {
    isAuthenticated: isCustomer,
    customer,
    logout: customerLogout,
  } = useCustomerAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length >= 2) {
      setIsSearching(true);
      try {
        const response = await productService.searchProducts(query.trim(), 5);
        setSearchSuggestions(response.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    window.location.href = `/products/${product.id}`;
  };

  const handleSearchFocus = () => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  useEffect(() => {
    if (showCategories && categories.length === 0) {
      categoryService.getAll().then(setCategories).catch(() => setCategories([]));
    }
  }, [showCategories, categories.length]);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* RTL: Logo on the right (start) with categories button to its right */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setShowCategories(true)}
              className="flex items-center text-sm font-medium transition-colors hover:text-emerald-green text-deep-maroon"
              title="التصنيفات"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-green to-green-800 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">ت</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl lg:text-3xl text-deep-maroon">متجر السوبر ماركت</span>
                <span className="text-xs text-gold font-medium">TOLIDO</span>
              </div>
            </Link>
          </div>

          {/* RTL: Desktop Navigation flows right-to-left */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-emerald-green text-deep-maroon"
            >
              المنتجات
            </Link>
          </nav>

          {/* RTL: Search Bar in center */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 space-x-reverse flex-[0_0_32%] max-w-xl mx-6">
            <div className="relative flex-1" ref={searchRef}>
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold h-4 w-4" />
              <Input
                type="search"
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pr-10 text-right h-10 border-gold focus:border-emerald-green focus:ring-emerald-green"
              />
              
              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-1 bg-ivory border border-warm-sand rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2">
                      <div className="text-xs text-deep-maroon/70 mb-2 px-2">
                        اقتراحات البحث
                      </div>
                      {searchSuggestions.map((product) => (
                        <motion.div
                          key={product.id}
                          className="flex items-center space-x-3 space-x-reverse p-2 hover:bg-warm-sand/30 rounded-md cursor-pointer transition-colors"
                          onClick={() => handleSuggestionClick(product)}
                          whileHover={{ backgroundColor: "rgba(224, 192, 151, 0.3)" }}
                        >
                          <div className="w-12 h-12 relative flex-shrink-0">
                            {product.image_url ? (
                              <Image
                                src={ImageService.resolveProductImageUrl(product.image_url, 'thumbnail') || '/images/placeholder-product.jpg'}
                                alt={product.name}
                                fill
                                className="object-contain rounded-md"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full bg-warm-sand rounded-md flex items-center justify-center">
                                <Package className="h-6 w-6 text-deep-maroon/50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-deep-maroon truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-emerald-green font-bold">
                              {formatPrice(product.price)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div className="border-t border-warm-sand mt-2 pt-2">
                        <button
                          type="submit"
                          className="w-full text-center text-sm text-gold hover:text-emerald-green transition-colors py-1"
                        >
                          عرض جميع النتائج لـ "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* RTL: Right side actions on the left (end) */}
          <div className="flex items-center space-x-8 space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 space-x-reverse"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs">{language === "ar" ? "EN" : "عربي"}</span>
            </Button>

            {/* Cart */}
            <Link href="/cart" className="flex items-center">
              <Button variant="ghost" size="sm" className="relative hover:bg-warm-sand/30">
                <ShoppingCart className="h-5 w-5 ml-2 text-deep-maroon" />
                <span className="hidden md:inline text-deep-maroon">السلة</span>
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-emerald-green text-white text-xs flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Customer quick link */}
            {/* Orders moved under account menu; no separate link */}

            {/* Customer account menu */}
            {isCustomer ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <User className="h-4 w-4 ml-1" />
                  <span className="text-sm hidden md:inline">{customer?.name || 'حسابي'}</span>
                </Button>

                <AnimatePresence>
                  {showAdminMenu && (
                    <motion.div
                      className="absolute left-0 mt-2 w-52 bg-ivory rounded-md shadow-lg border border-warm-sand z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1">
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-2 text-sm text-deep-maroon hover:bg-warm-sand/30"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          طلباتي
                        </Link>
                        <button
                          onClick={async () => {
                            await customerLogout();
                            setShowAdminMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-deep-maroon hover:bg-warm-sand/30"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          تسجيل الخروج
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isAuthenticated ? (
            /* Admin Section */
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <User className="h-4 w-4 ml-1" />
                  <span className="text-sm hidden md:inline">حسابي</span>
                </Button>
                
                <AnimatePresence>
                  {showAdminMenu && (
                    <motion.div
                      className="absolute left-0 mt-2 w-48 bg-ivory rounded-md shadow-lg border border-warm-sand z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1">
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-deep-maroon hover:bg-warm-sand/30"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowAdminMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-deep-maroon hover:bg-warm-sand/30"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                           Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/account/login" className="flex items-center">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="h-5 w-5 ml-2" />
                  <span className="hidden md:inline">تسجيل الدخول</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* RTL: Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2 space-x-reverse">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold h-4 w-4" />
                <Input
                  type="search"
                  placeholder="ابحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right border-gold focus:border-emerald-green focus:ring-emerald-green"
                />
              </div>
                  <Button type="submit" size="sm">
                    بحث
                  </Button>
                </form>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/products"
                    className="text-sm font-medium py-2 px-3 rounded-md hover:bg-accent text-right"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    المنتجات
                  </Link>
                  <Link
                    href="/categories"
                    className="text-sm font-medium py-2 px-3 rounded-md hover:bg-accent text-right"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الفئات
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right sidebar (RTL) - Categories */}
      <AnimatePresence>
        {showCategories && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategories(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 h-screen w-80 bg-ivory z-[61] border-l border-warm-sand shadow-xl flex flex-col"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-warm-sand">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Menu className="h-5 w-5 ml-1 text-deep-maroon" />
                  <span className="font-bold text-deep-maroon">التصنيفات</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowCategories(false)}>
                  <X className="h-5 w-5 text-deep-maroon" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto">
                {categories.length === 0 ? (
                  <div className="text-sm text-deep-maroon/70">لا توجد فئات</div>
                ) : (
                  <ul className="space-y-2">
                    {categories.map((c) => (
                      <li key={c.id}>
                        <Link href={`/products?category=${c.id}`} className="block p-2 rounded hover:bg-warm-sand/30 text-deep-maroon transition-colors" onClick={() => setShowCategories(false)}>
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
