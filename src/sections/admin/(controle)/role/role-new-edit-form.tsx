import type { IRoleItem } from 'src/types/role';
import type { IPermissionItem } from 'src/types/permission';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Card, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { permissions } from 'src/assets/data';
import { createRole, updateRole } from 'src/actions/admin/controle/role';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentRole: string[];
  currentItem?: IRoleItem;
  readonly?: true;
};

// ----------------------------------------------------------------------
export default function NewEditForm({ currentItem, currentRole, readonly }: Props) {
  const { t: tcommon } = useTranslate('common');
  const { t: trole } = useTranslate('roles');
  const { t: tpermission } = useTranslate('permission');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-role'));
  const ACCEPT_CREATE_ROLE = Boolean(currentRole.includes('create-role'));

  const router = useRouter();

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    name: zod.string().min(1, { message: trole('form.name.required') }),
    permissions: zod.array(zod.string()).min(1, { message: trole('form.permissions.min') }),
  });

  const defaultValues = useMemo(
    () => ({ name: currentItem?.name || '', permissions: currentItem?.permissions || [] }),
    [currentItem]
  );

  const methods = useForm<NewSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(currentItem);
  }, [currentItem, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem && ACCEPT_UPDATE_ROLE) {
        await updateRole(`${currentItem?.id}`, data);

        reset();
        router.push(paths.dashboard.role.root);
        toast.success(tcommon('alert.update-success'));
      } else if (ACCEPT_CREATE_ROLE) {
        await createRole(data);

        reset();
        router.push(paths.dashboard.role.root);
        toast.success(tcommon('alert.create-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error}`);
      console.error(error);
    }
  });

  const modifiedData: IPermissionItem[] = permissions.map((item) => ({
    ...item,
    options: item.options.map((option) => ({
      ...option,
      label: tpermission(`${option.label}`),
    })),
  }));

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Grid xs={12}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Field.Text
              type="text"
              name="name"
              label={`${trole('form.name.label')} *`}
              InputProps={{ disabled: Boolean(currentItem) }}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              sx={{ py: 3 }}
            >
              {modifiedData.map((permission) => (
                <Stack
                  spacing={1}
                  sx={{
                    border: '1.2px solid #919EAB3B !important',
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                  }}
                >
                  <Field.MultiCheckbox
                    name="permissions"
                    label={tpermission(`${permission.label}`)}
                    options={permission.options}
                    slotProps={{ checkbox: { disabled: readonly } }}
                  />
                </Stack>
              ))}
            </Box>

            {(ACCEPT_CREATE_ROLE || ACCEPT_UPDATE_ROLE) && (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                {!readonly && (
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!currentItem ? trole(`button.create`) : trole(`button.save`)}
                  </LoadingButton>
                )}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
