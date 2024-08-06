'use client';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import { TableList } from '../option-list';
import { OptionQuickEditForm } from '../option-quick-edit-form';

// ----------------------------------------------------------------------

const RoleBasedGuardStyle = {
  py: 10,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

type Props = {
  serviceId: string;
  subServiceId: string;
};

// ----------------------------------------------------------------------

export function SubserviceOptionView({ serviceId, subServiceId }: Props) {
  const { t: tnav } = useTranslate('navbar');
  const { t: tSubServiceOption } = useTranslate('sub-service-option');

  const confirm = useBoolean();

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
                {
                  name: tnav('sub-service'),
                  href: `${paths.dashboard.service_group.service.root}/${serviceId}`,
                },
                { name: tnav('options') },
              ]}
              action={
                ACCEPT_CREATE_ROLE && (
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={confirm.onTrue}
                  >
                    {tSubServiceOption('button.new')}
                  </Button>
                )
              }
              sx={{ mb: { xs: 3, md: 5 } }}
            />

            <TableList currentRole={userPermissions} subServiceId={subServiceId} />
          </RoleBasedGuard>

          <OptionQuickEditForm open={confirm.value} onClose={confirm.onFalse} subServiceId={subServiceId} />
        </DashboardContent>
      )}
    </>
  );
}
