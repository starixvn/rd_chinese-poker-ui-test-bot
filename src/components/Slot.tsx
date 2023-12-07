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
                height={80}
                width={60}
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

  return (
    <Box>
      <Grid container spacing={2} height={120}>
        <Grid item xs={1} alignSelf={"center"}>
          <Box
            sx={{
              color: props.result < 0 ? "error.main" : "success.main",
              fontSize: 18,
              fontWeight: 600,
              marginLeft: 2,
            }}
          >
            {showResult(props.result)}
          </Box>
        </Grid>
        <div className={`card-slot card-slot-${props.cards.length}`}>
          {props.cards.map((card, index) => (
            <Image
              key={CardImageKeys[card]}
              src={CardImageSources[card]}
              alt="card"
              height={100}
              width={70}
              className={`card card-${index}`}
            />
          ))}
        </div>
      </Grid>
    </Box>
  );
};

export const BackSlot = (props: SlotProps) => {
  return (
    <div className={`card-slot card-slot-${props.cards.length}`}>
      {props.cards.map((card, index) => (
        <Image
          key={`${CardImageKeys[card]}+${index}`}
          src={CardImageSources[card]}
          alt="card"
          height={50}
          width={35}
          className={`card card-${index}`}
        />
      ))}
    </div>
  );
};

export const BackHand = () => {
  return (
    <div className="back-hand">
      <BackSlot name="" cards={[52, 52, 52]} />
      <BackSlot name="" cards={[52, 52, 52, 52, 52]} />
      <BackSlot name="" cards={[52, 52, 52, 52, 52]} />
    </div>
  );
};
