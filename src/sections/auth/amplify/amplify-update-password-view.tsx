'use client';

import { z as zod } from 'zod';
import { useCallback } from 'react';
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
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { useTranslate } from 'src/locales';
import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { resetPassword, updatePassword } from 'src/auth/context/amplify';

// ----------------------------------------------------------------------

export function AmplifyUpdatePasswordView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const password = useBoolean();

  const { t: tauth } = useTranslate('auth-amplify');

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

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
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updatePassword({
        username: data.email,
        confirmationCode: data.code,
        newPassword: data.password,
      });

      router.push(paths.auth.amplify.signIn);
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await resetPassword({ username: values.email });
    } catch (error) {
      console.error(error);
    }
  }, [startCountdown, values.email]);

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
        placeholder={tauth('update-password.form.email.placeholder')}
        InputLabelProps={{ shrink: true }}
        disabled
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

      <Typography variant="body2" sx={{ mx: 'auto', display: "flex", gap: 1 }}>
        {tauth('update-password.body.don’t-have-a-code')}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && { color: 'text.disabled', pointerEvents: 'none' }),
          }}
        >
          {tauth('update-password.body.resend-code')} {counting && `(${countdown}s)`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.authDemo.split.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ gap: 0.5, alignSelf: 'center', alignItems: 'center', display: 'inline-flex' }}
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
