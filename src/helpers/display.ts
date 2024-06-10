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

export const showSpecialCase = (raw: string): string => {
    const items = raw.split(".");
    const segmentRaw = items?.[1];
    const type = Number.parseInt(items?.[0] || "0");

    const segmentNameMap: Record<string, string> = {
        middle: "in the middle",
        back: "in the back",
        front: "in the front",
    };

    return `${segmentTypeMap[type]} ${segmentNameMap[segmentRaw]}`;
};
