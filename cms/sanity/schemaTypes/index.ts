import { type SchemaTypeDefinition } from 'sanity'
import { article } from './article'
import { category } from './category'

export const schemaTypes: SchemaTypeDefinition[] = [
  article,
  category,
]
