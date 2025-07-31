import type { Metadata } from 'next/types'

import SearchComponent from '@/components/SearchComponent'
import { Card } from '@/components/ui/card'
import { Search as SearchIcon, Tag, User } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Search Articles</h1>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing stories, insights, and knowledge from our community of writers
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <SearchComponent />
          </div>
        </div>
      </section>

      {/* Search Tips */}
      <section className="py-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Search Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-gray-800 border-gray-700">
                <SearchIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Use Keywords</h3>
                <p className="text-gray-300">
                  Search for specific terms, topics, or technologies you&apos;re interested in
                </p>
              </Card>
              <Card className="p-6 text-center bg-gray-800 border-gray-700">
                <Tag className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Filter by Category</h3>
                <p className="text-gray-300">
                  Use category filters to narrow down your search results
                </p>
              </Card>
              <Card className="p-6 text-center bg-gray-800 border-gray-700">
                <User className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Search by Author</h3>
                <p className="text-gray-300">Find all articles written by your favorite authors</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `BLOG APP Search`,
  }
}
