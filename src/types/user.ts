import type { IDateValue } from "./common";

// ----------------------------------------------------------------------

export type IUserItem = {
    id?: string;
    name: string;
    password: string;
    phone: string;
    date_of_birth: IDateValue | Date;
    national_id: string;
    roles_name: string;
    photo: string | File | null;
    email: string;
}