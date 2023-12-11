import { CardImageSources, CardImageKeys } from "../utils/CardImageSources";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import { Draggable } from "@/utils/react-beautiful-dnd";
import { TypeChecker } from "@/utils/TypeChecker";

interface SlotProps {
  name: string;
  cards: number[];
  dragOverId?: string | null;
}

interface ResultSlotProps {
  cards: number[];
  result: number;
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
              <Image
                src={CardImageSources[card]}
                alt="card"
                height={150}
                width={100}
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
    if (num) {
      return num > 0 ? "+" + num : num.toString();
    }
    return "";
  };
  const slotTypeChecker = new TypeChecker([...props.cards]);
  const slotHandType = slotTypeChecker.getType();

  return (
    <div className="result-item">
      <div
        className={`result-count ${
          props.result < 0 ? "result-red" : "result-green"
        }`}
      >
        {showResult(props.result)}
      </div>
      <span className="result-hand-type">{slotHandType}</span>

      <div className={`card-slot card-slot-${props.cards.length}`}>
        {props.cards.map((card, index) => (
          <img
            key={CardImageKeys[card]}
            src={CardImageSources[card]}
            alt="card"
            className={`card card-${index}`}
          />
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
  return (
    <div className="static-hand">
      <StaticSlot name="" cards={frontHand} />
      <StaticSlot name="" cards={middleHand} />
      <StaticSlot name="" cards={backHand} />
    </div>
  );
};

export const BackHand = () => {
  return (
    <div className="back-hand">
      <StaticSlot name="" cards={[52, 52, 52]} />
      <StaticSlot name="" cards={[52, 52, 52, 52, 52]} />
      <StaticSlot name="" cards={[52, 52, 52, 52, 52]} />
    </div>
  );
};
