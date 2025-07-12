const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Base icon configuration
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]
const baseIconPath = path.join(__dirname, '../public/placeholder-logo.png')
const iconsDir = path.join(__dirname, '../public/icons')

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// BLACKPINK themed icon SVG template
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0f1b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#02040a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff69b4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e91e63;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#bgGradient)" stroke="url(#pinkGradient)" stroke-width="4"/>
  
  <!-- BLACKPINK Crown Icon -->
  <g transform="translate(${size/2 - 40}, ${size/2 - 30})">
    <!-- Crown base -->
    <rect x="10" y="45" width="60" height="8" fill="url(#pinkGradient)" rx="2"/>
    
    <!-- Crown points -->
    <polygon points="15,45 25,25 35,35 45,20 55,35 65,25 75,45" fill="url(#pinkGradient)"/>
    
    <!-- Crown jewels -->
    <circle cx="25" cy="30" r="3" fill="#ffffff" opacity="0.9"/>
    <circle cx="45" cy="25" r="4" fill="#ffffff" opacity="0.9"/>
    <circle cx="65" cy="30" r="3" fill="#ffffff" opacity="0.9"/>
    
    <!-- Letter B -->
    <text x="40" y="70" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="url(#pinkGradient)" text-anchor="middle">B</text>
  </g>
</svg>
`

// Generate icons
async function generateIcons() {
  console.log('Generating PWA icons...')
  
  try {
    for (const size of iconSizes) {
      const svgBuffer = Buffer.from(createIconSVG(size))
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`)
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png({
          quality: 100,
          compressionLevel: 6
        })
        .toFile(outputPath)
      
      console.log(`✓ Generated icon-${size}x${size}.png`)
    }
    
    // Generate favicon
    const faviconSvg = Buffer.from(createIconSVG(32))
    await sharp(faviconSvg)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon.png'))
    
    console.log('✓ Generated favicon.png')
    
    // Generate apple-touch-icon
    const appleTouchSvg = Buffer.from(createIconSVG(180))
    await sharp(appleTouchSvg)
      .resize(180, 180)
      .png()
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'))
    
    console.log('✓ Generated apple-touch-icon.png')
    
    console.log('🎉 All PWA icons generated successfully!')
    
  } catch (error) {
    console.error('Error generating icons:', error)
    
    // Fallback: copy placeholder logo to all sizes
    console.log('Falling back to placeholder logo...')
    
    for (const size of iconSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`)
      try {
        if (fs.existsSync(baseIconPath)) {
          await sharp(baseIconPath)
            .resize(size, size)
            .png()
            .toFile(outputPath)
          console.log(`✓ Generated fallback icon-${size}x${size}.png`)
        } else {
          // Create simple colored squares as ultimate fallback
          await sharp({
            create: {
              width: size,
              height: size,
              channels: 4,
              background: { r: 233, g: 30, b: 99, alpha: 1 }
            }
          })
          .png()
          .toFile(outputPath)
          console.log(`✓ Generated basic icon-${size}x${size}.png`)
        }
      } catch (fallbackError) {
        console.error(`Failed to generate fallback icon ${size}x${size}:`, fallbackError)
      }
    }
  }
}

// Run if called directly
if (require.main === module) {
  generateIcons()
}

module.exports = { generateIcons }