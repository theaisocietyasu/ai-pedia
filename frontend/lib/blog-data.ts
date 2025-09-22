import type { BlogPost, BlogCategory } from "./types"

// blog categories
export const blogCategories: BlogCategory[] = [
  {
    id: "ml-fundamentals",
    name: "ML Fundamentals",
    slug: "ml-fundamentals",
    description: "Core concepts and foundations of machine learning",
    color: "var(--gradient-primary)"
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    slug: "deep-learning", 
    description: "Neural networks, architectures, and advanced techniques",
    color: "var(--gradient-secondary)"
  },
  {
    id: "computer-vision",
    name: "Computer Vision",
    slug: "computer-vision",
    description: "Image processing, object detection, and visual AI",
    color: "var(--gradient-accent)"
  },
  {
    id: "nlp",
    name: "Natural Language Processing",
    slug: "nlp",
    description: "Text analysis, language models, and conversational AI",
    color: "var(--gradient-primary)"
  },
  {
    id: "tutorials",
    name: "Tutorials",
    slug: "tutorials",
    description: "Step-by-step guides and hands-on projects",
    color: "var(--gradient-secondary)"
  }
]

// sample blog posts
export const blogPosts: BlogPost[] = [
  {
    id: "understanding-neural-networks",
    title: "Understanding Neural Networks: From Perceptrons to Deep Learning",
    excerpt: "Dive deep into the world of neural networks and discover how these powerful algorithms learn to recognize patterns and make predictions.",
    author: "Dr. Sarah Chen",
    authorImage: "/authors/sarah-chen.jpg",
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
        "Neural networks are one of the most fascinating and powerful tools in artificial intelligence. Inspired by the biological neural networks in our brains, these computational models have revolutionized how we approach complex problems in machine learning.",
        {
          "introduction": "At their core, neural networks are mathematical models designed to recognize patterns in data. They consist of interconnected nodes (neurons) that process information and learn from examples."
        },
        "The journey of neural networks began with the simple perceptron, a single-layer network that could solve linearly separable problems. While limited, perceptrons laid the groundwork for more sophisticated architectures.",
        "Modern deep learning networks contain multiple hidden layers, each learning increasingly complex features. This depth allows them to tackle problems that were previously impossible to solve with traditional machine learning approaches.",
        "Training these networks involves adjusting millions of parameters through backpropagation, a process that iteratively improves the network's performance on a given task."
      ],
      images: [
        "/blog/neural-network-diagram.png",
        "/blog/perceptron-visualization.png",
        "/blog/deep-network-architecture.png"
      ],
      visualization: "NeuralNetworkVisualization"
    }
  },
  {
    id: "computer-vision-object-detection",
    title: "Computer Vision Revolution: How Object Detection Changed Everything",
    excerpt: "Explore the evolution of object detection algorithms and see how modern computer vision systems can identify and locate objects in real-time.",
    author: "Alex Rodriguez",
    authorImage: "/authors/alex-rodriguez.jpg",
    publishDate: "2025-01-12",
    readTime: "6 min read",
    category: "Computer Vision",
    tags: ["Object Detection", "YOLO", "Computer Vision", "CNN"],
    featuredImage: "/blog/ai.jpg",
    slug: "computer-vision-object-detection",
    content: {
      type: "markdown",
      htmlReadMe: `# Computer Vision Revolution: How Object Detection Changed Everything

## The Dawn of Computer Vision

Computer vision has transformed from a theoretical concept to a practical technology that powers everything from autonomous vehicles to medical imaging. At the heart of this revolution lies object detection - the ability to identify and locate objects within images.

## Early Approaches: Template Matching

The earliest computer vision systems relied on template matching and simple feature extraction. These methods were:
- Computationally expensive
- Limited to specific viewing angles
- Sensitive to lighting conditions
- Unable to handle object variations

## The CNN Revolution

The introduction of Convolutional Neural Networks (CNNs) marked a turning point in computer vision:

### Key Advantages:
- **Translation Invariance**: Objects can be detected regardless of their position
- **Feature Learning**: Automatic extraction of relevant features
- **Hierarchical Processing**: Complex features built from simple ones

## Modern Object Detection Architectures

### YOLO (You Only Look Once)
YOLO revolutionized object detection by treating it as a single regression problem:
- Real-time performance
- End-to-end training
- Excellent accuracy-speed trade-off

### R-CNN Family
Region-based CNNs introduced a two-stage approach:
1. Region proposal generation
2. Object classification and refinement

## Real-World Applications

Object detection has enabled breakthrough applications:
- **Autonomous Vehicles**: Real-time detection of pedestrians, vehicles, and obstacles
- **Medical Imaging**: Tumor detection and medical diagnosis
- **Security Systems**: Automated surveillance and threat detection
- **Retail**: Inventory management and cashier-less stores

## The Future of Object Detection

As we look ahead, several trends are shaping the future:
- **Edge Computing**: Real-time detection on mobile devices
- **3D Object Detection**: Understanding spatial relationships
- **Multi-Modal Fusion**: Combining vision with other sensors
`,
      visualization: "ObjectDetectionDemo"
    }
  },
  {
    id: "natural-language-processing-transformers",
    title: "The Transformer Architecture: Revolutionizing Natural Language Processing",
    excerpt: "Discover how the Transformer architecture changed NLP forever and learn about the attention mechanism that makes it so powerful.",
    author: "Prof. Michael Zhang",
    authorImage: "/authors/michael-zhang.jpg",
    publishDate: "2025-01-10",
    readTime: "10 min read",
    category: "Natural Language Processing",
    tags: ["Transformers", "Attention", "BERT", "GPT", "NLP"],
    featuredImage: "/blog/ai.jpg",
    slug: "natural-language-processing-transformers",
    content: {
      type: "structured",
      headings: [
        "The Pre-Transformer Era",
        "Introduction to Transformers",
        "Understanding Self-Attention",
        "Multi-Head Attention Mechanism",
        "Positional Encoding",
        "Applications and Impact"
      ],
      paragraphs: [
        "Before Transformers, natural language processing relied heavily on recurrent neural networks (RNNs) and Long Short-Term Memory (LSTM) networks. While these architectures achieved remarkable results, they had significant limitations in processing long sequences and parallel computation.",
        {
          "key_innovation": "The Transformer architecture, introduced in the paper 'Attention Is All You Need', revolutionized NLP by eliminating recurrence entirely and relying solely on attention mechanisms."
        },
        "At the heart of the Transformer lies the self-attention mechanism. This allows the model to weigh the importance of different words in a sequence when processing each word, enabling it to capture long-range dependencies more effectively than previous architectures.",
        "Multi-head attention extends this concept by allowing the model to attend to information from different representation subspaces simultaneously. This parallel processing capability significantly improves the model's ability to understand complex relationships in text.",
        "Since Transformers don't have inherent sequence ordering like RNNs, positional encoding is added to input embeddings to provide information about the position of words in the sequence.",
        "The impact of Transformers on NLP has been profound, leading to breakthrough models like BERT, GPT, and T5 that have achieved state-of-the-art results across numerous language understanding tasks."
      ],
      images: [
        "/blog/transformer-architecture.png",
        "/blog/attention-visualization.png",
        "/blog/multi-head-attention.png"
      ],
      visualization: "TransformerVisualization"
    }
  },
  {
    id: "machine-learning-fundamentals-regression",
    title: "Machine Learning Fundamentals: Linear Regression Explained",
    excerpt: "Master the foundations of machine learning with linear regression - the gateway algorithm that introduces key concepts used throughout ML.",
    author: "Emma Thompson",
    authorImage: "/authors/emma-thompson.jpg", 
    publishDate: "2025-01-08",
    readTime: "7 min read",
    category: "ML Fundamentals",
    tags: ["Linear Regression", "Supervised Learning", "Statistics", "Fundamentals"],
    featuredImage: "/blog/ai.jpg",
    slug: "machine-learning-fundamentals-regression",
    content: {
      type: "markdown",
      htmlReadMe: `# Machine Learning Fundamentals: Linear Regression Explained

## Why Start with Linear Regression?

Linear regression might seem simple, but it's the perfect starting point for understanding machine learning. It introduces crucial concepts that appear throughout ML while remaining mathematically tractable and intuitive.

## What is Linear Regression?

Linear regression is a statistical method that models the relationship between a dependent variable and one or more independent variables using a linear equation.

### The Mathematical Foundation

The simplest form of linear regression can be expressed as:

\`\`\`
y = mx + b
\`\`\`

Where:
- \`y\` is the target variable (what we're predicting)
- \`x\` is the input feature
- \`m\` is the slope (weight)
- \`b\` is the y-intercept (bias)

## Key Concepts Introduced

### 1. Supervised Learning
Linear regression is a supervised learning algorithm, meaning it learns from labeled training data to make predictions on new, unseen data.

### 2. Loss Functions
We measure how well our model performs using a loss function. For linear regression, we typically use:
- **Mean Squared Error (MSE)**
- **Mean Absolute Error (MAE)**

### 3. Optimization
Finding the best parameters (slope and intercept) involves optimization techniques like:
- **Gradient Descent**
- **Normal Equation**

## Types of Linear Regression

### Simple Linear Regression
Uses one input feature to predict the target variable.

### Multiple Linear Regression
Uses multiple input features:
\`\`\`
y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
\`\`\`

## Real-World Applications

Linear regression appears in countless applications:
- **Economics**: Predicting house prices based on features
- **Business**: Sales forecasting
- **Science**: Modeling relationships between variables
- **Engineering**: System modeling and control

## Assumptions and Limitations

Linear regression makes several assumptions:
1. **Linearity**: The relationship is linear
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of errors
4. **Normality**: Errors are normally distributed

## Moving Beyond Linear Regression

While simple, linear regression provides the foundation for understanding:
- **Polynomial Regression**: Non-linear relationships
- **Regularization**: Ridge and Lasso regression
- **Logistic Regression**: Classification problems
- **Neural Networks**: Complex non-linear models

Understanding linear regression thoroughly prepares you for these more advanced techniques.
`,
      visualization: "LinearRegressionDemo"
    }
  },
  {
    id: "getting-started-with-tensorflow",
    title: "Getting Started with TensorFlow: Your First Neural Network",
    excerpt: "Build your first neural network from scratch using TensorFlow and learn the essential concepts needed for deep learning development.",
    author: "David Kim",
    authorImage: "/authors/david-kim.jpg",
    publishDate: "2025-01-05",
    readTime: "12 min read", 
    category: "Tutorials",
    tags: ["TensorFlow", "Neural Networks", "Python", "Deep Learning", "Tutorial"],
    featuredImage: "/blog/ai.jpg",
    slug: "getting-started-with-tensorflow",
    content: {
      type: "structured",
      headings: [
        "Setting Up Your Environment",
        "Understanding TensorFlow Basics",
        "Building Your First Model",
        "Training the Neural Network",
        "Evaluating Model Performance",
        "Next Steps and Best Practices"
      ],
      paragraphs: [
        "TensorFlow is Google's open-source machine learning framework that has become the go-to tool for deep learning development. In this tutorial, we'll build a simple neural network to classify handwritten digits, introducing you to the fundamental concepts and workflow of TensorFlow.",
        {
          "installation": "First, install TensorFlow using pip: pip install tensorflow. We'll also need NumPy and Matplotlib for data manipulation and visualization."
        },
        "TensorFlow operates on computational graphs where operations are represented as nodes and data flows through edges. Understanding this concept is crucial for effective TensorFlow development.",
        "We'll create a simple feedforward neural network with an input layer, hidden layer, and output layer. This architecture is perfect for learning the basics while solving a real problem.",
        "Training involves feeding data through the network, calculating loss, and updating weights using backpropagation. TensorFlow handles much of this complexity through its high-level APIs.",
        "After training, we'll evaluate our model's performance on unseen test data and visualize the results to understand how well our network learned to classify digits."
      ],
      images: [
        "/blog/tensorflow-setup.png",
        "/blog/neural-network-architecture.png",
        "/blog/training-progress.png",
        "/blog/model-evaluation.png"
      ],
      visualization: "TensorFlowDemo"
    }
  }
]

// utility functions
export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getBlogsByCategory(category: string): BlogPost[] {
  if (category === "all") return blogPosts
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedBlogs(limit: number = 3): BlogPost[] {
  return blogPosts.slice(0, limit)
}

export function getRelatedBlogs(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPost(currentSlug)
  if (!currentPost) return []
  
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit)
}