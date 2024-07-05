import { useEffect, useMemo, useState } from "react";
import { ResultSlot, ResultSlotBack, StaticSlot } from "./Slot";
import { SlotData, SlotResult } from "@/interfaces";
import { showNatural, showResult } from "@/helpers";

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

    const royalty = useMemo(() => {
        return {
            front: props.slotResult.royalty.front.units,
            middle: props.slotResult.royalty.middle.units,
            back: props.slotResult.royalty.back.units,
        };
    }, [props.slotResult.royalty]);

    const natural = useMemo(() => {
        return props.slotResult.natural;
    }, [props.slotResult.natural]);

    const superLose = useMemo(() => {
        let result = 0;
        Object.values(props.slotResult.pusoy.mini).forEach((a) => {
            result += a;
        });
        return result;
    }, [props.slotResult.pusoy.mini]);

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
                    bonus={royalty["front"]}
                />
            ) : (
                <ResultSlotBack result={0} cards={[52, 52, 52]} />
            )}
            {showSlot > 1 ? (
                <ResultSlot
                    cards={props.slotData.hand2}
                    result={props.slotResult.hand2}
                    bonus={royalty["middle"]}
                />
            ) : (
                <ResultSlotBack result={0} cards={[52, 52, 52, 52, 52]} />
            )}

            {showSlot > 0 ? (
                <ResultSlot
                    cards={props.slotData.hand1}
                    result={props.slotResult.hand1}
                    bonus={royalty["back"]}
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
                {natural.units < 0 ? (
                    <div className="natural">
                        Natural Lose <br /> {showResult(natural.units)}
                    </div>
                ) : (
                    <></>
                )}
                {natural.units > 0 ? (
                    <div className="natural">
                        {showNatural[natural.name]} <br />{" "}
                        {showResult(natural.units)}
                    </div>
                ) : (
                    <></>
                )}
                {props.slotResult.crack.isCrack ? (
                    <div className="break">
                        Break <br /> {showResult(props.slotResult.crack.units)}
                    </div>
                ) : (
                    <></>
                )}
                {props.slotResult.crack.units > 0 ? (
                    <div className="break-win">
                        Break win <br />{" "}
                        {showResult(props.slotResult.crack.units)}
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
                {props.slotResult.pusoy.full > 0 ? (
                    <div className="full-pusoy">
                        Super Pusoy <br />{" "}
                        {showResult(props.slotResult.pusoy.full)}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};
