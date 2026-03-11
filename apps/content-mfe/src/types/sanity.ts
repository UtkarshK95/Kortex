export interface SanityArticle {
  _id: string
  _createdAt: string
  title: string
  slug: { current: string }
  excerpt: string
  body: SanityBlock[]
  category: {
    _id: string
    name: string
    slug: { current: string }
  }
  tags: string[]
  author: string
  readTime: number
  publishedAt: string
}

export interface SanityBlock {
  _type: string
  _key: string
  style?: string
  children?: SanitySpan[]
  markDefs?: unknown[]
}

export interface SanitySpan {
  _type: string
  _key: string
  text: string
  marks?: string[]
}

export interface SanityCategory {
  _id: string
  name: string
  slug: { current: string }
  description?: string
}
