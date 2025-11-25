/**
 * Database Seed Script
 *
 * This script will:
 * 1. Reset all collections (drop them if they exist)
 * 2. Create default data for the application
 * 3. Create an admin account with default credentials
 *
 * Usage: npx tsx scripts/seed-database.ts
 *
 * WARNING: This will DELETE ALL existing data in the database!
 */

import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import type {
  Product,
  Category,
  User,
  Coupon,
  HeroSlide,
  SiteSettingsDoc,
  DbUser,
  CouponDoc,
  HeroSlideDoc,
  CartDoc,
  WishlistDoc,
} from '@/types';

// Color palette for products
const PRODUCT_COLORS = {
  black: {
    name: 'Black',
    hex: '#000000',
    image: 'https://via.placeholder.com/300?text=Black',
  },
  white: {
    name: 'White',
    hex: '#FFFFFF',
    image: 'https://via.placeholder.com/300?text=White',
  },
  navy: {
    name: 'Navy',
    hex: '#000080',
    image: 'https://via.placeholder.com/300?text=Navy',
  },
  gray: {
    name: 'Gray',
    hex: '#808080',
    image: 'https://via.placeholder.com/300?text=Gray',
  },
  red: {
    name: 'Red',
    hex: '#FF0000',
    image: 'https://via.placeholder.com/300?text=Red',
  },
  blue: {
    name: 'Blue',
    hex: '#0000FF',
    image: 'https://via.placeholder.com/300?text=Blue',
  },
  green: {
    name: 'Green',
    hex: '#008000',
    image: 'https://via.placeholder.com/300?text=Green',
  },
  beige: {
    name: 'Beige',
    hex: '#F5F5DC',
    image: 'https://via.placeholder.com/300?text=Beige',
  },
};

// Sample products data
const SAMPLE_PRODUCTS = [
  {
    name: 'Classic White T-Shirt',
    description:
      'A timeless white t-shirt perfect for any occasion. Made from 100% organic cotton with comfortable fit.',
    price: 29.99,
    category: 'T-Shirts',
    imageUrls: [
      'https://via.placeholder.com/500?text=White+T-Shirt',
      'https://via.placeholder.com/500?text=White+T-Shirt+Detail1',
      'https://via.placeholder.com/500?text=White+T-Shirt+Detail2',
    ],
    colors: [PRODUCT_COLORS.white, PRODUCT_COLORS.black],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 150,
    discountType: 'percentage' as const,
    discountValue: 10,
    specifications: [
      { name: 'Material', value: '100% Organic Cotton' },
      { name: 'Fit', value: 'Regular' },
      { name: 'Care', value: 'Machine Wash 30°C' },
    ],
    aiHint: 'casual white basic tshirt everyday wear',
  },
  {
    name: 'Slim Fit Denim Jeans',
    description:
      'Modern slim fit jeans with perfect stretch. Available in classic blue denim with a timeless design.',
    price: 59.99,
    category: 'Jeans',
    imageUrls: [
      'https://via.placeholder.com/500?text=Blue+Jeans',
      'https://via.placeholder.com/500?text=Blue+Jeans+Back',
    ],
    colors: [PRODUCT_COLORS.navy, PRODUCT_COLORS.black],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    stock: 85,
    specifications: [
      { name: 'Material', value: '98% Cotton, 2% Elastane' },
      { name: 'Rise', value: 'Mid-Rise' },
      { name: 'Inseam', value: 'Various' },
    ],
    aiHint: 'blue denim slim fit modern casual',
  },
  {
    name: 'Summer Casual Dress',
    description:
      'Lightweight and breathable summer dress perfect for hot days. Features a flattering cut and vibrant colors.',
    price: 45.99,
    category: 'Dresses',
    imageUrls: [
      'https://via.placeholder.com/500?text=Summer+Dress',
      'https://via.placeholder.com/500?text=Summer+Dress+Side',
    ],
    colors: [PRODUCT_COLORS.red, PRODUCT_COLORS.blue, PRODUCT_COLORS.beige],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 120,
    discountType: 'fixed' as const,
    discountValue: 5,
    specifications: [
      { name: 'Material', value: '100% Linen' },
      { name: 'Length', value: 'Knee-Length' },
      { name: 'Season', value: 'Summer' },
    ],
    aiHint: 'light summer dress casual feminine',
  },
  {
    name: 'Cozy Winter Sweater',
    description:
      'Warm and comfortable winter sweater. Perfect layering piece for cold weather.',
    price: 69.99,
    category: 'Sweaters',
    imageUrls: [
      'https://via.placeholder.com/500?text=Winter+Sweater',
      'https://via.placeholder.com/500?text=Winter+Sweater+Close',
    ],
    colors: [PRODUCT_COLORS.gray, PRODUCT_COLORS.navy, PRODUCT_COLORS.beige],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 95,
    specifications: [
      { name: 'Material', value: '60% Wool, 40% Acrylic' },
      { name: 'Collar', value: 'Crew Neck' },
      { name: 'Season', value: 'Winter' },
    ],
    aiHint: 'warm cozy sweater layering piece winter',
  },
  {
    name: 'Athletic Sports Leggings',
    description:
      'High-waisted leggings with excellent stretch and moisture-wicking fabric. Ideal for workouts.',
    price: 49.99,
    category: 'Activewear',
    imageUrls: ['https://via.placeholder.com/500?text=Sports+Leggings'],
    colors: [PRODUCT_COLORS.black, PRODUCT_COLORS.navy, PRODUCT_COLORS.gray],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 110,
    specifications: [
      { name: 'Material', value: '88% Polyester, 12% Spandex' },
      { name: 'Waist', value: 'High-Waisted' },
      { name: 'Purpose', value: 'Gym/Fitness' },
    ],
    aiHint: 'athletic leggings sports gym fitness wear',
  },
];

