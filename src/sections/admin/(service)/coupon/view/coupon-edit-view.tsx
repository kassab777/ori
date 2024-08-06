'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';
import { useGetCoupon } from 'src/actions/admin/service/coupon';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import NewEditForm from '../coupon-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id?: string;
};

const RoleBasedGuardStyle = {
  py: 10,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

// ---------------------------------------------------------------------

export function CouponEditView({ id }: Props) {
  const { t: tnav } = useTranslate('navbar');

  const { data } = useGetCoupon(id as string);
  const { userPermissions, userLoading } = useGetMeUser();

  return (
    <>
      {userLoading ? (
        <LoadingScreen />
      ) : (
        <DashboardContent>
          <RoleBasedGuard
            hasContent
            currentRole={userPermissions}
            acceptRoles={['update-question']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                {
                  name: tnav('coupons'),
                  href: paths.dashboard.service_group.coupon.root,
                },
                { name: data?.discount_code },
              ]}
              sx={{ mb: { xs: 3, md: 5 } }}
            />

            <NewEditForm currentItem={data} currentRole={userPermissions} />
          </RoleBasedGuard>
        </DashboardContent>
      )}
    </>
  );
}
