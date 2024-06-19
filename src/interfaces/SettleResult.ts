export interface SettleResult {
    royalty_score: {
        [key: string]: number;
    };
    crack_score: number;
    natural_score: {
        [key: string]: number;
    };
    normal_score: {
        back: number;
        front: number;
        middle: number;
    };
    sum_score: number;
    pusoy_score: {
        [key: number]: number;
    };
    full_pusoy_score: number;
}

export interface SettleResultMap {
    [key: string]: SettleResult;
}
