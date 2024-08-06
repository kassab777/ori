import type { IMainSettingItem } from 'src/types/setting';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_SETTING -----------------------------
type SettingData = {
    data: IMainSettingItem;
};

export function useGetSetting() {
    const url = endpoints.setting.details;

    const { data, isLoading, error, isValidating } = useSWR<IMainSettingItem>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            data,
            dataLoading: isLoading,
            dataError: error,
            dataValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------- UPDATE_SETTING -----------------------------
export async function updateSetting(data: Partial<IMainSettingItem>) {
    const url = `${endpoints.setting.edit}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);

    mutate(endpoints.setting.details);
    mutate(url);
}