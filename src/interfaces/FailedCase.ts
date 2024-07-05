import { Hand } from "./Hand";
import { SettleResult } from "./SettleResult";

export interface FailedCase {
    matchId: string;
    arrangements: Hand<number[]>[];
    settleResult: SettleResult[];
}
