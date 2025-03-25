
export interface Role {
    id?: number;
    name: string;
}

export interface User {
    id: number;
    email: string;
    fullname: string;
    phone: string;
    active: boolean;
    roles: Role[];
    imageUrl?: string;
}

export interface UserRequest {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    active: boolean;
    roles: string[];
    image?: File | null;
    imageFileName?: string | null;
}