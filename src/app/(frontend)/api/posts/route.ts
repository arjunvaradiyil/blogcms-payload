import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [postsData, categoriesData] = await Promise.all([
      payload.find({
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
      }),
      payload.find({
        collection: 'categories',
        depth: 0,
        limit: 100,
        overrideAccess: false,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        posts: postsData.docs,
        categories: categoriesData.docs,
      },
    })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
      },
      { status: 500 },
    )
  }
}
