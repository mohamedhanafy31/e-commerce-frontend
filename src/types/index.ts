// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

// Admin types
export interface Admin {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  admin: Admin;
  token: string;
  expiresAt: string;
}

// Customer types
export interface Customer {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  createdAt: string;
}

// Tag types
export interface Tag {
  id: number;
  name: string;
  productCount: number;
  createdAt: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sku: string;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  categories: CategoryBasic[];
  tags: TagBasic[];
  average_rating?: number;
  created_at: string;
  updated_at: string;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  slug?: string;
}

export interface CategoryBasic {
  id: number;
  name: string;
  description?: string;
}

export interface TagBasic {
  id: number;
  name: string;
}

// Review types
export interface Review {
  id: number;
  productId: number;
  rating: number;
  reviewText?: string;
  reviewerName?: string;
  createdAt: string;
  product?: {
    id: number;
    name: string;
  };
}

// Order types
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  shippingAddress: string;
  shippingMethod: string;
  shippingCost?: number;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

// Analytics types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSold: number;
  revenue: number;
}

export interface CategoryRevenue {
  categoryName: string;
  revenue: number;
  orderCount: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  stockQuantity: number;
  imageUrl?: string;
}

// Cart types (client-side)
export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface TagFormData {
  name: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  sku: string;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  categoryIds: number[];
  tagIds: number[];
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

export interface ReviewFormData {
  productId: number;
  rating: number;
  reviewText?: string;
  reviewerName?: string;
}

export interface OrderFormData {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: string;
  shippingMethod: string;
  shippingCost?: number;
}

// Deprecated types (for backwards compatibility)
export interface PaginatedResponse<T> {
  data: {
    products: T[];
    pagination: PaginationInfo;
  };
}
