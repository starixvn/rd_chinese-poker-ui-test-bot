import { SuggestData } from "@/interfaces/SuggestData";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Radio,
  Typography,
} from "@mui/material";
import { SuggestSlot } from "./Slot";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface SuggestPopupProps {
  openPopup: boolean;
  handleClosePopup: (item: number) => void;
  handleChangeBot: (botAddr: string) => void;
  data: SuggestData[];
  botAddressList: string[];
  currentSuggestionBot: string;
  isSuggesting: boolean;
}
export const SuggestPopup = (props: SuggestPopupProps) => {
  const [selectedValue, setSelectedValue] = useState("0");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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

  const handleClose = (item: number) => {
    props.handleClosePopup(item);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeBot = (addr: string) => {
    handleCloseBotMenu();
    props.handleChangeBot(addr);
  };

  const handleCloseBotMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Dialog
      open={props.openPopup}
      maxWidth={"lg"}
      fullWidth
      className="suggest-popup"
      onClose={() => {
        props.handleClosePopup(-1);
      }}
    >
      <DialogTitle>
        <Box display="flex">
          <Typography variant="h6" alignSelf="center">
            Select bot:
          </Typography>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            size="large"
          >
            {props.isSuggesting ? "waiting..." : props.currentSuggestionBot}
          </Button>
          <Box style={{ flexGrow: 1 }}></Box>
          <Button
            color="error"
            onClick={() => {
              props.handleClosePopup(-1);
            }}
          >
            <CloseIcon />
          </Button>
        </Box>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseBotMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {props.botAddressList.map((addr, index) => (
            <MenuItem
              key={`${addr}_${index}`}
              onClick={() => handleChangeBot(addr)}
            >
              {addr}
            </MenuItem>
          ))}
        </Menu>
      </DialogTitle>
      <DialogContent>
        <div className="suggest-block">
          {props.data.map((slot, index) => (
            <div key={`suggest_${index}`} className="suggest-slot">
              <Radio
                {...controlProps(index.toString())}
                onClick={() => handleClose(index)}
              />
              <div className="suggest-card">
                <SuggestSlot cards={slot.segment_3} />
                <SuggestSlot cards={slot.segment_2} />
                <SuggestSlot cards={slot.segment_1} />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions className="suggest-actions"></DialogActions>
    </Dialog>
  );
};
