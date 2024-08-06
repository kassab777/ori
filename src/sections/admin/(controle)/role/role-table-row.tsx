import type { GridCellParams } from '@mui/x-data-grid';

import { Chip } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

// ----------------------------------------------------------------------

export function RenderCellRole({ params }: ParamsProps) {
  return (
    <Chip
      variant="outlined"
      sx={{ minWidth: '100px', my: 1 }}
      icon={<Iconify icon="oui:app-users-roles" />}
      label={params.row?.name}
    />
  );
}
