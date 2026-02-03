import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const Groups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const { data, error } = await supabase
            .from('groups')
            .select('*, students(count)')
            .order('name');

        if (error) {
            console.error('Error fetching groups:', error);
        } else {
            setGroups(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('groups').insert([{ name: formData.name }]);

        if (error) {
            alert('Error creating group: ' + error.message);
        } else {
            setShowModal(false);
            setFormData({ name: '' });
            fetchGroups();
        }
    };

    const handleDeleteClick = (id) => {
        setGroupToDelete(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        const { error } = await supabase.from('groups').delete().eq('id', groupToDelete);
        if (error) {
            alert('Error deleting group: ' + error.message);
        } else {
            fetchGroups();
        }
        setShowConfirmModal(false);
        setGroupToDelete(null);
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-1">Cluster Management</h2>
                    <h3 className="text-3xl font-bold text-white">Groups & Clusters</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter clusters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-2 px-4 text-xs focus:outline-none focus:border-emerald-500 transition-all w-48 focus:w-64"
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-emerald flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add New Cluster
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                    <div key={group.id} className="bento-card p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl mr-4 group-hover:bg-emerald-500/20 transition-colors">
                                    <Users className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{group.name}</h3>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
                                        {group.students?.[0]?.count || 0} Subjects Detected
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteClick(group.id)}
                                className="text-slate-600 hover:text-red-500 transition-colors p-2"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/students')}
                                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                View Cluster Registry
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {groups.length === 0 && (
                <div className="bento-card p-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-slate-700" />
                    </div>
                    <p className="text-slate-500 font-medium">No clusters detected in the system.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-6 text-emerald-500 text-sm font-bold hover:underline"
                    >
                        Initialize first cluster
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bento-card p-8 w-full max-w-md shadow-2xl border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Initialize New Cluster</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Cluster Name</label>
                                <input
                                    placeholder="Enter identifier..."
                                    className="w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-emerald">
                                    Initialize
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showConfirmModal}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowConfirmModal(false)}
                title="Delete Cluster?"
                message="Are you sure you want to delete this cluster? This will remove the group assignment from all subjects."
            />
        </div>
    );
};

export default Groups;
