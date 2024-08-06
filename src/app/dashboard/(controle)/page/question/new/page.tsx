import { CONFIG } from 'src/config-global';

import { QuestionCreateView } from 'src/sections/admin/(page)/question/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - create question - ${CONFIG.site.name}` };

export default function Page() {
  return <QuestionCreateView />;
}
