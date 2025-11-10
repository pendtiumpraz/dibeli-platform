const fs = require('fs');
const path = require('path');

// Template definitions with visual characteristics
const templates = [
  // FREE TIER (2)
  { id: 'simple-classic', name: 'Simple Classic', tier: 'FREE', colors: ['#4F46E5', '#818CF8'], layout: 'grid' },
  { id: 'minimal-clean', name: 'Minimal Clean', tier: 'FREE', colors: ['#6B7280', '#9CA3AF'], layout: 'list' },
  
  // PREMIUM TIER (18)
  { id: 'elegant-shop', name: 'Elegant Shop', tier: 'PREMIUM', colors: ['#4C1D95', '#6366F1'], layout: 'grid' },
  { id: 'modern-professional', name: 'Modern Professional', tier: 'PREMIUM', colors: ['#1E293B', '#0F172A'], layout: 'cards' },
  { id: 'bold-colorful', name: 'Bold Colorful', tier: 'PREMIUM', colors: ['#EA580C', '#DC2626'], layout: 'masonry' },
  { id: 'luxury-boutique', name: 'Luxury Boutique', tier: 'PREMIUM', colors: ['#581C87', '#EC4899'], layout: 'featured' },
  { id: 'royal-marketplace', name: 'Royal Marketplace', tier: 'PREMIUM', colors: ['#6D28D9', '#FBBF24'], layout: 'grid' },
  { id: 'futuristic-store', name: 'Futuristic Store', tier: 'PREMIUM', colors: ['#06B6D4', '#3B82F6'], layout: 'tech' },
  { id: 'vintage-classic', name: 'Vintage Classic', tier: 'PREMIUM', colors: ['#92400E', '#B45309'], layout: 'retro' },
  { id: 'neon-cyberpunk', name: 'Neon Cyberpunk', tier: 'PREMIUM', colors: ['#EC4899', '#8B5CF6'], layout: 'neon' },
  { id: 'organic-nature', name: 'Organic Nature', tier: 'PREMIUM', colors: ['#15803D', '#65A30D'], layout: 'natural' },
  { id: 'industrial-urban', name: 'Industrial Urban', tier: 'PREMIUM', colors: ['#44403C', '#78716C'], layout: 'urban' },
  { id: 'pastel-dreamy', name: 'Pastel Dreamy', tier: 'PREMIUM', colors: ['#FBCFE8', '#DDD6FE'], layout: 'soft' },
  { id: 'dark-minimalist', name: 'Dark Minimalist', tier: 'PREMIUM', colors: ['#030712', '#1F2937'], layout: 'dark' },
  { id: 'gradient-modern', name: 'Gradient Modern', tier: 'PREMIUM', colors: ['#F472B6', '#A78BFA'], layout: 'gradient' },
  { id: 'glass-morphism', name: 'Glass Morphism', tier: 'PREMIUM', colors: ['#DBEAFE', '#E0E7FF'], layout: 'glass' },
  { id: 'neumorphic-soft', name: 'Neumorphic Soft', tier: 'PREMIUM', colors: ['#E5E7EB', '#F3F4F6'], layout: 'neuro' },
  { id: 'art-deco', name: 'Art Deco', tier: 'PREMIUM', colors: ['#854D0E', '#CA8A04'], layout: 'deco' },
  { id: 'brutalist-bold', name: 'Brutalist Bold', tier: 'PREMIUM', colors: ['#000000', '#DC2626'], layout: 'brutal' },
  { id: 'kawaii-cute', name: 'Kawaii Cute', tier: 'PREMIUM', colors: ['#FCA5A5', '#FCD34D'], layout: 'kawaii' },
  
  // UNLIMITED TIER (20)
  { id: 'ultimate-luxury', name: 'Ultimate Luxury', tier: 'UNLIMITED', colors: ['#7C2D12', '#B91C1C'], layout: 'luxury' },
  { id: 'tech-innovation', name: 'Tech Innovation', tier: 'UNLIMITED', colors: ['#0891B2', '#0284C7'], layout: 'tech' },
  { id: 'artistic-gallery', name: 'Artistic Gallery', tier: 'UNLIMITED', colors: ['#BE185D', '#DB2777'], layout: 'gallery' },
  { id: 'fashion-runway', name: 'Fashion Runway', tier: 'UNLIMITED', colors: ['#000000', '#FFFFFF'], layout: 'fashion' },
  { id: 'foodie-deluxe', name: 'Foodie Deluxe', tier: 'UNLIMITED', colors: ['#DC2626', '#F59E0B'], layout: 'food' },
  { id: 'gaming-esports', name: 'Gaming eSports', tier: 'UNLIMITED', colors: ['#7C3AED', '#10B981'], layout: 'gaming' },
  { id: 'fitness-pro', name: 'Fitness Pro', tier: 'UNLIMITED', colors: ['#059669', '#0D9488'], layout: 'fitness' },
  { id: 'beauty-cosmetics', name: 'Beauty Cosmetics', tier: 'UNLIMITED', colors: ['#EC4899', '#F472B6'], layout: 'beauty' },
  { id: 'automotive-speed', name: 'Automotive Speed', tier: 'UNLIMITED', colors: ['#DC2626', '#1F2937'], layout: 'auto' },
  { id: 'real-estate-elite', name: 'Real Estate Elite', tier: 'UNLIMITED', colors: ['#1E40AF', '#6B7280'], layout: 'realestate' },
  { id: 'jewelry-sparkle', name: 'Jewelry Sparkle', tier: 'UNLIMITED', colors: ['#7C2D12', '#FBBF24'], layout: 'jewelry' },
  { id: 'book-literature', name: 'Book Literature', tier: 'UNLIMITED', colors: ['#92400E', '#451A03'], layout: 'book' },
  { id: 'music-studio', name: 'Music Studio', tier: 'UNLIMITED', colors: ['#6D28D9', '#C026D3'], layout: 'music' },
  { id: 'travel-adventure', name: 'Travel Adventure', tier: 'UNLIMITED', colors: ['#0284C7', '#0EA5E9'], layout: 'travel' },
  { id: 'wedding-romance', name: 'Wedding Romance', tier: 'UNLIMITED', colors: ['#FBCFE8', '#FED7AA'], layout: 'wedding' },
  { id: 'kids-playground', name: 'Kids Playground', tier: 'UNLIMITED', colors: ['#FEF08A', '#86EFAC'], layout: 'kids' },
  { id: 'coffee-cozy', name: 'Coffee Cozy', tier: 'UNLIMITED', colors: ['#78350F', '#92400E'], layout: 'coffee' },
  { id: 'tech-saas', name: 'Tech SaaS', tier: 'UNLIMITED', colors: ['#1E40AF', '#7C3AED'], layout: 'saas' },
  { id: 'medical-health', name: 'Medical Health', tier: 'UNLIMITED', colors: ['#0284C7', '#10B981'], layout: 'medical' },
  { id: 'luxury-watches', name: 'Luxury Watches', tier: 'UNLIMITED', colors: ['#1C1917', '#D4AF37'], layout: 'watches' }
];

