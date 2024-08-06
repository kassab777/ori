import type { GridCellParams } from '@mui/x-data-grid';

import { Chip, Stack, Avatar, ListItemText } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

// ----------------------------------------------------------------------

export function RenderCellAvatar({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" py={1}>
      <Avatar alt={params.row?.name} src={String(params.row?.photo)} sx={{ mr: 2 }} />

      <ListItemText
        primary={params.row?.name}
        secondary={params.row?.email}
        primaryTypographyProps={{ typography: 'body2' }}
        secondaryTypographyProps={{
          component: 'span',
          color: 'text.disabled',
        }}
      />
    </Stack>
  );
}

export function RenderCellBirthDate({ params }: ParamsProps) {
  return <>{params.row?.date_of_birth === 'null' ? '' : fDate(params.row?.date_of_birth)}</>;
}

export function RenderCellRole({ params }: ParamsProps) {
  return (
    <Chip
      variant="outlined"
      sx={{ minWidth: '100px' }}
      icon={<Iconify icon="oui:app-users-roles" />}
      label={params.row?.roles_name}
    />
  );
}
