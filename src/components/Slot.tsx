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
    <Grid container spacing={2}>
      <Grid item xs={1.3} alignSelf={"center"}>
        <Box
          sx={{
            color: "green",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {slotHandType}
        </Box>
      </Grid>
      <Grid item xs={10.7}>
        {props.cards.map((card, index) => (
          <Draggable key={CardImageKeys[card]} draggableId={card.toString()} index={index}>
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
                  height={200}
                  width={140}
                  style={{
                    filter: snapshot.isDragging || props.dragOverId === card.toString() ? "brightness(50%)" : "",
                  }}
                />
              </Box>
            )}
          </Draggable>
        ))}
      </Grid>
    </Grid>
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
      <Grid item xs={11}>
        {props.cards.map((card, index) => (
          <Image key={CardImageKeys[card]} src={CardImageSources[card]} alt="card" height={100} width={70} />
        ))}
      </Grid>
    </Grid>
  );
};

export const StaticSlot = (props: SlotProps) => {
  return (
    <Grid container spacing={2} height={120}>
      <Grid item xs={12}>
        {props.cards.map((card, index) => (
          <Image key={`${CardImageKeys[card]}+${index}`} src={CardImageSources[card]} alt="card" height={100} width={70} />
        ))}
      </Grid>
    </Grid>
  );
};

export const StaticHand = (props: StaticHandProps) => {
  const frontHand = props.cards.slice(0, 3);
  const middleHand = props.cards.slice(3, 8);
  const backHand = props.cards.slice(8, 13);
  return (
    <Box>
      <StaticSlot name="" cards={frontHand} />
      <StaticSlot name="" cards={middleHand} />
      <StaticSlot name="" cards={backHand} />
    </Box>
  );
};

export const BackHand = () => {
  return (
    <Box>
      <StaticSlot name="" cards={[52, 52, 52]} />
      <StaticSlot name="" cards={[52, 52, 52, 52, 52]} />
      <StaticSlot name="" cards={[52, 52, 52, 52, 52]} />
    </Box>
  );
};
