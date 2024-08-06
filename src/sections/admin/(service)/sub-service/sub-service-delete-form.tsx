import type { IServiceItem } from 'src/types/service';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Alert, Divider, Typography } from '@mui/material';

import { uuidv4 } from 'src/utils/uuidv4';

import { useTranslate } from 'src/locales';
import { deleteSubService } from 'src/actions/admin/service/sub-service';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentItem: IServiceItem;
  serviceId: string;
};

export function SubServiceDeleteForm({ currentItem, serviceId, open, onClose }: Props) {
  const { t: tsubservice } = useTranslate('sub-service');
  const { t: tcommon } = useTranslate('common');

  const [errorConfirm, setErrorConfirm] = useState<boolean>(false);

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    confirm: zod.string().min(1, { message: tsubservice('form.confirm.required') }),
  });

  const defaultValues = useMemo(
    () => ({
      confirm: '',
      name: currentItem?.name,
      photo: currentItem?.photo,
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

  const CONFIRM_CODE = `delete-${uuidv4()}`;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        setErrorConfirm(false);

        if (data?.confirm !== CONFIRM_CODE) {
          setErrorConfirm(true);
        } else {
          await deleteSubService(currentItem?.id as string, serviceId);
          toast.success(tcommon('alert.delete-success'));
        }
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error}`);
      console.error(error);
    }
  });

  const renderContent = (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{ xs: 'repeat(1, 1fr)' }}
      py={2}
    >
      <Field.Upload name="photo" disabled />

      <Box>
        <Typography color="error" mb={1.5}>
          {CONFIRM_CODE}
        </Typography>
        <Field.Text
          name="confirm"
          label={`${tsubservice('form.confirm.label')} *`}
          placeholder={CONFIRM_CODE}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </Box>
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={() => {
        onClose();
        reset();
        setErrorConfirm(false);
      }}
      PaperProps={{ sx: { maxWidth: 820 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{tsubservice(`dialog.delete`)}</DialogTitle>

        <Divider variant="middle" />

        <DialogContent>
          {errorConfirm && (
            <Alert variant="outlined" severity="error" sx={{ mb: 2, mt: 2 }}>
              {`${tsubservice('dialog.errror_match')}`}
            </Alert>
          )}

          {renderContent}
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              reset();
              setErrorConfirm(false);
            }}
          >
            {tcommon('button.cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting} color="error">
            {currentItem && tsubservice(`button.delete`)}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
