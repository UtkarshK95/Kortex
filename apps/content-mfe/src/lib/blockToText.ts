import { SanityBlock } from '../types/sanity'

export function blockToText(blocks: SanityBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children
        .map((child) => child.text)
        .join('')
    })
    .join('\n\n')
}
