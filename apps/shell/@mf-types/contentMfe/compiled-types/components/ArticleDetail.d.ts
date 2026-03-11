import { Article } from '../data/articles';
interface ArticleDetailProps {
    article: Article;
    onBack: () => void;
}
export default function ArticleDetail({ article, onBack, }: ArticleDetailProps): import("react/jsx-runtime").JSX.Element;
export {};
