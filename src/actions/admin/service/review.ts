
import type { IReviewItem } from 'src/types/review';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ALL_REPORT_REVIEW -----------------------------
type ServicesData = {
    data: IReviewItem[];
};

export function useGetReviews() {
    const url = endpoints.serviceGroup.review.list;

    const { data, isLoading, error, isValidating } = useSWR<ServicesData>(url, fetcher, swrOptions);

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