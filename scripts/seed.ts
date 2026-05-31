import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || ''

const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Dinner', slug: 'cat_dinner' },
  { name: 'Arabic', slug: 'cat_arabic' },
  { name: 'Italian', slug: 'cat_italian' },
  { name: 'Asian', slug: 'cat_asian' },
  { name: 'American', slug: 'cat_american' },
  { name: 'Seafood', slug: 'cat_seafood' },
  { name: 'Grills', slug: 'cat_grills' },
  { name: 'Soups', slug: 'cat_soups' },
]

const products = [
  {
    name: 'Eggs Benedict',
    description: 'Poached eggs on toasted English muffin with smoked ham and velvety hollandaise sauce.',
    price: 48,
    calories: 480,
    cookTime: 15,
    category: 'cat_american',
    image: 'https://images.unsplash.com/photo-1608039829572-8694d94e4f29?w=400&h=300&fit=crop',
    ingredients: ['Poached eggs', 'English muffin', 'Hollandaise', 'Smoked ham', 'Chives'],
    discount: 0,
  },
  {
    name: 'Shakshuka',
    description: 'Eggs poached in spiced tomato and pepper sauce, served with warm bread.',
    price: 42,
    calories: 320,
    cookTime: 20,
    category: 'cat_arabic',
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400&h=300&fit=crop',
    ingredients: ['Eggs', 'Tomatoes', 'Bell peppers', 'Spices', 'Bread'],
    discount: 0,
  },
  {
    name: 'Buttermilk Pancakes',
    description: 'Fluffy buttermilk pancakes with maple syrup, fresh berries, and whipped cream.',
    price: 32,
    calories: 520,
    cookTime: 12,
    category: 'cat_american',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    ingredients: ['Buttermilk', 'Flour', 'Maple syrup', 'Berries', 'Cream'],
    discount: 15,
  },
  {
    name: 'Avocado Toast',
    description: 'Smashed avocado on artisan sourdough with poached egg and microgreens.',
    price: 45,
    calories: 380,
    cookTime: 10,
    category: 'cat_american',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    ingredients: ['Avocado', 'Sourdough', 'Poached egg', 'Microgreens', 'Lemon'],
    discount: 0,
  },
  {
    name: 'Full English Breakfast',
    description: 'Classic English breakfast with eggs, bacon, sausage, beans, toast, mushrooms and tomatoes.',
    price: 62,
    calories: 850,
    cookTime: 25,
    category: 'cat_dinner',
    image: 'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=400&h=300&fit=crop',
    ingredients: ['Eggs', 'Bacon', 'Sausage', 'Beans', 'Toast', 'Mushrooms', 'Tomatoes'],
    discount: 0,
  },
  {
    name: 'French Toast',
    description: 'Brioche French toast with cinnamon, vanilla, maple syrup, and seasonal fruits.',
    price: 40,
    calories: 450,
    cookTime: 15,
    category: 'cat_dinner',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop',
    ingredients: ['Brioche', 'Eggs', 'Cinnamon', 'Vanilla', 'Maple syrup', 'Fruits'],
    discount: 0,
  },
  {
    name: 'Club Sandwich',
    description: 'Triple-decker with grilled chicken, bacon, lettuce, tomato, and egg with fries.',
    price: 55,
    calories: 680,
    cookTime: 18,
    category: 'cat_american',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    ingredients: ['Chicken', 'Bacon', 'Lettuce', 'Tomato', 'Egg', 'Fries'],
    discount: 0,
  },
  {
    name: 'Beef Burger Deluxe',
    description: 'Premium Angus beef patty with cheddar, caramelized onions, pickles, and truffle fries.',
    price: 54,
    calories: 920,
    cookTime: 20,
    category: 'cat_american',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    ingredients: ['Angus beef', 'Cheddar', 'Onions', 'Pickles', 'Truffle fries'],
    discount: 20,
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with San Marzano tomatoes, fresh mozzarella, and basil.',
    price: 58,
    calories: 720,
    cookTime: 15,
    category: 'cat_italian',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil', 'Olive oil', 'Pizza dough'],
    discount: 0,
  },
  {
    name: 'Spaghetti Carbonara',
    description: 'Traditional Roman pasta with guanciale, pecorino, egg yolk, and black pepper.',
    price: 52,
    calories: 650,
    cookTime: 18,
    category: 'cat_italian',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
    ingredients: ['Spaghetti', 'Guanciale', 'Pecorino', 'Egg yolk', 'Black pepper'],
    discount: 0,
  },
  {
    name: 'Grilled Salmon',
    description: 'Atlantic salmon fillet with lemon butter sauce, asparagus, and herb rice.',
    price: 78,
    calories: 520,
    cookTime: 22,
    category: 'cat_seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    ingredients: ['Salmon', 'Lemon', 'Butter', 'Asparagus', 'Rice', 'Herbs'],
    discount: 0,
  },
  {
    name: 'Shrimp Pad Thai',
    description: 'Stir-fried rice noodles with shrimp, peanuts, bean sprouts, and tamarind sauce.',
    price: 48,
    calories: 580,
    cookTime: 15,
    category: 'cat_asian',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
    ingredients: ['Rice noodles', 'Shrimp', 'Peanuts', 'Bean sprouts', 'Tamarind'],
    discount: 10,
  },
  {
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in creamy tomato curry sauce with basmati rice and naan bread.',
    price: 52,
    calories: 620,
    cookTime: 25,
    category: 'cat_asian',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    ingredients: ['Chicken', 'Tomato sauce', 'Cream', 'Spices', 'Rice', 'Naan'],
    discount: 0,
  },
  {
    name: 'Lamb Kofta',
    description: 'Grilled lamb skewers with tahini sauce, pickled vegetables, and pita bread.',
    price: 65,
    calories: 580,
    cookTime: 20,
    category: 'cat_arabic',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
    ingredients: ['Lamb', 'Tahini', 'Pickles', 'Pita', 'Spices'],
    discount: 0,
  },
  {
    name: 'Mixed Grill Platter',
    description: 'Assortment of grilled meats including lamb chops, chicken, and beef with sides.',
    price: 120,
    calories: 1200,
    cookTime: 35,
    category: 'cat_grills',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    ingredients: ['Lamb chops', 'Chicken', 'Beef', 'Vegetables', 'Rice'],
    discount: 0,
  },
  {
    name: 'Ribeye Steak',
    description: 'Premium 300g ribeye steak with garlic butter, roasted potatoes, and seasonal vegetables.',
    price: 145,
    calories: 980,
    cookTime: 25,
    category: 'cat_grills',
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop',
    ingredients: ['Ribeye', 'Garlic butter', 'Potatoes', 'Vegetables'],
    discount: 0,
  },
  {
    name: 'Tom Yum Soup',
    description: 'Spicy Thai soup with shrimp, mushrooms, lemongrass, and lime leaves.',
    price: 38,
    calories: 180,
    cookTime: 15,
    category: 'cat_soups',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop',
    ingredients: ['Shrimp', 'Mushrooms', 'Lemongrass', 'Lime leaves', 'Chili'],
    discount: 0,
  },
  {
    name: 'Lobster Bisque',
    description: 'Creamy lobster soup with cognac, cream, and a touch of cayenne pepper.',
    price: 58,
    calories: 320,
    cookTime: 20,
    category: 'cat_soups',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    ingredients: ['Lobster', 'Cream', 'Cognac', 'Cayenne', 'Herbs'],
    discount: 5,
  },
  {
    name: 'Hummus & Falafel',
    description: 'Creamy hummus with crispy falafel, pickles, and warm pita bread.',
    price: 35,
    calories: 420,
    cookTime: 12,
    category: 'cat_arabic',
    image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=400&h=300&fit=crop',
    ingredients: ['Chickpeas', 'Tahini', 'Falafel', 'Pita', 'Pickles'],
    discount: 0,
  },
  {
    name: 'Seafood Paella',
    description: 'Spanish rice with shrimp, mussels, calamari, and saffron in a traditional pan.',
    price: 88,
    calories: 720,
    cookTime: 30,
    category: 'cat_seafood',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&h=300&fit=crop',
    ingredients: ['Rice', 'Shrimp', 'Mussels', 'Calamari', 'Saffron'],
    discount: 0,
  },
]

