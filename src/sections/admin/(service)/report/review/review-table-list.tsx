'use client';

import type { GridSlots, GridColDef } from '@mui/x-data-grid';

import { useState } from 'react';

import { Box } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { useTranslate } from 'src/locales';
import { useGetReviews } from 'src/actions/admin/service/review';

import { EmptyContent } from 'src/components/empty-content';

import { RenderCellRate, RenderCellDate, RenderCellAvatar } from './review-table-row';

// ----------------------------------------------------------------------

export function ReportReviewList() {
  const { t: tcommon } = useTranslate('common');
  const { t: treview } = useTranslate('review');

  const { data, dataLoading } = useGetReviews();

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: treview('table.customer.label'),
      width: 300,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellAvatar params={params} />,
    },
    {
      field: 'rating',
      headerName: treview('table.rating.label'),
      width: 250,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellRate params={params} />,
    },
    {
      field: 'descriptions',
      headerName: treview('table.descriptions.label'),
      flex: 1,
      minWidth: 200,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: 'created_at',
      headerName: treview('table.created_at.label'),
      width: 200,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellDate params={params} />,
    },
  ];

  return (
    <DataGrid
      disableRowSelectionOnClick
      rows={data}
      columns={columns}
      loading={dataLoading}
      getRowHeight={() => 'auto'}
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 25 },
        },
      }}
      slots={{
        toolbar: CustomToolbar as GridSlots['toolbar'],
        noRowsOverlay: () => <EmptyContent title={tcommon('no_data')} />,
        noResultsOverlay: () => <EmptyContent title={tcommon('no_results_found')} />,
      }}
      slotProps={{
        panel: { anchorEl: filterButtonEl },
        toolbar: { setFilterButtonEl, showQuickFilter: true },
      }}
      sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
    />
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({ setFilterButtonEl }: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
