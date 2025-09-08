const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration for image optimization
const CONFIG = {
  quality: {
    webp: 80,
    jpeg: 85,
    png: 90,
    avif: 75
  },
  sizes: [320, 640, 1024, 1280, 1536, 1920], // Responsive breakpoints (configurable)
  outputDir: 'public/images/optimized',
  targetMaxSize: 500 * 1024, // 500KB target
  blurSize: 16, // Size for blur placeholder generation
  blurMaxBytes: 800, // Cap base64 length to avoid HTML bloat
  blurDataDir: 'lib/data',
  formats: ['webp', 'avif'], // Modern formats with fallbacks
};

// Images that need optimization
const IMAGES_TO_OPTIMIZE = [
  // Critical images (>10MB)
  'public/images/treatments/bacial.png',
  'public/images/categories/person_having_reflexology_treatment.png',
  'public/images/mainPage/young-woman-having-face-massage-relaxing-spa-salon.jpg',
  'public/images/categories/woman-salon-making-beauty-treatment-with-gua-sha-stone.jpg',
  // Additional images for metadata generation
  'public/images/about/heavenly-treatments-room.jpg',
  'public/images/about/owner-of-heavenly-treatments.jpg'
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

async function generateBlurPlaceholder(inputPath) {
  try {
    const image = sharp(inputPath);
    let quality = 20;
    let size = CONFIG.blurSize;
    
    // Generate initial placeholder
    let { data, info } = await image
      .resize(size, size, { fit: 'inside' })
      .webp({ quality })
      .toBuffer({ resolveWithObject: true });
    
    let base64 = data.toString('base64');
    
    // Reduce quality/size if base64 exceeds limit
    while (base64.length > CONFIG.blurMaxBytes && (quality > 5 || size > 8)) {
      if (quality > 5) {
        quality -= 5;
      } else if (size > 8) {
        size = Math.max(8, Math.floor(size * 0.8));
      }
      
      const result = await image
        .resize(size, size, { fit: 'inside' })
        .webp({ quality })
        .toBuffer({ resolveWithObject: true });
      
      data = result.data;
      info = result.info;
      base64 = data.toString('base64');
    }
    
    return {
      src: `data:image/webp;base64,${base64}`,
      width: info.width,
      height: info.height
    };
  } catch (error) {
    console.error(`Error generating blur placeholder for ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Create WebP version with adaptive compression
    const webpPath = outputPath.replace(/\.[^.]+$/, '.webp');
    
    // Calculate adaptive quality based on input size and target
    const inputSize = (await fs.stat(inputPath)).size;
    let quality = CONFIG.quality.webp;
    
    // Adaptive quality for targetMaxSize compliance
    if (inputSize > CONFIG.targetMaxSize * 2) {
      quality = Math.max(60, quality - 20); // Very large files: reduce more
    } else if (inputSize > CONFIG.targetMaxSize) {
      quality = Math.max(70, quality - 10); // Large files: reduce moderately
    }
    
    // Additional reduction for very large images (>10MB)
    if (inputSize > 10 * 1024 * 1024) {
      quality = Math.max(50, quality - 10);
    }
    
    // Generate WebP with quality adjustment if needed
    await image.clone().webp({ quality }).toFile(webpPath);
    
    // Check if output exceeds target size and re-encode if needed
    let outputStats = await fs.stat(webpPath);
    if (CONFIG.targetMaxSize && outputStats.size > CONFIG.targetMaxSize) {
      const reducedQuality = Math.max(50, Math.floor(quality * 0.85));
      await image.clone().webp({ quality: reducedQuality }).toFile(webpPath);
      outputStats = await fs.stat(webpPath);
      quality = reducedQuality;
    }
    
    // Generate responsive sizes for WebP in parallel
    const responsivePromises = CONFIG.sizes
      .filter(size => size < metadata.width)
      .map(async (size) => {
        const responsivePath = webpPath.replace(/\.webp$/, `_${size}w.webp`);
        await image.clone()
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality })
          .toFile(responsivePath);
        const rStat = await fs.stat(responsivePath);
        return { size, outputSize: rStat.size };
      });
    
    const responsiveResults = await Promise.all(responsivePromises);
    const responsiveSizes = responsiveResults.map(r => r.size);
    const responsiveOutputSizes = responsiveResults.map(r => r.outputSize);
    
    // Generate blur placeholder
    const blurData = await generateBlurPlaceholder(inputPath);
    
    // outputStats already declared above after targetMaxSize check
    const totalOutputSize = outputStats.size + responsiveOutputSizes.reduce((a, b) => a + b, 0);
    return {
      input: inputPath,
      output: webpPath,
      inputSize: inputSize,
      outputSize: outputStats.size,
      totalOutputSize,
      reduction: ((inputSize - totalOutputSize) / inputSize * 100).toFixed(1),
      responsiveSizes,
      responsiveOutputSizes,
      blurData,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      }
    };
    
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function saveImageMetadata(imageData) {
  try {
    await fs.mkdir(CONFIG.blurDataDir, { recursive: true });
    const filePath = path.join(CONFIG.blurDataDir, 'image-metadata.ts');
    
    const content = `/* eslint-disable */
/* prettier-ignore */
/** @generated — Auto-generated. DO NOT EDIT. */
// Auto-generated image metadata for optimization
// This file contains blur placeholders and responsive image data

export interface ImageMetadata {
  src: string;
  blurDataURL?: string;
  width: number;
  height: number;
  sizes: number[];
  priority?: boolean;
}

export const imageMetadata: Record<string, ImageMetadata> = {
${imageData.map(data => {
  const fileName = path.basename(data.input, path.extname(data.input));
  const webpPathPosix = data.output.split(path.sep).join(path.posix.sep);
  const optimizedPath = '/' + path.posix.relative('public', webpPathPosix);
  return `  '${fileName}': {
    src: ${JSON.stringify(optimizedPath)},
    blurDataURL: ${JSON.stringify(data.blurData?.src ?? '')},
    width: ${data.metadata.width},
    height: ${data.metadata.height},
    sizes: [${data.responsiveSizes.join(', ')}],
    priority: ${['young-woman-having-face-massage-relaxing-spa-salon'].includes(fileName)}
  }`;
}).join(',\n')}
};

// Helper function to get image metadata by src/filename/path/URL
export function getImageMetadata(src: string): ImageMetadata | undefined {
  if (!src) return undefined;
  
  // Skip external URLs, data URLs, and protocol-relative URLs
  if (/^(?:https?:|data:|\\/\\/)/i.test(src)) return undefined;
  
  // Remove query params and hash fragments
  const clean = src.split(/[?#]/, 1)[0];
  
  // Extract basename handling both forward and back slashes
  const base = clean.split('/').pop()?.split('\\\\').pop() ?? clean;
  
  // Remove extension to get the key
  const key = base.includes('.') ? base.slice(0, base.lastIndexOf('.')) : base;
  return imageMetadata[key];
}

// Helper to extract filename from full path for metadata lookup
export function extractFilenameFromPath(imagePath: string): string {
  if (!imagePath) return '';
  
  // Remove query params and hash fragments
  const clean = imagePath.split(/[?#]/, 1)[0];
  
  // Extract basename handling both forward and back slashes
  const base = clean.split('/').pop()?.split('\\\\').pop() ?? clean;
  
  // Remove extension to get the key
  return base.includes('.') ? base.slice(0, base.lastIndexOf('.')) : base;
}
`;
    
    await fs.writeFile(filePath, content);
    console.log(`✅ Image metadata saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving image metadata:', error);
  }
}

async function optimizeCriticalImages() {
  console.log('🚀 Starting advanced image optimization...\n');
  
  await createOutputDir();
  
  let totalOptimizedSize = 0;
  let totalOriginalSize = 0;
  const optimizedImages = [];
  
  for (const imagePath of IMAGES_TO_OPTIMIZE) {
    console.log(`📸 Processing: ${imagePath}`);
    
    const info = await getImageInfo(imagePath);
    if (!info) continue;
    
    console.log(`   Original: ${(info.size / 1024 / 1024).toFixed(1)}MB (${info.width}x${info.height})`);
    
    const fileName = path.basename(imagePath);
    const outputPath = path.join(CONFIG.outputDir, fileName);
    
    const result = await optimizeImage(imagePath, outputPath);
    if (result) {
      const displaySize = result.totalOutputSize || result.outputSize;
      console.log(`   Optimized: ${(result.outputSize / 1024 / 1024).toFixed(1)}MB (base)`);
      console.log(`   📱 Total with variants: ${(displaySize / 1024 / 1024).toFixed(1)}MB`);
      console.log(`   💾 Saved: ${result.reduction}% (${((result.inputSize - displaySize) / 1024 / 1024).toFixed(1)}MB)`);
      console.log(`   🎨 Blur placeholder: ${result.blurData ? 'Generated' : 'Failed'}`);
      console.log(`   📱 Responsive sizes: ${result.responsiveSizes.length} variants\n`);
      
      totalOptimizedSize += displaySize;
      totalOriginalSize += result.inputSize;
      optimizedImages.push(result);
    }
  }
  
  // Save metadata file for TypeScript usage
  if (optimizedImages.length > 0) {
    await saveImageMetadata(optimizedImages);
  }
  
  console.log('📊 Summary:');
  console.log(`   Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Total optimized size (incl. variants): ${(totalOptimizedSize / 1024 / 1024).toFixed(1)}MB`);
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  console.log(`   Total savings: ${(totalSavings / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Overall reduction: ${(totalSavings / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`   Blur placeholders: ${optimizedImages.filter(img => img.blurData).length}/${optimizedImages.length}`);
  
  // Generate usage recommendations
  console.log('\n🔧 Next steps:');
  console.log('1. Use the generated imageMetadata for blur placeholders');
  console.log('2. Implement priority loading for above-the-fold images');
  console.log('3. Use responsive srcSet with the generated sizes');
  console.log('4. Consider lazy loading for images below the fold');
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