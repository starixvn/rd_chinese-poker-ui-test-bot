import { useEffect, useMemo, useState } from "react";
import { ResultSlot, ResultSlotBack, StaticSlot } from "./Slot";
import { SlotData, SlotResult } from "@/interfaces";
import { showResult } from "@/helpers";

interface SlotResultProps {
  slotData: SlotData;
  slotResult: SlotResult;
}

const NATURAL: any = {
  three_flushes: "Three Flushes",
  three_straight: "Three Straight",
  six_pairs: "Six Pairs",
  three_straight_flushes: "Three Straight Flushes",
  dragon: "Dragon",
  super_dragon: "Super Dragon",
};

const DEFAULT_DELAY_TIME = 0;

export const SlotResultShow = (props: SlotResultProps) => {
  const [showSlot, setShowSlot] = useState(0);
  const getTotalSum = (sum: number): string => {
    return sum > 0 ? "+" + sum : sum.toString();
  };

  const bonus_win = useMemo(() => {
    let result: any = {};
    Object.keys(props.slotResult.bonus).forEach((key) => {
      let segment = key.split(".")[0];
      result[segment] = props.slotResult.bonus[key];
    });
    return result;
  }, [props.slotResult.bonus]);

  const natural = useMemo(() => {
    let result: any = {};
    let lose = 0;
    Object.keys(props.slotResult.natural).forEach((key) => {
      if (props.slotResult.natural[key] > 0) {
        result[NATURAL[key]] = props.slotResult.natural[key];
      } else {
        lose += props.slotResult.natural[key];
      }
    });
    return {
      win: result,
      lose: lose,
    };
  }, [props.slotResult.natural]);

  const superLose = useMemo(() => {
    let result = 0;
    Object.values(props.slotResult.superBonus).forEach((a) => {
      result += a;
    });
    return result;
  }, [props.slotResult.superBonus]);

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
          bonus={bonus_win["front"]}
        />
      ) : (
        <ResultSlotBack result={0} cards={[52, 52, 52]} />
      )}
      {showSlot > 1 ? (
        <ResultSlot
          cards={props.slotData.hand2}
          result={props.slotResult.hand2}
          bonus={bonus_win["middle"]}
        />
      ) : (
        <ResultSlotBack result={0} cards={[52, 52, 52, 52, 52]} />
      )}

      {showSlot > 0 ? (
        <ResultSlot
          cards={props.slotData.hand1}
          result={props.slotResult.hand1}
          bonus={bonus_win["back"]}
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
      <div className="special-case">
        {Object.keys(natural.win).map((key) => (
          <div className="natural" key={key}>
            {key} <br /> {showResult(natural.win[key])}
          </div>
        ))}
        {natural.lose != 0 ? (
          <div className="natural">
            Natural Lose <br /> {showResult(natural.lose)}
          </div>
        ) : (
          <></>
        )}
        {props.slotResult.break != 0 ? (
          <div className="break">
            Break <br /> {showResult(props.slotResult.break)}
          </div>
        ) : (
          <></>
        )}
        {superLose != 0 ? (
          <div className="super-lose">
            Pusoy <br /> {showResult(superLose)}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
