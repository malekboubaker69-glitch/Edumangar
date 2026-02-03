import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, FolderKanban, BookOpen, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/groups', label: 'Clusters', icon: FolderKanban },
        { path: '/students', label: 'Students', icon: Users },
        { path: '/sessions', label: 'Curriculum', icon: BookOpen },
        { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
    ];

    return (
        <div className="flex h-screen bg-[#0a0a0d]">
            {/* Sidebar */}
            <aside className="w-72 nav-sidebar flex flex-col p-6">
                <div className="mb-10 flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <div className="bg-white w-5 h-1 rounded-full rotate-45 transform translate-y-0.5" />
                        <div className="bg-white w-5 h-1 rounded-full -rotate-45 transform -translate-y-0.5" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">EduManager</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-emerald-500' : ''}`} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                    <div className="mt-4 px-4 text-xs text-slate-600 font-medium tracking-wider uppercase">
                        v1.2.1 • Bento System
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8 lg:p-12">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-1">Control Panel</h2>
                        <h3 className="text-3xl font-bold text-white">System Overview</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0a0a0d] bg-slate-800" />
                            ))}
                        </div>
                        <button
                            onClick={() => alert('No new notifications')}
                            className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <span className="sr-only">Notifications</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </button>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default Layout;
