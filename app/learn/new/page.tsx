"use client";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { MarkdownUploadForm } from "@/components/MarkdownUploadForm";
import { VisualizationIndicator } from "@/components/VisualizationIndicator";

export default function TestPage() {
  const [mode, setMode] = useState<"preview" | "upload">("preview");
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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
| **MAE** | $\\frac{1}{n}\\sum_{i=1}^{n}\\|y_i - \\hat{y_i}\\|$ | Average absolute difference |
| **R²** | $1 - \\frac{SS_{res}}{SS_{tot}}$ | Proportion of variance explained |

<div id="VZ-model-evaluation" data-placeholder="Model Performance Metrics Dashboard"></div>

## Interactive Visualizations

Try editing this markdown to see how different elements render:

<div id="VZ-interactive-demo" data-placeholder="Live Markdown Editor Demo"></div>

## Conclusion

Linear regression remains a cornerstone of statistical modeling and machine learning due to its **simplicity** and **interpretability**.

### When to Use Linear Regression

**Use when:**
- Relationship between variables appears linear
- Interpretability is important
- You have sufficient data relative to features

**Avoid when:**
- Relationships are clearly non-linear
- You have more features than samples
- Severe multicollinearity exists`;

  const [markdown, setMarkdown] = useState(initialMarkdown);

  const handleUploadSuccess = (moduleId: string) => {
    setUploadSuccess(moduleId);
    // Show success message for a few seconds, then redirect
    setTimeout(() => {
      // You can redirect to the new module page here
      // For now, just clear the success state and switch back to preview mode
      setUploadSuccess(null);
      setMode("preview");
    }, 3000);
  };

  return (
    <ProtectedRoute>
      <RoleGuard>
        <div className="bg-background">
          {/* Header/Navbar */}
          <div className="border-b border-line bg-surface">
            <header className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center w-full">
                {/* Logo or Title */}
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mr-8">
                  Markdown Editor & Preview
                </h1>
                {/* Mode Toggle */}
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex bg-surface rounded-lg p-1 border border-line">
                    <button
                      type="button"
                      onClick={() => setMode("preview")}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        mode === "preview"
                          ? "bg-foreground text-background"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <Eye
                        size={16}
                        className="inline-block mr-1.5 align-text-bottom"
                        aria-hidden="true"
                      />
                      Preview Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("upload")}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        mode === "upload"
                          ? "bg-foreground text-background"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <BookOpen
                        size={16}
                        className="inline-block mr-1.5 align-text-bottom"
                        aria-hidden="true"
                      />
                      Upload Mode
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <p className="text-muted mt-1 px-6">
              {mode === "preview"
                ? "Edit markdown on the left and see the live preview on the right"
                : "Upload your markdown as a learning module"}
            </p>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="flex items-center gap-2 bg-purple-wash border border-purple-light text-purple-light px-6 py-4">
              <CheckCircle2 size={16} aria-hidden="true" />
              Learning module uploaded successfully! Module ID: {uploadSuccess}
            </div>
          )}

          {/* Editor Layout */}
          <div className="flex ">
            {mode === "preview" ? (
              <>
                {/* Editor Panel */}
                <div className="w-1/2 border-r border-line bg-surface split-separator">
                  <div className="h-full flex flex-col">
                    {/* Editor Header */}
                    <div className="border-b border-line px-4 py-2 bg-background">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-ink-2 flex items-center gap-1.5">
                          <FileText size={14} aria-hidden="true" />
                          Markdown Editor
                        </h2>
                        <div className="flex items-center space-x-4 text-xs text-muted">
                          <span>Lines: {markdown.split("\n").length}</span>
                          <span>
                            Words:{" "}
                            {
                              markdown
                                .split(/\s+/)
                                .filter((word) => word.length > 0).length
                            }
                          </span>
                          <span>Chars: {markdown.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="border-b border-line px-4 py-3 bg-background/50">
                      <ImageUploadButton />
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
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs text-muted max-w-xs opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
                        <div className="font-medium mb-2 text-purple-light flex items-center gap-1.5">
                          <Sparkles size={14} aria-hidden="true" />
                          Quick Reference
                        </div>
                        <div className="space-y-1 font-mono">
                          <div># Heading 1</div>
                          <div>## Heading 2</div>
                          <div>**bold** *italic*</div>
                          <div>`inline code`</div>
                          <div>```python</div>
                          <div>code block</div>
                          <div>```</div>
                          <div>$$math equation$$</div>
                          <div className="text-purple-deep mt-2 mb-1 font-normal flex items-center gap-1.5">
                            <BarChart3 size={14} aria-hidden="true" />
                            Visualizations:
                          </div>
                          <div className="text-purple-deep text-[10px]">
                            &lt;div id="VZ-linear-equation"&gt;&lt;/div&gt;
                          </div>
                          <div className="text-purple-deep text-[10px]">
                            &lt;div id="VZ-assumptions-plots"&gt;&lt;/div&gt;
                          </div>
                          <div className="text-purple-deep text-[10px]">
                            &lt;div id="VZ-model-evaluation"&gt;&lt;/div&gt;
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="w-1/2 -screen bg-background">
                  <div className="h-full flex flex-col">
                    {/* Preview Header */}
                    <div className="border-b border-line px-4 py-2 bg-surface">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h2 className="text-sm font-medium text-ink-2 flex items-center gap-1.5">
                            <Eye size={14} aria-hidden="true" />
                            Live Preview
                          </h2>
                          <VisualizationIndicator content={markdown} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setMarkdown(initialMarkdown)}
                            className="px-3 py-1 text-xs bg-purple-wash text-purple-deep rounded border border-purple-light hover:bg-purple-wash transition-colors inline-flex items-center gap-1.5"
                          >
                            <RotateCcw size={12} aria-hidden="true" />
                            Reset Example
                          </button>
                          <button
                            type="button"
                            onClick={() => setMarkdown("")}
                            className="px-3 py-1 text-xs bg-surface text-ink-2 rounded border border-line hover:bg-surface-2 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Trash2 size={12} aria-hidden="true" />
                            Clear All
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-y-auto preview-container">
                      {markdown.trim() ? (
                        <MarkdownRenderer content={markdown} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted">
                          <div className="text-center max-w-md">
                            <div className="mb-4 flex justify-center">
                              <FileText
                                size={48}
                                className="text-purple/60"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="text-lg mb-2 text-muted">
                              No content to preview
                            </div>
                            <div className="text-sm text-muted leading-relaxed">
                              Start typing markdown in the editor to see the
                              live preview. Try headings, code blocks, math
                              equations, and VZ components!
                            </div>
                            <div className="mt-4 p-3 bg-purple-wash border border-purple-light rounded-lg text-left">
                              <div className="text-xs text-purple-deep font-medium mb-1 flex items-center gap-1.5">
                                <Lightbulb size={12} aria-hidden="true" />
                                Pro Tip:
                              </div>
                              <div className="text-xs text-muted">
                                Use the "Reset Example" button to load a full
                                sample with all supported features
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Upload Mode */
              <div className="w-full bg-background">
                <div className="h-full flex">
                  {/* Upload Form Panel */}
                  <div className="w-1/2 border-r border-line overflow-y-auto">
                    <div className="p-6">
                      <MarkdownUploadForm
                        markdownContent={markdown}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    </div>
                  </div>

                  {/* Content Preview Panel */}
                  <div className="w-1/2 bg-background">
                    <div className="h-full flex flex-col">
                      {/* Preview Header */}
                      <div className="border-b border-line px-4 py-2 bg-surface">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <h2 className="text-sm font-medium text-ink-2 flex items-center gap-1.5">
                              <Eye size={14} aria-hidden="true" />
                              Content Preview
                            </h2>
                            <VisualizationIndicator content={markdown} />
                          </div>
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="flex-1 overflow-y-auto preview-container">
                        {markdown.trim() ? (
                          <MarkdownRenderer content={markdown} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted">
                            <div className="text-center max-w-md">
                              <div className="mb-4 flex justify-center">
                                <BookOpen
                                  size={48}
                                  className="text-purple/60"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="text-lg mb-2 text-muted">
                                No content to upload
                              </div>
                              <div className="text-sm text-muted leading-relaxed">
                                Switch to Preview Mode to create content, then
                                return here to upload it as a learning module.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
