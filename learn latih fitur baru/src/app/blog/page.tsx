'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useClientData } from '@/hooks/use-client-data';
import * as dataApi from '@/lib/hostvoucher-data';

const stripHtml = (html: string) => {
    if (typeof window === 'undefined' || !html) {
        return (html || '').replace(/<[^>]*>?/gm, '');
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

export default function BlogListPage() {
  const { data: articles, loading } = useClientData(dataApi.getBlogPosts);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-12 pb-12">
      <section className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">The HostVoucher Manifesto</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Unfiltered truths and strategic insights on digital dominance. The following is not advice; it is a mandate for those who intend to win.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(articles || []).map((article: any, index: number) => {
              const excerpt = stripHtml(article.content).substring(0, 150) + '...';
              return (
                <Card key={index} className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                   <Link href={`/blog/${article.id}`} passHref>
                      <Image src={article.imageUrl || "https://placehold.co/600x400.png"} alt={article.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={article.imageHint || "blog post"} />
                  </Link>
                  <CardContent className="flex flex-col flex-grow p-6">
                    <h3 className="text-xl font-bold mb-2 flex-grow">
                        <Link href={`/blog/${article.id}`} passHref>
                            {article.title}
                        </Link>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{excerpt}</p>
                    <Link href={`/blog/${article.id}`} passHref>
                        <Button variant="outline" className="mt-auto w-full">
                        Read the Mandate
                        </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
          })}
        </div>
      </section>
    </div>
  );
}
