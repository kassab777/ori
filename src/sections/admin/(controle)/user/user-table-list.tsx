'use client';

import type { GridSlots, GridColDef } from '@mui/x-data-grid';

import { useState, useCallback } from 'react';

import { Box } from '@mui/material';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { deleteUser, useGetUsers } from 'src/actions/admin/controle/user';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { DeleteConfirm } from './user-confirm';
import { RenderCellRole, RenderCellAvatar, RenderCellBirthDate } from './user-table-row';

// ----------------------------------------------------------------------

type Props = {
  currentRole: string[];
};

// ----------------------------------------------------------------------

export function TableList({ currentRole }: Props) {
  const { t: tcommon } = useTranslate('common');
  const { t: tuser } = useTranslate('user');

  const acceptEditRoles = currentRole.includes('update-user');
  const acceptDeleteRoles = currentRole.includes('delete-user');

  const router = useRouter();

  const confirm = useBoolean();
  const [itemDelete, setItemDelete] = useState<{ id: string; label: string } | null>(null);

  const { data, dataLoading } = useGetUsers();

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      if (acceptDeleteRoles) {
        await deleteUser(id);
        toast.success(tcommon('delete-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [acceptDeleteRoles, tcommon]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      if (acceptEditRoles) {
        router.push(paths.dashboard.user.edit(id));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [acceptEditRoles, router, tcommon]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: tuser('form.name.label'),
      width: 300,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellAvatar params={params} />,
    },
    {
      field: 'roles_name',
      headerName: tuser('form.roles_name.label'),
      width: 200,
      hideable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <RenderCellRole params={params} />,
    },
    {
      field: 'date_of_birth',
      headerName: tuser('form.date_of_birth.label'),
      width: 200,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellBirthDate params={params} />,
    },
    {
      field: 'national_id',
      headerName: tuser('form.national_id.label'),
      width: 200,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: 'phone',
      headerName: tuser('form.phone.label'),
      flex: 1,
      minWidth: 200,
      hideable: false,
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
          onClick={() => handleEditRow(params.row.id)}
          disabled={!acceptEditRoles}
        />,
        <GridActionsCellItem
          showInMenu
          label={tcommon('button.delete')}
          sx={{ color: 'error.main' }}
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          disabled={!acceptDeleteRoles}
          onClick={() => {
            setItemDelete({ id: params.row.id, label: params.row.name });
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
