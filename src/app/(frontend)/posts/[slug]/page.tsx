import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { generateMeta } from '@/utilities/generateMeta'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  ArrowLeft,
  Headphones,
  Share2,
  MoreVertical,
  User,
  Calendar,
  Tag,
  Heart,
  BookOpen,
} from 'lucide-react'
import { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
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
})

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
    <div className="min-h-screen bg-gray-900">
      {/* Article Hero */}
      <div
        className="relative h-96 bg-cover bg-center"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Article Meta Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <Link href="/posts">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Headphones className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Article Title */}
        <div className="absolute bottom-16 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
          <div className="flex items-center space-x-4 text-white/90 text-sm">
            <span>
              By{' '}
              {post.authors &&
              post.authors.length > 0 &&
              typeof post.authors[0] === 'object' &&
              'name' in post.authors[0]
                ? post.authors[0].name
                : 'Unknown Author'}
            </span>
            <span>•</span>
            <span>5 Mins Read</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-gray-800 rounded-t-3xl -mt-6 relative z-10 p-6">
        {/* Article Meta */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-gray-300 text-sm">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
            </span>
            {post.categories &&
              post.categories.length > 0 &&
              typeof post.categories[0] === 'object' &&
              'title' in post.categories[0] && (
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {post.categories[0].title}
                </span>
              )}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Article Text */}
        <div className="prose prose-sm max-w-none">
          {post.content && post.content.root && post.content.root.children ? (
            post.content.root.children.map((node: any, index: number) => {
              if (node.type === 'paragraph' && node.children && Array.isArray(node.children)) {
                return (
                  <p key={index} className="text-white leading-relaxed mb-4">
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
                    className={`text-white font-semibold mt-8 mb-4 ${headingLevel === 'h1' ? 'text-2xl' : headingLevel === 'h3' ? 'text-lg' : 'text-xl'}`}
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
              <p className="text-white leading-relaxed mb-4">
                This is the content of your article. The actual content from your database will be
                displayed here.
              </p>
              <p className="text-white leading-relaxed mb-4">
                When you add content through the admin panel, it will appear in this section with
                proper formatting.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.docs.length > 0 && (
        <div className="px-6 py-8 bg-gray-900">
          <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
          <div className="space-y-4">
            {relatedPosts.docs.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/posts/${relatedPost.slug}`} className="block">
                <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
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
