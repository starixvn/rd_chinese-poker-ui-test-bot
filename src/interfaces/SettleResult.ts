export interface SettleResult {
  bonus_win_score: {
    [key: string]: number;
  };
  break_score: number;
  natural_score: {
    [key: string]: number;
  };
  normal_score: {
    back: number;
    front: number;
    middle: number;
  };
  sum_score: number;
  super_bonus_win: {
    [key: number]: number;
  };
}

export interface SettleResultMap {
  [key: string]: SettleResult;
}
