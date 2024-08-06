import type { ICouponItem } from 'src/types/coupon';

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
import { createCoupon, updateCoupon } from 'src/actions/admin/service/coupon';

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

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-question'));
  const ACCEPT_CREATE_ROLE = Boolean(currentRole.includes('create-question'));

  const router = useRouter();

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    type: zod.string().min(1, { message: tcoupon('form.type.required') }),
    discount_code: zod
      .string()
      .min(1, { message: tcoupon('form.discount_code.required') })
      .min(8, { message: tcoupon('form.discount_code.min') }),
    discount: zod.string().min(1, { message: tcoupon('form.discount.required') }),
    max_usage: zod.string().min(1, { message: tcoupon('form.max_usage.required') }),
    discount_percentage: zod
      .string()
      .min(1, { message: tcoupon('form.discount_percentage.required') }),
    max_discount_value: zod
      .string()
      .min(1, { message: tcoupon('form.max_discount_value.required') }),
    start_date: schemaHelper.date({
      message: { required_error: tcoupon('form.start_date.required') },
    }),
    end_date: schemaHelper.date({
      message: { required_error: tcoupon('form.end_date.required') },
    }),
  });

  const defaultValues = useMemo(
    () => ({
      type: currentItem?.type || '',
      discount_code: currentItem?.discount_code || '',
      discount: currentItem?.discount || '',
      max_usage: currentItem?.max_usage || '',
      discount_percentage: currentItem?.discount_percentage || '',
      max_discount_value: currentItem?.max_discount_value || '',
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
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(currentItem);
  }, [reset, currentItem]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem && ACCEPT_UPDATE_ROLE) {
        await updateCoupon(`${currentItem?.id}`, data);

        reset();
        router.push(paths.dashboard.setting.question.root);
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
              }}
            >
              <Field.Text
                type="text"
                name="question"
                label={`${tcoupon('form.question.label')} *`}
              />
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
