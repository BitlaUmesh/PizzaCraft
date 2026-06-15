require('dotenv').config();
const mongoose = require('mongoose');
const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const connectDB = require('../config/db');

const pizzas = [
  {
    name: 'Margherita Classic',
    description: 'Fresh tomato sauce, mozzarella, fragrant basil. A timeless Italian classic.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    category: 'veg',
    basePrice: 249,
    tags: ['popular', 'classic'],
  },
  {
    name: 'Veggie Supreme',
    description: 'Loaded with fresh capsicum, olives, mushrooms, onions, and sweet corn.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    category: 'veg',
    basePrice: 299,
    tags: ['popular'],
  },
  {
    name: 'Farmhouse',
    description: 'Garden fresh veggies with a creamy pesto base and premium mozzarella.',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&q=80',
    category: 'veg',
    basePrice: 319,
    tags: ['bestseller'],
  },
  {
    name: 'Chicken BBQ',
    description: 'Smoky BBQ sauce with grilled chicken, caramelized onions, and cheddar.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    category: 'non-veg',
    basePrice: 369,
    tags: ['bestseller', 'popular'],
  },
  {
    name: 'Pepperoni Blast',
    description: 'Classic pepperoni stacked generously with mozzarella and spicy arrabbiata.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80',
    category: 'non-veg',
    basePrice: 399,
    tags: ['spicy'],
  },
  {
    name: 'Spicy Paneer',
    description: 'Marinated paneer tikka with jalapeños, onions, and a fiery tomato base.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80',
    category: 'veg',
    basePrice: 329,
    tags: ['spicy', 'popular'],
  },
];

const inventory = [
  // Bases
  { name: 'Thin Crust', category: 'base', quantity: 100, threshold: 20 },
  { name: 'Thick Crust', category: 'base', quantity: 100, threshold: 20 },
  { name: 'Cheese Burst', category: 'base', quantity: 80, threshold: 20 },
  { name: 'Whole Wheat', category: 'base', quantity: 80, threshold: 20 },
  { name: 'Gluten-Free', category: 'base', quantity: 50, threshold: 15 },
  // Sauces
  { name: 'Tomato', category: 'sauce', quantity: 100, threshold: 20 },
  { name: 'Pesto', category: 'sauce', quantity: 80, threshold: 20 },
  { name: 'BBQ', category: 'sauce', quantity: 80, threshold: 20 },
  { name: 'Alfredo', category: 'sauce', quantity: 70, threshold: 20 },
  { name: 'Arrabbiata', category: 'sauce', quantity: 70, threshold: 20 },
  // Cheese
  { name: 'Mozzarella', category: 'cheese', quantity: 100, threshold: 20 },
  { name: 'Cheddar', category: 'cheese', quantity: 100, threshold: 20 },
  { name: 'Parmesan', category: 'cheese', quantity: 80, threshold: 20 },
  { name: 'Vegan Cheese', category: 'cheese', quantity: 40, threshold: 15 },
  // Veggies
  { name: 'Capsicum', category: 'veggie', quantity: 100, threshold: 20 },
  { name: 'Olives', category: 'veggie', quantity: 80, threshold: 20 },
  { name: 'Mushrooms', category: 'veggie', quantity: 80, threshold: 20 },
  { name: 'Onions', category: 'veggie', quantity: 100, threshold: 20 },
  { name: 'Tomatoes', category: 'veggie', quantity: 90, threshold: 20 },
  { name: 'Jalapeños', category: 'veggie', quantity: 60, threshold: 15 },
  { name: 'Sweet Corn', category: 'veggie', quantity: 80, threshold: 20 },
  { name: 'Spinach', category: 'veggie', quantity: 60, threshold: 15 },
];

const seed = async () => {
  try {
    await connectDB();
    await Pizza.deleteMany({});
    await Inventory.deleteMany({});

    await Pizza.insertMany(pizzas);
    await Inventory.insertMany(inventory);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@pizzacraft.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'PizzaCraft Admin',
        email: 'admin@pizzacraft.com',
        password: 'Admin@1234',
        role: 'admin',
        isEmailVerified: true,
      });
      await admin.save();
      console.log('✅ Admin user created: admin@pizzacraft.com / Admin@1234');
    }

    console.log(`✅ Seeded ${pizzas.length} pizzas`);
    console.log(`✅ Seeded ${inventory.length} inventory items`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