// Sample categories
const SAMPLE_CATEGORIES = [
  {
    name: 'T-Shirts',
    imageUrl: 'https://via.placeholder.com/300?text=T-Shirts',
    aiHint: 'casual tshirts basic wear',
  },
  {
    name: 'Jeans',
    imageUrl: 'https://via.placeholder.com/300?text=Jeans',
    aiHint: 'denim jeans pants',
  },
  {
    name: 'Dresses',
    imageUrl: 'https://via.placeholder.com/300?text=Dresses',
    aiHint: 'dresses formal casual',
  },
  {
    name: 'Sweaters',
    imageUrl: 'https://via.placeholder.com/300?text=Sweaters',
    aiHint: 'sweaters warm cozy',
  },
  {
    name: 'Activewear',
    imageUrl: 'https://via.placeholder.com/300?text=Activewear',
    aiHint: 'sports gym fitness wear',
  },
  {
    name: 'Accessories',
    imageUrl: 'https://via.placeholder.com/300?text=Accessories',
    aiHint: 'accessories belts scarves',
  },
];

// Sample coupons
const SAMPLE_COUPONS = [
  {
    code: 'WELCOME10',
    discountType: 'percentage' as const,
    discountValue: 10,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    minPurchaseAmount: 50,
    usageLimit: 100,
    usageCount: 0,
    isActive: true,
  },
  {
    code: 'SUMMER20',
    discountType: 'percentage' as const,
    discountValue: 20,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    minPurchaseAmount: 100,
    usageLimit: 50,
    usageCount: 0,
    isActive: true,
  },
  {
    code: 'SAVE5',
    discountType: 'fixed' as const,
    discountValue: 5,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    minPurchaseAmount: 30,
    usageLimit: null,
    usageCount: 0,
    isActive: true,
  },
];

// Sample hero slides
const SAMPLE_HERO_SLIDES = [
  {
    title: 'Summer Collection',
    subtitle: 'Discover the latest summer styles',
    imageUrl: 'https://via.placeholder.com/1200x400?text=Summer+Collection',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    displayOrder: 1,
    isActive: true,
    aiHint: 'summer collection banner bright colors',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh designs just for you',
    imageUrl: 'https://via.placeholder.com/1200x400?text=New+Arrivals',
    buttonText: 'Explore',
    buttonLink: '/shop?sort=newest',
    displayOrder: 2,
    isActive: true,
    aiHint: 'new arrivals fresh designs trendy',
  },
  {
    title: 'Special Offer',
    subtitle: 'Get up to 30% off on selected items',
    imageUrl: 'https://via.placeholder.com/1200x400?text=Special+Offer',
    buttonText: 'View Deals',
    buttonLink: '/shop?discount=true',
    displayOrder: 3,
    isActive: true,
    aiHint: 'special offer discount sale banner',
  },
];

