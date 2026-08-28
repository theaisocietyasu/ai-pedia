/**
 * Where each category lives on the hand-drawn map (public/art/map.svg),
 * as CSS object-position percentages. A category can override this with a
 * `mapPosition: "x% y%"` field in its _category.md.
 */
export const MAP_REGIONS: Record<string, { position: string; label: string }> =
  {
    supervised: { position: "27% 72%", label: "The Plains of Regression" },
    unsupervised: { position: "80% 78%", label: "Ocean of Unlabeled Data" },
    reinforcement: {
      position: "84% 50%",
      label: "The Archipelago of Algorithms",
    },
    statistics: { position: "16% 58%", label: "The Valley of Data" },
  };

export const DEFAULT_MAP_REGION = {
  position: "24% 24%",
  label: "The Neural Mountains",
};

export function mapRegionFor(slug: string, override?: string) {
  const region = MAP_REGIONS[slug] ?? DEFAULT_MAP_REGION;
  return override ? { ...region, position: override } : region;
}
