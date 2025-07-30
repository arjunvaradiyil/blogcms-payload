import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const author = searchParams.get('author') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const payload = await getPayload({ config: configPromise })

    // Build search conditions
    const whereConditions: any = {
      _status: {
        equals: 'published',
      },
    }

    // Add search query condition
    if (query) {
      whereConditions.or = [
        {
          title: {
            contains: query,
          },
        },
        {
          'meta.description': {
            contains: query,
          },
        },
        {
          content: {
            contains: query,
          },
        },
      ]
    }

    // Add category filter
    if (category) {
      whereConditions.categories = {
        title: {
          equals: category,
        },
      }
    }

    // Add author filter
    if (author) {
      whereConditions.authors = {
        name: {
          contains: author,
        },
      }
    }

    // Fetch posts with search conditions
    const searchResults = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      page,
      overrideAccess: false,
      where: whereConditions,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        publishedAt: true,
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

    // Get authors for filtering
    const authors = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 100,
      overrideAccess: false,
    })

    return NextResponse.json({
      success: true,
      data: {
        posts: searchResults.docs,
        totalDocs: searchResults.totalDocs,
        totalPages: searchResults.totalPages,
        page: searchResults.page,
        hasNextPage: searchResults.hasNextPage,
        hasPrevPage: searchResults.hasPrevPage,
        categories: categories.docs,
        authors: authors.docs,
        query,
        category,
        author,
      },
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform search',
      },
      { status: 500 },
    )
  }
}
