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
  console.log(props.data);

  //const frontHandType = new TypeChecker([...props.data[0].segment_3]).getType();
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
                <StaticSlot name="" cards={slot.segment_3} />
                <StaticSlot name="" cards={slot.segment_2} />
                <StaticSlot name="" cards={slot.segment_1} />
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
