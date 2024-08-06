import { CONFIG } from 'src/config-global';

import { RoleDetailsView } from 'src/sections/admin/(controle)/role/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - details role - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <RoleDetailsView id={params.id} />;
}
