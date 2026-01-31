export const UserRole = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface User {
    id: string; // Backend sends 'id'
    _id?: string; // MongoDB original ID
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
