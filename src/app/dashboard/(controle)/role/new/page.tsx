import { CONFIG } from 'src/config-global';

import { RoleCreateView } from 'src/sections/admin/(controle)/role/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - create role - ${CONFIG.site.name}` };

export default function Page() {
  return <RoleCreateView />;
}
