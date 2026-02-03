import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, LogOut, User as UserIcon } from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [courses, setCourses] = useState([]);
    const [quizResults, setQuizResults] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const user = localStorage.getItem('student_user');
            const type = localStorage.getItem('user_type');

            if (!user || type !== 'student') {
                navigate('/login/student');
                return null;
            }
            return JSON.parse(user);
        };

        const authUser = checkAuth();
        if (authUser) {
            loadStudentAndCourses(authUser);
        }
    }, [navigate]);

    const loadStudentAndCourses = async (authUser) => {
        setIsLoading(true);
        try {
            // 1. Trouver l'entrée correspondante dans la table 'students' 
            const { data: studentRecords, error: studentError } = await supabase
                .from('students')
                .select('*, groups(name)')
                .eq('first_name', authUser.prenom)
                .eq('last_name', authUser.nom)
                .limit(1);

            if (studentError) throw studentError;

            if (studentRecords && studentRecords.length > 0) {
                const student = studentRecords[0];
                setStudentData(student);

                // 2. Récupérer les résultats des quiz pour cet étudiant
                const { data: resultsData } = await supabase
                    .from('quiz_results')
                    .select('*')
                    .eq('student_id', student.id);

                const resultsMap = {};
                resultsData?.forEach(res => {
                    resultsMap[res.session_id] = res;
                });
                setQuizResults(resultsMap);

                // 3. Récupérer les sessions pour le groupe de l'étudiant
                if (student.group_id) {
                    const { data: sessionData, error: sessionError } = await supabase
                        .from('sessions')
                        .select('*')
                        .eq('group_id', student.group_id)
                        .order('date', { ascending: true });

                    if (sessionError) throw sessionError;
                    setCourses(sessionData || []);
                }
            } else {
                setError("Profil étudiant introuvable dans le répertoire.");
            }
        } catch (err) {
            console.error('Erreur chargement dashboard:', err);
            setError("Une erreur est survenue lors du chargement de vos cours.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('student_user');
        localStorage.removeItem('user_type');
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">Espace Étudiant</h2>
                        <h1 className="text-4xl font-black text-white">Mes Cours</h1>
                    </div>

                    <div className="flex items-center gap-4 p-2 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 px-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white leading-none mb-1">
                                    {studentData?.first_name} {studentData?.last_name}
                                </p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                    {studentData?.groups?.name || 'Non assigné'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-slate-500"
                            title="Déconnexion"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {error ? (
                    <div className="bento-card p-12 text-center border-red-500/20">
                        <p className="text-red-400 font-medium mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-sm font-bold text-indigo-400 hover:underline">
                            Réessayer
                        </button>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => navigate(`/student/course/${course.id}`)}
                                className="bento-card p-6 group hover:border-indigo-500/30 transition-all duration-300 text-left w-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-500/20 transition-colors">
                                        <BookOpen className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        SESSION
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 min-h-[3.5rem]">
                                    {course.course_name}
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center text-slate-400 text-sm gap-3">
                                        <Calendar className="w-4 h-4 text-indigo-500/50" />
                                        <span>{new Date(course.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center text-slate-400 text-sm gap-3">
                                        <Clock className="w-4 h-4 text-indigo-500/50" />
                                        <span className="font-medium">{course.start_time} — {course.end_time}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-indigo-500/50 uppercase tracking-widest">Status</span>
                                    <span className="flex items-center gap-2">
                                        {quizResults[course.id] ? (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                                    Terminé ({quizResults[course.id].score}/{quizResults[course.id].total_questions})
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Démarrer</span>
                                            </>
                                        )}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bento-card p-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-6">
                            <BookOpen className="w-10 h-10 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Aucun cours trouvé</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Vous n'avez pas encore de sessions planifiées pour votre groupe. Revenez plus tard !
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
