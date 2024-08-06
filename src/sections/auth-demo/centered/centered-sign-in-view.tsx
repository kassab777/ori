'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';
import { Iconify, SocialIcon } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const { t: tauth } = useTranslate('auth-demo');

  const password = useBoolean();

  type SignInSchemaType = zod.infer<typeof SignInSchema>;

  const SignInSchema = zod.object({
    email: zod
      .string()
      .min(1, { message: tauth('sign-in.form.email.min') })
      .email({ message: tauth('sign-in.form.email.format') }),
    password: zod
      .string()
      .min(1, { message: tauth('sign-in.form.password.required') })
      .min(6, { message: tauth('sign-in.form.password.min') }),
  });

  const defaultValues = { email: '', password: '' };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
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

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">{tauth('sign-in.body.sign-in-to-your-account')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {tauth(`sign-in.body.don't-have-an-account`)}
        </Typography>

        <Link component={RouterLink} href={paths.auth.amplify.signUp} variant="subtitle2">
          {tauth(`sign-in.body.get-started`)}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label={tauth(`sign-in.form.email.label`)}
        InputLabelProps={{ shrink: true }}
      />

      <Stack spacing={1.5}>
        <Link
          component={RouterLink}
          href={paths.authDemo.centered.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          {tauth(`sign-in.body.forgot-password`)}
        </Link>

        <Field.Text
          name="password"
          label={tauth(`sign-in.form.password.label`)}
          placeholder={tauth(`sign-in.form.password.placeholder`)}
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
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tauth(`sign-in.body.sign-in...`)}
      >
        {tauth(`sign-in.body.sign-in`)}
      </LoadingButton>
    </Stack>
  );

  const renderSignInWithSocials = (
    <>
      <Divider
        sx={{
          my: 3,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, :after': { borderTopStyle: 'dashed' },
        }}
      >
        {tauth(`sign-in.body.or`)}
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={1}>
        <IconButton>
          <SocialIcon icon="google" width={22} />
        </IconButton>

        <IconButton>
          <SocialIcon icon="github" width={22} />
        </IconButton>

        <IconButton>
          <SocialIcon icon="twitter" width={22} />
        </IconButton>
      </Stack>
    </>
  );

  return (
    <>
      {renderLogo}

      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderSignInWithSocials}
    </>
  );
}
