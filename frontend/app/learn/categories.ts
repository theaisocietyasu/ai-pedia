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

export const modelData = {
  // ========================
  // SUPERVISED LEARNING
  // ========================
  "linear-regression": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Linear Regression predicts a continuous output based on input features using a straight-line relationship.",
      `\`\`\`python
from sklearn.linear_model import LinearRegression

X = [[1],[2],[3],[4]]
y = [2,4,6,8]

model = LinearRegression().fit(X, y)
print(model.predict([[5]]))
\`\`\``,
      "Visualization shows the best-fit line through the data points."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#LinearRegressionViz"
  },

  "logistic-regression": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Logistic Regression is used for binary classification by applying a sigmoid function to outputs.",
      `\`\`\`python
from sklearn.linear_model import LogisticRegression

X = [[0],[1],[2],[3]]
y = [0,0,1,1]

clf = LogisticRegression().fit(X, y)
print(clf.predict([[1.5]]))
\`\`\``,
      "Visualization shows the S-shaped logistic curve mapping inputs to probabilities."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#LogisticRegressionViz"
  },

  "decision-trees": {
    headings: ["Introduction", "Example", "Visualization"],
    paragraphs: [
      "Decision Trees split the dataset into branches based on feature thresholds.",
      `\`\`\`python
from sklearn.tree import DecisionTreeClassifier

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = DecisionTreeClassifier().fit(X,y)
\`\`\``,
      "Visualization shows how features split into branches and leaves."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#DecisionTreesViz"
  },

  "random-forest": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Random Forest is an ensemble of decision trees, reducing overfitting and improving accuracy.",
      `\`\`\`python
from sklearn.ensemble import RandomForestClassifier

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = RandomForestClassifier(n_estimators=10).fit(X,y)
\`\`\``,
      "Visualization shows multiple trees voting together for predictions."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#RandomForestViz"
  },

  "support-vector-machines": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Support Vector Machines find the optimal hyperplane that separates classes with maximum margin.",
      `\`\`\`python
from sklearn.svm import SVC

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = SVC(kernel="linear").fit(X,y)
\`\`\``,
      "Visualization shows the separating hyperplane with margin support vectors."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#SVMViz"
  },

  "gradient-boosting": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Gradient Boosting builds models sequentially, each correcting the errors of the previous ones.",
      `\`\`\`python
from sklearn.ensemble import GradientBoostingClassifier

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = GradientBoostingClassifier().fit(X,y)
\`\`\``,
      "Visualization shows boosted trees reducing errors step by step."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#GradientBoostingViz"
  },

  "adaboost": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "AdaBoost adaptively boosts weak classifiers by adjusting sample weights.",
      `\`\`\`python
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = AdaBoostClassifier(DecisionTreeClassifier(), n_estimators=50).fit(X,y)
\`\`\``,
      "Visualization shows weighted classifiers combining into a strong learner."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#AdaBoostViz"
  },

  "xgboost": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "XGBoost is an optimized implementation of gradient boosting with high performance.",
      `\`\`\`python
from xgboost import XGBClassifier

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = XGBClassifier().fit(X,y)
\`\`\``,
      "Visualization shows boosted trees built efficiently with pruning and regularization."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#XGBoostViz"
  },

  "lightgbm": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "LightGBM is a gradient boosting framework optimized for speed and efficiency.",
      `\`\`\`python
from lightgbm import LGBMClassifier

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = LGBMClassifier().fit(X,y)
\`\`\``,
      "Visualization shows fast leaf-wise tree growth in LightGBM."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#LightGBMViz"
  },

  "catboost": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "CatBoost is a gradient boosting algorithm with native categorical feature handling.",
      `\`\`\`python
from catboost import CatBoostClassifier

X = [[0,0],[1,1],[0,1],[1,0]]
y = [0,1,1,0]

clf = CatBoostClassifier(iterations=10, verbose=0).fit(X,y)
\`\`\``,
      "Visualization shows how CatBoost handles categorical features efficiently."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#CatBoostViz"
  },

  "ridge-regression": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Ridge Regression adds L2 regularization to linear regression, penalizing large coefficients.",
      `\`\`\`python
from sklearn.linear_model import Ridge

X = [[1],[2],[3],[4]]
y = [2,4,6,8]

model = Ridge(alpha=1.0).fit(X,y)
\`\`\``,
      "Visualization shows coefficients shrunk towards zero compared to ordinary regression."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#RidgeRegressionViz"
  },

  "lasso-regression": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Lasso Regression adds L1 regularization, encouraging sparsity by zeroing out some coefficients.",
      `\`\`\`python
from sklearn.linear_model import Lasso

X = [[1],[2],[3],[4]]
y = [2,4,6,8]

model = Lasso(alpha=0.1).fit(X,y)
\`\`\``,
      "Visualization shows feature selection as coefficients shrink to zero."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#LassoRegressionViz"
  },

  // ========================
  // UNSUPERVISED LEARNING
  // ========================
  "k-means-clustering": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "K-Means partitions data into clusters based on proximity to centroids.",
      `\`\`\`python
from sklearn.cluster import KMeans
import numpy as np

X = np.array([[1,2],[1,4],[10,10],[12,12]])
kmeans = KMeans(n_clusters=2).fit(X)
print(kmeans.labels_)
\`\`\``,
      "Visualization shows clusters and centroids."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#KMeansViz"
  },

  "hierarchical-clustering": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Hierarchical Clustering builds nested clusters in a tree structure (dendrogram).",
      `\`\`\`python
from scipy.cluster.hierarchy import linkage, dendrogram
import numpy as np

X = np.array([[1,2],[1,4],[10,10],[12,12]])
Z = linkage(X, 'ward')
\`\`\``,
      "Visualization shows a dendrogram of nested clusters."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#HierarchicalClusteringViz"
  },

  "dbscan": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "DBSCAN groups points based on density, discovering clusters of arbitrary shape.",
      `\`\`\`python
from sklearn.cluster import DBSCAN
import numpy as np

X = np.array([[1,2],[1,4],[10,10],[12,12]])
db = DBSCAN(eps=3, min_samples=2).fit(X)
print(db.labels_)
\`\`\``,
      "Visualization shows dense clusters and noise points."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#DBSCANViz"
  },

  "principal-component-analysis": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "PCA reduces dimensionality while retaining most variance in data.",
      `\`\`\`python
from sklearn.decomposition import PCA
import numpy as np

X = np.array([[1,2,3],[4,5,6],[7,8,9]])
pca = PCA(n_components=2).fit(X)
\`\`\``,
      "Visualization shows reduced dimensions capturing variance."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#PCAViz"
  },

  "t-sne": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "t-SNE is a non-linear technique for visualizing high-dimensional data in 2D or 3D.",
      `\`\`\`python
from sklearn.manifold import TSNE
import numpy as np

X = np.random.rand(100,50)
X_embedded = TSNE(n_components=2).fit_transform(X)
\`\`\``,
      "Visualization shows clusters in a low-dimensional embedding."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#TSNEViz"
  },

  "umap": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "UMAP is a fast manifold learning technique for dimensionality reduction and visualization.",
      `\`\`\`python
import umap
import numpy as np

X = np.random.rand(100,50)
embedding = umap.UMAP(n_components=2).fit_transform(X)
\`\`\``,
      "Visualization shows 2D embedding preserving local structure."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#UMAPViz"
  },

  "independent-component-analysis": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "ICA separates a multivariate signal into independent components.",
      `\`\`\`python
from sklearn.decomposition import FastICA
import numpy as np

X = np.random.rand(100,3)
ica = FastICA(n_components=2).fit(X)
\`\`\``,
      "Visualization shows signals separated into independent sources."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#ICAViz"
  },

  // ========================
  // REINFORCEMENT LEARNING
  // ========================
  "markov-decision-process": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "MDPs provide a mathematical framework for sequential decision making with states, actions, transitions, and rewards.",
      `\`\`\`python
states = ["s1","s2"]
actions = ["a1","a2"]
transitions = {("s1","a1"):"s2"}
rewards = {("s1","a1"):1}
\`\`\``,
      "Visualization shows a state-transition diagram with rewards."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#MDPViz"
  },

  "q-learning": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Q-Learning learns values for state-action pairs to maximize cumulative reward.",
      `\`\`\`python
import numpy as np

Q = np.zeros((5,2))  # states × actions
alpha, gamma = 0.1, 0.9
# Update: Q[s,a] ← Q[s,a] + α(r + γ max Q[s’,:]-Q[s,a])
\`\`\``,
      "Visualization shows an agent learning in a gridworld."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#QLearningViz"
  },

  "deep-q-networks": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "DQN combines Q-Learning with deep neural networks for high-dimensional state spaces.",
      `\`\`\`python
import torch.nn as nn

class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.fc = nn.Linear(state_dim, action_dim)

    def forward(self, x):
        return self.fc(x)
\`\`\``,
      "Visualization shows a neural network estimating Q-values."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#DQNViz"
  },

  "policy-gradients": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Policy Gradients optimize policies directly using expected rewards as the objective.",
      `\`\`\`python
# Pseudo update rule:
# θ ← θ + α ∇θ log πθ(a|s) * R
\`\`\``,
      "Visualization shows adjusting probabilities of actions in a policy network."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#PolicyGradientsViz"
  },

  "actor-critic-methods": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Actor-Critic combines policy (actor) and value (critic) methods for stable training.",
      `\`\`\`python
# Pseudo:
# Actor updates policy πθ
# Critic updates value function V(s)
\`\`\``,
      "Visualization shows actor choosing actions and critic evaluating them."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#ActorCriticViz"
  },

  "proximal-policy-optimization": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "PPO improves policy gradients with clipped objectives for stability.",
      `\`\`\`python
# Pseudo PPO loss:
# L = min(r(θ)A, clip(r(θ),1-ε,1+ε)A)
\`\`\``,
      "Visualization shows stable policy updates within clipped bounds."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#PPOViz"
  },

  "monte-carlo-methods": {
    headings: ["Introduction", "Code Example", "Visualization"],
    paragraphs: [
      "Monte Carlo methods estimate value functions by averaging returns from sampled episodes.",
      `\`\`\`python
# Pseudo Monte Carlo evaluation:
# V(s) = average of returns observed after s
\`\`\``,
      "Visualization shows averaging returns across trajectories."
    ],
    images: ["/gifs/lr.gif","/gifs/lr.gif","/gifs/lr.gif"],
    visualization: "#MonteCarloViz"
  },
};  
