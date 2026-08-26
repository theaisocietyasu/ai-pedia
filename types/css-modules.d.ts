// CSS Module declarations (ambient shims for style imports)
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// KaTeX CSS import
declare module "katex/dist/katex.min.css" {
  const content: { [className: string]: string };
  export default content;
}
