'use client'

import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import React, { useState, useEffect } from 'react'
import PageClient from './page.client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Search, Filter, BookOpen, Tag, X } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()

        if (data.success) {
          setPosts(data.data.posts)
          setFilteredPosts(data.data.posts)
          setCategories(data.data.categories)
        } else {
          console.error('Failed to fetch posts:', data.error)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.meta?.description &&
            post.meta.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.categories?.some((cat: any) => cat.title === selectedCategory),
      )
    }

    setFilteredPosts(filtered)
  }, [posts, searchQuery, selectedCategory])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading posts...</p>
        </div>
      </div>
    )
  }

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {(searchQuery || selectedCategory) && (
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
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory) && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    Category: {selectedCategory}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No posts found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || selectedCategory
                    ? 'Try adjusting your search terms or filters'
                    : 'No posts have been published yet'}
                </p>
                {(searchQuery || selectedCategory) && (
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.slug}`} className="group">
                    <article className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-700 hover:border-blue-500/30 h-[400px] flex flex-col">
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
                        />
                        {/* Category Badge */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-blue-600/90 text-white">
                              {post.categories[0].title}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Article Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'No date'}
                          </div>
                          {post.authors && post.authors.length > 0 && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.authors[0].name}
                            </div>
                          )}
                        </div>

                        {/* Article Title */}
                        <h3 className="font-semibold text-lg mb-2 text-white flex-1">
                          {post.title}
                        </h3>

                        {/* Article Description */}
                        {post.meta?.description && (
                          <p className="text-gray-300 mb-3 flex-1">{post.meta.description}</p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors">
                            Read Article →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
