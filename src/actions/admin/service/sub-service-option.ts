import type { ISubServiceOptionItem } from 'src/types/service';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ALL_SUB_SERVICE_OPTIONS -----------------------------
type SubServiceOptionsData = {
    data: ISubServiceOptionItem[];
};

export function useGetSubServiceOption(id: string) {
    const url = `${endpoints.serviceGroup.subServiceOption.list}/${id}`;

    const { data, isLoading, error, isValidating } = useSWR<SubServiceOptionsData>(url, fetcher, swrOptions);

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

// ----------------------------- CREATE_SUB_SERVICE_OPTIONS -----------------------------
export async function createSubServiceOption(data: Partial<ISubServiceOptionItem>) {
    const url = `${endpoints.serviceGroup.subServiceOption.new}`;

    await axiosInstance.post(url, data);

    mutate(`${endpoints.serviceGroup.subServiceOption.list}/${data?.sub_services_id}`);
    mutate(url);
}

// ----------------------------- UPDATE_SUB_SERVICE_OPTIONS -----------------------------
export async function updateSubServiceOption(id: string, data: Partial<ISubServiceOptionItem[]>) {
    const url = `${endpoints.serviceGroup.subServiceOption.edit}/${id}`;

    await axiosInstance.post(url, data);

    mutate(`${endpoints.serviceGroup.subServiceOption.list}/${id}`);
    mutate(url);
}

// ----------------------------- DELETE_SUB_SERVICE_OPTIONS -----------------------------
export async function deleteSubServiceOption(id: string, serviceId: string) {
    const url = `${endpoints.serviceGroup.subServiceOption.delete}/${id}`;

    await axiosInstance.delete(url);

    mutate(`${endpoints.serviceGroup.service.subService}/${serviceId}`);
    mutate(url);
}
