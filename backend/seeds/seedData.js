const mongoose = require('mongoose');
const Item = require('../models/Item');
const User = require('../models/User');
const Order = require('../models/Order');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Seeding database...');

    // Clear existing data
    await Order.deleteMany({});
    await Item.deleteMany({});
    await User.deleteMany({});

    // Create multiple users
    const users = await User.insertMany([
      {
        username: 'seller123',
        email: 'seller@tecmart.com',
        password: '$2a$10$hashedpasswordhere', // bcrypt hash for 'password123'
        role: 'user',
      },
      {
        username: 'techstore',
        email: 'tech@tecmart.com',
        password: '$2a$10$hashedpasswordhere',
        role: 'user',
      },
      {
        username: 'sportshub',
        email: 'sports@tecmart.com',
        password: '$2a$10$hashedpasswordhere',
        role: 'user',
      },
      {
        username: 'bookworm',
        email: 'books@tecmart.com',
        password: '$2a$10$hashedpasswordhere',
        role: 'user',
      },
      {
        username: 'musicman',
        email: 'music@tecmart.com',
        password: '$2a$10$hashedpasswordhere',
        role: 'user',
      },
      {
        username: 'admin',
        email: 'admin@tecmart.com',
        password: '$2a$10$adminpasswordhere',
        role: 'admin',
      },
    ]);

    // Sample items data - expanded with more variety
    const itemsData = [
      // Electronics (8 items)
      {
        title: 'Laptop',
        description: 'High-performance laptop suitable for gaming, editing, and heavy tasks. Available for short-term rental.',
        price: 800,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1588405248826-05343a68b126?w=3840&h=2160&fit=crop',
        seller: users[0]._id,
        status: 'available',
      },
      {
        title: 'Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
        price: 150,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=3840&h=2160&fit=crop',
        seller: users[0]._id,
        status: 'available',
      },
      {
        title: 'Camera',
        description: '4K professional camera perfect for content creation and videography.',
        price: 500,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=3840&h=2160&fit=crop',
        seller: users[1]._id,
        status: 'available',
      },
      {
        title: 'Smartphone',
        description: 'Latest smartphone with advanced camera system and all-day battery life.',
        price: 1200,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=3840&h=2160&fit=crop',
        seller: users[1]._id,
        status: 'available',
      },
      {
        title: 'Mouse',
        description: 'High-precision gaming mouse with customizable RGB lighting.',
        price: 80,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=3840&h=2160&fit=crop',
        seller: users[0]._id,
        status: 'sold',
      },
      {
        title: 'Speaker',
        description: 'Portable waterproof speaker with 360-degree sound.',
        price: 120,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=3840&h=2160&fit=crop',
        seller: users[1]._id,
        status: 'available',
      },
      {
        title: 'Smartwatch',
        description: 'Advanced smartwatch with health monitoring and GPS.',
        price: 400,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=3840&h=2160&fit=crop',
        seller: users[1]._id,
        status: 'available',
      },
      {
        title: 'External SSD',
        description: '1TB ultra-fast external SSD for data storage and backup.',
        price: 150,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=3840&h=2160&fit=crop',
        seller: users[0]._id,
        status: 'available',
      },

      // Sports & Fitness (6 items)
      {
        title: 'Bike',
        description: 'All-terrain mountain bike in excellent condition. Great for weekend adventures.',
        price: 300,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=3840&h=2160&fit=crop',
        seller: users[2]._id,
        status: 'available',
      },
      {
        title: 'Yoga Mat',
        description: 'Non-slip yoga mat with carrying strap. Great for yoga, pilates, and fitness routines.',
        price: 30,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=3840&h=2160&fit=crop',
        seller: users[2]._id,
        status: 'available',
      },
      {
        title: 'Racket',
        description: 'Professional grade tennis racket, perfect for competitive play.',
        price: 180,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=3840&h=2160&fit=crop',
        seller: users[2]._id,
        status: 'sold',
      },
      {
        title: 'Dumbbells',
        description: 'Complete set of adjustable dumbbells for home workouts.',
        price: 250,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=3840&h=2160&fit=crop',
        seller: users[2]._id,
        status: 'available',
      },
      {
        title: 'Basketball',
        description: 'Official size basketball in excellent condition.',
        price: 45,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=3840&h=2160&fit=crop',
        seller: users[2]._id,
        status: 'available',
      },
      {
        title: 'Goggles',
        description: 'Anti-fog swimming goggles with UV protection.',
        price: 25,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=3840&h=2160&fit=crop',
        seller: users[2]._id,
        status: 'available',
      },

      // Books & Education (6 items)
      {
        title: 'JS Book',
        description: 'Comprehensive guide to modern JavaScript with practical examples and exercises.',
        price: 50,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=3840&h=2160&fit=crop',
        seller: users[3]._id,
        status: 'available',
      },
      {
        title: 'Art Set',
        description: 'Complete art set including paints, brushes, sketchpads, and more for beginners.',
        price: 60,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=3840&h=2160&fit=crop',
        seller: users[3]._id,
        status: 'available',
      },
      {
        title: 'Python Book',
        description: 'Learn Python programming from basics to advanced concepts.',
        price: 45,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=3840&h=2160&fit=crop',
        seller: users[3]._id,
        status: 'sold',
      },
      {
        title: 'Marketing Course',
        description: 'Complete online course on digital marketing strategies.',
        price: 80,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=3840&h=2160&fit=crop',
        seller: users[3]._id,
        status: 'available',
      },
      {
        title: 'Calculus Book',
        description: 'Advanced calculus textbook for university students.',
        price: 70,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=3840&h=2160&fit=crop',
        seller: users[3]._id,
        status: 'available',
      },
      {
        title: 'Art Book',
        description: 'Comprehensive encyclopedia of art history from ancient to modern.',
        price: 120,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=3840&h=2160&fit=crop',
        seller: users[3]._id,
        status: 'available',
      },

      // Music & Instruments (5 items)
      {
        title: 'Guitar',
        description: 'Semi-hollow body electric guitar with excellent tone. Perfect for beginners and professionals.',
        price: 400,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=3840&h=2160&fit=crop',
        seller: users[4]._id,
        status: 'available',
      },
      {
        title: 'Piano',
        description: '88-key digital piano with weighted keys and built-in speakers.',
        price: 800,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=3840&h=2160&fit=crop',
        seller: users[4]._id,
        status: 'available',
      },
      {
        title: 'Drums',
        description: 'Complete 5-piece drum set with cymbals and hardware.',
        price: 650,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=3840&h=2160&fit=crop',
        seller: users[4]._id,
        status: 'sold',
      },
      {
        title: 'Ukulele',
        description: 'Beautiful soprano ukulele perfect for beginners.',
        price: 90,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=3840&h=2160&fit=crop',
        seller: users[4]._id,
        status: 'available',
      },
      {
        title: 'Microphone',
        description: 'Professional condenser microphone for recording and streaming.',
        price: 200,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=3840&h=2160&fit=crop',
        seller: users[4]._id,
        status: 'available',
      },

      // Home & Garden (4 items)
      {
        title: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe.',
        price: 85,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=3840&h=2160&fit=crop',
        seller: users[0]._id,
        status: 'available',
      },
      {
        title: 'Garden Tools',
        description: 'Complete set of gardening tools including shovel, rake, and pruners.',
        price: 65,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=3840&h=2160&fit=crop',
        seller: users[2]._id,
        status: 'available',
      },
      {
        title: 'Desk',
        description: 'Height-adjustable standing desk for home office.',
        price: 350,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=3840&h=2160&fit=crop',
        seller: users[1]._id,
        status: 'sold',
      },
      {
        title: 'Air Purifier',
        description: 'HEPA air purifier for cleaner indoor air.',
        price: 180,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=3840&h=2160&fit=crop',
        seller: users[0]._id,
        status: 'available',
      },

      // Fashion & Accessories (3 items)
      {
        title: 'Watch',
        description: 'Elegant stainless steel watch with leather strap.',
        price: 250,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=3840&h=2160&fit=crop',
        seller: users[1]._id,
        status: 'available',
      },
      {
        title: 'Backpack',
        description: 'Genuine leather backpack perfect for work or travel.',
        price: 120,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=3840&h=2160&fit=crop',
        seller: users[0]._id,
        status: 'available',
      },
      {
        title: 'Sunglasses',
        description: 'Polarized sunglasses with UV protection.',
        price: 95,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=3840&h=2160&fit=crop',
        seller: users[1]._id,
        status: 'sold',
      },
    ];

    const items = await Item.insertMany(itemsData);

    const ordersData = [
      {
        user: users[1]._id,
        item: items[4]._id, // Mouse, which is sold
        status: 'delivered',
        totalAmount: 85,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[3]._id,
        item: items[10]._id, // Racket, which is sold
        status: 'shipped',
        totalAmount: 185,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[4]._id,
        item: items[16]._id, // Python book, which is sold
        status: 'pending',
        totalAmount: 48,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[2]._id,
        item: items[24]._id, // Drums, sold
        status: 'processing',
        totalAmount: 660,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    const orders = await Order.insertMany(ordersData);

    console.log(`✅ Successfully seeded database with ${users.length} users, ${items.length} items across ${new Set(itemsData.map(item => item.category)).size} categories, and ${orders.length} orders`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
