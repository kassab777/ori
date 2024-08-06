import type { IPrivacyItem } from 'src/types/setting';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Grid, Card, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';
import { updatePrivacy } from 'src/actions/admin/page/privacy';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: IPrivacyItem;
  currentRole: string[];
};

// ----------------------------------------------------------------------
export default function NewEditForm({ currentItem, currentRole }: Props) {
  const { t: tprivacy } = useTranslate('privacy');
  const { t: tcommon } = useTranslate('common');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-privacy'));

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    description: schemaHelper.editor({
      message: { required_error: tprivacy(`form.description.required`) },
    }),
  });

  const defaultValues = useMemo(
    () => ({ description: currentItem?.description || '' }),
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
        await updatePrivacy(`${currentItem?.id}`, data);

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

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Grid xs={12}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Field.Editor
              name="description"
              placeholder={tprivacy(`form.description.placeholder`)}
              sx={{ minHeight: 480, maxHeight: 500 }}
            />

            {ACCEPT_UPDATE_ROLE && (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {tprivacy(`button.save`)}
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
