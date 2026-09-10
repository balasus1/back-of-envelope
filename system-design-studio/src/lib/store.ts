import { create } from 'zustand';
import { Inputs, defaultInputs, getDerivations, Derivations } from './derivations';

export type Scenario = 'Normal' | 'Flash Sale' | 'Black Friday' | 'Cyber Monday' | 'DDoS';

export interface ScenarioOverride {
  DAU_PCT: number;
  PEAK_CONCURRENT_PCT: number;
  Spike_Multiplier: number;
}

export const scenarioTable: Record<Scenario, ScenarioOverride> = {
  'Normal': { DAU_PCT: 20, PEAK_CONCURRENT_PCT: 20, Spike_Multiplier: 1 },
  'Flash Sale': { DAU_PCT: 30, PEAK_CONCURRENT_PCT: 30, Spike_Multiplier: 5 },
  'Black Friday': { DAU_PCT: 50, PEAK_CONCURRENT_PCT: 50, Spike_Multiplier: 10 },
  'Cyber Monday': { DAU_PCT: 60, PEAK_CONCURRENT_PCT: 60, Spike_Multiplier: 15 },
  'DDoS': { DAU_PCT: 20, PEAK_CONCURRENT_PCT: 100, Spike_Multiplier: 100 },
};

interface StoreState {
  inputs: Inputs;
  scenario: Scenario;
  derivations: Derivations;
  highlightedDependencies: string[];
  commandPaletteOpen: boolean;
  mobileSidebarOpen: boolean;
  setScenario: (scenario: Scenario) => void;
  updateInput: (key: keyof Inputs, value: number) => void;
  resetToDefault: () => void;
  setHighlightedDependencies: (keys: string[]) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  getDerivationsForScenario: (scenario: Scenario) => Derivations;
}

export const useStore = create<StoreState>((set, get) => ({
  inputs: defaultInputs,
  scenario: 'Normal',
  derivations: getDerivations(defaultInputs),
  highlightedDependencies: [],
  commandPaletteOpen: false,
  mobileSidebarOpen: false,

  setScenario: (scenario) =>
    set((state) => {
      const overrides = scenarioTable[scenario];
      const newInputs = { ...state.inputs, ...overrides };
      return {
        scenario,
        inputs: newInputs,
        derivations: getDerivations(newInputs),
      };
    }),

  updateInput: (key, value) =>
    set((state) => {
      const newInputs = { ...state.inputs, [key]: value };
      return {
        inputs: newInputs,
        derivations: getDerivations(newInputs),
      };
    }),

  resetToDefault: () =>
    set(() => ({
      inputs: defaultInputs,
      scenario: 'Normal',
      derivations: getDerivations(defaultInputs),
      highlightedDependencies: [],
    })),

  setHighlightedDependencies: (keys) =>
    set(() => ({
      highlightedDependencies: keys,
    })),

  setCommandPaletteOpen: (open) =>
    set(() => ({
      commandPaletteOpen: open,
    })),

  setMobileSidebarOpen: (open) =>
    set(() => ({
      mobileSidebarOpen: open,
    })),

  getDerivationsForScenario: (scen) => {
    const state = get();
    const overrides = scenarioTable[scen];
    const scenInputs = { ...state.inputs, ...overrides };
    return getDerivations(scenInputs);
  },
}));
