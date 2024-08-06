import type { IServiceItem } from 'src/types/service';

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
import { createService, updateService } from 'src/actions/admin/service/service';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem?: IServiceItem;
};

export function ServiceQuickEditForm({ currentItem, open, onClose }: Props) {
  const { t: tservice } = useTranslate('service');
  const { t: tcommon } = useTranslate('common');

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    name: zod.string().min(1, { message: tservice('form.name.required') }),
    icon: schemaHelper.file({
      message: { required_error: tservice('form.icon.required') },
    }),
    photo: schemaHelper.file({
      message: { required_error: tservice('form.photo.required') },
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      icon: currentItem?.icon || '',
      photo: currentItem?.photo || null,
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
      if (currentItem) {
        if (currentItem?.photo === data?.photo) {
          delete (data as { photo?: string | File | null }).photo;
        }

        if (currentItem?.icon === data?.icon) {
          delete (data as { icon?: string | File | null }).icon;
        }

        await updateService(`${currentItem.id}`, data);

        reset();
        toast.success(tcommon('alert.update-success'));
        onClose();
      } else {
        await createService(data);

        reset();
        toast.success(tcommon('alert.create-success'));
        onClose();
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error}`);
      console.error(error);
    }
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const renderContent = (
    <>
      <Box
        rowGap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        sx={{ alignItems: 'center', py: 2 }}
      >
        <Field.UploadAvatar
          name="icon"
          maxSize={3145728}
          accept={{
            'image/': ['.svg'],
          }}
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
              {`${tservice('form.icon.label')} *`}
              <br /> {tcommon('allowed')} *.svg
              <br /> {tcommon('max-size-of')} {fData(3145728)}
            </Typography>
          }
        />

        <Field.Upload
          name="photo"
          accept={{
            'image/*': ['.png', '.jpeg'],
          }}
        />
      </Box>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)' }}
        py={2}
      >
        <Field.Text name="name" label={`${tservice('form.name.label')} *`} />
      </Box>
    </>
  );

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
          {!currentItem ? tservice(`dialog.create`) : tservice(`dialog.update`)}
        </DialogTitle>

        <Divider variant="middle" />

        <DialogContent>{renderContent}</DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {tcommon('button.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!currentItem ? tservice(`button.create`) : tservice(`button.save`)}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
