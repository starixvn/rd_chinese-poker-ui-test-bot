import { SuggestData } from "@/interfaces/SuggestData";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { StaticSlot } from "./Slot";
import { useState } from "react";

interface SuggestPopupProps {
  openPopup: boolean;
  handleClosePopup: (item: number) => void;
  data: SuggestData[];
}
export const SuggestPopup = (props: SuggestPopupProps) => {
  const [selectedValue, setSelectedValue] = useState("0");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "size-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  const handleClose = () => {
    props.handleClosePopup(Number(selectedValue));
  };

  return (
    <Dialog open={props.openPopup} maxWidth={false}>
      <DialogContent dividers>
        {props.data.map((slot, index) => (
          <Box key={`suggest_${index}`} mb={2}>
            {index > 0 ? <Divider variant="middle" sx={{ marginBottom: 2, borderBottomWidth: 5 }} /> : null}
            <Radio {...controlProps(index.toString())} />
            <StaticSlot name="" cards={slot.segment_3} />
            <StaticSlot name="" cards={slot.segment_2} />
            <StaticSlot name="" cards={slot.segment_1} />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};
