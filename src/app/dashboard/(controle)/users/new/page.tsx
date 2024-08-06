import { CONFIG } from 'src/config-global';

import { UserCreateView } from 'src/sections/admin/(controle)/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - create user - ${CONFIG.site.name}` };

export default function Page() {
  return <UserCreateView />;
}
