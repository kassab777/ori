import { CONFIG } from 'src/config-global';

import { CouponListView } from 'src/sections/admin/(service)/coupon/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - coupons - ${CONFIG.site.name}` };

export default function Page() {
  return <CouponListView />;
}
