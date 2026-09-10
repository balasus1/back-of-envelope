import { create } from 'zustand';
import { Inputs, defaultInputs, getDerivations } from './derivations';

type Scenario = 'Normal' | 'Flash Sale' | 'Black Friday' | 'Cyber Monday' | 'DDoS';

interface StoreState {
  inputs: Inputs;
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  updateInput: (key: keyof Inputs, value: number) => void;
  resetToDefault: () => void;
  derivations: ReturnType<typeof getDerivations>;
}

const scenarioOverrides: Record<Scenario, Partial<Inputs>> = {
  'Normal': { DAU_PCT: 20, PEAK_CONCURRENT_PCT: 20, SPIKE_MULTIPLIER: 1 },
  'Flash Sale': { DAU_PCT: 30, PEAK_CONCURRENT_PCT: 30, SPIKE_MULTIPLIER: 5 },
  'Black Friday': { DAU_PCT: 50, PEAK_CONCURRENT_PCT: 50, SPIKE_MULTIPLIER: 10 },
  'Cyber Monday': { DAU_PCT: 60, PEAK_CONCURRENT_PCT: 60, SPIKE_MULTIPLIER: 15 },
  'DDoS': { DAU_PCT: 20, PEAK_CONCURRENT_PCT: 100, SPIKE_MULTIPLIER: 100 },
};

export const useStore = create<StoreState>((set) => ({
  inputs: defaultInputs,
  scenario: 'Normal',
  derivations: getDerivations(defaultInputs),
  
  setScenario: (scenario) => set((state) => {
    const overrides = scenarioOverrides[scenario];
    const newInputs = { ...state.inputs, ...overrides };
    return {
      scenario,
      inputs: newInputs,
      derivations: getDerivations(newInputs),
    };
  }),

  updateInput: (key, value) => set((state) => {
    const newInputs = { ...state.inputs, [key]: value };
    return {
      inputs: newInputs,
      derivations: getDerivations(newInputs),
    };
  }),
  
  resetToDefault: () => set(() => ({
    inputs: defaultInputs,
    scenario: 'Normal',
    derivations: getDerivations(defaultInputs),
  })),
}));
