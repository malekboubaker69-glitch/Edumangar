import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', group_id: '' });

    useEffect(() => {
        fetchStudents();
        fetchGroups();
    }, []);

    const fetchStudents = async () => {
        const { data, error } = await supabase
            .from('students')
            .select('*, groups(name)')
            .order('last_name');

        if (error) {
            console.error('Error fetching students:', error);
        } else {
            // Transform to match previous format
            setStudents(data.map(s => ({ ...s, group_name: s.groups?.name })));
        }
    };

    const fetchGroups = async () => {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching groups:', error);
        } else {
            setGroups(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('students').insert([{
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            group_id: formData.group_id || null
        }]);

        if (error) {
            alert('Error creating student: ' + error.message);
        } else {
            setShowModal(false);
            setFormData({ first_name: '', last_name: '', email: '', group_id: '' });
            fetchStudents();
        }
    };

    const handleDeleteClick = (id) => {
        setStudentToDelete(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        const { error } = await supabase.from('students').delete().eq('id', studentToDelete);
        if (error) {
            alert('Error deleting student: ' + error.message);
        } else {
            fetchStudents();
        }
        setShowConfirmModal(false);
        setStudentToDelete(null);
    };

    const filteredStudents = students.filter(student =>
        student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.group_name && student.group_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-1">Subject Management</h2>
                    <h3 className="text-3xl font-bold text-white">Subject Directory</h3>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-emerald flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New Subject
                </button>
            </div>

            <div className="bento-card p-0 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="bento-header mb-0">
                        <span className="bento-title">Active Directory</span>
                        <span className="bento-badge">{filteredStudents.length} {filteredStudents.length === 1 ? 'Subject' : 'Subjects'} Found</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter registry..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-2 px-4 text-xs focus:outline-none focus:border-emerald-500 transition-all w-48 focus:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>Subject Identifier</th>
                                <th>Electronic Mail</th>
                                <th>Assigned Cluster</th>
                                <th className="text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td className="font-semibold text-white">{student.first_name} {student.last_name}</td>
                                    <td className="text-slate-500">{student.email}</td>
                                    <td>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                            {student.group_name || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => handleDeleteClick(student.id)}
                                            className="p-2 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && (
                        <div className="p-20 text-center text-slate-600 italic font-medium">
                            No subjects detected in the current directory.
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bento-card p-8 w-full max-w-md shadow-2xl border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Register New Subject</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Given Name</label>
                                    <input
                                        placeholder="First..."
                                        className="w-full"
                                        value={formData.first_name}
                                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Surname</label>
                                    <input
                                        placeholder="Last..."
                                        className="w-full"
                                        value={formData.last_name}
                                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Electronic Mail</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="w-full"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Cluster Assignment</label>
                                <select
                                    className="w-full"
                                    value={formData.group_id}
                                    onChange={e => setFormData({ ...formData, group_id: e.target.value })}
                                >
                                    <option value="">Decentralized (No Cluster)</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-emerald">
                                    Register
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
                title="Delete Subject?"
                message="Are you sure you want to delete this subject? This action cannot be undone."
            />
        </div>
    );
};

export default Students;
