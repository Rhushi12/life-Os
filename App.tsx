
import React, { useState } from 'react';
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
import { View, Plan } from './types';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('landing');
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

    // Navigation Handlers
    const handleNavigate = (view: View) => {
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    const handleLoginSuccess = () => {
        handleNavigate('dashboard');
    };

    const handlePlanGenerated = (plan: Plan) => {
        setCurrentPlan(plan);
        handleNavigate('goal-detail');
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-black text-white">
            
            {currentView === 'landing' && (
                <LandingPage onNavigate={handleNavigate} />
            )}

            {currentView === 'auth' && (
                <Auth onLogin={handleLoginSuccess} />
            )}

            {currentView === 'pricing' && (
                <Pricing onNavigate={handleNavigate} />
            )}
            
            {currentView === 'dashboard' && (
                <Dashboard onNavigate={handleNavigate} />
            )}

            {currentView === 'feedback' && (
                <Feedback onNavigate={handleNavigate} />
            )}

            {currentView === 'strategy' && (
                <Strategy onNavigate={handleNavigate} />
            )}

            {currentView === 'planner' && (
                <Planner onNavigate={handleNavigate} plan={currentPlan} />
            )}

            {currentView === 'settings' && (
                <Settings onNavigate={handleNavigate} />
            )}

            {currentView === 'goal-intake' && (
                <GoalIntake onNavigate={handleNavigate} onPlanGenerated={handlePlanGenerated} />
            )}

            {currentView === 'goal-detail' && currentPlan && (
                <GoalDetail plan={currentPlan} onNavigate={handleNavigate} />
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
        </div>
    );
};

export default App;
