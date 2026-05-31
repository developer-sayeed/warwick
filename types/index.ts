import { ObjectId } from 'mongodb'

export interface Product {
  _id?: ObjectId | string
  name: string
  nameAr?: string
  description: string
  descriptionAr?: string
  price: number
  calories: number
  cookTime: number
  category: string
  image: string
  ingredients: string[]
  ingredientsAr?: string[]
  discount?: number
  discountStartsAt?: string
  discountEndsAt?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  _id?: ObjectId | string
  name: string
  nameAr?: string
  slug: string
  order?: number
}

export interface Settings {
  _id?: ObjectId | string
  restaurantName: string
  restaurantNameAr?: string
  logo: string
  favicon?: string
  heroTitle: string
  heroTitleAr?: string
  heroSubtitle: string
  heroSubtitleAr?: string
  heroContent?: string
  heroContentAr?: string
  phone: string
  whatsapp: string
  email: string
  address: string
  addressAr?: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  youtubeUrl?: string
  welcomePopup: {
    enabled: boolean
    title: string
    titleAr?: string
    subtitle: string
    subtitleAr?: string
    discountText: string
    discountTextAr?: string
    codeText: string
    message: string
    messageAr?: string
  }
  dealsCountdown: {
    enabled: boolean
    endDate: string
  }
}

export interface User {
  _id?: ObjectId | string
  email: string
  password: string
  name: string
  role: 'admin' | 'user'
  createdAt?: Date
}

declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id?: string
      role?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    id?: string
  }
}
