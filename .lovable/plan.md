

## Add Circular Certificates Section

Replace the current generic "Web Dev Certification" card in the Achievements section with a dedicated **Certificates showcase** using circular badge-style designs — fits the cyberpunk aesthetic perfectly.

### Design
- Circular glowing badges/medallions arranged in a row or grid
- Each circle shows the certificate name, issuer, and a "Verify" link
- Neon ring border with pulse glow animation
- Hover: ring expands, glow intensifies, shows details

### Data Structure
Each certificate entry will have:
- `title` — e.g. "Python Basics"
- `issuer` — e.g. "Coursera", "freeCodeCamp"
- `link` — verification URL
- `icon` — relevant icon

### Changes
1. **Create `src/components/CertificatesSection.tsx`** — New section with circular badge cards, each with a neon-ring border, certificate title, issuer name, and verify link. Uses Framer Motion for entrance animations and hover effects.

2. **Update `src/pages/Index.tsx`** — Add `CertificatesSection` after `AchievementsSection`.

3. **Update `src/components/Navbar.tsx`** — Add "Certificates" to the nav links array.

Before building, I need to know which certificates you want to display.

