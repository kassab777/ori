'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function SplitVerifyView() {
  const { t: tauth } = useTranslate('auth-demo');

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

  const defaultValues = { code: '', email: '' };

  const methods = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
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

      <Typography variant="body2" sx={{ mx: 'auto' }}>
        {tauth('verify.body.don’t-have-a-code')}
        <Link variant="subtitle2" sx={{ cursor: 'pointer' }}>
          {tauth('verify.body.resend-code')}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.authDemo.split.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ mx: 'auto', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
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
