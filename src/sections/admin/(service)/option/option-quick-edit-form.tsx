import type { ISubServiceOptionItem } from 'src/types/service';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Divider, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import {
  createSubServiceOption,
  updateSubServiceOption,
} from 'src/actions/admin/service/sub-service-option';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem?: ISubServiceOptionItem;
  subServiceId: string;
};

export function OptionQuickEditForm({ currentItem, subServiceId, open, onClose }: Props) {
  const { t: tsubserviceOption } = useTranslate('sub-service-option');
  const { t: tcommon } = useTranslate('common');

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    sub_services_id: zod.string(),
    key: zod.string().min(1, { message: tsubserviceOption('form.key.required') }),
    type: zod.string().min(1, { message: tsubserviceOption('form.type.required') }),
  });

  const defaultValues = useMemo(
    () => ({
      sub_services_id: subServiceId,
      key: currentItem?.key || '',
      type: currentItem?.type || '',
    }),
    [currentItem, subServiceId]
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
        await updateSubServiceOption(`${currentItem.id}`, data);

        reset();
        toast.success(tcommon('alert.update-success'));
        onClose();
      } else {
        await createSubServiceOption(data);

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
    <Box
      rowGap={3}
      columnGap={4}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      sx={{ alignItems: 'center', py: 2 }}
    >
      <Field.Text name="key" label={`${tsubserviceOption('form.key.label')} *`} />
      <Field.Select fullWidth name="type" label={`${tsubserviceOption('form.type.label')} *`}>
        {[
          { id: 0, label: `${tsubserviceOption('form.type_option.radio')}`, value: 'radio' },
          { id: 1, label: `${tsubserviceOption('form.type_option.number')}`, value: 'number' },
          { id: 2, label: `${tsubserviceOption('form.type_option.text')}`, value: 'text' },
          { id: 3, label: `${tsubserviceOption('form.type_option.image')}`, value: 'image' },
        ].map((option) => (
          <MenuItem key={option.id} value={option.value} sx={{ textTransform: 'capitalize' }}>
            {option.label}
          </MenuItem>
        ))}
      </Field.Select>
    </Box>
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
          {!currentItem ? tsubserviceOption(`dialog.create`) : tsubserviceOption(`dialog.update`)}
        </DialogTitle>

        <Divider variant="middle" />

        <DialogContent>{renderContent}</DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {tcommon('button.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!currentItem ? tsubserviceOption(`button.create`) : tsubserviceOption(`button.save`)}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
