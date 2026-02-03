import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Calendar } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isNewCourse, setIsNewCourse] = useState(false);
    const [formData, setFormData] = useState({
        course_name: '',
        date: '',
        start_time: '',
        end_time: '',
        group_id: ''
    });

    useEffect(() => {
        fetchSessions();
        fetchGroups();
        fetchCourses();
    }, []);

    const fetchSessions = async () => {
        const { data, error } = await supabase
            .from('sessions')
            .select('*, groups(name)')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching sessions:', error);
        } else {
            setSessions(data.map(s => ({ ...s, group_name: s.groups?.name })));
        }
    };

    const fetchGroups = async () => {
        const { data } = await supabase.from('groups').select('*').order('name');
        setGroups(data || []);
    };

    const fetchCourses = async () => {
        const { data } = await supabase.from('courses').select('*').order('name');
        setCourses(data || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalCourseName = formData.course_name;

        // Ensure course exists in 'courses' table
        const { data: existingCourse } = await supabase
            .from('courses')
            .select('id')
            .eq('name', finalCourseName)
            .single();

        let courseId;
        if (!existingCourse) {
            const { data: newCourse, error: courseError } = await supabase
                .from('courses')
                .insert([{ name: finalCourseName }])
                .select()
                .single();

            if (courseError) {
                alert('Error creating course: ' + courseError.message);
                return;
            }
            courseId = newCourse.id;

            // Initialize empty course content for the new course
            await supabase.from('course_contents').insert([{
                course_id: courseId,
                modules: []
            }]);
        }

        const { error } = await supabase.from('sessions').insert([{
            course_name: finalCourseName,
            date: formData.date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            group_id: formData.group_id
        }]);

        if (error) {
            alert('Error creating session: ' + error.message);
        } else {
            setShowModal(false);
            setFormData({ course_name: '', date: '', start_time: '', end_time: '', group_id: '' });
            setIsNewCourse(false);
            fetchSessions();
            fetchCourses();
        }
    };

    const handleDeleteClick = (id) => {
        setSessionToDelete(id);
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        const { error } = await supabase.from('sessions').delete().eq('id', sessionToDelete);
        if (error) {
            alert('Error deleting session: ' + error.message);
        } else {
            fetchSessions();
        }
        setShowConfirmModal(false);
        setSessionToDelete(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-1">Schedule Management</h2>
                    <h3 className="text-3xl font-bold text-white">Curriculum Sessions</h3>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-emerald flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New Session
                </button>
            </div>

            <div className="bento-card p-0 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="bento-header mb-0">
                        <span className="bento-title">Session Log</span>
                        <span className="bento-badge">{sessions.length} Recorded</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>Curriculum Subject</th>
                                <th>Scheduled Date</th>
                                <th>Temporal Range</th>
                                <th>Target Cluster</th>
                                <th className="text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <tr key={session.id}>
                                    <td className="font-semibold text-white">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-3 text-emerald-500/50" />
                                            {session.course_name}
                                        </div>
                                    </td>
                                    <td className="text-slate-500">{new Date(session.date).toLocaleDateString()}</td>
                                    <td className="text-slate-500 text-xs font-medium">{session.start_time} — {session.end_time}</td>
                                    <td>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                            {session.group_name || 'Generic'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => handleDeleteClick(session.id)}
                                            className="p-2 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sessions.length === 0 && (
                        <div className="p-20 text-center text-slate-600 italic font-medium">
                            No sessions scheduled in the current curriculum.
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bento-card p-8 w-full max-w-md shadow-2xl border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Schedule New Session</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Course / Subject Name</label>
                                {!isNewCourse ? (
                                    <div className="space-y-2">
                                        <select
                                            className="w-full"
                                            value={formData.course_name}
                                            onChange={(e) => {
                                                if (e.target.value === 'ADD_NEW') {
                                                    setIsNewCourse(true);
                                                    setFormData({ ...formData, course_name: '' });
                                                } else {
                                                    setFormData({ ...formData, course_name: e.target.value });
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                            <option value="ADD_NEW" className="text-emerald-500 font-bold">+ Add New Course</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Enter new course name"
                                            className="flex-1"
                                            value={formData.course_name}
                                            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                                            required
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsNewCourse(false);
                                                setFormData({ ...formData, course_name: '' });
                                            }}
                                            className="btn-secondary px-3"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Scheduled Date</label>
                                <input
                                    type="date"
                                    className="w-full"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Target Cluster</label>
                                <select
                                    className="w-full"
                                    value={formData.group_id}
                                    onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Cluster Assignment</option>
                                    {groups.map((g) => (
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
                                    Schedule
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
                title="Delete Session?"
                message="Are you sure you want to delete this training session? This action cannot be undone."
            />
        </div>
    );
};

export default Sessions;
