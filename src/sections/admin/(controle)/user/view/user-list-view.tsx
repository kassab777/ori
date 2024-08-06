'use client';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import { TableList } from '../user-table-list';

// ----------------------------------------------------------------------

const RoleBasedGuardStyle = {
  py: 10,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

// ----------------------------------------------------------------------
export function UserListView() {
  const { t: tcommon } = useTranslate('common');
  const { t: tnav } = useTranslate('navbar');
  const { t: tuser } = useTranslate('user');

  const { userPermissions, userLoading } = useGetMeUser();

  const ACCEPT_CREATE_ROLE = Boolean(userPermissions.includes('create-user'));

  return (
    <>
      {userLoading ? (
        <LoadingScreen />
      ) : (
        <DashboardContent>
          <RoleBasedGuard
            hasContent
            currentRole={userPermissions}
            acceptRoles={['user-list']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                { name: tnav('users'), href: paths.dashboard.user.root },
                { name: tcommon('list') },
              ]}
              action={
                ACCEPT_CREATE_ROLE && (
                  <Button
                    component={RouterLink}
                    href={paths.dashboard.user.new}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                  >
                    {tuser('button.new')}
                  </Button>
                )
              }
              sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card
              sx={{
                height: { xs: 800, md: 2 },
                flexGrow: { md: 1 },
                display: { md: 'flex' },
                flexDirection: { md: 'column' },
              }}
            >
              <TableList currentRole={userPermissions} />
            </Card>
          </RoleBasedGuard>
        </DashboardContent>
      )}
    </>
  );
}
