import type { IAboutUsItem } from 'src/types/setting';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ABOUT_US -----------------------------
type AboutUsData = {
    data: IAboutUsItem;
};

export function useGetAboutUs() {
    const url = endpoints.pageGroup.aboutUs.details;

    const { data, isLoading, error, isValidating } = useSWR<AboutUsData>(url, fetcher, swrOptions);

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

// ----------------------------- UPDATE_ABOUT_US -----------------------------
export async function updateAboutUs(p0: string, data: Partial<IAboutUsItem>) {
    const url = `${endpoints.pageGroup.aboutUs.edit}`;

    await axiosInstance.post(url, data);

    mutate(endpoints.pageGroup.aboutUs.details);
    mutate(url);
}