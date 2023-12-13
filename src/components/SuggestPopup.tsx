import { SuggestData } from "@/interfaces/SuggestData";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Radio,
} from "@mui/material";
import { StaticSlot, StaticHand, SuggestSlot } from "./Slot";
import { useState } from "react";
import { TypeChecker } from "@/utils/TypeChecker";

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
    <Dialog
      open={props.openPopup}
      maxWidth={"lg"}
      fullWidth
      className="suggest-popup"
    >
      <DialogContent>
        <div className="suggest-block">
          {props.data.map((slot, index) => (
            <div key={`suggest_${index}`} className="suggest-slot">
              <Radio {...controlProps(index.toString())} />
              <div className="suggest-card">
                <SuggestSlot cards={slot.segment_3} />
                <SuggestSlot cards={slot.segment_2} />
                <SuggestSlot cards={slot.segment_1} />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions className="suggest-actions">
        <Button
          className="button-ok"
          variant="contained"
          color="info"
          onClick={handleClose}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
