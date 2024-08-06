import { CONFIG } from 'src/config-global';

import { SettingListView } from 'src/sections/admin/(controle)/setting/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - setting - ${CONFIG.site.name}` };

export default function Page() {
  return <SettingListView />;
}
