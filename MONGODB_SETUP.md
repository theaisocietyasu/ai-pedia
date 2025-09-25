# MongoDB Setup Guide for ML Visualization Blog System

## 1. MongoDB Atlas Cluster Setup

### Step 1: Access Your Cluster0
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your **Cluster0** 
3. Click **"Connect"** button

### Step 2: Get Connection String
1. Choose **"Connect your application"**
2. Select **"Node.js"** as driver and **"5.5 or later"** as version
3. Copy the connection string, it should look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.<identifier>.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 3: Database and Collection Setup
1. Click **"Browse Collections"** in your Cluster0
2. Create a database named **"ML"**
3. Create a collection named **"blogs"**

## 2. Environment Variables Setup

### For Each Developer:
1. Copy `.env.example` to `.env.local` in the frontend directory:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholders:
   ```env
   # Replace these with your actual values
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.YOUR_IDENTIFIER.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=ML
   MONGODB_COLLECTION_NAME=blogs
   ```

### Important Security Notes:
- ✅ **NEVER** commit `.env.local` to git
- ✅ **NEVER** share credentials in Slack/Discord/Email
- ✅ Each developer should use their own MongoDB Atlas account or shared credentials via secure channels
- ✅ The `.env.local` file is already in `.gitignore`

## 3. Database Schema

The MongoDB documents follow this structure:

```javascript
{
  _id: ObjectId("..."),
  title: "Blog Post Title",
  excerpt: "Short description of the blog post...",
  slug: "blog-post-title", // URL-friendly version
  category: "Deep Learning",
  tags: ["Neural Networks", "Machine Learning", "AI"],
  featuredImage: "/blog/featured-image.jpg",
  publishDate: ISODate("2025-01-15T00:00:00.000Z"),
  readTime: "8 min read",
  author: [
    {
      name: "Dr. Sarah Chen",
      socials: ["https://twitter.com/sarahchen", "https://linkedin.com/in/sarahchen"]
    }
  ],
  content: [
    {
      heading: "Introduction",
      content: "This is the introduction paragraph...",
      images: ["/blog/intro-diagram.png"],
      code_blocks: ["console.log('Hello World')"],
      visualization: ["NeuralNetworkVisualization"]
    },
    {
      heading: "Deep Dive",
      content: "More detailed content here...",
      images: ["/blog/deep-dive.png"],
      code_blocks: [],
      visualization: []
    }
  ],
  createdAt: ISODate("2025-01-15T10:30:00.000Z"),
  updatedAt: ISODate("2025-01-15T10:30:00.000Z")
}
```

## 4. Adding New Blog Posts

### Method 1: Using MongoDB Compass (Recommended)
1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. Navigate to `ML` database → `blogs` collection
4. Click **"ADD DATA"** → **"Insert Document"**
5. Paste your blog document JSON (see sample documents below)

### Method 2: Using MongoDB Atlas Web Interface
1. Go to your Cluster0 → Browse Collections
2. Navigate to `ML` database → `blogs` collection
3. Click **"INSERT DOCUMENT"**
4. Use the JSON editor to add your document

### Method 3: Using MongoDB Shell
```bash
mongosh "YOUR_CONNECTION_STRING"
use ML
db.blogs.insertOne({
  // Your blog document here
})
```

## 5. Sample Documents

See the `SAMPLE_BLOG_DOCUMENTS.json` file for ready-to-use blog documents that match your existing hardcoded data.

## 6. Testing the Connection

Once you've set up your environment variables, you can test the connection by:

1. Starting your Next.js development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Visiting: `http://localhost:3000/api/blogs`
3. You should see a JSON response with your blog data

## 7. Troubleshooting

### Connection Issues:
- ✅ Verify your username/password are correct
- ✅ Ensure your IP address is whitelisted in MongoDB Atlas Network Access
- ✅ Check that the database name is exactly "ML" (case-sensitive)
- ✅ Verify the collection name is exactly "blogs"

### Environment Variable Issues:
- ✅ Ensure `.env.local` is in the frontend directory (not root)
- ✅ Restart your Next.js development server after changing environment variables
- ✅ Check for typos in variable names (they're case-sensitive)

### Data Issues:
- ✅ Ensure document structure matches the schema above
- ✅ Verify all required fields are present
- ✅ Check that dates are in proper ISODate format
- ✅ Ensure the `slug` field is unique for each document

## 8. Team Collaboration

### For Team Lead:
1. Set up the MongoDB cluster and database
2. Share the connection template (without credentials)
3. Provide sample documents
4. Give team members MongoDB Atlas access or share credentials securely

### For Team Members:
1. Get MongoDB Atlas access or secure credentials
2. Copy `.env.example` to `.env.local`
3. Fill in your environment variables
4. Test the connection locally
5. **NEVER** commit `.env.local` or share credentials publicly