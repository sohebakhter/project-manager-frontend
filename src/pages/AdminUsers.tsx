import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../types';
import { UserRole, UserStatus } from '../types';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showInvite, setShowInvite] = useState(false);

    // Invite Form
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.STAFF);
    const [generatedLink, setGeneratedLink] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/invite', { email: inviteEmail, role: inviteRole });
            setGeneratedLink(`${window.location.origin}${data.inviteLink}`); // Construct full URL
            toast.success('Invite created!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create invite');
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.patch(`/users/${userId}/role`, { role: newRole });
            toast.success('Role updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed update role');
        }
    };

    const handleStatusChange = async (userId: string, currentStatus: UserStatus) => {
        const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
        if (!confirm(`Are you sure you want to set this user to ${newStatus}?`)) return;

        try {
            await api.patch(`/users/${userId}/status`, { status: newStatus });
            toast.success('Status updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed update status');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <button
                    onClick={() => { setShowInvite(true); setGeneratedLink(''); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-indigo-700"
                >
                    <Mail size={18} /> <span>Invite User</span>
                </button>
            </div>

            {showInvite && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Invite New User</h2>

                        {!generatedLink ? (
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Role</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={inviteRole}
                                        onChange={e => setInviteRole(e.target.value as UserRole)}
                                    >
                                        {Object.values(UserRole).map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button type="button" onClick={() => setShowInvite(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Generate Invite</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 text-center">
                                    <p className="font-bold">Invite Token Generated!</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Send this link to the user:</label>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            value={generatedLink}
                                            className="w-full border rounded px-3 py-2 bg-gray-50 text-sm"
                                        />
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(generatedLink); toast.success('Copied!'); }}
                                            className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={() => setShowInvite(false)} className="px-4 py-2 bg-indigo-600 text-white rounded">Done</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(u => (
                            <tr key={u._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center font-bold text-gray-600 mr-3">
                                            {u.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                            <div className="text-sm text-gray-500">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={u.role}
                                        onChange={(e) => u._id && handleRoleChange(u._id, e.target.value)}
                                        className="text-sm border-gray-300 border rounded py-1 px-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {Object.values(UserRole).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => u._id && handleStatusChange(u._id, u.status)}
                                        className={`flex items-center space-x-1 ${u.status === UserStatus.ACTIVE ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                            }`}
                                    >
                                        {u.status === UserStatus.ACTIVE ? (
                                            <><XCircle size={16} /> <span>Deactivate</span></>
                                        ) : (
                                            <><CheckCircle size={16} /> <span>Activate</span></>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
