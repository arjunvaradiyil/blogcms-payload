import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Heart, ArrowRight } from 'lucide-react'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-gradient-to-br from-background via-background to-muted/20 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold gradient-text">BLOG APP</div>
            <p className="text-muted-foreground max-w-sm">
              Discover amazing stories, insights, and knowledge shared by our community of writers
              and creators.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/posts"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog Posts
              </Link>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Search
              </Link>
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin Panel
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/posts?category=technology"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Technology
              </Link>
              <Link
                href="/posts?category=design"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Design
              </Link>
              <Link
                href="/posts?category=business"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Business
              </Link>
              <Link
                href="/posts?category=tutorials"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Tutorials
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Get notified when we publish new articles and insights.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button size="sm" className="btn-primary">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <span className="text-sm text-muted-foreground">
                © 2024 BLOG APP. All rights reserved.
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>by BLOG APP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
