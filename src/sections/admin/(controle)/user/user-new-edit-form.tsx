import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Grid,
  Card,
  Stack,
  MenuItem,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { useGetRoles } from 'src/actions/admin/controle/role';
import { createUser, updateUser } from 'src/actions/admin/controle/user';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: IUserItem;
  currentRole: string[];
};

// ----------------------------------------------------------------------
export default function NewEditForm({ currentItem, currentRole }: Props) {
  const { t: tuser } = useTranslate('user');
  const { t: tcommon } = useTranslate('common');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-user'));
  const ACCEPT_CREATE_ROLE = Boolean(currentRole.includes('create-user'));

  const router = useRouter();

  const password = useBoolean();

  const { data: rolesOptions } = useGetRoles();

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    name: zod.string().min(1, { message: tuser('form.name.required') }),
    password: zod
      .string()
      .min(1, { message: tuser('form.password.required') })
      .min(6, { message: tuser('form.password.min') }),

    phone: schemaHelper.phoneNumber({
      isValidPhoneNumber,
      message: {
        required_error: tuser('form.phone.required'),
        invalid_type_error: tuser('form.phone.format'),
      },
    }),

    date_of_birth: schemaHelper.date({
      message: { required_error: tuser('form.date_of_birth.required') },
    }),
    national_id: zod.string().min(1, { message: tuser('form.national_id.required') }),
    roles_name: zod.string().min(1, { message: tuser('form.roles_name.required') }),
    photo: schemaHelper.file({
      message: { required_error: tuser('form.photo.required') },
    }),
    email: zod
      .string()
      .min(1, { message: tuser('form.email.required') })
      .email({ message: tuser('form.email.format') }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      password: currentItem?.password || '',
      phone: currentItem?.phone || '',
      date_of_birth: currentItem?.date_of_birth || null,
      national_id: currentItem?.national_id || '',
      roles_name: currentItem?.roles_name || '',
      photo: currentItem?.photo || null,
      email: currentItem?.email || '',
    }),
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
  }, [reset, currentItem]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem && ACCEPT_UPDATE_ROLE) {
        if (currentItem?.photo === data?.photo) {
          delete (data as { photo?: string | File | null }).photo;
        }

        await updateUser(`${currentItem.id}`, data);

        reset();
        router.push(paths.dashboard.user.root);
        toast.success(tcommon('alert.update-success'));
      } else if (ACCEPT_CREATE_ROLE) {
        await createUser(data);

        reset();
        router.push(paths.dashboard.user.root);
        toast.success(tcommon('alert.create-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error}`);
      console.error(error);
    }
  });

  const renderAvatar = (
    <Card
      sx={{
        pt: 10,
        pb: 5,
        px: 3,
      }}
    >
      <Field.UploadAvatar
        name="photo"
        maxSize={3145728}
        helperText={
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'center',
              color: 'text.disabled',
            }}
          >
            {`${tuser('form.photo.label')} *`}
            <br /> {tcommon('allowed')} *.jpeg, *.jpg, *.png, *.gif
            <br /> {tcommon('max-size-of')} {fData(3145728)}
          </Typography>
        }
      />
    </Card>
  );
  const renderFiled = (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      <Field.Text type="text" name="name" label={`${tuser('form.name.label')} *`} />
      <Field.Text type="email" name="email" label={`${tuser('form.email.label')} *`} />

      <Field.Select fullWidth name="roles_name" label={`${tuser('form.roles_name.label')} *`}>
        {rolesOptions.map((option) => (
          <MenuItem key={option.id} value={option.name} sx={{ textTransform: 'capitalize' }}>
            {option.name}
          </MenuItem>
        ))}
      </Field.Select>
      <Field.Text
        type={password.value ? 'text' : 'password'}
        name="password"
        placeholder={tuser('form.password.placeholder')}
        label={`${tuser('form.password.label')} *`}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Phone
        type="text"
        name="phone"
        label={`${tuser('form.phone.label')} *`}
        placeholder={tuser('form.phone.placeholder')}
      />
      <Field.DatePicker name="date_of_birth" label={`${tuser('form.date_of_birth.label')} *`} />
      <Field.Text type="text" name="national_id" label={`${tuser('form.national_id.label')} *`} />
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Grid xs={12}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: '30% 70%',
            }}
          >
            {renderAvatar}
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              {renderFiled}

              {(ACCEPT_CREATE_ROLE || ACCEPT_UPDATE_ROLE) && (
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!currentItem ? tuser(`button.create`) : tuser(`button.save`)}
                  </LoadingButton>
                </Stack>
              )}
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}
