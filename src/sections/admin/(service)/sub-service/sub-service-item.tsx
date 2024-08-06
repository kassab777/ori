import type { ISubServiceItem } from 'src/types/service';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Button, Divider, Typography, IconButton } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { SubServiceDeleteForm } from './sub-service-delete-form';
import { SubServiceQuickEditForm } from './sub-service-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentItem: ISubServiceItem;
  serviceId: string;
};

export default function SubServiceItem({ currentItem, serviceId }: Props) {
  const { id, name, photo } = currentItem;

  const { t: tcommon } = useTranslate('common');
  const { t: tsubservice } = useTranslate('sub-service');

  const confirmDelete = useBoolean();
  const confirmEdit = useBoolean();

  const renderImg = (
    <Box sx={{ p: 1 }}>
      <Image
        alt={name}
        src={photo as string}
        ratio="4/3"
        sx={{
          borderRadius: 1.5,
        }}
      />
    </Box>
  );

  const renderContent = (
    <Stack sx={{ p: 2, textAlign: 'center' }}>
      <Typography color="inherit">{name}</Typography>
    </Stack>
  );

  const renderDeleteButton = (
    <Box sx={{ position: 'absolute', top: '-22px', right: '-15px', zIndex: '1000' }}>
      <IconButton
        color="error"
        sx={{ bgcolor: '#ffffff', boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
        onClick={confirmDelete.onTrue}
      >
        <Iconify icon="fluent:delete-24-filled" />
      </IconButton>
    </Box>
  );

  const renderAction = (
    <Stack sx={{ flexDirection: 'row', gap: 1.5, p: 1.5 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ flex: '0.5' }}
        disableElevation
        startIcon={<Iconify icon="mynaui:edit-one" />}
        onClick={confirmEdit.onTrue}
      >
        {tcommon('button.edit')}
      </Button>
      <Button
        variant="contained"
        component={RouterLink}
        href={`option/${id}`}
        color="info"
        sx={{ flex: '0.5' }}
        disableElevation
        startIcon={<Iconify icon="material-symbols:tv-options-edit-channels" />}
      >
        {tsubservice('button.options')}
      </Button>
    </Stack>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {renderDeleteButton}

      <Card>
        {renderImg}

        {renderContent}

        <Divider variant="middle" />

        {renderAction}
      </Card>

      <SubServiceDeleteForm
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        currentItem={currentItem}
        serviceId={serviceId}
      />
      <SubServiceQuickEditForm
        open={confirmEdit.value}
        onClose={confirmEdit.onFalse}
        currentItem={currentItem}
        serviceId={serviceId}
      />
    </Box>
  );
}
