/**
 * Migration script to populate Sanity CMS with existing treatments data
 *
 * Usage:
 * 1. Make sure you have SANITY_API_TOKEN in your .env.local
 * 2. Run: npx tsx scripts/migrate-to-sanity.ts
 */

import { createClient } from '@sanity/client';
import {
  allTreatments,
  treatmentCategories,
} from '../lib/data/treatments';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrateCategories() {
  console.log('\n📂 Migrating treatment categories...\n');

  for (const category of treatmentCategories) {
    try {
      const doc = {
        _type: 'treatmentCategory',
        _id: `category-${category.slug}`,
        name: category.name,
        slug: {
          _type: 'slug',
          current: category.slug,
        },
        description: category.description,
        shortDescription: category.shortDescription,
        iconName: category.iconName,
        displayOrder: treatmentCategories.indexOf(category),
        // Note: Images need to be uploaded separately or referenced
        // For now, we'll skip the image field
      };

      await client.createOrReplace(doc);
      console.log(`✅ Migrated category: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error migrating category ${category.name}:`, error);
    }
  }
}

async function migrateTreatments() {
  console.log('\n💆 Migrating treatments...\n');

  for (const treatment of allTreatments) {
    try {
      const doc = {
        _type: 'treatment',
        _id: `treatment-${treatment.slug}`,
        title: treatment.title,
        slug: {
          _type: 'slug',
          current: treatment.slug,
        },
        description: treatment.description,
        duration: treatment.duration,
        price: treatment.price,
        keyFeatures: treatment.keyFeatures || [],
        category: {
          _type: 'reference',
          _ref: `category-${treatment.category}`,
        },
        // Note: Images need to be uploaded separately
        // For now, we'll skip the image field
      };

      await client.createOrReplace(doc);
      console.log(`✅ Migrated treatment: ${treatment.title}`);
    } catch (error) {
      console.error(`❌ Error migrating treatment ${treatment.title}:`, error);
    }
  }
}

async function main() {
  console.log('🚀 Starting Sanity migration...');
  console.log(`📍 Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`);

  if (!process.env.SANITY_API_TOKEN) {
    console.error('\n❌ Error: SANITY_API_TOKEN not found in environment variables');
    console.error('Please add it to your .env.local file');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('\n❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID not found in environment variables');
    console.error('Please add it to your .env.local file');
    process.exit(1);
  }

  try {
    await migrateCategories();
    await migrateTreatments();
    console.log('\n✨ Migration completed successfully!\n');
    console.log('⚠️  Note: Images were not migrated. You will need to:');
    console.log('   1. Upload images through Sanity Studio at http://localhost:3000/studio');
    console.log('   2. Or use the Sanity CLI to upload images programmatically\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
