import { notFound } from 'next/navigation';
import { NewsArticlePage, newsArticleMetadata } from '@/components/site/pages/NewsArticlePage';
import { NEWS, newsBySlug } from '@/lib/news';

export const dynamicParams = false;

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = newsBySlug((await params).slug);
  return article ? newsArticleMetadata(article, 'en') : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const article = newsBySlug((await params).slug);
  if (!article) notFound();
  return <NewsArticlePage article={article} locale="en" />;
}
