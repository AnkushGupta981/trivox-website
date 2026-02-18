TRIVOX - DATA TOOLS & AUTOMATION PLATFORM
Version: 1.0.0
License: MIT (or your preferred license)

--- 1. OVERVIEW ---
Trivox is a luxury-themed, client-side data automation platform. 
It uses pure HTML5, CSS3, and Vanilla JavaScript. 
No Node.js, React, or backend server is required for the core CSV tools to function.

--- 2. INSTALLATION ---
1. Unzip the folder.
2. Ensure the folder structure is maintained:
   /trivox
     ├── assets/         (Images/Icons)
     ├── index.html      (Home)
     ├── tools.html      (Main App)
     ├── styles.css      (Core Design System)
     ├── script.js       (Logic Engine)
     └── [other .html files]
3. Double-click `index.html` to run in your browser.

--- 3. CUSTOMIZATION ---
> COLORS: 
  Edit the :root variables in `styles.css` to change the theme.
  --primary: #6A0DAD (Royal Purple)
  --gold: #D4AF37 (Luxury Accent)

> LOGIC:
  The CSV processing logic is located in `script.js` under the "CSV TOOL ENGINE" section.
  It currently supports: Remove Duplicates, Trim Whitespace, Remove Empty Rows.

> IMAGES:
  Place your images in the /assets folder and update the <img> src tags in the HTML files.

--- 4. DEPLOYMENT ---
Since this is a static site, you can deploy it for free on:
- GitHub Pages
- Netlify (Drag and drop the folder)
- Vercel

--- 5. CREDITS ---
Fonts: Inter, Playfair Display (via Google Fonts)
Icons: Use FontAwesome or HeroIcons (optional, currently using text-based UI)

--------------------------------------------------------------------------
Built with high-performance Vanilla JS. 
Keep the web fast.
