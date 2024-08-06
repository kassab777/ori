import type { ISubServiceItem } from 'src/types/service';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { createSubService, updateSubService } from 'src/actions/admin/service/sub-service';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem?: ISubServiceItem;
  serviceId: string;
};

export function SubServiceQuickEditForm({ currentItem, serviceId, open, onClose }: Props) {
  const { t: tsubservice } = useTranslate('sub-service');
  const { t: tcommon } = useTranslate('common');

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod
    .object({
      service_id: zod.any().default(serviceId),
      slug: zod.string(),
      name: zod.string().min(1, { message: tsubservice('form.name.required') }),
      description: zod.string().min(1, { message: tsubservice('form.description.required') }),
      price: zod.string().min(1, { message: tsubservice('form.price.required') }),
      icon: schemaHelper.file({
        message: { required_error: tsubservice('form.icon.required') },
      }),
      photo: schemaHelper.file({
        message: { required_error: tsubservice('form.photo.required') },
      }),
    })
    .transform((data) => ({
      ...data,
      slug: data.name.split(' ').join('-'),
      service_id: serviceId,
    }));

  const defaultValues = useMemo(
    () => ({
      service_id: currentItem?.service_id || serviceId,
      slug: currentItem?.slug || '',
      description: currentItem?.description || '',
      name: currentItem?.name || '',
      price: currentItem?.price || '',
      icon: currentItem?.icon || null,
      photo: currentItem?.photo || null,
    }),
    [currentItem, serviceId]
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
      if (currentItem) {
        if (currentItem?.photo === data?.photo) {
          delete (data as { photo?: string | File | null }).photo;
        }

        if (currentItem?.icon === data?.icon) {
          delete (data as { icon?: string | File | null }).icon;
        }

        await updateSubService(`${currentItem.id}`, serviceId, data);

        reset();
        toast.success(tcommon('alert.update-success'));
        onClose();
      } else {
        await createSubService(serviceId, data);

        reset();
        toast.success(tcommon('alert.create-success'));
        onClose();
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error}`);
      console.error(error);
    }
  });

  const renderUploadPhoto = (
    <Box
      rowGap={3}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      sx={{ alignItems: 'center', py: 2 }}
    >
      <Field.UploadAvatar
        name="icon"
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
            {`${tsubservice('form.icon.label')} *`}
            <br /> {tcommon('allowed')} *.jpeg
            <br /> {tcommon('max-size-of')} {fData(3145728)}
          </Typography>
        }
      />

      <Field.Upload name="photo" />
    </Box>
  );

  const renderContent = (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)' }}
      py={2}
    >
      <Field.Text name="name" label={`${tsubservice('form.name.label')} *`} />
      <Field.Text name="price" label={`${tsubservice('form.price.label')} *`} />
      <Field.Text
        name="description"
        label={`${tsubservice('form.description.label')} *`}
        multiline
        rows={4}
      />
    </Box>
  );

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { maxWidth: 820 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {!currentItem ? tsubservice(`dialog.create`) : tsubservice(`dialog.update`)}
        </DialogTitle>

        <Divider variant="middle" />

        <DialogContent>
          {renderUploadPhoto}

          {renderContent}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {tcommon('button.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!currentItem ? tsubservice(`button.create`) : tsubservice(`button.save`)}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
