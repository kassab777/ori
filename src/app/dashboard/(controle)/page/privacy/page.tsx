import { CONFIG } from 'src/config-global';

import { PrivacyListView } from 'src/sections/admin/(page)/privacy/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - privacy - ${CONFIG.site.name}` };

export default function Page() {
  return <PrivacyListView />;
}
