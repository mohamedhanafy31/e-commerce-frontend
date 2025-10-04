"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ImageUpload } from "./ImageUpload";
import { productService } from "@/services/productService";
import { ImageService } from "@/services/imageService";
import { Product, Category, Tag, ProductFormData } from "@/types";
import { ImageUploadResponse } from "@/services/imageService";


interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [uploadedImage, setUploadedImage] = useState<ImageUploadResponse | null>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    sku: product?.sku || "",
    stockQuantity: product?.stock_quantity || 0,
    imageUrl: product?.image_url || "",
    categoryIds: product?.categories?.map(c => c.id) || [],
    tagIds: product?.tags?.map(t => t.id) || [],
    isActive: product?.is_active ?? true,
    // SEO fields
    metaTitle: product?.meta_title || "",
    metaDescription: product?.meta_description || "",
    slug: product?.slug || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          productService.getAllCategories(),
          productService.getAllTags()
        ]);
        
        setCategories(categoriesResponse.categories);
        setTags(tagsResponse.tags);
      } catch (err) {
        console.error("Failed to load categories/tags:", err);
        setCategories([]);
        setTags([]);
        setError("Failed to load categories/tags");
      }
    };

    loadData();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    } else if (!/^[A-Z0-9-_]+$/.test(formData.sku)) {
      newErrors.sku = "SKU must contain only uppercase letters, numbers, hyphens, and underscores";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    }

    // Image validation - require uploaded image from Cloudinary only
    if (!uploadedImage) {
      newErrors.imageUrl = "Please upload an image";
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = "At least one category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image upload handlers
  const handleImageUploaded = (image: ImageUploadResponse) => {
    console.log('📤 Image uploaded in ProductForm:', image);
    setUploadedImage(image);
    // Clear any error when image is uploaded
    setErrors(prev => ({ ...prev, imageUrl: "" }));
  };

  const handleImageRemoved = (publicId: string) => {
    console.log('🗑️ Image removed in ProductForm:', publicId);
    setUploadedImage(null);
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload: any = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        price: formData.price,
        sku: formData.sku.trim().toUpperCase(),
        stockQuantity: formData.stockQuantity,
        // Use uploaded Cloudinary image URL only
        imageUrl: uploadedImage?.secure_url || undefined,
        categoryIds: formData.categoryIds,
        tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined,
        isActive: formData.isActive,
        // SEO fields
        metaTitle: formData.metaTitle?.trim() || undefined,
        metaDescription: formData.metaDescription?.trim() || undefined,
        slug: formData.slug?.trim() || undefined,
      };

      if (isEdit && product) {
        await productService.updateProduct(product.id, payload);
      } else {
        await productService.createProduct(payload);
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
    
    if (errors.categoryIds) {
      setErrors(prev => ({ ...prev, categoryIds: "" }));
    }
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEdit ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-sm text-gray-600">
                  {isEdit ? "Update product information" : "Create a new product in your catalog"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <Card>
              <CardContent className="p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    SKU *
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value.toUpperCase())}
                    placeholder="PROD-001"
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price ($) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange("stockQuantity", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.stockQuantity ? "border-red-500" : ""}
                  />
                  {errors.stockQuantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Image <span className="text-red-500">*</span>
                </label>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  onImageRemoved={handleImageRemoved}
                  existingImage={product?.image_url}
                  folder="ecommerce/products"
                  className="mb-4"
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-2">{errors.imageUrl}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
              {errors.categoryIds && (
                <p className="text-red-500 text-sm mt-2">{errors.categoryIds}</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      formData.tagIds.includes(tag.id)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO Meta Data */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Data</CardTitle>
              <p className="text-sm text-gray-600">تحسين محركات البحث للمنتج</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Title (عنوان SEO)
                </label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="عنوان محسن لمحركات البحث (60 حرف أو أقل)"
                  maxLength={60}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle?.length || 0}/60 حرف
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Description (وصف SEO)
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="وصف محسن لمحركات البحث (160 حرف أو أقل)"
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription?.length || 0}/160 حرف
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Slug (رابط المنتج)
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="product-url-slug"
                />
                <div className="text-xs text-gray-500 mt-1">
                  رابط المنتج: /products/{formData.slug || 'product-url-slug'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Product is active and visible to customers</span>
              </label>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
