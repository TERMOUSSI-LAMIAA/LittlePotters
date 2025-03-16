export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    id: number;
    login: string;
    roles: string[];
    token: string;
}

export interface RegisterRequest {
    email: string;      
    password: string;       
    fullname: string;       
    phone: string; 
    active: boolean;    
    roles: string[];        
}

export interface RegisterResponse {
    id: number;
    email: string;
    fullname: string;
    phone: string;
    active: boolean;
    roles: RoleResponse[];

}
export interface RoleResponse {
    name: string;                
}