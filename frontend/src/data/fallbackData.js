export const FALLBACK_CATEGORIES = [
  {
    _id: 'cat-1',
    name: 'Hoodies & Sweats',
    slug: 'hoodies',
    description: 'Heavyweight French terry & fleece silhouettes with raw edges, metal hardware, and distressed embroidery.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-2',
    name: 'Tees & Tops',
    slug: 'tees',
    description: 'Ultra-heavy 280GSM organic cotton garments featuring hand-screenprinted occult typography and drop shoulders.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-3',
    name: 'Outerwear & Leather',
    slug: 'outerwear',
    description: 'Full-grain lambskin, tailored trench coats, and bonded technical parkas built for cold urban darkness.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-4',
    name: 'Bottoms & Cargo',
    slug: 'bottoms',
    description: 'Multi-pocket modular cargo trousers, waxed Japanese denim, and elongated drawcord sweatpants.',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-5',
    name: 'Accessories & Hardware',
    slug: 'accessories',
    description: 'Sterling silver chain links, full-grain leather harnesses, studded belts, and embroidered balaclavas.',
    image: 'https://images.unsplash.com/photo-1611591475281-9199d99723ec?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat-6',
    name: 'Limited Drops',
    slug: 'limited-drops',
    description: 'Numbered run items available exclusively in micro-quantities. Once sold out, never reproduced.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
  }
];

export const FALLBACK_PRODUCTS = [
  {
    _id: 'prod-1',
    name: 'Requiem Oversized Heavyweight Hoodie',
    slug: 'requiem-oversized-heavyweight-hoodie',
    description: 'Engineered from 500GSM double-faced loopback terry in jet obsidian. Features double-layered hood with silver eyelets and blood-red inner seams.',
    price: 320,
    compareAtPrice: 380,
    category: { _id: 'cat-1', name: 'Hoodies & Sweats', slug: 'hoodies' },
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 4 }],
    colorway: 'Obsidian Black / Blood Crimson',
    isLimitedEdition: false,
    rating: 5,
    numReviews: 14
  },
  {
    _id: 'prod-2',
    name: 'Nocturne Distressed Zip Hoodie',
    slug: 'nocturne-distressed-zip-hoodie',
    description: 'Full-length custom Raccagni silver zipper closure with laser-etched XO insignia. Hand-frayed hems with contrast crimson stitching.',
    price: 340,
    compareAtPrice: 0,
    category: { _id: 'cat-1', name: 'Hoodies & Sweats', slug: 'hoodies' },
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 2 }],
    colorway: 'Pitch Black',
    isLimitedEdition: false,
    rating: 4.8,
    numReviews: 9
  },
  {
    _id: 'prod-3',
    name: 'Sable Cross Heavyweight Vintage Tee',
    slug: 'sable-cross-heavyweight-vintage-tee',
    description: '300GSM carded cotton knit with vintage oil wash. Features high-density gel coat print of signature XO Iron Cross.',
    price: 140,
    compareAtPrice: 165,
    category: { _id: 'cat-2', name: 'Tees & Tops', slug: 'tees' },
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'S', stock: 15 }, { size: 'M', stock: 20 }, { size: 'L', stock: 18 }, { size: 'XL', stock: 8 }],
    colorway: 'Vintage Black',
    isLimitedEdition: false,
    rating: 4.9,
    numReviews: 22
  },
  {
    _id: 'prod-4',
    name: 'Vampyre Italian Lambskin Biker Jacket',
    slug: 'vampyre-italian-lambskin-biker-jacket',
    description: 'Hand-waxed full-grain Italian lambskin with silver hardware buckles, quilted shoulders, and blood-red silk cupro lining.',
    price: 1450,
    compareAtPrice: 1750,
    category: { _id: 'cat-3', name: 'Outerwear & Leather', slug: 'outerwear' },
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'S', stock: 2 }, { size: 'M', stock: 4 }, { size: 'L', stock: 3 }, { size: 'XL', stock: 1 }],
    colorway: 'Full Black / Crimson Lining',
    isLimitedEdition: false,
    rating: 5,
    numReviews: 18
  },
  {
    _id: 'prod-5',
    name: 'Nocturne Modular Cargo Pants',
    slug: 'nocturne-modular-cargo-pants',
    description: 'Heavy cotton twill with 10 utility pockets, detachable strap harnesses, and adjustable zipped cuffs.',
    price: 340,
    compareAtPrice: 390,
    category: { _id: 'cat-4', name: 'Bottoms & Cargo', slug: 'bottoms' },
    images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 12 }, { size: 'L', stock: 9 }, { size: 'XL', stock: 4 }],
    colorway: 'Jet Black Twill',
    isLimitedEdition: false,
    rating: 4.7,
    numReviews: 11
  },
  {
    _id: 'prod-6',
    name: 'Heavyweight Sterling Silver XO Chain',
    slug: 'heavyweight-sterling-silver-xo-chain',
    description: 'Solid 925 Sterling Silver hand-cast cuban link necklace with custom skull pendant engraved with drop number.',
    price: 490,
    compareAtPrice: 580,
    category: { _id: 'cat-5', name: 'Accessories & Hardware', slug: 'accessories' },
    images: ['https://images.unsplash.com/photo-1611591475281-9199d99723ec?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'ONE SIZE', stock: 15 }],
    colorway: 'Oxidized Silver',
    isLimitedEdition: false,
    rating: 5,
    numReviews: 26
  },
  {
    _id: 'prod-7',
    name: 'XO DROP 001: Archival Relic Leather Duster',
    slug: 'xo-drop-001-archival-relic-leather-duster',
    description: 'LIMITED TO 50 PIECES WORLDWIDE. Full-length distressed horsehide duster jacket featuring hand-painted crimson gothic typography.',
    price: 2150,
    compareAtPrice: 2600,
    category: { _id: 'cat-6', name: 'Limited Drops', slug: 'limited-drops' },
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'S', stock: 2 }, { size: 'M', stock: 3 }, { size: 'L', stock: 2 }],
    colorway: 'Aged Black / Blood Stain',
    isLimitedEdition: true,
    rating: 5,
    numReviews: 31
  },
  {
    _id: 'prod-8',
    name: 'Sanctum Oversized Wool Trench Coat',
    slug: 'sanctum-oversized-wool-trench-coat',
    description: 'Double-breasted heavyweight virgin wool trench with extended length collar lapels and removable waist harness belt.',
    price: 890,
    compareAtPrice: 1050,
    category: { _id: 'cat-3', name: 'Outerwear & Leather', slug: 'outerwear' },
    images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'],
    sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 5 }, { size: 'L', stock: 4 }],
    colorway: 'Pitch Black Wool',
    isLimitedEdition: false,
    rating: 4.9,
    numReviews: 15
  }
];
