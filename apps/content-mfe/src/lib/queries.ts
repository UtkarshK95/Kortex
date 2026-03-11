export const articlesQuery = `
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    body,
    category-> {
      _id,
      name,
      slug
    },
    tags,
    author,
    readTime,
    publishedAt
  }
`

export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    excerpt,
    body,
    category-> {
      _id,
      name,
      slug
    },
    tags,
    author,
    readTime,
    publishedAt
  }
`

export const categoriesQuery = `
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description
  }
`
