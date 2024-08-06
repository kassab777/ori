'use client';

import { Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import { ReportReviewList } from '../review-table-list';

// ----------------------------------------------------------------------

const RoleBasedGuardStyle = {
  py: 10,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

// ----------------------------------------------------------------------

export function ServiceReviewListView() {
  const { t: tnav } = useTranslate('navbar');

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
            acceptRoles={['service-list']}
            sx={RoleBasedGuardStyle}
          >
            <CustomBreadcrumbs
              links={[
                { name: tnav('dashboard'), href: paths.dashboard.root },
                { name: tnav('reports'), href: paths.dashboard.service_group.report.review.root },
                { name: tnav('reviews') },
              ]}
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
              <ReportReviewList />
            </Card>
          </RoleBasedGuard>
        </DashboardContent>
      )}
    </>
  );
}
