import { ResultSlot } from "./Slot";
import { SlotData, SlotResult } from "@/interfaces";

interface SlotResultProps {
  slotData: SlotData;
  slotResult: SlotResult;
}

export const SlotResultShow = (props: SlotResultProps) => {
  const getTotalSum = (sum: number): string => {
    return sum > 0 ? "+" + sum : sum.toString();
  };

  return (
    <div className="result-slot">
      <ResultSlot
        cards={props.slotData.hand3}
        result={props.slotResult.hand3}
      />
      <ResultSlot
        cards={props.slotData.hand2}
        result={props.slotResult.hand2}
      />
      <ResultSlot
        cards={props.slotData.hand1}
        result={props.slotResult.hand1}
      />
      <div
        className={`result-sum ${
          props.slotResult.sum < 0 ? "result-red" : "result-green"
        }`}
      >
        Total: {getTotalSum(props.slotResult.sum)}
      </div>
    </div>
  );
};
