import type { ICouponItem } from 'src/types/coupon';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Card, Stack, MenuItem, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { createCoupon, updateCoupon } from 'src/actions/admin/service/coupon';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
// ----------------------------------------------------------------------

type Props = {
  currentItem?: ICouponItem;
  currentRole: string[];
};

// ----------------------------------------------------------------------
export default function NewEditForm({ currentItem, currentRole }: Props) {
  const { t: tcoupon } = useTranslate('coupon');
  const { t: tcommon } = useTranslate('common');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-coupon'));
  const ACCEPT_CREATE_ROLE = Boolean(currentRole.includes('create-coupon'));

  const router = useRouter();

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod
    .object({
      type: zod.string().min(1, { message: tcoupon('form.type.required') }),
      discount_code: zod
        .string()
        .min(1, { message: tcoupon('form.discount_code.required') })
        .min(8, { message: tcoupon('form.discount_code.min') }),
      discount: zod
        .string()
        .min(1, { message: tcoupon('form.discount.required') })
        .nullable(),
      max_usage: zod.string().min(1, { message: tcoupon('form.max_usage.required') }),
      discount_percentage: zod
        .string()
        .min(1, { message: tcoupon('form.discount_percentage.required') })
        .nullable(),
      start_date: schemaHelper.date({
        message: { required_error: tcoupon('form.start_date.required') },
      }),
      end_date: schemaHelper.date({
        message: { required_error: tcoupon('form.end_date.required') },
      }),
    })
    .transform((data) => ({
      ...data,
      discount: data?.discount_percentage !== null ? null : data?.discount,
      discount_percentage: data?.discount !== null ? null : data?.discount_percentage,
    }));

  const defaultValues = useMemo(
    () => ({
      type: currentItem?.type || '',
      discount_code: currentItem?.discount_code || '',
      discount: currentItem?.discount || null,
      max_usage: currentItem?.max_usage || '',
      discount_percentage: currentItem?.discount_percentage || null,
      start_date: currentItem?.start_date || null,
      end_date: currentItem?.end_date || null,
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
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(currentItem);
  }, [reset, currentItem]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem && ACCEPT_UPDATE_ROLE) {
        await updateCoupon(`${currentItem?.id}`, data);

        reset();
        router.push(paths.dashboard.service_group.coupon.root);
        toast.success(tcommon('alert.update-success'));
      } else if (ACCEPT_CREATE_ROLE) {
        await createCoupon(data);

        reset();
        router.push(paths.dashboard.service_group.coupon.root);
        toast.success(tcommon('alert.create-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error?.message}`);
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Grid xs={12}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text
                type="text"
                name="discount_code"
                label={`${tcoupon('form.discount_code.label')} *`}
                placeholder="XXXXXXXX"
                InputLabelProps={{ shrink: true }}
              />
              <Field.Select fullWidth name="type" label={`${tcoupon('form.type.label')} *`}>
                {[
                  {
                    id: 0,
                    label: `${tcoupon('form.type_options.percentage')}`,
                    value: 'percentage',
                  },
                  { id: 1, label: `${tcoupon('form.type_options.fixed')}`, value: 'fixed' },
                ].map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.value}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text
                type="text"
                name="max_usage"
                label={`${tcoupon('form.max_usage.label')} *`}
              />

              <Field.DatePicker name="start_date" label={`${tcoupon('form.start_date.label')} *`} />
              <Field.DatePicker name="end_date" label={`${tcoupon('form.end_date.label')} *`} />

              {values?.type === 'percentage' && (
                <Field.Text
                  type="text"
                  name="discount_percentage"
                  label={`${tcoupon('form.discount_percentage.label')} *`}
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
              )}

              {values?.type === 'fixed' && (
                <Field.Text
                  type="text"
                  name="discount"
                  label={`${tcoupon('form.discount.label')} *`}
                />
              )}
            </Box>

            {(ACCEPT_CREATE_ROLE || ACCEPT_UPDATE_ROLE) && (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentItem ? tcoupon(`button.create`) : tcoupon(`button.save`)}
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
