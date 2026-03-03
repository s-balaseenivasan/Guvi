require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Food image URLs (Unsplash) ───────────────────────────────────────────────
const IMG = {
  // Restaurant banners
  southIndian:   'https://images.unsplash.com/photo-1596797038503-ea881e0b5ec4?w=800&auto=format&fit=crop',
  biryani:       'https://images.unsplash.com/photo-1631452180519-a6c8f0a3ac3d?w=800&auto=format&fit=crop',
  northIndian:   'https://images.unsplash.com/photo-1585325701954-4a65ee7e82a1?w=800&auto=format&fit=crop',
  streetFood:    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
  healthy:       'https://images.unsplash.com/photo-1512621776951-a57141f09b8b?w=800&auto=format&fit=crop',
  seafood:       'https://images.unsplash.com/photo-1565557702-1ba68efb4700?w=800&auto=format&fit=crop',
  pizza:         'https://images.unsplash.com/photo-1565299624516-98e09826cd6f?w=800&auto=format&fit=crop',
  chinese:       'https://images.unsplash.com/photo-1563612116-75b08a2e15a7?w=800&auto=format&fit=crop',
  burger:        'https://images.unsplash.com/photo-1568901346745-96e59e6cf9c0?w=800&auto=format&fit=crop',
  thali:         'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
  bakery:        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
  thai:          'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop',
  mughlai:       'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop',
  mexican:       'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop',
  sushi:         'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop',
  andhra:        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop',
  bbq:           'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
  middleEastern: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop',
  gujarati:      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop',
  punjabi:       'https://images.unsplash.com/photo-1585025100723-93e7a61a8c46?w=800&auto=format&fit=crop',
  coastal:       'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=800&auto=format&fit=crop',
  delhi:         'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop',
  veggie:        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
  kerala:        'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=800&auto=format&fit=crop',
  french:        'https://images.unsplash.com/photo-1550617931-e17a7a56d719?w=800&auto=format&fit=crop',
};

