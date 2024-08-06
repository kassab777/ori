import type { IRoleItem } from 'src/types/role';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ALL_ROLES -----------------------------
type RolesData = {
    data: IRoleItem[];
};

export function useGetRoles() {
    const url = endpoints.role.list;

    const { data, isLoading, error, isValidating } = useSWR<RolesData>(url, fetcher, swrOptions);

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

// ----------------------------- GET_SPECIFIC_ROLE -----------------------------
type RoleData = {
    data: IRoleItem;
};

export function useGetRole(id: string) {
    const url = id ? `${endpoints.role.details}/${id}` : '';

    const { data, isLoading, error, isValidating } = useSWR<IRoleItem>(url, fetcher, swrOptions);

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

// ----------------------------- CREATE_ROLE -----------------------------
export async function createRole(data: Partial<IRoleItem>) {
    const url = `${endpoints.role.new}`;

    await axiosInstance.post(url, data);
}

// ----------------------------- UPDATE_ROLE -----------------------------
export async function updateRole(id: string, data: Partial<IRoleItem>) {
    const url = `${endpoints.role.edit}/${id}`;

    await axiosInstance.post(url, data);
}

// ----------------------------- DELETE_ROLE -----------------------------
export async function deleteRole(id: string) {
    const url = `${endpoints.role.delete}/${id}`;

    await axiosInstance.delete(url);

    mutate(endpoints.role.list);
    mutate(url);
}