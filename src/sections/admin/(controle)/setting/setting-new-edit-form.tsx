import type { IMainSettingItem } from 'src/types/setting';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Card, Stack, Typography, InputAdornment } from '@mui/material';

import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { updateSetting } from 'src/actions/admin/controle/setting';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: IMainSettingItem;
  currentRole: string[];
};

// ----------------------------------------------------------------------
export default function NewEditForm({ currentItem, currentRole }: Props) {
  const { t: tsetting } = useTranslate('setting');
  const { t: tcommon } = useTranslate('common');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-setting'));

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    site_logo_single: schemaHelper.file({
      message: { required_error: tsetting('form.site_logo_single.required') },
    }),
    site_logo_full: schemaHelper.file({
      message: { required_error: tsetting('form.site_logo_full.required') },
    }),
    site_logo_dark: schemaHelper.file({
      message: { required_error: tsetting('form.site_logo_dark.required') },
    }),

    //
    site_name_ar: zod.string().min(1, { message: tsetting('form.site_name_ar.required') }),
    site_name_en: zod.string().min(1, { message: tsetting('form.site_name_en.required') }),
    info_email: zod
      .string()
      .min(1, { message: tsetting('form.info_email.required') })
      .email({ message: tsetting('form.info_email.format') }),
    mobile: schemaHelper.phoneNumber({
      isValidPhoneNumber,
      message: { required_error: tsetting('form.mobile.required') },
    }),
    tax_added_value: zod.string().min(1, { message: tsetting('form.tax_added_value.required') }),

    //
    tiktok: zod
      .string()
      .url({ message: tsetting('form.tiktok.format') })
      .optional(),
    instagram: zod
      .string()
      .url({ message: tsetting('form.tiktok.format') })
      .optional(),
    snapchat: zod
      .string()
      .url({ message: tsetting('form.tiktok.format') })
      .optional(),
    twitter: zod
      .string()
      .url({ message: tsetting('form.tiktok.format') })
      .optional(),

    //
    maintenance_mode: zod
      .string()
      .min(1, { message: tsetting('form.maintenance_mode.required') })
      .optional(),
    siteMaintenanceMsg: zod.string(),
  });

  const defaultValues = useMemo(
    () => ({
      site_logo_single: currentItem?.site_logo_single || null,
      site_logo_full: currentItem?.site_logo_full || null,
      site_logo_dark: currentItem?.site_logo_dark || null,
      site_name_ar: currentItem?.site_name_ar || '',
      site_name_en: currentItem?.site_name_en || '',
      info_email: currentItem?.info_email || '',
      mobile: currentItem?.mobile || '',
      tax_added_value: currentItem?.tax_added_value || '',
      tiktok: currentItem?.tiktok || '',
      instagram: currentItem?.instagram || '',
      snapchat: currentItem?.snapchat || '',
      twitter: currentItem?.twitter || '',
      siteMaintenanceMsg: currentItem?.siteMaintenanceMsg || '',
      maintenance_mode: currentItem?.maintenance_mode || '',
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
      if (ACCEPT_UPDATE_ROLE) {
        if (currentItem?.site_logo_single === data?.site_logo_single) {
          delete (data as { site_logo_single?: string | File | null }).site_logo_single;
        }
        if (currentItem?.site_logo_full === data?.site_logo_full) {
          delete (data as { site_logo_full?: string | File | null }).site_logo_full;
        }
        if (currentItem?.site_logo_dark === data?.site_logo_dark) {
          delete (data as { site_logo_dark?: string | File | null }).site_logo_dark;
        }
        await updateSetting(data);

        reset();
        toast.success(tcommon('alert.update-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error?.message}`);
      console.error(error);
    }
  });

  const renderLogoSection = (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      <Card
        sx={{
          pt: 5,
          pb: 5,
          px: 3,
          display: { xs: 'block', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Field.UploadAvatar
          name="site_logo_single"
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
              {`${tsetting('form.site_logo_single.label')} *`}
              <br /> {tcommon('allowed')} *.jpeg, *.jpg, *.png, *.gif
              <br /> {tcommon('max-size-of')} {fData(3145728)}
            </Typography>
          }
        />
      </Card>

      <Card
        sx={{
          pt: 5,
          pb: 5,
          px: 3,
          display: { xs: 'block', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Field.UploadAvatar
          name="site_logo_full"
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
              {`${tsetting('form.site_logo_full.label')} *`}
              <br /> {tcommon('allowed')} *.jpeg, *.jpg, *.png, *.gif
              <br /> {tcommon('max-size-of')} {fData(3145728)}
            </Typography>
          }
        />
      </Card>

      <Card sx={{ pt: 5, pb: 5, px: 3 }}>
        <Field.Upload
          name="site_logo_dark"
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
              {`${tsetting('form.site_logo_dark.label')} *`}
              <br /> {tcommon('allowed')} *.jpeg, *.jpg, *.png, *.gif
              <br /> {tcommon('max-size-of')} {fData(3145728)}
            </Typography>
          }
        />
      </Card>
    </Box>
  );
  const renderMainSection = (
    <Card
      sx={{
        pt: 5,
        pb: 5,
        px: 3,
      }}
    >
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Field.Text
          type="text"
          name="site_name_ar"
          label={`${tsetting('form.site_name_ar.label')} *`}
        />
        <Field.Text
          type="text"
          name="site_name_en"
          label={`${tsetting('form.site_name_en.label')} *`}
        />
        <Field.Text
          type="email"
          name="info_email"
          label={`${tsetting('form.info_email.label')} *`}
        />
        <Field.Phone
          type="text"
          name="mobile"
          label={`${tsetting('form.mobile.label')} *`}
          placeholder={tsetting('form.mobile.placeholder')}
        />
        <Field.Text
          type="text"
          name="tax_added_value"
          label={`${tsetting('form.tax_added_value.label')} *`}
          placeholder="00.00"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Iconify icon="ri:percent-fill" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Card>
  );
  const renderSocialSection = (
    <Card
      sx={{
        pt: 5,
        pb: 5,
        px: 3,
      }}
    >
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Field.Text type="url" name="tiktok" label={`${tsetting('form.tiktok.label')}`} />
        <Field.Text type="url" name="instagram" label={`${tsetting('form.instagram.label')}`} />
        <Field.Text type="url" name="snapchat" label={`${tsetting('form.snapchat.label')}`} />
        <Field.Text type="url" name="twitter" label={`${tsetting('form.twitter.label')}`} />
      </Box>
    </Card>
  );
  const renderMaintenanceSection = (
    <Card
      sx={{
        pt: 5,
        pb: 5,
        px: 3,
      }}
    >
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        <Field.RadioGroup
          name="maintenance_mode"
          label={`${tsetting('form.maintenance_mode.label')} *`}
          options={[
            { label: tsetting('form.choose_option_maintenance.0'), value: '0' },
            { label: tsetting('form.choose_option_maintenance.1'), value: '1' },
          ]}
        />
        <Field.Text
          type="text"
          name="siteMaintenanceMsg"
          label={tsetting('form.siteMaintenanceMsg.label')}
          multiline
          rows={4}
        />
      </Box>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Grid xs={12} mb={3}>
          {renderLogoSection}
        </Grid>

        <Grid xs={12} mb={3}>
          {renderMainSection}
        </Grid>

        <Grid xs={12} mb={3}>
          {renderSocialSection}
        </Grid>

        <Grid xs={12} mb={3}>
          {renderMaintenanceSection}
        </Grid>

        {ACCEPT_UPDATE_ROLE && (
          <Grid xs={12}>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {tsetting(`button.save`)}
              </LoadingButton>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Form>
  );
}
