import { Button } from '@mui/material';

import { useTranslate } from 'src/locales';

import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  onClose: () => void;
  open: boolean;
  content: { id: string; label: string } | null;
  handleDeleteRow: (arg: string) => void;
  setdefaultDelete: (arg: null) => void;
};

export function DeleteConfirm({
  open,
  onClose,
  content,
  handleDeleteRow,
  setdefaultDelete,
}: Props) {
  const { t: tcommon } = useTranslate('commmon');

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={tcommon('delete')}
      cancel_title={tcommon('button.cancel')}
      content={
        <>
          {tcommon('confirm.are-you-sure-want-to-delete')} <strong>{content?.label}</strong> ؟
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setdefaultDelete(null);
            handleDeleteRow(`${content?.id}`);
            onClose();
          }}
        >
          {tcommon('button.delete')}
        </Button>
      }
    />
  );
}
