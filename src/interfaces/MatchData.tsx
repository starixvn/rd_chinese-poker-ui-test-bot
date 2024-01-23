export interface SlotData {
  hash: number;
  hand1: number[];
  hand2: number[];
  hand3: number[];
}

export interface MatchData {
  host: string;
  matchId: string;
  slot1: SlotData;
  slot2: SlotData;
  slot3: SlotData;
  slot4: SlotData;
}

export const initialMatchData = {
  slot1: {} as SlotData,
  slot2: {} as SlotData,
  slot3: {} as SlotData,
  slot4: {} as SlotData,
} as MatchData;
