import { CONFIG } from 'src/config-global';

import { QuestionEditView } from 'src/sections/admin/(page)/question/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - update question - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <QuestionEditView id={params?.id} />;
}
