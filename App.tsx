import React, { useState, useEffect } from 'react';
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

const AppContent: React.FC = () => {
    const { user, userProfile, activeGoal, activateGoal, loading } = useAuth();
    const [currentView, setCurrentView] = useState<View>('goal-detail');
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(MOCK_PLAN);
    // Mock initial state: empty array for new user, populated for existing
    // const [activeGoals, setActiveGoals] = useState<any[]>([]); // Removed as per instruction

    // Effect to handle auth state changes
    useEffect(() => {
        if (!loading) {
            if (user) {
                // If user is logged in and currently on public pages, redirect to dashboard
                // if (['landing', 'auth', 'pricing'].includes(currentView)) {
                //     setCurrentView('dashboard');
                // }
            } else {
                // If user is logged out and on private pages, redirect to landing
                // if (!['landing', 'auth', 'pricing'].includes(currentView)) {
                //     setCurrentView('landing');
                // }
            }
        }
    }, [user, loading]); // Remove currentView from dependency to avoid loops

    // Navigation Handlers
    const handleNavigate = (view: View) => {
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    // handleLoginSuccess removed as per instruction

    const handlePlanGenerated = (plan: Plan) => {
        setCurrentPlan(plan);
        // Add a dummy goal to activeGoals to simulate goal creation // Removed as per instruction
        // setActiveGoals(prev => [...prev, { // Removed as per instruction
        //     id: Date.now(), // Removed as per instruction
        //     title: plan.goalTitle, // Removed as per instruction
        //     progress: 0, // Removed as per instruction
        //     nextTask: "Initialize Plan", // Removed as per instruction
        //     due: "TBD" // Removed as per instruction
        // }]); // Removed as per instruction
        setCurrentView('goal-detail');
    };

    const handleActivatePlan = async () => {
        if (currentPlan) {
            await activateGoal(currentPlan);
            handleNavigate('dashboard');
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

            {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}

            {currentView === 'auth' && <Auth onNavigate={handleNavigate} />}

            {currentView === 'pricing' && <Pricing onNavigate={handleNavigate} />}

            {currentView === 'dashboard' && (
                activeGoal === null ? ( // Changed from activeGoals.length === 0
                    <CreateGoal onNavigate={handleNavigate} />
                ) : (
                    <Dashboard onNavigate={handleNavigate} activeGoals={activeGoal ? [activeGoal] : []} />
                )
            )}

            {currentView === 'goal-detail' && currentPlan && (
                <GoalDetail plan={currentPlan} onNavigate={handleNavigate} onActivate={handleActivatePlan} />
            )}

            {/* Fallback if detail is accessed without state */}
            {currentView === 'goal-detail' && !currentPlan && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-zinc-500 mb-4">No active plan loaded.</p>
                        <button onClick={() => handleNavigate('dashboard')} className="text-[#5100fd]">Return to Dashboard</button>
                    </div>
                </div>
            )}
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
