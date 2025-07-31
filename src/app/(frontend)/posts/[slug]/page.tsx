import type { Metadata } from 'next/types'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { generateMeta } from '@/utilities/generateMeta'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  ArrowRight,
  Search,
  Filter,
  BookOpen,
  Tag,
  User,
  ArrowLeft,
  Headphones,
  Share2,
  MoreVertical,
  Heart,
  Clock,
  Eye,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

const queryPostBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return result.docs?.[0] || null
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const { isEnabled: draft } = await draftMode()
  const url = `/posts/${slug}`

  const post = await queryPostBySlug({ slug })

  if (!post) {
    return <PayloadRedirects url={url} />
  }

  // Fetch related posts from database
  const payload = await getPayload({ config: configPromise })
  const relatedPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 3,
    overrideAccess: false,
    where: {
      _status: {
        equals: 'published',
      },
      slug: {
        not_equals: slug,
      },
    },
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      meta: true,
      publishedAt: true,
      authors: true,
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Modern Hero Section */}
      <div
        className="relative h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            post.heroImage &&
            typeof post.heroImage === 'object' &&
            'url' in post.heroImage &&
            post.heroImage.url
              ? `url('${post.heroImage.url}')`
              : `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')`,
        }}
      >
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

        {/* Glassmorphism Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="flex justify-between items-center">
            <Link href="/posts">
              <Button
                variant="ghost"
                size="sm"
                className="backdrop-blur-md bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="backdrop-blur-md bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <Headphones className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="backdrop-blur-md bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="backdrop-blur-md bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Article Header */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            {post.categories &&
              post.categories.length > 0 &&
              typeof post.categories[0] === 'object' &&
              'title' in post.categories[0] && (
                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  {post.categories[0].title}
                </Badge>
              )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">
                    {post.authors &&
                    post.authors.length > 0 &&
                    typeof post.authors[0] === 'object' &&
                    'name' in post.authors[0]
                      ? post.authors[0].name
                      : 'Unknown Author'}
                  </span>
                </div>
                <span className="hidden sm:block">•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>

              {/* Publication Date */}
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recent'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Content Section */}
      <div className="relative z-10 -mt-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Glassmorphism Content Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Article Actions */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-6 text-white/70 text-sm">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>1.2k views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>8 comments</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Enhanced Article Content */}
            <div className="prose prose-lg max-w-none prose-invert">
              {post.content && post.content.root && post.content.root.children ? (
                post.content.root.children.map((node: any, index: number) => {
                  if (node.type === 'paragraph' && node.children && Array.isArray(node.children)) {
                    return (
                      <p key={index} className="text-white/90 leading-relaxed mb-6 text-lg">
                        {node.children.map((child: any, childIndex: number) => {
                          if (child.type === 'text') {
                            return <span key={childIndex}>{child.text}</span>
                          }
                          return null
                        })}
                      </p>
                    )
                  }
                  if (node.type === 'heading' && node.children && Array.isArray(node.children)) {
                    const headingLevel = node.tag || 'h2'
                    return (
                      <div
                        key={index}
                        className={`text-white font-bold mt-12 mb-6 ${headingLevel === 'h1' ? 'text-3xl' : headingLevel === 'h3' ? 'text-xl' : 'text-2xl'}`}
                      >
                        {node.children.map((child: any, childIndex: number) => {
                          if (child.type === 'text') {
                            return <span key={childIndex}>{child.text}</span>
                          }
                          return null
                        })}
                      </div>
                    )
                  }
                  return null
                })
              ) : (
                <>
                  <p className="text-white/90 leading-relaxed mb-6 text-lg">
                    This is the content of your article. The actual content from your database will
                    be displayed here with beautiful typography and modern styling.
                  </p>
                  <p className="text-white/90 leading-relaxed mb-6 text-lg">
                    When you add content through the admin panel, it will appear in this section
                    with proper formatting and enhanced readability.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Related Articles Section */}
      {relatedPosts.docs.length > 0 && (
        <div className="mt-16 px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.docs.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/posts/${relatedPost.slug}`}
                  className="block group"
                >
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <span>
                            {relatedPost.publishedAt
                              ? new Date(relatedPost.publishedAt).toLocaleDateString()
                              : 'Recent'}
                          </span>
                          {relatedPost.authors &&
                            relatedPost.authors.length > 0 &&
                            typeof relatedPost.authors[0] === 'object' &&
                            'name' in relatedPost.authors[0] && (
                              <span>{relatedPost.authors[0].name}</span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {draft && <LivePreviewListener />}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const post = await queryPostBySlug({ slug })
  return generateMeta({ doc: post })
}
