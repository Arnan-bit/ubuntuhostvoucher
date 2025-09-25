// src/app/blog/[slug]/page.tsx
// This file has been restored and fixed to resolve all build errors.

import { getBlogPosts } from '@/lib/hostvoucher-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, ChevronLeft } from 'lucide-react';

// Simplified and corrected Props definition for build success.
type Props = {
    params: { slug: string };
};

// This function tells Next.js which slugs (blog post IDs) to pre-render.
export async function generateStaticParams() {
    try {
        const posts: any[] = await getBlogPosts();
        if (!Array.isArray(posts)) {
            console.warn("getBlogPosts did not return an array, returning empty for static params.");
            return [];
        }
        return posts.map((post) => ({
            slug: post.id,
        }));
    } catch (error) {
        console.error("Critical error in generateStaticParams for blog:", error);
        return [];
    }
}

// This function generates the metadata for the page.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const posts: any[] = await getBlogPosts();
    const post = posts.find((p) => p.id === params.slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: post.title,
        description: post.content ? post.content.substring(0, 160) : 'Blog post from HostVoucher',
    };
}


// Main component for the blog post page.
export default async function BlogPostPage({ params }: Props) {
    const posts: any[] = await getBlogPosts();
    const post = posts.find((p) => p.id === params.slug);

    if (!post) {
        notFound();
    }
    
    // Ensure createdAt is a Date object
    const postDate = post.createdAt ? new Date(post.createdAt) : null;


    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
                        <ChevronLeft size={20} className="mr-1" />
                        Back to Blog
                    </Link>

                    <article>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center text-slate-400 text-sm mb-6">
                            <Calendar size={16} className="mr-2" />
                            <span>
                                Published on {postDate ? postDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </span>
                        </div>

                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg mb-8"
                            />
                        )}

                        <div
                            className="prose prose-invert lg:prose-xl max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300"
                            dangerouslySetInnerHTML={{ __html: post.content || '' }}
                        />
                    </article>
                </div>
            </main>
        </div>
    );
}
