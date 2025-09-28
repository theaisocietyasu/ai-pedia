import React from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function TestPage() {
    const markdown = `# Understanding Linear Regression: From Theory to Practice

Linear regression is one of the most fundamental and widely used statistical techniques in data science and machine learning. Despite its simplicity, it forms the backbone of many advanced algorithms and provides crucial insights into the relationships between variables.

## What is Linear Regression?

Linear regression is a statistical method that models the relationship between a **dependent variable** (target) and one or more **independent variables** (features) by fitting a linear equation to observed data. The case of one explanatory variable is called *simple linear regression*, while multiple explanatory variables constitute *multiple linear regression*.

> "All models are wrong, but some are useful." - George E.P. Box

This quote perfectly encapsulates the philosophy behind linear regression. While it makes strong assumptions about the data, its interpretability and effectiveness make it an invaluable tool.

## The Mathematical Foundation

### Simple Linear Regression

For simple linear regression, we model the relationship as:

$$y = \\beta_0 + \\beta_1 x + \\epsilon$$

Where:
- $y$ is the dependent variable
- $x$ is the independent variable  
- $\\beta_0$ is the y-intercept
- $\\beta_1$ is the slope coefficient
- $\\epsilon$ is the error term

### Multiple Linear Regression

For multiple variables, the equation extends to:

$$y = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + ... + \\beta_n x_n + \\epsilon$$

In matrix form, this becomes:

$$\\mathbf{y} = \\mathbf{X}\\boldsymbol{\\beta} + \\boldsymbol{\\epsilon}$$

<div id="VZ-linear-equation" data-placeholder="Interactive Linear Equation Visualization"></div>

## Key Assumptions

Linear regression relies on several important assumptions:

1. **Linearity**: The relationship between variables is linear
2. **Independence**: Observations are independent of each other
3. **Homoscedasticity**: Constant variance of residuals
4. **Normality**: Residuals are normally distributed
5. **No multicollinearity**: Independent variables are not highly correlated

### Testing Assumptions

We can test these assumptions using various diagnostic plots and statistical tests:

- **Residual plots** for linearity and homoscedasticity
- **Q-Q plots** for normality
- **Variance Inflation Factor (VIF)** for multicollinearity

<div id="VZ-assumptions-plots" data-placeholder="Diagnostic Plots for Linear Regression Assumptions"></div>

## Implementation in Python

Let's implement linear regression from scratch and using scikit-learn:

### From Scratch Implementation

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split

class LinearRegression:
    def __init__(self):
        self.weights = None
        self.bias = None
    
    def fit(self, X, y):
        # Add bias term
        X_with_bias = np.c_[np.ones(X.shape[0]), X]
        
        # Calculate weights using normal equation
        # θ = (X^T X)^(-1) X^T y
        self.weights = np.linalg.inv(X_with_bias.T @ X_with_bias) @ X_with_bias.T @ y
        self.bias = self.weights[0]
        self.weights = self.weights[1:]
    
    def predict(self, X):
        return X @ self.weights + self.bias
    
    def mse(self, y_true, y_pred):
        return np.mean((y_true - y_pred) ** 2)
    
    def r_squared(self, y_true, y_pred):
        ss_res = np.sum((y_true - y_pred) ** 2)
        ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
        return 1 - (ss_res / ss_tot)
\`\`\`

### Using Scikit-learn

\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Generate sample data
X, y = make_regression(n_samples=100, n_features=1, noise=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse:.2f}")
print(f"R-squared Score: {r2:.2f}")
print(f"Coefficient: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
\`\`\`

<div id="VZ-regression-comparison" data-placeholder="Comparison of From-Scratch vs Scikit-learn Implementation"></div>

## Cost Function and Optimization

Linear regression minimizes the **Mean Squared Error (MSE)** cost function:

$$J(\\beta) = \\frac{1}{2m}\\sum_{i=1}^{m}(h_\\beta(x^{(i)}) - y^{(i)})^2$$

Where:
- $m$ is the number of training examples
- $h_\\beta(x^{(i)}) = \\beta_0 + \\beta_1 x^{(i)}$ is our hypothesis function

### Gradient Descent

We can minimize this cost function using gradient descent:

$$\\beta_j := \\beta_j - \\alpha\\frac{\\partial}{\\partial\\beta_j}J(\\beta)$$

The partial derivatives are:

$$\\frac{\\partial}{\\partial\\beta_0}J(\\beta) = \\frac{1}{m}\\sum_{i=1}^{m}(h_\\beta(x^{(i)}) - y^{(i)})$$

$$\\frac{\\partial}{\\partial\\beta_1}J(\\beta) = \\frac{1}{m}\\sum_{i=1}^{m}(h_\\beta(x^{(i)}) - y^{(i)})x^{(i)}$$

<div id="VZ-gradient-descent" data-placeholder="Interactive Gradient Descent Visualization"></div>

## Model Evaluation Metrics

### Regression Metrics

| Metric | Formula | Interpretation |
|---------|---------|----------------|
| **MSE** | $\\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y_i})^2$ | Average squared difference |
| **RMSE** | $\\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y_i})^2}$ | Same units as target variable |
| **MAE** | $\\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y_i}|$ | Average absolute difference |
| **R²** | $1 - \\frac{SS_{res}}{SS_{tot}}$ | Proportion of variance explained |

### Cross-Validation

\`\`\`python
from sklearn.model_selection import cross_val_score, KFold

# K-Fold Cross-Validation
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X, y, cv=kfold, scoring='r2')

print(f"Cross-validation R² scores: {cv_scores}")
print(f"Mean R² score: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
\`\`\`

<div id="VZ-model-evaluation" data-placeholder="Model Performance Metrics Dashboard"></div>

## Advanced Topics

### Regularization

To prevent overfitting, we can add regularization terms:

#### Ridge Regression (L2)

$$J(\\beta) = \\frac{1}{2m}\\sum_{i=1}^{m}(h_\\beta(x^{(i)}) - y^{(i)})^2 + \\lambda\\sum_{j=1}^{n}\\beta_j^2$$

#### Lasso Regression (L1)

$$J(\\beta) = \\frac{1}{2m}\\sum_{i=1}^{m}(h_\\beta(x^{(i)}) - y^{(i)})^2 + \\lambda\\sum_{j=1}^{n}|\\beta_j|$$

### Feature Engineering

Common feature engineering techniques include:

- **Polynomial features**: $x, x^2, x^3, ...$
- **Interaction terms**: $x_1 \\times x_2$
- **Log transformations**: $\\log(x)$
- **Standardization**: $\\frac{x - \\mu}{\\sigma}$

\`\`\`python
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.pipeline import Pipeline

# Create a pipeline with feature engineering
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('poly', PolynomialFeatures(degree=2)),
    ('regressor', LinearRegression())
])

pipeline.fit(X_train, y_train)
y_pred_pipeline = pipeline.predict(X_test)
\`\`\`

<div id="VZ-regularization-comparison" data-placeholder="Regularization Methods Comparison"></div>

---

## Real-World Example: Housing Price Prediction

Let's apply linear regression to predict housing prices using the California Housing dataset:

\`\`\`python
import pandas as pd
from sklearn.datasets import fetch_california_housing

# Load the dataset
housing = fetch_california_housing()
X, y = housing.data, housing.target

# Create DataFrame for easier manipulation
df = pd.DataFrame(X, columns=housing.feature_names)
df['price'] = y

# Display basic statistics
print(df.describe())
\`\`\`

### Feature Importance Analysis

\`\`\`python
# Fit the model and examine coefficients
model = LinearRegression()
model.fit(X, y)

# Create feature importance DataFrame
feature_importance = pd.DataFrame({
    'feature': housing.feature_names,
    'coefficient': model.coef_,
    'abs_coefficient': np.abs(model.coef_)
}).sort_values('abs_coefficient', ascending=False)

print(feature_importance)
\`\`\`

<div id="VZ-housing-analysis" data-placeholder="Housing Price Prediction Analysis Dashboard"></div>

## Conclusion

Linear regression remains a cornerstone of statistical modeling and machine learning due to its:

1. **Simplicity** and ease of interpretation
2. **Fast training** and prediction times
3. **No hyperparameter tuning** required for basic version
4. **Good baseline** for more complex models
5. **Statistical insights** into feature relationships

### When to Use Linear Regression

✅ **Use when:**
- Relationship between variables appears linear
- Interpretability is important
- You have sufficient data relative to features
- Assumptions are reasonably met

❌ **Avoid when:**
- Relationships are clearly non-linear
- You have more features than samples
- Severe multicollinearity exists
- Assumptions are severely violated

### Next Steps

To extend your understanding of linear regression:

- Explore **polynomial regression** for non-linear relationships
- Learn about **logistic regression** for classification
- Study **generalized linear models** (GLMs)
- Investigate **neural networks** as universal function approximators

<div id="VZ-learning-path" data-placeholder="Interactive Learning Path Visualization"></div>

---

*This blog post covered the fundamentals of linear regression, from mathematical foundations to practical implementation. The combination of theory and hands-on examples should provide a solid foundation for understanding and applying this essential technique.*

**Further Reading:**
- [Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/) by Hastie, Tibshirani, and Friedman
- [Introduction to Statistical Learning](https://www.statlearning.com/) by James, Witten, Hastie, and Tibshirani
- [Pattern Recognition and Machine Learning](https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/) by Christopher Bishop`;

  return <MarkdownRenderer content={markdown} />;
}
