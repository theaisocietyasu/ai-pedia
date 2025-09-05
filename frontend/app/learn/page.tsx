"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/ui/gradient-text"

// Categories with their models & model details
// Need to fill body & src placeholders for the remaining models
export const categories = [
  {
    title: "Supervised Learning",
    items: [
      { name: "Linear Regression", slug: "linear-regression", description: "Predicts a continuous output based on input features using a linear relationship.", body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odit quaerat asperiores eius qui quidem molestiae maxime vitae recusandae adipisci autem quisquam nobis sunt facere in quo debitis, aspernatur quos. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati exercitationem quae aliquam totam? Tempora, cupiditate sit assumenda hic ratione veniam laboriosam ipsum obcaecati amet esse quaerat porro reprehenderit, dignissimos id? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos veritatis harum enim pariatur eveniet nostrum quod! Dicta quisquam et sit esse neque odit repellendus nulla debitis, perspiciatis quos cum sed? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat placeat, sed est aut cumque doloribus ipsum aliquid quos culpa quia atque expedita laudantium sint tempore accusamus? Molestias iste asperiores doloribus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis asperiores consectetur recusandae debitis odio nisi, rerum delectus. Placeat ipsum, minima ex, illo impedit non, ipsa ducimus repellat quos voluptatibus deleniti.", src: "/gifs/lr.gif" },
      { name: "Logistic Regression", slug: "logistic-regression", description: "Predicts a binary outcome using a logistic function.", body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odit quaerat asperiores eius qui quidem molestiae maxime vitae recusandae adipisci autem quisquam nobis sunt facere in quo debitis, aspernatur quos. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati exercitationem quae aliquam totam? Tempora, cupiditate sit assumenda hic ratione veniam laboriosam ipsum obcaecati amet esse quaerat porro reprehenderit, dignissimos id? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos veritatis harum enim pariatur eveniet nostrum quod! Dicta quisquam et sit esse neque odit repellendus nulla debitis, perspiciatis quos cum sed? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat placeat, sed est aut cumque doloribus ipsum aliquid quos culpa quia atque expedita laudantium sint tempore accusamus? Molestias iste asperiores doloribus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis asperiores consectetur recusandae debitis odio nisi, rerum delectus. Placeat ipsum, minima ex, illo impedit non, ipsa ducimus repellat quos voluptatibus deleniti.", src: "/gifs/lr.gif" },
    { name: "Decision Trees", slug: "decision-trees", description: "Splits data into branches to make decisions based on features.", body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odit quaerat asperiores eius qui quidem molestiae maxime vitae recusandae adipisci autem quisquam nobis sunt facere in quo debitis, aspernatur quos. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati exercitationem quae aliquam totam? Tempora, cupiditate sit assumenda hic ratione veniam laboriosam ipsum obcaecati amet esse quaerat porro reprehenderit, dignissimos id? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos veritatis harum enim pariatur eveniet nostrum quod! Dicta quisquam et sit esse neque odit repellendus nulla debitis, perspiciatis quos cum sed? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat placeat, sed est aut cumque doloribus ipsum aliquid quos culpa quia atque expedita laudantium sint tempore accusamus? Molestias iste asperiores doloribus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis asperiores consectetur recusandae debitis odio nisi, rerum delectus. Placeat ipsum, minima ex, illo impedit non, ipsa ducimus repellat quos voluptatibus deleniti.", src: "/gifs/lr.gif" },
      { name: "Random Forest", slug: "random-forest", description: "Ensemble of decision trees to improve prediction accuracy.", body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odit quaerat asperiores eius qui quidem molestiae maxime vitae recusandae adipisci autem quisquam nobis sunt facere in quo debitis, aspernatur quos. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati exercitationem quae aliquam totam? Tempora, cupiditate sit assumenda hic ratione veniam laboriosam ipsum obcaecati amet esse quaerat porro reprehenderit, dignissimos id? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos veritatis harum enim pariatur eveniet nostrum quod! Dicta quisquam et sit esse neque odit repellendus nulla debitis, perspiciatis quos cum sed? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat placeat, sed est aut cumque doloribus ipsum aliquid quos culpa quia atque expedita laudantium sint tempore accusamus? Molestias iste asperiores doloribus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis asperiores consectetur recusandae debitis odio nisi, rerum delectus. Placeat ipsum, minima ex, illo impedit non, ipsa ducimus repellat quos voluptatibus deleniti.", src: "/gifs/lr.gif" },
      { name: "Support Vector Machines (SVM)", slug: "svm", description: "Finds the hyperplane that best separates data into classes.", body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odit quaerat asperiores eius qui quidem molestiae maxime vitae recusandae adipisci autem quisquam nobis sunt facere in quo debitis, aspernatur quos. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati exercitationem quae aliquam totam? Tempora, cupiditate sit assumenda hic ratione veniam laboriosam ipsum obcaecati amet esse quaerat porro reprehenderit, dignissimos id? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos veritatis harum enim pariatur eveniet nostrum quod! Dicta quisquam et sit esse neque odit repellendus nulla debitis, perspiciatis quos cum sed? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat placeat, sed est aut cumque doloribus ipsum aliquid quos culpa quia atque expedita laudantium sint tempore accusamus? Molestias iste asperiores doloribus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis asperiores consectetur recusandae debitis odio nisi, rerum delectus. Placeat ipsum, minima ex, illo impedit non, ipsa ducimus repellat quos voluptatibus deleniti.", src: "/gifs/lr.gif" },
      { name: "Gradient Boosting", slug: "gradient-boosting", description: "Boosts weak learners iteratively to form a strong model.", body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odit quaerat asperiores eius qui quidem molestiae maxime vitae recusandae adipisci autem quisquam nobis sunt facere in quo debitis, aspernatur quos. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati exercitationem quae aliquam totam? Tempora, cupiditate sit assumenda hic ratione veniam laboriosam ipsum obcaecati amet esse quaerat porro reprehenderit, dignissimos id? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos veritatis harum enim pariatur eveniet nostrum quod! Dicta quisquam et sit esse neque odit repellendus nulla debitis, perspiciatis quos cum sed? Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat placeat, sed est aut cumque doloribus ipsum aliquid quos culpa quia atque expedita laudantium sint tempore accusamus? Molestias iste asperiores doloribus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis asperiores consectetur recusandae debitis odio nisi, rerum delectus. Placeat ipsum, minima ex, illo impedit non, ipsa ducimus repellat quos voluptatibus deleniti.", src: "/gifs/lr.gif" },
      { name: "AdaBoost", slug: "adaboost", description: "Adaptive boosting algorithm to combine weak classifiers." },
      { name: "XGBoost", slug: "xgboost", description: "Optimized gradient boosting library for performance." },
      { name: "LightGBM", slug: "lightgbm", description: "Gradient boosting framework with faster training speed." },
      { name: "CatBoost", slug: "catboost", description: "Gradient boosting algorithm that handles categorical features." },
      { name: "Ridge Regression", slug: "ridge-regression", description: "Linear regression with L2 regularization." },
      { name: "Lasso Regression", slug: "lasso-regression", description: "Linear regression with L1 regularization for feature selection." },
    ],
  },
  {
    title: "Unsupervised Learning",
    items: [
      { name: "K-Means Clustering", slug: "kmeans", description: "Partitions data into k clusters based on similarity." },
      { name: "Hierarchical Clustering", slug: "hierarchical-clustering", description: "Creates a tree of clusters from data points." },
      { name: "DBSCAN", slug: "dbscan", description: "Density-based clustering for discovering arbitrary-shaped clusters." },
      { name: "Principal Component Analysis (PCA)", slug: "pca", description: "Reduces dimensionality while preserving variance." },
      { name: "t-SNE", slug: "tsne", description: "Non-linear dimensionality reduction for visualization." },
      { name: "UMAP", slug: "umap", description: "Uniform Manifold Approximation for visualization and embedding." },
      { name: "Independent Component Analysis (ICA)", slug: "ica", description: "Separates a multivariate signal into independent sources." },
    ],
  },
  {
    title: "Neural Networks",
    items: [
      { name: "Perceptron", slug: "perceptron", description: "Basic unit of a neural network for binary classification." },
      { name: "Feedforward Neural Net (FFNN)", slug: "ffnn", description: "Layered network where data moves forward only." },
      { name: "Convolutional Neural Net (CNN)", slug: "cnn", description: "Specialized for processing grid-like data like images." },
      { name: "Recurrent Neural Net (RNN)", slug: "rnn", description: "Processes sequential data using feedback loops." },
      { name: "Long Short-Term Memory (LSTM)", slug: "lstm", description: "RNN variant that captures long-term dependencies." },
      { name: "Gated Recurrent Unit (GRU)", slug: "gru", description: "Simpler alternative to LSTM for sequential data." },
      { name: "Autoencoders", slug: "autoencoders", description: "Neural networks for data compression and reconstruction." },
      { name: "Transformer", slug: "transformer", description: "Attention-based architecture for sequence modeling." },
      { name: "Generative Adversarial Networks (GANs)", slug: "gans", description: "Generative models that create realistic data." },
    ],
  },
  {
    title: "Reinforcement Learning",
    items: [
      { name: "Markov Decision Process (MDP)", slug: "mdp", description: "Mathematical framework for modeling decision making." },
      { name: "Q-Learning", slug: "q-learning", description: "Model-free RL algorithm to learn optimal action policies." },
      { name: "Deep Q-Networks (DQN)", slug: "dqn", description: "Combines Q-Learning with deep neural networks." },
      { name: "Policy Gradients", slug: "policy-gradients", description: "Directly learns the policy function for actions." },
      { name: "Actor-Critic Methods", slug: "actor-critic", description: "Combines policy and value-based RL methods." },
      { name: "Proximal Policy Optimization (PPO)", slug: "ppo", description: "Stable and efficient RL algorithm using clipped objectives." },
      { name: "Monte Carlo Methods", slug: "monte-carlo", description: "Estimates value functions by sampling returns." },
    ],
  },
  {
    title: "Dimensionality Reduction",
    items: [
      { name: "PCA", slug: "pca", description: "Reduces feature space dimensionality using linear projections." },
      { name: "t-SNE", slug: "tsne", description: "Visualizes high-dimensional data in 2D/3D space." },
      { name: "UMAP", slug: "umap", description: "Captures local and global structure for embeddings." },
      { name: "LDA (Linear Discriminant Analysis)", slug: "lda", description: "Finds linear combinations of features for class separation." },
    ],
  },
  {
    title: "Ensemble Methods",
    items: [
      { name: "Bagging", slug: "bagging", description: "Bootstrapped aggregation to reduce variance." },
      { name: "Boosting", slug: "boosting", description: "Sequentially trains weak learners to improve performance." },
      { name: "Stacking", slug: "stacking", description: "Combines predictions of multiple models using a meta-model." },
      { name: "Random Forest", slug: "random-forest", description: "Ensemble of decision trees for classification/regression." },
      { name: "Gradient Boosting", slug: "gradient-boosting", description: "Boosting method using gradients to optimize loss." },
    ],
  },
  {
    title: "Advanced Topics",
    items: [
      { name: "Reinforcement Learning", slug: "reinforcement-learning", description: "Advanced techniques for sequential decision-making problems." },
      { name: "GANs", slug: "gans", description: "Generative models that learn to produce realistic data." },
      { name: "Transformers / Attention", slug: "transformers", description: "Attention mechanisms for NLP and sequence modeling." },
      { name: "Graph Neural Networks (GNN)", slug: "gnn", description: "Neural networks designed for graph-structured data." },
      { name: "Self-Supervised Learning", slug: "self-supervised", description: "Learning representations from unlabeled data." },
      { name: "Meta Learning", slug: "meta-learning", description: "Learning to learn across multiple tasks efficiently." },
    ],
  },
]


export default function LearnPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-3 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl text-center gap-5 flex flex-col"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-20 h-20 rounded-2xl gradient-bg shadow-2xl shadow-purple/30 flex items-center justify-center"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            <BookOpen size={40} className="text-white" />
          </motion.div>


          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold"
          >
            <GradientText>Learn, Visualize, & Conquer</GradientText> AI
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-light-gray/80"
          >
            Explore AI algorithms through interactive tutorials, explanations, and visualizations.
          </motion.p>

          {/* Category Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-10 w-full"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-2xl font-semibold">{cat.title}</h2>

                <div className="flex flex-wrap gap-4 justify-center">
                  {cat.items.map((item, index) => (
                    <Link
                      key={index}
                      href={`/learn/${item.slug}`}
                      className="relative group"
                    >
                      {/* Animated gradient border */}
                      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition duration-100 blur-sm"></div>

                      {/* Card */}
                      <div className="relative z-10 glass-effect rounded-lg border border-white/10 h-10 min-w-[150px] text-center cursor-pointer transition-transform duration-300 group-hover:scale-105 flex items-center justify-center px-4">
                        <span className="text-md font-medium text-light-gray/60">{item.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-10"
            >
              <Link href="/">
                <Button
                  variant="outline"
                  icon={<ArrowLeft size={18} />}
                  iconPosition="left"
                  style={{ padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer' }}
                >
                  Back to Home
                </Button>
              </Link>

              <Link href="/waitlist">
                <Button
                  variant="primary"
                  style={{ padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer' }}
                >
                  Join the Waitlist
                </Button>
              </Link>
            </motion.div>

        </motion.div>
      </div>
    </main>
  )
}