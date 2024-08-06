import { CONFIG } from 'src/config-global';

import { AboutUsListView } from 'src/sections/admin/(page)/about-us/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - about us - ${CONFIG.site.name}` };

export default function Page() {
  return <AboutUsListView />;
}
