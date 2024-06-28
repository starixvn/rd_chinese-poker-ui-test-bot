import { Hand } from "./Hand";

export interface SettleResult {
    royalty: Hand<{ [key: string]: number }>;
    crack: {
        isCrack: boolean;
        score: number;
    };
    natural: {
        [key: string]: number;
    };
    normal: Hand<number>;
    sum: number;
    pusoy: {
        partial: { [key: string]: number };
        full: number;
    };
}
