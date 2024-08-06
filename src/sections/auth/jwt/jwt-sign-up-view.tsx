'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const { t: tauth } = useTranslate('auth-jwt');

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

  const SignUpSchema = zod.object({
    firstName: zod.string().min(1, { message: tauth('sign-up.form.firstName.min') }),
    lastName: zod.string().min(1, { message: tauth('sign-up.form.lastName.min') }),
    email: zod
      .string()
      .min(1, { message: tauth('sign-up.form.email.min') })
      .email({ message: tauth('sign-up.form.email.format') }),
    password: zod
      .string()
      .min(1, { message: tauth('sign-up.form.password.required') })
      .min(6, { message: tauth('sign-up.form.password.min') }),
  });

  const defaultValues = {
    firstName: 'Hello',
    lastName: 'Friend',
    email: 'hello@gmail.com',
    password: '@demo1',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">{tauth(`sign-up.body.get-started-absolutely-free`)}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {tauth(`sign-up.body.already-have-an-account`)}
        </Typography>

        <Link component={RouterLink} href={paths.auth.amplify.signIn} variant="subtitle2">
          {tauth(`sign-up.body.sign-in`)}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text
          name="firstName"
          label={tauth('sign-up.form.firstName.label')}
          InputLabelProps={{ shrink: true }}
        />
        <Field.Text
          name="lastName"
          label={tauth('sign-up.form.lastName.label')}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Field.Text
        name="email"
        label={tauth('sign-up.form.email.label')}
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="password"
        label={tauth('sign-up.form.password.label')}
        placeholder={tauth('sign-up.form.password.placeholder')}
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
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tauth(`sign-up.body.create-account...`)}
      >
        {tauth(`sign-up.body.create-account`)}
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
        display: 'flex',
        gap: 0.4,
      }}
    >
      {tauth(`sign-up.body.by-signing-up,i-agree-to`)}
      <Link underline="always" color="text.primary">
        {tauth(`sign-up.body.terms-of-service`)}
      </Link>
      {tauth(`sign-up.body.and`)}
      <Link underline="always" color="text.primary">
        {tauth(`sign-up.body.privacy-policy`)}
      </Link>
      .
    </Typography>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderTerms}
    </>
  );
}
