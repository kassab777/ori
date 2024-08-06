import type { ITermItem } from 'src/types/setting';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_TERM -----------------------------
type TermData = {
    data: ITermItem;
};

export function useGetTerm() {
    const url = endpoints.pageGroup.term.details;

    const { data, isLoading, error, isValidating } = useSWR<TermData>(url, fetcher, swrOptions);

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

// ----------------------------- UPDATE_TERM -----------------------------
export async function updateTerm(p0: string, data: Partial<ITermItem>) {
    const url = `${endpoints.pageGroup.term.edit}`;

    await axiosInstance.post(url, data);

    mutate(endpoints.pageGroup.term.details);
    mutate(url);
}