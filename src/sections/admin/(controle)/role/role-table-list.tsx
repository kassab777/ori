'use client';

import type { GridSlots, GridColDef } from '@mui/x-data-grid';

import { useState, useCallback } from 'react';

import { Box } from '@mui/material';
import {
  DataGrid,
  gridClasses,
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
import { deleteRole, useGetRoles } from 'src/actions/admin/controle/role';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { DeleteConfirm } from './role-confirm';
import { RenderCellRole } from './role-table-row';

// ----------------------------------------------------------------------

type Props = {
  currentRole: string[];
};

// ---------------------------------------------------------------------
export function TableList({ currentRole }: Props) {
  const { t: tcommon } = useTranslate('common');
  const { t: trole } = useTranslate('roles');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-role'));
  const ACCEPT_DELETE_ROLE = Boolean(currentRole.includes('create-role'));
  const ACCEPT_DETAILS_ROLE = Boolean(currentRole.includes('role-list'));

  const [itemDelete, setItemDelete] = useState<{ id: string; label: string } | null>(null);

  const router = useRouter();

  const confirm = useBoolean();

  const { data, dataLoading } = useGetRoles();

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      if (ACCEPT_DELETE_ROLE) {
        await deleteRole(id);
        toast.success(tcommon('alert.delete-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [ACCEPT_DELETE_ROLE, tcommon]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      if (ACCEPT_DELETE_ROLE) {
        router.push(paths.dashboard.role.edit(id));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [ACCEPT_DELETE_ROLE, router, tcommon]
  );

  const handleDetailsRow = useCallback(
    (id: string) => {
      if (ACCEPT_DETAILS_ROLE) {
        router.push(paths.dashboard.role.details(id));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [ACCEPT_DETAILS_ROLE, router, tcommon]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: trole('form.name.label'),
      flex: 1,
      minWidth: 300,
      hideable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <RenderCellRole params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: tcommon('button.actions'),
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 300,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          label={tcommon('button.edit')}
          icon={<Iconify icon="solar:pen-bold" />}
          disabled={!ACCEPT_UPDATE_ROLE || params.row.name === 'Admin'}
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          label={tcommon('button.details')}
          icon={<Iconify icon="solar:eye-bold" />}
          disabled={!ACCEPT_DETAILS_ROLE}
          onClick={() => handleDetailsRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          sx={{ color: 'error.main' }}
          label={tcommon('button.delete')}
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          disabled={!ACCEPT_DELETE_ROLE || params.row.name === 'Admin'}
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
    </GridToolbarContainer>
  );
}
