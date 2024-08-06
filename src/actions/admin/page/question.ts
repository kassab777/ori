import type { IQuestionItem } from 'src/types/setting';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
};


// ----------------------------- GET_ALL_COMMON_QUESTIONS -----------------------------
type QuestionsData = {
    data: IQuestionItem[]
};

export function useGetQuestions() {
    const url = endpoints.pageGroup.question.list;

    const { data, isLoading, error, isValidating } = useSWR<QuestionsData>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            data: data?.data || [],
            dataLoading: isLoading,
            dataError: error,
            dataValidating: isValidating,
            dataEmpty: !isLoading && !data?.data.length,
        }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------- GET_SPECIFIC_COMMON_QUESTION -----------------------------
type QuestionData = {
    data: IQuestionItem;
};

export function useGetQuestion(id: string) {
    const url = id ? `${endpoints.pageGroup.question.details}/${id}` : '';

    const { data, isLoading, error, isValidating } = useSWR<QuestionData>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            data: data?.data,
            dataLoading: isLoading,
            dataError: error,
            dataValidating: isValidating,
        }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------- CREATE_COMMON_QUESTION -----------------------------
export async function createQuestion(data: Partial<IQuestionItem>) {
    const url = `${endpoints.pageGroup.question.new}`;

    await axiosInstance.post(url, data);
}

// ----------------------------- UPDATE_COMMON_QUESTION -----------------------------
export async function updateQuestion(id: string, data: Partial<IQuestionItem>) {
    const url = `${endpoints.pageGroup.question.edit}/${id}`;

    await axiosInstance.post(url, data);
}

// ----------------------------- DELETE_COMMON_QUESTION -----------------------------
export async function deleteQuestion(id: string) {
    const url = `${endpoints.pageGroup.question.delete}/${id}`;

    await axiosInstance.delete(url);

    mutate(endpoints.pageGroup.question.list);
    mutate(url);
}