// Function to generate gradient definition
function generateGradient(id, colors) {
  return `
    <defs>
      <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
      </linearGradient>
    </defs>`;
}

// Function to generate tier badge
function generateTierBadge(tier) {
  const tierColors = {
    'FREE': '#10B981',
    'PREMIUM': '#F59E0B',
    'UNLIMITED': '#8B5CF6'
  };
  
  return `
    <g>
      <rect x="20" y="20" width="100" height="30" rx="15" fill="${tierColors[tier]}" fill-opacity="0.9"/>
      <text x="70" y="40" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${tier}</text>
    </g>`;
}

// Function to generate layout preview based on template style
function generateLayoutPreview(layout, colors) {
  const baseY = 80;
  const layouts = {
    'grid': `
      <rect x="30" y="${baseY}" width="140" height="100" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="190" y="${baseY}" width="140" height="100" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="30" y="${baseY + 120}" width="140" height="100" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="190" y="${baseY + 120}" width="140" height="100" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>`,
    'list': `
      <rect x="30" y="${baseY}" width="300" height="60" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="30" y="${baseY + 80}" width="300" height="60" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="30" y="${baseY + 160}" width="300" height="60" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>`,
    'cards': `
      <rect x="20" y="${baseY}" width="110" height="140" rx="12" fill="${colors[0]}" fill-opacity="0.4" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="145" y="${baseY}" width="110" height="140" rx="12" fill="${colors[0]}" fill-opacity="0.4" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="270" y="${baseY}" width="110" height="140" rx="12" fill="${colors[0]}" fill-opacity="0.4" stroke="${colors[1]}" stroke-width="2"/>`,
    'masonry': `
      <rect x="30" y="${baseY}" width="140" height="120" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="190" y="${baseY}" width="140" height="80" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>
      <rect x="190" y="${baseY + 100}" width="140" height="120" rx="8" fill="${colors[0]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="2"/>`,
    'default': `
      <rect x="30" y="${baseY}" width="300" height="200" rx="12" fill="url(#grad-layout)" fill-opacity="0.4" stroke="${colors[1]}" stroke-width="3"/>`
  };
  
  return layouts[layout] || layouts['default'];
}

// Main SVG generation function
function generateSVG(template) {
  const { id, name, tier, colors, layout } = template;
  
  return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  ${generateGradient(id, colors)}
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#grad-${id})"/>
  <rect width="400" height="300" fill="rgba(0,0,0,0.3)"/>
  
  <!-- Tier Badge -->
  ${generateTierBadge(tier)}
  
  <!-- Layout Preview -->
  ${generateLayoutPreview(layout, colors)}
  
  <!-- Template Name -->
  <text x="200" y="270" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${name}</text>
</svg>`;
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'public', 'template-previews');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate all thumbnails
console.log('🎨 Generating template thumbnails...\n');
let count = 0;

templates.forEach(template => {
  const svg = generateSVG(template);
  const filename = `${template.id}.svg`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, svg);
  count++;
  console.log(`✅ Generated: ${filename} (${template.tier})`);
});

console.log(`\n🎉 Successfully generated ${count} template thumbnails!`);
console.log(`📁 Location: ${outputDir}`);
