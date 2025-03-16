// Role interface
export interface Role {
    id?: number;
    name: string;
}

// User interface (response model)
export interface User {
    id: number;
    email: string;
    fullname: string;
    phone: string;
    active: boolean;
    roles: Role[];
    imageUrl?: string;
}

// UserRequest interface (request model)
export interface UserRequest {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    active: boolean;
    roles: string[];
    image?: File;// Array of role names
}