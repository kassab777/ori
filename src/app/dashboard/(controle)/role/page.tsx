import { CONFIG } from 'src/config-global';

import { RoleListView } from 'src/sections/admin/(controle)/role/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - roles - ${CONFIG.site.name}` };

export default function Page() {
  return <RoleListView />;
}
