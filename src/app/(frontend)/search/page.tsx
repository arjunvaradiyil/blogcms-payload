import type { Metadata } from 'next/types'

import { Search } from '@/search/Component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowRight, Search as SearchIcon, Filter, Tag, User } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="hero-gradient py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Search Articles</h1>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing stories, insights, and knowledge from our community of writers
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="mobile-section">
        <div className="mobile-search">
          <div className="flex items-center space-x-4 mb-6">
            <SearchIcon className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Search</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input placeholder="Search articles..." className="mobile-search-input" />
              <Button className="btn-primary">
                <SearchIcon className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Filter by:</span>
              <Badge variant="outline" className="text-white border-gray-600">
                All
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600">
                Technology
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600">
                Business
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Filter by:</span>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Date
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Author
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold">0</span> results
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-6">
              {/* Example search result - this would be populated by actual search */}
              <article className="blog-card blog-card-hover fade-in">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <SearchIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        January 15, 2024
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        Technology
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-3">
                      Getting Started with Modern Web Development
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      Learn the fundamentals of modern web development with this comprehensive
                      guide. We&apos;ll cover everything from HTML and CSS to JavaScript frameworks
                      and deployment strategies.
                    </p>

                    <div className="flex items-center justify-between">
                      <Link href="/posts/getting-started-with-modern-web-development">
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-primary hover:text-primary/80"
                        >
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        John Doe
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* No results state */}
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse our categories
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/posts">
                    <Button className="btn-primary">Browse All Posts</Button>
                  </Link>
                  <Button variant="outline">Clear Search</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Tips */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Search Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <SearchIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Use Keywords</h3>
                <p className="text-muted-foreground">
                  Search for specific terms, topics, or technologies you&apos;re interested in
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Tag className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Filter by Category</h3>
                <p className="text-muted-foreground">
                  Use category filters to narrow down your search results
                </p>
              </Card>
              <Card className="p-6 text-center">
                <User className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Search by Author</h3>
                <p className="text-muted-foreground">
                  Find all articles written by your favorite authors
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Search />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `BLOG APP Search`,
  }
}
