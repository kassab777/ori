'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetUser, useGetMeUser } from 'src/actions/admin/controle/user';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import NewEditForm from '../user-new-edit-form';

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

// ----------------------------------------------------------------------

export function UserEditView({ id }: Props) {
  const { t: tnav } = useTranslate('navbar');

  const { data } = useGetUser(id as string);
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
            acceptRoles={['update-user']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                { name: tnav('users'), href: paths.dashboard.user.root },
                { name: data?.name },
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
