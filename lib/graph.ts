import { cache } from "react";
import {
  type ArticleMeta,
  type Category,
  getArticle,
  getArticles,
  getCategories,
} from "@/lib/content";
import type {
  GraphBounds,
  GraphData,
  GraphEdge,
  GraphNode,
} from "@/lib/graph-types";
import { ROOT_ID } from "@/lib/graph-types";
import type { Heading } from "@/lib/markdown-utils";

export * from "@/lib/graph-types";

/**
 * Build-time layout for the neural-network view of the library.
 *
 * The site's content is a tree — categories hold articles, articles hold
 * headings — so the graph is that same tree drawn as a network: the root is
 * the field itself, and every level fans outward from its parent. Positions
 * are computed here rather than simulated in the browser so that the map is
 * identical on every load and on the server, and so that deep-linking to a
 * node can place the camera before a single frame is painted.
 *
 * Coordinates are an arbitrary "world" space; the client scales and translates
 * the whole thing into the viewport.
 */

/** Radius of each ring, measured from the parent node. */
const ORBIT = {
  category: 560,
  article: 250,
  heading: 108,
} as const;

/** Drawn radius of a node at each depth; deeper headings keep shrinking. */
const NODE_RADIUS = [34, 23, 13, 6.5, 4] as const;

/** Headings are only interesting a couple of levels down. */
const MAX_HEADING_DEPTH = 2;

/** Deterministic hash → seed, so a node's jitter never depends on ordering. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable pseudo-random value in [-1, 1] for a given node and channel. */
function jitter(id: string, channel: string): number {
  const seed = hash(`${id}:${channel}`);
  return (seed / 0xffffffff) * 2 - 1;
}

function radiusFor(depth: number): number {
  return NODE_RADIUS[Math.min(depth, NODE_RADIUS.length - 1)];
}

/**
 * Fans `count` children around `heading`, returning the angle for index `i`.
 * A lone child sits straight out from its parent; a crowd wraps into an arc
 * that widens with the count but never doubles back on the parent.
 */
function fanAngle(
  heading: number,
  i: number,
  count: number,
  maxSpread: number,
): number {
  if (count <= 1) return heading;
  const spread = Math.min(maxSpread, 0.55 + count * 0.3);
  return heading - spread / 2 + (spread * i) / (count - 1);
}

interface Placement {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** Places a heading and its children recursively, fanning away from `heading`. */
function placeHeading(
  out: Placement,
  parent: GraphNode,
  headingNode: Heading,
  index: number,
  siblings: number,
  outward: number,
  depth: number,
  href: string,
): void {
  const id = `${parent.id}#${headingNode.id}`;
  const angle = fanAngle(outward, index, siblings, Math.PI * 0.85);
  const wobble = jitter(id, "angle") * 0.1;
  const distance = ORBIT.heading * (1 + jitter(id, "dist") * 0.18);
  const theta = angle + wobble;

  const node: GraphNode = {
    id,
    kind: "heading",
    label: headingNode.text,
    href,
    anchor: headingNode.id,
    parent: parent.id,
    depth,
    x: parent.x + Math.cos(theta) * distance,
    y: parent.y + Math.sin(theta) * distance,
    r: radiusFor(depth),
  };
  out.nodes.push(node);
  out.edges.push({ from: parent.id, to: node.id, kind: "tree" });

  if (depth - 2 >= MAX_HEADING_DEPTH) return;
  const children = headingNode.children;
  children.forEach((child, i) => {
    placeHeading(out, node, child, i, children.length, theta, depth + 1, href);
  });
}

function placeArticle(
  out: Placement,
  category: GraphNode,
  meta: ArticleMeta,
  index: number,
  siblings: number,
  outward: number,
): void {
  const id = `article:${meta.category}/${meta.slug}`;
  const href = `/learn/${meta.category}/${meta.slug}`;
  const angle = fanAngle(outward, index, siblings, Math.PI * 1.1);
  const wobble = jitter(id, "angle") * 0.09;
  const distance = ORBIT.article * (1 + jitter(id, "dist") * 0.22);
  const theta = angle + wobble;

  const node: GraphNode = {
    id,
    kind: "article",
    label: meta.title,
    description: meta.description || undefined,
    href,
    parent: category.id,
    depth: 2,
    x: category.x + Math.cos(theta) * distance,
    y: category.y + Math.sin(theta) * distance,
    r: radiusFor(2),
  };
  out.nodes.push(node);
  out.edges.push({ from: category.id, to: node.id, kind: "tree" });

  const article = getArticle(meta.category, meta.slug);
  const headings = article?.headings ?? [];
  headings.forEach((h, i) => {
    placeHeading(out, node, h, i, headings.length, theta, 3, href);
  });
}

function placeCategory(
  out: Placement,
  root: GraphNode,
  category: Category,
  index: number,
  siblings: number,
): GraphNode {
  const id = `category:${category.slug}`;
  // Categories ring the root evenly, starting at the top of the circle.
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(siblings, 1);
  const theta = angle + jitter(id, "angle") * 0.07;
  const distance = ORBIT.category * (1 + jitter(id, "dist") * 0.14);

  const node: GraphNode = {
    id,
    kind: "category",
    label: category.title,
    description: category.description || undefined,
    href: `/learn/${category.slug}`,
    parent: root.id,
    depth: 1,
    x: root.x + Math.cos(theta) * distance,
    y: root.y + Math.sin(theta) * distance,
    r: radiusFor(1),
  };
  const articles = getArticles(category.slug);
  node.sublabel =
    articles.length === 1 ? "1 topic" : `${articles.length} topics`;

  out.nodes.push(node);
  out.edges.push({ from: root.id, to: node.id, kind: "tree" });

  articles.forEach((meta, i) => {
    placeArticle(out, node, meta, i, articles.length, theta);
  });

  return node;
}

function boundsOf(nodes: GraphNode[]): GraphBounds {
  if (nodes.length === 0) return { minX: -1, minY: -1, maxX: 1, maxY: 1 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x - n.r);
    minY = Math.min(minY, n.y - n.r);
    maxX = Math.max(maxX, n.x + n.r);
    maxY = Math.max(maxY, n.y + n.r);
  }
  return { minX, minY, maxX, maxY };
}

export const getGraph = cache((): GraphData => {
  const root: GraphNode = {
    id: ROOT_ID,
    kind: "root",
    label: "AI Pedia",
    depth: 0,
    x: 0,
    y: 0,
    r: radiusFor(0),
  };

  const out: Placement = { nodes: [root], edges: [] };
  const categories = getCategories();
  root.sublabel =
    categories.length === 1
      ? "1 branch · click to fly in"
      : `${categories.length} branches · click to fly in`;
  const categoryNodes = categories.map((c, i) =>
    placeCategory(out, root, c, i, categories.length),
  );

  // Faint edges around the ring of categories, so the overview reads as a
  // network rather than a plain star.
  for (let i = 0; i < categoryNodes.length; i++) {
    const next = categoryNodes[(i + 1) % categoryNodes.length];
    if (next.id === categoryNodes[i].id) continue;
    out.edges.push({ from: categoryNodes[i].id, to: next.id, kind: "ring" });
  }

  return {
    nodes: out.nodes,
    edges: out.edges,
    bounds: boundsOf(out.nodes),
    overview: boundsOf(out.nodes.filter((n) => n.depth <= 1)),
  };
});
