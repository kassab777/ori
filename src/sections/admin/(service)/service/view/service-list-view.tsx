'use client';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';
import { useGetServices } from 'src/actions/admin/service/service';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import ServiceList from '../service-list';
import { ServiceQuickEditForm } from '../service-quick-edit-form';

// ----------------------------------------------------------------------

const RoleBasedGuardStyle = {
  py: 10,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

// ----------------------------------------------------------------------

export function ServiceListView() {
  const { t: tcommon } = useTranslate('common');
  const { t: tnav } = useTranslate('navbar');
  const { t: tService } = useTranslate('service');

  const confirm = useBoolean();

  const { data } = useGetServices();
  const { userPermissions, userLoading } = useGetMeUser();

  const ACCEPT_CREATE_ROLE = Boolean(userPermissions.includes('create-service'));

  return (
    <>
      {userLoading ? (
        <LoadingScreen />
      ) : (
        <DashboardContent>
          <RoleBasedGuard
            hasContent
            currentRole={userPermissions}
            acceptRoles={['service-list']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                { name: tnav('main-services'), href: paths.dashboard.service_group.service.root },
                { name: tcommon('list') },
              ]}
              action={
                ACCEPT_CREATE_ROLE && (
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={confirm.onTrue}
                  >
                    {tService('button.new')}
                  </Button>
                )
              }
              sx={{ mb: { xs: 3, md: 5 } }}
            />

            <ServiceList data={data} />
          </RoleBasedGuard>

          <ServiceQuickEditForm open={confirm.value} onClose={confirm.onFalse} />
        </DashboardContent>
      )}
    </>
  );
}
