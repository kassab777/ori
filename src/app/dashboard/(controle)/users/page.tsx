import { CONFIG } from 'src/config-global';

import { UserListView } from 'src/sections/admin/(controle)/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - users - ${CONFIG.site.name}` };

export default function Page() {
  return <UserListView />;
}
