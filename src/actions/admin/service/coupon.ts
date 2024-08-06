import type { ICouponItem } from 'src/types/coupon';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
};

// ----------------------------- GET_ALL_COUPONS -----------------------------
type CouponsData = {
    data: ICouponItem[];
};

export function useGetCoupons() {
    const url = endpoints.serviceGroup.coupon.list;

    const { data, isLoading, error, isValidating } = useSWR<CouponsData>(url, fetcher, swrOptions);

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

// ----------------------------- GET_SPECIFIC_COUPON -----------------------------
type CouponData = {
    data: ICouponItem;
};

export function useGetCoupon(id: string) {
    const url = id ? `${endpoints.serviceGroup.coupon.details}/${id}` : '';

    const { data, isLoading, error, isValidating } = useSWR<CouponData>(url, fetcher, swrOptions);

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

// ----------------------------- CREATE_COUPON -----------------------------
export async function createCoupon(data: Partial<ICouponItem>) {
    const url = `${endpoints.serviceGroup.coupon.new}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);

    mutate(endpoints.serviceGroup.coupon.list);
    mutate(url);
}

// ----------------------------- UPDATE_COUPON -----------------------------
export async function updateCoupon(id: string, data: Partial<ICouponItem>) {
    const url = `${endpoints.serviceGroup.coupon.edit}/${id}`;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, (data as any)[key]);
    });

    await axiosInstance.post(url, formData);

    mutate(endpoints.serviceGroup.coupon.list);
    mutate(url);
}

// ----------------------------- DELETE_COUPON -----------------------------
export async function deleteCoupon(id: string) {
    const url = `${endpoints.serviceGroup.coupon.delete}/${id}`;

    await axiosInstance.delete(url);

    mutate(endpoints.serviceGroup.coupon.list);
    mutate(url);
}