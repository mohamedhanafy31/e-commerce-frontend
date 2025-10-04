"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Category } from "@/types";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HomeClient({ featuredProducts }: { featuredProducts: Product[] }) {
  const [query, setQuery] = useState("");
  const [topCategories, setTopCategories] = useState<Category[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      window.location.href = `/search?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = "/search";
    }
  };

  // Load top categories for quick navigation
  useState(() => {
    (async () => {
      try {
        const res = await apiClient.get<{ data: { categories: Category[] } }>("/categories");
        const cats = res.data.categories || [];
        setTopCategories(cats.slice(0, 6));
      } catch {
        setTopCategories([]);
      }
    })();
  });

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        className="relative text-center py-12 md:py-16 bg-gradient-to-br from-tolid-light-gold via-white to-tolid-light-gold rounded-2xl mb-12 overflow-hidden"
        variants={itemVariants}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 bg-tolid-red rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-tolid-gold rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-tolid-fresh-green rounded-full"></div>
        </div>
        
        {/* TOLIDO Product Banner */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 opacity-10">
          <div className="flex items-center space-x-2 space-x-reverse bg-white rounded-lg p-3 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-tolid-red to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ت</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-tolid-charcoal">TOLIDO</div>
              <div className="text-xs text-tolid-gold">منتجات مميزة</div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6 text-tolid-charcoal"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            مرحباً بك في <span className="text-tolid-red">متجر السوبر ماركت</span>
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-tolid-charcoal/80 mb-8 max-w-3xl mx-auto leading-relaxed" variants={itemVariants}>
            تسوق بثقة من متجرنا الإلكتروني واستمتع بأفضل المنتجات الطازجة والعروض المميزة
          </motion.p>
          <motion.div className="flex justify-center" variants={itemVariants}>
            <Link href="/products?filter=deals">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-tolid-red hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🎯 تسوق العروض
              </Button>
            </Link>
          </motion.div>
          
          {/* Special Offer Banner - Centered */}
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg">
              <span className="mr-3">🎉</span>
              عروض خاصة - خصم يصل إلى 30% على المنتجات المختارة
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick categories tiles for discovery (live categories) */}
      <motion.section className="mb-12" variants={itemVariants}>
        <div className="flex flex-col items-start mb-6">
          <h2 className="text-2xl font-bold mb-2 text-tolid-charcoal">تصفح بالفئات</h2>
          <Link href="/categories">
            <Button variant="outline" size="sm" className="text-sm border-tolid-gold text-tolid-gold hover:bg-tolid-gold hover:text-white">
              عرض كل الفئات ←
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map((c) => (
            <Link key={c.id} href={`/products?category=${c.id}`} className="group">
              <div className="h-full w-full border-2 border-tolid-light-gold rounded-lg p-4 text-center hover:bg-tolid-light-gold hover:border-tolid-gold transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="font-medium group-hover:text-tolid-red text-tolid-charcoal transition-colors">{c.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section className="mb-12" variants={itemVariants}>
        <div className="flex flex-col items-start mb-6">
          <h2 className="text-3xl font-bold mb-2 text-tolid-charcoal">منتجات مميزة</h2>
          <Link href="/products">
            <Button size="sm" variant="outline" className="text-sm border-tolid-gold text-tolid-gold hover:bg-tolid-gold hover:text-white">
              عرض جميع المنتجات ←
            </Button>
          </Link>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" variants={containerVariants}>
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}


