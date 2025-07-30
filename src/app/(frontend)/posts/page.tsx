import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, ArrowRight, Search, Tag, Filter, BookOpen } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
      createdAt: true,
      authors: true,
      heroImage: true,
    },
  })

  // Get categories for filtering
  const categories = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
    overrideAccess: false,
  })

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-5xl font-bold mb-6 text-white">Blog Posts</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our collection of articles, insights, and stories from our community of
              writers
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors bg-gray-700 text-white"
              >
                All Posts
              </Badge>
              {categories.docs.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors border-gray-600 text-white"
                >
                  {category.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <PageRange
              collection="posts"
              currentPage={posts.page}
              limit={12}
              totalDocs={posts.totalDocs}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.docs.map((post, index) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="block">
                <article
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-500/20 cursor-pointer h-[400px] flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4 flex-shrink-0">
                    {post.heroImage &&
                    typeof post.heroImage === 'object' &&
                    'url' in post.heroImage &&
                    post.heroImage.url ? (
                      <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={post.heroImage.url}
                          alt={post.title || 'Blog post'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : post.meta?.image &&
                      typeof post.meta.image === 'object' &&
                      'url' in post.meta.image &&
                      post.meta.image.url ? (
                      <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={post.meta.image.url}
                          alt={post.title || 'Blog post'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-shrink-0">
                    {post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    )}
                    {post.categories &&
                      post.categories.length > 0 &&
                      typeof post.categories[0] === 'object' &&
                      'title' in post.categories[0] && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {post.categories[0].title}
                        </div>
                      )}
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-white flex-1">{post.title}</h3>

                  {post.meta?.description && (
                    <p className="text-gray-300 mb-3 flex-1">{post.meta.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-400 mt-auto">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : 'Recent'}
                      </span>
                      {post.authors &&
                        post.authors.length > 0 &&
                        typeof post.authors[0] === 'object' &&
                        'name' in post.authors[0] && (
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.authors[0].name}
                          </span>
                        )}
                    </div>
                    {post.categories &&
                      post.categories.length > 0 &&
                      typeof post.categories[0] === 'object' &&
                      'title' in post.categories[0] && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {post.categories[0].title}
                        </span>
                      )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            {posts.totalPages > 1 && posts.page && (
              <Pagination page={posts.page} totalPages={posts.totalPages} />
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Get notified when we publish new articles and insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="btn-primary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <PageClient />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `BLOG APP Posts`,
  }
}
