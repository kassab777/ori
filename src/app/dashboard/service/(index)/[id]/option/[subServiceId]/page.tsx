import { CONFIG } from 'src/config-global';

import { SubserviceOptionView } from 'src/sections/admin/(service)/option/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - sub services - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
    subServiceId: string;
  };
};

export default function Page({ params }: Props) {
  const { subServiceId, id } = params;

  return <SubserviceOptionView serviceId={id} subServiceId={subServiceId} />;
}
