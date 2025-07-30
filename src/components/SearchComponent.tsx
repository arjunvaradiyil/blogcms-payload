'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Calendar, ArrowRight, Search as SearchIcon, Filter, Tag, User, X } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/utilities/useDebounce'

interface Post {
  id: string
  title: string
  slug: string
  meta?: {
    description?: string
    image?: {
      url?: string
    }
  }
  publishedAt?: string
  authors?: Array<{
    name?: string
  }>
  categories?: Array<{
    title?: string
  }>
  heroImage?: {
    url?: string
  }
}

interface SearchResult {
  posts: Post[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  categories: Array<{ id: string; title: string }>
  authors: Array<{ id: string; name: string }>
  query: string
  category: string
  author: string
}

export default function SearchComponent() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const debouncedQuery = useDebounce(query, 500)

  const performSearch = useCallback(async () => {
    if (!debouncedQuery && !category && !author) {
      setResults(null)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.append('q', debouncedQuery)
      if (category) params.append('category', category)
      if (author) params.append('author', author)
      params.append('limit', '20')

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.data)
      } else {
        console.error('Search failed:', data.error)
        setResults(null)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, category, author])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const clearFilters = () => {
    setQuery('')
    setCategory('')
    setAuthor('')
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search articles by title, content, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-500 transition-colors"
          />
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        {(query || category || author) && (
          <Button
            onClick={clearFilters}
            variant="outline"
            className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {results?.categories.map((cat) => (
                  <option key={cat.id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Authors</option>
                {results?.authors.map((auth) => (
                  <option key={auth.id} value={auth.name}>
                    {auth.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Active Filters */}
      {(query || category || author) && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Query: {query}
              <button onClick={() => setQuery('')} className="ml-2 hover:text-red-300">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              Category: {category}
              <button onClick={() => setCategory('')} className="ml-2 hover:text-red-300">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {author && (
            <Badge variant="secondary" className="bg-purple-600 text-white">
              Author: {author}
              <button onClick={() => setAuthor('')} className="ml-2 hover:text-red-300">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Searching...</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && results && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Search Results ({results.totalDocs} found)
            </h3>
            {results.totalDocs > 0 && (
              <p className="text-gray-400">
                Page {results.page} of {results.totalPages}
              </p>
            )}
          </div>

          {results.posts.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">No results found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or browse our categories
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/posts">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Browse All Posts
                  </Button>
                </Link>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {results.posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-700 hover:border-blue-500/30"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Article Image */}
                    <div className="md:w-1/3">
                      <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center"
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
                        />
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishedAt)}
                        </div>
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {post.categories[0].title}
                          </div>
                        )}
                        {post.authors && post.authors.length > 0 && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.authors[0].name}
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>

                      {post.meta?.description && (
                        <p className="text-gray-300 mb-4 line-clamp-3">{post.meta.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <Link href={`/posts/${post.slug}`}>
                          <Button
                            variant="ghost"
                            className="p-0 h-auto text-blue-400 hover:text-blue-300"
                          >
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!loading && !results && !query && !category && !author && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">Start Searching</h3>
          <p className="text-gray-400 mb-6">
            Enter keywords to find articles, or use filters to narrow down your search
          </p>
        </div>
      )}
    </div>
  )
}
