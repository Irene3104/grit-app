import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { GritData, OnboardingStep, TodoItem } from './types';
import SplashScreen from './components/SplashScreen';
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

  return (
    <AnimatePresence mode="wait">
      {step === 'splash' && (
        <SplashScreen key="splash" onDone={() => setStep('goal')} />
      )}
      {step === 'goal' && (
        <OnboardingGoal key="goal"
          onNext={(goal) => { setData((d) => ({ ...d, goal })); setStep('duration'); }}
        />
      )}
      {step === 'duration' && (
        <OnboardingDuration key="duration"
          onNext={(duration, customDate) => { setData((d) => ({ ...d, duration, customDate })); setStep('todos'); }}
          onBack={() => setStep('goal')}
        />
      )}
      {step === 'todos' && (
        <OnboardingTodos key="todos"
          onNext={(todos: TodoItem[]) => { setData((d) => ({ ...d, todos })); setStep('deadline'); }}
          onBack={() => setStep('duration')}
        />
      )}
      {step === 'deadline' && (
        <OnboardingDeadline key="deadline"
          onNext={(deadlineHour, deadlinePeriod) => { setData((d) => ({ ...d, deadlineHour, deadlinePeriod })); setStep('quest-start'); }}
          onBack={() => setStep('todos')}
        />
      )}
      {step === 'quest-start' && (
        <QuestStart key="quest-start" goal={data.goal} onDone={() => setStep('main')} />
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
