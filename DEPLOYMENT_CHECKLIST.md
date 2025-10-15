# SEO Deployment Checklist

Use this checklist to ensure all SEO optimizations are properly configured before and after deployment.

---

## Pre-Deployment (Local Testing)

### Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your production URL (e.g., `https://ailearninghub.com`)
- [ ] Remove any localhost URLs from environment variables

### Image Assets
- [ ] Create `public/og-image.png` (1200×630px) - See `public/IMAGES_NEEDED.md`
- [ ] Create `public/apple-touch-icon.png` (180×180px)
- [ ] Verify `public/logo.png` exists
- [ ] Verify `public/favicon.ico` exists (or `logo.ico`)

### Build & Test
- [ ] Run `npm run build` - Ensure no errors
- [ ] Run `npm run dev` to start development server
- [ ] Visit `http://localhost:3000/sitemap.xml` - Verify sitemap loads
- [ ] Visit `http://localhost:3000/robots.txt` - Verify robots.txt loads
- [ ] Visit `http://localhost:3000/opengraph-image` - Verify OG image generates
- [ ] Visit `http://localhost:3000/manifest.json` - Verify manifest loads

### Page Testing
Test each page for proper metadata:

- [ ] Home (`/`) - Check title, description in browser tab
- [ ] Blogs (`/blogs`) - Check metadata
- [ ] Sample Blog Post (`/blogs/[slug]`) - Check dynamic metadata
- [ ] Learn (`/learn`) - Check metadata
- [ ] About (`/about`) - Check metadata
- [ ] Waitlist (`/waitlist`) - Check metadata

### Developer Tools Testing
Open DevTools (F12) on each page and check:

- [ ] Console: No errors
- [ ] Network: Check for 200 status codes
- [ ] Elements: Verify `<head>` contains:
  - Title tag
  - Meta description
  - Open Graph tags (og:title, og:description, og:image)
  - Twitter Card tags
  - Canonical URL
  - JSON-LD structured data scripts

### View Page Source
Right-click → View Page Source on key pages:

- [ ] Home page: Verify Organization and WebSite schemas
- [ ] Blog post: Verify Article and Breadcrumb schemas
- [ ] All pages: Verify meta tags are present

---

## Deployment

### Update Configuration Files
- [ ] Double-check `NEXT_PUBLIC_SITE_URL` in production environment
- [ ] Set `NEXT_PUBLIC_GOOGLE_VERIFICATION` (get from Google Search Console)
- [ ] Set `NEXT_PUBLIC_YANDEX_VERIFICATION` if using Yandex

### Deploy
- [ ] Build succeeds: `npm run build`
- [ ] Deploy to your hosting platform (Vercel, Netlify, etc.)
- [ ] Verify deployment completed successfully

---

## Post-Deployment (Within 24 Hours)

### Verify Live Site
- [ ] Visit your production URL
- [ ] Check HTTPS is working (🔒 in address bar)
- [ ] Verify sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Verify robots.txt: `https://yourdomain.com/robots.txt`
- [ ] Verify manifest: `https://yourdomain.com/manifest.json`

### Test Social Sharing
Test OG images with debuggers:

- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
  - Enter your URL
  - Click "Scrape Again" if needed
  - Verify image shows correctly (1200×630px)

- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
  - Enter your URL
  - Verify card displays correctly

- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
  - Enter your URL
  - Verify image and text appear correctly

