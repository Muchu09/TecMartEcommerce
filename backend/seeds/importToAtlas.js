/**
 * Atlas Data Import Script
 * 
 * Run this AFTER deploying to Render, from Render's shell:
 *   node seeds/importToAtlas.js
 * 
 * Or run locally ONLY if you can reach Atlas (port 27017 unblocked):
 *   node seeds/importToAtlas.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Item = require('../models/Item');
const User = require('../models/User');
const Order = require('../models/Order');

async function importData() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('localhost')) {
    console.error('❌ Set MONGO_URI to your Atlas connection string in .env first!');
    process.exit(1);
  }

  console.log('🔌 Connecting to Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected to Atlas\n');

  // === IMPORT ITEMS ===
  const itemsFile = path.join(__dirname, '../items_export.json');
  if (fs.existsSync(itemsFile)) {
    const items = JSON.parse(fs.readFileSync(itemsFile, 'utf-8'));
    const existing = await Item.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  Items collection already has ${existing} docs — skipping. Delete them first if you want to re-import.`);
    } else {
      await Item.insertMany(items, { ordered: false });
      console.log(`✅ Imported ${items.length} items`);
    }
  } else {
    console.log('⚠️  items_export.json not found — skipping items');
  }

  // === IMPORT USERS ===
  const usersFile = path.join(__dirname, '../users_export.json');
  if (fs.existsSync(usersFile)) {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const existing = await User.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  Users collection already has ${existing} docs — skipping. Delete them first if you want to re-import.`);
    } else {
      await User.insertMany(users, { ordered: false });
      console.log(`✅ Imported ${users.length} users`);
    }
  } else {
    console.log('⚠️  users_export.json not found — skipping users');
  }

  // === IMPORT ORDERS ===
  const ordersFile = path.join(__dirname, '../orders_export.json');
  if (fs.existsSync(ordersFile)) {
    const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
    const existing = await Order.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  Orders collection already has ${existing} docs — skipping.`);
    } else {
      await Order.insertMany(orders, { ordered: false });
      console.log(`✅ Imported ${orders.length} orders`);
    }
  } else {
    console.log('⚠️  orders_export.json not found — skipping orders');
  }

  await mongoose.disconnect();
  console.log('\n🎉 Import complete! Your Atlas database is ready.');
}

importData().catch(e => {
  console.error('❌ Import failed:', e.message);
  process.exit(1);
});
