import type { GridCellParams } from '@mui/x-data-grid';

import { Stack, Avatar, Rating, ListItemText } from '@mui/material';

import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

// ----------------------------------------------------------------------

export function RenderCellAvatar({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" py={1}>
      <Avatar
        alt={params.row.customer?.name}
        src={String(params.row.customer?.photo)}
        sx={{ mr: 2 }}
      />

      <ListItemText
        primary={params.row.customer?.name}
        secondary={params.row.customer?.email}
        primaryTypographyProps={{ typography: 'body2' }}
        secondaryTypographyProps={{
          component: 'span',
          color: 'text.disabled',
        }}
      />
    </Stack>
  );
}

export function RenderCellRate({ params }: ParamsProps) {
  return <Rating name="read-only" value={params.row?.rate} readOnly />;
}

export function RenderCellDate({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center">
      <ListItemText
        primary={fDate(params.row?.created_at)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          typography: 'caption',
        }}
      />
    </Stack>
  );
}
