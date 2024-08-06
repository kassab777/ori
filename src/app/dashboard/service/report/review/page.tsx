import { CONFIG } from 'src/config-global';

import { ServiceReviewListView } from 'src/sections/admin/(service)/report/review/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - coupons - ${CONFIG.site.name}` };

export default function Page() {
  return <ServiceReviewListView />;
}
