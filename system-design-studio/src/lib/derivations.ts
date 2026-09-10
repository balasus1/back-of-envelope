export interface Inputs {
  // Block A - User Metrics
  MAU: number;
  DAU_PCT: number;
  PEAK_CONCURRENT_PCT: number;
  ACTIONS_PER_SESSION: number;
  PEAK_DURATION_SEC: number;
  SAFETY_BUFFER: number;
  
  // Scenario specifics
  SPIKE_MULTIPLIER: number;
}

export const defaultInputs: Inputs = {
  MAU: 10000000,
  DAU_PCT: 20,
  PEAK_CONCURRENT_PCT: 20,
  ACTIONS_PER_SESSION: 30,
  PEAK_DURATION_SEC: 3600,
  SAFETY_BUFFER: 2,
  SPIKE_MULTIPLIER: 1,
};

export interface MetricResult {
  value: number;
  unit: string;
  formulaText: string;
  humanExplanation: string;
  dependsOn: string[];
}

export function calculateDAU(inputs: Inputs): MetricResult {
  const value = inputs.MAU * (inputs.DAU_PCT / 100);
  return {
    value,
    unit: 'users',
    formulaText: 'DAU = MAU × (DAU_PCT / 100)',
    humanExplanation: 'Daily Active Users is the percentage of monthly users active on a given day.',
    dependsOn: ['MAU', 'DAU_PCT']
  };
}

export function calculatePCU(inputs: Inputs, dau: number): MetricResult {
  const value = dau * (inputs.PEAK_CONCURRENT_PCT / 100);
  return {
    value,
    unit: 'users',
    formulaText: 'PCU = DAU × (PEAK_CONCURRENT_PCT / 100)',
    humanExplanation: 'Peak Concurrent Users represents the maximum number of users online at the same time.',
    dependsOn: ['DAU', 'PEAK_CONCURRENT_PCT']
  };
}

export function calculateRawRPS(inputs: Inputs, pcu: number): MetricResult {
  const value = (pcu * inputs.ACTIONS_PER_SESSION) / inputs.PEAK_DURATION_SEC;
  return {
    value,
    unit: 'req/sec',
    formulaText: 'Raw_RPS = (PCU × ACTIONS_PER_SESSION) / PEAK_DURATION_SEC',
    humanExplanation: 'Baseline Requests Per Second during peak hour without safety buffer.',
    dependsOn: ['PCU', 'ACTIONS_PER_SESSION', 'PEAK_DURATION_SEC']
  };
}

export function calculatePeakRPS(inputs: Inputs, rawRps: number): MetricResult {
  const value = rawRps * inputs.SAFETY_BUFFER * inputs.SPIKE_MULTIPLIER;
  return {
    value,
    unit: 'req/sec',
    formulaText: 'Peak_RPS = Raw_RPS × SAFETY_BUFFER × SPIKE_MULTIPLIER',
    humanExplanation: 'The maximum expected RPS including safety buffer and event multipliers (e.g. Flash Sale).',
    dependsOn: ['Raw_RPS', 'SAFETY_BUFFER', 'SPIKE_MULTIPLIER']
  };
}

export function getDerivations(inputs: Inputs) {
  const dau = calculateDAU(inputs);
  const pcu = calculatePCU(inputs, dau.value);
  const rawRps = calculateRawRPS(inputs, pcu.value);
  const peakRps = calculatePeakRPS(inputs, rawRps.value);

  return {
    dau,
    pcu,
    rawRps,
    peakRps,
  };
}
