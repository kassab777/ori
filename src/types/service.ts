
export type IServiceItem = {
    id?: string;
    name: string;
    icon: File | string | null;
    photo: File | string | null;
}

export type ISubServiceItem = {
    id?: string;
    name: string;
    service_id: string;
    slug: string;
    description: string;
    price: string;
    photo: File | string | null;
    icon: File | string | null;
}

export type ISubServiceOptionItem = {
    id?: string;
    sub_services_id: string;
    key: string;
    type: string;
}