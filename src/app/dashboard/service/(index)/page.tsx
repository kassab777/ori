import { CONFIG } from 'src/config-global';

import { ServiceListView } from 'src/sections/admin/(service)/service/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - services list - ${CONFIG.site.name}` };

export default function Page() {
  return <ServiceListView />;
}
