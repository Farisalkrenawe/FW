import { Prisma } from "@prisma/client"

// User types
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN"

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// Product types
export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED"

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  comparePrice?: number
  costPrice?: number
  categoryId: string
  brand?: string
  featured: boolean
  status: ProductStatus
  tags: string[]
  specifications?: Record<string, any>
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
  images: ProductImage[]
  category: Category
  inventory?: Inventory
}

export interface ProductImage {
  id: string
  url: string
  altText?: string
  isPrimary: boolean
  sortOrder: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  metaTitle?: string
  metaDescription?: string
}

export interface Inventory {
  id: string
  quantity: number
  reserved: number
  lowStockAlert: number
}

// Order types
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  email: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentMethod: string
  stripePaymentId?: string
  trackingNumber?: string
  notes?: string
  shippingAddress: Address
  billingAddress: Address
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  total: number
  product: Product
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

// Cart types
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  product: Product
}

// Review types
export interface Review {
  id: string
  productId: string
  name: string
  email: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  createdAt: Date
}

// Filter types
export interface ProductFilters {
  category?: string
  brand?: string[]
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  featured?: boolean
  tags?: string[]
  sortBy?: "name" | "price" | "newest" | "popularity"
  sortOrder?: "asc" | "desc"
}

// Pagination types
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}