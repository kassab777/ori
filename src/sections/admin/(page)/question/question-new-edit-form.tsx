import type { IQuestionItem } from 'src/types/setting';

import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Card, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { createQuestion, updateQuestion } from 'src/actions/admin/page/question';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: IQuestionItem;
  currentRole: string[];
};

// ----------------------------------------------------------------------
export default function NewEditForm({ currentItem, currentRole }: Props) {
  const { t: tquestion } = useTranslate('question');
  const { t: tcommon } = useTranslate('common');

  const ACCEPT_UPDATE_ROLE = Boolean(currentRole.includes('update-question'));
  const ACCEPT_CREATE_ROLE = Boolean(currentRole.includes('create-question'));

  const router = useRouter();

  type NewSchemaType = zod.infer<typeof NewSchema>;

  const NewSchema = zod.object({
    question: zod.string().min(1, { message: tquestion('form.question.required') }),
    answer: zod.string().min(1, { message: tquestion('form.answer.required') }),
  });

  const defaultValues = useMemo(
    () => ({ question: currentItem?.question || '', answer: currentItem?.answer || '' }),
    [currentItem]
  );

  const methods = useForm<NewSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(currentItem);
  }, [reset, currentItem]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem && ACCEPT_UPDATE_ROLE) {
        await updateQuestion(`${currentItem?.id}`, data);

        reset();
        router.push(paths.dashboard.setting.question.root);
        toast.success(tcommon('alert.update-success'));
      } else if (ACCEPT_CREATE_ROLE) {
        await createQuestion(data);

        reset();
        router.push(paths.dashboard.setting.question.root);
        toast.success(tcommon('alert.create-success'));
      } else {
        toast.warning(`${tcommon('alert.not-permission')}`);
      }
    } catch (error) {
      toast.error(`${tcommon('alert.update-error')} \n ${error?.message}`);
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Grid xs={12}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
              }}
            >
              <Field.Text
                type="text"
                name="question"
                label={`${tquestion('form.question.label')} *`}
              />
              <Field.Text
                type="text"
                name="answer"
                label={`${tquestion('form.answer.label')} *`}
                multiline
                rows={5}
              />
            </Box>

            {(ACCEPT_CREATE_ROLE || ACCEPT_UPDATE_ROLE) && (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentItem ? tquestion(`button.create`) : tquestion(`button.save`)}
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
