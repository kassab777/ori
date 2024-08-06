'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { ISubServiceOptionItem } from 'src/types/service';

import { useState, useCallback } from 'react';

import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import {
  deleteSubServiceOption,
  useGetSubServiceOption,
} from 'src/actions/admin/service/sub-service-option';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { DeleteConfirm } from './option-confirm';
import { OptionQuickEditForm } from './option-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  currentRole: string[];
  subServiceId: string;
};

// ---------------------------------------------------------------------
export function TableList({ currentRole, subServiceId }: Props) {
  const { t: tcommon } = useTranslate('common');
  const { t: tsubserviceOption } = useTranslate('sub-service-option');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-question'));
  const ACCEPT_DELETE_ROLE = Boolean(currentRole.includes('delete-question'));

  const [itemEdit, setItemEdit] = useState<ISubServiceOptionItem | undefined>(undefined);
  const [itemDelete, setItemDelete] = useState<{ id: string; label: string } | null>(null);

  const confirmEdit = useBoolean();
  const confirm = useBoolean();

  const { data, dataLoading } = useGetSubServiceOption(subServiceId);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      if (ACCEPT_DELETE_ROLE) {
        await deleteSubServiceOption(id as string, subServiceId);
        toast.success(tcommon('alert.delete-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [ACCEPT_DELETE_ROLE, subServiceId, tcommon]
  );

  const columns: GridColDef[] = [
    {
      field: 'key',
      headerName: tsubserviceOption('form.key.label'),
      flex: 1,
      minWidth: 300,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: 'type',
      headerName: tsubserviceOption('form.type.label'),
      flex: 1,
      minWidth: 300,
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
          disabled={!ACCEPT_UPDATE_ROLE}
          onClick={() => setItemEdit(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          label={tcommon('button.delete')}
          sx={{ color: 'error.main' }}
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          disabled={!ACCEPT_DELETE_ROLE}
          onClick={() => {
            setItemDelete({ id: params.row.id, label: params.row.key });
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

      <OptionQuickEditForm
        open={confirmEdit.value}
        onClose={confirmEdit.onFalse}
        subServiceId={subServiceId}
        currentItem={itemEdit}
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
