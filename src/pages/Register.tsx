import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [isValid, setIsValid] = useState(false);
    const [checking, setChecking] = useState(true);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!token) {
            setChecking(false);
            return;
        }

        const checkToken = async () => {
            try {
                const { data } = await api.post('/auth/validate-invite', { token });
                setIsValid(data.isValid);
                setEmail(data.email);
                setRole(data.role);
            } catch (error) {
                setIsValid(false);
            } finally {
                setChecking(false);
            }
        };
        checkToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { token, name, password });
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    if (checking) return <div className="flex h-screen items-center justify-center">Checking invite...</div>;

    if (!token || !isValid) {
        return (
            <div className="flex h-screen items-center justify-center flex-col">
                <h1 className="text-2xl text-red-600 font-bold mb-4">Invalid or Expired Invite</h1>
                <p className="text-gray-600">You need a valid invitation to register.</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-2 text-center text-2xl font-bold">Complete Registration</h2>
                <p className="mb-6 text-center text-sm text-gray-500">You have been invited as <span className="font-bold">{role}</span></p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700">Email</label>
                        <input type="email" value={email} disabled className="w-full rounded border bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded bg-green-600 py-2 font-bold text-white hover:bg-green-700 transition"
                    >
                        Register Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
