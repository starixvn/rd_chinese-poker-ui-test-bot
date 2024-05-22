import { CardImageSources, CardImageKeys } from "../utils/CardImageSources";
import { Box, Grid } from "@mui/material";
import { Draggable } from "@/utils/react-beautiful-dnd";
import { TypeChecker } from "@/utils/TypeChecker";
import { useEffect } from "react";

interface SlotProps {
  name?: string;
  cards: number[];
  dragOverId?: string | null;
}

interface ResultSlotProps {
  cards: number[];
  result: number;
  bonus?: number;
}

interface StaticHandProps {
  cards: number[];
}

export const Slot = (props: SlotProps) => {
  const slotTypeChecker = new TypeChecker([...props.cards]);
  const slotHandType = slotTypeChecker.getType();
  return (
    <div className="slot">
      <div className="result">{slotHandType}</div>

      {props.cards.map((card, index) => (
        <Draggable
          key={CardImageKeys[card]}
          draggableId={card.toString()}
          index={index}
        >
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              display="inline-flex"
              borderColor="primary.main"
            >
              <img
                src={CardImageSources[card]}
                alt="card"
                className="card-arrange"
                style={{
                  filter:
                    snapshot.isDragging || props.dragOverId === card.toString()
                      ? "brightness(50%)"
                      : "",
                }}
              />
            </Box>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export const ResultSlot = (props: ResultSlotProps) => {
  const showResult = (num?: number): string => {
    if (num === 0) {
      return "0";
    }
    if (num) {
      return num > 0 ? "+" + num : num.toString();
    }
    return "";
  };
  const slotTypeChecker = new TypeChecker([...props.cards]);
  const slotHandType = slotTypeChecker.getType();

  return (
    <div className="result-item">
      <div className="result-hand-type">
        <span className={(props?.bonus ?? 0) > 0 ? "highlight" : ""}>
          {slotHandType}
        </span>
        <span
          className={`result-count ${
            props.result < 0 ? "result-red" : "result-green"
          }`}
        >
          {showResult(props.result)}
        </span>
      </div>

      <div className={`card-slot card-slot-${props.cards.length}`}>
        {props.cards.map((card, index) => (
          <div
            key={CardImageKeys[card]}
            className={`card card-${index}`}
            style={{ display: "inline-flex" }}
          >
            <img
              src={CardImageSources[card]}
              alt="card"
              style={{
                width: "100%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const StaticSlot = (props: SlotProps) => {
  return (
    <div className={`card-slot card-slot-${props.cards.length}`}>
      {props.cards.map((card, index) => (
        <img
          key={`${CardImageKeys[card]}+${index}`}
          src={CardImageSources[card]}
          alt="card"
          className={`card card-${index}`}
        />
      ))}
    </div>
  );
};

export const StaticHand = (props: StaticHandProps) => {
  const frontHand = props.cards.slice(0, 3);
  const middleHand = props.cards.slice(3, 8);
  const backHand = props.cards.slice(8, 13);

  const frontHandType = new TypeChecker([...frontHand]).getType();
  const middleHandType = new TypeChecker([...middleHand]).getType();
  const backHandType = new TypeChecker([...backHand]).getType();
  return (
    <div className="static-hand-block">
      <div className="static-hand">
        <span className="hand-type">{frontHandType}</span>
        <StaticSlot cards={frontHand} />
      </div>
      <div className="static-hand">
        <span className="hand-type">{middleHandType}</span>
        <StaticSlot cards={middleHand} />
      </div>
      <div className="static-hand">
        <span className="hand-type">{backHandType}</span>
        <StaticSlot cards={backHand} />
      </div>
    </div>
  );
};

export const BackHand = () => {
  return (
    <div className="back-hand">
      <StaticSlot cards={[52, 52, 52]} />
      <StaticSlot cards={[52, 52, 52, 52, 52]} />
      <StaticSlot cards={[52, 52, 52, 52, 52]} />
    </div>
  );
};

export const SuggestSlot = (props: SlotProps) => {
  const slotTypeChecker = new TypeChecker([...props.cards]);
  const slotHandType = slotTypeChecker.getType();
  const cards = props.cards.sort((n1, n2) => n2 - n1);

  return (
    <div className="suggest-item">
      <div className="hand-type">{slotHandType}</div>

      <div className={`card-slot card-slot-${cards.length}`}>
        {cards.map((card, index) => (
          <img
            key={`${CardImageKeys[card]}+${index}`}
            src={CardImageSources[card]}
            alt="card"
            className={`card card-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export const ResultSlotBack = (props: ResultSlotProps) => {
  return (
    <div className="result-item">
      <div className="result-hand-type">
        <span
          className={`result-count ${
            props.result < 0 ? "result-red" : "result-green"
          }`}
        ></span>
      </div>

      <div className={`card-slot card-slot-${props.cards.length}`}>
        {props.cards.map((card, index) => (
          <img
            key={`${CardImageKeys[card]}_${index}`}
            src={CardImageSources[card]}
            alt="card"
            className={`card card-${index}`}
          />
        ))}
      </div>
    </div>
  );
};
