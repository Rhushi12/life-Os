import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import GoalIntake from './components/GoalIntake';
import GoalDetail from './components/GoalDetail';
import Auth from './components/Auth';
import Pricing from './components/Pricing';
import Feedback from './components/Feedback';
import Strategy from './components/Strategy';
import Planner from './components/Planner';
import Settings from './components/Settings';
import CreateGoal from './components/CreateGoal';
import OnboardingModal from './components/OnboardingModal';
import { View, Plan } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MOCK_PLAN } from './mockData';

const AppRoutes: React.FC = () => {
    const { user, userProfile, activeGoal, activateGoal, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(MOCK_PLAN);

    // Navigation Handler Adapter for existing components
    const handleNavigate = (view: View) => {
        switch (view) {
            case 'landing': navigate('/'); break;
            case 'auth': navigate('/auth'); break;
            case 'pricing': navigate('/pricing'); break;
            case 'dashboard': navigate('/dashboard'); break;
            case 'goal-intake': navigate('/goal-intake'); break;
            case 'goal-detail': navigate('/goal-detail'); break;
            default: navigate('/');
        }
        window.scrollTo(0, 0);
    };

    // Effect to handle auth state changes and redirects
    useEffect(() => {
        if (!loading) {
            const publicPaths = ['/', '/auth', '/pricing'];
            const isPublic = publicPaths.includes(location.pathname);

            if (user) {
                // If user is logged in and currently on public pages, redirect to dashboard
                if (isPublic) {
                    navigate('/dashboard');
                }
            } else {
                // If user is logged out and on private pages, redirect to landing
                if (!isPublic) {
                    navigate('/');
                }
            }
        }
    }, [user, loading, location.pathname, navigate]);

    const handlePlanGenerated = (plan: Plan) => {
        setCurrentPlan(plan);
        navigate('/goal-detail');
    };

    const handleActivatePlan = async () => {
        if (currentPlan) {
            await activateGoal(currentPlan);
            navigate('/dashboard');
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <>
            {/* Onboarding Modal */}
            {user && userProfile && !userProfile.onboardingCompleted && (
                <OnboardingModal />
            )}

            <Routes>
                <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
                <Route path="/auth" element={<Auth onNavigate={handleNavigate} />} />
                <Route path="/pricing" element={<Pricing onNavigate={handleNavigate} />} />

                <Route path="/dashboard" element={
                    activeGoal === null ? (
                        <CreateGoal onNavigate={handleNavigate} />
                    ) : (
                        <Dashboard onNavigate={handleNavigate} activeGoals={activeGoal ? [activeGoal] : []} />
                    )
                } />

                <Route path="/goal-intake" element={
                    <GoalIntake onNavigate={handleNavigate} onPlanGenerated={handlePlanGenerated} />
                } />

                <Route path="/goal-detail" element={
                    currentPlan ? (
                        <GoalDetail plan={currentPlan} onNavigate={handleNavigate} onActivate={handleActivatePlan} />
                    ) : (
                        <Navigate to="/dashboard" />
                    )
                } />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
