'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetRole } from 'src/actions/admin/controle/role';
import { useGetMeUser } from 'src/actions/admin/controle/user';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import NewEditForm from '../role-new-edit-form';

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
export function RoleEditView({ id }: Props) {
  const { t: tnav } = useTranslate('navbar');

  const { data } = useGetRole(id as string);
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
            acceptRoles={['update-role']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                { name: tnav('roles'), href: paths.dashboard.role.root },
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
