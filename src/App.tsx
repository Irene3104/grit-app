import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { GritData, OnboardingStep, TodoItem, AuthUser } from './types';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import OnboardingGoal from './components/OnboardingGoal';
import OnboardingDuration from './components/OnboardingDuration';
import OnboardingTodos from './components/OnboardingTodos';
import OnboardingDeadline from './components/OnboardingDeadline';
import QuestStart from './components/QuestStart';
import MainScreen from './components/MainScreen';

const initialData: GritData = {
  goal: '', duration: '', customDate: '', todos: [],
  deadlineHour: '11:00', deadlinePeriod: 'PM', character: 'cat',
};

export default function App() {
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [data, setData] = useState<GritData>(initialData);
  const [_user, setUser] = useState<AuthUser | null>(null);

  const resetAll = () => {
    localStorage.removeItem('grit_session_start');
    setData(initialData);
    setStep('goal');
  };

  const goToTodos = () => {
    localStorage.removeItem('grit_session_start');
    setData((d) => ({ ...d, todos: [] }));
    setStep('todos');
  };

  const handleLogin = (authUser: AuthUser) => {
    setUser(authUser);
    // 기존 데이터 있으면 main으로, 없으면 온보딩으로
    const hasOnboarded = localStorage.getItem('questify_onboarded');
    setStep(hasOnboarded ? 'main' : 'goal');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'splash' && (
        <SplashScreen key="splash" onDone={() => setStep('login')} />
      )}
      {step === 'login' && (
        <LoginScreen key="login" onLogin={handleLogin} />
      )}
      {step === 'goal' && (
        <OnboardingGoal key="goal"
          initialValue={data.goal}
          onNext={(goal) => { setData((d) => ({ ...d, goal })); setStep('duration'); }}
        />
      )}
      {step === 'duration' && (
        <OnboardingDuration key="duration"
          initialDuration={data.duration}
          initialCustomDate={data.customDate}
          onNext={(duration, customDate) => { setData((d) => ({ ...d, duration, customDate })); setStep('todos'); }}
          onBack={() => setStep('goal')}
        />
      )}
      {step === 'todos' && (
        <OnboardingTodos key="todos"
          initialTodos={data.todos}
          onNext={(todos: TodoItem[]) => { setData((d) => ({ ...d, todos })); setStep('deadline'); }}
          onBack={() => setStep('duration')}
        />
      )}
      {step === 'deadline' && (
        <OnboardingDeadline key="deadline"
          initialHour={data.deadlineHour}
          initialPeriod={data.deadlinePeriod}
          onNext={(deadlineHour, deadlinePeriod) => { setData((d) => ({ ...d, deadlineHour, deadlinePeriod })); setStep('quest-start'); }}
          onBack={() => setStep('todos')}
        />
      )}
      {step === 'quest-start' && (
        <QuestStart key="quest-start" goal={data.goal} onDone={() => {
          localStorage.setItem('questify_onboarded', '1');
          setStep('main');
        }} />
      )}
      {step === 'main' && (
        <MainScreen key="main" data={data}
          onNewTodos={goToTodos}
          onNewGoal={resetAll}
        />
      )}
    </AnimatePresence>
  );
}
