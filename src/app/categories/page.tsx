"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Category } from "@/types";
import { categoryService } from "@/services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-tolid-charcoal">تسوق حسب الفئة</h1>
        <p className="text-tolid-charcoal/70 text-lg">تصفح مجموعات المنتجات حسب الفئات</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?category=${category.id}`}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full border-2 border-tolid-light-gold hover:border-tolid-gold bg-white">
              <CardHeader className="text-center pb-4">
                <CardTitle className="group-hover:text-tolid-red transition-colors text-tolid-charcoal text-xl">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {category.description && (
                  <p className="text-tolid-charcoal/70 mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                )}
                <div className="inline-flex items-center justify-center px-4 py-2 bg-tolid-gold text-white rounded-full text-sm font-bold shadow-md">
                  {category.productCount} منتجات
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-tolid-charcoal">فئات شائعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <div className="group p-4 text-center border-2 border-tolid-light-gold rounded-lg hover:bg-tolid-light-gold hover:border-tolid-gold transition-all duration-300 shadow-sm hover:shadow-md">
                <h3 className="font-medium text-sm group-hover:text-tolid-red transition-colors text-tolid-charcoal">
                  {category.name}
                </h3>
                <p className="text-xs text-tolid-charcoal/70 mt-1">{category.productCount} منتج</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gradient-to-r from-tolid-light-gold to-tolid-gold/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-tolid-charcoal">لا تجد ما تبحث عنه؟</h2>
        <p className="text-tolid-charcoal/70 mb-6 max-w-2xl mx-auto">استخدم البحث للعثور على منتجات محددة أو تصفح جميع المنتجات.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-6 py-3 bg-tolid-red text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            بحث عن المنتجات
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-tolid-gold bg-white text-tolid-gold hover:bg-tolid-gold hover:text-white rounded-lg transition-all duration-300 font-semibold"
          >
            عرض جميع المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
