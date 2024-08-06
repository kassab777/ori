import type { IUserItem } from 'src/types/user';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ALL_USERS -----------------------------
type UsersData = {
    data: IUserItem[];
};

export function useGetUsers() {
    const url = endpoints.user.list;

    const { data, isLoading, error, isValidating } = useSWR<UsersData>(url, fetcher, swrOptions);

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

// ----------------------------- GET_SPECIFIC_USER -----------------------------
type UserData = {
    data: IUserItem;
};

export function useGetUser(id: string) {
    const url = id ? `${endpoints.user.details}/${id}` : '';

    const { data, isLoading, error, isValidating } = useSWR<UserData>(url, fetcher, swrOptions);

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

// ----------------------------- GET_USER_AUTH -----------------------------
export function useGetMeUser() {
    const url = `${endpoints.auth.me}`;

    const { data, isLoading, error, isValidating } = useSWR<any>(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            user: data?.data as IUserItem,
            userLoading: isLoading,
            userError: error,
            userValidating: isValidating,
            userPermissions: data?.permissions as string[] || [],
        }),
        [data?.data, data?.permissions, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------- CREATE_USER -----------------------------
export async function createUser(data: Partial<IUserItem>) {
    const url = `${endpoints.user.new}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);
}

// ----------------------------- UPDATE_USER -----------------------------
export async function updateUser(id: string, data: Partial<IUserItem>) {
    const url = `${endpoints.user.edit}/${id}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);
}

// ----------------------------- DELETE_USER -----------------------------
export async function deleteUser(id: string) {
    const url = `${endpoints.user.delete}/${id}`;

    await axiosInstance.delete(url);

    mutate(endpoints.user.list);
    mutate(url);
}