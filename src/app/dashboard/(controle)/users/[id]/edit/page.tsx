import { CONFIG } from 'src/config-global';

import { UserEditView } from 'src/sections/admin/(controle)/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - update user - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <UserEditView id={id} />;
}
