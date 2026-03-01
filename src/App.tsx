import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { GritData, OnboardingStep, TodoItem } from './types';
import OnboardingGoal from './components/OnboardingGoal';
import OnboardingDuration from './components/OnboardingDuration';
import OnboardingTodos from './components/OnboardingTodos';
import OnboardingDeadline from './components/OnboardingDeadline';
import OnboardingCharacter from './components/OnboardingCharacter';
import IntroScene from './components/IntroScene';
import MainScreen from './components/MainScreen';

const initialData: GritData = {
  goal: '',
  duration: '',
  customDate: '',
  todos: [],
  deadlineHour: '11:00',
  deadlinePeriod: 'PM',
  character: 'tiger',
};

export default function App() {
  const [step, setStep] = useState<OnboardingStep>('goal');
  const [data, setData] = useState<GritData>(initialData);

  return (
    <AnimatePresence mode="wait">
      {step === 'goal' && (
        <OnboardingGoal
          key="goal"
          onNext={(goal) => {
            setData((d) => ({ ...d, goal }));
            setStep('duration');
          }}
        />
      )}
      {step === 'duration' && (
        <OnboardingDuration
          key="duration"
          onNext={(duration, customDate) => {
            setData((d) => ({ ...d, duration, customDate }));
            setStep('todos');
          }}
        />
      )}
      {step === 'todos' && (
        <OnboardingTodos
          key="todos"
          onNext={(todos: TodoItem[]) => {
            setData((d) => ({ ...d, todos }));
            setStep('deadline');
          }}
        />
      )}
      {step === 'deadline' && (
        <OnboardingDeadline
          key="deadline"
          onNext={(deadlineHour, deadlinePeriod) => {
            setData((d) => ({ ...d, deadlineHour, deadlinePeriod }));
            setStep('character');
          }}
        />
      )}
      {step === 'character' && (
        <OnboardingCharacter
          key="character"
          onNext={(character) => {
            setData((d) => ({ ...d, character }));
            setStep('intro');
          }}
        />
      )}
      {step === 'intro' && (
        <IntroScene
          key="intro"
          character={data.character}
          goal={data.goal}
          onDone={() => setStep('main')}
        />
      )}
      {step === 'main' && (
        <MainScreen
          key="main"
          data={data}
        />
      )}
    </AnimatePresence>
  );
}
