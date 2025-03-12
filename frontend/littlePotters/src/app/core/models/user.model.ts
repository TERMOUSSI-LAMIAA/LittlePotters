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
}

// UserRequest interface (request model)
export interface UserRequest {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    active: boolean;
    roles: string[];  // Array of role names
}