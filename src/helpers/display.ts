import { segmentTypeMap } from "./cards";

export const showResult = (num?: number): string => {
    if (num === 0) {
        return "0";
    }
    if (num) {
        return num > 0 ? "+" + num : num.toString();
    }
    return "";
};

export const showNatural: Record<string, string> = {
    three_flushes: "Three Flushes",
    six_pairs: "Six Pairs",
    dragon: "Dragon",
};
