import { Article } from '../data/articles';
interface ArticleCardProps {
    article: Article;
    onSelect: (slug: string) => void;
}
export default function ArticleCard({ article, onSelect, }: ArticleCardProps): import("react/jsx-runtime").JSX.Element;
export {};
