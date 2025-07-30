# 🚀 Deploy Blog CMS to Vercel

This guide will help you deploy your Payload CMS + Next.js blog to Vercel.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be on GitHub (✅ Already done)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Database**: You'll need a MongoDB Atlas cluster

## 🔧 Step 1: Set Up MongoDB Atlas

### Create MongoDB Atlas Cluster:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Set up database access (username/password)
4. Set up network access (allow `0.0.0.0/0` for Vercel)
5. Get your connection string

### Connection String Format:
```
mongodb+srv://username:password@cluster.mongodb.net/blogcms?retryWrites=true&w=majority
```

## 🔧 Step 2: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository: `arjunvaradiyil/blogcms-payload`

2. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

3. **Environment Variables**:
   Add these environment variables in Vercel dashboard:

   ```env
   # Database
   DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/blogcms?retryWrites=true&w=majority
   
   # Payload Secret (generate a random string)
   PAYLOAD_SECRET=your-super-secret-key-here
   
   # Server URL (your Vercel domain)
   SERVER_URL=https://your-app-name.vercel.app
   
   # Optional: Cron Secret for background jobs
   CRON_SECRET=your-cron-secret-here
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URI
   vercel env add PAYLOAD_SECRET
   vercel env add SERVER_URL
   ```

## 🔧 Step 3: Seed Your Database

After deployment, seed your database with sample data:

1. **Visit your admin panel**: `https://your-app-name.vercel.app/admin`
2. **Create admin user** (first time setup)
3. **Seed the database** by visiting: `https://your-app-name.vercel.app/next/seed`

## 🔧 Step 4: Configure Custom Domain (Optional)

1. **Add Domain**:
   - Go to Vercel dashboard
   - Select your project
   - Go to "Settings" → "Domains"
   - Add your custom domain

2. **Update Environment Variables**:
   - Update `SERVER_URL` to your custom domain
   - Redeploy if needed

## 🔧 Step 5: Set Up Automatic Deployments

### GitHub Integration:
- Vercel automatically deploys when you push to `main` branch
- Preview deployments for pull requests

### Manual Deployments:
```bash
vercel --prod
```

## 🔧 Step 6: Monitor and Maintain

### Vercel Dashboard Features:
- **Analytics**: View traffic and performance
- **Functions**: Monitor serverless function logs
- **Edge Network**: Global CDN performance

### Environment Variables Management:
- Add/update variables in Vercel dashboard
- Redeploy automatically when variables change

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Database Connection Issues**:
   - Verify MongoDB Atlas network access
   - Check connection string format
   - Ensure database user has proper permissions

3. **Environment Variables**:
   - Double-check all required variables are set
   - Verify `SERVER_URL` matches your Vercel domain
   - Ensure `PAYLOAD_SECRET` is a strong random string

4. **API Routes Not Working**:
   - Check function timeout settings in `vercel.json`
   - Verify API routes are in correct directory structure
   - Check CORS settings in Payload config

### Performance Optimization:

1. **Image Optimization**:
   - Vercel automatically optimizes images
   - Use Next.js Image component for best results

2. **Caching**:
   - Static pages are automatically cached
   - API routes can be cached with appropriate headers

3. **CDN**:
   - Vercel's edge network provides global CDN
   - Static assets are served from edge locations

## 📊 Monitoring

### Vercel Analytics:
- Real-time performance metrics
- Function execution times
- Error tracking and alerts

### Database Monitoring:
- MongoDB Atlas provides monitoring
- Set up alerts for connection issues
- Monitor database performance

## 🔄 Updates and Maintenance

### Regular Updates:
1. **Dependencies**: Keep packages updated
2. **Security**: Monitor for security updates
3. **Performance**: Monitor and optimize as needed

### Backup Strategy:
1. **Database**: MongoDB Atlas provides automatic backups
2. **Code**: GitHub provides version control
3. **Environment**: Vercel stores environment variables securely

## 🎉 Success!

Your blog CMS is now live on Vercel with:
- ✅ Global CDN for fast loading
- ✅ Automatic deployments from GitHub
- ✅ Serverless functions for API routes
- ✅ Built-in analytics and monitoring
- ✅ Custom domain support
- ✅ SSL certificates included

Visit your deployed site and start creating content! 🚀 