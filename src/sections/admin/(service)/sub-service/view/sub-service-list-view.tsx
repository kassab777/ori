'use client';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';
import { useGetSubServices } from 'src/actions/admin/service/sub-service';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import SubServiceList from '../sub-service-list';
import { SubServiceQuickEditForm } from '../sub-service-quick-edit-form';

// ----------------------------------------------------------------------

const RoleBasedGuardStyle = {
  py: 10,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

type Props = {
  id: string;
};

// ----------------------------------------------------------------------
export function SubServiceListView({ id }: Props) {
  const { t: tnav } = useTranslate('navbar');
  const { t: tsubservice } = useTranslate('sub-service');

  const confirm = useBoolean();

  const { data } = useGetSubServices(id);
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
            acceptRoles={['term']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                { name: tnav('main-services'), href: paths.dashboard.service_group.service.root },
                { name: tnav('sub-service') },
              ]}
              action={
                ACCEPT_CREATE_ROLE && (
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={confirm.onTrue}
                  >
                    {tsubservice('button.new')}
                  </Button>
                )
              }
              sx={{ mb: { xs: 3, md: 5 } }}
            />

            <SubServiceList data={data} serviceId={id} />
          </RoleBasedGuard>

          <SubServiceQuickEditForm open={confirm.value} onClose={confirm.onFalse} serviceId={id} />
        </DashboardContent>
      )}
    </>
  );
}
