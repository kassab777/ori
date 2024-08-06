import { CONFIG } from 'src/config-global';

import { SubServiceListView } from 'src/sections/admin/(service)/sub-service/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - sub services - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <SubServiceListView id={id} />;
}
