# Required Images for SEO

Create these images and place them in the `/public/` folder for optimal SEO and social sharing.

## Required Images

### 1. Open Graph Image
**Filename:** `og-image.png`
**Dimensions:** 1200 × 630 pixels
**Format:** PNG or JPG
**Purpose:** Social media sharing (Facebook, LinkedIn, Twitter, Discord)

**Design Guidelines:**
- Include your logo
- Use brand colors (purple #8b5cf6, pink #ec4899)
- Add text: "AI Pedia - Learn AI through Interactive Visualizations"
- Dark background (#0a0a0a) recommended
- Keep text and important elements in the "safe area" (center 80%)

**Tools to Create:**
- [Canva](https://www.canva.com/) - Use "Facebook Post" or "LinkedIn Post" template
- [Figma](https://www.figma.com/) - Design from scratch
- Adobe Photoshop/Illustrator
- Online OG Image Generator: [og-image.vercel.app](https://og-image.vercel.app/)

---

### 2. Apple Touch Icon
**Filename:** `apple-touch-icon.png`
**Dimensions:** 180 × 180 pixels
**Format:** PNG
**Purpose:** iOS home screen icon when users save your site

**Design Guidelines:**
- Simple, recognizable logo or icon
- No text (icon should be clear at small sizes)
- Solid background (avoid transparency)
- Rounded corners will be added automatically by iOS

---

### 3. Favicon (Optional - already have logo.ico)
**Filename:** `favicon.ico`
**Dimensions:** Multiple sizes (16×16, 32×32, 48×48)
**Format:** ICO
**Purpose:** Browser tab icon

**Note:** You already have `logo.ico` which serves this purpose. If you want to update it, use a favicon generator.

---

## Current Status

| Image | Status | Action Required |
|-------|--------|-----------------|
| `og-image.png` | ❌ Missing | Create 1200×630px image |
| `apple-touch-icon.png` | ❌ Missing | Create 180×180px image |
| `favicon.ico` | ✅ Exists | Optional: Update if needed |
| `logo.png` | ✅ Exists | Used in structured data |

---

## How to Test

### Test Open Graph Image:
1. **Facebook**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. **Twitter**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
3. **LinkedIn**: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Test Apple Touch Icon:
1. Open your site on an iPhone/iPad
2. Tap the Share button
3. Select "Add to Home Screen"
4. Check if your icon appears correctly

---

## Fallback Behavior

**Until you create these images:**
- The dynamic OG image generator (`app/opengraph-image.tsx`) will create a basic OG image
- Social shares will show the generated image
- iOS users will see a screenshot of your page as the icon

**After you create the images:**
- Static `og-image.png` will be used as fallback for all pages
- Individual pages can still use dynamic OG images
- iOS users will see your custom icon

---

## Quick Design Template

### OG Image (1200×630px)

```
┌─────────────────────────────────────────────┐
│                                             │
│  [Your Logo]                                │
│                                             │
│      ML VISUALIZATION                       │
│      Learn AI through Interactive           │
│      Visualizations                         │
│                                             │
│      The AI Society at ASU                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Colors:**
- Background: #0a0a0a (dark)
- Primary text: White
- Gradient accent: #8b5cf6 → #ec4899
- Logo: Use existing logo.png

---

## Priority

1. **High Priority**: `og-image.png` - Needed for professional social sharing
2. **Medium Priority**: `apple-touch-icon.png` - Needed for iOS users
3. **Low Priority**: Update favicon.ico - Optional enhancement

---

## Example Design Services

If you want professional design:
- Fiverr: $5-20 for OG image design
- Upwork: Professional designers available
- 99designs: Design contest option
- DIY with Canva: Free, template-based

---

## Need Help?

If you need the images created:
1. Use Canva templates (easiest)
2. Export `logo.png` and use as base
3. Add text overlay in design tool
4. Export at exact dimensions required

---

**Note:** The site will work without these images, but having them significantly improves:
- Social media click-through rates (40-60% increase)
- Brand recognition
- Professional appearance
- User trust signals
