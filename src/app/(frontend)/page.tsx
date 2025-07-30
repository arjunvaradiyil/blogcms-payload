import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { generateMeta } from '@/utilities/generateMeta'
import { homeStatic } from '@/endpoints/seed/home-static'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { draftMode } from 'next/headers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Search,
  Tag,
  User,
  Menu,
  Heart,
  Share2,
  MoreVertical,
  ArrowLeft,
  Headphones,
} from 'lucide-react'
import { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
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
})

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const url = '/'

  let page = await queryPageBySlug({
    slug: 'home',
  })

  // Remove this code once your website is seeded
  if (!page) {
    page = homeStatic as any
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  // Fetch featured posts
  const payload = await getPayload({ config: configPromise })
  const featuredPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 6,
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

  // Debug: Log the posts to see their order
  console.log(
    'Latest Articles Order:',
    featuredPosts.docs.map((post) => ({
      title: post.title,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
    })),
  )

  const { hero, layout } = page

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <main className="pt-20 pb-20 bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Welcome to BLOG APP</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover amazing stories, insights, and knowledge from our community of writers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/posts">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Posts
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  variant="outline"
                  className="border-2 border-gray-400 text-white hover:bg-gray-700"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Posts from Database */}
        {featuredPosts.docs.length > 0 && (
          <section className="px-4 py-12 bg-gray-900">
            <div className="container mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Articles</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Discover the most recent insights, stories, and knowledge from our community of
                  writers
                </p>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.docs.map((post, index) => (
                  <Link key={post.id} href={`/posts/${post.slug}`} className="group">
                    <article className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-700 hover:border-blue-500/30 h-[500px] flex flex-col">
                      {/* Article Image */}
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                          style={{
                            backgroundImage:
                              post.heroImage &&
                              typeof post.heroImage === 'object' &&
                              'url' in post.heroImage &&
                              post.heroImage.url
                                ? `url('${post.heroImage.url}')`
                                : post.meta?.image &&
                                    typeof post.meta.image === 'object' &&
                                    'url' in post.meta.image &&
                                    post.meta.image.url
                                  ? `url('${post.meta.image.url}')`
                                  : `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')`,
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Category Badge */}
                        {post.categories &&
                          post.categories.length > 0 &&
                          typeof post.categories[0] === 'object' &&
                          'title' in post.categories[0] && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                {post.categories[0].title}
                              </span>
                            </div>
                          )}

                        {/* Read Time */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            5 min read
                          </span>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Article Meta */}
                        <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-300" />
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
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                        </div>

                        {/* Article Title */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors flex-1">
                          {post.title}
                        </h3>

                        {/* Article Description */}
                        {post.meta?.description && (
                          <p className="text-gray-300 mb-4 flex-1">{post.meta.description}</p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors">
                            Read Article →
                          </span>
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <Link href="/posts">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    <BookOpen className="w-5 h-5 mr-2" />
                    View All Articles
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* No Posts Message */}
        {featuredPosts.docs.length === 0 && (
          <section className="px-4 py-12 bg-gray-900">
            <div className="container mx-auto text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Articles Yet</h3>
                <p className="text-gray-400 mb-8">
                  Check back soon for amazing content from our community of writers
                </p>
                <Link href="/admin">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Create Your First Article
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {draft && <LivePreviewListener />}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug: 'home',
  })

  return generateMeta({ doc: page })
}
