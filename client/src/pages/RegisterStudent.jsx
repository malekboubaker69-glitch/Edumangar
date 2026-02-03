import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Lock, CheckCircle } from 'lucide-react';

const RegisterStudent = () => {
    const navigate = useNavigate();
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('');
    const [inputPrenom, setInputPrenom] = useState('');
    const [inputNom, setInputNom] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [groups, setGroups] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .order('name');
        if (error) {
            console.error('Error fetching groups:', error);
        } else {
            setGroups(data || []);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Validation : mots de passe identiques
        if (inputPassword !== inputPasswordConfirm) {
            setErrorMessage('Les mots de passe ne correspondent pas');
            return;
        }

        // Validation : longueur minimale
        if (inputPassword.length < 4) {
            setErrorMessage('Le mot de passe doit contenir au moins 4 caractères');
            return;
        }

        setIsLoading(true);

        try {
            // Vérifier si l'identifiant existe déjà
            const { data: existingUser } = await supabase
                .from('etudiants')
                .select('identifiant')
                .eq('identifiant', inputUsername)
                .single();

            if (existingUser) {
                setErrorMessage('Cet identifiant est déjà utilisé');
                setIsLoading(false);
                return;
            }

            // 1. Créer le nouvel étudiant dans etudiants (pour authentification)
            const { error: authError } = await supabase
                .from('etudiants')
                .insert([
                    {
                        identifiant: inputUsername,
                        mot_de_passe: inputPassword,
                        prenom: inputPrenom,
                        nom: inputNom
                    }
                ]);

            if (authError) {
                console.error('Erreur Supabase (etudiants):', authError);
                setErrorMessage('Erreur lors de la création du compte');
                setIsLoading(false);
                return;
            }

            // 2. Créer également l'entrée dans students (pour l'application)
            const { error: studentError } = await supabase
                .from('students')
                .insert([
                    {
                        first_name: inputPrenom,
                        last_name: inputNom,
                        email: inputEmail,
                        group_id: selectedGroupId || null
                    }
                ]);

            if (studentError) {
                console.error('Erreur Supabase (students):', studentError);
            }

            // Succès !
            setSuccessMessage('Compte créé avec succès ! Redirection...');
            setTimeout(() => {
                navigate('/login/student');
            }, 2000);

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

            <div className="bento-card w-full max-w-md p-10">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/login/student')}
                    className="mb-6 text-sm text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                    ← Retour à la connexion
                </button>

                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-indigo-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                    Créer un Compte Étudiant
                </h1>
                <p className="text-sm text-slate-500 text-center mb-8">
                    Inscrivez-vous pour accéder à votre espace
                </p>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-4">

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="input_prenom" className="block text-sm font-medium text-slate-400 mb-2">
                                Prénom
                            </label>
                            <input
                                id="input_prenom"
                                type="text"
                                value={inputPrenom}
                                onChange={(e) => setInputPrenom(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="Prénom"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="input_nom" className="block text-sm font-medium text-slate-400 mb-2">
                                Nom
                            </label>
                            <input
                                id="input_nom"
                                type="text"
                                value={inputNom}
                                onChange={(e) => setInputNom(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="Nom"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="input_email" className="block text-sm font-medium text-slate-400 mb-2">
                            Adresse Email
                        </label>
                        <input
                            id="input_email"
                            type="email"
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    {/* Cluster Selection */}
                    <div>
                        <label htmlFor="select_group" className="block text-sm font-medium text-slate-400 mb-2">
                            Cluster (Groupe)
                        </label>
                        <select
                            id="select_group"
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                            required
                        >
                            <option value="" className="bg-slate-900">Sélectionner un cluster...</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id} className="bg-slate-900">
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

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
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="Choisissez un identifiant"
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
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="Choisissez un mot de passe"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {/* Password Confirmation Input */}
                    <div>
                        <label htmlFor="input_password_confirm" className="block text-sm font-medium text-slate-400 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                id="input_password_confirm"
                                type="password"
                                value={inputPasswordConfirm}
                                onChange={(e) => setInputPasswordConfirm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="Confirmez votre mot de passe"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-shake">
                            {errorMessage}
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm text-center flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {successMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 flex items-center justify-center gap-2 mt-6 px-4 rounded-xl bg-indigo-600 text-white font-medium transition-all hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Création en cours...
                            </>
                        ) : (
                            <>
                                <GraduationCap className="w-5 h-5" />
                                Créer mon compte
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-xs text-slate-600 text-center mt-8">
                    Vous avez déjà un compte ?{' '}
                    <button
                        onClick={() => navigate('/login/student')}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Se connecter
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterStudent;
