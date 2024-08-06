'use client';

import type { GridColDef } from '@mui/x-data-grid';

import { useState, useCallback } from 'react';

import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { deleteQuestion, useGetQuestions } from 'src/actions/admin/page/question';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { DeleteConfirm } from './question-confirm';

// ----------------------------------------------------------------------

type Props = {
  currentRole: string[];
};

// ---------------------------------------------------------------------
export function TableList({ currentRole }: Props) {
  const { t: tcommon } = useTranslate('common');
  const { t: tquestion } = useTranslate('question');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-question'));
  const ACCEPT_DELETE_ROLE = Boolean(currentRole.includes('delete-question'));

  const [itemDelete, setItemDelete] = useState<{ id: string; label: string } | null>(null);

  const router = useRouter();

  const confirm = useBoolean();

  const { data, dataLoading } = useGetQuestions();

  const handleDeleteRow = useCallback(
    async (id: string) => {
      if (ACCEPT_DELETE_ROLE) {
        await deleteQuestion(id as string);
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
        router.push(paths.dashboard.page.question.edit(id));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    },
    [ACCEPT_UPDATE_ROLE, router, tcommon]
  );

  const columns: GridColDef[] = [
    {
      field: 'question',
      headerName: tquestion('form.question.label'),
      width: 500,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: 'answer',
      headerName: tquestion('form.answer.label'),
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
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          label={tcommon('button.delete')}
          sx={{ color: 'error.main' }}
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          disabled={!ACCEPT_DELETE_ROLE}
          onClick={() => {
            setItemDelete({ id: params.row.id, label: params.row.question });
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
