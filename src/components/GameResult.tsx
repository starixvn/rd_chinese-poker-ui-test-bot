import { Box, Grid, Typography } from "@mui/material";
import { Slot } from "./Slot";
import { MatchData, MatchResult, SlotData, SlotResult } from "@/interfaces";

interface GameResultProps {
  matchData: MatchData;
  matchResult: MatchResult;
}

interface SlotResultProps {
  slotData: SlotData;
  slotResult: SlotResult;
}

export const SlotResultTag = (props: SlotResultProps) => {
  return (
    <Grid item xs={12}>
      <Slot
        name="Hand 1"
        cards={props.slotData.hand1}
        result={props.slotResult.hand1}
      />
      <Slot
        name="Hand 2"
        cards={props.slotData.hand2}
        result={props.slotResult.hand2}
      />
      <Slot
        name="Hand 3"
        cards={props.slotData.hand3}
        result={props.slotResult.hand3}
      />
    </Grid>
  );
};

export const GameResult = (props: GameResultProps) => {
  const getTotalSum = (sum: number): string => {
    return sum > 0 ? "+" + sum : sum.toString();
  };

  return (
    <Box>
      <Typography color="textPrimary" variant="h4" mb={5}>
        Game Result
      </Typography>{" "}
      <Grid container spacing={5}>
        <Grid item xs={0.5}>
          <Box>Player</Box>
          <Box mt={10}>{getTotalSum(props.matchResult.slot1.sum)}</Box>
        </Grid>
        <Grid item xs={5.5}>
          <SlotResultTag
            slotData={props.matchData.slot1}
            slotResult={props.matchResult.slot1}
          />
        </Grid>
        <Grid item xs={0.5}>
          <Box>Bot 1</Box>
          <Box mt={10}>{getTotalSum(props.matchResult.slot2.sum)}</Box>
        </Grid>
        <Grid item xs={5.5}>
          <SlotResultTag
            slotData={props.matchData.slot2}
            slotResult={props.matchResult.slot2}
          />
        </Grid>
        <Grid item xs={0.5}>
          <Box>Bot 2</Box>
          <Box mt={10}>{getTotalSum(props.matchResult.slot3.sum)}</Box>
        </Grid>
        <Grid item xs={5.5}>
          <SlotResultTag
            slotData={props.matchData.slot3}
            slotResult={props.matchResult.slot3}
          />
        </Grid>
        <Grid item xs={0.5}>
          <Box>Bot 3</Box>
          <Box mt={10}>{getTotalSum(props.matchResult.slot4.sum)}</Box>
        </Grid>
        <Grid item xs={5.5}>
          <SlotResultTag
            slotData={props.matchData.slot4}
            slotResult={props.matchResult.slot4}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
