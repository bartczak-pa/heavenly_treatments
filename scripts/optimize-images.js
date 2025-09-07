const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration for image optimization
const CONFIG = {
  quality: {
    webp: 80,
    jpeg: 85,
    png: 90
  },
  sizes: [320, 640, 1024, 1280], // Responsive breakpoints
  outputDir: 'public/images/optimized',
  targetMaxSize: 500 * 1024, // 500KB target
};

// Critical images that need immediate optimization (>10MB)
const CRITICAL_IMAGES = [
  'public/images/treatments/bacial.png',
  'public/images/categories/person_having_reflexology_treatment.png',
  'public/images/mainPage/young-woman-having-face-massage-relaxing-spa-salon.jpg',
  'public/images/categories/woman-salon-making-beauty-treatment-with-gua-sha-stone.jpg'
];

async function createOutputDir() {
  try {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
  }
}

async function getImageInfo(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    return {
      path: filePath,
      size: stats.size,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

async function optimizeImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Create WebP version with aggressive compression for large files
    const webpPath = outputPath.replace(/\.[^.]+$/, '.webp');
    
    // For very large images (>10MB), use more aggressive compression
    const inputSize = (await fs.stat(inputPath)).size;
    const quality = inputSize > 10 * 1024 * 1024 ? 70 : CONFIG.quality.webp;
    
    await image
      .webp({ quality })
      .toFile(webpPath);
    
    // Generate responsive sizes for WebP
    for (const size of CONFIG.sizes) {
      if (size < metadata.width) {
        const responsivePath = webpPath.replace('.webp', `_${size}w.webp`);
        await image
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality })
          .toFile(responsivePath);
      }
    }
    
    const outputStats = await fs.stat(webpPath);
    return {
      input: inputPath,
      output: webpPath,
      inputSize: inputSize,
      outputSize: outputStats.size,
      reduction: ((inputSize - outputStats.size) / inputSize * 100).toFixed(1)
    };
    
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeCriticalImages() {
  console.log('🚀 Starting emergency image optimization...\n');
  
  await createOutputDir();
  
  let totalSavings = 0;
  let totalOriginalSize = 0;
  
  for (const imagePath of CRITICAL_IMAGES) {
    console.log(`📸 Processing: ${imagePath}`);
    
    const info = await getImageInfo(imagePath);
    if (!info) continue;
    
    console.log(`   Original: ${(info.size / 1024 / 1024).toFixed(1)}MB (${info.width}x${info.height})`);
    
    const fileName = path.basename(imagePath);
    const outputPath = path.join(CONFIG.outputDir, fileName);
    
    const result = await optimizeImage(imagePath, outputPath);
    if (result) {
      console.log(`   Optimized: ${(result.outputSize / 1024 / 1024).toFixed(1)}MB`);
      console.log(`   💾 Saved: ${result.reduction}% (${((result.inputSize - result.outputSize) / 1024 / 1024).toFixed(1)}MB)\n`);
      
      totalSavings += (result.inputSize - result.outputSize);
      totalOriginalSize += result.inputSize;
    }
  }
  
  console.log('📊 Summary:');
  console.log(`   Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Total savings: ${(totalSavings / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Overall reduction: ${(totalSavings / totalOriginalSize * 100).toFixed(1)}%`);
  
  // Generate usage recommendations
  console.log('\n🔧 Next steps:');
  console.log('1. Replace image references in your components with optimized versions');
  console.log('2. Use responsive srcSet for different screen sizes');
  console.log('3. Add loading="lazy" for images below the fold');
  console.log('4. Consider using next/image for automatic optimization');
}

// Run the optimization
if (require.main === module) {
  optimizeCriticalImages()
    .then(() => {
      console.log('✅ Image optimization complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    });
}

module.exports = { optimizeImage, getImageInfo };