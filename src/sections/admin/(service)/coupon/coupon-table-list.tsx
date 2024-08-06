'use client';

import type { GridColDef } from '@mui/x-data-grid';

import { useState, useCallback } from 'react';

import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { deleteCoupon, useGetCoupons } from 'src/actions/admin/service/coupon';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { DeleteConfirm } from './coupon-confirm';
import {
  RenderCellPrice,
  RenderCellPercent,
  RenderCellDateEnd,
  RenderCellDateStart,
  RenderCellDiscountCode,
} from './coupon-table-row';

// ----------------------------------------------------------------------

type Props = {
  currentRole: string[];
};

// ---------------------------------------------------------------------
export function TableList({ currentRole }: Props) {
  const { t: tcommon } = useTranslate('common');
  const { t: tcoupon } = useTranslate('coupon');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-coupon'));
  const ACCEPT_DELETE_ROLE = Boolean(currentRole.includes('delete-coupon'));

  const [itemDelete, setItemDelete] = useState<{ id: string; label: string } | null>(null);

  const router = useRouter();

  const confirm = useBoolean();

  const { data, dataLoading } = useGetCoupons();

  const handleDeleteRow = useCallback(
    async (id: string) => {
      if (ACCEPT_DELETE_ROLE) {
        await deleteCoupon(id as string);
        toast.success(tcommon('alert.delete-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [ACCEPT_DELETE_ROLE, tcommon]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      if (ACCEPT_UPDATE_ROLE) {
        router.push(paths.dashboard.service_group.coupon.edit(id));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [ACCEPT_UPDATE_ROLE, router, tcommon]
  );

  const columns: GridColDef[] = [
    {
      field: 'discount_code',
      headerName: tcoupon('form.discount_code.label'),
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
      flex: 1,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellDiscountCode params={params} />,
    },
    {
      field: 'type',
      headerName: tcoupon('form.type.label'),
      align: 'center',
      headerAlign: 'center',
      width: 150,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => tcoupon(`form.type_options.${params.row.type}`),
    },
    {
      field: 'start_date',
      headerName: tcoupon('form.start_date.label'),
      align: 'center',
      headerAlign: 'center',
      width: 150,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellDateStart params={params} />,
    },
    {
      field: 'end_date',
      headerName: tcoupon('form.end_date.label'),
      align: 'center',
      headerAlign: 'center',
      width: 150,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellDateEnd params={params} />,
    },
    {
      field: 'discount',
      headerName: tcoupon('form.discount.label'),
      align: 'center',
      headerAlign: 'center',
      width: 150,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellPrice value={params.row.discount} />,
    },
    {
      field: 'discount_percentage',
      headerName: tcoupon('form.discount_percentage.label'),
      align: 'center',
      headerAlign: 'center',
      width: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellPercent value={params.row.discount_percentage} />,
    },
    {
      field: 'max_usage',
      headerName: tcoupon('form.max_usage.label'),
      align: 'center',
      headerAlign: 'center',
      width: 200,
      hideable: true,
      disableColumnMenu: true,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: tcommon('button.actions'),
      align: 'center',
      headerAlign: 'center',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          label={tcommon('button.edit')}
          icon={<Iconify icon="solar:pen-bold" />}
          disabled={!ACCEPT_UPDATE_ROLE}
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          label={tcommon('button.delete')}
          sx={{ color: 'error.main' }}
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          disabled={!ACCEPT_DELETE_ROLE}
          onClick={() => {
            setItemDelete({ id: params.row.id, label: params.row.discount_code });
            confirm.onTrue();
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <DataGrid
        disableRowSelectionOnClick
        rows={data}
        columns={columns}
        loading={dataLoading}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[10, 25, 50]}
        hideFooter
        slots={{
          noRowsOverlay: () => <EmptyContent title={tcommon('no_data')} />,
          noResultsOverlay: () => <EmptyContent title={tcommon('no_results_found')} />,
        }}
        sx={{
          [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex', py: 2 },
        }}
      />

      <DeleteConfirm
        onClose={confirm.onFalse}
        open={confirm.value}
        content={itemDelete}
        handleDeleteRow={handleDeleteRow}
        setdefaultDelete={setItemDelete}
      />
    </>
  );
}
