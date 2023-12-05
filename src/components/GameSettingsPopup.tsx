import { Button, Dialog, DialogTitle, DialogContent, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GameSettings } from "./GameSettings";

interface SettingsPopupProps {
  title: string;
  openPopup: boolean;
  handleClosePopup: () => void;
}
export const GameSettingsPopup = (props: SettingsPopupProps) => {
  return (
    <Dialog open={props.openPopup} maxWidth={false}>
      <DialogTitle>
        <Box display="flex">
          <Typography variant="h5" component="div" style={{ flexGrow: 1 }} color="info">
            {props.title}
          </Typography>
          <Button
            color="error"
            onClick={() => {
              props.handleClosePopup();
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <GameSettings handleClosePopup={props.handleClosePopup} />
      </DialogContent>
    </Dialog>
  );
};
