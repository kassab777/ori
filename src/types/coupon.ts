import type { IDateValue } from "./common";

// ----------------------------------------------------------------------

export type ICouponItem = {
    id?: string;
    type: string;
    discount_code: string;
    discount: string;
    max_usage: string;
    discount_percentage: string;
    max_discount_value: string;
    start_date: IDateValue | Date;
    end_date: IDateValue | Date;
};