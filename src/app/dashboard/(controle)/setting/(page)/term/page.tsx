import { CONFIG } from 'src/config-global';

import { TermListView } from 'src/sections/admin/(page)/term/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - term - ${CONFIG.site.name}` };

export default function Page() {
  return <TermListView />;
}
