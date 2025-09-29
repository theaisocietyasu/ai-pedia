'use client'
import React, { useState } from 'react';
import { 
  SignedIn, 
  SignedOut,
  SignIn,
} from '@clerk/nextjs'
import { shadesOfPurple, dark } from '@clerk/themes';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function TestPage() {
  const initialMarkdown = `# Understanding Linear Regression: From Theory to Practice

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

![linear regression](https://media.geeksforgeeks.org/wp-content/uploads/20231129130431/11111111.png)

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

## Model Evaluation Metrics

### Regression Metrics

| Metric | Formula | Interpretation |
|---------|---------|----------------|
| **MSE** | $\\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y_i})^2$ | Average squared difference |
| **RMSE** | $\\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y_i})^2}$ | Same units as target variable |
| **MAE** | $\\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y_i}|$ | Average absolute difference |
| **R²** | $1 - \\frac{SS_{res}}{SS_{tot}}$ | Proportion of variance explained |

<div id="VZ-model-evaluation" data-placeholder="Model Performance Metrics Dashboard"></div>

## Interactive Visualizations

Try editing this markdown to see how different elements render:

<div id="VZ-interactive-demo" data-placeholder="Live Markdown Editor Demo"></div>

## Conclusion

Linear regression remains a cornerstone of statistical modeling and machine learning due to its **simplicity** and **interpretability**.

### When to Use Linear Regression

✅ **Use when:**
- Relationship between variables appears linear
- Interpretability is important
- You have sufficient data relative to features

❌ **Avoid when:**
- Relationships are clearly non-linear
- You have more features than samples
- Severe multicollinearity exists`;

  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <div className="min-h-screen bg-background">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <SignIn 
          appearance={{
            theme: shadesOfPurple
          }} 
          routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
        {/* Header/Navbar */}
        <div className="border-b border-gray-800 bg-dark-gray">
          <header className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center w-full">
              {/* Logo or Title */}
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mr-8">
                Markdown Editor & Preview
              </h1>
              {/* Search Bar (if present) */}
              <div className="flex-1 flex items-center">
                {/* Insert search bar here if you have one, e.g. <SearchBar /> */}
                {/* ...existing code... */}
              </div>
            </div>
          </header>
          <p className="text-gray-400 mt-1 px-6">
            Edit markdown on the left and see the live preview on the right
          </p>
        </div>

        {/* Editor Layout */}
        <div className="flex h-[calc(100vh-120px)]">
          {/* Editor Panel */}
          <div className="w-1/2 border-r border-gray-800 bg-dark-gray split-separator">
            <div className="h-full flex flex-col">
              {/* Editor Header */}
              <div className="border-b border-gray-800 px-4 py-2 bg-background">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-300">
                    📝 Markdown Editor
                  </h2>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Lines: {markdown.split('\n').length}</span>
                    <span>Words: {markdown.split(/\s+/).filter(word => word.length > 0).length}</span>
                    <span>Chars: {markdown.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Text Editor */}
              <div className="flex-1 relative editor-container">
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="editor-textarea w-full h-full p-4 text-sm"
                  placeholder={`Type your markdown here...

    Try these examples:
    # Heading
    **bold text**
    *italic text*
    \`inline code\`

    \`\`\`python
    print('code block')
    \`\`\`

    $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$

    <div id="VZ-example" data-placeholder="Your Interactive Viz"></div>`}
                  spellCheck={false}
                />
                
                {/* Editor Guidelines Overlay */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-400 max-w-xs opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
                  <div className="font-medium mb-2 text-blue-purple">✨ Quick Reference</div>
                  <div className="space-y-1 font-mono">
                    <div># Heading 1</div>
                    <div>## Heading 2</div>
                    <div>**bold** *italic*</div>
                    <div>`inline code`</div>
                    <div>```python</div>
                    <div>code block</div>
                    <div>```</div>
                    <div>$$math equation$$</div>
                    <div className="text-purple-300">&lt;div id="VZ-name"&gt;&lt;/div&gt;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-background">
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="border-b border-gray-800 px-4 py-2 bg-dark-gray">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-300">
                    👁️ Live Preview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMarkdown(initialMarkdown)}
                      className="px-3 py-1 text-xs bg-purple/20 text-purple-300 rounded border border-purple/30 hover:bg-purple/30 transition-colors"
                    >
                      🔄 Reset Example
                    </button>
                    <button
                      onClick={() => setMarkdown('')}
                      className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600 transition-colors"
                    >
                      🗑️ Clear All
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto preview-container">
                {markdown.trim() ? (
                  <MarkdownRenderer content={markdown} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center max-w-md">
                      <div className="text-6xl mb-4">📝✨</div>
                      <div className="text-lg mb-2 text-gray-400">No content to preview</div>
                      <div className="text-sm text-gray-500 leading-relaxed">
                        Start typing markdown in the editor to see the live preview.
                        Try headings, code blocks, math equations, and VZ components!
                      </div>
                      <div className="mt-4 p-3 bg-purple/10 border border-purple/20 rounded-lg text-left">
                        <div className="text-xs text-purple-300 font-medium mb-1">💡 Pro Tip:</div>
                        <div className="text-xs text-gray-400">
                          Use the "Reset Example" button to load a full sample with all supported features
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
