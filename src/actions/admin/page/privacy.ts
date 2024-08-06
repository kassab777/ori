import type { IPrivacyItem } from 'src/types/setting';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};


// ----------------------------- GET_PRIVACY -----------------------------
type PrivacyData = {
    data: IPrivacyItem;
};

export function useGetPrivacy() {
    const url = endpoints.pageGroup.privacy.details;

    const { data, isLoading, error, isValidating } = useSWR<PrivacyData>(url, fetcher, swrOptions);

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

// ----------------------------- UPDATE_PRIVACY -----------------------------
export async function updatePrivacy(p0: string, data: Partial<IPrivacyItem>) {
    const url = `${endpoints.pageGroup.privacy.edit}`;

    await axiosInstance.post(url, data);

    mutate(endpoints.pageGroup.privacy.details);
    mutate(url);
}