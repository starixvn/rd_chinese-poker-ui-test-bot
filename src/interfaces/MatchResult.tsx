export interface SlotResult {
  hand1: number;
  hand2: number;
  hand3: number;
  sum: number;
  is_break: boolean;
  has_natural: boolean;
}

export interface MatchResult {
  slot1: SlotResult;
  slot2: SlotResult;
  slot3: SlotResult;
  slot4: SlotResult;
}

export const initialMatchResult = {
  slot1: {} as SlotResult,
  slot2: {} as SlotResult,
  slot3: {} as SlotResult,
  slot4: {} as SlotResult,
} as MatchResult;
