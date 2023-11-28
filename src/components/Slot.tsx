import { CardImageSources, CardImageKeys } from "../utils/CardImageSources";
import { Box, Grid, Button } from "@mui/material";
import Image from "next/image";

interface SlotProps {
  name: string;
  cards: number[];
  handleOnClickCard?: (slot: string, card: number) => void;
  handleOnClickSlot?: (slot: string) => void;
  active?: boolean;
}

export const Slot = (props: SlotProps) => {
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

  return (
    <Box>
      <Grid container spacing={2} height={120}>
        <Grid item xs={1}>
          <Button
            color={props.active ? "secondary" : "primary"}
            onClick={() => handleOnClickSlot(props.name)}
          >
            {props.name}
          </Button>
        </Grid>
        <Grid item xs={11}>
          {props.cards.map((card, index) => (
            <Image
              key={CardImageKeys[card]}
              src={CardImageSources[card]}
              alt="card"
              height={100}
              onClick={() => handleOnClickCard(props.name, card)}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};
