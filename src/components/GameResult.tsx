import { Box, Grid } from "@mui/material";
import { ResultSlot } from "./Slot";
import { SlotData, SlotResult } from "@/interfaces";

interface SlotResultProps {
  slotData: SlotData;
  slotResult: SlotResult;
}

export const SlotResultShow = (props: SlotResultProps) => {
  const getTotalSum = (sum: number): string => {
    return sum > 0 ? "+" + sum : sum.toString();
  };

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid item xs={1} alignSelf={"center"}>
          <Box
            sx={{
              color: props.slotResult.sum < 0 ? "error.main" : "success.main",
              fontSize: 25,
              fontWeight: 500,
            }}
          >
            {getTotalSum(props.slotResult.sum)}
          </Box>
        </Grid>
        <Grid item xs={11}>
          <ResultSlot cards={props.slotData.hand3} result={props.slotResult.hand3} />
          <ResultSlot cards={props.slotData.hand2} result={props.slotResult.hand2} />
          <ResultSlot cards={props.slotData.hand1} result={props.slotResult.hand1} />
        </Grid>
      </Grid>
    </Box>
  );
};
