export interface Instruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
}