import { CardImageSources, CardImageKeys } from "../utils/CardImageSources";
import { Box, Grid, Button } from "@mui/material";
import Image from "next/image";
import { Draggable } from "@/utils/react-beautiful-dnd";

interface SlotProps {
  name: string;
  cards: number[];
  handleOnClickCard?: (slot: string, card: number) => void;
  handleOnClickSlot?: (slot: string) => void;
  active?: boolean;
  result?: number;
}

export const Slot = (props: SlotProps) => {
  const showResult = (num?: number): string => {
    if (num) {
      return num > 0 ? "+" + num : num.toString();
    }
    return "";
  };

  const handleOnClickCard = (slot: string, card: number) => {
    if (props.handleOnClickCard) {
      props.handleOnClickCard(slot, card);
    }
  };

  const handleOnClickSlot = (slot: string) => {
    if (props.handleOnClickSlot) {
      props.handleOnClickSlot(slot);
    }
  };

  return props.result ? (
    <Box>
      <Grid container spacing={2} height={120}>
        <Grid item xs={1.5}>
          <Button
            style={{
              minHeight: "0px",
            }}
            fullWidth
            disabled={props.name === "Player Cards"}
            variant={"text"}
            color={props.active ? "secondary" : "primary"}
            onClick={() => handleOnClickSlot(props.name)}
          >
            {props.name}
          </Button>
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
        <Grid item xs={10.5}>
          {props.cards.map((card, index) => (
            <Image
              key={CardImageKeys[card]}
              src={CardImageSources[card]}
              alt="card"
              height={100}
              width={70}
              onClick={() => handleOnClickCard(props.name, card)}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box>
      <Grid container spacing={2} height={120}>
        <Grid item xs={1}>
          <Button
            style={{
              minHeight: "100px",
            }}
            fullWidth
            disabled={props.name === "Player Cards"}
            variant={"contained"}
            color={props.active ? "secondary" : "primary"}
            onClick={() => handleOnClickSlot(props.name)}
          >
            {props.name}
          </Button>
        </Grid>
        <Grid item xs={11}>
          {props.cards.map((card, index) => (
            <Draggable key={CardImageKeys[card]} draggableId={card.toString()} index={index}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} display="inline-flex">
                  <Image src={CardImageSources[card]} alt="card" height={100} width={70} onClick={() => handleOnClickCard(props.name, card)} />
                </Box>
              )}
            </Draggable>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};
