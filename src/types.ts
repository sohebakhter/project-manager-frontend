export enum UserRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface User {
    _id: string; // MongoDB ID is string in JSON
    id?: string; // Sometimes mapped
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    creator?: User;
}
