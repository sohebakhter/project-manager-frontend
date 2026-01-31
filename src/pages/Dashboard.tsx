import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Project, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    // Form inputs
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data);
        } catch (error) {
            toast.error('Failed to load projects');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projects', { name, description });
            toast.success('Project created');
            setShowCreate(false);
            setName('');
            setDescription('');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to create project');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success('Project deleted');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    const startEdit = (p: Project) => {
        setIsEditing(p._id);
        setName(p.name);
        setDescription(p.description);
        setShowCreate(true); // Reuse form logic roughly or separated
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing) return;
        try {
            await api.patch(`/projects/${isEditing}`, { name, description });
            toast.success('Project updated');
            setIsEditing(null);
            setShowCreate(false);
            setName('');
            setDescription('');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to update project');
        }
    }

    const cancelForm = () => {
        setShowCreate(false);
        setIsEditing(null);
        setName('');
        setDescription('');
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700"
                >
                    <Plus size={18} /> <span>New Project</span>
                </button>
            </div>

            {(showCreate || isEditing) && (
                <div className="bg-white p-6 rounded shadow mb-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
                    <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Project Name</label>
                            <input
                                className="w-full border rounded px-3 py-2"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full border rounded px-3 py-2"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                {isEditing ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={cancelForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project._id} className="bg-white p-6 rounded shadow border border-gray-200 hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold truncate">{project.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4 h-12 overflow-hidden">{project.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mt-4 border-t pt-4">
                            <span>By: {project.creator?.name || 'Unknown'}</span>

                            {user?.role === UserRole.ADMIN && (
                                <div className="flex space-x-2">
                                    <button onClick={() => startEdit(project)} className="text-blue-600 hover:text-blue-800 p-1">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-800 p-1">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {projects.length === 0 && !showCreate && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No projects found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
