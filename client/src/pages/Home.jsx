import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-6"
            style={{ backgroundColor: 'var(--bg-primary)' }}>

            <div className="max-w-4xl w-full">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Bienvenue
                    </h1>
                    <p className="text-lg text-slate-400">
                        Choisissez votre type de connexion pour continuer
                    </p>
                </div>

                {/* Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Admin Card */}
                    <button
                        onClick={() => navigate('/login')}
                        className="bento-card p-10 text-left group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-100"
                    >
                        <div className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                <Shield className="w-10 h-10 text-emerald-500" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-white mb-3">
                                Administrateur
                            </h2>

                            {/* Description */}
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                Accès complet au système de gestion. Gérez les étudiants, les groupes et les sessions.
                            </p>

                            {/* Button */}
                            <div className="mt-auto">
                                <span className="inline-flex items-center px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium transition-all group-hover:bg-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                                    Se connecter
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Student Card */}
                    <button
                        onClick={() => navigate('/login/student')}
                        className="bento-card p-10 text-left group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-100"
                    >
                        <div className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <GraduationCap className="w-10 h-10 text-indigo-400" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-white mb-3">
                                Étudiant
                            </h2>

                            {/* Description */}
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                Consultez votre emploi du temps, vos absences et votre progression académique.
                            </p>

                            {/* Button */}
                            <div className="mt-auto">
                                <span className="inline-flex items-center px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium transition-all group-hover:bg-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                                    Se connecter
                                </span>
                            </div>
                        </div>
                    </button>

                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-slate-600 mt-10">
                    Besoin d'aide ? Contactez le support technique
                </p>
            </div>
        </div>
    );
};

export default Home;
