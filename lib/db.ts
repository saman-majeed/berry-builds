import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const DB_PATH = path.join(process.cwd(), 'data', 'berrybuilds.db')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    initSchema(_db)
  }
  return _db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      service TEXT,
      budget TEXT,
      details TEXT,
      status TEXT DEFAULT 'new',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      tag TEXT,
      emoji TEXT,
      url TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      category TEXT NOT NULL,
      shortDesc TEXT,
      description TEXT,
      stack TEXT,
      deliverables TEXT,
      status TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS team (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      email TEXT,
      bio TEXT,
      status TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `)

  seedData(db)
}

function seedData(db: Database.Database) {
  // Seed default admin user
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
  if (!existingUser) {
    const hash = bcrypt.hashSync('berry2024', 10)
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hash, 'admin')
  }

  // Seed default settings
  const defaultSettings: Record<string, string> = {
    'site-name': 'BerryBuilds',
    'site-tagline': 'Software Development & AI Solutions',
    'contact-email': 'solutions@berrybuilds.com',
    'phone': '+92 333 4344291',
    'address': 'Main College Road, Johar Town Lahore, Pakistan',
    'stats-projects': '50+',
    'stats-clients': '40+',
    'stats-satisfaction': '99%',
    'stats-experience': '5+',
  }
  const upsertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)')
  for (const [k, v] of Object.entries(defaultSettings)) upsertSetting.run(k, v)

  // Seed projects
  const existingProj = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }
  if (existingProj.count === 0) {
    const insertProj = db.prepare('INSERT INTO projects (name, category, tag, emoji, url, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    for (const p of DEFAULT_PROJECTS) insertProj.run(p.name, p.category, p.tag, p.emoji, p.url, p.description, 'active')
  }

  // Seed services
  const existingSvc = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number }
  if (existingSvc.count === 0) {
    const insertSvc = db.prepare('INSERT INTO services (name, icon, category, shortDesc, description, stack, deliverables, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    for (const s of DEFAULT_SERVICES) insertSvc.run(s.name, s.icon, s.category, s.shortDesc, s.description, s.stack, s.deliverables, 'active')
  }
}

// ─── Default Data ────────────────────────────────────────────
const DEFAULT_PROJECTS = [
  { name: 'Naeem Electric Store', category: 'Electrical & Electronics', tag: 'Electrical Equipment', emoji: '⚡', url: 'https://naeemelectric.store/', description: 'Modern electrical equipment and appliances e-commerce platform.' },
  { name: 'Origin PC', category: 'Electrical & Electronics', tag: 'Computer Hardware', emoji: '⚡', url: 'https://originpc-ecommerce-with-admin-panne-eight.vercel.app', description: 'Computer hardware and gaming equipment store with admin panel.' },
  { name: 'Vape Alley', category: 'Vape & Tobacco Products', tag: 'Vaping Products', emoji: '💨', url: 'https://vape-alley.vercel.app/', description: 'Specialized vaping products store with intuitive filtering.' },
  { name: 'Pods Store', category: 'Vape & Tobacco Products', tag: 'Vaping Pods', emoji: '💨', url: 'https://pods-store.vercel.app/', description: 'Vaping pods and accessories store.' },
  { name: 'Zynra Clothing PK', category: 'Fashion & Apparel', tag: 'Fashion Brand', emoji: '👗', url: 'https://zynraclothingpk.vercel.app/', description: 'Contemporary fashion brand offering trendy clothing collections.' },
  { name: 'Zia Collection', category: 'Fashion & Apparel', tag: 'Fashion Store', emoji: '👗', url: 'https://ziacollection-kappa.vercel.app/', description: 'Curated fashion and lifestyle collection.' },
  { name: 'Mor Bridals', category: 'Fashion & Apparel', tag: 'Bridal Wear', emoji: '👗', url: 'https://morbridals.vercel.app/', description: 'Bridal wear boutique with exquisite designs.' },
  { name: 'Lumia Luxe Jewelry', category: 'Jewelry & Accessories', tag: 'Luxury Jewelry', emoji: '💍', url: 'https://v0-lumialuxejewelry1.vercel.app/', description: 'Luxury jewelry e-commerce platform.' },
  { name: 'Haider Diamonds & Jewellers', category: 'Jewelry & Accessories', tag: 'Diamond Jewelry', emoji: '💍', url: 'https://v0-web-one-lake.vercel.app/', description: 'Premium diamond and jewelry store.' },
  { name: 'Elegant Superstore', category: 'Retail & Supermarkets', tag: 'Multi-Category Retail', emoji: '🏪', url: 'https://elegantsuperstore.com', description: 'Premium multi-category superstore.' },
  { name: 'HT Store', category: 'Retail & Supermarkets', tag: 'General Retail', emoji: '🏪', url: 'https://ht-store-five.vercel.app/', description: 'Multi-category retail platform.' },
  { name: 'Quikmart', category: 'Retail & Supermarkets', tag: 'Quick Retail', emoji: '🏪', url: 'https://quikmartproject.vercel.app/', description: 'Fast online marketplace for everyday essentials.' },
  { name: 'MA Traders', category: 'Trading & Wholesale', tag: 'Wholesale', emoji: '📦', url: 'https://ma-traders-one.vercel.app/', description: 'Trading platform for wholesale and retail.' },
  { name: 'Abbas Traders', category: 'Trading & Wholesale', tag: 'Commercial Trading', emoji: '📦', url: 'https://abbas-traders.vercel.app/', description: 'Commercial trading platform for consumer goods.' },
  { name: 'Allure Impex', category: 'Trading & Wholesale', tag: 'Import-Export', emoji: '📦', url: 'https://allure-impex-final-react.vercel.app/', description: 'Import-export business platform.' },
  { name: 'Khalid Agro', category: 'Agriculture', tag: 'Agricultural Products', emoji: '🌾', url: 'https://web-development-project-g9rv.vercel.app/', description: 'Agricultural products platform.' },
  { name: 'Biotara Commerce', category: 'Organic & Wellness', tag: 'Organic Products', emoji: '🌿', url: 'https://biotara-commerce-vercel.vercel.app/', description: 'Organic marketplace promoting sustainable shopping.' },
  { name: 'Organo by Sana', category: 'Organic & Wellness', tag: 'Organic Wellness', emoji: '🌿', url: 'https://organo-by-sana.vercel.app/', description: 'Organic products and wellness store.' },
  { name: 'Essentials Aesthetic PK', category: 'Beauty & Aesthetics', tag: 'Beauty Products', emoji: '✨', url: 'https://essentials-aestheticpk.vercel.app/', description: 'Beauty and aesthetic products store.' },
  { name: 'The Candle Co', category: 'Beauty & Aesthetics', tag: 'Home Fragrance', emoji: '✨', url: 'https://thecandleco.vercel.app/', description: 'Artisan candle store.' },
  { name: 'GHS Medical Center', category: 'Healthcare & Medical', tag: 'Healthcare', emoji: '🏥', url: 'https://ghs-01.vercel.app', description: 'Healthcare facility website with appointment booking.' },
  { name: 'Medicare Portal', category: 'Healthcare & Medical', tag: 'Healthcare Services', emoji: '🏥', url: 'https://medicare-ten-woad.vercel.app/', description: 'Patient-focused healthcare platform.' },
  { name: 'Al Qaim Surgical', category: 'Healthcare & Medical', tag: 'Medical Equipment', emoji: '🏥', url: 'https://al-qaim-surgical.vercel.app/', description: 'Surgical instruments and medical equipment supplier.' },
  { name: 'Opto Optics Bahria', category: 'Optical & Vision Care', tag: 'Optometry', emoji: '👓', url: 'https://optoopticsbahria.vercel.app/', description: 'Professional optometry services.' },
  { name: 'Opticverse', category: 'Optical & Vision Care', tag: 'Optical Store', emoji: '👓', url: 'https://opticverse-101.netlify.app/', description: 'Modern optical store.' },
  { name: 'GetFit Gym', category: 'Fitness & Gyms', tag: 'Fitness Center', emoji: '💪', url: 'https://getfitgym.site/', description: 'Modern fitness center with membership plans.' },
  { name: 'Hamza Fitness Club', category: 'Fitness & Gyms', tag: 'Fitness Club', emoji: '💪', url: 'https://hamza-fitness-club-website.vercel.app/', description: 'Comprehensive fitness club.' },
  { name: 'The Diet Inventory', category: 'Nutrition & Diet', tag: 'Nutrition', emoji: '🥗', url: 'https://thedietinventory.vercel.app', description: 'Nutrition and diet planning platform.' },
  { name: 'Serenya Wellness', category: 'Nutrition & Diet', tag: 'Wellness', emoji: '🥗', url: 'https://serenya-website.vercel.app/', description: 'Holistic wellness platform.' },
  { name: 'Maffis Restaurant', category: 'Restaurants & Fine Dining', tag: 'Fine Dining', emoji: '🍽️', url: 'https://maffis.ca', description: 'Fine dining restaurant with online reservations.' },
  { name: 'The Pan n Grill', category: 'Restaurants & Fine Dining', tag: 'Grill Restaurant', emoji: '🍽️', url: 'https://the-pan-n-grill.vercel.app', description: 'Contemporary restaurant with grilled specialties.' },
  { name: 'Honeyd Bakery', category: 'Bakery & Fast Food', tag: 'Bakery', emoji: '🍞', url: 'https://honyedbakery.vercel.app/', description: 'Artisan bakery with fresh baked goods.' },
  { name: 'Haddi Fast Foods', category: 'Bakery & Fast Food', tag: 'Fast Food', emoji: '🍞', url: 'https://haddi-fast-foods.vercel.app/', description: 'Quick service restaurant with online ordering.' },
  { name: 'E-Campus Portfolio', category: 'Education & Scholarships', tag: 'Education', emoji: '🎓', url: 'https://www.e-campus.site/portfolio', description: 'Digital campus platform.' },
  { name: 'Hunar Loops', category: 'Education & Scholarships', tag: 'Skills Training', emoji: '🎓', url: 'https://hunarloops.vercel.app/', description: 'Skills development and training platform.' },
  { name: 'Innovation Consulting', category: 'Education & Scholarships', tag: 'Scholarship Portal', emoji: '🎓', url: 'https://www.innovateconsults.com/', description: 'Scholarship information portal.' },
  { name: 'IslamInfoTube', category: 'Education & Scholarships', tag: 'Islamic Education', emoji: '🎓', url: 'https://islaminfotube.com/', description: 'Islamic knowledge through video content.' },
  { name: 'Hussain Law Firm', category: 'Legal Services', tag: 'Law Firm', emoji: '⚖️', url: 'https://hussainlaw.vercel.app/', description: 'Professional law firm website.' },
  { name: 'Waqar Law', category: 'Legal Services', tag: 'Law Firm', emoji: '⚖️', url: 'https://waqarlaw.com/', description: 'Professional law firm with attorney profiles.' },
  { name: 'Assets Vault', category: 'Real Estate', tag: 'Real Estate', emoji: '🏠', url: 'https://assets-vault.vercel.app/', description: 'Property management and real estate platform.' },
  { name: 'Hostify', category: 'Hospitality', tag: 'Booking', emoji: '🏨', url: 'https://hostify-jl8m.vercel.app/#admin', description: 'Accommodation booking platform.' },
  { name: 'Lunaire Hospitality', category: 'Hospitality', tag: 'Luxury', emoji: '🏨', url: 'https://lunaire.vercel.app', description: 'Premium hospitality platform.' },
  { name: 'Car Rental Service', category: 'Transportation & Rental', tag: 'Vehicle Rental', emoji: '🚗', url: 'https://carrentalfinalmidterm.vercel.app/', description: 'Vehicle rental platform.' },
  { name: 'Pak Express Limousine', category: 'Transportation & Rental', tag: 'Limousine', emoji: '🚗', url: 'https://pakexpresslimousine.com/', description: 'Premium limousine and vehicle rental.' },
  { name: 'LCF Furniture', category: 'Furniture & Home Decor', tag: 'Furniture Store', emoji: '🛋️', url: 'https://lcf-furniture-next.vercel.app/', description: 'Contemporary furniture showroom.' },
  { name: 'Tariq Aboudhelabi', category: 'Professional Services', tag: 'Portfolio', emoji: '💼', url: 'https://tariqaboudhelabi.com/', description: 'Professional portfolio website.' },
  { name: 'Kgulf Hosting', category: 'Professional Services', tag: 'Hosting', emoji: '💼', url: 'https://www.kgulfhosting.com/', description: 'Hosting services platform.' },
  { name: 'Alliance Services', category: 'Professional Services', tag: 'Business', emoji: '💼', url: 'https://alliance-teal.vercel.app/', description: 'Corporate services platform.' },
  { name: 'VisionZ PK', category: 'Professional Services', tag: 'Creative Agency', emoji: '💼', url: 'https://visionzpk.vercel.app/', description: 'Creative agency portfolio.' },
  { name: "Chhotu's Club", category: 'Entertainment & Recreation', tag: 'Social Club', emoji: '🎮', url: 'https://chhotus-club-final-pxp51j9c0-naheeziqbal552003-1632s-projects.vercel.app/', description: 'Social club and entertainment venue.' },
  { name: 'Snooker Hub', category: 'Entertainment & Recreation', tag: 'Sports Club', emoji: '🎮', url: 'https://snooker-hub-4bgr.vercel.app/', description: 'Snooker club with table bookings.' },
]

const DEFAULT_SERVICES = [
  { name: 'Web Development', icon: '🌐', category: 'Development Services', shortDesc: 'Full-stack applications with Next.js, React, and modern frameworks.', description: 'Full-stack web applications built with modern frameworks and best practices.', stack: 'Next.js,React,TypeScript,Node.js', deliverables: 'Custom Web Applications\nProgressive Web Apps (PWA)\nE-commerce Platforms\nContent Management Systems' },
  { name: 'Mobile App Development', icon: '📱', category: 'Development Services', shortDesc: 'Cross-platform mobile apps with React Native and Flutter.', description: 'Native and cross-platform mobile applications for iOS and Android.', stack: 'React Native,Flutter,Expo,Swift', deliverables: 'Cross-Platform Development\nNative iOS & Android Apps\nApp Store Optimization\nPush Notifications' },
  { name: 'E-Commerce Solutions', icon: '🛒', category: 'Development Services', shortDesc: 'End-to-end e-commerce platforms that drive sales.', description: 'Complete e-commerce from product catalogs to secure checkout flows.', stack: 'Shopify,WooCommerce,Stripe,PayPal', deliverables: 'Custom Storefronts\nPayment Gateway Integration\nInventory Management\nOrder Processing Systems' },
  { name: 'AI & Data Science', icon: '🤖', category: 'AI & Data Services', shortDesc: 'Machine learning models and predictive analytics solutions.', description: 'Transform your data into actionable insights with AI and machine learning.', stack: 'Python,TensorFlow,PyTorch,scikit-learn', deliverables: 'Machine Learning Models\nPredictive Analytics\nNatural Language Processing\nComputer Vision Solutions' },
  { name: 'Agentic AI Development', icon: '⚙️', category: 'AI & Data Services', shortDesc: 'Autonomous AI agents and workflow automation systems.', description: 'Build autonomous AI agents that reason, plan, and execute complex tasks.', stack: 'LangChain,Claude API,OpenAI,Vector DBs', deliverables: 'Autonomous AI Agents\nMulti-Agent Systems\nWorkflow Automation\nConversational AI & Chatbots' },
  { name: 'Cloud & Infrastructure', icon: '☁️', category: 'AI & Data Services', shortDesc: 'Scalable cloud architecture and DevOps solutions.', description: 'Reliable cloud architecture ensuring your applications run efficiently.', stack: 'AWS,Google Cloud,Vercel,Docker', deliverables: 'Cloud Architecture Design\nCI/CD Pipeline Setup\nContainer Orchestration\nServerless Solutions' },
  { name: 'UI/UX Design', icon: '🎨', category: 'Creative & Marketing', shortDesc: 'User-centered design that creates engaging experiences.', description: 'User-centered design combining aesthetics with functionality.', stack: 'Figma,Adobe XD,Sketch,Framer', deliverables: 'User Research & Analysis\nWireframing & Prototyping\nVisual Design Systems\nInteraction Design' },
  { name: 'Video Production', icon: '🎬', category: 'Creative & Marketing', shortDesc: 'Professional video content for brand storytelling.', description: 'Professional video content that engages your audience.', stack: 'Adobe Premiere,After Effects,DaVinci,Cinema 4D', deliverables: 'Brand Videos\nProduct Demonstrations\nExplainer Animations\nSocial Media Content' },
  { name: 'Digital Marketing & SEO', icon: '📈', category: 'Creative & Marketing', shortDesc: 'Data-driven marketing that increases visibility.', description: 'Data-driven marketing strategies that increase visibility and drive growth.', stack: 'Google Analytics,SEMrush,Ahrefs,Google Ads', deliverables: 'Search Engine Optimization\nContent Strategy\nSocial Media Marketing\nPPC Campaign Management' },
  { name: 'Custom Software Development', icon: '💻', category: 'Enterprise Solutions', shortDesc: 'Tailored software for unique business challenges.', description: 'Tailored software designed to address your specific business challenges.', stack: 'Node.js,Python,.NET,PostgreSQL', deliverables: 'Business Process Automation\nEnterprise Resource Planning\nCRM Systems\nWorkflow Management' },
  { name: 'API & Integration Services', icon: '🔗', category: 'Enterprise Solutions', shortDesc: 'Connect your systems with robust API solutions.', description: 'Robust API development and integration for seamless connectivity.', stack: 'REST,GraphQL,gRPC,OAuth', deliverables: 'RESTful API Development\nGraphQL Implementation\nThird-party API Integration\nWebhook Systems' },
  { name: 'Database & Backend Solutions', icon: '🗄️', category: 'Enterprise Solutions', shortDesc: 'Robust data architecture that powers your applications.', description: 'Reliable data architecture and backend systems optimized for performance.', stack: 'MongoDB,PostgreSQL,MySQL,Redis', deliverables: 'Database Design & Modeling\nData Migration Services\nPerformance Optimization\nBackup & Recovery' },
]
