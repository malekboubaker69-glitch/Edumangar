import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    BookOpen,
    CheckCircle,
    Clock,
    ChevronRight,
    Search,
    Plus,
    BarChart3
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_students: 0,
        total_sessions: 0,
        attendance_rate: 0
    });
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSessions, setRecentSessions] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentData();
    }, []);

    const fetchStats = async () => {
        try {
            const { count: studentCount } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true });

            const { count: sessionCount } = await supabase
                .from('sessions')
                .select('*', { count: 'exact', head: true });

            const { data: attendanceData } = await supabase
                .from('attendance')
                .select('status');

            const total = attendanceData?.length || 0;
            const present = attendanceData?.filter(a => a.status === 'present').length || 0;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;

            setStats({
                total_students: studentCount || 0,
                total_sessions: sessionCount || 0,
                attendance_rate: rate
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentData = async () => {
        try {
            const { data: stdData } = await supabase
                .from('students')
                .select('*')
                .limit(5);
            setStudents(stdData || []);

            const { data: sessData } = await supabase
                .from('sessions')
                .select('*, group:groups(name)')
                .order('date', { ascending: false })
                .limit(4);
            setRecentSessions(sessData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const filteredStudents = students.filter(student =>
        student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bento-grid-dashboard">

                {/* LARGE BOX: STATS SUMMARY */}
                <div className="bento-card col-span-2 p-8 flex flex-col justify-between">
                    <div className="bento-header">
                        <span className="bento-title">Performance Metrics</span>
                        <BarChart3 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-8 items-end">
                        <div className="stat-item">
                            <div className="stat-value">{stats.total_students}</div>
                            <div className="stat-label uppercase tracking-widest text-[10px]">Total Subjects</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{stats.total_sessions}</div>
                            <div className="stat-label uppercase tracking-widest text-[10px]">Curriculum Blocks</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value text-emerald-500">{stats.attendance_rate}%</div>
                            <div className="stat-label uppercase tracking-widest text-[10px]">Registry Rate</div>
                        </div>
                    </div>
                    <div className="mt-10 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 shadow-glow shadow-emerald-500/50 transition-all duration-1000"
                            style={{ width: `${stats.attendance_rate}%` }}
                        />
                    </div>
                </div>

                {/* MEDIUM BOX: COURSES OF THE DAY */}
                <div className="bento-card col-span-2 p-8">
                    <div className="bento-header">
                        <span className="bento-title">Daily Curriculum</span>
                        <span className="bento-badge">4 Scheduled</span>
                    </div>
                    <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentSessions.length > 0 ? recentSessions.map((session, idx) => (
                            <div key={idx} className="list-item-modern group">
                                <div className="p-3 bg-emerald-500/10 rounded-xl mr-4 group-hover:bg-emerald-500/20 transition-colors">
                                    <Clock className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-white">{session.group?.name}</div>
                                    <div className="text-xs text-slate-500">{session.time || '09:00 AM'} • {session.instructor || 'Lead Instructor'}</div>
                                </div>
                                <button className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-slate-600 italic">No courses scheduled for today</div>
                        )}
                    </div>
                </div>

                {/* TALL BOX: STUDENTS LIST */}
                <div className="bento-card col-span-2 row-span-2 p-8">
                    <div className="bento-header">
                        <div className="flex items-center gap-3">
                            <span className="bento-title">Subject Roster</span>
                            <span className="text-xs text-slate-500 font-medium">Recent Additions</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Filter..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald-500 transition-all w-32 focus:w-48"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filteredStudents.map((student, idx) => (
                            <div key={idx} className="list-item-modern flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400">
                                    {student.first_name[0]}{student.last_name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white">{student.first_name} {student.last_name}</div>
                                    <div className="text-xs text-slate-500">{student.email}</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            </div>
                        ))}
                        <button
                            onClick={() => navigate('/students')}
                            className="w-full mt-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-all text-center"
                        >
                            View Performance Directory
                        </button>
                    </div>
                </div>

                {/* DYNAMIC ACTION BOX */}
                <div className="bento-card p-8 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                            <Plus className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">New Sequence</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Initialize a new training module or attendance matrix.</p>
                    </div>
                    <button
                        onClick={() => navigate('/sessions')}
                        className="mt-8 btn-emerald w-full"
                    >
                        Initialize
                    </button>
                </div>

                {/* SMALL DATA BOX */}
                <div className="bento-card p-8 bg-emerald-500/5 group border-emerald-500/10">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between">
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-emerald-500 mb-1 leading-none tracking-tight">Active</div>
                            <div className="text-[10px] uppercase font-bold text-emerald-500/50 tracking-widest">Registry Status</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