// ─── Menu item images ─────────────────────────────────────────────────────────
const D = {
  masalaDosa:       'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop',
  idli:             'https://images.unsplash.com/photo-1571197119669-4e5eb0e79dc4?w=400&auto=format&fit=crop',
  uttapam:          'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop',
  filterCoffee:     'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop',
  curdRice:         'https://images.unsplash.com/photo-1596797038503-ea881e0b5ec4?w=400&auto=format&fit=crop',
  lemonRice:        'https://images.unsplash.com/photo-1596797038503-ea881e0b5ec4?w=400&auto=format&fit=crop',
  vadaPav:          'https://images.unsplash.com/photo-1585025100723-93e7a61a8c46?w=400&auto=format&fit=crop',
  pavBhaji:         'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&auto=format&fit=crop',
  bhelpuri:         'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&auto=format&fit=crop',
  chai:             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
  tandooriChicken:  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop',
  seekhKebab:       'https://images.unsplash.com/photo-1558030137-a56c1b194876?w=400&auto=format&fit=crop',
  dalTadka:         'https://images.unsplash.com/photo-1585325701954-4a65ee7e82a1?w=400&auto=format&fit=crop',
  lassi:            'https://images.unsplash.com/photo-1605522469906-3fe226b356bc?w=400&auto=format&fit=crop',
  gulabJamun:       'https://images.unsplash.com/photo-1571197119669-4e5eb0e79dc4?w=400&auto=format&fit=crop',
  caesarSalad:      'https://images.unsplash.com/photo-1540189799093-462fc4f04b4f?w=400&auto=format&fit=crop',
  quinoaBowl:       'https://images.unsplash.com/photo-1512621776951-a57141f09b8b?w=400&auto=format&fit=crop',
  smoothie:         'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&auto=format&fit=crop',
  fishCurry:        'https://images.unsplash.com/photo-1565557702-1ba68efb4700?w=400&auto=format&fit=crop',
  prawnFry:         'https://images.unsplash.com/photo-1565557702-1ba68efb4700?w=400&auto=format&fit=crop',
  appam:            'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400&auto=format&fit=crop',
  coconutWater:     'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&auto=format&fit=crop',
  pizza:            'https://images.unsplash.com/photo-1565299624516-98e09826cd6f?w=400&auto=format&fit=crop',
  pasta:            'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=400&auto=format&fit=crop',
  garlicBread:      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop',
  tiramisu:         'https://images.unsplash.com/photo-1563729230-be47a71c3da7?w=400&auto=format&fit=crop',
  manchurian:       'https://images.unsplash.com/photo-1563612116-75b08a2e15a7?w=400&auto=format&fit=crop',
  friedRice:        'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop',
  noodles:          'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop',
  soup:             'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop',
  springRolls:      'https://images.unsplash.com/photo-1563612116-75b08a2e15a7?w=400&auto=format&fit=crop',
  biryani:          'https://images.unsplash.com/photo-1631452180519-a6c8f0a3ac3d?w=400&auto=format&fit=crop',
  dalBaati:         'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop',
  rajThali:         'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop',
  croissant:        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop',
  pancakes:         'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop',
  coffee:           'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop',
  eggRoll:          'https://images.unsplash.com/photo-1565557702-1ba68efb4700?w=400&auto=format&fit=crop',
  chickenRoll:      'https://images.unsplash.com/photo-1565557702-1ba68efb4700?w=400&auto=format&fit=crop',
  greenCurry:       'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&auto=format&fit=crop',
  padThai:          'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop',
  mangoStickyRice:  'https://images.unsplash.com/photo-1563729230-be47a71c3da7?w=400&auto=format&fit=crop',
  galouti:          'https://images.unsplash.com/photo-1558030137-a56c1b194876?w=400&auto=format&fit=crop',
  nihari:           'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop',
  kheer:            'https://images.unsplash.com/photo-1571197119669-4e5eb0e79dc4?w=400&auto=format&fit=crop',
  burrito:          'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop',
  nachos:           'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop',
  tacos:            'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop',
  churros:          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop',
  salmonNigiri:     'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&auto=format&fit=crop',
  californiaRoll:   'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&auto=format&fit=crop',
  ramen:            'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop',
  chettinadCurry:   'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&auto=format&fit=crop',
  pesarattu:        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop',
  burger:           'https://images.unsplash.com/photo-1568901346745-96e59e6cf9c0?w=400&auto=format&fit=crop',
  fries:            'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&auto=format&fit=crop',
  chocolateShake:   'https://images.unsplash.com/photo-1605522469906-3fe226b356bc?w=400&auto=format&fit=crop',
  dhokla:           'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&auto=format&fit=crop',
  undhiyu:          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop',
  sarsonSaag:       'https://images.unsplash.com/photo-1585025100723-93e7a61a8c46?w=400&auto=format&fit=crop',
  choleBhature:     'https://images.unsplash.com/photo-1585025100723-93e7a61a8c46?w=400&auto=format&fit=crop',
  gheeRoast:        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&auto=format&fit=crop',
  neerDosa:         'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop',
  jalebi:           'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop',
  dahiBhalla:       'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&auto=format&fit=crop',
  vegBuddha:        'https://images.unsplash.com/photo-1512621776951-a57141f09b8b?w=400&auto=format&fit=crop',
  mushroomStrog:    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop',
  porkRibs:         'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop',
  steak:            'https://images.unsplash.com/photo-1558030137-a56c1b194876?w=400&auto=format&fit=crop',
  shawarma:         'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&auto=format&fit=crop',
  hummus:           'https://images.unsplash.com/photo-1584568694271-fe2ee98c38e4?w=400&auto=format&fit=crop',
  baklava:          'https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=400&auto=format&fit=crop',
  proteinBowl:      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop',
  overnightOats:    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop',
  puttu:            'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400&auto=format&fit=crop',
  keralaSadya:      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400&auto=format&fit=crop',
  crepe:            'https://images.unsplash.com/photo-1550617931-e17a7a56d719?w=400&auto=format&fit=crop',
  cremeBrulee:      'https://images.unsplash.com/photo-1563729230-be47a71c3da7?w=400&auto=format&fit=crop',
  macarons:         'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop',
  avocadoToast:     'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop',
};

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const hours = days.map(day => ({ day, open: '09:00', close: '22:00', closed: false }));

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models/User');
  const Restaurant = require('./models/Restaurant');
  const MenuItem = require('./models/MenuItem');

  const passwordHash = await bcrypt.hash('Rest@123', 10);

  const data = [
    {
      user: { username: 'spicegarden', email: 'spicegarden@demo.com' },
      restaurant: {
        name: 'Spice Garden',
        description: 'Authentic South Indian vegetarian cuisine with traditional recipes',
        location: { street: '12 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600002' },
        cuisineType: ['South Indian', 'Vegetarian'], priceRange: 2, rating: 4.3,
        images: [IMG.southIndian],
      },
      menu: [
        { name: 'Masala Dosa', description: 'Crispy dosa with spiced potato filling', price: 89, category: 'Breakfast', image: D.masalaDosa },
        { name: 'Idli Sambar (4 pcs)', description: 'Steamed rice cakes with lentil soup', price: 69, category: 'Breakfast', image: D.idli },
        { name: 'Uttapam', description: 'Thick rice pancake topped with vegetables', price: 79, category: 'Breakfast', image: D.uttapam },
        { name: 'Sambar Vada', description: 'Crispy lentil fritters dunked in sambar', price: 75, category: 'Breakfast', image: D.idli },
        { name: 'Curd Rice', description: 'Soothing yogurt rice with tempering', price: 99, category: 'Main Course', image: D.curdRice },
        { name: 'Lemon Rice', description: 'Tangy rice with cashews and curry leaves', price: 99, category: 'Main Course', image: D.lemonRice },
        { name: 'Filter Coffee', description: 'Strong South Indian decoction with frothy milk', price: 35, category: 'Beverages', image: D.filterCoffee },
      ],
    },
    {
      user: { username: 'mumbaistreetbites', email: 'mumbaistreet@demo.com' },
      restaurant: {
        name: 'Mumbai Street Bites',
        description: 'Iconic street food from the streets of Mumbai — fast, flavourful, fun',
        location: { street: '7 Marine Drive', city: 'Mumbai', state: 'Maharashtra', zipCode: '400020' },
        cuisineType: ['Street Food', 'Snacks'], priceRange: 1, rating: 4.5,
        images: [IMG.streetFood],
      },
      menu: [
        { name: 'Vada Pav', description: 'The Mumbai burger — spiced potato fritter in a bun', price: 35, category: 'Snacks', image: D.vadaPav },
        { name: 'Pav Bhaji', description: 'Spiced vegetable mash served with buttered pav', price: 120, category: 'Main Course', image: D.pavBhaji },
        { name: 'Bhel Puri', description: 'Puffed rice tossed with chutneys and onions', price: 55, category: 'Snacks', image: D.bhelpuri },
        { name: 'Sev Puri', description: 'Crisp puris topped with chutneys and sev', price: 60, category: 'Snacks', image: D.bhelpuri },
        { name: 'Misal Pav', description: 'Spicy sprouted moth bean curry with pav', price: 110, category: 'Main Course', image: D.pavBhaji },
        { name: 'Cutting Chai', description: 'Half-cup strong masala tea', price: 20, category: 'Beverages', image: D.chai },
      ],
    },
    {
      user: { username: 'tandoorichef', email: 'tandoorichef@demo.com' },
      restaurant: {
        name: 'Tandoori Chef',
        description: 'Punjabi flavours fresh from the clay oven — robust and hearty',
        location: { street: '34 Connaught Place', city: 'Delhi', state: 'Delhi', zipCode: '110001' },
        cuisineType: ['North Indian', 'Mughlai'], priceRange: 3, rating: 4.6,
        images: [IMG.northIndian],
      },
      menu: [
        { name: 'Tandoori Chicken (Half)', description: 'Whole chicken marinated in spices, roasted in tandoor', price: 299, category: 'Starters', image: D.tandooriChicken },
        { name: 'Seekh Kebab', description: 'Minced lamb with herbs on skewers from the clay oven', price: 329, category: 'Starters', image: D.seekhKebab },
        { name: 'Dal Tadka', description: 'Yellow lentils tempered with ghee and spices', price: 189, category: 'Main Course', image: D.dalTadka },
        { name: 'Butter Roti', description: 'Whole wheat bread with generous butter', price: 35, category: 'Breads', image: D.garlicBread },
        { name: 'Lassi (Sweet)', description: 'Chilled thick yogurt drink', price: 79, category: 'Beverages', image: D.lassi },
        { name: 'Gulab Jamun', description: 'Soft khoya dumplings in sugar syrup', price: 89, category: 'Desserts', image: D.gulabJamun },
      ],
    },
    {
      user: { username: 'greenleafcafe', email: 'greenleaf@demo.com' },
      restaurant: {
        name: 'Green Leaf Cafe',
        description: 'Healthy salads, smoothies and wraps for a guilt-free meal',
        location: { street: '56 Indiranagar', city: 'Bengaluru', state: 'Karnataka', zipCode: '560038' },
        cuisineType: ['Healthy', 'Salads', 'Continental'], priceRange: 2, rating: 4.1,
        images: [IMG.healthy],
      },
      menu: [
        { name: 'Caesar Salad', description: 'Romaine, croutons, parmesan, caesar dressing', price: 199, category: 'Salads', image: D.caesarSalad },
        { name: 'Quinoa Bowl', description: 'Protein-packed quinoa with roasted veggies', price: 229, category: 'Mains', image: D.quinoaBowl },
        { name: 'Avocado Toast', description: 'Multigrain toast with smashed avocado and seeds', price: 179, category: 'Breakfast', image: D.avocadoToast },
        { name: 'Berry Smoothie', description: 'Blended strawberry, blueberry and banana', price: 149, category: 'Beverages', image: D.smoothie },
        { name: 'Veg Wrap', description: 'Whole wheat wrap with hummus and grilled veggies', price: 159, category: 'Mains', image: D.eggRoll },
        { name: 'Detox Green Juice', description: 'Spinach, cucumber, apple and ginger', price: 129, category: 'Beverages', image: D.smoothie },
      ],
    },
    {
      user: { username: 'seabreezegrill', email: 'seabreeze@demo.com' },
      restaurant: {
        name: 'Sea Breeze Grill',
        description: 'Fresh catch of the day grilled to perfection by the coast',
        location: { street: '3 Beach Road', city: 'Kochi', state: 'Kerala', zipCode: '682001' },
        cuisineType: ['Seafood', 'Kerala', 'Coastal'], priceRange: 3, rating: 4.4,
        images: [IMG.seafood],
      },
      menu: [
        { name: 'Fish Curry', description: 'Traditional Kerala red fish curry in coconut milk', price: 299, category: 'Main Course', image: D.fishCurry },
        { name: 'Prawn Fry', description: 'Crispy fried prawns with pepper and lime', price: 349, category: 'Starters', image: D.prawnFry },
        { name: 'Appam with Stew', description: 'Lacy rice pancakes with coconut vegetable stew', price: 149, category: 'Breakfast', image: D.appam },
        { name: 'Karimeen Pollichathu', description: 'Pearl spot fish wrapped in banana leaf and grilled', price: 399, category: 'Main Course', image: D.fishCurry },
        { name: 'Coconut Payasam', description: 'Rich coconut milk pudding with jaggery', price: 99, category: 'Desserts', image: D.kheer },
        { name: 'Tender Coconut Water', description: 'Fresh coconut water served chilled', price: 49, category: 'Beverages', image: D.coconutWater },
      ],
    },
    {
      user: { username: 'pizzapiazza', email: 'pizzapiazza@demo.com' },
      restaurant: {
        name: 'Pizza Piazza',
        description: 'Wood-fired pizzas and pastas crafted with imported Italian ingredients',
        location: { street: '22 Banjara Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500034' },
        cuisineType: ['Italian', 'Pizza', 'Pasta'], priceRange: 3, rating: 4.2,
        images: [IMG.pizza],
      },
      menu: [
        { name: 'Margherita Pizza', description: 'Classic tomato sauce, mozzarella, fresh basil', price: 299, category: 'Pizza', image: D.pizza },
        { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, onions', price: 379, category: 'Pizza', image: D.pizza },
        { name: 'Penne Arrabbiata', description: 'Penne in spicy tomato sauce with garlic', price: 249, category: 'Pasta', image: D.pasta },
        { name: 'Fettuccine Alfredo', description: 'Creamy white sauce pasta with parmesan', price: 279, category: 'Pasta', image: D.pasta },
        { name: 'Garlic Bread', description: 'Toasted baguette with herb garlic butter', price: 129, category: 'Sides', image: D.garlicBread },
        { name: 'Tiramisu', description: 'Classic Italian coffee dessert with mascarpone', price: 199, category: 'Desserts', image: D.tiramisu },
      ],
    },
    {
      user: { username: 'dragonpalace', email: 'dragonpalace@demo.com' },
      restaurant: {
        name: 'Dragon Palace',
        description: 'Indo-Chinese and authentic Chinese dishes in a vibrant setting',
        location: { street: '9 Park Street', city: 'Kolkata', state: 'West Bengal', zipCode: '700016' },
        cuisineType: ['Chinese', 'Indo-Chinese'], priceRange: 2, rating: 4.0,
        images: [IMG.chinese],
      },
      menu: [
        { name: 'Chicken Manchurian', description: 'Crispy chicken balls in tangy Manchurian sauce', price: 259, category: 'Starters', image: D.manchurian },
        { name: 'Veg Hakka Noodles', description: 'Stir-fried noodles with crispy vegetables', price: 179, category: 'Noodles', image: D.noodles },
        { name: 'Chicken Fried Rice', description: 'Wok-tossed rice with egg and chicken', price: 199, category: 'Rice', image: D.friedRice },
        { name: 'Hot & Sour Soup', description: 'Tangy vegetable soup with black pepper', price: 119, category: 'Soups', image: D.soup },
        { name: 'Spring Rolls (4 pcs)', description: 'Crispy rolls with cabbage and glass noodles', price: 149, category: 'Starters', image: D.springRolls },
        { name: 'Dim Sum Basket', description: 'Steamed dumplings with dipping sauce', price: 199, category: 'Starters', image: D.springRolls },
      ],
    },
    {
      user: { username: 'biryaniking', email: 'biryaniking@demo.com' },
      restaurant: {
        name: 'Biryani King',
        description: 'The finest dum biryani in the city — slow cooked, richly spiced',
        location: { street: '1 Charminar Road', city: 'Hyderabad', state: 'Telangana', zipCode: '500002' },
        cuisineType: ['Biryani', 'Mughlai', 'North Indian'], priceRange: 2, rating: 4.7,
        images: [IMG.biryani],
      },
      menu: [
        { name: 'Hyderabadi Chicken Biryani', description: 'Dum-cooked basmati with spiced chicken', price: 329, category: 'Biryani', image: D.biryani },
        { name: 'Mutton Dum Biryani', description: 'Slow-cooked mutton layered with saffron rice', price: 399, category: 'Biryani', image: D.biryani },
        { name: 'Veg Dum Biryani', description: 'Aromatic vegetables slow-cooked in biryani style', price: 229, category: 'Biryani', image: D.biryani },
        { name: 'Egg Biryani', description: 'Fragrant rice with boiled eggs and caramelised onions', price: 249, category: 'Biryani', image: D.biryani },
        { name: 'Mirchi Ka Salan', description: 'Traditional Hyderabadi chilli curry', price: 99, category: 'Sides', image: D.dalTadka },
        { name: 'Double Ka Meetha', description: 'Hyderabadi bread pudding with rabri', price: 119, category: 'Desserts', image: D.gulabJamun },
      ],
    },
    {
      user: { username: 'rajasthanidhaba', email: 'rajasthanidhaba@demo.com' },
      restaurant: {
        name: 'Rajasthani Dhaba',
        description: 'Rustic Rajasthani thali and authentic dal-baati-churma',
        location: { street: '55 MI Road', city: 'Jaipur', state: 'Rajasthan', zipCode: '302001' },
        cuisineType: ['Rajasthani', 'North Indian', 'Thali'], priceRange: 2, rating: 4.3,
        images: [IMG.thali],
      },
      menu: [
        { name: 'Dal Baati Churma', description: 'Baked wheat balls with lentil curry and sweet churma', price: 249, category: 'Main Course', image: D.dalBaati },
        { name: 'Gatte Ki Sabzi', description: 'Gram flour dumplings in tangy yogurt gravy', price: 189, category: 'Main Course', image: D.dalTadka },
        { name: 'Ker Sangri', description: 'Desert beans and berries in spiced gravy', price: 179, category: 'Main Course', image: D.dalTadka },
        { name: 'Bajre Ki Roti', description: 'Traditional millet flatbread with ghee', price: 39, category: 'Breads', image: D.garlicBread },
        { name: 'Rajasthani Thali', description: 'Full thali with dal, sabzi, roti, rice, papad, dessert', price: 349, category: 'Thali', image: D.rajThali },
        { name: 'Ghewar', description: 'Rajasthani honeycomb sweet soaked in sugar syrup', price: 99, category: 'Desserts', image: D.jalebi },
      ],
    },
    {
      user: { username: 'thebakehouse', email: 'bakehouse@demo.com' },
      restaurant: {
        name: 'The Bake House',
        description: 'Artisan breads, pastries and all-day breakfast in a cosy bakery cafe',
        location: { street: '8 Koregaon Park', city: 'Pune', state: 'Maharashtra', zipCode: '411001' },
        cuisineType: ['Bakery', 'Continental', 'Breakfast'], priceRange: 2, rating: 4.2,
        images: [IMG.bakery],
      },
      menu: [
        { name: 'Croissant', description: 'Buttery flaky French croissant, plain or with jam', price: 89, category: 'Bakery', image: D.croissant },
        { name: 'Full English Breakfast', description: 'Eggs, sausage, beans, toast and grilled tomato', price: 299, category: 'Breakfast', image: D.overnightOats },
        { name: 'Pancake Stack', description: 'Fluffy pancakes with maple syrup and butter', price: 199, category: 'Breakfast', image: D.pancakes },
        { name: 'Banana Walnut Cake', description: 'Moist cake with ripe bananas and walnuts', price: 149, category: 'Cakes', image: D.tiramisu },
        { name: 'Cappuccino', description: 'Espresso with velvety steamed milk foam', price: 99, category: 'Beverages', image: D.coffee },
        { name: 'Sourdough Toast', description: 'Toasted sourdough with avocado or butter', price: 129, category: 'Breakfast', image: D.garlicBread },
      ],
    },
    {
      user: { username: 'wrapsandraps', email: 'wrapsandraps@demo.com' },
      restaurant: {
        name: 'Wraps & Rolls',
        description: 'Quick kathi rolls and wraps loaded with flavour',
        location: { street: '14 Salt Lake', city: 'Kolkata', state: 'West Bengal', zipCode: '700064' },
        cuisineType: ['Rolls', 'Street Food', 'Fast Food'], priceRange: 1, rating: 4.1,
        images: [IMG.streetFood],
      },
      menu: [
        { name: 'Egg Kathi Roll', description: 'Flaky paratha wrapped with spiced egg omelette', price: 79, category: 'Rolls', image: D.eggRoll },
        { name: 'Chicken Kathi Roll', description: 'Tender chicken tikka wrapped in paratha', price: 109, category: 'Rolls', image: D.chickenRoll },
        { name: 'Paneer Tikka Roll', description: 'Grilled paneer with onions in a flaky roll', price: 99, category: 'Rolls', image: D.eggRoll },
        { name: 'Mutton Kathi Roll', description: 'Juicy mutton filling wrapped in egg paratha', price: 129, category: 'Rolls', image: D.chickenRoll },
        { name: 'Masala Fries', description: 'Crispy fries tossed in chaat masala', price: 69, category: 'Sides', image: D.fries },
        { name: 'Mango Shake', description: 'Thick chilled mango milkshake', price: 89, category: 'Beverages', image: D.smoothie },
      ],
    },
    {
      user: { username: 'thaibasil', email: 'thaibasil@demo.com' },
      restaurant: {
        name: 'Thai Basil',
        description: 'Authentic Thai curries, noodles and stir-fries',
        location: { street: '22 Linking Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
        cuisineType: ['Thai', 'Asian', 'Continental'], priceRange: 3, rating: 4.4,
        images: [IMG.thai],
      },
      menu: [
        { name: 'Green Curry', description: 'Creamy coconut green curry with vegetables or chicken', price: 319, category: 'Curries', image: D.greenCurry },
        { name: 'Pad Thai', description: 'Stir-fried rice noodles with peanuts, egg and bean sprouts', price: 289, category: 'Noodles', image: D.padThai },
        { name: 'Tom Yum Soup', description: 'Spicy tangy lemongrass soup with mushrooms', price: 199, category: 'Soups', image: D.soup },
        { name: 'Thai Spring Rolls', description: 'Crispy rolls with glass noodles and vegetables', price: 179, category: 'Starters', image: D.springRolls },
        { name: 'Mango Sticky Rice', description: 'Sweet rice with fresh mango and coconut cream', price: 189, category: 'Desserts', image: D.mangoStickyRice },
        { name: 'Thai Iced Tea', description: 'Sweet spiced tea with condensed milk over ice', price: 99, category: 'Beverages', image: D.chai },
      ],
    },
    {
      user: { username: 'nawabskitchen', email: 'nawabskitchen@demo.com' },
      restaurant: {
        name: "Nawab's Kitchen",
        description: 'Royal Lucknawi cuisine — delicate kormas, kebabs and dum cooking',
        location: { street: '11 Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', zipCode: '226001' },
        cuisineType: ['Awadhi', 'Mughlai', 'North Indian'], priceRange: 3, rating: 4.5,
        images: [IMG.mughlai],
      },
      menu: [
        { name: 'Galouti Kebab', description: 'Melt-in-mouth minced lamb kebabs on paratha', price: 349, category: 'Starters', image: D.galouti },
        { name: 'Kakori Seekh', description: 'Silken lamb seekh kebabs from charcoal grill', price: 329, category: 'Starters', image: D.seekhKebab },
        { name: 'Lucknawi Biryani', description: 'Delicate dum biryani with kewra and saffron', price: 369, category: 'Main Course', image: D.biryani },
        { name: 'Nihari', description: 'Slow-cooked tender lamb shank curry', price: 399, category: 'Main Course', image: D.nihari },
        { name: 'Shahi Tukda', description: 'Fried bread soaked in sweetened milk with rabri', price: 129, category: 'Desserts', image: D.gulabJamun },
        { name: 'Kheer', description: 'Rice pudding with cardamom and pistachios', price: 99, category: 'Desserts', image: D.kheer },
      ],
    },
    {
      user: { username: 'mexaholic', email: 'mexaholic@demo.com' },
      restaurant: {
        name: 'Mexaholic',
        description: 'Mexican street food and burritos with a bold Tex-Mex twist',
        location: { street: '19 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500033' },
        cuisineType: ['Mexican', 'Tex-Mex', 'Fast Food'], priceRange: 2, rating: 3.9,
        images: [IMG.mexican],
      },
      menu: [
        { name: 'Chicken Burrito', description: 'Loaded burrito with grilled chicken, rice, beans, salsa', price: 299, category: 'Burritos', image: D.burrito },
        { name: 'Veg Quesadilla', description: 'Cheese and veggie stuffed grilled tortilla', price: 229, category: 'Quesadillas', image: D.tacos },
        { name: 'Nachos Platter', description: 'Tortilla chips with cheese, jalapenos and salsa', price: 199, category: 'Sides', image: D.nachos },
        { name: 'Tacos (3 pcs)', description: 'Soft tacos with filling, salsa and sour cream', price: 249, category: 'Tacos', image: D.tacos },
        { name: 'Churros', description: 'Fried dough sticks dusted with cinnamon sugar', price: 149, category: 'Desserts', image: D.churros },
        { name: 'Horchata', description: 'Chilled sweet rice milk with cinnamon', price: 99, category: 'Beverages', image: D.lassi },
      ],
    },
    {
      user: { username: 'sushistation', email: 'sushistation@demo.com' },
      restaurant: {
        name: 'Sushi Station',
        description: 'Fresh handcrafted sushi and Japanese ramen in minimalist setting',
        location: { street: '4 UB City', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001' },
        cuisineType: ['Japanese', 'Sushi', 'Asian'], priceRange: 4, rating: 4.6,
        images: [IMG.sushi],
      },
      menu: [
        { name: 'Salmon Nigiri (2 pcs)', description: 'Hand-pressed rice topped with fresh salmon', price: 299, category: 'Nigiri', image: D.salmonNigiri },
        { name: 'California Roll (8 pcs)', description: 'Crab stick, avocado and cucumber maki', price: 349, category: 'Maki', image: D.californiaRoll },
        { name: 'Spicy Tuna Roll', description: 'Tuna with sriracha aioli and cucumber', price: 379, category: 'Maki', image: D.californiaRoll },
        { name: 'Chicken Ramen', description: 'Tonkotsu broth with chashu chicken and soft egg', price: 399, category: 'Ramen', image: D.ramen },
        { name: 'Edamame', description: 'Steamed salted young soybeans', price: 129, category: 'Starters', image: D.quinoaBowl },
        { name: 'Matcha Ice Cream', description: 'Premium Japanese green tea ice cream', price: 149, category: 'Desserts', image: D.tiramisu },
      ],
    },
    {
      user: { username: 'southernspice', email: 'southernspice@demo.com' },
      restaurant: {
        name: 'Southern Spice',
        description: 'Andhra and Chettinad specialties — bold, spicy and unforgettable',
        location: { street: '30 Nungambakkam', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600034' },
        cuisineType: ['Andhra', 'Chettinad', 'South Indian'], priceRange: 2, rating: 4.4,
        images: [IMG.andhra],
      },
      menu: [
        { name: 'Chettinad Chicken Curry', description: 'Bold Chettinad spice blend with tender chicken', price: 299, category: 'Main Course', image: D.chettinadCurry },
        { name: 'Andhra Egg Curry', description: 'Fiery egg curry Andhra style', price: 219, category: 'Main Course', image: D.chettinadCurry },
        { name: 'Prawn Masala', description: 'Spiced prawns in tangy tomato gravy', price: 329, category: 'Main Course', image: D.prawnFry },
        { name: 'Pesarattu', description: 'Green moong dal crepe with ginger chutney', price: 89, category: 'Breakfast', image: D.pesarattu },
        { name: 'Payasam', description: 'Creamy vermicelli pudding with cardamom', price: 89, category: 'Desserts', image: D.kheer },
        { name: 'Buttermilk', description: 'Salted spiced buttermilk with curry leaves', price: 35, category: 'Beverages', image: D.lassi },
      ],
    },
    {
      user: { username: 'burgerblast', email: 'burgerblast@demo.com' },
      restaurant: {
        name: 'Burger Blast',
        description: 'Gourmet smash burgers, loaded fries and thick milkshakes',
        location: { street: '17 Sector 18', city: 'Noida', state: 'Uttar Pradesh', zipCode: '201301' },
        cuisineType: ['American', 'Burgers', 'Fast Food'], priceRange: 2, rating: 4.0,
        images: [IMG.burger],
      },
      menu: [
        { name: 'Classic Smash Burger', description: 'Double smashed patty with cheese, pickles and sauce', price: 249, category: 'Burgers', image: D.burger },
        { name: 'Crispy Chicken Burger', description: 'Fried chicken thigh with coleslaw and chipotle mayo', price: 269, category: 'Burgers', image: D.burger },
        { name: 'Veggie Patty Burger', description: 'Black bean patty with lettuce, tomato and guacamole', price: 229, category: 'Burgers', image: D.burger },
        { name: 'Cheese Fries', description: 'Loaded fries with nacho cheese sauce', price: 149, category: 'Sides', image: D.fries },
        { name: 'Chocolate Shake', description: 'Thick chocolate milkshake with whipped cream', price: 149, category: 'Beverages', image: D.chocolateShake },
        { name: 'Brownie Sundae', description: 'Warm brownie with vanilla ice cream and hot fudge', price: 179, category: 'Desserts', image: D.tiramisu },
      ],
    },
    {
      user: { username: 'gujaratithali', email: 'gujaratithali@demo.com' },
      restaurant: {
        name: 'Gujarati Thali House',
        description: 'Traditional Gujarati unlimited thali with seasonal sabzi and farsan',
        location: { street: '9 CG Road', city: 'Ahmedabad', state: 'Gujarat', zipCode: '380009' },
        cuisineType: ['Gujarati', 'Vegetarian', 'Thali'], priceRange: 2, rating: 4.5,
        images: [IMG.gujarati],
      },
      menu: [
        { name: 'Unlimited Gujarati Thali', description: 'Full thali: dal, sabzi, kadhi, roti, rice, papad, farsan, dessert', price: 299, category: 'Thali', image: D.rajThali },
        { name: 'Dhokla', description: 'Steamed fermented gram flour cake with mustard tempering', price: 89, category: 'Snacks', image: D.dhokla },
        { name: 'Khandvi', description: 'Soft rolled gram flour rolls with coconut', price: 79, category: 'Snacks', image: D.dhokla },
        { name: 'Undhiyu', description: 'Traditional mixed vegetable curry cooked upside down', price: 219, category: 'Main Course', image: D.undhiyu },
        { name: 'Fafda Jalebi', description: 'Crispy gram flour sticks with jalebis', price: 99, category: 'Breakfast', image: D.jalebi },
        { name: 'Masala Chaas', description: 'Spiced chilled buttermilk', price: 35, category: 'Beverages', image: D.lassi },
      ],
    },
    {
      user: { username: 'punjabidhaba', email: 'punjabidhaba@demo.com' },
      restaurant: {
        name: 'Punjabi Dhaba',
        description: 'Highway-style dhaba food — rich, hearty and authentically Punjabi',
        location: { street: '5 GT Road', city: 'Amritsar', state: 'Punjab', zipCode: '143001' },
        cuisineType: ['Punjabi', 'North Indian', 'Dhaba'], priceRange: 1, rating: 4.6,
        images: [IMG.punjabi],
      },
      menu: [
        { name: 'Sarson Da Saag with Makki Di Roti', description: 'Classic mustard greens with corn flatbread and white butter', price: 189, category: 'Main Course', image: D.sarsonSaag },
        { name: 'Amritsari Kulcha', description: 'Stuffed bread baked in tandoor with chole', price: 129, category: 'Mains', image: D.choleBhature },
        { name: 'Rajma Chawal', description: 'Kidney bean curry served over steamed rice', price: 149, category: 'Main Course', image: D.dalTadka },
        { name: 'Chole Bhature', description: 'Spiced chickpeas with deep-fried puffed bread', price: 139, category: 'Breakfast', image: D.choleBhature },
        { name: 'Lassi (Thick)', description: 'Famous Amritsari thick sweetened yogurt drink', price: 89, category: 'Beverages', image: D.lassi },
        { name: 'Pinni', description: 'Traditional Punjabi sweet made with wheat and ghee', price: 79, category: 'Desserts', image: D.gulabJamun },
      ],
    },
    {
      user: { username: 'mangaloreandelights', email: 'mangalorean@demo.com' },
      restaurant: {
        name: 'Mangalorean Delights',
        description: 'Authentic coastal Karnataka cuisine with coconut and red chilli base',
        location: { street: '23 Hampankatta', city: 'Mangaluru', state: 'Karnataka', zipCode: '575001' },
        cuisineType: ['Coastal', 'Karnataka', 'Seafood'], priceRange: 2, rating: 4.3,
        images: [IMG.coastal],
      },
      menu: [
        { name: 'Chicken Ghee Roast', description: 'Mangalorean style chicken in tangy ghee-roasted masala', price: 319, category: 'Main Course', image: D.gheeRoast },
        { name: 'Neer Dosa with Chicken Curry', description: 'Thin rice crepes with coconut chicken curry', price: 179, category: 'Breakfast', image: D.neerDosa },
        { name: 'Kori Roti', description: 'Crispy rice wafers with spiced chicken curry', price: 229, category: 'Main Course', image: D.gheeRoast },
        { name: 'Fish Gassi', description: 'Coastal Karnataka fish curry with coconut and tamarind', price: 289, category: 'Main Course', image: D.fishCurry },
        { name: 'Boshi Soup', description: 'Light tangy rice water soup', price: 49, category: 'Soups', image: D.soup },
        { name: 'Sol Kadhi', description: 'Cooling kokum and coconut milk drink', price: 59, category: 'Beverages', image: D.coconutWater },
      ],
    },
    {
      user: { username: 'olddelhistreet', email: 'olddelhi@demo.com' },
      restaurant: {
        name: 'Old Delhi Street',
        description: 'Iconic Chandni Chowk-style street food — jalebi, chaat and paranthas',
        location: { street: '1 Chandni Chowk', city: 'Delhi', state: 'Delhi', zipCode: '110006' },
        cuisineType: ['Street Food', 'North Indian', 'Chaat'], priceRange: 1, rating: 4.4,
        images: [IMG.delhi],
      },
      menu: [
        { name: 'Aloo Parantha with Butter', description: 'Thick stuffed flatbread with potato filling and butter', price: 89, category: 'Breakfast', image: D.garlicBread },
        { name: 'Jalebi (250g)', description: 'Freshly fried crispy spirals soaked in sugar syrup', price: 79, category: 'Sweets', image: D.jalebi },
        { name: 'Dahi Bhalla', description: 'Lentil dumplings in chilled yogurt with chutneys', price: 89, category: 'Chaat', image: D.dahiBhalla },
        { name: 'Papdi Chaat', description: 'Crispy wafers with yogurt, chutneys and sev', price: 79, category: 'Chaat', image: D.bhelpuri },
        { name: 'Keema Parantha', description: 'Flaky flatbread stuffed with spiced minced meat', price: 119, category: 'Breakfast', image: D.garlicBread },
        { name: 'Shahi Tukda', description: 'Fried bread dipped in sweet saffron milk', price: 99, category: 'Desserts', image: D.gulabJamun },
      ],
    },
    {
      user: { username: 'veggiedelight', email: 'veggiedelight@demo.com' },
      restaurant: {
        name: 'Veggie Delight',
        description: 'Pure vegetarian restaurant with innovative plant-based dishes',
        location: { street: '11 Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600040' },
        cuisineType: ['Vegetarian', 'Vegan', 'Healthy'], priceRange: 2, rating: 4.0,
        images: [IMG.veggie],
      },
      menu: [
        { name: 'Vegan Buddha Bowl', description: 'Quinoa, roasted veggies, chickpeas, tahini dressing', price: 249, category: 'Bowls', image: D.vegBuddha },
        { name: 'Stuffed Bell Pepper', description: 'Colourful peppers stuffed with spiced rice and lentils', price: 219, category: 'Mains', image: D.quinoaBowl },
        { name: 'Mushroom Stroganoff', description: 'Creamy mushroom sauce over steamed rice', price: 229, category: 'Mains', image: D.mushroomStrog },
        { name: 'Tofu Stir Fry', description: 'Pan-seared tofu with seasonal vegetables in soy sauce', price: 199, category: 'Mains', image: D.manchurian },
        { name: 'Almond Milk Smoothie', description: 'Chilled almond milk blended with banana and dates', price: 149, category: 'Beverages', image: D.smoothie },
        { name: 'Date & Nut Brownie', description: 'Sugar-free brownie sweetened with dates', price: 119, category: 'Desserts', image: D.tiramisu },
      ],
    },
    {
      user: { username: 'grillandchill', email: 'grillandchill@demo.com' },
      restaurant: {
        name: 'Grill & Chill',
        description: 'BBQ grills, steaks and cold craft beverages for a relaxed evening',
        location: { street: '33 Whitefield', city: 'Bengaluru', state: 'Karnataka', zipCode: '560066' },
        cuisineType: ['BBQ', 'American', 'Grills'], priceRange: 3, rating: 4.2,
        images: [IMG.bbq],
      },
      menu: [
        { name: 'BBQ Pork Ribs', description: 'Slow-smoked pork ribs with house BBQ sauce', price: 499, category: 'Grills', image: D.porkRibs },
        { name: 'Grilled Chicken Steak', description: 'Herb-marinated chicken breast with grilled vegetables', price: 349, category: 'Grills', image: D.steak },
        { name: 'Beef Tenderloin', description: 'Premium cut cooked to your preference', price: 699, category: 'Grills', image: D.steak },
        { name: 'Corn on the Cob', description: 'Chargrilled sweet corn with herb butter', price: 99, category: 'Sides', image: D.quinoaBowl },
        { name: 'Craft Beer (330ml)', description: 'Rotating selection of local craft beers', price: 199, category: 'Beverages', image: D.coconutWater },
        { name: "S'mores Skillet", description: 'Warm chocolate brownie with toasted marshmallow', price: 199, category: 'Desserts', image: D.tiramisu },
      ],
    },
    {
      user: { username: 'middleeastbites', email: 'middleeast@demo.com' },
      restaurant: {
        name: 'Middle East Bites',
        description: 'Lebanese and Arabic cuisine — shawarma, hummus and grilled meats',
        location: { street: '15 Commercial Street', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001' },
        cuisineType: ['Lebanese', 'Arabic', 'Mediterranean'], priceRange: 2, rating: 4.1,
        images: [IMG.middleEastern],
      },
      menu: [
        { name: 'Chicken Shawarma', description: 'Marinated chicken wrapped in pita with garlic sauce', price: 199, category: 'Wraps', image: D.shawarma },
        { name: 'Falafel Plate', description: 'Crispy chickpea fritters with hummus and pita', price: 179, category: 'Plates', image: D.hummus },
        { name: 'Hummus with Pita', description: 'Creamy hummus drizzled with olive oil and paprika', price: 149, category: 'Starters', image: D.hummus },
        { name: 'Mixed Grill Platter', description: 'Assorted grilled meats with salad and dip', price: 449, category: 'Platters', image: D.seekhKebab },
        { name: 'Baklava', description: 'Layers of filo pastry with honey and nuts', price: 99, category: 'Desserts', image: D.baklava },
        { name: 'Mint Lemonade', description: 'Refreshing fresh lime and mint drink', price: 79, category: 'Beverages', image: D.smoothie },
      ],
    },
    {
      user: { username: 'healthhub', email: 'healthhub@demo.com' },
      restaurant: {
        name: 'Health Hub',
        description: 'Calorie-counted, nutritionist-designed meals for fitness enthusiasts',
        location: { street: '5 Powai', city: 'Mumbai', state: 'Maharashtra', zipCode: '400076' },
        cuisineType: ['Healthy', 'Fitness', 'Salads'], priceRange: 3, rating: 4.3,
        images: [IMG.healthy],
      },
      menu: [
        { name: 'High Protein Bowl', description: 'Grilled chicken, boiled eggs, quinoa and leafy greens', price: 349, category: 'Bowls', image: D.proteinBowl },
        { name: 'Overnight Oats', description: 'Rolled oats with chia seeds, berries and honey', price: 179, category: 'Breakfast', image: D.overnightOats },
        { name: 'Grilled Salmon Salad', description: 'Salmon fillet over mixed greens with citrus dressing', price: 449, category: 'Salads', image: D.caesarSalad },
        { name: 'Protein Smoothie', description: 'Whey protein, banana, peanut butter, almond milk', price: 249, category: 'Beverages', image: D.smoothie },
        { name: 'Sweet Potato Fries', description: 'Baked sweet potato fries with yogurt dip', price: 149, category: 'Sides', image: D.fries },
        { name: 'Chia Pudding', description: 'Coconut milk chia pudding with mango', price: 159, category: 'Desserts', image: D.mangoStickyRice },
      ],
    },
    {
      user: { username: 'keralarestaurant', email: 'keralarestaurant@demo.com' },
      restaurant: {
        name: 'Kerala Kitchen',
        description: 'Home-style Kerala meals — sadya, puttu, stew and fresh seafood',
        location: { street: '7 MG Road', city: 'Thiruvananthapuram', state: 'Kerala', zipCode: '695001' },
        cuisineType: ['Kerala', 'South Indian', 'Seafood'], priceRange: 2, rating: 4.4,
        images: [IMG.kerala],
      },
      menu: [
        { name: 'Puttu with Kadala Curry', description: 'Steamed rice cylinders with spiced black chickpea curry', price: 99, category: 'Breakfast', image: D.puttu },
        { name: 'Kerala Sadya', description: 'Traditional banana leaf meal with 10+ dishes', price: 349, category: 'Thali', image: D.keralaSadya },
        { name: 'Beef Ularthiyathu', description: 'Dry-cooked Kerala beef with coconut and spices', price: 299, category: 'Main Course', image: D.gheeRoast },
        { name: 'Meen Peera', description: 'Small fish cooked with grated coconut', price: 249, category: 'Main Course', image: D.fishCurry },
        { name: 'Banana Halwa', description: 'Dense sweet made from overripe bananas', price: 89, category: 'Desserts', image: D.gulabJamun },
        { name: 'Sambaram', description: 'Spiced thin buttermilk with ginger and green chilli', price: 35, category: 'Beverages', image: D.lassi },
      ],
    },
    {
      user: { username: 'frenchbistro', email: 'frenchbistro@demo.com' },
      restaurant: {
        name: 'Le Petit Bistro',
        description: 'French-inspired cafe with crepes, quiche and fine pastries',
        location: { street: '2 Pondicherry Bazaar', city: 'Puducherry', state: 'Puducherry', zipCode: '605001' },
        cuisineType: ['French', 'Continental', 'Bakery'], priceRange: 3, rating: 4.3,
        images: [IMG.french],
      },
      menu: [
        { name: 'Crepe Suzette', description: 'Classic crepe with orange butter sauce', price: 219, category: 'Crepes', image: D.crepe },
        { name: 'Quiche Lorraine', description: 'Buttery pastry shell with egg, cream and bacon', price: 249, category: 'Mains', image: D.overnightOats },
        { name: 'French Onion Soup', description: 'Slow-cooked onion soup with cheesy crouton', price: 199, category: 'Soups', image: D.soup },
        { name: 'Creme Brulee', description: 'Vanilla custard with caramelised sugar crust', price: 199, category: 'Desserts', image: D.cremeBrulee },
        { name: 'Cafe Au Lait', description: 'Equal parts strong coffee and steamed milk', price: 99, category: 'Beverages', image: D.coffee },
        { name: 'Macarons (3 pcs)', description: 'Delicate French sandwich cookies in assorted flavours', price: 179, category: 'Pastries', image: D.macarons },
      ],
    },
  ];

  let totalRestaurants = 0;
  let totalMenuItems = 0;

  for (const d of data) {
    try {
      const user = await User.create({
        username: d.user.username,
        email: d.user.email,
        password: await bcrypt.hash('Rest@123', 10),
        role: 'restaurant',
      });

      const restaurant = await Restaurant.create({
        owner: user._id,
        name: d.restaurant.name,
        description: d.restaurant.description,
        location: d.restaurant.location,
        cuisineType: d.restaurant.cuisineType,
        priceRange: d.restaurant.priceRange,
        rating: d.restaurant.rating,
        images: d.restaurant.images,
        isOpen: true,
        hoursOfOperation: hours,
      });

      const menuDocs = d.menu.map(item => ({
        restaurant: restaurant._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image || '',
        isAvailable: true,
        addOns: [],
      }));
      await MenuItem.insertMany(menuDocs);

      totalRestaurants++;
      totalMenuItems += menuDocs.length;
      console.log(`  [${totalRestaurants}] ${d.restaurant.name} (${menuDocs.length} items)`);
    } catch (err) {
      console.log(`  SKIP ${d.restaurant.name}: ${err.message}`);
    }
  }

  console.log('');
  console.log(`✅ Restaurants added : ${totalRestaurants}`);
  console.log(`✅ Menu items added  : ${totalMenuItems}`);
  mongoose.disconnect();
}).catch(err => {
  console.error('❌ DB connection failed:', err.message);
  process.exit(1);
});
