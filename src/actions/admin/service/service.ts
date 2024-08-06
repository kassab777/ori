import type { IServiceItem } from 'src/types/service';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ALL_SERVICES -----------------------------
type ServicesData = {
    data: IServiceItem[];
};

export function useGetServices() {
    const url = endpoints.serviceGroup.service.list;

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

// ----------------------------- GET_SPECIFIC_SERVICE -----------------------------
type ServiceData = {
    data: IServiceItem;
};

export function useGetService(id: string) {
    const url = id ? `${endpoints.serviceGroup.service.details}/${id}` : '';

    const { data, isLoading, error, isValidating } = useSWR<ServiceData>(url, fetcher, swrOptions);

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

// ----------------------------- CREATE_SERVICE -----------------------------
export async function createService(data: Partial<IServiceItem>) {
    const url = `${endpoints.serviceGroup.service.new}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);

    mutate(endpoints.serviceGroup.service.list);
    mutate(url);
}

// ----------------------------- UPDATE_SERVICE -----------------------------
export async function updateService(id: string, data: Partial<IServiceItem>) {
    const url = `${endpoints.serviceGroup.service.edit}/${id}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);

    mutate(endpoints.serviceGroup.service.list);
    mutate(url);
}

// ----------------------------- DELETE_SERVICE -----------------------------
export async function deleteService(id: string) {
    const url = `${endpoints.serviceGroup.service.delete}/${id}`;

    await axiosInstance.delete(url);

    mutate(endpoints.serviceGroup.service.list);
    mutate(url);
}