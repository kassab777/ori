import { CONFIG } from 'src/config-global';

import { RoleEditView } from 'src/sections/admin/(controle)/role/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - update role - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <RoleEditView id={params.id} />;
}
