import { Hand } from "./Hand";

export interface SettleResult {
    royalty: Hand<{
        name: string;
        units: number;
    }>;
    crack: {
        isCrack: boolean;
        units: number;
    };
    natural: {
        name: string;
        units: number;
    };
    normal: Hand<number>;
    sum: number;
    pusoy: {
        mini: { [key: string]: number };
        full: number;
    };
}
