
export type IMainSettingItem = {
    site_logo_single: File | string | null;
    site_logo_full: File | string | null;
    site_logo_dark: File | string | null;
    site_name_ar: string;
    site_name_en: string;
    info_email: string;
    mobile: string;
    tax_added_value: string;
    tiktok: string;
    instagram: string;
    snapchat: string;
    twitter: string;
    siteMaintenanceMsg: string;
    maintenance_mode: string;
}

export type IPrivacyItem = {
    id?: string;
    description: string;
}

export type IAboutUsItem = {
    id?: string;
    description: string;
}

export type ITermItem = {
    id?: string;
    description: string;
}

export type IQuestionItem = {
    id?: string;
    question: string;
    answer: string;
}