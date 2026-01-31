import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LogOut, Users, LayoutDashboard } from 'lucide-react';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold">ProjectMgr</h1>
                    <p className="text-xs text-gray-400 mt-1">Hello, {user?.name}</p>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center space-x-2 p-3 hover:bg-gray-800 rounded transition">
                        <LayoutDashboard size={20} />
                        <span>Projects</span>
                    </Link>
                    {user?.role === UserRole.ADMIN && (
                        <Link to="/admin/users" className="flex items-center space-x-2 p-3 hover:bg-gray-800 rounded transition">
                            <Users size={20} />
                            <span>User Management</span>
                        </Link>
                    )}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center space-x-2 text-red-400 hover:text-red-300 w-full">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
