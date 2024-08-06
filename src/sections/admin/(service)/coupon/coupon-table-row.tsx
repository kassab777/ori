import type { GridCellParams } from '@mui/x-data-grid';

import { Box, Stack, Button, ListItemText } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fPercent, fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

// ----------------------------------------------------------------------

export function RenderCellDiscountCode({ params }: ParamsProps) {
  return (
    <Button
      variant="text"
      size="small"
      sx={{ textDecoration: 'underline', color: '#637381', my: 0.5 }}
      startIcon={<Iconify icon="solar:copy-broken" />}
    >{`${params.row?.discount_code}`}</Button>
  );
}

export function RenderCellDate({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center">
      <ListItemText
        primary={fDate(params.row?.start_date || params.row?.end_date)}
        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      />
    </Stack>
  );
}

export function RenderCellPrice({ value }: { value: string }) {
  return <Box>{value ? fCurrency(value) : '----'}</Box>;
}

export function RenderCellPercent({ value }: { value: string }) {
  return <Box>{value ? fPercent(value) : '----'}</Box>;
}
