import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Download, Check, X, Clock } from 'lucide-react';

const Attendance = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        if (selectedSessionId) {
            fetchAttendance(selectedSessionId);
        }
    }, [selectedSessionId]);

    const fetchSessions = async () => {
        const { data, error } = await supabase
            .from('sessions')
            .select('*, groups(name)')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching sessions:', error);
        } else {
            const transformed = data.map(s => ({ ...s, group_name: s.groups?.name }));
            setSessions(transformed);
            if (transformed.length > 0) setSelectedSessionId(transformed[0].id);
        }
    };

    const fetchAttendance = async (sessionId) => {
        setLoading(true);
        try {
            const currentSession = sessions.find(s => s.id == sessionId);
            if (!currentSession) return;

            // Get students of this group
            const { data: groupStudents, error: studentsError } = await supabase
                .from('students')
                .select('*')
                .eq('group_id', currentSession.group_id);

            if (studentsError) throw studentsError;

            // Get existing attendance for this session
            const { data: attendance, error: attendanceError } = await supabase
                .from('attendance')
                .select('*')
                .eq('session_id', sessionId);

            if (attendanceError) throw attendanceError;

            // Merge
            const merged = (groupStudents || []).map(student => {
                const record = attendance?.find(a => a.student_id === student.id);
                return {
                    ...student,
                    status: record ? record.status : null
                };
            });
            setAttendanceData(merged);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAttendance = attendanceData.filter(student =>
        student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const markAttendance = async (studentId, status) => {
        // Optimistic UI update
        setAttendanceData(prev => prev.map(s =>
            s.id === studentId ? { ...s, status } : s
        ));

        const { error } = await supabase
            .from('attendance')
            .upsert({
                session_id: selectedSessionId,
                student_id: studentId,
                status,
                marked_at: new Date().toISOString()
            }, { onConflict: 'session_id,student_id' });

        if (error) {
            console.error('Error marking attendance', error);
            fetchAttendance(selectedSessionId);
        }
    };

    const downloadReport = async () => {
        const { data, error } = await supabase
            .from('attendance')
            .select('*, sessions(course_name, date), students(first_name, last_name, email, groups(name))');

        if (error) {
            alert('Error exporting: ' + error.message);
            return;
        }

        // Convert to CSV
        const headers = ['Course', 'Date', 'First Name', 'Last Name', 'Email', 'Group', 'Status'];
        const rows = data.map(r => [
            r.sessions?.course_name,
            r.sessions?.date,
            r.students?.first_name,
            r.students?.last_name,
            r.students?.email,
            r.students?.groups?.name,
            r.status
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance_report.csv';
        a.click();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-1">Matrix Management</h2>
                    <h3 className="text-3xl font-bold text-white">Attendance Registry</h3>
                </div>
                <button
                    onClick={downloadReport}
                    className="btn-emerald flex items-center"
                >
                    <Download className="w-4 h-4 mr-2" /> Export Report (CSV)
                </button>
            </div>

            <div className="bento-grid-dashboard !grid-cols-1 lg:!grid-cols-3 !gap-8">
                {/* Session Selector Card */}
                <div className="bento-card p-8 lg:col-span-1 h-fit">
                    <div className="bento-header">
                        <span className="bento-title">Selection Parameters</span>
                    </div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Select Training Sequence</label>
                    <select
                        className="w-full"
                        value={selectedSessionId || ''}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                    >
                        {sessions.map(session => (
                            <option key={session.id} value={session.id}>
                                {session.course_name} - {new Date(session.date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                    <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-xs text-emerald-500/70 leading-relaxed italic">
                            Select a session to load the subject roster and mark presence.
                        </p>
                    </div>
                </div>

                {/* Registry List Card */}
                <div className="bento-card p-0 lg:col-span-2 overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <div className="bento-header mb-0">
                            <span className="bento-title">Subject Roster</span>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Filter roster..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-full py-1.5 px-3 text-[10px] focus:outline-none focus:border-emerald-500 transition-all w-32 focus:w-48"
                                />
                                <span className="bento-badge">{filteredAttendance.length} Subjects</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
                            <span className="text-slate-500 font-medium">Synchronizing data...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th className="text-center">Current Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAttendance.map(student => (
                                        <tr key={student.id}>
                                            <td>
                                                <div className="font-semibold text-white">{student.first_name} {student.last_name}</div>
                                                <div className="text-xs text-slate-500">{student.email}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                    ${student.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        student.status === 'absent' ? 'bg-red-500/10 text-red-500' :
                                                            student.status === 'late' ? 'bg-amber-500/10 text-amber-500' :
                                                                'bg-slate-500/10 text-slate-500'}`}>
                                                    {student.status || 'Unmarked'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => markAttendance(student.id, 'present')}
                                                        className={`p-2.5 rounded-xl transition-all ${student.status === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10'}`}
                                                        title="Mark Present"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => markAttendance(student.id, 'late')}
                                                        className={`p-2.5 rounded-xl transition-all ${student.status === 'late' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10'}`}
                                                        title="Mark Late"
                                                    >
                                                        <Clock className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => markAttendance(student.id, 'absent')}
                                                        className={`p-2.5 rounded-xl transition-all ${student.status === 'absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10'}`}
                                                        title="Mark Absent"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {attendanceData.length === 0 && (
                                <div className="p-20 text-center text-slate-600 italic font-medium">
                                    No subjects detected for this training sequence.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
