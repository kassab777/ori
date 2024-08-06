import { CONFIG } from 'src/config-global';

import { CouponCreateView } from 'src/sections/admin/(service)/coupon/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - create coupon - ${CONFIG.site.name}` };

export default function Page() {
  return <CouponCreateView />;
}
