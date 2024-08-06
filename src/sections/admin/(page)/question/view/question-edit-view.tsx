'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMeUser } from 'src/actions/admin/controle/user';
import { useGetQuestion } from 'src/actions/admin/page/question';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';

import NewEditForm from '../question-new-edit-form';

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

export function QuestionEditView({ id }: Props) {
  const { t: tnav } = useTranslate('navbar');

  const { data } = useGetQuestion(id as string);
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
                  name: tnav('common-questions'),
                  href: paths.dashboard.setting.question.root,
                },
                { name: data?.question },
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
