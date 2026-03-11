export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    category: string;
    tags: string[];
    author: string;
    publishedAt: string;
    readTime: number;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    count: number;
}
export declare const categories: Category[];
export declare const articles: Article[];
