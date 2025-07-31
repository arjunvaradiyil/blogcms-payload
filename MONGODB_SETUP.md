# Next.js + Payload CMS + MongoDB Setup Guide

## Overview

Your project is already configured with the proper connections between Next.js, Payload CMS, and MongoDB. Here's how it all works together:

## 1. Database Connection

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Sign up for a free account
   - Create a new cluster (free tier is fine)

2. **Configure Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your Vercel IP ranges

4. **Get Connection String**:
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/blogcms?retryWrites=true&w=majority
```

## 2. Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/blogcms?retryWrites=true&w=majority

# Payload Configuration
PAYLOAD_SECRET=your-super-secret-key-here

# Server Configuration
SERVER_URL=http://localhost:3000

# Optional: Cron Secret for background jobs
CRON_SECRET=your-cron-secret-here

# Node Options (for development)
NODE_OPTIONS="--no-deprecation --no-experimental-strip-types"
```

## 3. How the Connection Works

### Payload Configuration (`src/payload.config.ts`)

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  // ... other config
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // ... rest of config
})
```

### Next.js API Routes

Your Payload API is automatically available at:
- Admin Panel: `/admin`
- API Endpoints: `/api/posts`, `/api/pages`, etc.
- GraphQL: `/api/graphql`

### Collections Structure

Your MongoDB collections will be automatically created based on your Payload collections:

- `posts` - Blog posts
- `pages` - Static pages
- `media` - Uploaded files
- `users` - Admin users
- `categories` - Post categories

## 4. Development Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Create Environment File**:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Start Development Server**:
   ```bash
   pnpm dev
   ```

4. **Access Your App**:
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 5. Production Deployment

### Vercel Deployment

1. **Push to GitHub**

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard

3. **Required Environment Variables for Production**:
   ```env
   DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/blogcms?retryWrites=true&w=majority
   PAYLOAD_SECRET=your-super-secret-key-here
   SERVER_URL=https://your-app-name.vercel.app
   ```

## 6. Database Operations

### Seeding Data

After deployment, seed your database:
1. Visit: `https://your-app-name.vercel.app/next/seed`
2. This will create sample posts, pages, and media

### Admin User Creation

1. Visit: `https://your-app-name.vercel.app/admin`
2. Create your first admin user
3. Use this account to manage your content

## 7. API Usage Examples

### Fetch Posts (Server-Side)

```typescript
// In your Next.js pages
import { getPayload } from 'payload'
import config from '../payload.config'

export async function getStaticProps() {
  const payload = await getPayload({ config })
  
  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: {
        equals: 'published'
      }
    }
  })

  return {
    props: {
      posts: posts.docs
    }
  }
}
```

### Fetch Posts (Client-Side)

```typescript
// In your React components
const fetchPosts = async () => {
  const response = await fetch('/api/posts')
  const data = await response.json()
  return data.docs
}
```

## 8. Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Check your MongoDB Atlas network access settings
   - Ensure your IP is whitelisted

2. **Authentication Failed**:
   - Verify your database username and password
   - Check that the user has read/write permissions

3. **Environment Variables Not Loading**:
   - Ensure `.env` file is in the root directory
   - Restart your development server

4. **Payload Admin Not Loading**:
   - Check that `PAYLOAD_SECRET` is set
   - Verify `SERVER_URL` is correct

## 9. Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files to Git
   - Use different secrets for development and production

2. **MongoDB Atlas**:
   - Use strong passwords
   - Restrict network access in production
   - Enable MongoDB Atlas security features

3. **Payload Security**:
   - Use a strong `PAYLOAD_SECRET`
   - Configure proper access control in collections
   - Enable CORS properly

## 10. Performance Optimization

1. **Database Indexing**:
   - Payload automatically creates indexes for common queries
   - Monitor slow queries in MongoDB Atlas

2. **Caching**:
   - Use Next.js ISR (Incremental Static Regeneration)
   - Implement Redis for session storage if needed

3. **Media Optimization**:
   - Payload automatically optimizes images with Sharp
   - Configure proper image sizes in your Media collection

This setup gives you a fully functional headless CMS with Next.js frontend and MongoDB backend! 