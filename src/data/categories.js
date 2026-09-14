/**
 * Default category tree. Shape:
 * { id, name, slug, subcategories: [{ id, name, slug }] }
 * Admin CRUD (Category Management) reads/writes this shape via storage.js —
 * this file only seeds it the first time the app runs.
 */
export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-men',
    name: 'Men',
    slug: 'men',
    subcategories: [
      { id: 'sub-men-tshirts', name: 'T-Shirts', slug: 't-shirts' },
      { id: 'sub-men-shirts', name: 'Shirts', slug: 'shirts' },
      { id: 'sub-men-jeans', name: 'Jeans', slug: 'jeans' },
      { id: 'sub-men-trousers', name: 'Trousers', slug: 'trousers' },
      { id: 'sub-men-outerwear', name: 'Outerwear', slug: 'outerwear' },
      { id: 'sub-men-shoes', name: 'Shoes', slug: 'shoes' },
    ],
  },
  {
    id: 'cat-women',
    name: 'Women',
    slug: 'women',
    subcategories: [
      { id: 'sub-women-dresses', name: 'Dresses', slug: 'dresses' },
      { id: 'sub-women-tops', name: 'Tops', slug: 'tops' },
      { id: 'sub-women-jeans', name: 'Jeans', slug: 'jeans' },
      { id: 'sub-women-outerwear', name: 'Outerwear', slug: 'outerwear' },
      { id: 'sub-women-shoes', name: 'Shoes', slug: 'shoes' },
      { id: 'sub-women-accessories', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 'cat-kids',
    name: 'Kids',
    slug: 'kids',
    subcategories: [
      { id: 'sub-kids-boys', name: 'Boys', slug: 'boys' },
      { id: 'sub-kids-girls', name: 'Girls', slug: 'girls' },
    ],
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    subcategories: [
      { id: 'sub-acc-bags', name: 'Bags', slug: 'bags' },
      { id: 'sub-acc-belts', name: 'Belts', slug: 'belts' },
      { id: 'sub-acc-hats', name: 'Hats', slug: 'hats' },
      { id: 'sub-acc-jewelry', name: 'Jewelry', slug: 'jewelry' },
    ],
  },
]
