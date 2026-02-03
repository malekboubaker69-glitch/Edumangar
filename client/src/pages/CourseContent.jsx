import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    BookOpen,
    Code2,
    Lightbulb,
    Trophy,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    BookOpen,
    Code2,
    Lightbulb,
    Trophy,
    RefreshCcw,
    Globe,
    Palette,
    Monitor,
    Cpu
} from 'lucide-react';

const CourseContent = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Dynamic Course Data
    const courseModules = {
        'intro web': {
            title: "Introduction au Web",
            description: "Découvrez comment fonctionne le web et créez vos premières pages.",
            icon: <Globe className="w-6 h-6 text-blue-500" />,
            lessons: [
                {
                    title: "1. Le HTML : La Structure",
                    icon: <Code2 className="w-6 h-6 text-orange-500" />,
                    bg: "bg-orange-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Le <strong>HTML</strong> (HyperText Markup Language) définit le contenu de votre page (squelette).</p>
                            <h3 className="text-xl font-bold text-white mt-6">Balises principales :</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><code className="text-orange-400">&lt;h1&gt;</code> : Titre principal.</li>
                                <li><code className="text-orange-400">&lt;p&gt;</code> : Paragraphe.</li>
                                <li><code className="text-orange-400">&lt;a&gt;</code> : Lien hypertexte.</li>
                            </ul>
                        </div>
                    )
                },
                {
                    title: "2. Le CSS : Le Design",
                    icon: <Palette className="w-6 h-6 text-sky-400" />,
                    bg: "bg-sky-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Le <strong>CSS</strong> (Cascading Style Sheets) gère la mise en forme. Sans lui, le web serait triste !</p>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mt-6 font-mono text-sm leading-relaxed">
                                <p>Il gère :</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                                    <li>Couleurs et polices</li>
                                    <li>Disposition (Layout)</li>
                                    <li>Responsive Design (Mobile)</li>
                                </ul>
                            </div>
                        </div>
                    )
                },
                {
                    title: "3. Le JavaScript : L'Interactivité",
                    icon: <Cpu className="w-6 h-6 text-yellow-400" />,
                    bg: "bg-yellow-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Le <strong>JavaScript</strong> est le cerveau de la page. Il la rend vivante (animations, formulaires...).</p>
                            <h3 className="text-xl font-bold text-white mt-6">Analogie de la maison :</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>HTML</strong> : Les murs (Structure)</li>
                                <li><strong>CSS</strong> : La peinture & déco (Style)</li>
                                <li><strong>JS</strong> : L'électricité (Dynamisme)</li>
                            </ul>
                        </div>
                    )
                },
                {
                    title: "4. Fonctionnement du Web",
                    icon: <Globe className="w-6 h-6 text-indigo-400" />,
                    bg: "bg-indigo-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <h3 className="text-xl font-bold text-white">Modèle Client-Serveur :</h3>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mt-6 font-mono text-sm leading-relaxed">
                                <ol className="list-decimal list-inside space-y-2">
                                    <li><strong>Client (Vous)</strong> : Envoie une requête.</li>
                                    <li><strong>Serveur</strong> : Cherche et renvoie les fichiers.</li>
                                    <li><strong>Navigateur</strong> : Interprète le code et l'affiche.</li>
                                </ol>
                            </div>
                        </div>
                    )
                },
                {
                    title: "5. Vos Premiers Outils",
                    icon: <Monitor className="w-6 h-6 text-emerald-400" />,
                    bg: "bg-emerald-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Pas besoin de logiciel payant !</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                                <li><strong>Éditeur de code</strong> : VS Code (Visual Studio Code).</li>
                                <li><strong>Navigateur</strong> : Chrome, Firefox... pour tester en temps réel.</li>
                            </ul>
                        </div>
                    )
                }
            ],
            questions: [
                { question: "Quel langage gère la structure de la page ?", options: ["HTML", "CSS", "JavaScript"], answer: 0 },
                { question: "Quel langage gère le design et les couleurs ?", options: ["HTML", "CSS", "Python"], answer: 1 },
                { question: "Dans l'analogie de la maison, le JavaScript c'est...", options: ["Les murs", "La peinture", "L'électricité"], answer: 2 },
                { question: "Qui envoie la requête dans le modèle web ?", options: ["Le Serveur", "Le Client", "La Base de données"], answer: 1 }
            ]
        },
        'js': {
            title: "JavaScript : Le Langage du Web",
            description: "Apprenez à créer des sites dynamiques et interactifs.",
            icon: <Code2 className="w-6 h-6 text-indigo-500" />,
            lessons: [
                {
                    title: "1. Environnement et Variables",
                    icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
                    bg: "bg-indigo-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Pour commencer, créez <code className="text-white">index.html</code> et <code className="text-white">script.js</code>, puis liez-les : <code className="text-indigo-400">{"<script src=\"script.js\"></script>"}</code>.</p>
                            <h3 className="text-xl font-bold text-white mt-6">Variables : La mémoire</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><code className="text-indigo-400 font-bold">let</code> : Un tiroir modifiable (ex: score).</li>
                                <li><code className="text-indigo-400 font-bold">const</code> : Un tiroir verrouillé (ex: date de naissance).</li>
                            </ul>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mt-6 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">let</span> message = <span className="text-orange-400">"Bienvenue !"</span>;</p>
                                <p><span className="text-emerald-400">const</span> annee = <span className="text-orange-400">2026</span>;</p>
                                <p>console.<span className="text-sky-300">log</span>(message);</p>
                            </div>
                        </div>
                    )
                },
                {
                    title: "2. Opérations et Conditions",
                    icon: <Lightbulb className="w-6 h-6 text-amber-400" />,
                    bg: "bg-amber-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Le JS sait calculer (<code className="text-white">+ , *</code>) et comparer (<code className="text-white">&gt; , ===</code>).</p>
                            <h3 className="text-xl font-bold text-white mt-6">Faire des choix (if...else)</h3>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">if</span> (heure &lt; <span className="text-orange-400">12</span>) <span className="text-white">{"{"}</span></p>
                                <p className="ml-6">console.<span className="text-sky-300">log</span>(<span className="text-orange-400">"Matin"</span>);</p>
                                <p><span className="text-white">{"}"}</span> <span className="text-emerald-400">else</span> <span className="text-white">{"{"}</span></p>
                                <p className="ml-6">console.<span className="text-sky-300">log</span>(<span className="text-orange-400">"Soir"</span>);</p>
                                <p><span className="text-white">{"}"}</span></p>
                            </div>
                        </div>
                    )
                },
                {
                    title: "3. Fonctions et Tableaux",
                    icon: <Trophy className="w-6 h-6 text-emerald-400" />,
                    bg: "bg-emerald-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <h3 className="text-xl font-bold text-white">Fonctions : Recettes réutilisables</h3>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">function</span> <span className="text-sky-300">saluer</span>(nom) <span className="text-white">{"{"}</span></p>
                                <p className="ml-6">console.<span className="text-sky-300">log</span>(<span className="text-orange-400">"Salut "</span> + nom);</p>
                                <p><span className="text-white">{"}"}</span></p>
                            </div>
                            <h3 className="text-xl font-bold text-white mt-6">Tableaux : Listes</h3>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">let</span> courses = [<span className="text-orange-400">"Pain"</span>, <span className="text-orange-400">"Lait"</span>];</p>
                                <p>courses.<span className="text-sky-300">push</span>(<span className="text-orange-400">"Choco"</span>);</p>
                            </div>
                        </div>
                    )
                },
                {
                    title: "4. Le Web Dynamique (DOM)",
                    icon: <Code2 className="w-6 h-6 text-sky-400" />,
                    bg: "bg-sky-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>On "attrape" un élément HTML pour le modifier :</p>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">const</span> btn = document.<span className="text-sky-300">getElementById</span>(<span className="text-orange-400">"monBtn"</span>);</p>
                                <p>btn.<span className="text-sky-300">addEventListener</span>(<span className="text-orange-400">"click"</span>, () =&gt; <span className="text-white">{"{"}</span></p>
                                <p className="ml-6">btn.style.color = <span className="text-orange-400">"red"</span>;</p>
                                <p><span className="text-white">{"}"}</span>);</p>
                            </div>
                        </div>
                    )
                }
            ],
            questions: [
                { question: "Quel mot-clé pour une variable modifiable ?", options: ["const", "let", "fixed"], answer: 1 },
                { question: "Comment vérifier la valeur ET le type ?", options: ["=", "==", "==="], answer: 2 },
                { question: "Quelle méthode ajoute à la fin d'un tableau ?", options: ["pop()", "push()", "insert()"], answer: 1 },
                { question: "Comment sélectionner un ID en JS ?", options: ["getElementById()", "findId()", "selectId()"], answer: 0 }
            ]
        },
        'python': {
            title: "Python : Le Langage Polyvalent",
            description: "Apprenez le langage le plus populaire pour l'IA et l'automatisation.",
            icon: <Code2 className="w-6 h-6 text-emerald-500" />,
            lessons: [
                {
                    title: "1. Installation et Variables",
                    icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
                    bg: "bg-emerald-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Python se lit presque comme de l'anglais ! Tapez <code className="text-white font-bold">print("Hello World")</code> pour commencer.</p>
                            <h3 className="text-xl font-bold text-white mt-6">Variables (Stocker des données)</h3>
                            <p>Pas besoin de mots-clés comme <code className="text-indigo-400">let</code>. On écrit directement :</p>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mt-6 font-mono text-sm leading-relaxed">
                                <p>nom = <span className="text-orange-400">"Yassine"</span> <span className="text-slate-500"># String</span></p>
                                <p>age = <span className="text-orange-400">20</span> <span className="text-slate-500"># Integer</span></p>
                                <p>prix = <span className="text-orange-400">19.99</span> <span className="text-slate-500"># Float</span></p>
                            </div>
                        </div>
                    )
                },
                {
                    title: "2. Listes et Conditions",
                    icon: <Lightbulb className="w-6 h-6 text-sky-400" />,
                    bg: "bg-sky-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <h3 className="text-xl font-bold text-white">Les Listes</h3>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p>amis = [<span className="text-orange-400">"Alice"</span>, <span className="text-orange-400">"Bob"</span>]</p>
                                <p>amis.<span className="text-emerald-400">append</span>(<span className="text-orange-400">"Eva"</span>)</p>
                            </div>
                            <h3 className="text-xl font-bold text-white mt-6">Conditions (Si... Sinon)</h3>
                            <p>Attention : Python utilise <code className="text-white">:</code> et l'indentation (espace).</p>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">if</span> note &gt;= <span className="text-orange-400">10</span>:</p>
                                <p className="ml-6 text-sky-300">print(<span className="text-orange-400">"Réussi !"</span>)</p>
                            </div>
                        </div>
                    )
                },
                {
                    title: "3. Boucles et Fonctions",
                    icon: <Trophy className="w-6 h-6 text-indigo-400" />,
                    bg: "bg-indigo-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <h3 className="text-xl font-bold text-white">Boucle For</h3>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">for</span> i <span className="text-emerald-400">in</span> <span className="text-emerald-400">range</span>(<span className="text-orange-400">5</span>):</p>
                                <p className="ml-6 text-sky-300">print(<span className="text-orange-400">"Ligne"</span>, i)</p>
                            </div>
                            <h3 className="text-xl font-bold text-white mt-6">Fonctions (Recettes)</h3>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p><span className="text-emerald-400">def</span> <span className="text-sky-300">calculer_tva</span>(prix):</p>
                                <p className="ml-6"><span className="text-emerald-400">return</span> prix * <span className="text-orange-400">1.2</span></p>
                            </div>
                        </div>
                    )
                },
                {
                    title: "4. Entrées Utilisateurs",
                    icon: <Code2 className="w-6 h-6 text-amber-400" />,
                    bg: "bg-amber-500/10",
                    content: (
                        <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                            <p>Discutez avec l'utilisateur via la console :</p>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed">
                                <p>nom = <span className="text-emerald-400">input</span>(<span className="text-orange-400">"Ton nom ? "</span>)</p>
                                <p>print(<span className="text-orange-400">"Salut "</span> + nom)</p>
                            </div>
                        </div>
                    )
                }
            ],
            questions: [
                { question: "Quel mot-clé pour définir une fonction en Python ?", options: ["function", "def", "define"], answer: 1 },
                { question: "Comment Python délimite-t-il les blocs ?", options: ["Accolades {}", "Indentation", "Point-virgule ;"], answer: 1 },
                { question: "Quelle fonction pour lire une entrée utilisateur ?", options: ["get()", "read()", "input()"], answer: 2 },
                { question: "Comment ajouter un élément à une liste ?", options: ["push()", "append()", "add()"], answer: 1 }
            ]
        }
    };

    // Current lesson/quiz based on dynamic course name
    const [dynamicModules, setDynamicModules] = useState({});

    const courseContent = session ?
        (dynamicModules[session.course_name.toLowerCase()] || courseModules[session.course_name.toLowerCase()]) :
        null;

    const questions = courseContent?.questions || [];

    // Quiz State
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const loadStudentId = async () => {
            const userStr = localStorage.getItem('student_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const { data } = await supabase
                    .from('students')
                    .select('id')
                    .eq('first_name', user.prenom)
                    .eq('last_name', user.nom)
                    .single();
                if (data) setStudentId(data.id);
            }
        };
        loadStudentId();

        const fetchSession = async () => {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('id', sessionId)
                .single();

            if (error) {
                console.error(error);
            } else {
                setSession(data);
                // After fetching session, fetch its dynamic content if any
                const { data: courseData } = await supabase
                    .from('courses')
                    .select('id, name')
                    .eq('name', data.course_name)
                    .single();

                if (courseData) {
                    const { data: contentData } = await supabase
                        .from('course_contents')
                        .select('modules')
                        .eq('course_id', courseData.id)
                        .single();

                    if (contentData && contentData.modules && contentData.modules.length > 0) {
                        setDynamicModules(prev => ({
                            ...prev,
                            [data.course_name.toLowerCase()]: {
                                title: data.course_name,
                                description: "Contenu de cours dynamique créé par l'administration.",
                                icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
                                lessons: contentData.modules.map(mod => ({
                                    ...mod,
                                    icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
                                    bg: "bg-indigo-500/10"
                                })),
                                questions: []
                            }
                        }));
                    }
                }
            }
            setIsLoading(false);
        };
        fetchSession();
    }, [sessionId]);

    const saveQuizResult = async (finalScore) => {
        if (!studentId || !sessionId) return;

        const { error } = await supabase
            .from('quiz_results')
            .upsert({
                student_id: studentId,
                session_id: parseInt(sessionId),
                score: finalScore,
                total_questions: questions.length,
                completed_at: new Date().toISOString()
            }, { onConflict: 'student_id, session_id' });

        if (error) console.error('Error saving quiz result:', error);
    };

    const handleAnswerClick = (index) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
    };

    const handleVerifyAnswer = () => {
        if (selectedAnswer === null || isAnswered) return;

        setIsAnswered(true);

        if (selectedAnswer === questions[currentQuestion].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        const next = currentQuestion + 1;
        if (next < questions.length) {
            setCurrentQuestion(next);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            saveQuizResult(score);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowResults(false);
        setQuizStarted(false);
        setSelectedAnswer(null);
        setIsAnswered(false);
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    // Fallback if course not found
    if (!courseContent) return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold mb-4">Contenu indisponible</h1>
            <p className="text-slate-400 mb-8">Le cours "{session?.course_name}" n'a pas encore de module interactif.</p>
            <button onClick={() => navigate('/student/dashboard')} className="btn-emerald">Retour</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
            <div className="max-w-4xl mx-auto">

                {/* Navigation */}
                <button
                    onClick={() => navigate('/student/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retour au tableau de bord
                </button>

                {/* Course Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4 text-indigo-500">
                        {courseContent.icon}
                        <span className="text-sm font-bold uppercase tracking-widest">Leçon Interactive</span>
                    </div>
                    <h1 className="text-5xl font-black mb-4">Module : {courseContent.title}</h1>
                    <p className="text-slate-400 text-lg">{courseContent.description}</p>
                </div>

                {/* Main Content Area */}
                {!quizStarted ? (
                    <div className="space-y-10">
                        {courseContent.lessons.map((lesson, idx) => (
                            <div key={idx} className="bento-card p-8 md:p-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-2xl ${lesson.bg} flex items-center justify-center`}>
                                        {lesson.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold">{lesson.title}</h2>
                                </div>
                                {lesson.content}
                            </div>
                        ))}

                        {/* Transition to Quiz */}
                        <div className="flex flex-col items-center py-10">
                            <div className="w-px h-16 bg-gradient-to-b from-transparent to-indigo-500/50 mb-6"></div>
                            <button
                                onClick={() => setQuizStarted(true)}
                                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2rem] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/40 flex items-center gap-4 text-xl"
                            >
                                <Trophy className="w-6 h-6" />
                                Passer au Quiz !
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Quiz System */
                    <div className="max-w-2xl mx-auto py-10">
                        {!showResults ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Quiz Progress */}
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-indigo-400 font-black text-sm uppercase tracking-widest">Question {currentQuestion + 1} / {questions.length}</p>
                                    <p className="text-slate-600 text-xs font-bold">Progress: {Math.round(((currentQuestion + 1) / questions.length) * 100)}%</p>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-12">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-500"
                                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                    ></div>
                                </div>

                                <h2 className="text-3xl font-bold mb-10 text-center leading-tight">
                                    {questions[currentQuestion].question}
                                </h2>

                                <div className="space-y-4">
                                    {questions[currentQuestion].options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerClick(idx)}
                                            className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between group
                                                ${!isAnswered ?
                                                    (idx === selectedAnswer ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5') :
                                                    idx === questions[currentQuestion].answer ? 'border-emerald-500/50 bg-emerald-500/10' :
                                                        idx === selectedAnswer ? 'border-red-500/50 bg-red-500/10' : 'border-white/5 opacity-50'}
                                            `}
                                        >
                                            <span className="font-bold text-lg">{opt}</span>
                                            {isAnswered && idx === questions[currentQuestion].answer && <CheckCircle2 className="text-emerald-500" />}
                                            {isAnswered && idx === selectedAnswer && idx !== questions[currentQuestion].answer && <XCircle className="text-red-500" />}
                                        </button>
                                    ))}
                                </div>

                                {selectedAnswer !== null && !isAnswered && (
                                    <button
                                        onClick={handleVerifyAnswer}
                                        className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl mt-12 hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                                    >
                                        Vérifier la réponse
                                    </button>
                                )}

                                {isAnswered && (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full py-5 bg-white text-black font-black rounded-2xl mt-12 hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        {currentQuestion + 1 === questions.length ? "Voir les résultats" : "Question Suivante"}
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* Final Results */
                            <div className="text-center animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-indigo-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-indigo-500/30">
                                    <Trophy className="w-12 h-12 text-indigo-400" />
                                </div>
                                <h2 className="text-4xl font-black mb-2">Quiz Terminé !</h2>
                                <p className="text-slate-400 mb-12">Voici votre score final pour le module {courseContent.title}.</p>

                                <div className="text-8xl font-black text-white mb-12 tabular-nums">
                                    {score} <span className="text-slate-700">/</span> {questions.length}
                                </div>

                                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                    <button
                                        onClick={resetQuiz}
                                        className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Recommencer
                                    </button>
                                    <button
                                        onClick={() => navigate('/student/dashboard')}
                                        className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all"
                                    >
                                        Terminer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseContent;