// Sample users (including admin)
async function generateUsers() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  return [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      hashedPassword: adminPassword,
      role: 'admin' as const,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      hashedPassword: userPassword,
      role: 'user' as const,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      hashedPassword: userPassword,
      role: 'user' as const,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

// Collections to reset (drop if they exist)
const COLLECTIONS_TO_RESET = [
  'users',
  'products',
  'categories',
  'coupons',
  'hero_slides',
  'site_settings',
  'carts',
  'wishlist',
  'orders',
  'addresses',
  'password_reset_tokens',
];

async function resetDatabase() {
  console.log('🔄 Resetting database...');

  try {
    const { db } = await connectToDatabase();

    // Drop all collections
    for (const collectionName of COLLECTIONS_TO_RESET) {
      try {
        await db.collection(collectionName).drop();
        console.log(`✅ Dropped collection: ${collectionName}`);
      } catch (error: any) {
        // Collection might not exist, that's fine
        if (!error.message.includes('ns not found')) {
          console.warn(
            `⚠️  Warning dropping ${collectionName}:`,
            error.message
          );
        }
      }
    }

    console.log('✨ Database reset complete!\n');
  } catch (error: any) {
    console.error('❌ Error resetting database:', error.message);
    throw error;
  }
}

async function seedUsers() {
  console.log('👥 Seeding users...');

  try {
    const { db } = await connectToDatabase();
    const users = await generateUsers();
    const usersCollection = db.collection('users');

    const result = await usersCollection.insertMany(users as any[]);
    const userCount = Object.keys(result.insertedIds).length;
    console.log(`✅ Created ${userCount} users`);
    console.log('   - Admin: admin@example.com / admin123');
    console.log('   - User 1: john@example.com / user123');
    console.log('   - User 2: jane@example.com / user123\n');

    return result.insertedIds;
  } catch (error: any) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
}

async function seedCategories() {
  console.log('📁 Seeding categories...');

  try {
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection('categories');

    const categories = SAMPLE_CATEGORIES.map((cat) => ({
      name: cat.name,
      imageUrl: cat.imageUrl,
      aiHint: cat.aiHint,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await categoriesCollection.insertMany(categories as any[]);
    const categoryCount = Object.keys(result.insertedIds).length;
    console.log(`✅ Created ${categoryCount} categories\n`);

    return result.insertedIds;
  } catch (error: any) {
    console.error('❌ Error seeding categories:', error.message);
    throw error;
  }
}

async function seedProducts() {
  console.log('🛍️  Seeding products...');

  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    const products = SAMPLE_PRODUCTS.map((product) => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await productsCollection.insertMany(products as any[]);
    const productCount = Object.keys(result.insertedIds).length;
    console.log(`✅ Created ${productCount} products\n`);

    return result.insertedIds;
  } catch (error: any) {
    console.error('❌ Error seeding products:', error.message);
    throw error;
  }
}

async function seedCoupons() {
  console.log('🎟️  Seeding coupons...');

  try {
    const { db } = await connectToDatabase();
    const couponsCollection = db.collection('coupons');

    const coupons = SAMPLE_COUPONS.map((coupon) => ({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiryDate: coupon.expiryDate,
      minPurchaseAmount: coupon.minPurchaseAmount || null,
      usageLimit: coupon.usageLimit || null,
      usageCount: coupon.usageCount,
      isActive: coupon.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await couponsCollection.insertMany(coupons as any[]);
    const couponCount = Object.keys(result.insertedIds).length;
    console.log(`✅ Created ${couponCount} coupons`);
    SAMPLE_COUPONS.forEach((coupon) => {
      console.log(
        `   - ${coupon.code}: ${coupon.discountValue}${
          coupon.discountType === 'percentage' ? '%' : '$'
        } off`
      );
    });
    console.log();

    return result.insertedIds;
  } catch (error: any) {
    console.error('❌ Error seeding coupons:', error.message);
    throw error;
  }
}

async function seedHeroSlides() {
  console.log('🎬 Seeding hero slides...');

  try {
    const { db } = await connectToDatabase();
    const slidesCollection = db.collection('hero_slides');

    const slides = SAMPLE_HERO_SLIDES.map((slide) => ({
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      displayOrder: slide.displayOrder,
      isActive: slide.isActive,
      aiHint: slide.aiHint,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await slidesCollection.insertMany(slides as any[]);
    const slideCount = Object.keys(result.insertedIds).length;
    console.log(`✅ Created ${slideCount} hero slides\n`);

    return result.insertedIds;
  } catch (error: any) {
    console.error('❌ Error seeding hero slides:', error.message);
    throw error;
  }
}

async function seedSiteSettings() {
  console.log('⚙️  Seeding site settings...');

  try {
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection('site_settings');

    const settings = {
      _id: 'global_settings',
      socialLinks: {
        facebook: 'https://facebook.com/cstyle',
        instagram: 'https://instagram.com/cstyle',
        twitter: 'https://twitter.com/cstyle',
        youtube: 'https://youtube.com/@cstyle',
      },
      updatedAt: new Date(),
    };

    await settingsCollection.insertOne(settings as any);
    console.log('✅ Created site settings with social links');
    console.log(`   - Facebook: ${settings.socialLinks.facebook}`);
    console.log(`   - Instagram: ${settings.socialLinks.instagram}`);
    console.log(`   - Twitter: ${settings.socialLinks.twitter}`);
    console.log(`   - YouTube: ${settings.socialLinks.youtube}\n`);
  } catch (error: any) {
    console.error('❌ Error seeding site settings:', error.message);
    throw error;
  }
}

async function seedEmptyCollections() {
  console.log('📚 Initializing empty collections...');

  try {
    const { db } = await connectToDatabase();

    // Initialize empty collections with indexes
    const emptyCollections = [
      'carts',
      'wishlist',
      'orders',
      'addresses',
      'password_reset_tokens',
    ];

    for (const collectionName of emptyCollections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error: any) {
        // Collection might already exist, that's fine
        if (!error.message.includes('already exists')) {
          console.warn(`⚠️  Note: ${collectionName} - ${error.message}`);
        }
      }
    }
    console.log();
  } catch (error: any) {
    console.error('❌ Error initializing collections:', error.message);
    throw error;
  }
}

async function main() {
  console.log(
    '\n╔═══════════════════════════════════════════════════════════╗'
  );
  console.log('║          🌱 C-STYLE DATABASE SEED SCRIPT 🌱              ║');
  console.log(
    '╚═══════════════════════════════════════════════════════════╝\n'
  );

  try {
    // Test connection
    console.log('🔗 Testing database connection...');
    const { db } = await connectToDatabase();
    console.log(
      '✅ Connected to database: ' +
        (process.env.MONGODB_DB_NAME || 'Cstyle_ecommerce')
    );
    console.log();

    // Reset database
    await resetDatabase();

    // Seed data
    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedCoupons();
    await seedHeroSlides();
    await seedSiteSettings();
    await seedEmptyCollections();

    console.log(
      '╔═══════════════════════════════════════════════════════════╗'
    );
    console.log('║           ✨ DATABASE SEEDING COMPLETE! ✨               ║');
    console.log(
      '╚═══════════════════════════════════════════════════════════╝\n'
    );

    console.log('📊 Summary:');
    console.log(`   - Users: 1 admin + 2 regular users`);
    console.log(`   - Products: ${SAMPLE_PRODUCTS.length}`);
    console.log(`   - Categories: ${SAMPLE_CATEGORIES.length}`);
    console.log(`   - Coupons: ${SAMPLE_COUPONS.length}`);
    console.log(`   - Hero Slides: ${SAMPLE_HERO_SLIDES.length}`);
    console.log('\n🔐 Default Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123\n');
    console.log(
      '⚠️  CHANGE THE ADMIN PASSWORD IMMEDIATELY AFTER FIRST LOGIN!\n'
    );

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MONGODB_URI environment variable is set correctly');
    console.error('2. MongoDB server is running');
    console.error('3. You have sufficient permissions\n');
    process.exit(1);
  }
}

// Run the script
main();
