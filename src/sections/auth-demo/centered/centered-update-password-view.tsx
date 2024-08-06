'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function CenteredUpdatePasswordView() {
  const password = useBoolean();

  const { t: tauth } = useTranslate('auth-demo');

  type UpdatePasswordSchemaType = zod.infer<typeof UpdatePasswordSchema>;

  const UpdatePasswordSchema = zod
    .object({
      code: zod
        .string()
        .min(1, { message: tauth('update-password.form.code.required') })
        .min(6, { message: tauth('update-password.form.code.min') }),
      email: zod
        .string()
        .min(1, { message: tauth('update-password.form.email.min') })
        .email({ message: tauth('update-password.form.email.format') }),
      password: zod
        .string()
        .min(1, { message: tauth('update-password.form.password.required') })
        .min(6, { message: tauth('update-password.form.password.min') }),
      confirmPassword: zod
        .string()
        .min(1, { message: tauth('update-password.form.confirmPassword.min') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tauth('update-password.form.confirmPassword.match'),
      path: ['confirmPassword'],
    });

  const defaultValues = {
    code: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderHead = (
    <>
      <SentIcon sx={{ mx: 'auto' }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5">
          {tauth('update-password.body.request-sent-successfully')}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {tauth('update-password.body.helperText')}{' '}
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label={tauth('update-password.form.email.label')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Code name="code" />

      <Field.Text
        name="password"
        label={tauth('update-password.form.password.label')}
        placeholder={tauth('update-password.form.password.placeholder')}
        type={password.value ? 'text' : 'password'}
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

      <Field.Text
        name="confirmPassword"
        label={tauth('update-password.form.confirmPassword.label')}
        type={password.value ? 'text' : 'password'}
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tauth(`update-password.body.update-password...`)}
      >
        {tauth('update-password.body.update-password')}
      </LoadingButton>

      <Typography variant="body2" sx={{ mx: 'auto' }}>
        {tauth('update-password.body.don’t-have-a-code')}
        <Link variant="subtitle2" sx={{ cursor: 'pointer' }}>
          {tauth('update-password.body.resend-code')}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.authDemo.centered.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ mx: 'auto', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify width={16} icon="eva:arrow-ios-back-fill" />
        {tauth('update-password.body.return-to-sign-in')}
      </Link>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
