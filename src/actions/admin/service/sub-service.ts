import type { ISubServiceItem } from 'src/types/service';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ALL_SUB_SERVICES -----------------------------
type SubServicesData = {
    data: ISubServiceItem[];
};

export function useGetSubServices(id: string) {
    const url = `${endpoints.serviceGroup.service.subService}/${id}`;

    const { data, isLoading, error, isValidating } = useSWR<SubServicesData>(url, fetcher, swrOptions);

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

// ----------------------------- GET_SPECIFIC_SUB_SERVICE -----------------------------
type SubServiceData = {
    data: ISubServiceItem;
};

export function useGetSubService(id: string) {
    const url = id ? `${endpoints.serviceGroup.subService.details}/${id}` : '';

    const { data, isLoading, error, isValidating } = useSWR<SubServiceData>(url, fetcher, swrOptions);

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

// ----------------------------- CREATE_SUB_SERVICE -----------------------------
export async function createSubService(serviceId: string, data: Partial<ISubServiceItem>) {
    const url = `${endpoints.serviceGroup.subService.new}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);

    mutate(`${endpoints.serviceGroup.service.subService}/${serviceId}`);
    mutate(url);
}

// ----------------------------- UPDATE_SUB_SERVICE -----------------------------
export async function updateSubService(id: string, serviceId: string, data: Partial<ISubServiceItem>) {
    const url = `${endpoints.serviceGroup.subService.edit}/${id}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);

    mutate(`${endpoints.serviceGroup.service.subService}/${serviceId}`);
    mutate(url);
}

// ----------------------------- DELETE_SUB_SERVICE -----------------------------
export async function deleteSubService(id: string, serviceId: string) {
    const url = `${endpoints.serviceGroup.subService.delete}/${id}`;

    await axiosInstance.delete(url);

    mutate(`${endpoints.serviceGroup.service.subService}/${serviceId}`);
    mutate(url);
}
