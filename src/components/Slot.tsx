import { CardImageSources, CardImageKeys } from "../utils/CardImageSources";
import { Box, Grid } from "@mui/material";
import Image from "next/image";

interface SlotProps {
  name: string;
  cards: number[];
}

interface ResultSlotProps {
  cards: number[];
  result: number;
}

export const Slot = (props: SlotProps) => {
  return (
    <Box>
      <Grid container spacing={2} height={120}>
        <Grid item xs={12}>
          {props.cards.map((card, index) => (
            <Image key={CardImageKeys[card]} src={CardImageSources[card]} alt="card" height={100} width={70} />
          ))}
        </Grid>
      </Grid>
    </Box>
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
        <Grid item xs={1}>
          <Box
            sx={{
              color: props.result < 0 ? "error.main" : "success.main",
              fontSize: 18,
              fontWeight: 600,
              marginLeft: 2,
              marginTop: 5,
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
    </Box>
  );
};

export const BackSlot = (props: SlotProps) => {
  return (
    <Box>
      <Grid container spacing={2} height={120}>
        <Grid item xs={12}>
          {props.cards.map((card, index) => (
            <Image key={CardImageKeys[card]} src={CardImageSources[card]} alt="card" height={100} width={70} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export const BackHand = () => {
  return (
    <Box>
      <BackSlot name="" cards={[52, 52, 52]} />
      <BackSlot name="" cards={[52, 52, 52, 52, 52]} />
      <BackSlot name="" cards={[52, 52, 52, 52, 52]} />
    </Box>
  );
};
