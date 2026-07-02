export type ActionOptionType = "DRIVE_NOW" | "WAIT" | "STAND_DOWN";

export type ActionOption = {
  type: ActionOptionType;
  label: string;
  expectedNet: number;
  confidence: number;
  rationale: string[];
};

export type ActionOptionSet = {
  recommended: ActionOption;
  options: ActionOption[];
};
