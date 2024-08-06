'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetTerm } from 'src/actions/admin/page/term';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import NewEditForm from '../term-new-edit-form';

// ----------------------------------------------------------------------

const RoleBasedGuardStyle = {
  py: 10,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

// ----------------------------------------------------------------------
export function TermListView() {
  const { t: tnav } = useTranslate('navbar');

  const { data } = useGetTerm();
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
            acceptRoles={['term']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                { name: tnav('term') },
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
