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
    <Dialog open={props.openPopup} maxWidth={"lg"} fullWidth>
      <DialogContent>
        <div className="suggest-block">
          {props.data.map((slot, index) => (
            <div key={`suggest_${index}`} className="suggest-slot">
              <Radio {...controlProps(index.toString())} />
              <StaticSlot name="" cards={slot.segment_3} />
              <StaticSlot name="" cards={slot.segment_2} />
              <StaticSlot name="" cards={slot.segment_1} />
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="info" onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
