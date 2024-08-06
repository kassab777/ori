import type { IDateValue } from "./common";

// ----------------------------------------------------------------------

export type ICouponItem = {
    id?: string;
    type: string;
    discount_code: string;
    max_usage: string;
    discount: string | null;
    discount_percentage: string | null;
    start_date: IDateValue | Date;
    end_date: IDateValue | Date;
};