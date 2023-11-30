import { CardImageSources, CardImageKeys } from "../utils/CardImageSources";
import { Box, Grid, Button } from "@mui/material";
import Image from "next/image";

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
          <Box
            sx={{
              color:
                props.result && props.result < 0
                  ? "error.main"
                  : "success.main",
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
