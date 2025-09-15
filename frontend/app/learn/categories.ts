export const categories = {
  supervised: {
    description: `
**Definition:** A type of machine learning where the model is trained on a labeled dataset — meaning each input has a known correct output.  

**Goal:** Learn the mapping from inputs to outputs for prediction or classification.  

**Examples:** Predicting house prices, spam email detection, medical diagnosis.  

**Key Algorithms:** Linear Regression, Logistic Regression, Decision Trees, Random Forests, Support Vector Machines (SVM), Gradient Boosting.  
    `,
    imgPath: "",
    models: [
      { name: "Linear Regression", description: "Predicts a continuous output based on input features using a linear relationship.", imgPath: "/gifs/lr.gif" },
      { name: "Logistic Regression", description: "Predicts a binary outcome using a logistic function.", imgPath: "/gifs/lr.gif" },
      { name: "Decision Trees", description: "Splits data into branches to make decisions based on features.", imgPath: "/gifs/lr.gif" },
      { name: "Random Forest", description: "Ensemble of decision trees to improve prediction accuracy.", imgPath: "/gifs/lr.gif" },
      { name: "Support Vector Machines", description: "Finds the hyperplane that best separates data into classes.", imgPath: "/gifs/lr.gif" },
      { name: "Gradient Boosting", description: "Boosts weak learners iteratively to form a strong model.", imgPath: "/gifs/lr.gif" },
      { name: "AdaBoost", description: "Adaptive boosting algorithm to combine weak classifiers.", imgPath: "/gifs/lr.gif" },
      { name: "XGBoost", description: "Optimized gradient boosting library for performance.", imgPath: "/gifs/lr.gif" },
      { name: "LightGBM", description: "Gradient boosting framework with faster training speed.", imgPath: "/gifs/lr.gif" },
      { name: "CatBoost", description: "Gradient boosting algorithm that handles categorical features.", imgPath: "/gifs/lr.gif" },
      { name: "Ridge Regression", description: "Linear regression with L2 regularization.", imgPath: "/gifs/lr.gif" },
      { name: "Lasso Regression", description: "Linear regression with L1 regularization for feature selection.", imgPath: "/gifs/lr.gif" },
    ],
  },

  unsupervised: {
    description: `
**Definition:** A type of machine learning where models work on unlabeled data, trying to find hidden structures or groupings without predefined answers.  

**Goal:** Discover patterns, clusters, or reduce dimensions for better understanding of data.  

**Examples:** Customer segmentation, market basket analysis, gene expression analysis.  

**Key Algorithms:** K-Means, Hierarchical Clustering, DBSCAN, PCA, t-SNE, UMAP, ICA.  
    `,
    imgPath: "",
    models: [
      { name: "K-Means Clustering", description: "Partitions data into k clusters based on similarity.", imgPath: "/gifs/lr.gif" },
      { name: "Hierarchical Clustering", description: "Creates a tree of clusters from data points.", imgPath: "/gifs/lr.gif" },
      { name: "DBSCAN", description: "Density-based clustering for discovering arbitrary-shaped clusters.", imgPath: "/gifs/lr.gif" },
      { name: "Principal Component Analysis", description: "Reduces dimensionality while preserving variance.", imgPath: "/gifs/lr.gif" },
      { name: "t-SNE", description: "Non-linear dimensionality reduction for visualization.", imgPath: "/gifs/lr.gif" },
      { name: "UMAP", description: "Uniform Manifold Approximation for visualization and embedding.", imgPath: "/gifs/lr.gif" },
      { name: "Independent Component Analysis", description: "Separates a multivariate signal into independent sources.", imgPath: "/gifs/lr.gif" },
    ],
  },

  reinforcement: {
    description: `
**Definition:** A learning paradigm where an agent interacts with an environment, takes actions, and learns from feedback in the form of rewards or penalties.  

**Goal:** Learn strategies (policies) that maximize long-term cumulative rewards.  

**Examples:** Training AI to play games like Chess or Go, teaching robots to walk, self-driving cars.  

**Key Algorithms:** Markov Decision Process, Q-Learning, Deep Q-Networks (DQN), Policy Gradients, Actor-Critic, PPO, Monte Carlo Methods.  
    `,
    imgPath: "",
    models: [
      { name: "Markov Decision Process", description: "Mathematical framework for modeling decision making.", imgPath: "/gifs/lr.gif" },
      { name: "Q-Learning", description: "Model-free RL algorithm to learn optimal action policies.", imgPath: "/gifs/lr.gif" },
      { name: "Deep Q-Networks", description: "Combines Q-Learning with deep neural networks.", imgPath: "/gifs/lr.gif" },
      { name: "Policy Gradients", description: "Directly learns the policy function for actions.", imgPath: "/gifs/lr.gif" },
      { name: "Actor-Critic Methods", description: "Combines policy and value-based RL methods.", imgPath: "/gifs/lr.gif" },
      { name: "Proximal Policy Optimization", description: "Stable and efficient RL algorithm using clipped objectives.", imgPath: "/gifs/lr.gif" },
      { name: "Monte Carlo Methods", description: "Estimates value functions by sampling returns.", imgPath: "/gifs/lr.gif" },
    ],
  },
};
