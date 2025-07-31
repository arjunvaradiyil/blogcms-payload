# Fix Media Upload 500 Error on Vercel

## Problem
You're getting a 500 error when trying to upload media files to your Payload CMS on Vercel:
```
POST https://blogcms-payload.vercel.app/api/media?depth=0&fallback-locale=null 500 (Internal Server Error)
```

## Root Cause
The error occurs because:
1. **Vercel has a read-only file system** in production
2. **Local file storage doesn't work** on serverless platforms
3. **Missing cloud storage configuration** for production

## Solution: Use Vercel Blob Storage

### Step 1: Install Vercel Blob Storage
```bash
pnpm add @payloadcms/storage-vercel-blob
```

### Step 2: Update Payload Configuration

**File: `src/payload.config.ts`**
```typescript
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  // ... other config
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  // ... rest of config
})
```

### Step 3: Update Media Collection

**File: `src/collections/Media.ts`**
```typescript
export const Media: CollectionConfig = {
  // ... other config
  upload: {
    // Remove staticDir - cloud storage will handle this
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      // ... your image sizes
    ],
  },
}
```

### Step 4: Set Up Vercel Blob Storage

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Create Blob Store**:
   ```bash
   vercel blob create
   ```

4. **Get your Blob Token**:
   ```bash
   vercel env pull .env.local
   ```

### Step 5: Environment Variables

Add these to your Vercel environment variables:

```env
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-blob-token-here

# Existing variables
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/blogcms?retryWrites=true&w=majority
PAYLOAD_SECRET=your-super-secret-key-here
SERVER_URL=https://your-app-name.vercel.app
```

### Step 6: Deploy

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Vercel Blob Storage for media uploads"
   git push
   ```

2. **Redeploy on Vercel**:
   - Your changes will auto-deploy if connected to GitHub
   - Or manually deploy: `vercel --prod`

## Alternative Solutions

### Option 2: Use Payload Cloud Storage

If you prefer a different cloud storage solution:

```bash
pnpm add @payloadcms/storage-cloud
```

```typescript
// payload.config.ts
import { cloudStorage } from '@payloadcms/storage-cloud'

export default buildConfig({
  plugins: [
    ...plugins,
    cloudStorage({
      collections: {
        [Media.slug]: {
          prefix: 'media',
          adapter: 's3', // or 'gcs', 'azure'
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
            region: process.env.S3_REGION,
            bucket: process.env.S3_BUCKET,
          },
        },
      },
    }),
  ],
})
```

### Option 3: Use AWS S3

```bash
pnpm add @payloadcms/storage-s3
```

```typescript
// payload.config.ts
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  plugins: [
    ...plugins,
    s3Storage({
      collections: {
        [Media.slug]: {
          prefix: 'media',
          bucket: process.env.S3_BUCKET,
          region: process.env.S3_REGION,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          },
        },
      },
    }),
  ],
})
```

## Testing

After deployment:

1. **Visit your admin panel**: `https://your-app.vercel.app/admin`
2. **Try uploading an image** in the Media collection
3. **Check that the image appears** and is accessible
4. **Verify the image URL** points to Vercel Blob Storage

## Troubleshooting

### Common Issues

1. **"BLOB_READ_WRITE_TOKEN not found"**:
   - Ensure the environment variable is set in Vercel dashboard
   - Redeploy after adding the variable

2. **"Upload still fails"**:
   - Check Vercel function logs in the dashboard
   - Ensure your blob store is properly created
   - Verify the token has correct permissions

3. **"Images not displaying"**:
   - Check that the blob store is publicly accessible
   - Verify the image URLs are correct

4. **"Development vs Production"**:
   - For development, you can keep local storage
   - For production, use cloud storage only

### Environment Variables Checklist

Make sure these are set in Vercel:

- ✅ `DATABASE_URI`
- ✅ `PAYLOAD_SECRET`
- ✅ `SERVER_URL`
- ✅ `BLOB_READ_WRITE_TOKEN`

## Benefits of Vercel Blob Storage

1. **Automatic CDN**: Images are served from edge locations
2. **Scalable**: Handles any amount of media
3. **Cost-effective**: Pay only for what you use
4. **Integrated**: Works seamlessly with Vercel deployments
5. **Secure**: Built-in security and access controls

## Migration from Local Storage

If you have existing media files in your local `public/media` directory:

1. **Backup your files** before deploying
2. **Upload them again** through the admin panel after switching to cloud storage
3. **Update any hardcoded URLs** in your content to use the new cloud URLs

This solution will resolve your 500 error and provide a robust, scalable media storage solution for your Payload CMS! 