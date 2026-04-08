

# Portfolio Upgrade Plan

This is a large request. I'll break it into **4 focused phases** to avoid overwhelming changes. Most of what you asked for **already exists** — here's what's done vs what's new:

## Already Implemented
- Admin dashboard with CRUD for projects, skills, certificates, greetings
- Supabase-backed dynamic content (no hardcoded data for editable sections)
- Real-time updates without redeploy
- Auth-protected admin routes
- Draft/publish system with undo/redo
- Glassmorphism design, hover animations, smooth scroll animations
- Command palette (Ctrl+K)
- Drag & reorder, search filtering
- Loading states and toasts

## What's Actually New

### Phase 1: Supabase Storage for Image Uploads
Currently images are stored as base64 strings in the database — inefficient and size-limited. This phase replaces that with proper cloud file storage.

- Create a `portfolio-images` storage bucket with public read access
- Update `ImageDropZone` to upload files to storage and return a public URL instead of base64
- Apply to profile image, project images, certificate images, greeting images

### Phase 2: Dynamic Achievements + Social Links
Achievements are currently **hardcoded** in `AchievementsSection.tsx`. Social links are hardcoded in `ContactSection.tsx`.

- Create `achievements` table (title, description, icon, link, color, sort_order)
- Add `social_links` columns to `portfolio_content` (github_url, linkedin_url, instagram_url, email)
- Add "Achievements" and "Social Links" tabs to admin dashboard
- Update `AchievementsSection` and `ContactSection` to read from database

### Phase 3: Hero Section & Project Detail Upgrades
- Add gradient text effect on hero name (CSS gradient clip)
- Update CTA buttons: "View Projects" scrolls to projects, "Contact Me" scrolls to contact
- Add project detail modal (click a project card → full-screen modal with description, tech stack, live link)
- Add `live_url` and `github_url` columns to projects table
- Wire the GitHub/ExternalLink icons in project cards to actual URLs

### Phase 4: Command Palette & Polish
- Add "Go to Projects", "Contact Me", "Download Resume" shortcuts to command palette
- Add resume URL field to admin (stored in portfolio_content)
- Performance: lazy-load heavy sections with `React.lazy` + `Suspense`

---

## Technical Details

**Database migrations needed:**
1. Storage bucket: `INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true)` + RLS policies for public read, authenticated write
2. Achievements table: `id, title, description, icon, link, color, sort_order, created_at, updated_at` with public SELECT, authenticated INSERT/UPDATE/DELETE
3. Projects table: `ALTER TABLE projects ADD COLUMN live_url text, ADD COLUMN github_url text`
4. Portfolio content: `ALTER TABLE portfolio_content ADD COLUMN github_url text DEFAULT '', ADD COLUMN linkedin_url text DEFAULT '', ADD COLUMN instagram_url text DEFAULT '', ADD COLUMN email text DEFAULT '', ADD COLUMN resume_url text DEFAULT ''`

**Files to modify:**
- `src/pages/AdminDashboard.tsx` — add achievements tab, social links fields, image upload via storage, project URL fields
- `src/components/AchievementsSection.tsx` — read from database instead of hardcoded array
- `src/components/ContactSection.tsx` — read social links from database
- `src/components/ProjectsSection.tsx` — add click-to-expand modal, wire link icons
- `src/components/HeroSection.tsx` — gradient text, updated CTA buttons
- `src/components/CommandPalette.tsx` — add resume download and more shortcuts
- `src/hooks/usePortfolioData.ts` — fetch achievements, social links, project URLs
- `src/contexts/PortfolioContext.tsx` — add achievement and social link types

**New files:**
- None significant — all changes extend existing components

I recommend implementing **Phase 1 first** (storage), then proceeding phase by phase.

