export class User {
    id: number;
    username: string;
    full_name: string;
    birth_date: string;
    email: string;
    phone: string;
    barcode: number;
    personal_id: string;
    address: string;
    country: string;
	city: string;
    avatar: string|any;
	password: string;
    new_password: string;
	role: number;
    username_mapping: string;
    date_mapping: string;
    is_active: boolean;
    is_staff: boolean;

    isChecked: boolean;
    flag_notification: boolean;
}