/**
 * Utility functions for visualization components
 */

/**
 * Generate sample data points for demonstrations
 */
export const generateSampleData = (count: number = 20, noiseLevel: number = 1) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const x = (i - count / 2) * 0.5;
    const y = 1.5 * x + 2 + (Math.random() - 0.5) * noiseLevel;
    points.push({ x, y });
  }
  return points;
};

/**
 * Generate polynomial data for given degree
 */
export const generatePolynomialData = (
  degree: number = 2, 
  range: { min: number; max: number } = { min: -3, max: 3 },
  coefficients?: number[]
) => {
  const data = [];
  const defaultCoeffs = [1, 2, -0.5, 0.1, 0.05]; // Default coefficients
  const coeffs = coefficients || defaultCoeffs;
  
  for (let x = range.min; x <= range.max; x += 0.1) {
    let y = 0;
    for (let i = 0; i <= degree; i++) {
      y += Math.pow(x, i) * (coeffs[i] || 0);
    }
    y += (Math.random() - 0.5) * 2; // Add noise
    data.push({ x, y, degree });
  }
  return data;
};

/**
 * Generate diagnostic plot data for assumption checking
 */
export const generateDiagnosticData = (
  type: 'good' | 'heteroscedastic' | 'nonlinear' | 'nonnormal',
  count: number = 100
) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    const fitted = (i / count) * 10 - 5;
    let residual = (Math.random() - 0.5) * 2;
    
    switch (type) {
      case 'heteroscedastic':
        residual *= Math.abs(fitted) * 0.3 + 0.5;
        break;
      case 'nonlinear':
        residual += Math.sin(fitted) * 0.8;
        break;
      case 'nonnormal':
        residual = Math.pow(Math.random(), 2) * (Math.random() > 0.5 ? 4 : -4);
        break;
    }
    
    data.push({ fitted, residual, x: fitted });
  }
  return data;
};

/**
 * Calculate R-squared value
 */
export const calculateRSquared = (actual: number[], predicted: number[]): number => {
  if (actual.length !== predicted.length) return 0;
  
  const actualMean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
  
  const ssTotal = actual.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0);
  const ssRes = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
  
  return 1 - (ssRes / ssTotal);
};

/**
 * Calculate Mean Squared Error
 */
export const calculateMSE = (actual: number[], predicted: number[]): number => {
  if (actual.length !== predicted.length) return 0;
  
  const sumSquaredErrors = actual.reduce((sum, val, i) => {
    return sum + Math.pow(val - predicted[i], 2);
  }, 0);
  
  return sumSquaredErrors / actual.length;
};

/**
 * Calculate Mean Absolute Error
 */
export const calculateMAE = (actual: number[], predicted: number[]): number => {
  if (actual.length !== predicted.length) return 0;
  
  const sumAbsoluteErrors = actual.reduce((sum, val, i) => {
    return sum + Math.abs(val - predicted[i]);
  }, 0);
  
  return sumAbsoluteErrors / actual.length;
};

/**
 * Format numbers for display
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

/**
 * Generate color palette for charts
 */
export const generateColorPalette = (count: number): string[] => {
  const baseColors = [
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#3b82f6', // blue
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate animation variants for motion components
 */
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7 }
  }
};