const settings = {
  restaurantName: 'Warwick Restaurant',
  logo: '',
  heroButtonText: 'Explore Our',
  heroTitle: 'Food Menu',
  phone: '+966 41 555 5555',
  whatsapp: '96600000000',
  email: 'info@warwick.example',
  address: '123 Gourmet Avenue, Culinary District',
  openingHours: 'Open Daily: 11:00 AM - 11:00 PM',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  welcomePopup: {
    title: 'Eid Mubarak! 🌙',
    subtitle: 'Celebrate the blessed season with us',
    discountText: '20% OFF',
    codeText: 'Use code: EID2024',
    message: 'Enjoy our special Eid feast menu with family & friends.',
  },
  dealsCountdown: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
}

const adminUser = {
  email: 'abusayeedriday@gmail.com',
  password: '587710',
  name: 'Admin',
  role: 'admin',
}

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db('warwick_restaurant')

    // Clear existing data
    await db.collection('categories').deleteMany({})
    await db.collection('products').deleteMany({})
    await db.collection('settings').deleteMany({})
    await db.collection('users').deleteMany({})

    // Insert categories
    await db.collection('categories').insertMany(categories)
    console.log('Categories seeded')

    // Insert products with timestamps
    const productsWithTimestamps = products.map((p) => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    await db.collection('products').insertMany(productsWithTimestamps)
    console.log('Products seeded')

    // Insert settings
    await db.collection('settings').insertOne(settings)
    console.log('Settings seeded')

    // Insert admin user (plain text password as requested)
    await db.collection('users').insertOne(adminUser)
    console.log('Admin user created')

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seed()
