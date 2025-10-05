// Migration script to convert legacy blog data to MongoDB format
const fs = require('fs')
const path = require('path')

// Legacy blog data from your current structure
const legacyBlogs = [
  {
    id: "understanding-neural-networks",
    title: "Understanding Neural Networks: From Perceptrons to Deep Learning",
    excerpt: "Dive deep into the world of neural networks and discover how these powerful algorithms learn to recognize patterns and make predictions.",
    author: "Dr. Sarah Chen",
    publishDate: "2025-01-15",
    readTime: "8 min read",
    category: "Deep Learning",
    tags: ["Neural Networks", "Machine Learning", "AI Fundamentals"],
    featuredImage: "/blog/ai.jpg",
    slug: "understanding-neural-networks",
    content: {
      type: "structured",
      headings: [
        "What Are Neural Networks?",
        "The Building Blocks: Perceptrons",
        "From Single Layer to Deep Networks",
        "Training Neural Networks",
        "Real-World Applications"
      ],
      paragraphs: [
        "Neural networks are one of the most fascinating and powerful tools in artificial intelligence.",
        "At their core, neural networks are mathematical models designed to recognize patterns in data.",
        "The journey of neural networks began with the simple perceptron.",
        "Modern deep learning networks contain multiple hidden layers.",
        "Training these networks involves adjusting millions of parameters through backpropagation."
      ],
      images: [
        "/blog/neural-network-diagram.png",
        "/blog/perceptron-visualization.png", 
        "/blog/deep-network-architecture.png"
      ],
      visualization: "NeuralNetworkVisualization"
    }
  }
  // Add more legacy blogs here...
]

function convertLegacyToMongoDB(legacyBlog) {
  // Convert author string to author array
  const author = [{
    name: legacyBlog.author,
    socials: [] // You can manually add social links later
  }]

  // Convert content structure
  let content = []
  
  if (legacyBlog.content.type === 'structured') {
    // Combine headings with paragraphs
    legacyBlog.content.headings?.forEach((heading, index) => {
      const contentBlock = {
        heading: heading,
        content: legacyBlog.content.paragraphs?.[index] || "",
        images: index === 0 ? legacyBlog.content.images || [] : [],
        code_blocks: [],
        visualization: index === 0 && legacyBlog.content.visualization ? [legacyBlog.content.visualization] : []
      }
      content.push(contentBlock)
    })
  } else if (legacyBlog.content.type === 'markdown') {
    // Convert markdown to content blocks
    const lines = legacyBlog.content.htmlReadMe?.split('\n') || []
    let currentBlock = null
    
    lines.forEach(line => {
      if (line.startsWith('## ')) {
        if (currentBlock) content.push(currentBlock)
        currentBlock = {
          heading: line.replace('## ', ''),
          content: "",
          images: [],
          code_blocks: [],
          visualization: []
        }
      } else if (line.trim() && currentBlock) {
        currentBlock.content += line + "\n"
      }
    })
    
    if (currentBlock) content.push(currentBlock)
  }

  // Return MongoDB-compatible document
  return {
    title: legacyBlog.title,
    excerpt: legacyBlog.excerpt,
    slug: legacyBlog.slug,
    category: legacyBlog.category,
    tags: legacyBlog.tags,
    featuredImage: legacyBlog.featuredImage,
    publishDate: new Date(legacyBlog.publishDate).toISOString(),
    readTime: legacyBlog.readTime,
    author: author,
    content: content
  }
}

// Convert all legacy blogs
const mongoDbBlogs = legacyBlogs.map(convertLegacyToMongoDB)

// Write to JSON file
const outputPath = path.join(__dirname, '../../CONVERTED_BLOG_DOCUMENTS.json')
fs.writeFileSync(outputPath, JSON.stringify(mongoDbBlogs, null, 2))

console.log(`✅ Converted ${mongoDbBlogs.length} blogs to MongoDB format`)
console.log(`📁 Output saved to: ${outputPath}`)
console.log(`\n🚀 Next steps:`)
console.log(`1. Review the converted documents in CONVERTED_BLOG_DOCUMENTS.json`)
console.log(`2. Import them to your MongoDB collection using MongoDB Compass or the Atlas web interface`)
console.log(`3. Test your API endpoints at http://localhost:3000/api/blogs`)

module.exports = { convertLegacyToMongoDB }