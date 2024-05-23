export const showResult = (num?: number): string => {
  if (num === 0) {
    return "0";
  }
  if (num) {
    return num > 0 ? "+" + num : num.toString();
  }
  return "";
};
