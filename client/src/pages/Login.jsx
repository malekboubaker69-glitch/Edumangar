import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            // Requête Supabase pour vérifier les identifiants
            const { data, error } = await supabase
                .from('utilisateurs')
                .select('*')
                .eq('identifiant', inputUsername)
                .eq('mot_de_passe', inputPassword);

            if (error) {
                console.error('Erreur Supabase:', error);
                setErrorMessage('Erreur de connexion à la base de données');
                setIsLoading(false);
                return;
            }

            // Vérifier si au moins 1 ligne a été retournée
            if (data && data.length > 0) {
                // Connexion réussie - redirection vers /dashboard
                navigate('/dashboard');
            } else {
                // Pas de correspondance - afficher erreur
                setErrorMessage('Identifiant ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6"
            style={{ backgroundColor: 'var(--bg-primary)' }}>

            {/* Centered Card */}
            <div className="bento-card w-full max-w-md p-10">

                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                    Connexion
                </h1>
                <p className="text-sm text-slate-500 text-center mb-8">
                    Accédez à votre tableau de bord
                </p>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Username Input */}
                    <div>
                        <label htmlFor="input_username" className="block text-sm font-medium text-slate-400 mb-2">
                            Identifiant
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                id="input_username"
                                type="text"
                                value={inputUsername}
                                onChange={(e) => setInputUsername(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="Entrez votre identifiant"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="input_password" className="block text-sm font-medium text-slate-400 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                id="input_password"
                                type="password"
                                value={inputPassword}
                                onChange={(e) => setInputPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                placeholder="Entrez votre mot de passe"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div
                            id="error_message"
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake"
                        >
                            {errorMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        id="btn_login"
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-emerald py-3.5 flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Connexion en cours...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Se connecter
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Note */}
                <p className="text-xs text-slate-600 text-center mt-8">
                    Utilisateur de test : <span className="text-slate-500">admin / admin123</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
