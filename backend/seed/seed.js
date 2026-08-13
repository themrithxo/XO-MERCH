const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    const isConnected = await connectDB();

    if (!isConnected) {
      console.log('=====================================================');
      console.log('[XO Seed] Database connection bypassed (No MongoDB daemon / binary download drop).');
      console.log('[XO Seed] Please start local MongoDB daemon or provide a MONGO_URI string in backend/.env.');
      console.log('=====================================================');
      if (require.main === module) process.exit(0);
      return;
    }

    console.log('[XO Seed] Clearing existing database collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    await Cart.deleteMany({});

    console.log('[XO Seed] Creating users...');
    const admin = await User.create({
      name: 'Vespera Noir (Admin)',
      email: 'admin@xo.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 666-0199',
      addresses: [{
        street: '13 Obsidiana Way',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isDefault: true
      }]
    });

    const customerSeeds = [
      { name: 'Kaelen Vance', email: 'kaelen@xo-vault.com', password: 'customer123', phone: '+1 (555) 234-5678' },
      { name: 'Rowan Cross', email: 'rowan@gothmail.com', password: 'customer123', phone: '+1 (555) 345-6789' },
      { name: 'Astrid Thorne', email: 'astrid@darkart.io', password: 'customer123', phone: '+1 (555) 456-7890' },
      { name: 'Corvin Mercer', email: 'corvin@nocturne.net', password: 'customer123', phone: '+1 (555) 567-8901' },
      { name: 'Sirenna Gray', email: 'sirenna@shadow.org', password: 'customer123', phone: '+1 (555) 678-9012' },
      { name: 'Damien Vane', email: 'damien@bloodline.com', password: 'customer123', phone: '+1 (555) 789-0123' },
      { name: 'Lyra Blackwood', email: 'lyra@solitude.co', password: 'customer123', phone: '+1 (555) 890-1234' },
      { name: 'Nyx Holloway', email: 'nyx@raven.com', password: 'customer123', phone: '+1 (555) 901-2345' },
      { name: 'Ezra Sinclair', email: 'ezra@eclipse.io', password: 'customer123', phone: '+1 (555) 012-3456' },
      { name: 'Malichai Frost', email: 'malichai@wintergoth.com', password: 'customer123', phone: '+1 (555) 123-4567' }
    ];

    const customers = [];
    for (const c of customerSeeds) {
      const user = await User.create({
        ...c,
        addresses: [{
          street: `${Math.floor(Math.random() * 900) + 100} Shadow Ave`,
          city: ['Brooklyn', 'Los Angeles', 'Chicago', 'Berlin', 'London'][Math.floor(Math.random() * 5)],
          state: 'NY',
          postalCode: '11201',
          country: 'USA',
          isDefault: true
        }]
      });
      customers.push(user);
    }

    console.log('[XO Seed] Creating categories...');
    const categorySeeds = [
      {
        name: 'Hoodies & Sweats',
        slug: 'hoodies',
        description: 'Heavyweight French terry & fleece silhouettes with raw edges, metal hardware, and distressed embroidery.',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Tees & Tops',
        slug: 'tees',
        description: 'Ultra-heavy 280GSM organic cotton garments featuring hand-screenprinted occult typography and drop shoulders.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Outerwear & Leather',
        slug: 'outerwear',
        description: 'Full-grain lambskin, tailored trench coats, and bonded technical parkas built for cold urban darkness.',
        image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Bottoms & Cargo',
        slug: 'bottoms',
        description: 'Multi-pocket modular cargo trousers, waxed Japanese denim, and elongated drawcord sweatpants.',
        image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Accessories & Hardware',
        slug: 'accessories',
        description: 'Sterling silver chain links, full-grain leather harnesses, studded belts, and embroidered balaclavas.',
        image: 'https://images.unsplash.com/photo-1611591475281-9199d99723ec?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Limited Drops',
        slug: 'limited-drops',
        description: 'Numbered run items available exclusively in micro-quantities. Once sold out, never reproduced.',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'
      }
    ];

    const categories = await Category.insertMany(categorySeeds);
    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c._id; });

    console.log('[XO Seed] Creating 30+ products...');
    const productSeeds = [
      // Hoodies
      {
        name: 'Requiem Oversized Heavyweight Hoodie',
        slug: 'requiem-oversized-heavyweight-hoodie',
        description: 'Engineered from 500GSM double-faced loopback terry in jet obsidian. Features double-layered hood with silver eyelets, distressing on cuff ribs, and blood-red inner seams.',
        price: 320,
        compareAtPrice: 380,
        category: catMap['hoodies'],
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 4 }],
        colorway: 'Obsidian Black / Blood Crimson',
        tags: ['Hoodie', 'Oversized', 'Heavyweight']
      },
      {
        name: 'Nocturne Distressed Zip Hoodie',
        slug: 'nocturne-distressed-zip-hoodie',
        description: 'Full-length custom Raccagni silver zipper closure with laser-etched XO insignia. Hand-frayed hems with contrast crimson stitching.',
        price: 340,
        compareAtPrice: 0,
        category: catMap['hoodies'],
        images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 2 }],
        colorway: 'Pitch Black',
        tags: ['Zip Hoodie', 'Hardware', 'Distressed']
      },
      {
        name: 'Sable Archival Cropped Pullover',
        slug: 'sable-archival-cropped-pullover',
        description: 'Boxy cropped silhouette with dropped shoulders and extended sleeves. Screenprinted gothic sigil graphics across shoulders.',
        price: 290,
        compareAtPrice: 330,
        category: catMap['hoodies'],
        images: ['https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'XS', stock: 4 }, { size: 'S', stock: 7 }, { size: 'M', stock: 9 }, { size: 'L', stock: 3 }],
        colorway: 'Charcoal Wash',
        tags: ['Cropped', 'Sigil', 'Pullover']
      },
      {
        name: 'Catacomb Fleece Balaclava Hoodie',
        slug: 'catacomb-fleece-balaclava-hoodie',
        description: 'Built-in face mask collar made from ultra-soft stretch modal fleece. Integrated thumbholes and magnetic pocket latches.',
        price: 360,
        compareAtPrice: 420,
        category: catMap['hoodies'],
        images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 6 }, { size: 'L', stock: 4 }, { size: 'XL', stock: 1 }],
        colorway: 'Obsidian Black',
        tags: ['Techwear', 'Balaclava', 'Gothic']
      },
      {
        name: 'Eclipse Acid-Wash Thermal Pullover',
        slug: 'eclipse-acid-wash-thermal-pullover',
        description: 'Acid-bleached mineral washed cotton with thermal waffle lining. Raw edge hem line and distressed collar ribs.',
        price: 280,
        compareAtPrice: 0,
        category: catMap['hoodies'],
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 12 }, { size: 'XL', stock: 6 }],
        colorway: 'Crimson / Carbon Wash',
        tags: ['Acid Wash', 'Thermal']
      },

      // Tees & Tops
      {
        name: 'Sable Cross Heavyweight Vintage Tee',
        slug: 'sable-cross-heavyweight-vintage-tee',
        description: '300GSM carded cotton knit with vintage oil wash. Features high-density gel coat print of the signature XO Iron Cross on reverse.',
        price: 140,
        compareAtPrice: 165,
        category: catMap['tees'],
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 15 }, { size: 'M', stock: 20 }, { size: 'L', stock: 18 }, { size: 'XL', stock: 8 }],
        colorway: 'Vintage Black',
        tags: ['Graphic Tee', 'Cross', 'Heavyweight']
      },
      {
        name: 'Vespera Cathedral Oversized Box Tee',
        slug: 'vespera-cathedral-oversized-box-tee',
        description: 'Architectural silhouette inspired by Gothic cathedral vaulting. Distressed collar with hand-stitched pewter plaque.',
        price: 160,
        compareAtPrice: 0,
        category: catMap['tees'],
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 14 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 5 }],
        colorway: 'Obsidian / Blood Red',
        tags: ['Oversized', 'Cathedral']
      },
      {
        name: 'Obsidian Sigil Longsleeve Layer',
        slug: 'obsidian-sigil-longsleeve-layer',
        description: 'Dual-layer sleeve construction with thumb slits and screenprinted runes down the left spine and sleeves.',
        price: 180,
        compareAtPrice: 210,
        category: catMap['tees'],
        images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 10 }, { size: 'L', stock: 7 }, { size: 'XL', stock: 3 }],
        colorway: 'Jet Black',
        tags: ['Longsleeve', 'Runes']
      },
      {
        name: 'Malediction Mesh Layering Top',
        slug: 'malediction-mesh-layering-top',
        description: 'Semi-sheer Japanese technical stretch mesh with flocking print gothic typography. Ideal for layering under heavy leather or outerwear.',
        price: 150,
        compareAtPrice: 0,
        category: catMap['tees'],
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'XS', stock: 6 }, { size: 'S', stock: 12 }, { size: 'M', stock: 10 }, { size: 'L', stock: 4 }],
        colorway: 'Translucent Obsidian',
        tags: ['Mesh', 'Layering', 'Avant-Garde']
      },
      {
        name: 'Penance Raw-Edge Muscle Tank',
        slug: 'penance-raw-edge-muscle-tank',
        description: 'Deep dropped armholes with raw distressed cutoffs. Metallic foil stamped XO logo on chest.',
        price: 110,
        compareAtPrice: 130,
        category: catMap['tees'],
        images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 9 }, { size: 'M', stock: 12 }, { size: 'L', stock: 11 }, { size: 'XL', stock: 4 }],
        colorway: 'Midnight Charcoal',
        tags: ['Tank', 'Raw Edge']
      },

      // Outerwear
      {
        name: 'Vampyre Italian Lambskin Biker Jacket',
        slug: 'vampyre-italian-lambskin-biker-jacket',
        description: 'Hand-waxed full-grain Italian lambskin with silver hardware buckles, quilted shoulders, and blood-red silk cupro lining.',
        price: 1450,
        compareAtPrice: 1750,
        category: catMap['outerwear'],
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 2 }, { size: 'M', stock: 4 }, { size: 'L', stock: 3 }, { size: 'XL', stock: 1 }],
        colorway: 'Full Black / Crimson Lining',
        tags: ['Leather', 'Luxury', 'Biker']
      },
      {
        name: 'Sanctum Oversized Wool Trench Coat',
        slug: 'sanctum-oversized-wool-trench-coat',
        description: 'Double-breasted heavyweight virgin wool trench with extended length collar lapels and removable waist harness belt.',
        price: 890,
        compareAtPrice: 1050,
        category: catMap['outerwear'],
        images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 5 }, { size: 'L', stock: 4 }, { size: 'XL', stock: 2 }],
        colorway: 'Pitch Black Wool',
        tags: ['Trench', 'Wool', 'Formal Gothic']
      },
      {
        name: 'Crucifix Bonded Technical Anorak',
        slug: 'crucifix-bonded-technical-anorak',
        description: 'Waterproof 3-layer nylon matrix with heat-sealed seams, magnetic storm flap, and laser-perforated chest breathing vents.',
        price: 620,
        compareAtPrice: 0,
        category: catMap['outerwear'],
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 3 }],
        colorway: 'Obsidian Matte',
        tags: ['Anorak', 'Technical', 'Waterproof']
      },
      {
        name: 'Inferno Distressed Denim Trucker',
        slug: 'inferno-distressed-denim-trucker',
        description: '16oz Japanese selvedge denim treated with custom sulfur black dye and hand abraded edges.',
        price: 450,
        compareAtPrice: 520,
        category: catMap['outerwear'],
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 9 }, { size: 'L', stock: 7 }, { size: 'XL', stock: 2 }],
        colorway: 'Sulfur Black',
        tags: ['Denim', 'Trucker', 'Japanese']
      },
      {
        name: 'Golgotha Puffer Jacket with Harness',
        slug: 'golgotha-puffer-jacket-with-harness',
        description: '700-fill goose down insulation wrapped in matte nylon shell with detachable webbing chest harness.',
        price: 780,
        compareAtPrice: 0,
        category: catMap['outerwear'],
        images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 6 }, { size: 'L', stock: 5 }, { size: 'XL', stock: 2 }],
        colorway: 'Deep Raven Black',
        tags: ['Puffer', 'Harness', 'Winter']
      },

      // Bottoms
      {
        name: 'Nocturne Modular Cargo Pants',
        slug: 'nocturne-modular-cargo-pants',
        description: 'Heavy cotton twill with 10 utility pockets, detachable strap harnesses, and adjustable zipped cuffs to toggle between wide and tapered fit.',
        price: 340,
        compareAtPrice: 390,
        category: catMap['bottoms'],
        images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 12 }, { size: 'L', stock: 9 }, { size: 'XL', stock: 4 }],
        colorway: 'Jet Black Twill',
        tags: ['Cargo', 'Modular', 'Tactical']
      },
      {
        name: 'Waxed Selvedge Skinny Denim',
        slug: 'waxed-selvedge-skinny-denim',
        description: '14oz stretch selvedge denim coated with black resin for a leather-like sheen. Distressed knees with ribbed leather backing.',
        price: 380,
        compareAtPrice: 0,
        category: catMap['bottoms'],
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 2 }],
        colorway: 'Resin Black',
        tags: ['Denim', 'Waxed', 'Skinny']
      },
      {
        name: 'Oblivion Drop-Crotch Sweatpants',
        slug: 'oblivion-drop-crotch-sweatpants',
        description: 'Elongated crimson cotton drawstrings, deep gusseted crotch, and ribbed ankle cuffs with thumb loop socks.',
        price: 260,
        compareAtPrice: 300,
        category: catMap['bottoms'],
        images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 14 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 5 }],
        colorway: 'Obsidian / Red Ties',
        tags: ['Sweatpants', 'Drop Crotch']
      },
      {
        name: 'Ashen Pleated Wide-Leg Trousers',
        slug: 'ashen-pleated-wide-leg-trousers',
        description: 'Tailored wool-blend wide leg trousers featuring deep front pleats and side metal buckle waist adjusters.',
        price: 410,
        compareAtPrice: 0,
        category: catMap['bottoms'],
        images: ['https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 7 }, { size: 'L', stock: 5 }, { size: 'XL', stock: 2 }],
        colorway: 'Charcoal Black',
        tags: ['Wide Leg', 'Pleated', 'Tailored']
      },
      {
        name: 'Cryptic Layered Shorts over Tights',
        slug: 'cryptic-layered-shorts-over-tights',
        description: '2-in-1 design combining distressed heavyweight cotton shorts over technical compression tights.',
        price: 240,
        compareAtPrice: 280,
        category: catMap['bottoms'],
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 11 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 3 }],
        colorway: 'Matte Black',
        tags: ['Shorts', 'Layered']
      },

      // Accessories
      {
        name: 'Heavyweight Sterling Silver XO Chain',
        slug: 'heavyweight-sterling-silver-xo-chain',
        description: 'Solid 925 Sterling Silver hand-cast cuban link necklace with custom skull pendant engraved with drop number.',
        price: 490,
        compareAtPrice: 580,
        category: catMap['accessories'],
        images: ['https://images.unsplash.com/photo-1611591475281-9199d99723ec?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'ONE SIZE', stock: 15 }],
        colorway: 'Oxidized Silver',
        tags: ['Jewelry', 'Sterling Silver', 'Chain']
      },
      {
        name: 'Nocturnal Leather Chest Harness',
        slug: 'nocturnal-leather-chest-harness',
        description: 'Handcrafted full-grain bridle leather harness with heavy O-ring connectors and adjustable roller buckles.',
        price: 220,
        compareAtPrice: 0,
        category: catMap['accessories'],
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 10 }, { size: 'L', stock: 5 }],
        colorway: 'Black Leather / Steel',
        tags: ['Harness', 'Leather', 'Hardware']
      },
      {
        name: 'Phantom Distressed Ribbed Balaclava',
        slug: 'phantom-distressed-ribbed-balaclava',
        description: '100% Merino wool knit balaclava with hand-distressed eye openings and silver brand clip on neck seam.',
        price: 120,
        compareAtPrice: 145,
        category: catMap['accessories'],
        images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'ONE SIZE', stock: 25 }],
        colorway: 'Jet Black Merino',
        tags: ['Balaclava', 'Wool', 'Headwear']
      },
      {
        name: 'Gothic Hardware Studded Leather Belt',
        slug: 'gothic-hardware-studded-leather-belt',
        description: 'Triple-row pyramid studded Italian leather belt with custom gothic cross buckle.',
        price: 190,
        compareAtPrice: 0,
        category: catMap['accessories'],
        images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 8 }],
        colorway: 'Black / Antique Silver',
        tags: ['Belt', 'Studded', 'Hardware']
      },
      {
        name: 'Vespera Waxed Canvas Duffle Bag',
        slug: 'vespera-waxed-canvas-duffle-bag',
        description: '50L heavy waxed canvas weekend bag with matte waterproof zippers and leather corner reinforcement.',
        price: 380,
        compareAtPrice: 440,
        category: catMap['accessories'],
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'ONE SIZE', stock: 12 }],
        colorway: 'Pitch Black Wax',
        tags: ['Bag', 'Travel', 'Canvas']
      },

      // Limited Drops
      {
        name: 'XO DROP 001: Archival Relic Leather Duster',
        slug: 'xo-drop-001-archival-relic-leather-duster',
        description: 'LIMITED TO 50 PIECES WORLDWIDE. Full-length distressed distressed horsehide duster jacket featuring hand-painted crimson gothic typography across the hem and serialized sterling silver plaque inside breast pocket.',
        price: 2150,
        compareAtPrice: 2600,
        category: catMap['limited-drops'],
        images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 2 }, { size: 'M', stock: 3 }, { size: 'L', stock: 2 }],
        colorway: 'Aged Black / Blood Stain',
        isLimitedEdition: true,
        dropDate: new Date(Date.now() + 86400000 * 2), // Drop in 2 days
        tags: ['Limited Drop', 'Archive', 'Hand-Painted', 'Horsehide']
      },
      {
        name: 'XO DROP 002: Cathedral Spike Sole Combat Boot',
        slug: 'xo-drop-002-cathedral-spike-sole-combat-boot',
        description: 'LIMITED TO 75 PIECES. Italian calfskin 14-eyelet combat boot with custom sculpted cathedral arch rubber lug sole and screw-in heel spikes.',
        price: 980,
        compareAtPrice: 0,
        category: catMap['limited-drops'],
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 5 }, { size: 'L', stock: 4 }],
        colorway: 'Polished Black Calfskin',
        isLimitedEdition: true,
        dropDate: new Date(Date.now() + 86400000 * 5),
        tags: ['Footwear', 'Limited Drop', 'Boots', 'Spikes']
      },
      {
        name: 'XO DROP 003: Nocturne Serialized Silver Mask',
        slug: 'xo-drop-003-nocturne-serialized-silver-mask',
        description: 'LIMITED TO 30 PIECES. Hand-hammered 925 sterling silver half-face mask featuring engraved gothic scriptures and adjustable leather skull harness.',
        price: 1650,
        compareAtPrice: 0,
        category: catMap['limited-drops'],
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'ONE SIZE', stock: 4 }],
        colorway: 'Oxidized Silver / Black Leather',
        isLimitedEdition: true,
        dropDate: new Date(Date.now() - 86400000 * 1), // Recently dropped
        tags: ['Mask', 'Limited Drop', 'Jewelry', 'Artisan']
      },
      {
        name: 'XO DROP 004: Requiem Heavy Kevlar Anorak',
        slug: 'xo-drop-004-requiem-heavy-kevlar-anorak',
        description: 'LIMITED TO 100 PIECES. Ballistic Kevlar weave outer shell with reflective crimson piping and removable storm hood.',
        price: 890,
        compareAtPrice: 1100,
        category: catMap['limited-drops'],
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 2 }],
        colorway: 'Obsidian / Reflective Red',
        isLimitedEdition: true,
        dropDate: new Date(Date.now() + 86400000 * 10),
        tags: ['Kevlar', 'Limited Drop', 'Anorak']
      },
      {
        name: 'XO DROP 005: Sable Crimson-Lined Trench',
        slug: 'xo-drop-005-sable-crimson-lined-trench',
        description: 'LIMITED TO 40 PIECES. Floor-length double-waxed canvas duster with deep crimson satin lining and laser-engraved horn buttons.',
        price: 1250,
        compareAtPrice: 0,
        category: catMap['limited-drops'],
        images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop'],
        sizes: [{ size: 'S', stock: 2 }, { size: 'M', stock: 4 }, { size: 'L', stock: 3 }],
        colorway: 'Waxed Black / Crimson',
        isLimitedEdition: true,
        dropDate: new Date(Date.now() + 86400000 * 14),
        tags: ['Trench', 'Limited Drop', 'Duster']
      }
    ];

    const products = await Product.insertMany(productSeeds);
    console.log(`[XO Seed] Inserted ${products.length} products successfully.`);

    console.log('[XO Seed] Creating sample reviews...');
    const reviews = [
      {
        user: customers[0]._id,
        product: products[0]._id,
        rating: 5,
        comment: 'The weight of this 500GSM fleece is insane. Feels like body armor. Crimson inner stitching is top tier dark luxury.'
      },
      {
        user: customers[1]._id,
        product: products[0]._id,
        rating: 5,
        comment: 'Best oversized hoodie in my collection. Sharp silhouette and heavy hood structure.'
      },
      {
        user: customers[2]._id,
        product: products[5]._id,
        rating: 5,
        comment: 'The gel print on the back has amazing texture. Thick 300GSM fabric that doesn’t lose shape after washing.'
      },
      {
        user: customers[3]._id,
        product: products[10]._id,
        rating: 5,
        comment: 'Masterpiece leather jacket. Smells incredible and the silk crimson lining makes me feel like gothic royalty.'
      },
      {
        user: customers[4]._id,
        product: products[15]._id,
        rating: 4,
        comment: 'Very versatile cargo pants with great hardware. Cuffs adjust cleanly.'
      }
    ];

    await Review.insertMany(reviews);

    console.log('[XO Seed] Creating 20+ sample orders across statuses for Admin Dashboard...');
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const orderSeeds = [];

    for (let i = 0; i < 22; i++) {
      const customer = customers[i % customers.length];
      const randomProd1 = products[Math.floor(Math.random() * products.length)];
      const randomProd2 = products[Math.floor(Math.random() * products.length)];
      const status = orderStatuses[i % orderStatuses.length];

      const item1Price = randomProd1.price;
      const item2Price = randomProd2.price;
      const item1Qty = Math.floor(Math.random() * 2) + 1;
      const item2Qty = 1;

      const itemsPrice = (item1Price * item1Qty) + (item2Price * item2Qty);
      const shippingPrice = itemsPrice > 500 ? 0 : 25;
      const totalPrice = itemsPrice + shippingPrice;

      const placedDaysAgo = Math.floor(Math.random() * 30);
      const placedAt = new Date(Date.now() - (placedDaysAgo * 86400000));

      orderSeeds.push({
        user: customer._id,
        items: [
          {
            product: randomProd1._id,
            name: randomProd1.name,
            size: randomProd1.sizes[0]?.size || 'M',
            quantity: item1Qty,
            price: item1Price,
            image: randomProd1.images[0]
          },
          {
            product: randomProd2._id,
            name: randomProd2.name,
            size: randomProd2.sizes[1]?.size || 'L',
            quantity: item2Qty,
            price: item2Price,
            image: randomProd2.images[0]
          }
        ],
        shippingAddress: {
          street: `${100 + i * 12} Obsidian Boulevard`,
          city: ['New York', 'Los Angeles', 'Chicago', 'London', 'Berlin', 'Tokyo'][i % 6],
          state: 'NY',
          postalCode: '10002',
          country: 'USA'
        },
        paymentMethod: 'Credit Card (Stripe Test)',
        paymentStatus: status === 'cancelled' ? 'failed' : 'paid',
        itemsPrice,
        shippingPrice,
        totalPrice,
        orderStatus: status,
        placedAt,
        deliveredAt: status === 'delivered' ? new Date(placedAt.getTime() + 86400000 * 3) : null
      });
    }

    await Order.insertMany(orderSeeds);

    console.log('[XO Seed] Creating coupons...');
    await Coupon.create({
      code: 'XO10',
      discountPercent: 10,
      minOrderValue: 200,
      expiryDate: new Date(Date.now() + 86400000 * 90),
      isActive: true
    });
    await Coupon.create({
      code: 'NOCTURNE20',
      discountPercent: 20,
      minOrderValue: 500,
      expiryDate: new Date(Date.now() + 86400000 * 90),
      isActive: true
    });

    console.log('=====================================================');
    console.log('[XO Seed] SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`Admin User: admin@xo.com | Password: admin123`);
    console.log(`Sample Customers: ${customerSeeds.length} created (Password: customer123)`);
    console.log(`Categories: ${categories.length} created`);
    console.log(`Products: ${products.length} created`);
    console.log(`Orders: ${orderSeeds.length} created across 5 statuses`);
    console.log('=====================================================');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[XO Seed] Error during database seed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
