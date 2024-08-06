import { CONFIG } from 'src/config-global';

import { CouponEditView } from 'src/sections/admin/(service)/coupon/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - update coupon - ${CONFIG.site.name}` };

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <CouponEditView id={id} />;
}
