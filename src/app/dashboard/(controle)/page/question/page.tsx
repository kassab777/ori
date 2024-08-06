import { CONFIG } from 'src/config-global';

import { QuestionListView } from 'src/sections/admin/(page)/question/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - common questions - ${CONFIG.site.name}` };

export default function Page() {
  return <QuestionListView />;
}
