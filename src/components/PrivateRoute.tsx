import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface PrivateRouteProps {
    roles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
    const { user, token, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <div className="p-10 text-center text-red-500">Access Denied: You do not have permission to view this page.</div>;
    }

    return <Outlet />;
};

export default PrivateRoute;
