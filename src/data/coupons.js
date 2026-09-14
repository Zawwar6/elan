/** Default seed coupons — admin can add/edit/delete via Admin > Coupons. */
export const DEFAULT_COUPONS = [
  {
    id: 'cpn-welcome10',
    code: 'WELCOME10',
    discountPercent: 10,
    minOrder: 50,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 0,
    active: true,
  },
  {
    id: 'cpn-autumn20',
    code: 'AUTUMN20',
    discountPercent: 20,
    minOrder: 120,
    expiryDate: '2027-06-30',
    usageLimit: 300,
    usedCount: 0,
    active: true,
  },
  {
    id: 'cpn-vip15',
    code: 'VIP15',
    discountPercent: 15,
    minOrder: 0,
    expiryDate: '2026-12-31',
    usageLimit: 50,
    usedCount: 0,
    active: false,
  },
]
