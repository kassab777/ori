'use client';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { useTranslate } from 'src/locales';
import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { confirmSignUp, resendSignUpCode } from 'src/auth/context/amplify';

// ----------------------------------------------------------------------

export function AmplifyVerifyView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { t: tauth } = useTranslate('auth-amplify');

  const email = searchParams.get('email');

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  type VerifySchemaType = zod.infer<typeof VerifySchema>;

  const VerifySchema = zod.object({
    code: zod
      .string()
      .min(1, { message: tauth('verify.form.code.required') })
      .min(6, { message: tauth('verify.form.code.min') }),
    email: zod
      .string()
      .min(1, { message: tauth('verify.form.email.min') })
      .email({ message: tauth('verify.form.email.format') }),
  });

  const defaultValues = { code: '', email: email || '' };

  const methods = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
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
      await confirmSignUp({ username: data.email, confirmationCode: data.code });
      router.push(paths.auth.amplify.signIn);
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await resendSignUpCode?.({ username: values.email });
    } catch (error) {
      console.error(error);
    }
  }, [startCountdown, values.email]);

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ mx: 'auto' }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5">{tauth('verify.body.please-check-your-email')}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {tauth('verify.body.helperText')}
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label={tauth('verify.form.email.label')}
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      />

      <Field.Code name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={tauth('verify.body.verify...')}
      >
        {tauth('verify.body.verify')}
      </LoadingButton>

      <Typography variant="body2" sx={{ mx: 'auto', display: 'flex', gap: 1 }}>
        {tauth('verify.body.don’t-have-a-code')}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && { color: 'text.disabled', pointerEvents: 'none' }),
          }}
        >
          {tauth('verify.body.resend-code')} {counting && `(${countdown}s)`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.amplify.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ gap: 0.5, alignSelf: 'center', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify width={16} icon="eva:arrow-ios-back-fill" />
        {tauth('verify.body.return-to-sign-in')}
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