### Structured Data Validation
- [ ] [Rich Results Test](https://search.google.com/test/rich-results)
  - Test home page
  - Test a blog post
  - Verify no errors or warnings

- [ ] [Schema Markup Validator](https://validator.schema.org/)
  - Test your structured data
  - Ensure valid JSON-LD

### Performance Testing
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)
  - Test mobile version
  - Test desktop version
  - Target: 90+ score on both
  - Check Core Web Vitals (green scores)

- [ ] [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
  - Verify mobile-friendly status

### Security Headers Check
- [ ] [Security Headers Analyzer](https://securityheaders.com/)
  - Enter your URL
  - Target: A or A+ rating
  - Verify all security headers present

---

## Search Engine Setup (Within 1 Week)

### Google Search Console
- [ ] Go to [Google Search Console](https://search.google.com/search-console)
- [ ] Add property: `https://yourdomain.com`
- [ ] Choose verification method:
  - **HTML tag** (recommended): Add code to `.env.local` → `NEXT_PUBLIC_GOOGLE_VERIFICATION`
  - Or use DNS TXT record
- [ ] Verify ownership
- [ ] Submit sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Set preferred domain (with or without www)
- [ ] Set target country (USA recommended)

### Bing Webmaster Tools
- [ ] Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Add your site
- [ ] Import from Google Search Console (easiest method)
- [ ] Submit sitemap: `https://yourdomain.com/sitemap.xml`

### Google Analytics 4 (Optional but Recommended)
- [ ] Create GA4 property
- [ ] Get measurement ID (G-XXXXXXXXXX)
- [ ] Add to `.env.local` → `NEXT_PUBLIC_GA_ID`
- [ ] Add tracking code to `app/layout.tsx` (see SEO_GUIDE.md)
- [ ] Verify data collection (check Real-time reports)

### Google Tag Manager (Optional)
- [ ] Create GTM container
- [ ] Get container ID (GTM-XXXXXXX)
- [ ] Add to `.env.local` → `NEXT_PUBLIC_GTM_ID`
- [ ] Configure tags for events

---

## Ongoing Monitoring (Weekly/Monthly)

### Weekly Checks
- [ ] Google Search Console: Check for coverage errors
- [ ] Google Analytics: Review traffic trends
- [ ] Check for 404 errors or broken links
- [ ] Monitor Core Web Vitals

### Monthly Tasks
- [ ] Publish new blog post (fresh content for SEO)
- [ ] Review top-performing pages
- [ ] Update metadata for underperforming pages
- [ ] Check backlink profile
- [ ] Review search query performance
- [ ] Update keywords based on trends

### Quarterly Audits
- [ ] Full SEO audit using tools like:
  - [Ahrefs](https://ahrefs.com/) (paid)
  - [SEMrush](https://www.semrush.com/) (paid)
  - [Screaming Frog](https://www.screamingfrog.co.uk/) (free for <500 URLs)
- [ ] Technical SEO audit
- [ ] Content gap analysis
- [ ] Competitor analysis
- [ ] Update structured data if needed
- [ ] Review and update images

---

## Common Issues & Solutions

### Issue: Sitemap not updating
**Solution:**
- Clear Next.js cache: Delete `.next` folder
- Rebuild: `npm run build`
- Check database connection for dynamic routes

### Issue: OG images not showing on social media
**Solution:**
- Wait 24-48 hours for cache to clear
- Use Facebook Debugger "Scrape Again" button
- Check image is accessible: `https://yourdomain.com/og-image.png`
- Verify image dimensions are exactly 1200×630px

### Issue: Search Console shows "Discovered - currently not indexed"
**Solution:**
- This is normal for new sites
- Submit URL for indexing manually
- Build more backlinks
- Add internal links to the pages
- Wait 2-4 weeks for Google to crawl

### Issue: Structured data errors
**Solution:**
- Test with Rich Results Test
- Check for missing required fields
- Validate JSON-LD syntax
- Ensure dates are in ISO 8601 format

### Issue: Low PageSpeed score
**Solution:**
- Optimize images (use WebP/AVIF)
- Enable compression (already configured)
- Minimize JavaScript (check bundle size)
- Use lazy loading for images
- Check for render-blocking resources

---

## Success Metrics

### Week 1
- ✅ Site indexed by Google
- ✅ All pages crawlable
- ✅ No critical errors in Search Console

### Month 1
- ✅ 10+ pages indexed
- ✅ Some organic traffic starting
- ✅ Social shares showing correct OG images

### Month 3
- ✅ 50+ organic visitors per week
- ✅ Top 20 rankings for some keywords
- ✅ Core Web Vitals all green

### Month 6
- ✅ 200+ organic visitors per week
- ✅ Top 10 rankings for target keywords
- ✅ Growing backlink profile
- ✅ Increasing domain authority

---

## Support Resources

- **Documentation**: See `SEO_GUIDE.md` for detailed information
- **Google Search Central**: [developers.google.com/search](https://developers.google.com/search)
- **Next.js SEO Docs**: [nextjs.org/docs/app/building-your-application/optimizing/metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

---

## Final Checklist Summary

**Before Launch:**
- [x] Environment variables configured
- [x] Images created (og-image.png, apple-touch-icon.png)
- [x] Build succeeds with no errors
- [x] All pages tested locally

**After Launch:**
- [ ] Live site verified
- [ ] Social sharing tested
- [ ] Search Console configured
- [ ] Sitemap submitted
- [ ] Analytics installed

**Ongoing:**
- [ ] Weekly Search Console checks
- [ ] Monthly content updates
- [ ] Quarterly SEO audits

---

**Ready to deploy? Run through this checklist to ensure nothing is missed!**

Last Updated: 2025-10-15
