'use client';

import React from 'react';
import MarkdownRenderer from '../../components/MarkdownRenderer';

// Test content with escaped HTML (like what comes from the database)
const testMarkdownWithEscapedHTML = `# Test Escaped Visualization

This tests the escaped HTML format that comes from the database:

## Linear Equation Visualization (Escaped)

\<div id="VZ-linear-equation" data-placeholder="Interactive Linear Equation Visualization"\>\</div\>

## Assumptions Plots (Escaped)

\<div id="VZ-assumptions-plots" data-placeholder="Diagnostic Plots for Linear Regression Assumptions"\>\</div\>

## Regular Markdown Content

This should render normally with **bold** and *italic* text.

- List item 1
- List item 2
- List item 3

And some code:

\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`
`;

export default function TestEscapedVizPage() {
  return (
    <div className="min-h-screen bg-dark-gray">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Test Escaped HTML Visualizations
            </h1>
            <p className="text-gray-300">
              This page tests escaped HTML div tags like those stored in the database.
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg border border-white/10 p-6">
            <MarkdownRenderer content={testMarkdownWithEscapedHTML} />
            
            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                ✅ If you see interactive visualizations above (not escaped text like "\&lt;div..."), 
                the fix is working correctly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}