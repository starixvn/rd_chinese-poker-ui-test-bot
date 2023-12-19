import { useEffect, useState } from "react";
import { ResultSlot, ResultSlotBack, StaticSlot } from "./Slot";
import { SlotData, SlotResult } from "@/interfaces";

interface SlotResultProps {
  slotData: SlotData;
  slotResult: SlotResult;
}

const DEFAULT_DELAY_TIME = 0;

export const SlotResultShow = (props: SlotResultProps) => {
  const [showSlot, setShowSlot] = useState(0);
  const getTotalSum = (sum: number): string => {
    return sum > 0 ? "+" + sum : sum.toString();
  };

  useEffect(() => {
    if (showSlot < 4) {
      let delayTime = DEFAULT_DELAY_TIME;
      const item = localStorage.getItem("settings");
      if (item) {
        const settings = JSON.parse(item);
        if (settings.DelayTime >= 0) {
          delayTime = settings.DelayTime;
        }
      }
      setTimeout(() => {
        setShowSlot(showSlot + 1);
      }, delayTime);
    }
  }, [showSlot]);

  return (
    <div className="result-slot">
      {showSlot > 2 ? (
        <ResultSlot
          cards={props.slotData.hand3}
          result={props.slotResult.hand3}
        />
      ) : (
        <ResultSlotBack result={0} cards={[52, 52, 52]} />
      )}
      {showSlot > 1 ? (
        <ResultSlot
          cards={props.slotData.hand2}
          result={props.slotResult.hand2}
        />
      ) : (
        <ResultSlotBack result={0} cards={[52, 52, 52, 52, 52]} />
      )}

      {showSlot > 0 ? (
        <ResultSlot
          cards={props.slotData.hand1}
          result={props.slotResult.hand1}
        />
      ) : (
        <ResultSlotBack result={0} cards={[52, 52, 52, 52, 52]} />
      )}

      {showSlot > 3 ? (
        <div
          className={`result-sum ${
            props.slotResult.sum < 0 ? "result-red" : "result-green"
          }`}
        >
          Total: {getTotalSum(props.slotResult.sum)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
